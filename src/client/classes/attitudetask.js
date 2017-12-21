import Task from './task.js';

/**
 * AttitudeTask class. Create a attitude task in order to be
 * assigned to an individual or group of students. This could be for
 * example , participative attitude at class. Point a good 
 * question in class. Be the first finishing some exercise ...
 * 
 * @constructor
 * @param {string} name - task name
 * @param {string} description - task description
 * @param {string} points - task points associated to that behaviour
 * @param {string} hits - times an attitudeTask has been used by everyone
 * @tutorial pointing-criteria
 */

import {popupwindow,loadTemplate} from '../lib/utils.js';
import {template} from '../lib/templator.js';
import {events} from '../lib/eventsPubSubs.js';

let attitudeTasks = new Map();

events.subscribe('dataservice/getAttitudeTasks',(obj) => {
  let attitudeTasks_ = new Map(JSON.parse(obj));
  attitudeTasks_.forEach(function(value_,key_,attitudeTasks_) {
      attitudeTasks_.set(key_,new AttitudeTask(value_.name,value_.description,value_.points,
        value_.hits,value_.id));
    });
  attitudeTasks = attitudeTasks_;
  events.publish('attitudeTask/change',attitudeTasks);
});

class AttitudeTask extends Task {
  constructor(name,description,points,hits=0,id=null) {
    super(name,description,id);
    this.points = points;
    this.hits = hits;
    this.type = (this.points >= 0) ? 'success' : 'danger';//Positive or negative attitude
  }
  static getAttitudeTasks() {
    return attitudeTasks;
  }
  /** Open window dialog associated to a person instance and let us award him with some XP points */
  static addXP(personInstance) {
    let that = this;
    let callback = function(responseText) {
      let scope = {};
      scope.TPL_ATTITUDE_TASKS = [...attitudeTasks.entries()];
      scope.TPL_ATTITUDE_TASKS.sort(function(a,b) {
        return (b[1].hits - a[1].hits);
      });
      attitudeTasks = new Map(scope.TPL_ATTITUDE_TASKS);

      let out = template(responseText,scope);
      $('#content').html($('#content').html() + eval('`' + out + '`'));
      $('#XPModal').modal('toggle');

      $('.xp').each(function(index) {
        $(this).click(function() {
          $('#XPModal').modal('toggle');
          $('.modal-backdrop').remove();
          let at = attitudeTasks.get(parseInt($(this).attr('idat')));
          at.hits++;
          personInstance.addAttitudeTask(at);
        });
      });

      $('#newAttitudeTask').submit((event) => {
        event.preventDefault();
        let points = $('#points').val();
        let description = $('#description').val();
        let at = new AttitudeTask(description,description,points);
        attitudeTasks.set(at.id,at);

        events.publish('dataservice/saveAttitudeTasks',JSON.stringify([...attitudeTasks]));    
        events.publish('attitudeTask/change',attitudeTasks);
        $('#XPModal').modal('toggle');
        $('.modal-backdrop').remove();
        at.hits++;
        personInstance.addAttitudeTask(at);
        return false; //Abort submit
      });
    };
    loadTemplate('templates/listAttitudeTasks.html',callback);
  }
  static getAttitudeById(idTask) {
    return attitudeTasks.get(idTask);
  }
}

export default AttitudeTask;