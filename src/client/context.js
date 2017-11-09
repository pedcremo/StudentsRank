/**
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 * @tutorial pointing-criteria
 */

/*jshint -W061 */

import Person from './person.js';
import GradedTask from './gradedtask.js';
import {hashcode,loadTemplate,setCookie,getCookie} from './utils.js';
import {generateMenu} from './menu.js';

class Context {

  constructor() {
    this.students = new Map();
    this.gradedTasks = new Map();
    this.showNumGradedTasks = 1;//Max visible graded tasks in ranking list table
    if (getCookie('user')) {
      this.user = JSON.parse(getCookie('user'));
    }

    if (localStorage.getItem('students')) {
      let students_ = new Map(JSON.parse(localStorage.getItem('students')));
      students_.forEach(function(value_,key_,students_) {
        students_.set(key_,new Person(value_.name,value_.surname,
          value_.attitudeTasks,value_.id));
      });
      this.students = students_;
    }
    if (localStorage.getItem('gradedTasks')) {
      let gradedTasks_ = new Map(JSON.parse(localStorage.getItem('gradedTasks')));
      gradedTasks_.forEach(function(value_,key_,gradedTasks_) {
        gradedTasks_.set(key_,new GradedTask(value_.name,value_.description,value_.weight,
          value_.studentsMark,value_.id));
      });
      this.gradedTasks = gradedTasks_;
    }
  }
  /** Check if user is logged */
  isLogged() {
    if (this.user) {
      return true;
    }else {
      return false;
    }
  }
  /** Show login form template when not authenticated */
  login() {
    let that = this;
    if (!this.user) {
      loadTemplate('templates/login.html',function(responseText) {
        that.hideMenu();
        document.getElementById('content').innerHTML = eval('`' + responseText + '`');
        let loginForm = document.getElementById('loginForm');

        loginForm.addEventListener('submit', (event) => {
          event.preventDefault();
          let username = document.getElementsByName('username')[0].value;
          let password = document.getElementsByName('password')[0].value;
          loadTemplate('api/login',function(userData) {
            that.user = JSON.parse(userData);
            setCookie('user',userData,7);
            generateMenu();
            that.getTemplateRanking();
            that.showMenu();
          },'POST','username=' + username + '&password=' + password,false);
          return false; //Avoid form submit
        });
      });
    }else {
      generateMenu();
      that.getTemplateRanking();
    }
  }

  showMenu() {
    document.getElementById('navbarNav').style.visibility = 'visible';
  }

  hideMenu() {
    document.getElementById('navbarNav').style.visibility = 'hidden';
  }

  /** Get a Person instance by its ID */
  getPersonById(idHash) {
    return this.students.get(parseInt(idHash));
  }
  /** Get a GradedTask instance by its ID */
  getGradedTaskById(idHash) {
    return this.gradedTasks.get(parseInt(idHash));
  }
  /** Draw Students ranking table in descendent order using total points as a criteria */
  getTemplateRanking() {

    if (this.students && this.students.size > 0) {
      /* We sort students descending from max number of points to min */
      let arrayFromMap = [...this.students.entries()];
      arrayFromMap.sort(function(a,b) {
        return (b[1].getTotalPoints() - a[1].getTotalPoints());
      });
      this.students = new Map(arrayFromMap);

      localStorage.setItem('students',JSON.stringify([...this.students])); //Use of spread operator to convert a Map to an array of pairs
      let TPL_GRADED_TASKS = '';
      /* Maximum visible graded tasks could not be greater than actually existing graded tasks */
      if (this.showNumGradedTasks >= this.gradedTasks.length) {
        this.showNumGradedTasks = this.gradedTasks.length;
      }

      if (this.gradedTasks && this.gradedTasks.size > 0) {
        let arrayGradedTasks = [...this.gradedTasks.entries()].reverse();
        //TPL_GRADED_TASKS = arrayGradedTasks.slice(this.showNumGradedTasks);
        for (let i = 0;i < this.showNumGradedTasks;i++) {
          if (i === (this.showNumGradedTasks - 1)) {
            TPL_GRADED_TASKS += '<th><a href="#detailGradedTask/' + arrayGradedTasks[i][0] + '">' +
                  arrayGradedTasks[i][1].name + '(' + arrayGradedTasks[i][1].weight + '%)&nbsp;</a><a href="#MoreGradedTasks"><button id="more_gt"><i class="fa fa-hand-o-right fa-1x"></i></button></a></th>';
          } else {
            TPL_GRADED_TASKS += '<th><a href="#detailGradedTask/' + arrayGradedTasks[i][0] + '">' + arrayGradedTasks[i][1].name + '(' + arrayGradedTasks[i][1].weight + '%)</a></th>';
          }
        }
      }

      loadTemplate('templates/rankingList.html',function(responseText) {
              document.getElementById('content').innerHTML = eval('`' + responseText + '`');
              let tableBody = document.getElementById('idTableRankingBody');
              let that = this;
              let callback = function() {
                  let gtInputs = document.getElementsByClassName('gradedTaskInput');
                  Array.prototype.forEach.call(gtInputs,function(gtInputItem) {
                        gtInputItem.addEventListener('change', () => {
                          let idPerson = gtInputItem.getAttribute('idPerson');
                          let idGradedTask = gtInputItem.getAttribute('idGradedTask');
                          let gt = that.gradedTasks.get(parseInt(idGradedTask));
                          gt.addStudentMark(idPerson,gtInputItem.value);
                        });
                      });
                };
              let itemsProcessed = 0;
              this.students.forEach(function(studentItem,key,map) {
                studentItem.getHTMLView(tableBody);
                itemsProcessed++;
                if (itemsProcessed === map.size) {
                  setTimeout(callback,300); //FAULTY 
                }
              });
            }.bind(this));
    }else {
      localStorage.setItem('students',[]);
      document.getElementById('content').innerHTML ='';
    }
  }

  /** Create a form to create a GradedTask that will be added to every student */
  addGradedTask() {

    let callback = function(responseText) {
            document.getElementById('content').innerHTML = responseText;
            let saveGradedTask = document.getElementById('newGradedTask');

            saveGradedTask.addEventListener('submit', () => {
              let name = document.getElementById('idTaskName').value;
              let description = document.getElementById('idTaskDescription').value;
              let weight = document.getElementById('idTaskWeight').value;
              let gtask = new GradedTask(name,description,weight,[]);
              let gtaskId = gtask.getId();
              this.students.forEach(function(studentItem,studentKey,studentsRef) {
                gtask.addStudentMark(studentKey,0);
              });
              this.gradedTasks.set(gtaskId,gtask);
              localStorage.setItem('gradedTasks',JSON.stringify([...this.gradedTasks])); //Use of spread operator to convert a Map to an array of pairs
              this.getTemplateRanking();
              return false; //Avoid form submit
            });
          }.bind(this);

    loadTemplate('templates/addGradedTask.html',callback);
  }
  /** Add a new person to the context app */
  addPerson() {

    let callback = function(responseText) {
            document.getElementById('content').innerHTML = responseText;
            let saveStudent = document.getElementById('newStudent');

            saveStudent.addEventListener('submit', () => {
              let name = document.getElementById('idFirstName').value;
              let surnames = document.getElementById('idSurnames').value;
              let student = new Person(name,surnames,[]);
              this.gradedTasks.forEach(function(iGradedTask) {
                    iGradedTask.addStudentMark(student.getId(),0);
                  });
              this.students.set(student.getId(),student);
              this.getTemplateRanking();
              return false; //Avoid form submit
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
