""" Module dedicated for macOS. """
import os
import wx
import wx.adv

def splash_screen():
    """ Show splash screen """

    workdir = os.path.dirname(os.path.realpath(__file__))

    bitmap = wx.Bitmap(os.path.join(workdir, 'res/splash.png'), wx.BITMAP_TYPE_PNG)
    wx.adv.SplashScreen(bitmap, wx.adv.SPLASH_CENTRE_ON_SCREEN | wx.adv.SPLASH_TIMEOUT,
                        2500, None, -1, wx.DefaultPosition, wx.DefaultSize,
                        wx.BORDER_SIMPLE | wx.STAY_ON_TOP)
    wx.Yield()
