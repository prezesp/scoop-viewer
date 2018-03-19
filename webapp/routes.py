import os
import sys
from flask import Flask, render_template, request
from providers import ScoopProvider
from .utils import get_apps, shutdown_server

if getattr(sys, 'frozen', False):
  template_folder = os.path.join(sys._MEIPASS, 'templates')
  app = Flask(__name__, template_folder=template_folder)
else:
  app = Flask(__name__)

@app.route('/shutdown')
def shutdown():
  shutdown_server()
  return 'Server shutting down...'


@app.route('/')
def index():
  provider = ScoopProvider(os.path.dirname(os.path.realpath(__file__)))
  return render_template('index.html', apps=get_apps(provider, None))


@app.route('/search/')
def search():
  provider = ScoopProvider(os.path.dirname(os.path.realpath(__file__)))
  q = request.args.get('q', default = '*', type = str)
  return render_template('index.html', apps=get_apps(provider, q), q=q)  


@app.route('/app/<app_name>/install')
def install(app_name):
  provider = ScoopProvider(os.path.dirname(os.path.realpath(__file__)))
  provider.install(app_name)
  return "OK"


@app.route('/app/<app_name>/uninstall')
def uninstall(app_name):
  provider = ScoopProvider(os.path.dirname(os.path.realpath(__file__)))
  provider.uninstall(app_name)
  return "OK"
