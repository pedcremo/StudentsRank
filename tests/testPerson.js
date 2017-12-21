

import Person from '../src/client/classes/person.js';
import {events} from '../src/client/lib/eventsPubSubs.js';
import AttitudeTask from '../src/client/classes/attitudetask.js';

describe('runKING tests on Person class', function () {
    let templateAddPerson = '';
    beforeEach(() => {
        //jasmine.getFixtures().fixturesPath = './';
        //let templateAddPerson = jasmine.getFixtures().read('templates/addStudent.html');
        //jasmine.Ajax.install();
        let fixture = '<div id="content"> </div>';
        document.body.insertAdjacentHTML(
            'afterbegin',
            fixture);
      
    });

    afterEach(function() {
        //jasmine.Ajax.uninstall();
    });

    it('1. Test Person constructor behaves properly', () => {         
        let person1= new Person('test','surnames',[]);

        expect(person1.name).toEqual('test');
        expect(person1.id).toEqual(-958521974);
        expect(person1.getId()).toEqual(-958521974);

        let person2= new Person('test2','surnames',[],9841984);
        expect(person2.name).toEqual('test2');
        expect(person2.id).toEqual(9841984);
        expect(person2.getId()).toEqual(9841984);

        //Spy on getTemplateRanking but we don't want to execute the real getTemplateRanking
        expect(Person.getStudentsSize()).not.toBeGreaterThan(0);
        Person.addStudent(person1); 
        //It is expected getTemplate Ranking have been called after adding an student
        //expect(context.getTemplateRanking).toHaveBeenCalled();               
        //The map in context where we store students increases size
        expect(Person.getStudentsSize()).toBeGreaterThan(0);        
    });
    it('2. Test Person addAttitudeTask works properly', () => {
        let person1 = new Person('test','surnames',[]);
        let atExample = new AttitudeTask('prova','test',10);
        spyOn(events,'publish');
        expect(person1.attitudeTasks.length).toEqual(0);
        person1.addAttitudeTask(atExample);
        expect(person1.attitudeTasks.length).toEqual(1);
        person1.addAttitudeTask(atExample);
        expect(person1.attitudeTasks.length).toEqual(2);
    });
    it('3. Test Person getXPpoints works properly', () => {
        let person1 = new Person('test','surnames',[]);
        let atTasks = '[[2000001,{"name":"AIC","description":"Correctly answer a question in class using English","datetime":"2017-12-18T20:48:05.375Z","id":"2000001","points":"20","hits":"0","type":"success"}],[2000002,{"name":"PSFC","description":"Present your solution in front of class","datetime":"2017-12-18T20:48:05.376Z","id":"2000002","points":"20","hits":"0","type":"success"}],[2000003,{"name":"Finish","description":"Finish a proposed task before class ends","datetime":"2017-12-18T20:47:04.015Z","id":"2000003","points":"100","hits":"0","type":"success"}],[2000004,{"name":"Insightful","description":"Asking insightful questions about the lesson","datetime":"2017-12-18T20:48:05.376Z","id":"2000004","points":"50","hits":"0","type":"success"}],[2000005,{"name":"Late","description":"Arriving late to class","datetime":"2017-12-18T20:48:05.376Z","id":"2000005","points":"-20","hits":"0","type":"danger"}],[2000006,{"name":"Not answer english","description":"Not answer in english when you have been asked in english","datetime":"2017-12-18T20:48:05.376Z","id":"2000006","points":"-30","hits":"0","type":"danger"}],[2000007,{"name":"Delayed HW","description":"Delayed homework delivery","datetime":"2017-12-18T20:48:05.376Z","id":"2000007","points":"-100","hits":"0","type":"danger"}],[-1237058281,{"name":"ttttt","description":"ttttt","datetime":"2017-12-18T20:27:47.281Z","id":-1237058281,"points":"20","hits":0,"type":"success"}],[-381138877,{"name":"garrero","description":"garrero","datetime":"2017-12-18T20:48:35.716Z","id":-381138877,"points":"20","hits":0,"type":"success"}]]';

        events.publish('dataservice/getAttitudeTasks',atTasks);
        spyOn(events,'publish');
        expect(person1.getXPtotalPoints()).toEqual(0);
        let atExample = AttitudeTask.getAttitudeById(2000001);//20
        let atExample2 = AttitudeTask.getAttitudeById(2000002);//20
        let atExample3 = AttitudeTask.getAttitudeById(2000003);//100
        
        person1.addAttitudeTask(atExample);
        expect(person1.getXPtotalPoints()).toEqual(20);
        person1.addAttitudeTask(atExample2);
        expect(person1.getXPtotalPoints()).toEqual(40);
        person1.addAttitudeTask(atExample3);
        expect(person1.getXPtotalPoints()).toEqual(140);
        //person1.addAttitudeTask(atExample4);
        //expect(person1.getXPtotalPoints()).toEqual(190)
    });
    it('4. Test Person getMaxXPmark works properly', () => {
        let person1 = new Person('test','surnames',[]);
        let person2 = new Person('test2','surnames2',[]);
        let atTasks = '[[2000001,{"name":"AIC","description":"Correctly answer a question in class using English","datetime":"2017-12-18T20:48:05.375Z","id":"2000001","points":"20","hits":"0","type":"success"}],[2000002,{"name":"PSFC","description":"Present your solution in front of class","datetime":"2017-12-18T20:48:05.376Z","id":"2000002","points":"20","hits":"0","type":"success"}],[2000003,{"name":"Finish","description":"Finish a proposed task before class ends","datetime":"2017-12-18T20:47:04.015Z","id":"2000003","points":"100","hits":"0","type":"success"}],[2000004,{"name":"Insightful","description":"Asking insightful questions about the lesson","datetime":"2017-12-18T20:48:05.376Z","id":"2000004","points":"50","hits":"0","type":"success"}],[2000005,{"name":"Late","description":"Arriving late to class","datetime":"2017-12-18T20:48:05.376Z","id":"2000005","points":"-20","hits":"0","type":"danger"}],[2000006,{"name":"Not answer english","description":"Not answer in english when you have been asked in english","datetime":"2017-12-18T20:48:05.376Z","id":"2000006","points":"-30","hits":"0","type":"danger"}],[2000007,{"name":"Delayed HW","description":"Delayed homework delivery","datetime":"2017-12-18T20:48:05.376Z","id":"2000007","points":"-100","hits":"0","type":"danger"}],[-1237058281,{"name":"ttttt","description":"ttttt","datetime":"2017-12-18T20:27:47.281Z","id":-1237058281,"points":"20","hits":0,"type":"success"}],[-381138877,{"name":"garrero","description":"garrero","datetime":"2017-12-18T20:48:35.716Z","id":-381138877,"points":"20","hits":0,"type":"success"}]]';
        
        events.publish('dataservice/getAttitudeTasks',atTasks);
        spyOn(events,'publish');
        expect(person1.getXPtotalPoints()).toEqual(0);
        let atExample = AttitudeTask.getAttitudeById(2000001);//20
        let atExample2 = AttitudeTask.getAttitudeById(2000002);//20
        let atExample3 = AttitudeTask.getAttitudeById(2000003);//100
                
        Person.addStudent(person1);
        Person.addStudent(person2);
        
        expect(Person.getMaxXPmark()).toEqual(0);
        person1.addAttitudeTask(atExample);
        expect(Person.getMaxXPmark()).toEqual(20);
        //person2.addAttitudeTask(atExample2);
        expect(person2.getXPtotalPoints()).toEqual(0);
        person2.addAttitudeTask(atExample3);        
        expect(person1.getXPtotalPoints()).toEqual(20);
        expect(person2.getXPtotalPoints()).toEqual(100);
        person2.addAttitudeTask(atExample2);
        expect(Person.getMaxXPmark()).toEqual(120);

    });
    it('5. Test Person deleteXP works properly', () => {
        let person1 = new Person('test','surnames',[]);
        let atTasks = '[[2000001,{"name":"AIC","description":"Correctly answer a question in class using English","datetime":"2017-12-18T20:48:05.375Z","id":"2000001","points":"20","hits":"0","type":"success"}],[2000002,{"name":"PSFC","description":"Present your solution in front of class","datetime":"2017-12-18T20:48:05.376Z","id":"2000002","points":"20","hits":"0","type":"success"}],[2000003,{"name":"Finish","description":"Finish a proposed task before class ends","datetime":"2017-12-18T20:47:04.015Z","id":"2000003","points":"100","hits":"0","type":"success"}],[2000004,{"name":"Insightful","description":"Asking insightful questions about the lesson","datetime":"2017-12-18T20:48:05.376Z","id":"2000004","points":"50","hits":"0","type":"success"}],[2000005,{"name":"Late","description":"Arriving late to class","datetime":"2017-12-18T20:48:05.376Z","id":"2000005","points":"-20","hits":"0","type":"danger"}],[2000006,{"name":"Not answer english","description":"Not answer in english when you have been asked in english","datetime":"2017-12-18T20:48:05.376Z","id":"2000006","points":"-30","hits":"0","type":"danger"}],[2000007,{"name":"Delayed HW","description":"Delayed homework delivery","datetime":"2017-12-18T20:48:05.376Z","id":"2000007","points":"-100","hits":"0","type":"danger"}],[-1237058281,{"name":"ttttt","description":"ttttt","datetime":"2017-12-18T20:27:47.281Z","id":-1237058281,"points":"20","hits":0,"type":"success"}],[-381138877,{"name":"garrero","description":"garrero","datetime":"2017-12-18T20:48:35.716Z","id":-381138877,"points":"20","hits":0,"type":"success"}]]';
        
        let atExample = AttitudeTask.getAttitudeById(2000001);
        
        events.publish('dataservice/getAttitudeTasks',atTasks);
        spyOn(events,'publish');
        person1.addAttitudeTask(atExample);
        expect(person1.getXPtotalPoints()).toEqual(20);
        person1.deleteXP(atExample.id);
        expect(person1.getXPtotalPoints()).toEqual(0);

    });
    it('6. Test Person getHTMLEdtit works properly', () => {
        let person1 = new Person('test','surnames',[]);        
        //console.log(templateAddPerson);
        /*jasmine.Ajax.stubRequest('templates/addStudent.html').andReturn({
            "status": 200, 
            "contentType": 'text/plain',
            "responseText": '<span id="#idFirstName">test</span>';
          });*/
        
        person1.getHTMLEdit();
        //expect($('#idFirstName').val()).toEqual('test');
        //$('#idFirstName')
    });
});