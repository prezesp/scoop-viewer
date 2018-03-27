""" Module to modify windows registry. """
import winreg as wreg
import logging

def run_as_ie11():
    """ Change webbrowser to act like IE11. """

    logging.debug("Windows webbrowser act like IE11")

    current_file = __file__
    if ".pyc" in current_file:
        value = "scoop-viewer.exe"
    else:
        value = "python.exe"

    key = wreg.CreateKey(wreg.HKEY_CURRENT_USER,
                         "Software\\Microsoft\\Internet Explorer"
                         "\\Main\\FeatureControl\\FEATURE_BROWSER_EMULATION")
    wreg.SetValueEx(key, value, 0, wreg.REG_DWORD, 11001)
