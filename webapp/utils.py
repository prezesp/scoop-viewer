""" Helpers function. """

import logging
import yaml
from flask import request
from explorer import Explorer


def get_apps(provider, query):
    """ Get all apps from bucket. """

    config = yaml.load(open('config.yml'))
    ex = Explorer()
    logging.info('Read bucket: %s', config['SCOOP_BUCKET'])
    apps = ex.get_apps(config['SCOOP_BUCKET'], query)
    logging.info("Apps count = %d", len(apps))
    installed = provider.get_installed()

    # check if already installed
    for app in apps:
        app['installed'] = app['name'] in installed

    return apps


def shutdown_server():
    """ Shutdown server properly. """
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()
