'use strict';

const {remote} = require('webdriverio');
const {
    ClassicRunner,
    Eyes,
    Target,
    Configuration,
    RectangleSize,
    BatchInfo
} = require('@applitools/eyes-webdriverio');


let browser;
let eyes;

describe('wdio5', function () {


    beforeEach(async () => {
        // Use chrome browser
        const chrome = {
            capabilities: {
                browserName: 'chrome'
            },
            logLevel: 'silent',
            hostname: (process.env.CI === 'true') ? 'selenium' : '127.0.0.1'
        };
        // Use Chrome browser
        browser = await remote(chrome);

        // Initialize the Runner for your test.
        const runner = new ClassicRunner();

        // Initialize the eyes SDK
        eyes = new Eyes(runner);

        // Initialize the eyes configuration
        const configuration = new Configuration();

        // Set new batch
        configuration.setBatch(new BatchInfo('Demo batch'))

        // Set the configuration to eyes
        eyes.setConfiguration(configuration);
    });


    it('Classic Runner Test', async () => {

        // Start the test by setting AUT's name, test name and viewport size (width X height)
        await eyes.open(browser, 'Demo App - Wdio 5', 'Smoke Test', new RectangleSize(800, 600));

        // Navigate the browser to the "ACME" demo app.
        await browser.url('https://demo.applitools.com');

        // To see visual bugs after the first run, use the commented line below instead.
        // await driver.url("https://demo.applitools.com/index_v2.html");

        // Visual checkpoint #1.
        await eyes.check('Login Window', Target.window().fully());

        // Click the "Log in" button.
        const loginButton = await browser.$('#log-in');
        await loginButton.click();

        // Visual checkpoint #2.
        await eyes.check('App Window', Target.window().fully());

        // End the test
        await eyes.close(false);
    });

    afterEach(async () => {
        // Close the browser
        await browser.deleteSession();

        // If the test was aborted before eyes.close was called, ends the test as aborted.
        await eyes.abort();

        // Wait and collect all test results
        const results = await eyes.getRunner().getAllTestResults();
        console.log(results);
        console.log(results.getAllResults());
    });

});
