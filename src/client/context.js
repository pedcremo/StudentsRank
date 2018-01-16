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
    if (getCookie('user')) {
      this.user = JSON.parse(getCookie('user'));
    }
    events.subscribe('/context/addXP', (obj) => { 
      let typeToastr = 'success';
      if (obj.attitudeTask.points < 0) {typeToastr = 'error';};
      this.notify('Added ' +  obj.attitudeTask.points + ' ' + obj.attitudeTask.description + ' to ' + obj.person.name + ',' + obj.person.surname, obj.person.surname + ' ,' + obj.person.name,typeToastr);
    });

    events.subscribe('/context/newGradedTask', (gtask) => {
      this.getTemplateRanking();
    });
  }
  /** Clear context  */
  clear() {
    this.user = undefined;
  }
  /* Check on server if user is logged */
  isLogged() {
    loadTemplate('api/loggedin',function(response) {
      /* Not logged */
      if (response === '0') {
        this.clear();
        this.login();
        return false;
      /* Login and getting user credential */
      }else {
        this.user = JSON.parse(response);
        /* Only call server if we not have loaded students */
        if (this.user.defaultSubject === 'default') {
          console.log("addSubject in isLogged");
          addSubject(updateFromServer);
        }else if (Person.getStudentsSize() <= 0) {
          updateFromServer();
        }else {
          this.getTemplateRanking();
        }
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
            /* First time we log in */
            if (that.user.defaultSubject === 'default') {
              console.log("addSubject in login");
              addSubject(updateFromServer);
              //updateFromServer();
            /* We are veteran/recurrent users */
            }else {
              setCookie('user',userData,7);
              updateFromServer();
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

  /** Draw Students ranking table in descendent order using total points as a criteria */
  getTemplateRanking() {
    generateMenu();
    Person.getRankingTable();
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