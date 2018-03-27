""" Module dedicated for macOS. """
import logging
from objc import YES
from AppKit import NSBundle

def hack():
    """ Hack macOS browser to allow http connection. """
    bundle = NSBundle.mainBundle()
    info = bundle.localizedInfoDictionary() or bundle.infoDictionary()
    info['NSAppTransportSecurity'] = {'NSAllowsArbitraryLoads': YES}
    logging.debug("Your Macocracy has been hacked...")
