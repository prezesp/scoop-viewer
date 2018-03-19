from objc import YES
from AppKit import NSBundle

def hack():
  bundle = NSBundle.mainBundle()
  info = bundle.localizedInfoDictionary() or bundle.infoDictionary()
  info['NSAppTransportSecurity'] = {'NSAllowsArbitraryLoads': YES}
  print ("Your Democracy has been hacked...")
