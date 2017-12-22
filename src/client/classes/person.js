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

import {formatDate,popupwindow,hashcode,loadTemplate,getCookie} from '../lib/utils.js';
import {template} from '../lib/templator.js';
import {events} from '../lib/eventsPubSubs.js';

let students = new Map();
let settings = {};
let attitudeMAP = new Map();
let gradedtaskMAP = new Map();

events.subscribe('attitudeTask/change',(obj) => {
  attitudeMAP = obj;
});

events.subscribe('gradedTask/change',(obj) => {
  gradedtaskMAP = obj;
});

events.subscribe('dataservice/getStudents',(obj) => {
  let students_ = new Map(JSON.parse(obj));
  students_.forEach(function(value_,key_,students_) {
      students_.set(key_,new Person(value_.name,value_.surname,
          value_.attitudeTasks,value_.id));
    });
  students = students_;
});

events.subscribe('settings/change',(obj) => {
  settings = obj;
});

events.subscribe('/context/newGradedTask',(gtask) => {
  students.forEach(function(studentItem,studentKey,studentsRef) {
    gtask.addStudentMark(studentKey,0);
  });
});


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
    try {
      this.attitudeTasks.forEach(function (itemAT) {
        if (attitudeMAP.size > 0) {
          let instanceAT = attitudeMAP.get(parseInt(itemAT.id));
          try {
            this[_totalXPpoints] += parseInt(instanceAT.points);
          } catch (error) {
            this[_totalXPpoints] += 0;
          }
        }
      }.bind(this));
    }catch (err) {
      console.log('ERROR:' + err);
    }

    return this[_totalXPpoints];
  }

  /** returns max XP grade used to calculate XP mark for each student */
  static getMaxXPmark() {
    let max = 0;
    students.forEach(function(studentItem,studentKey,studentsRef) {
      if (studentItem.getXPtotalPoints() > max) {
        max = studentItem.getXPtotalPoints();
      }
    });
    return max;
  }
  /** Add a Attitude task linked to person with its own mark. */
  addAttitudeTask(taskInstance) {
    let dateTimeStamp = new Date();//Current time
    this.attitudeTasks.push({'id':taskInstance.id,'timestamp':dateTimeStamp});
    events.publish('/context/addXP',{'attitudeTask':taskInstance,'person':this});
    events.publish('dataservice/saveStudents',JSON.stringify([...students]));

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
    events.publish('dataservice/saveStudents',JSON.stringify([...students]));
  }

  /** Get students Marks in current term from context from newer to older */
  getStudentMarks() {
    let gtArray = [];
    try {     
      gradedtaskMAP.forEach((valueGT) => {
        console.log('MERDA ' + valueGT.id + 'Person id ' + this.id);
        gtArray.push([valueGT.id,valueGT.studentsMarkMAP.get(this.id)]);
      });

      if (settings.defaultTerm !== 'ALL') {
        let aux = [];
        for (let i = 0;i < gtArray.length;i++) {
          let gtInstance = gradedtaskMAP.get(gtArray[i][0]);
          if (gtInstance.term === settings.defaultTerm) {
            aux.push(gtArray[i]);
          }
        }
        gtArray = aux;
      }
    }catch (err) {
      console.log('ERROR' + err);
    }
    return gtArray.reverse();
  }
  /** Get total points over 100 taking into account different graded tasks weights */
  getGTtotalPoints() {
    let points = 0;
    try {
      gradedtaskMAP.forEach((itemTask) => {
        if (itemTask.term === settings.defaultTerm || settings.defaultTerm === 'ALL') {
          points += itemTask.studentsMarkMAP.get(this.id) * (itemTask.weight / 100);
        }
      });
    } catch (err) {
      console.log(err);
    }
    return Math.round((points * 100) / 100);
    //return GradedTask.getStudentGradedTasksPoints(this.getId());
  }
  /** XP mark relative to highest XP mark and XP weight and GT grade */
  getFinalGrade() {

    let xpGrade = this.getXPtotalPoints() * (settings.weightXP) / Person.getMaxXPmark();
    if (isNaN(xpGrade)) {
      xpGrade = 0;
    }
    return Math.round(xpGrade + (this.getGTtotalPoints() * (settings.weightGP / 100)));
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
        students.set(student.getId(),student);
        events.publish('dataservice/saveStudents',JSON.stringify([...students]));        
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
          let itemAT = attitudeMAP.get(parseInt(atItem.id));
          itemAT.datetime = atItem.timestamp;
          scope.TPL_ATTITUDE_TASKS.push(itemAT);
        });
        let TPL_GRADED_TASKS = '';
        gradedtaskMAP.forEach(function(gtItem) {
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

              Person.addStudent(student);
              return false; //Avoid form submit              
            });
          };

    loadTemplate('templates/addStudent.html',callback);
  }
  static getPersonById(idHash) {
    return students.get(parseInt(idHash));
  }
  static getRankingTable() {
    if (students && students.size > 0) {
      /* We sort students in descending order from max number of points to min when we are in not expanded view */
      let arrayFromMap = [...students.entries()];

      if ($('.tableGradedTasks').is(':hidden')) {
        arrayFromMap.sort(function(a,b) {
          return (b[1].getFinalGrade() - a[1].getFinalGrade());
        });
      }
      students = new Map(arrayFromMap);

      let scope = {};

      if (gradedtaskMAP && gradedtaskMAP.size > 0) {
        scope.TPL_GRADED_TASKS = [...gradedtaskMAP.entries()].reverse();
        if (settings.defaultTerm !== 'ALL') {
          let aux = [];
          for (let i = 0;i < scope.TPL_GRADED_TASKS.length;i++) {
            if (scope.TPL_GRADED_TASKS[i][1].term === settings.defaultTerm) {
              aux.push(scope.TPL_GRADED_TASKS[i]);
            }
          }
          scope.TPL_GRADED_TASKS = aux;
        }
      }

      scope.TPL_PERSONS = arrayFromMap;
      let TPL_XP_WEIGHT = settings.weightXP;
      let TPL_GT_WEIGHT = settings.weightGP;

      loadTemplate('templates/rankingList.html',function(responseText) {
              let out = template(responseText,scope);
              $('#content').html(eval('`' + out + '`'));
              if (getCookie('expandedView') === 'visible') {
                $('.tableGradedTasks').show();
                $('.fa-hand-o-right').addClass('fa-hand-o-down').removeClass('fa-hand-o-right');
              }else {
                $('.tableGradedTasks').hide();
                $('.fa-hand-o-down').addClass('fa-hand-o-right').removeClass('fa-hand-o-down');
              }
              //let that = this;
              let callback = function() {
                  $('.gradedTaskInput').each(function(index) {
                        $(this).change(function() {
                          let idPerson = $(this).attr('idStudent');
                          let idGradedTask = $(this).attr('idGradedTask');
                          let gt = gradedtaskMAP.get(parseInt(idGradedTask));
                          gt.addStudentMark(idPerson,$(this).val());
                          Person.getRankingTable();
                          //that.getTemplateRanking();
                        });
                      });
                  $('.profile').each(function(index) {
                    $(this).mouseenter(function() { //TEST
                      $(this).removeAttr('width'); //TEST
                      $(this).removeAttr('height'); //TEST
                    });
                    $(this).mouseout(function() { //TEST
                      $(this).attr('width',48); //TEST
                      $(this).attr('height',60); //TEST
                    });
                  });
                };
              callback();
            });
    }else {
      $('#content').html('NO STUDENTS YET');
    }
  }
  static addStudent(studentInstance) {
    events.publish('student/new',studentInstance);
    students.set(studentInstance.getId(),studentInstance);
    events.publish('dataservice/saveStudents',JSON.stringify([...students]));    
    Person.getRankingTable();
  }
  static getStudentsSize() {
    return students.size;
  }
  static deleteById(idPerson) {
    students.delete(idPerson);
    events.publish('dataservice/saveStudents',JSON.stringify([...students]));
  }
}

export default Person;
