import os
import platform
import requests
import sys
import webbrowser
import wx 
import wx.html2 
from threading import Thread

PORT = 5030
ROOT_URL = 'http://localhost:{}'.format(PORT)

class Viewer(wx.Frame): 
  def __init__(self, *args, **kw): 
    wx.Frame.__init__(self, *args, **kw)

    sizer = wx.BoxSizer(wx.VERTICAL) 
    self.browser = wx.html2.WebView.New(self) 
    self.browser.EnableContextMenu(False)
    self.browser.Bind(wx.html2.EVT_WEBVIEW_NEWWINDOW, self.onNewWindow)

    sizer.Add(self.browser, 1, wx.EXPAND, 10) 
    self.SetSizer(sizer) 
    self.SetSize((1024, 700)) 
    self.Bind(wx.EVT_CLOSE, self.OnExit)

  def OnExit(self, event):
    # Close server
    if hasattr(self, 'webapp'):
      r = requests.get(ROOT_URL + '/shutdown')
      self.webapp = None

    # Close app
    quit()
    
  def onNewWindow(self, event):
    print ("onNewWindow called")
    url = event.GetURL()
    print (url)
    webbrowser.open(url)


class FlaskThread(Thread):
  ''' Flask server thread '''

  def __init__(self, application):
    Thread.__init__(self)
    self.application = application
    self.application.config['app_name'] = 'scoop viewer'

  def __del__(self):
    pass

  def run(self):
    #self.application.debug = True
    self.application.run(port=PORT)



if __name__ == '__main__': 
  
  if platform.system() == "Darwin":
    from darwin_http import hack
    hack()
  elif platform.system() == "Windows":
    from windows_reg import runAsIE11
    runAsIE11()

  # start webapp
  from webapp.routes import app
  webapp = FlaskThread(app)
  webapp.start()

  # start viewer
  app = wx.App() 
  viewer = Viewer(None, -1) 
  viewer.browser.LoadURL(ROOT_URL)
  viewer.webapp = webapp;
  viewer.Show() 
  app.MainLoop() 
