
import {context} from '../src/client/context.js';
import Person from '../src/client/classes/person.js';
import AttitudeTask from '../src/client/classes/attitudetask.js';

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
    it('2. Test Person constructor behaves properly', () => {         
        let person1= new Person('test','surnames',[]);

        expect(person1.name).toEqual('test');
        expect(person1.id).toEqual(-958521974);
        expect(person1.getId()).toEqual(-958521974);

        let person2= new Person('test2','surnames',[],9841984);
        expect(person2.name).toEqual('test2');
        expect(person2.id).toEqual(9841984);
        expect(person2.getId()).toEqual(9841984);

        //Spy on getTemplateRanking but we don't want to execute the real getTemplateRanking
        spyOn(context, "getTemplateRanking");
        expect(context.students.size).not.toBeGreaterThan(0);
        context.addStudent(person1); 
        //It is expected getTemplate Ranking have been called after adding an student
        expect(context.getTemplateRanking).toHaveBeenCalled();               
        //The map in context where we store students increases size
        expect(context.students.size).toBeGreaterThan(0);        
    });
    it('3. Test Person getXPpoints works properly', () => {         
        let person1= new Person('test','surnames',[]);
        spyOn(context, "notify");
        let atExample = new AttitudeTask('prova','test',10);
        let atExample2 = new AttitudeTask('prova2','test2',-20);
        let atExample3 = new AttitudeTask('prova3','test3',100);
        let atExample4 = new AttitudeTask('prova4','test4',100);
        expect(person1.getXPtotalPoints()).toEqual(0);
        context.attitudeTasks.set(atExample.id,atExample);
        context.attitudeTasks.set(atExample2.id,atExample2);
        context.attitudeTasks.set(atExample3.id,atExample3);
        person1.addAttitudeTask(atExample.id);
        expect(person1.getXPtotalPoints()).toEqual(10);
        person1.addAttitudeTask(atExample2.id);
        expect(person1.getXPtotalPoints()).toEqual(-10);
        person1.addAttitudeTask(atExample3.id);
        expect(person1.getXPtotalPoints()).toEqual(90);
        person1.addAttitudeTask(atExample4.id);
        expect(person1.getXPtotalPoints()).toEqual(90);
    });
});