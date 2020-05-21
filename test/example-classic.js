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


    before(async () => {
        // Use chrome browser
        const chrome = {
            capabilities: {
                browserName: 'chrome'
            },
            logLevel: 'silent',
        };
        // Use Chrome browser
        browser = await remote(chrome);

        // Initialize the Runner for your test.
        const runner = new ClassicRunner();

        // Initialize the eyes SDK
        eyes = new Eyes(runner);

        // Initialize the eyes configuration
        const configuration = new Configuration();

        // Add this configuration if your tested page includes fixed elements.
        //configuration.setStitchMode(StitchMode.CSS);

        // You can get your api key from the Applitools dashboard
        configuration.setApiKey('APPLITOOLS_API_KEY')

        // Set new batch
        configuration.setBatch(new BatchInfo('Demo batch'))

        // Set the configuration to eyes
        eyes.setConfiguration(configuration);
    });


    it('Classic Runner Test', async () => {

        // Set AUT's name, test name and viewport size (width X height)
        // We have set it to 800 x 600 to accommodate various screens. Feel free to
        // change it.
        await eyes.open(browser, 'Demo App', 'Smoke Test', new RectangleSize(800, 600));

        // Navigate the browser to the "ACME" demo app.
        await browser.url('https://demo.applitools.com');

        // To see visual bugs after the first run, use the commented line below instead.
        // await driver.url("https://demo.applitools.com/index_v2.html");

        // Visual checkpoint #1 - Check the login page. using the fluent API
        // https://applitools.com/docs/topics/sdk/the-eyes-sdk-check-fluent-api.html?Highlight=fluent%20api
        await eyes.check('Login Window', Target.window().fully());

        // This will create a test with two test steps.
        const loginButton = await browser.$('#log-in');
        await loginButton.click();

        // Visual checkpoint #2 - Check the app page.
        await eyes.check('App Window', Target.window().fully());

        // End the test.
        await eyes.closeAsync();
    });

    after(async () => {
        // Close the browser
        await browser.deleteSession();

        // If the test was aborted before eyes.close was called, ends the test as aborted.
        await eyes.abortAsync();

        // Wait and collect all test results
        // we pass false to this method to suppress the exception that is thrown if we
        // find visual differences
        const results = await eyes.getRunner().getAllTestResults(false);
        // Print results
        console.log(results);
    });

});
