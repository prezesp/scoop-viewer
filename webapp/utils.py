""" Helpers function. """

import logging
import os
import platform
import re
from flask import request
from explorer import Explorer
from providers import ScoopProvider, ScoopMockProvider
from core.config import Config

MAIN_BUCKET = "Main-bucket"

def expandvars(text):
    """ Standard expandvars extended by replacing macOS variables. """
    special_vars_mapping = {
        '%CD%': lambda: os.path.dirname(os.path.realpath(__file__)),
        '%SCOOP%': lambda: '%USERPROFILE%\scoop' if 'SCOOP' not in os.environ else '%SCOOP%'
    }

    if platform.system() == "Darwin":
        text = re.sub(r'\%(.*?)\%', lambda m: os.environ[m.group().replace('%', '')], text)

    pattern = re.compile('|'.join(special_vars_mapping.keys()))
    text = pattern.sub(lambda x: special_vars_mapping[x.group()](), text)

    return os.path.expandvars(text)


def get_apps(provider, bucket_path, query, only_installed=False):
    """ Get all apps from bucket. """
    explorer = Explorer()
    logging.info('Read bucket: %s', bucket_path)
    apps = explorer.get_apps(expandvars(bucket_path), query)
    logging.info("Apps count = %d", len(apps))
    installed = explorer.get_installed(os.path.join(expandvars('%SCOOP%'), 'apps'))

    # check if already installed
    for app in apps:
        app['installed'] = app['name'] in installed

    if only_installed:
        apps = [app for app in apps if app['installed']]

    if Config().get('INSTALLED_ON_TOP') == 'true':
        apps.sort(key=lambda app: app['installed'], reverse=True)

    return apps

def get_buckets(builtin_bucket, paths):
    """ Get all buckets. """
    ex = Explorer()
    buckets = []

    # scoop master bucket for legacy versions
    if os.path.exists(expandvars(builtin_bucket)):
        buckets.append({ 'name': MAIN_BUCKET})

    for path in paths:
        for bucket in ex.get_buckets(expandvars(path)):
            buckets.append({ 'name': bucket })

    return buckets

def get_provider(app_config):
    """ Return provider for current configuration. """
    if 'test' in app_config and app_config['test']:
        return ScoopMockProvider()
    return ScoopProvider()

def shutdown_server():
    """ Shutdown server properly. """
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()
