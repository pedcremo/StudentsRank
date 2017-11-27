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

import {popupwindow} from '../lib/utils.js';

class AttitudeTask extends Task { 
  constructor(name,description,points) {
    super(name,description);
    this.points = points;
  }
  /** Open window dialog associated to a person instance and let us award him with some XP points */
  static addXP(personInstance) {
    let popUpXP = popupwindow('templates/listAttitudeTasks.html','XP points to ' +
                                      personInstance.name,600,600);

    popUpXP.onload = function() {
      popUpXP.document.title = personInstance.name + ' ' +
                          personInstance.surname + ' XP points';

      $(popUpXP.document.body).find('.xp').each(function(index) {
          $(this).click(function() {
            popUpXP.close();
            personInstance.addAttitudeTask(new AttitudeTask('XP task',
                                  $(this).val(),$(this).attr('value')));
          });
        });
    };
  }
}

export default AttitudeTask;
