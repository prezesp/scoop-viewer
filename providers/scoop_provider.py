""" Module to interact with scoop. """
from subprocess import Popen, PIPE
import logging
import re
import sys
import time

class ScoopNotInstalled(Exception):
    """ Exception thrown when scoop was not detected. """
    pass

class ScoopProvider:
    """ Module to interact with scoop. """

    def __init__(self):
        pass
        
    def get_version(self):
        process = Popen(['powershell.exe', 'scoop', '--help'],
                        stdin=PIPE, stdout=PIPE, stderr=PIPE)
        # cannot depend on scoop --version (works only when scoop is a git repository)
        stdout, stderr = process.communicate()
        stdout = stdout.decode("utf-8")
        stderr = stderr.decode("utf-8")
        if stderr:
            raise ScoopNotInstalled('Scoop is not installed')
        try:
            process = Popen(['powershell.exe', 'scoop', '--version'],
                            stdin=PIPE, stdout=PIPE, stderr=PIPE)
            stdout, stderr = process.communicate()
            stdout = stdout.decode("utf-8")
            if not stderr:
                self.version = stdout.split('\n')[1].split(' ')[0]
        except IndexError:
            pass

        if not hasattr(self, "version"):
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

    def exec_cmd(self, cmd):
        process = Popen(cmd, stdin=PIPE, stdout=PIPE, stderr=PIPE, universal_newlines=True)

        for stdout_line in iter(process.stdout.readline, ""):
            yield stdout_line
        process.stdout.close()
        return_code = process.wait()
        # if return_code:
        #     raise subprocess.CalledProcessError(return_code, cmd)

    def install(self, app): # pylint: disable=R0201
        """ Install app through scoop. """

        for line in self.exec_cmd(['powershell.exe', 'scoop', 'install', app]):
            if line.startswith("Downloading"):
                p = re.compile('\(([0-9]+[.,][0-9]*) ([A-Z]+)')
                m = p.search(line)
                print(m.group(1))
                print(m.group(2))


    def uninstall(self, app): # pylint: disable=R0201
        """ Uninstal app. """

        process = Popen(['powershell.exe', 'scoop', 'uninstall', app],
                        stdin=PIPE, stdout=PIPE, stderr=PIPE)
        _, _ = process.communicate()
