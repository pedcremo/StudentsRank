'use strict';

import {context} from './context.js'; //Singleton
import {popupwindow} from './utils.js';
import AttitudeTask from './attitudetask.js';

/** Once the page is loaded we get a context app object an generate students rank view. */
window.onload = function() {
  context.getTemplateRanking();
};

/** Primitive routing mechanism we hope in future will be brave enought to  implement a ng-repeat feature at least*/
window.onclick = function(e) {
  e = e || event;
  var isLink = findParent('a',e.target || e.srcElement);
  if (isLink) {
    switch (true) {
      /** View Student information detail */
      case /#student/.test(isLink.href):
        let reg = /([0-9,-]*)$/gi;
        let matchResults = isLink.href.match(reg);
        let personInstance = context.getPersonById(matchResults[0]);
        personInstance.getHTMLDetail();
        break;
      /** Modify student information */
      case /#editStudent/.test(isLink.href):
        reg = /([0-9,-]*)$/gi;
        matchResults = isLink.href.match(reg);
        personInstance = context.getPersonById(matchResults[0]);
        personInstance.getHTMLEdit();
        break;
      /** Delete student with confirmation */
      case /#deleteStudent/.test(isLink.href):
        reg = /([0-9,-]*)$/gi;
        matchResults = isLink.href.match(reg);
        if (window.confirm('Are you sure?')) {
          context.students.delete(parseInt(matchResults[0]));
          context.getTemplateRanking();
        }
        break;
      /** Show popup associated to an student in order to assign XP points  */
      case /#addXP/.test(isLink.href):
        reg = /([0-9,-]*)$/gi;
        matchResults = isLink.href.match(reg);
        personInstance = context.getPersonById(matchResults[0]);
        showXP(personInstance);
        break;
      /** Add new student form */
      case /#addStudent/.test(isLink.href):
        context.addPerson();
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
        reg = /([0-9,-]*)$/gi;
        matchResults = isLink.href.match(reg);
        let gtInstance = context.getGradedTaskById(matchResults[0]);
        gtInstance.getHTMLEdit();
        break;
      default:
        context.getTemplateRanking();
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

/** Open window dialog associated to a person instance and let us grant him with some XP points */
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
