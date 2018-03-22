""" Module dedicated for macOS. """
from objc import YES
from AppKit import NSBundle

def hack():
    """ Hack macOS browser to allow http connection. """
    bundle = NSBundle.mainBundle()
    info = bundle.localizedInfoDictionary() or bundle.infoDictionary()
    info['NSAppTransportSecurity'] = {'NSAllowsArbitraryLoads': YES}
    print("Your Macocracy has been hacked...")
