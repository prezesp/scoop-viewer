""" Server module with defined routes. """

import json
import os
import sys
import yaml
from flask import Flask, render_template, request, Response, jsonify, abort
from flask_executor import Executor
from providers import ScoopNotInstalled
from webapp.utils import get_apps, shutdown_server, get_provider, get_buckets, MAIN_BUCKET
from webapp.controllers.settings import settings_routes

# Hack for pyinstaller
# pylint: disable=E1101, W0212, C0103, W0612
def create_app(config_name):
    if getattr(sys, 'frozen', False):
        template_folder = os.path.join(sys.executable, '..', 'templates')
        static_folder = os.path.join(sys.executable, '..', 'static')
        app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)
    else:
        app = Flask(__name__)

    app.config['EXECUTOR_TYPE'] = 'thread'

    app.current_task = None
    app.current_task_size_wrapper = [None]

    executor = Executor(app)

    # settings depending on config
    if config_name == 'testing':
        app.config['test'] = True
        config_path = 'tests/config.yml'
    else:
        config_path = 'config.yml'

    # read config file
    workdir = os.path.dirname(os.path.realpath(__file__))
    with open(os.path.join(workdir, '..', config_path)) as f:
        config = yaml.safe_load(f)

    app.config['bucket'] = config['SCOOP_BUCKET']
    app.config['extra_buckets'] = config['EXTRA_BUCKETS']

    app.register_blueprint(settings_routes)

    @app.route('/shutdown')
    def shutdown():
        """ Shutdown server. """
        shutdown_server()
        return 'Server shutting down...'


    @app.route('/')
    def index():
        """ List all available app. """
        try:
            # check scoop only on index
            provider = get_provider(app.config)
            provider.get_version()
            return render_template('index.html')
        except ScoopNotInstalled:
            return render_template('no-scoop.html')

    @app.route('/buckets/')
    def buckets():
        buckets = get_buckets(app.config['bucket'], [app.config['extra_buckets']])
        return Response(json.dumps(buckets), mimetype='application/json')

    @app.route('/bucket/<name>/', methods=['GET'])
    def get_bucket(name):
        buckets = get_buckets(app.config['bucket'], [app.config['extra_buckets']])

        if not any(name in b['name'] for b in buckets):
            name = buckets[0]['name']

        provider = get_provider(app.config)
        # fix main bucket
        bucket = app.config['bucket'] if name == MAIN_BUCKET else os.path.join(app.config['extra_buckets'], name)
        apps = get_apps(provider, bucket, None)
        return Response(json.dumps(apps), mimetype='application/json')

    @app.route('/bucket', methods=['POST'])
    def add_bucket():
        name, url = request.get_json()['name'], request.get_json()['url']
        provider = get_provider(app.config)
        if provider.add_bucket(name, url):
            return "OK"
        abort(404)

    @app.route('/search2/')
    def search2():
        """ Search for an app. """
        provider = get_provider(app.config)
        query = request.args.get('q', default='*', type=str)
        return render_template('index.html', apps=get_apps(provider, app.config['bucket'], query), q=query)
    
    @app.route('/search/<query>')
    def search(query):
        """ Search for an app. """
        provider = get_provider(app.config)
        #query = request.args.get('q', default='*', type=str)

        apps = []
        buckets = get_buckets(app.config['bucket'], [app.config['extra_buckets']])
        for bucket in buckets:
            bucket_dir = app.config['bucket'] if bucket['name'] == MAIN_BUCKET else os.path.join(app.config['extra_buckets'], bucket['name'])
            apps.extend(get_apps(provider, bucket_dir, query))
        
        return Response(json.dumps(apps), mimetype='application/json')
        #return render_template('index.html', apps=get_apps(provider, app.config['bucket'], query), q=query)

    @app.route('/app/<app_name>/install')
    def install(app_name):
        """ Install app. """

        provider = get_provider(app.config)
        app.current_task = executor.submit(provider.install, app_name, app.current_task_size_wrapper)
        return "OK"

    @app.route('/app/<app_name>/get_status')
    def get_result(app_name):

        if app.current_task != None:
            if app.current_task.running():
                size = app.current_task_size_wrapper[0]
                if size != None:
                    return jsonify({'status': 'running', 'size_in_mb': size})
                return jsonify({'status': 'running'})

        return jsonify({'status': 'done'})

    @app.route('/app/<app_name>/uninstall')
    def uninstall(app_name):
        """ Uninstall app. """
        provider = get_provider(app.config)
        provider.uninstall(app_name)
        return "OK"

    return app
