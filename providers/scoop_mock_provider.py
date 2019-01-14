""" Module to interact with scoop. """
from subprocess import Popen, PIPE # nosec
import os

class ScoopMockProvider:
    """ Module to interact with scoop. """

    def __init__(self):
        self.version = 'unknown'

    def get_version(self):
        pass

    def __run_scoop(self, args, universal_newlines=False):
        workdir = os.path.dirname(os.path.realpath(__file__))
        return Popen(['python', os.path.join(workdir, 'mock', 'scoop.py')] + args,
                        stdin=PIPE, stdout=PIPE, stderr=PIPE,
                        universal_newlines=universal_newlines) # nosec

    def get_installed(self): # pylint: disable=R0201
        """ Get all installed app from scoop. """

        stdout, _ = self.__run_scoop(['list']).communicate()
        stdout = stdout.decode("utf-8")

        return [a.strip().split(' ')[0] for a in stdout.split('\n')]

    def install(self, app, file_size_wrapper): # pylint: disable=R0201
        """ Install app through scoop. """

        _, _ = self.__run_scoop(['install', app]).communicate()

    def uninstall(self, app): # pylint: disable=R0201
        """ Uninstal app. """

        _, _ = self.__run_scoop(['uninstall', app]).communicate()
