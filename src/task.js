/**
 * Task class. Create a task in order to be evaluated for every student engaged. 
 * @constructor
 * @param {string} name - task name
 * @param {string} description - task description
 * @tutorial pointing-criteria
 */

class Task {
  constructor(name,description) {
    this.name = name;
    this.description = description;
    this.datetime = new Date();
  }
}

export default Task;
