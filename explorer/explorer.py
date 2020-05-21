""" Module to explore buckets. """

import logging
import json
import os

class Explorer():
    """ Module to explore buckets. """

    def parse_json(self, file): # pylint: disable=R0201
        """ Parse json with app configuration for scoop. """
        app = dict()
        with open(file, encoding='utf8') as app_config:
            try:
                app['name'] = os.path.basename(file).replace('.json', '')
                data = json.load(app_config, strict=False)
                app['description'] = data['description'] if 'description' in data else ''
                app['homepage'] = data['homepage'] if 'homepage' in data else ''
            except Exception:
                logging.warning('Cannot read file %s' % file, exc_info=True)
                app = dict()

        return app

    def get_apps(self, directory, pattern=None):
        """ Get all app from bucket directory. """
        apps = []

        def browse(dir, pattern, parsefunction):
            for file in os.listdir(dir):
                if file.endswith(".json") and ((pattern and pattern in file) or not pattern):
                    app_dict = parsefunction(os.path.join(dir, file))
                    if len(app_dict) > 0:
                        apps.append(app_dict)

        browse(directory, pattern, self.parse_json)

        bucket_dir = os.path.join(directory, 'bucket')
        if os.path.exists(bucket_dir):
            browse(bucket_dir, pattern, self.parse_json)

        return apps

    def get_installed(self, directory):
        if not os.path.exists(directory):
            return []
        return [f.name for f in os.scandir(directory) if f.is_dir()]

    def get_buckets(self, directory):
        """ Get all scoop buckets. """
        buckets = []
        if os.path.exists(directory):
            for file in os.listdir(directory):
                if os.path.isdir(os.path.join(directory, file)):
                    buckets.append(file)

        return buckets
