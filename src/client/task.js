/**
 * Task class. Create a task in order to be evaluated for every student engaged. 
 * @constructor
 * @param {string} name - task name
 * @param {string} description - task description
 * @param {number} id - task id default null when created for first time
 * @tutorial pointing-criteria
 */

import {hashcode} from './utils.js';

class Task {
  constructor(name,description,id=null) {
    this.name = name;
    this.description = description;
    this.datetime = new Date();
    if (!id) {
      this.id = hashcode(this.name + this.datetime);
    }else {
      this.id = id;
    }
  }

  /** Get id task hash based on name + datetime concatenation */
  getId() {
    return this.id;
  }
}

export default Task;
