/**
 * Person class. We store personal information and attitudePoints that reflect daily classroom job
 *
 * @constructor
 * @param {string} name - Person name
 * @param {string} surname - Person surname
 * @param {array} attitudeTasks - Person awarded AttitudeTasks array   
 * @param {number} id - Person id default value null whwen created first time
 * @tutorial pointing-criteria
 */

import {formatDate,popupwindow,hashcode,loadTemplate} from './utils.js';
import {context} from './context.js';
import AttitudeTask from './attitudetask.js';
import GradedTask from './gradedtask.js';

const privateAddTotalPoints = Symbol('privateAddTotalPoints'); /** To accomplish private method */
const _totalPoints = Symbol('TOTAL_POINTS'); /** To acomplish private property */

class Person {
  constructor(name,surname,attitudeTasks,id=null) {
    this[_totalPoints] = 0;
    this.name = name;
    this.surname = surname;
    if (!id) {
      this.id = hashcode(this.name + this.surname);
    }else {
      this.id = id;
    }
    this.attitudeTasks = attitudeTasks;

    this.attitudeTasks.forEach(function (itemAT) {
      this[_totalPoints] += parseInt(itemAT['task'].points);
    }.bind(this));
  }

  /** Add points to person. we should use it carefully . */
  [privateAddTotalPoints] (points) {
    if (!isNaN(points)) {
      this[_totalPoints] += points;
      context.getTemplateRanking();
    }
  }

  /** Get person id  based on a 10 character hash composed by name+surname */
  getId() {
    return this.id;
  }

  /** Read person _totalPoints. A private property only modicable inside person instance */
  getTotalPoints() {
    return this[_totalPoints];
  }

  /** Add a Attitude task linked to person with its own mark. */
  addAttitudeTask(taskInstance) {
    this.attitudeTasks.push({'task':taskInstance});
    this[privateAddTotalPoints](parseInt(taskInstance.points));
    context.notify('Added ' + taskInstance.description + ' to ' + this.name + ',' + this.surname);
  }

  /** Renders HTML person table row (tr) with
   *  complete name, attitudePoints , add button and one input for 
   * every gradded task binded for that person. */
  getHTMLView(targetElement) {
    loadTemplate('templates/lineStudent.html',function(responseText) {
      let TPL_PERSON = this;
      //let dom_virtual = document.createElement('html');
      //dom_virtual.innerHTML = responseText;
      let TPL_REPEATED_GRADED_TASKS = '';
      let gradedTasks = GradedTask.getStudentMarks(this.getId()).reverse();

      if (context.showNumGradedTasks <= gradedTasks.length) {
        for (let i = 0;i < context.showNumGradedTasks;i++) {
          TPL_REPEATED_GRADED_TASKS += '<td><input type="number" class="gradedTaskInput" idPerson="' + TPL_PERSON.getId() + '" idGradedTask="' + gradedTasks[i][0] + '" min=0 max=100 value="' + gradedTasks[i][1] + '"/></td>';
        }
      }
      targetElement.innerHTML += eval('`' + responseText + '`');
    }.bind(this));
  }

  /** Renders person edit form */
  getHTMLEdit() {
    let callback = function(responseText) {
      document.getElementById('content').innerHTML = responseText;
      let saveStudent = document.getElementById('newStudent');
      document.getElementById('idFirstName').value = this.name;
      document.getElementById('idSurnames').value = this.surname;
      saveStudent.addEventListener('submit', () => {
        let oldId = this.getId();
        this.name = document.getElementById('idFirstName').value;
        this.surname = document.getElementById('idSurnames').value;
        let student = new Person(this.name,this.surname,this.attitudeTasks,this.id);
        context.students.set(student.getId(),student);
        localStorage.setItem('students',JSON.stringify([...context.students])); //Use of spread operator to convert a Map to an array of pairs
      });
    }.bind(this);

    loadTemplate('templates/addStudent.html',callback);
  }
  /** Renders person detail view */
  getHTMLDetail() {
    loadTemplate('templates/detailStudent.html',function(responseText) {
        document.getElementById('content').innerHTML = responseText;
        let TPL_STUDENT = this;
        let TPL_ATTITUDE_TASKS = '';
        this.attitudeTasks.reverse().forEach(function(atItem) {
          TPL_ATTITUDE_TASKS += '<li class="list-group-item">' + atItem.task.points + '->' +
                        atItem.task.description + '->' + formatDate(new Date(atItem.task.datetime)) + '</li>';
        });
        let TPL_GRADED_TASKS = '';
        context.gradedTasks.forEach(function(gtItem) {
          TPL_GRADED_TASKS += '<li class="list-group-item">' + gtItem.getStudentMark(TPL_STUDENT.getId()) + '->' +
                        gtItem.name + '->' + formatDate(new Date(gtItem.datetime)) + '</li>';
        });
        document.getElementById('content').innerHTML = eval('`' + responseText + '`');
      }.bind(this));
  }
}

export default Person;
