import { BeforeAll, AfterAll, setWorldConstructor } from 'cucumber';
const fs                   = require('fs');
const createTestCafe = require('testcafe');
import testControllerHolder from '../support/testControllerHolder';

var testcafe = null;
var DELAY    = 5000;
function createTestFile () {
    fs.writeFileSync('test.js',
        'import testControllerHolder from "./features/support/testControllerHolder";\n\n' +

        'fixture("fixture")\n' +

        'test("test", testControllerHolder.capture);');
}

function runTest () {
    var runner = null;

    createTestCafe('localhost', 1337, 1338)
        .then(function (tc) {
            testcafe = tc;
            runner   = tc.createRunner();

            return runner
                .src('./test.js')
                .browsers('chrome')
                .run()
                .catch(function (error) {
                    console.log(error);
                });
        })
        .then(function (report) {
            console.log(report);
        });
}

function CustomWorld () {
    this.waitForTestController = testControllerHolder.get;
}

setWorldConstructor(CustomWorld);

BeforeAll(function (callback) {
    createTestFile();
    runTest();
    setTimeout(callback, DELAY);
});

AfterAll(function (callback) {
    testControllerHolder.free();
    fs.unlinkSync('test.js');
    setTimeout(callback, DELAY);
});