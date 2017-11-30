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
  constructor(name,description,points) {
    super(name,description);
    this.points = points;
  }
  /** Open window dialog associated to a person instance and let us award him with some XP points */
  static addXP(personInstance) {
    /*let popUpXP = popupwindow('templates/listAttitudeTasks.html','XP points to ' +
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
    };*/
    let callback = function(responseText) {
      $('#content').html($('#content').html() + responseText);
      let dialog = $('#dialog-form').dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
          'Create an account': addTask,
          Cancel: function() {
            dialog.dialog('close');
          }
        },
        close: function() {
          form[ 0 ].reset();
          allFields.removeClass('ui-state-error');
        }
      });
      dialog.dialog('open');
      let form = dialog.find('form').on('submit', function(event) {
        event.preventDefault();
        addTask();
      });
    }
    loadTemplate('templates/listAttitudeTasks.1.html',callback);
  }
}

function addTask() {

}
export default AttitudeTask;
