import json
import os
import sys


class Explorer():
  def parseJson(self, file):
    app = dict()
    with open(file) as f:
      app['name'] = os.path.basename(file).replace('.json', '')
      #try:
      data = json.load(f, strict=False)
      app['description'] = data['description'] if 'description' in data else ''
      app['homepage'] = data['homepage'] if 'homepage' in data else ''
      #except :
      #  print (app['name'])
      #  print (sys.exc_info()[0])

    return app

  def getApps(self, directory, pattern = None):
    apps = []
    for file in os.listdir(directory):
      if file.endswith(".json") and ((pattern and pattern in file) or not pattern):
        apps.append(self.parseJson(os.path.join(directory, file)))
      
    return apps
