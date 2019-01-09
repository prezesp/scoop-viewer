""" Module to interact with scoop. """
from subprocess import Popen, PIPE
import logging
import os

class ScoopMockProvider:
    """ Module to interact with scoop. """

    def __init__(self):
        self.version = 'unknown'

    def get_version(self):
        pass

    def get_installed(self): # pylint: disable=R0201
        """ Get all installed app from scoop. """
        workdir = os.path.dirname(os.path.realpath(__file__))
        process = Popen(['python', os.path.join(workdir, 'mock', 'scoop.py'), 'list'], 
                        stdin=PIPE, stdout=PIPE, stderr=PIPE)
        stdout, _ = process.communicate()
        stdout = stdout.decode("utf-8")

        return [a.strip().split(' ')[0] for a in stdout.split('\n')]

    def install(self, app, file_size_wrapper): # pylint: disable=R0201
        """ Install app through scoop. """
        workdir = os.path.dirname(os.path.realpath(__file__))
        
        process = Popen(['python', os.path.join(workdir, 'mock', 'scoop.py'), 'install', app],
                        stdin=PIPE, stdout=PIPE, stderr=PIPE)
        _, _ = process.communicate()

    def uninstall(self, app): # pylint: disable=R0201
        """ Uninstal app. """
        workdir = os.path.dirname(os.path.realpath(__file__))

        process = Popen(['python', os.path.join(workdir, 'mock', 'scoop.py'), 'uninstall', app],
                        stdin=PIPE, stdout=PIPE, stderr=PIPE)
        _, _ = process.communicate()
