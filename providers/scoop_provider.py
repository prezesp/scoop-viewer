""" Module to interact with scoop. """
from subprocess import Popen, PIPE
import logging

class ScoopNotInstalled(Exception):
    """ Exception thrown when scoop was not detected. """
    pass

class ScoopProvider:
    """ Module to interact with scoop. """

    def __init__(self, workdir):
        self.workdir = workdir
        process = Popen(['powershell.exe', 'scoop', '--version'],
                        stdin=PIPE, stdout=PIPE, stderr=PIPE)
        stdout, stderr = process.communicate()
        stdout = stdout.decode("utf-8")
        stderr = stderr.decode("utf-8")
        if stderr:
            raise ScoopNotInstalled('Scoop is not installed')
        try:
            self.version = stdout.split('\n')[1].split(' ')[0]
        except IndexError:
            logging.warning('Cannot read scoop version')
            self.version = 'unknown'

    def get_installed(self): # pylint: disable=R0201
        """ Get all installed app from scoop. """

        process = Popen(['powershell.exe', 'scoop', 'list'], stdin=PIPE, stdout=PIPE, stderr=PIPE)
        stdout, _ = process.communicate()
        stdout = stdout.decode("utf-8")
        #print (stdout)
        #print (type(stdout))
        return [a.strip().split(' ')[0] for a in stdout.split('\n')]

    def install(self, app): # pylint: disable=R0201
        """ Install app through scoop. """

        process = Popen(['powershell.exe', 'scoop', 'install', app],
                        stdin=PIPE, stdout=PIPE, stderr=PIPE)
        stdout, stderr = process.communicate()
        stdout = stdout.decode("utf-8")
        stderr = stderr.decode("utf-8")

        return {"stdout": stdout, "stderr": stderr, "returncode": process.returncode}

    def uninstall(self, app): # pylint: disable=R0201
        """ Uninstal app. """

        process = Popen(['powershell.exe', 'scoop', 'uninstall', app],
                        stdin=PIPE, stdout=PIPE, stderr=PIPE)
        stdout, stderr = process.communicate()
        stdout = stdout.decode("utf-8")
        stderr = stderr.decode("utf-8")

        return {"stdout": stdout, "stderr": stderr, "returncode": process.returncode}
