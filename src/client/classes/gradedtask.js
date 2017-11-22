'use strict';

import Task from './task.js';
import {loadTemplate,hashcode} from '../lib/utils.js';
import {saveGradedTasks} from '../dataservice.js';
import {context} from '../context.js';

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

const STUDENT_MARKS = Symbol('STUDENT_MARKS'); /** To acomplish private property */

class GradedTask extends Task {
  constructor(name,description,weight,studentsMark,id=null) {
    super(name,description,id);
    this.weight = weight;
    this.studentsMark = studentsMark;
    this[STUDENT_MARKS] = new Map(studentsMark); //We need a private map to make it easier to access student marks using its id. The problem is that a Map inside other map can be converted to a pair array
  }
  /** Add student mark using his/her person ID   */
  addStudentMark(idStudent,markPoints) {
    this[STUDENT_MARKS].set(parseInt(idStudent),markPoints);
    this.studentsMark = [...this[STUDENT_MARKS].entries()];
    saveGradedTasks(JSON.stringify([...context.gradedTasks]));
  }
  /** Static method to get list marks associated with one student */
  static getStudentMarks(idStudent) {
    let marks = [];
    context.gradedTasks.forEach(function(valueGT,keyGT,gradedTasks_) {
      marks.push([valueGT.getId(),valueGT[STUDENT_MARKS].get(idStudent)]);
     });
    return marks;
  }
  /** Calculate total graded points associated to one student */
  static getStudentGradedTasksPoints(idStudent) {
    let points = 0;
    context.gradedTasks.forEach(function(itemTask) {
        points += itemTask[STUDENT_MARKS].get(idStudent) * (itemTask.weight / 100);
      });
    return Math.round((points * 100) / 100);
  }
  /** CAlculate total aggregated GT weight */
  static getGradedTasksTotalWeight() {
    let points = 0;
    context.gradedTasks.forEach(function(itemTask) {
        points += parseInt(itemTask.weight);
      });
    return points;
  }
  /** Get student mark by their person ID */
  getStudentMark(idStudent) {
    return this[STUDENT_MARKS].get(idStudent);
  }

  getHTMLEdit() {
    let callback = function(responseText) {
      document.getElementById('content').innerHTML = responseText;
      let saveGradedTask = document.getElementById('newGradedTask');
      document.getElementById('idTaskName').value = this.name;
      document.getElementById('idTaskDescription').value = this.description;
      let totalGTweight = GradedTask.getGradedTasksTotalWeight();
      let weightIput = document.getElementById('idTaskWeight');
      document.getElementById('labelWeight').innerHTML = 'Weight (0-' + (100 - (totalGTweight - this.weight)) + '%)';
      weightIput.value = this.weight;
      weightIput.setAttribute('max', 100 - (totalGTweight - this.weight));

      saveGradedTask.addEventListener('submit', () => {
        let oldId = this.getId();
        this.name = document.getElementById('idTaskName').value;
        this.description = document.getElementById('idTaskDescription').value;
        this.weight = document.getElementById('idTaskWeight').value;
        let gradedTask = new GradedTask(this.name,this.description,this.weight,this.studentsMark,this.id);
        context.gradedTasks.set(this.id,gradedTask);
        saveGradedTasks(JSON.stringify([...context.gradedTasks]));
      });
    }.bind(this);

    loadTemplate('templates/addGradedTask.html',callback);
  }
  /** Create a form to create a GradedTask that will be added to every student */
  static addGradedTask() {
    let callback = function(responseText) {
            document.getElementById('content').innerHTML = responseText;
            let saveGradedTask = document.getElementById('newGradedTask');
            let totalGTweight = GradedTask.getGradedTasksTotalWeight();
            document.getElementById('labelWeight').innerHTML = 'Task Weight (0-' + (100 - totalGTweight) + '%)';
            let weightIput = document.getElementById('idTaskWeight');
            weightIput.setAttribute('max', 100 - totalGTweight);

            saveGradedTask.addEventListener('submit', () => {
              let name = document.getElementById('idTaskName').value;
              let description = document.getElementById('idTaskDescription').value;
              let weight = document.getElementById('idTaskWeight').value;
              let gtask = new GradedTask(name,description,weight,[]);
              let gtaskId = gtask.getId();
              if (context) {
                context.students.forEach(function(studentItem,studentKey,studentsRef) {
                  gtask.addStudentMark(studentKey,0);
                });
                context.gradedTasks.set(gtaskId,gtask);
                saveGradedTasks(JSON.stringify([...context.gradedTasks]));
                context.getTemplateRanking();
              }
              return false; //Avoid form submit
            });
          }.bind(this);

    loadTemplate('templates/addGradedTask.html',callback);
  }
}

export default GradedTask;
