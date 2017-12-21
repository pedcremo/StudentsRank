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
  let gradedTasks_ = new Map(JSON.parse(obj));
  gradedTasks_.forEach(function(value_,key_,gradedTasks_) {
      gradedTasks_.set(key_,new GradedTask(value_.name,value_.description,value_.weight,
          value_.studentsMark,value_.term,value_.id));
    });

  gradedTasks = gradedTasks_;
  events.publish('gradedTask/change',gradedTasks);
});

events.subscribe('settings/change',(obj) => {
  settings = obj;
});

events.subscribe('students/new',(obj) => {
  gradedTasks.forEach(function(iGradedTask) {
    iGradedTask.addStudentMark(obj.getId(),0);
  });
});

class GradedTask extends Task {
  constructor(name,description,weight,studentsMark,term,id=null) {
    super(name,description,id);
    this.weight = weight;
    this.studentsMark = studentsMark;
    if (!term) {
      term = settings.defaultTerm || '1st Term';
    }
    this.term = term;
    this.studentsMarkMAP = new Map(studentsMark);
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
    this.studentsMarkMAP.set(parseInt(idStudent),markPoints);
    this.studentsMark = [...this.studentsMarkMAP.entries()];
    events.publish('dataservice/saveGradedTasks',JSON.stringify([...gradedTasks]));
    events.publish('gradedTask/change',gradedTasks);
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
    return this.studentsMarkMAP.get(idStudent);
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
        events.publish('gradedTask/change',gradedTasks);
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
              gradedTasks.set(gtask.id,gtask);
              events.publish('/context/newGradedTask',gtask);
              events.publish('dataservice/saveGradedTasks',JSON.stringify([...gradedTasks]));      
              events.publish('gradedTask/change',gradedTasks);
              return false; //Avoid form submit
            });
          }.bind(this);

    loadTemplate('templates/addGradedTask.html',callback);
  }
}

export default GradedTask;
