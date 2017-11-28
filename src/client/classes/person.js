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

import {formatDate,popupwindow,hashcode,loadTemplate} from '../lib/utils.js';
import {context} from '../context.js';
import AttitudeTask from './attitudetask.js';
import GradedTask from './gradedtask.js';
import {saveStudents} from '../dataservice.js';
import {template} from '../lib/templator.js';

const privateAddTotalPoints = Symbol('privateAddTotalPoints'); /** To accomplish private method */
const _totalXPpoints = Symbol('TOTAL_XP_POINTS'); /** To acomplish private property */

class Person {
  constructor(name,surname,attitudeTasks,id=null) {
    this[_totalXPpoints] = 0;
    this.name = name;
    this.surname = surname;
    if (!id) {
      this.id = hashcode(this.name + this.surname);
    }else {
      this.id = id;
    }
    this.attitudeTasks = attitudeTasks;

    this.attitudeTasks.forEach(function (itemAT) {
      this[_totalXPpoints] += parseInt(itemAT['task'].points);
    }.bind(this));
  }

  /** Add points to person. we should use it carefully . */
  [privateAddTotalPoints] (points) {
    if (!isNaN(points)) {
      this[_totalXPpoints] += points;
      context.getTemplateRanking();
    }
  }

  /** Get person id  based on a 10 character hash composed by name+surname */
  getId() {
    return this.id;
  }

  /** Read person _totalXPpoints. A private property only modicable inside person instance */
  getXPtotalPoints() {
    return this[_totalXPpoints];
  }

  /** returns max XP grade used to calculate XP mark for each student */
  static getMaxXPmark() {
    let max = 0;
    context.students.forEach(function(studentItem,studentKey,studentsRef) {
      if (studentItem.getXPtotalPoints() > max) {
        max = studentItem.getXPtotalPoints();
      }
    });
    return max;
  }
  /** Add a Attitude task linked to person with its own mark. */
  addAttitudeTask(taskInstance) {
    this.attitudeTasks.push({'task':taskInstance});
    this[privateAddTotalPoints](parseInt(taskInstance.points));
    context.notify('Added ' + taskInstance.description + ' to ' + this.name + ',' + this.surname, this.surname + ' ,' + this.name);
  }
  /** Get students Marks sliced by showNumGradedTasks from context*/
  getStudentMarks() {
    let gtArray = GradedTask.getStudentMarks(this.getId()).reverse();
    //return gtArray.slice(0,context.showNumGradedTasks);
    return gtArray;
  }
  /** Get total points over 100 taking into account different graded tasks weights */
  getGTtotalPoints() {
    return GradedTask.getStudentGradedTasksPoints(this.getId());
  }
  /** XP mark relative to highest XP mark and XP weight and GT grade */
  getFinalGrade() {

    let xpGrade = this.getXPtotalPoints() * (context.weightXP) / Person.getMaxXPmark();
    if (isNaN(xpGrade)) {
      xpGrade = 0;
    }
    return Math.round(xpGrade + (this.getGTtotalPoints() * (context.weightGP / 100)));
  }
  /** Renders person edit form */
  getHTMLEdit() {
    let callback = function(responseText) {
      document.getElementById('content').innerHTML = responseText;
      let saveStudent = $('#newStudent');
      document.getElementById('idFirstName').value = this.name;
      document.getElementById('idSurnames').value = this.surname;
      let studentProfile = $('#myProfile');
      let output = document.getElementById('output');
      output.src = 'src/server/data/fotos/' + this.getId() + '.jpg';
      let studentThis = this;

      studentProfile.change(function(event) {
        let input = event.target;
        let reader = new FileReader();
        reader.onload = function() {
          let dataURL = reader.result;
          output = document.getElementById('output');
          output.src = dataURL;
        };
        reader.readAsDataURL(input.files[0]);
      });

      saveStudent.submit(function() {
        let oldId = studentThis.getId();
        studentThis.name = document.getElementById('idFirstName').value;
        studentThis.surname = document.getElementById('idSurnames').value;
        let student = new Person(studentThis.name,studentThis.surname,studentThis.attitudeTasks,studentThis.id);
        let formData = new FormData(saveStudent[0]);
        let file = studentProfile[0].files[0];
        formData.append('idStudent',student.getId());

        loadTemplate('api/uploadImage',function(response) {
          console.log(response);
        },'POST',formData,'false');

        context.students.set(student.getId(),student);
        saveStudents(JSON.stringify([...context.students]));
      });
    }.bind(this);

    loadTemplate('templates/addStudent.html',callback);
  }
  /** Renders person detail view */
  getHTMLDetail() {
    loadTemplate('templates/detailStudent.html',function(responseText) {
        let TPL_STUDENT = this;
        let scope = {};
        scope.TPL_ATTITUDE_TASKS = this.attitudeTasks.reverse();
        let TPL_GRADED_TASKS = '';
        context.gradedTasks.forEach(function(gtItem) {
          TPL_GRADED_TASKS += '<li class="list-group-item">' + gtItem.getStudentMark(TPL_STUDENT.getId()) + '->' +
                        gtItem.name + '->' + formatDate(new Date(gtItem.datetime)) + '</li>';
        });
        let out = template(responseText,scope);
        console.log(out);
        document.getElementById('content').innerHTML = eval('`' + out + '`');
      }.bind(this));
  }
  /** Add a new person to the context app */
  static addPerson() {
    let callback = function(responseText) {
            document.getElementById('content').innerHTML = responseText;
            let saveStudent = $('#newStudent');
            let studentProfile = $('#myProfile');

            studentProfile.change(function(event) {
              let input = event.target;
              let reader = new FileReader();
              reader.onload = function() {
                let dataURL = reader.result;
                let output = document.getElementById('output');
                output.src = dataURL;
              };
              reader.readAsDataURL(input.files[0]);
            });

            saveStudent.submit(function(event) {
              event.preventDefault();
              let name = document.getElementById('idFirstName').value;
              let surnames = document.getElementById('idSurnames').value;
              let student = new Person(name,surnames,[]);
              var formData = new FormData(saveStudent[0]);
              var file = studentProfile[0].files[0];
              formData.append('idStudent',student.getId());

              loadTemplate('api/uploadImage',function(response) {
                console.log(response);
              },'POST',formData,'false');

              if (context) {
                context.gradedTasks.forEach(function(iGradedTask) {
                      iGradedTask.addStudentMark(student.getId(),0);
                    });
                context.students.set(student.getId(),student);
                context.getTemplateRanking();
                return false; //Avoid form submit
              }
            });
          };

    loadTemplate('templates/addStudent.html',callback);
  }
}

export default Person;
