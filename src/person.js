/**
 * Person prototype. We store personal information and points that reflect daily classroom job
 *
 * @constructor
 * @param {string} name - Person name
 * @param {string} surname - Person surname
 * @param {number} points - Person points 
 * @tutorial pointing-criteria
 */ 
 
 import {hashcode,getElementTd} from './utils.js';

class Person {
  constructor(name,surname,points,context) {
    this.name = name;
    this.surname = surname;
    this.points = points;
    this.context = context;    
    this.gradedTasks = [];
  }    

  addPoints(points) {
        this.points += points;
  }

  addGradedTask(taskInstance) {
        this.gradedTasks.push({"task":taskInstance,"points":0});
        this.context.getRanking();
  }

  getHTMLView() {
    var liEl = document.createElement("tr");

    liEl.appendChild(getElementTd(this.surname + ", " + this.name));

    liEl.appendChild(getElementTd(this.points));    

    
    var addPointsEl = document.createElement("button");
    var tb = document.createTextNode("+20");
    addPointsEl.appendChild(tb);

    liEl.appendChild(getElementTd(addPointsEl));


    addPointsEl.addEventListener("click", () => {
          this.addPoints(20);
          setTimeout(function(){this.context.getRanking()}.bind(this),1000);
    });

    this.gradedTasks.forEach(function(gTaskItem) {      
      let inputEl = document.createElement("input");
      let that = this;
      inputEl.value = gTaskItem["points"]
      inputEl.addEventListener("change", function(event) {
        that.addPoints(gTaskItem["points"]*(-1));
        gTaskItem["points"] = inputEl.value;
        that.context.getRanking();
      });
      liEl.appendChild(getElementTd(inputEl));
  });
    
    return liEl;
  }
}

export default Person;