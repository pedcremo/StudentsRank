/**
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 * @tutorial pointing-criteria
 */
 
/*jshint -W061 */

import Person from './person.js';
import GradedTask from './gradedtask.js';
import {updateFromServer,saveStudents,saveGradedTasks} from './dataservice.js';
import {hashcode,loadTemplate,setCookie,deleteCookie,getCookie} from './utils.js';
import {generateMenu} from './menu.js';
import {template} from './templator.js';
 
class Context {

  constructor() {
    this.students = new Map();
    this.gradedTasks = new Map();
    this.showNumGradedTasks = 1;//Max visible graded tasks in ranking list table
    this.weightXP = parseInt(getCookie('weightXP')) || 25;
    this.weightGP = parseInt(getCookie('weightGP')) || 75;
    if (getCookie('user')) {
      this.user = JSON.parse(getCookie('user'));
    }
  }

  /** Clear context  */
  clear() {
    this.students = new Map();
    this.gradedTasks = new Map();
    this.showNumGradedTasks = 1;
    this.user = undefined;
  }
  /** Check if user is logged */
  isLogged() {
    loadTemplate('api/loggedin',function(response) {
      if (response === '0') {
        //alert('LOGGED IN 0');
        this.clear();
        this.login();
        return false;
      }else {
        //alert('LOGGED IN TRUE');
        this.user = JSON.parse(response);
        updateFromServer();
        this.getTemplateRanking();
        return true;
      }
    }.bind(this),'GET','',false);
  }

