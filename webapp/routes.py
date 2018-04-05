""" Server module with defined routes. """

import os
import sys
import yaml
from flask import Flask, render_template, request
from providers import ScoopProvider, ScoopNotInstalled, ScoopMockProvider
from webapp.utils import get_apps, shutdown_server, get_provider

# Hack for pyinstaller
# pylint: disable=E1101, W0212, C0103
def create_app(config_name):
    if getattr(sys, 'frozen', False):
        template_folder = os.path.join(sys.executable, '..', 'templates')
        static_folder = os.path.join(sys.executable, '..', 'static')
        app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)
    else:
        app = Flask(__name__)
    
    # settings depending on config
    if config_name == 'testing':
        app.config['test'] = True
        config_path = 'tests/config.yml'
    else:
        config_path = 'config.yml'
        
    # read config file
    workdir = os.path.dirname(os.path.realpath(__file__))
    with open(os.path.join(workdir, '..', config_path)) as f:
        config = yaml.load(f)

    app.config['bucket'] = config['SCOOP_BUCKET']


    @app.route('/shutdown')
    def shutdown():
        """ Shutdown server. """
        shutdown_server()
        return 'Server shutting down...'


    @app.route('/')
    def index():
        """ List all available app. """
        try:
            provider = get_provider(app.config)
            return render_template('index.html', apps=get_apps(provider, app.config['bucket'], None))
        except ScoopNotInstalled:
            return render_template('no-scoop.html')


    @app.route('/search/')
    def search():
        """ Search for an app. """
        provider = get_provider(app.config)
        query = request.args.get('q', default='*', type=str)
        return render_template('index.html', apps=get_apps(provider, app.config['bucket'], query), q=query)


    @app.route('/app/<app_name>/install')
    def install(app_name):
        """ Install app. """
        provider = get_provider(app.config)
        provider.install(app_name)
        return "OK"


    @app.route('/app/<app_name>/uninstall')
    def uninstall(app_name):
        """ Uninstall app. """
        provider = get_provider(app.config)
        provider.uninstall(app_name)
        return "OK"
    
    return app

