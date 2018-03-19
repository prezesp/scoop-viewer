from explorer import Explorer
from flask import request
import logging
import yaml


def get_apps(provider, q):
  config = yaml.load(open('config.yml'))
  ex = Explorer()
  #apps = ex.getApps('/Users/prezes/Projects/Python/wx/example-bucket', q);
  print (config['SCOOP_BUCKET'])
  apps = ex.getApps(config['SCOOP_BUCKET'], q);
  logging.info("apps: " + str(len(apps)))
  installed = provider.get_installed()
  print (installed)
  
  # check if already installed
  for app in apps:
    app['installed'] = app['name'] in installed

  return apps


def shutdown_server():
  func = request.environ.get('werkzeug.server.shutdown')
  if func is None:
    raise RuntimeError('Not running with the Werkzeug Server')
  func()