  /** Show login form template when not authenticated */
  login() {
    let that = this;
    if (!this.user) {
      this.clear();
      loadTemplate('templates/login.html',function(responseText) {
        that.hideMenu();
        document.getElementById('content').innerHTML = eval('`' + responseText + '`');
        let loginForm = document.getElementById('loginForm');

        loginForm.addEventListener('submit', (event) => {
          event.preventDefault();
          deleteCookie('connect.sid');
          let username = document.getElementsByName('username')[0].value;
          let password = document.getElementsByName('password')[0].value;
          loadTemplate('api/login',function(userData) {
            that.user = JSON.parse(userData);
            setCookie('user',userData,7);
            updateFromServer();
            that.getTemplateRanking();
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
    generateMenu();
    this.showMenu();
 
    if (this.students && this.students.size > 0) {
      //alert('SI STUDENTS');
      /* We sort students descending from max number of points to min */
      let arrayFromMap = [...this.students.entries()];
      arrayFromMap.sort(function(a,b) {
        return (b[1].getFinalGrade() - a[1].getFinalGrade());
      });
      this.students = new Map(arrayFromMap);
 
      saveStudents(JSON.stringify([...this.students]));
      //let TPL_GRADED_TASKS = '';
      let scope = {};
      if (this.gradedTasks && this.gradedTasks.size > 0) {
        if (this.showNumGradedTasks >= this.gradedTasks.size) {
          this.showNumGradedTasks = this.gradedTasks.size;
        }
        let arrayGradedTasks = [...this.gradedTasks.entries()].reverse();
        scope.TPL_GRADED_TASKS = arrayGradedTasks.slice(0,this.showNumGradedTasks);
        /*for (let i = 0;i < this.showNumGradedTasks;i++) {
          if (i === (this.showNumGradedTasks - 1)) {
            TPL_GRADED_TASKS += '<th><a class="text-warning" href="#detailGradedTask/' + arrayGradedTasks[i][0] + '">' +
                  arrayGradedTasks[i][1].name + '(' + arrayGradedTasks[i][1].weight + '%)&nbsp;</a><a href="#MoreGradedTasks"><button id="more_gt"><i class="fa fa-hand-o-right fa-1x"></i></button></a></th>';
          } else {
            TPL_GRADED_TASKS += '<th><a class="text-warning" href="#detailGradedTask/' + arrayGradedTasks[i][0] + '">' + arrayGradedTasks[i][1].name + '(' + arrayGradedTasks[i][1].weight + '%)</a></th>';
          }
        }*/
      }
      
      //scope.TPL_GRADED_TASKS = TPL_GRADED_TASKS;
      scope.TPL_PERSONS = arrayFromMap;
      let TPL_XP_WEIGHT = this.weightXP;
      let TPL_GT_WEIGHT = this.weightGP;

      loadTemplate('templates/rankingList.html',function(responseText) {
              let out = template(responseText,scope);
              console.log(out);
              document.getElementById('content').innerHTML = eval('`' + out + '`');
              let that = this;
              let callback = function() {
                  let gtInputs = document.getElementsByClassName('gradedTaskInput');
                  Array.prototype.forEach.call(gtInputs,function(gtInputItem) {
                        gtInputItem.addEventListener('change', () => {
                          let idPerson = gtInputItem.getAttribute('idStudent');
                          let idGradedTask = gtInputItem.getAttribute('idGradedTask');
                          let gt = that.gradedTasks.get(parseInt(idGradedTask));
                          gt.addStudentMark(idPerson,gtInputItem.value);
                          that.getTemplateRanking();
                        });
                      });
                  let profileImages = document.getElementsByClassName('profile'); //Image profiles TEST
                  Array.prototype.forEach.call(profileImages,function(profileItem) { //TEST
                    profileItem.addEventListener('mouseenter', () => { //TEST
                      profileItem.removeAttribute('width'); //TEST
                      profileItem.removeAttribute('height'); //TEST
                    });
                    profileItem.addEventListener('mouseout', () => { //TEST
                      profileItem.setAttribute('width',48); //TEST
                      profileItem.setAttribute('height',60); //TEST
                    });
                  });
                };
              callback();
            }.bind(this));
    }else {
      //alert('NO STUDENTS');
      document.getElementById('content').innerHTML = '';
    }
  }
  /** Settings */
  settings() {
    let callback = function(responseText) {
      document.getElementById('content').innerHTML = responseText;
      let itemWeightChanger = document.getElementById('weightChanger');
      itemWeightChanger.value = this.weightXP;
      let labelXPWeight = document.getElementById('idXPweight');
      labelXPWeight.innerHTML = this.weightXP + '% XP weight';
      let labelGPWeight = document.getElementById('idGPweight');
      labelGPWeight.innerHTML = this.weightGP + '% GP weight';
      itemWeightChanger.addEventListener('change', () => {
          labelXPWeight.innerHTML = itemWeightChanger.value + '% XP weight';
          this.weightXP = itemWeightChanger.value;
          setCookie('weightXP',this.weightXP,300);
          labelGPWeight.innerHTML = (100 - itemWeightChanger.value) + '% GP weight';
          this.weightGP = (100 - itemWeightChanger.value);
          setCookie('weightGP',this.weightGP,300);
        });
      console.log('Settings: To implement');
    }.bind(this);
    loadTemplate('templates/settings.html',callback);
  }
  /** Create a form to create a GradedTask that will be added to every student */
  addGradedTask() {
 
    let callback = function(responseText) {
            document.getElementById('content').innerHTML = responseText;
            let saveGradedTask = document.getElementById('newGradedTask');
            let totalGTweight = GradedTask.getGradedTasksTotalWeight();
            document.getElementById('labelWeight').innerHTML = 'Task Weight (0-' + (100 - totalGTweight) + '%)';
            let weightIput = document.getElementById('idTaskWeight');
            weightIput.setAttribute('max', 100 - totalGTweight);
 
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
              saveGradedTasks(JSON.stringify([...this.gradedTasks]));
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
            let studentProfile = document.getElementById('myProfile');

            studentProfile.addEventListener('change', (event) => {
              let input = event.target;
              let reader = new FileReader();
              reader.onload = function() {
                let dataURL = reader.result;
                let output = document.getElementById('output');
                output.src = dataURL;
              };
              reader.readAsDataURL(input.files[0]);
            });

            saveStudent.addEventListener('submit', (event) => {
              event.preventDefault();
              let name = document.getElementById('idFirstName').value;
              let surnames = document.getElementById('idSurnames').value;
              let student = new Person(name,surnames,[]);
              var formData = new FormData(saveStudent);
              var file = studentProfile.files[0];
              formData.append('idStudent',student.getId());

              loadTemplate('api/uploadImage',function(response) {
                console.log(response);
              },'POST',formData,'false');
 
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