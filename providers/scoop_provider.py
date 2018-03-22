""" Module to interact with scoop. """
from subprocess import Popen, PIPE

class ScoopProvider:
    """ Module to interact with scoop. """

    def __init__(self, workdir):
        self.workdir = workdir
        print(self.workdir)

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
        _, _ = process.communicate()

    def uninstall(self, app): # pylint: disable=R0201
        """ Uninstal app. """

        process = Popen(['powershell.exe', 'scoop', 'uninstall', app],
                        stdin=PIPE, stdout=PIPE, stderr=PIPE)
        _, _ = process.communicate()
