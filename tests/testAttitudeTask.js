
import AttitudeTask from '../src/client/classes/attitudetask.js';
import Person from '../src/client/classes/person.js';
import {events} from '../src/client/lib/eventsPubSubs.js';

describe('runKING tests on AttitudeTasks', function () {

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('1. AttitudeTask constructor works', () => { 
        let atExample = new AttitudeTask('prova','test',10);
        expect(atExample.points).toEqual(10);       
        
    });
    it('2. Test Person constructor behaves properly', () => {         
        let person1= new Person('test','surnames',[]);
        AttitudeTask.addXP(person1);
        /*expect(person1.name).toEqual('test');
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
        expect(context.students.size).toBeGreaterThan(0);      */  
    });
    /*
    it('3. Test Person getXPpoints works properly', () => {         
        let person1= new Person('test','surnames',[]);
        
        let atExample = new AttitudeTask('prova','test',10);
        let atExample2 = new AttitudeTask('prova2','test2',-20);
        let atExample3 = new AttitudeTask('prova3','test3',100);
        let atExample4 = new AttitudeTask('prova4','test4',100);
        let mapa = new Map([[atExample.id,atExample],[atExample2.id,atExample2],[atExample3.id,atExample3],[atExample4.id,atExample4]]);
        events.publish('dataservice/getAttitudeTasks',mapa);
        spyOn(events, "publish");
        expect(person1.getXPtotalPoints()).toEqual(0);
        person1.addAttitudeTask(atExample);
        expect(person1.getXPtotalPoints()).toEqual(10);
        person1.addAttitudeTask(atExample2);
        expect(person1.getXPtotalPoints()).toEqual(-10);
        person1.addAttitudeTask(atExample3);
        expect(person1.getXPtotalPoints()).toEqual(90);
        person1.addAttitudeTask(atExample4);
        expect(person1.getXPtotalPoints()).toEqual(190)
    });*/
});