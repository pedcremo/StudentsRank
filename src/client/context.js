/*
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 * @tutorial pointing-criteria
 */

/*jshint -W061 */

import Person from './classes/person.js';
import GradedTask from './classes/gradedtask.js';
import {updateFromServer,saveStudents,saveGradedTasks,saveSettings} from './dataservice.js';
import {hashcode,loadTemplate,setCookie,deleteCookie,getCookie} from './lib/utils.js';
import {generateMenu,showMenu,hideMenu,addSubject} from './menu.js';
import {template} from './lib/templator.js';
import {events} from './lib/eventsPubSubs.js';

class Context {

  constructor() {
    this.students = new Map();
    this.gradedTasks = new Map();
    this.attitudeTasks = new Map();
    this.settings = {};
    if (getCookie('user')) {
      this.user = JSON.parse(getCookie('user'));
    }
    events.subscribe('/context/deleteXP', (obj) => {
      saveStudents(JSON.stringify([...this.students]));
    });
    events.subscribe('/context/updateStudent', (obj) => {
      this.students.set(obj.getId(),obj);
      saveStudents(JSON.stringify([...this.students]));
    });
    events.subscribe('/context/addStudent', (obj) => {
      this.addStudent(obj);
    });
    events.subscribe('/context/addXP', (obj) => {
      saveStudents(JSON.stringify([...this.students]));
      let typeToastr = 'success';
      if (obj.attitudeTask.points < 0) {typeToastr = 'error';};
      this.notify('Added ' +  obj.attitudeTask.points + ' ' + obj.attitudeTask.description + ' to ' + obj.person.name + ',' + obj.person.surname, obj.person.surname + ' ,' + obj.person.name,typeToastr);
    });

    events.subscribe('/context/newGradedTask', (gtask) => {
      this.students.forEach(function(studentItem,studentKey,studentsRef) {
        gtask.addStudentMark(studentKey,0);
      });
      //gradedTasks.set(gtask.id,gtask);
      saveGradedTasks(JSON.stringify([...gradedTasks]));
      this.getTemplateRanking();
    });
    
  }
  /** Add student to context previously adding all graded tasks defined. Afterwards we render list*/
  addStudent(studentInstance) {
    this.gradedTasks.forEach(function(iGradedTask) {
      iGradedTask.addStudentMark(studentInstance.getId(),0);
    });
    this.students.set(studentInstance.getId(),studentInstance);
    saveStudents(JSON.stringify([...this.students]));
    this.getTemplateRanking();
  }
  /** Clear context  */
  clear() {
    this.students = new Map();
    this.gradedTasks = new Map();
    this.attitudeTasks = new Map();
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
        //Only call server if we not have loaded students 
        if (this.students.size <= 0) {
          updateFromServer();
        }
        //this.getTemplateRanking();
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
        hideMenu();
        $('#content').html(eval('`' + responseText + '`'));
        $('#loginAlert').hide();
        let loginForm = $('#loginForm');

        loginForm.submit(function(event) {
          event.preventDefault();
          deleteCookie('connect.sid');
          let username = $('input[name=username]').val();
          let password = $('input[name=password]').val();
          loadTemplate('api/login',function(userData) {
            that.user = JSON.parse(userData);
            //First time we log in
            if (that.user.defaultSubject === 'default') {
              updateFromServer();
              addSubject();
            //We are veteran users
            }else {
              setCookie('user',userData,7);
              updateFromServer();
              //that.getTemplateRanking();
            }
          },'POST','username=' + username + '&password=' + password,false);
          return false; //Avoid form submit
        });
      });
    }else {
      generateMenu();
      that.getTemplateRanking();
    }
  }
  /** Get a Person instance by its ID */
  getPersonById(idHash) {
    return this.students.get(parseInt(idHash));
  }
  /** Get a GradedTask instance by its ID */
  /*getGradedTaskById(idHash) {
    return this.gradedTasks.get(parseInt(idHash));
  }*/
  /** Draw Students ranking table in descendent order using total points as a criteria */
  getTemplateRanking() {
    generateMenu();
    //showMenu();

    if (this.students && this.students.size > 0) {
      /* We sort students descending from max number of points to min */
      let arrayFromMap = [...this.students.entries()];
      arrayFromMap.sort(function(a,b) {
        return (b[1].getFinalGrade() - a[1].getFinalGrade());
      });
      this.students = new Map(arrayFromMap);

      let scope = {};

      if (GradedTask.getGradedTasks() && GradedTask.getGradedTasks().size > 0) {
        scope.TPL_GRADED_TASKS = [...GradedTask.getGradedTasks().entries()].reverse();
        if (this.settings.defaultTerm !== 'ALL') {
          let aux = [];
          for (let i = 0;i < scope.TPL_GRADED_TASKS.length;i++) {
            if (scope.TPL_GRADED_TASKS[i][1].term === context.settings.defaultTerm) {
              aux.push(scope.TPL_GRADED_TASKS[i]);
            }
          }
          scope.TPL_GRADED_TASKS = aux;
        }
      }

      scope.TPL_PERSONS = arrayFromMap;
      let TPL_XP_WEIGHT = this.settings.weightXP;
      let TPL_GT_WEIGHT = this.settings.weightGP;

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
              let that = this;
              let callback = function() {
                  $('.gradedTaskInput').each(function(index) {
                        $(this).change(function() {
                          let idPerson = $(this).attr('idStudent');
                          let idGradedTask = $(this).attr('idGradedTask');
                          let gt = GradedTask.getGradedTasks().get(parseInt(idGradedTask));
                          gt.addStudentMark(idPerson,$(this).val());
                          that.getTemplateRanking();
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
            }.bind(this));
    }else {
      //alert('NO STUDENTS');
      $('#content').html('NO STUDENTS YET');
    }
  }
 
  /** Add last action performed to lower information layer in main app */
  notify(text,title,type='success') {
    toastr.options.timeOut = 4500;
    toastr.options.hideDuration = 250;
    toastr.options.showDuration = 250;
    toastr.options.onShown = () => {  this.getTemplateRanking(); };
    if (type === 'success') {
      toastr.success(text, title);
    }else {
      toastr.error(text, title);
    }
  }
}
export let context = new Context(); //Singleton export