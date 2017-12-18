
import {context} from '../src/client/context.js';
import GradedTask from '../src/client/classes/gradedtask.js';

describe('runKING tests on GradedTask', function () {

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('1. GradedTask constructor', () => { 
        let gt  = new GradedTask('prova','ss',50,null,null);
        expect(gt.addStudentMark).toBeDefined();
       
    });

});