import * as assert from 'assert';
import * as extension from "../extension";
import * as MC from "../MutateCommand";

test("Test implements activate function", function () {
    assert.strictEqual(typeof extension.activate, 'function');
});

test("Test select terminal return", function() {
    let terminalReturn = MC.selectTerminal();
    assert.strictEqual(typeof terminalReturn, 'object');
    assert.notStrictEqual(terminalReturn.then, undefined);
});
