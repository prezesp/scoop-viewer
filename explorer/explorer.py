""" Module to explore buckets. """

import json
import os

class Explorer():
    """ Module to explore buckets. """

    def parse_json(self, file): # pylint: disable=R0201
        """ Parse json with app configuration for scoop. """
        app = dict()
        with open(file) as app_config:
            app['name'] = os.path.basename(file).replace('.json', '')
            data = json.load(app_config, strict=False)
            app['description'] = data['description'] if 'description' in data else ''
            app['homepage'] = data['homepage'] if 'homepage' in data else ''

        return app

    def get_apps(self, directory, pattern=None):
        """ Get all app from bucket directory. """
        apps = []
        for file in os.listdir(directory):
            if file.endswith(".json") and ((pattern and pattern in file) or not pattern):
                apps.append(self.parse_json(os.path.join(directory, file)))

        return apps

    def get_buckets(self, directory):
        """ Get all scoop buckets. """
        buckets = []
        if os.path.exists(directory):
            for file in os.listdir(directory):
                if os.path.isdir(os.path.join(directory, file)):
                    buckets.append(file)
        
        return buckets


