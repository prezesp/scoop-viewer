""" Helpers function. """

import logging
import os
import platform
import re
import yaml
from flask import request
from explorer import Explorer
from providers import ScoopProvider, ScoopMockProvider

def expandvars(text):
    """ Standard expandvars extended by replacing macOS variables. """
    if platform.system() == "Darwin":
        text = re.sub(r'\%(.*?)\%', lambda m: os.environ[m.group().replace('%', '')], text)
    
    workdir = os.path.dirname(os.path.realpath(__file__))
    text = text.replace('%CD%', workdir)
    return os.path.expandvars(text)


def get_apps(provider, query):
    """ Get all apps from bucket. """

    workdir = os.path.dirname(os.path.realpath(__file__))
    with open(os.path.join(workdir, '..', 'config.yml')) as f:
        config = yaml.load(f)
    ex = Explorer()
    logging.info('Read bucket: %s', config['SCOOP_BUCKET'])
    apps = ex.get_apps(expandvars(config['SCOOP_BUCKET']), query)
    logging.info("Apps count = %d", len(apps))
    installed = provider.get_installed()

    # check if already installed
    for app in apps:
        app['installed'] = app['name'] in installed

    return apps

def get_provider(app_config):
    """ Return provider for current configuration. """
    if app_config['test']:
        return ScoopMockProvider()
    return ScoopProvider()

def shutdown_server():
    """ Shutdown server properly. """
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()
