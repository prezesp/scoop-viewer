""" App to browse scoop packages. """

import platform
import sys
import webbrowser
from threading import Thread

import requests
import wx
import wx.adv
import wx.html2
from webapp.routes import app

APP_NAME = 'scoop-viewer'
PORT = 5030
ROOT_URL = 'http://localhost:{}'.format(PORT)

class Viewer(wx.Frame): # pylint: disable=too-many-ancestors
    """ Gui window. """
    def __init__(self, *args, **kw):
        wx.Frame.__init__(self, *args, **kw)

        sizer = wx.BoxSizer(wx.VERTICAL)
        self.browser = wx.html2.WebView.New(self)
        self.browser.EnableContextMenu(False)
        self.browser.Bind(wx.html2.EVT_WEBVIEW_NEWWINDOW, Viewer.handle_new_window)

        sizer.Add(self.browser, 1, wx.EXPAND, 10)
        self.SetSizer(sizer)
        self.SetSize((1024, 700))
        self.Bind(wx.EVT_CLOSE, self.on_exit)
        self.Center()

        # start webapp
        self.webapp = FlaskThread(app)
        self.webapp.start()

    # pylint: disable=W0613
    def on_exit(self, event):
        """ Close webapp server and the whole app. """
        # Close server
        if hasattr(self, 'webapp'):
            requests.get(ROOT_URL + '/shutdown')
            self.webapp = None

        # Close app
        sys.exit()

    @staticmethod
    def handle_new_window(event):
        """ Capture open in new window and send url to os default browser. """
        url = event.GetURL()
        webbrowser.open(url)


class FlaskThread(Thread):
    """ Flask server thread. """

    def __init__(self, application):
        Thread.__init__(self)
        self.application = application
        self.application.config['app_name'] = 'scoop-viewer'

    def __del__(self):
        pass

    def run(self):
        #self.application.debug = True
        self.application.run(port=PORT, threaded=True)


def run():
    """ Start app. """
    wx_app = wx.App()

    bitmap = wx.Bitmap('res/splash.png', wx.BITMAP_TYPE_PNG)
    wx.adv.SplashScreen(bitmap, wx.adv.SPLASH_CENTRE_ON_SCREEN | wx.adv.SPLASH_TIMEOUT,
                        2500, None, -1, wx.DefaultPosition, wx.DefaultSize,
                        wx.BORDER_SIMPLE | wx.STAY_ON_TOP)
    wx.Yield()

    viewer = Viewer(None, title="scoop-viewer")
    viewer.browser.LoadURL(ROOT_URL)
    viewer.Show()

    wx_app.MainLoop()

if __name__ == '__main__':

    if platform.system() == "Darwin":
        from darwin_http import hack
        hack()
    elif platform.system() == "Windows":
        from windows_reg import run_as_ie11
        run_as_ie11()

    # start app
    run()
