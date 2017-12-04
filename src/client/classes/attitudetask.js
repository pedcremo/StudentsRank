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
 * @tutorial pointing-criteria
 */

import {popupwindow,loadTemplate} from '../lib/utils.js';

class AttitudeTask extends Task {
  constructor(name,description,points,id=null) {
    super(name,description,id);
    this.points = points;
  }
  /** Open window dialog associated to a person instance and let us award him with some XP points */
  static addXP(personInstance) {
    let callback = function(responseText) {
      $('#content').html($('#content').html() + eval('`' + responseText + '`'));
      $('#XPModal').modal('toggle');
      $('.xp').each(function(index) {
        $(this).click(function() {
          $('#XPModal').modal('toggle');
          $('.modal-backdrop').remove();
          personInstance.addAttitudeTask(new AttitudeTask('XP task',
            $(this).val(),$(this).attr('value')));
        });
      });
    }
    loadTemplate('templates/listAttitudeTasks.2.html',callback);
  }
}

/** TODO */
function addTask() {

}

function addTaskToPerson() {

}

export default AttitudeTask;
