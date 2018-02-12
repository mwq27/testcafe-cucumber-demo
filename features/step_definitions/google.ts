import { Given, When, Then } from 'cucumber';
var Selector       = require('testcafe').Selector;
const testControllerHolder = require('../support/testControllerHolder');

var testController = null;

Given('I am open Google\'s search page', function () {
    console.log('this', this)
    return this.waitForTestController()
        .then(function (tc) {
            testController = tc;

            return testController.navigateTo('http://google.com');
        });
});

When('I am typing my search request {string} on Google', function (text) {
    var input = Selector('#lst-ib').with({ boundTestRun: testController });

    return testController.typeText(input, text);
});

Then('I am pressing {string} key on Google', function (text) {
    return testController.pressKey(text);
});

Then('I should see that the first Google\'s result is {string}', function (text) {
    var firstLink = Selector('#rso').find('a').with({ boundTestRun: testController });

    return testController.expect(firstLink.innerText).contains(text);
});