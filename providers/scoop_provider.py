from subprocess import Popen, PIPE

class ScoopProvider:
  def __init__(self, workdir):
    self.workdir = workdir
    print (self.workdir)

  def get_installed(self):
    p = Popen(['powershell.exe', 'scoop', 'list'], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    stdout, stderr = p.communicate()
    stdout = stdout.decode("utf-8") 
    #print (stdout)
    #print (type(stdout))
    return [a.strip().split(' ')[0] for a in stdout.split('\n')]

  def install(self, app):
    p = Popen(['powershell.exe', 'scoop', 'install', app], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    stdout, stderr = p.communicate()

  def uninstall(self, app):
    p = Popen(['powershell.exe', 'scoop', 'uninstall', app], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    stdout, stderr = p.communicate()