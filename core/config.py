import os
import yaml

class Config:
    def __init__(self):
        with open(Config.__get_config()) as f:
            self.config = yaml.safe_load(f)

    def get(self, key, default=None):
        return self.config.get(key, default)

    def save(self, key, value):
        self.config[key] = value
        self.__save()

    def __save(self):
        with open(Config.__get_config(), 'w') as f:
            yaml.dump(self.config, f, default_flow_style=False)

    @staticmethod
    def __get_config():
        workdir = os.path.dirname(os.path.realpath(__file__))
        return os.path.join(workdir, '..', 'config.yml')