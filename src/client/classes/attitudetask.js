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
import {context} from '../context.js';
import {saveAttitudeTasks} from '../dataservice.js';
import {template} from '../lib/templator.js';

class AttitudeTask extends Task {
  constructor(name,description,points,hits=0,id=null) {
    super(name,description,id);
    this.points = points;
    this.hits = hits;
  }
  /** Open window dialog associated to a person instance and let us award him with some XP points */
  static addXP(personInstance) {
    let that = this;
    let callback = function(responseText) {
      let scope = {};
      scope.TPL_ATTITUDE_TASKS = [...context.attitudeTasks.entries()];
      let out = template(responseText,scope);
      $('#content').html($('#content').html() + eval('`' + out + '`'));
      $('#XPModal').modal('toggle');

      $('.xp').each(function(index) {
        $(this).click(function() {
          $('#XPModal').modal('toggle');
          $('.modal-backdrop').remove();
          personInstance.addAttitudeTask($(this).attr('idAT'));
          //personInstance.addAttitudeTask(new AttitudeTask('XP task',
          //  $(this).val(),$(this).attr('value'))); //TODO
        });
      });

      $('#newAttitudeTask').submit(() => {
        let points = $('#points').val();
        let description = $('#description').val();
        context.attitudeTasks.set(that.id,new AttitudeTask(description,description,points));
        saveAttitudeTasks(JSON.stringify([...context.attitudeTasks]));
      });
    };
    loadTemplate('templates/listAttitudeTasks.2.html',callback);
  }
}

/** TODO */
function addTask() {
}

function addTaskToPerson() {

}

export default AttitudeTask;