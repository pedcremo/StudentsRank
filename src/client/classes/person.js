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
import {saveStudents,saveAttitudeTasks} from '../dataservice.js';
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
  }

  /** Get person id  based on a 10 character hash composed by name+surname */
  getId() {
    return this.id;
  }

  /** Read person _totalXPpoints. A private property only modicable inside person instance */
  getXPtotalPoints() {
    this[_totalXPpoints] = 0;
    this.attitudeTasks.forEach(function (itemAT) {
      if (context.attitudeTasks.size > 0) {
        let instanceAT = context.attitudeTasks.get(parseInt(itemAT.id));
        try {
          this[_totalXPpoints] += parseInt(instanceAT.points);
        } catch (error) {
          this[_totalXPpoints] += 0;
        }
      }
    }.bind(this));

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
  addAttitudeTask(taskInstanceId) {
    let dateTimeStamp = new Date();//Current time
    this.attitudeTasks.push({'id':taskInstanceId,'timestamp':dateTimeStamp});
    let attTask = context.attitudeTasks.get(parseInt(taskInstanceId));
    attTask.hits++;
    saveStudents(JSON.stringify([...context.students]));
    //this[privateAddTotalPoints](parseInt(attTask.points));
    let typeToastr = 'success';
    if (attTask.points < 0) {typeToastr = 'error';};
    context.notify('Added ' +  attTask.points + ' ' + attTask.description + ' to ' + this.name + ',' + this.surname, this.surname + ' ,' + this.name,typeToastr);
  }
  /** Delete XP associated to this person */
  deleteXP(taskInstanceId) {
    //console.log('HOLA TINKI WINKI');
    this.attitudeTasks.forEach((itemAT) => {
        if (itemAT.id == taskInstanceId) {
          let index = this.attitudeTasks.indexOf(itemAT);
          if (index > -1) {
            this.attitudeTasks.splice(index, 1);
          }
        }
      });
    saveStudents(JSON.stringify([...context.students]));
  }

  /** Get students Marks current term by showNumGradedTasks from context*/
  getStudentMarks() {
    let gtArray = GradedTask.getStudentMarks(this.getId()).reverse();

    if (context.settings.defaultTerm !== 'ALL') {
      gtArray.forEach(function(element) {
        let index = gtArray.indexOf(element);
        let gtInstance = context.getGradedTaskById(element[0]);
        if (gtInstance.term !== context.settings.defaultTerm) {
          if (index > -1) {
            gtArray.splice(index, 1);
          }
        }
      });
    }
    //return gtArray.slice(0,context.showNumGradedTasks);
    return gtArray;
  }
  /** Get total points over 100 taking into account different graded tasks weights */
  getGTtotalPoints() {
    return GradedTask.getStudentGradedTasksPoints(this.getId());
  }
  /** XP mark relative to highest XP mark and XP weight and GT grade */
  getFinalGrade() {

    let xpGrade = this.getXPtotalPoints() * (context.settings.weightXP) / Person.getMaxXPmark();
    if (isNaN(xpGrade)) {
      xpGrade = 0;
    }
    return Math.round(xpGrade + (this.getGTtotalPoints() * (context.settings.weightGP / 100)));
  }
  /** Renders person edit form */
  getHTMLEdit() {
    let callback = function(responseText) {
      $('#content').html(responseText);
      let saveStudent = $('#newStudent');
      $('#idFirstName').val(this.name);
      $('#idSurnames').val(this.surname);
      let studentProfile = $('#myProfile');
      let outputImg = $('#output');
      outputImg.attr('src','src/server/data/fotos/' + this.getId() + '.jpg');
      let studentThis = this;

      studentProfile.change(() => {
        let input = event.target;
        let reader = new FileReader();
        reader.onload = function() {
          let dataURL = reader.result;
          //output = document.getElementById('output');
          outputImg.attr('src',dataURL);
        };
        reader.readAsDataURL(input.files[0]);
      });

      saveStudent.submit(function() {
        let oldId = studentThis.getId();
        studentThis.name = $('#idFirstName').val();
        studentThis.surname = $('#idSurnames').val();
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
        scope.TPL_ATTITUDE_TASKS = [];
        this.attitudeTasks.reverse().forEach(function(atItem) {
          let itemAT = context.attitudeTasks.get(parseInt(atItem.id));
          itemAT.datetime = atItem.timestamp;
          scope.TPL_ATTITUDE_TASKS.push(itemAT);
        });
        let TPL_GRADED_TASKS = '';
        context.gradedTasks.forEach(function(gtItem) {
          TPL_GRADED_TASKS += '<li class="list-group-item">' + gtItem.getStudentMark(TPL_STUDENT.getId()) + '->' +
                        gtItem.name + '->' + formatDate(new Date(gtItem.datetime)) + '</li>';
        });
        let out = template(responseText,scope);
        console.log(out);
        $('#content').html(eval('`' + out + '`'));
      }.bind(this));
  }
  /** Add a new person to the context app */
  static addPerson() {
    let callback = function(responseText) {
            $('#content').html(responseText);
            let saveStudent = $('#newStudent');
            let studentProfile = $('#myProfile');

            studentProfile.change(function(event) {
              let input = event.target;
              let reader = new FileReader();
              reader.onload = function() {
                let dataURL = reader.result;
                let output = $('#output');
                output.src = dataURL;
              };
              reader.readAsDataURL(input.files[0]);
            });

            saveStudent.submit(function(event) {
              event.preventDefault();
              let name = $('#idFirstName').val();
              let surnames = $('#idSurnames').val();
              let student = new Person(name,surnames,[]);
              var formData = new FormData(saveStudent[0]);
              var file = studentProfile[0].files[0];
              formData.append('idStudent',student.getId());

              loadTemplate('api/uploadImage',function(response) {
                console.log(response);
              },'POST',formData,'false');

              if (context) {
                context.addStudent(student);
                return false; //Avoid form submit
              }
            });
          };

    loadTemplate('templates/addStudent.html',callback);
  }
}

export default Person;
