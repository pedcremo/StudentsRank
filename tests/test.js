
import {context} from '../src/client/context.js';

describe('ES6 Foo', function () {

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('should return Do Something when calling doSomething', () => {
        expect(context.clear).toBeDefined();
    });
});