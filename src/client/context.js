/**
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 * @tutorial pointing-criteria
 */

/*jshint -W061 */

import Person from './classes/person.js';
import GradedTask from './classes/gradedtask.js';
import {updateFromServer,saveStudents,saveGradedTasks} from './dataservice.js';
import {hashcode,loadTemplate,setCookie,deleteCookie,getCookie} from './lib/utils.js';
import {generateMenu,showMenu,hideMenu} from './menu.js';
import {template} from './lib/templator.js';

class Context {

  constructor() {
    this.students = new Map();
    this.gradedTasks = new Map();
    //this.showNumGradedTasks = 1;//Max visible graded tasks in ranking list table
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
    //this.showNumGradedTasks = 1;
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
        hideMenu();
        document.getElementById('content').innerHTML = eval('`' + responseText + '`');
        let loginForm = $('#loginForm');

        loginForm.submit(function(event) {
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
    showMenu();

    if (this.students && this.students.size > 0) {
      /* We sort students descending from max number of points to min */
      let arrayFromMap = [...this.students.entries()];
      arrayFromMap.sort(function(a,b) {
        return (b[1].getFinalGrade() - a[1].getFinalGrade());
      });
      this.students = new Map(arrayFromMap);

      saveStudents(JSON.stringify([...this.students]));
      let scope = {};

      if (this.gradedTasks && this.gradedTasks.size > 0) {
        scope.TPL_GRADED_TASKS = [...this.gradedTasks.entries()].reverse();
      }

      scope.TPL_PERSONS = arrayFromMap;
      let TPL_XP_WEIGHT = this.weightXP;
      let TPL_GT_WEIGHT = this.weightGP;

      loadTemplate('templates/rankingList.html',function(responseText) {
              let out = template(responseText,scope);
              document.getElementById('content').innerHTML = eval('`' + out + '`');
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
                          let gt = that.gradedTasks.get(parseInt(idGradedTask));
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
      document.getElementById('content').innerHTML = '';
    }
  }
  /** Settings */
  settings() {
    let thisContext = this;
    let callback = function(responseText) {
      document.getElementById('content').innerHTML = responseText;
      let itemWeightChanger = $('#weightChanger');
      itemWeightChanger.val(thisContext.weightXP);
      let labelXPWeight = document.getElementById('idXPweight');
      labelXPWeight.innerHTML = thisContext.weightXP + '% XP weight';
      let labelGPWeight = document.getElementById('idGPweight');
      labelGPWeight.innerHTML = thisContext.weightGP + '% GP weight';
      itemWeightChanger.change(function() {
          labelXPWeight.innerHTML = itemWeightChanger.val() + '% XP weight';
          thisContext.weightXP = itemWeightChanger.val();
          setCookie('weightXP',thisContext.weightXP,300);
          labelGPWeight.innerHTML = (100 - itemWeightChanger.val()) + '% GP weight';
          thisContext.weightGP = (100 - itemWeightChanger.val());
          setCookie('weightGP',thisContext.weightGP,300);
        });
      console.log('Settings: To implement');
    }.bind(this);
    loadTemplate('templates/settings.html',callback);
  }
  /** Add last action performed to lower information layer in main app */
  notify(text,title) {
    toastr.options.timeOut = 4500;
    toastr.options.hideDuration = 250;
    toastr.options.showDuration = 250;
    toastr.success(text, title);   
  }
}
export let context = new Context(); //Singleton export
