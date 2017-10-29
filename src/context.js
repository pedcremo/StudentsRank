/**
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 * @tutorial pointing-criteria
 */

/*jshint -W061 */

import Person from './person.js';
import GradedTask from './gradedtask.js';
import {hashcode,getElementTd,deleteContent,loadTemplate} from './utils.js';

class Context {

  constructor() {
    //this.students = [];
    this.students = new Map();
    this.gradedTasks = [];
    this.showNumGradedTasks = 1;

    if (localStorage.getItem('students')) {
      let students_ = new Map(JSON.parse(localStorage.getItem('students')));
      //this.students = students_;
      students_.forEach(function(value_,key_,students_) {
        let p = new Person(value_.name,value_.surname,
          value_.attitudeTasks,value_.gradedTasks);
        students_.set(key_,p);
      });
      this.students = students_;
      /*for (let i = 0;i < students_.length;i++) {
        let p = new Person(students_[i].name,students_[i].surname,
          students_[i].attitudeTasks,students_[i].gradedTasks);
        this.students.push(p);
      }*/
    }
    if (localStorage.getItem('gradedTasks')) {
      this.gradedTasks = JSON.parse(localStorage.getItem('gradedTasks'));
    }
  }
  /** Init nav bar menu and manipulate evetntlisteners to menu items */
  initMenu() {
    let addTask = document.getElementById('addGradedTask');
    addTask.addEventListener('click', () => {
      this.addGradedTask();
    });
    let addStudent = document.getElementById('addStudent');
    addStudent.addEventListener('click', () => {
      this.addPerson();
    });
  }

  /** Get a Person instance based on its ID */
  getPersonById(idHash) {
    return this.students.get(parseInt(idHash));
  }

  /** Draw Students rank table in descendent order using points as a criteria */
  getTemplateRanking() {
    window.alert('GI');
    if (this.students && this.students.size > 0) {
      /* We sort students descending from max number of points to min */
      let arrayFromMap = [...this.students.entries()];
      arrayFromMap.sort(function(a,b) {
        return (b[1].getTotalPoints() - a[1].getTotalPoints());
      });
      this.students = new Map(arrayFromMap);

      localStorage.setItem('students',JSON.stringify([...this.students])); //Use of spread operator to convert a Map to an array of pairs
      let GRADED_TASKS = '';

      if (this.showNumGradedTasks >= this.gradedTasks.length) {
        this.showNumGradedTasks = this.gradedTasks.length;
      }
      for (let i = this.gradedTasks.length - 1;i > ((this.gradedTasks.length - 1) - this.showNumGradedTasks);i--) {
        if (i === this.gradedTasks.length - this.showNumGradedTasks) {
          GRADED_TASKS += '<td>' + this.gradedTasks[i].name + '&nbsp;<button id="more_gt">-></button></td>';
        } else {
          GRADED_TASKS += '<td>' + this.gradedTasks[i].name + '</td>';
        }
      }

      loadTemplate('templates/rankingList.html',function(responseText) {
              document.getElementById('content').innerHTML = eval('`' + responseText + '`');
              let tableBody = document.getElementById('idTableRankingBody');
              let btMoreGt = document.getElementById('more_gt');
              btMoreGt.onclick = function() {
                this.showNumGradedTasks++;
                this.getTemplateRanking();
              }.bind(this);
              this.students.forEach(function(studentItem,key,map) {
                let liEl = studentItem.getHTMLView();
                tableBody.appendChild(liEl);
              });
            }.bind(this));
    }
  }

  /** Create a form to create a GradedTask that will be added to every student */
  addGradedTask() {

    let callback = function(responseText) {
            let saveGradedTask = document.getElementById('newGradedTask');

            saveGradedTask.addEventListener('submit', () => {
              let name = document.getElementById('idTaskName').value;
              let description = document.getElementById('idTaskDescription').value;
              let weight = document.getElementById('idTaskWeight').value;
              let gtask = new GradedTask(name,description,weight);
              this.gradedTasks.push(gtask);
              localStorage.setItem('gradedTasks',JSON.stringify(this.gradedTasks));
              let studentsRef = this.students;
              studentsRef.forEach(function(studentItem,studentKey,studentsRef) {
                studentItem.addGradedTask(gtask);
              });
              this.getTemplateRanking();
              return false; //Avoid form submit
            });
          }.bind(this);

    loadTemplate('templates/addGradedTask.html',callback);
  }
  /** Add a new person to the context app */
  addPerson() {

    let callback = function(responseText) {
            let saveStudent = document.getElementById('newStudent');

            saveStudent.addEventListener('submit', () => {
              let name = document.getElementById('idFirstName').value;
              let surnames = document.getElementById('idSurnames').value;
              let student = new Person(name,surnames,[],[]);
              this.gradedTasks.forEach(function(iGradedTask) {
                    student.addGradedTask(new GradedTask(iGradedTask.name));
                  });
              this.students.set(student.getId(),student);
              localStorage.setItem('students',JSON.stringify([...this.students])); //Use of spread operator to convert a Map to an array of pairs
            });
          }.bind(this);

    loadTemplate('templates/addStudent.html',callback);
  }
  /** Add last action performed to lower information layer in main app */

  notify(text) {
    document.getElementById('notify').innerHTML = text;
  }
}

export let context = new Context(); //Singleton export
