
import {context} from '../src/client/context.js';
import Person from '../src/client/classes/person.js';

describe('runKING tests using jasmine', function () {

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('1. context exists as a singleton', () => {         
        expect(context.clear).toBeDefined();        
        expect(context.isLogged).toBeDefined();        
        //expect(jasmine.Ajax.requests.mostRecent().url).toBe('/api/loggedin');
    });
    it('2. Create a new test person and test context behaviour', () => {         
        let person1= new Person('test','surnames',[]);

        expect(person1.name).toEqual('test');
        expect(person1.id).toEqual(-958521974);   
        //Spy on getTemplateRanking but we don't want to execute the real getTemplateRanking
        spyOn(context, "getTemplateRanking");
        expect(context.students.size).not.toBeGreaterThan(0);
        context.addStudent(person1); 
        //It is expected getTemplate Ranking have been called after adding an student
        expect(context.getTemplateRanking).toHaveBeenCalled();               
        //The map in context where we store students increases size
        expect(context.students.size).toBeGreaterThan(0);
        
    });
           
});