'use strict';

import Task from './task.js';
import {loadTemplate} from '../lib/utils.js';
import {template} from '../lib/templator.js';
import {events} from '../lib/eventsPubSubs.js';

/**
 * GradedTask class. Create a graded task in order to be evaluated 
 * for every student engaged. Theory tests and procedure practices 
 * are part of this category.
 * @constructor
 * @param {string} name - task name
 * @param {string} description - task description
 * @param {number} weight - task weight %
 * @param {number} id - task id default null when created for first time
 * @tutorial pointing-criteria
 */

let gradedTasks = new Map();
let settings = {};

events.subscribe('dataservice/getGradedTasks',(obj) => {
  gradedTasks = obj;
});

events.subscribe('dataservice/getSettings',(obj) => {
  settings = obj;
});

const STUDENT_MARKS = Symbol('STUDENT_MARKS'); /** To acomplish private property */

class GradedTask extends Task {
  constructor(name,description,weight,studentsMark,term,id=null) {
    super(name,description,id);
    this.weight = weight;
    this.studentsMark = studentsMark;
    if (!term) {
      term = settings.defaultTerm || '1st Term';
    }
    this.term = term;
    this[STUDENT_MARKS] = new Map(studentsMark); //We need a private map to make it easier to access student marks using its id. The problem is that a Map inside other map can be converted to a pair array
  }

  static getGradedTasks() {
    return gradedTasks;
  }
  /** Get a GradedTask instance by its ID */
  static getGradedTaskById(idHash) {
    return gradedTasks.get(parseInt(idHash));
  }
  /** Add student mark using his/her person ID   */
  addStudentMark(idStudent,markPoints) {
    this[STUDENT_MARKS].set(parseInt(idStudent),markPoints);
    this.studentsMark = [...this[STUDENT_MARKS].entries()];
    events.publish('dataservice/saveGradedTasks',JSON.stringify([...gradedTasks]));
    //saveGradedTasks(JSON.stringify([...gradedTasks]));
  }
  /** Static method to get list marks associated with one student */
  static getStudentMarks(idStudent) {
    let marks = [];
    gradedTasks.forEach(function(valueGT,keyGT,gradedTasks_) {
      marks.push([valueGT.getId(),valueGT[STUDENT_MARKS].get(idStudent)]);
     });
    return marks;
  }
  /** Calculate total graded points associated to one student */
  static getStudentGradedTasksPoints(idStudent) {
    let points = 0;

    gradedTasks.forEach(function(itemTask) {
        if (itemTask.term === settings.defaultTerm || settings.defaultTerm === 'ALL') {
          points += itemTask[STUDENT_MARKS].get(idStudent) * (itemTask.weight / 100);
        }
      });
    return Math.round((points * 100) / 100);
  }
  /** CAlculate total aggregated GT weight */
  static getGradedTasksTotalWeight() {
    let points = 0;
    gradedTasks.forEach(function(itemTask) {
      if (itemTask.term === settings.defaultTerm) {
        points += parseInt(itemTask.weight);
      }
    });
    return points;
  }
  /** Get student mark by their person ID */
  getStudentMark(idStudent) {
    return this[STUDENT_MARKS].get(idStudent);
  }

  getHTMLEdit() {
    let output = '';
    for (let i = 0;i < settings.terms.length;i++) {
      if (settings.terms[i].name === this.term) { 
        output += '<option selected value="' + settings.terms[i].name + '">' + settings.terms[i].name + '</option>';
      }else {
        output += '<option value="' + settings.terms[i].name + '">' + settings.terms[i].name + '</option>';
      }
    }
    let scope = {};
    scope.TPL_TERMS = output; 
    let callback = function(responseText) {
      let out = template(responseText,scope);
      $('#content').html(eval('`' + out + '`')); 
      $('#idTaskName').val(this.name);
      $('#idTaskDescription').val(this.description);
      let totalGTweight = GradedTask.getGradedTasksTotalWeight();
      let weightInput = $('#idTaskWeight');
      $('#labelWeight').html('Weight (0-' + (100 - (totalGTweight - this.weight)) + '%)');
      weightInput.val(this.weight);
      weightInput.attr('max', 100 - (totalGTweight - this.weight));

      $('#newGradedTask').submit(() => {
        let oldId = this.getId();
        this.name = $('#idTaskName').val();
        this.description = $('#idTaskDescription').val();
        this.weight = weightInput.val();
        let selectedTerm = $('#termTask').children(':selected').val();
        let gradedTask = new GradedTask(this.name,this.description,this.weight,this.studentsMark,selectedTerm,this.id);
        gradedTasks.set(this.id,gradedTask);
        events.publish('dataservice/saveGradedTasks',JSON.stringify([...gradedTasks]));
        //saveGradedTasks(JSON.stringify([...gradedTasks]));
      });
    }.bind(this);

    loadTemplate('templates/addGradedTask.html',callback);
  }
  /** Create a form to create a GradedTask that will be added to every student */
  static addGradedTask() {
    let output = '';
    for (let i = 0;i < settings.terms.length;i++) {
      if (settings.terms[i].name === settings.defaultTerm) { 
        output += '<option selected value="' + settings.terms[i].name + '">' + settings.terms[i].name + '</option>';
      }else {
        output += '<option value="' + settings.terms[i].name + '">' + settings.terms[i].name + '</option>';
      }
    }
    let scope = {};
    scope.TPL_TERMS = output; 

    let callback = function(responseText) {
            let out = template(responseText,scope);
            $('#content').html(eval('`' + out + '`')); 
            let totalGTweight = GradedTask.getGradedTasksTotalWeight();
            $('#labelWeight').html('Task Weight (0-' + (100 - totalGTweight) + '%)');
            let weightInput = $('#idTaskWeight');
            weightInput.attr('max', 100 - totalGTweight);

            $('#newGradedTask').submit(() => {
              let name = $('#idTaskName').val();
              let description = $('#idTaskDescription').val();
              let weight = weightInput.val();
              let selectedTerm = $('#termTask').children(':selected').val();
              let gtask = new GradedTask(name,description,weight,[],selectedTerm);
              //let gtaskId = gtask.getId();
              gradedTasks.set(gtask.id,gtask);
              events.publish('/context/newGradedTask',gtask);              
              return false; //Avoid form submit
            });
          }.bind(this);

    loadTemplate('templates/addGradedTask.html',callback);
  }
}

export default GradedTask;
