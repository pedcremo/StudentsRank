'use strict';

import {context} from './context.js'; //Singleton
import {popupwindow,getIdFromURL} from './utils.js';
import {logout} from './menu.js';
import AttitudeTask from './attitudetask.js';

/** Once the page is loaded we get a context app object an generate students rank view. */
window.onload = function() {
  context.isLogged();
};

/** Primitive routing mechanism we hope in future will be brave enought to  implement a ng-repeat feature at least*/
window.onclick = function(e) {
  e = e || event;
  var isLink = findParent('a',e.target || e.srcElement);
  if (isLink) {
    switch (true) {
      /** View Student information detail */
      case /#student/.test(isLink.href):
        let personInstance = context.getPersonById(getIdFromURL(isLink.href));
        personInstance.getHTMLDetail();
        break;
      /** Modify student information */
      case /#editStudent/.test(isLink.href):
        personInstance = context.getPersonById(getIdFromURL(isLink.href));
        personInstance.getHTMLEdit();
        break;
      /** Delete student with confirmation */
      case /#deleteStudent/.test(isLink.href):
        if (window.confirm('Are you sure?')) {
          context.students.delete(parseInt(getIdFromURL(isLink.href)));
          context.getTemplateRanking();
        }
        break;
      /** Show popup associated to an student in order to assign XP points  */
      case /#addXP/.test(isLink.href):
        personInstance = context.getPersonById(getIdFromURL(isLink.href));
        showXP(personInstance);
        break;
      /** Add new student form */
      case /#addStudent/.test(isLink.href):
        context.addPerson();
        break;
      case /#settings/.test(isLink.href):
        context.settings();
        break;
      /** logout */
      case /#logout/.test(isLink.href):
        logout();
        break;
      /** Button to show a one more graded task on ranking table list */
      case /#MoreGradedTasks/.test(isLink.href):
        context.showNumGradedTasks++;
        context.getTemplateRanking();
        break;
      /** Add new Graded Task form */
      case /#addGradedTask/.test(isLink.href):
        context.addGradedTask();
        break;
      case /#detailGradedTask/.test(isLink.href):
        let gtInstance = context.getGradedTaskById(getIdFromURL(isLink.href));
        gtInstance.getHTMLEdit();
        break;
      default:
        context.isLogged();
    }
  }
};

/** find first parent with tagName [tagname] so nested links <a> are triggered too */
function findParent(tagname,el) {
  while (el) {
    if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
      return el;
    }
    el = el.parentNode;
  }
  return null;
}

/** Open window dialog associated to a person instance and let us award him with some XP points */
function showXP(personInstance) {
  let popUpXP = popupwindow('templates/listAttitudeTasks.html','XP points to ' +
                                   personInstance.name,600,600);

  popUpXP.onload = function() {
    popUpXP.document.title = personInstance.name + ' ' +
                          personInstance.surname + ' XP points';
    let xpButtons = popUpXP.document.getElementsByClassName('xp');
    Array.prototype.forEach.call(xpButtons,function(xpBItem) {
      xpBItem.addEventListener('click', () => {
        popUpXP.close();
        personInstance.addAttitudeTask(new AttitudeTask('XP task',
                                  xpBItem.innerHTML,xpBItem.value));
      });
    });
  };
}
