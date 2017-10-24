/**
 * Person class. We store personal information and attitudePoints that reflect daily classroom job
 *
 * @constructor
 * @param {string} name - Person name
 * @param {string} surname - Person surname
 * @param {array} attitudeTasks - Person awarded AttitudeTasks array   
 * @param {array} gradedTasks - Person gradedTasks array
 * @tutorial pointing-criteria
 */

import {formatDate,popupwindow,hashcode,getElementTd,loadTemplate} from './utils.js';
import {context} from './context.js';
import AttitudeTask from './attitudetask.js';

const privateAddTotalPoints = Symbol('privateAddTotalPoints'); /** To accomplish private method */
const _totalPoints = Symbol('TOTAL_POINTS'); /** To acomplish private property */

class Person {
  constructor(name,surname,attitudeTasks,gradedTasks) {
    this[_totalPoints] = 0;
    this.name = name;
    this.surname = surname;

    this.attitudeTasks = attitudeTasks;
    this.gradedTasks = gradedTasks;

    this.attitudeTasks.forEach(function (itemAT) {
      this[_totalPoints] += parseInt(itemAT['task'].points);
    }.bind(this));
    this.gradedTasks.forEach(function (itemGT) {
      this[_totalPoints] += parseInt(itemGT.points);
    }.bind(this));
  }

  /** Add points to persons we should carefully use it. */
  [privateAddTotalPoints] (points) {
    if (!isNaN(points)) {
      this[_totalPoints] += points;
      context.getTemplateRanking();
    }
  }

  /** Read person _totalPoints. A private property only modicable inside person instance */
  getTotalPoints() {
    return this[_totalPoints];
  }

  /** Add a gradded task linked to person with its own mark. */
  addGradedTask(taskInstance) {
    this.gradedTasks.push({'task':taskInstance,'points':0});
  }

  /** Add a Attitude task linked to person with its own mark. */
  addAttitudeTask(taskInstance) {
    this.attitudeTasks.push({'task':taskInstance});
    this[privateAddTotalPoints](parseInt(taskInstance.points));
    context.notify('Added ' + taskInstance.description + ' to ' + this.name + ',' + this.surname);
  }

  /** Renders HTML person view Create a table row (tr) with
   *  all name, attitudePoints , add button and one input for 
   * every gradded task binded for that person. */
  getHTMLView() {
    let liEl = document.createElement('tr');

    let esEL = getElementTd(this.surname + ', ' + this.name);
    esEL.addEventListener('click', () => {
      loadTemplate('templates/detailStudent.html',function(responseText) {
        let STUDENT = this;
        let ATTITUDE_TASKS = '';
        this.attitudeTasks.reverse().forEach(function(atItem) {
          ATTITUDE_TASKS += '<li>' + atItem.task.points + '->' +
                        atItem.task.description + '->' + formatDate(new Date(atItem.task.datetime)) + '</li>';
        });
        let GRADED_TASKS = '';
        this.gradedTasks.forEach(function(gtItem) {
          GRADED_TASKS += '<li>' + gtItem.points + '->' +
                        gtItem.task.name + '->' + formatDate(new Date(gtItem.task.datetime)) + '</li>';
        });
        document.getElementById('content').innerHTML = eval('`' + responseText + '`');
      }.bind(this));
    });

    liEl.appendChild(esEL);

    liEl.appendChild(getElementTd(this[_totalPoints]));

    let addAttitudeTaskEl = document.createElement('button');
    let tb = document.createTextNode('+XP');
    addAttitudeTaskEl.appendChild(tb);

    liEl.appendChild(getElementTd(addAttitudeTaskEl));

    addAttitudeTaskEl.addEventListener('click', () => {
          let popUp = popupwindow('templates/listAttitudeTasks.html','XP points to ' +
                                   this.name,300,400);
          let personInstance = this;
          popUp.onload = function() {
            popUp.document.title = personInstance.name + ' ' +
                                  personInstance.surname + ' XP points';
            let xpButtons = popUp.document.getElementsByClassName('xp');
            Array.prototype.forEach.call(xpButtons,function(xpBItem) {
              xpBItem.addEventListener('click', () => {
                popUp.close();
                personInstance.addAttitudeTask(new AttitudeTask('XP task',
                                          xpBItem.innerHTML,xpBItem.value));
              });
            });
          };
        });

    let that = this;

    this.gradedTasks.forEach(function(gTaskItem) {
        let inputEl = document.createElement('input');
        inputEl.type = 'number';
        inputEl.min = 0;
        inputEl.max = 100;
        inputEl.value = gTaskItem['points'];
        inputEl.addEventListener('change', function(event) {
            that[privateAddTotalPoints](parseInt(gTaskItem['points'] * (-1)));
            gTaskItem['points'] = inputEl.value;
            that[privateAddTotalPoints](parseInt(gTaskItem['points']));
          });
        liEl.appendChild(getElementTd(inputEl));
      });

    return liEl;
  }
}

export default Person;
