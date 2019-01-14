""" Module to interact with scoop. """
from subprocess import Popen, PIPE # nosec
import logging
import re

UNITS = {"B": 1, "KB": 10**3, "MB": 10**6, "GB": 10**9, "TB": 10**12}

def parse_size(line):
    """ Converts numeric value included in line to megabytes. """

    prog = re.compile('\(([0-9]+[.,][0-9]*) ([A-Z]+)')
    match = prog.search(line)
    number, unit = match.group(1), match.group(2).upper()
    if unit == 'MB':
        return number
    return int(float(number) * UNITS[unit]) * UNITS['MB']

class ScoopNotInstalled(Exception):
    """ Exception thrown when scoop was not detected. """
    pass

class ScoopProvider:
    """ Module to interact with scoop. """

    def __init__(self):
        import shutil
        self.powershell_path = shutil.which('powershell.exe')
        if self.powershell_path is None:
            raise Exception('Not found powershell.exe')

    def __run_scoop(self, args, universal_newlines=False):
        return Popen([self.powershell_path, 'scoop'] + args,
                        stdin=PIPE, stdout=PIPE, stderr=PIPE,
                        universal_newlines=universal_newlines) # nosec

    def get_version(self):
        # cannot depend on scoop --version (works only when scoop is a git repository)
        stdout, stderr = self.__run_scoop(['--help']).communicate()
        stdout = stdout.decode("utf-8")
        stderr = stderr.decode("utf-8")
        if stderr:
            raise ScoopNotInstalled('Scoop is not installed')
        try:
            stdout, stderr = self.__run_scoop(['--version']).communicate()
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

        stdout, _ = self.__run_scoop(['list']).communicate()
        stdout = stdout.decode("utf-8")
        return [a.strip().split(' ')[0] for a in stdout.split('\n')]

    def __exec_cmd(self, cmd):
        process = self.__run_scoop(cmd, True)

        for stdout_line in iter(process.stdout.readline, ""):
            yield stdout_line
        process.stdout.close()
        return_code = process.wait()
        # if return_code:
        #     raise subprocess.CalledProcessError(return_code, cmd)

    def install(self, app, file_size_wrapper): # pylint: disable=R0201
        """ Install app through scoop. """

        for line in self.__exec_cmd(['install', app]):
            if line.startswith("Downloading"):
                file_size_wrapper[0] = parse_size(line)
        file_size_wrapper[0] = None


    def uninstall(self, app): # pylint: disable=R0201
        """ Uninstal app. """

        _, _ = self.__run_scoop(['uninstall', app]).communicate()
