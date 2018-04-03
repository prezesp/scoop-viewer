import time
import unittest
import os
import logging
from urllib.request import urlopen

from flask_testing import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from webapp.routes import create_app


class TestBase(LiveServerTestCase):

    def create_app(self):
        logging.basicConfig(level=logging.ERROR)
        try:
            workdir = os.path.dirname(os.path.realpath(__file__))
            os.remove(os.path.join(workdir, '..', 'providers', 'mock', 'scoop-installed-apps.txt'))
        except OSError:
            pass    
        
        config_name = 'testing'
        app = create_app(config_name)
        app.config.update(
            # Change the port that the liveserver listens on
            LIVESERVER_PORT=8943
        )
        app.config['app_name'] = 'scoop-viewer'
        app.config['test'] = True

        return app

    def setUp(self):
        """Setup the test driver and create test users"""
        self.driver = webdriver.Firefox()#xecutable_path = './tests/geckodriver')
        self.driver.get(self.get_server_url())


    def tearDown(self):
        self.driver.quit()

    #def test_server_is_up_and_running(self):
    #    response = urlopen(self.get_server_url())
    #    self.assertEqual(response.code, 200)


class SimpleTests(TestBase):
    def test_search(self):
        driver = self.driver
        self.assertIn("Hello", driver.title)
        elem = driver.find_element_by_name("q")
        elem.clear()
        elem.send_keys("example-app-02")
        elem.send_keys(Keys.RETURN)
        time.sleep(2)
        assert "example-app-01" not in driver.page_source
        assert "example-app-02" in driver.page_source

    def test_install(self):
        driver = self.driver
        elem = driver.find_element_by_css_selector("body > div:nth-child(3) > div:nth-child(3) > div.col-sm-2.text-right > button")
        elem.click()
        time.sleep(2)
        assert "Installed" in driver.page_source


if __name__ == '__main__':
    unittest.main()