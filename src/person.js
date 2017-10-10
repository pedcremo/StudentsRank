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
        this.gradedTasks.push(taskInstance);
  }

  getHTMLView() {
    var liEl = document.createElement("tr");

    /*var tdEl = document.createElement("td");
    var t = document.createTextNode(this.surname + ", " + this.name); // Create a text node
    //liEl.setAttribute("id",hashcode(this.surname + ", " + this.name));     
    tdEl.appendChild(t);*/


    liEl.appendChild(getElementTd(this.surname + ", " + this.name));

    liEl.appendChild(getElementTd(this.points));

    /*var td2El = document.createElement("td");
    var t2 = document.createTextNode(this.points);
    td2El.appendChild(t2);
    liEl.appendChild(td2El);*/

    
    var addPointsEl = document.createElement("button");
    var tb = document.createTextNode("+20");
    addPointsEl.appendChild(tb);

    liEl.appendChild(getElementTd(addPointsEl));

    //studentsEl.appendChild(liEl);
    //liEl.appendChild(addPointsEl);

    liEl.addEventListener("click", () => {
          this.addPoints(20);
          setTimeout(function(){this.context.getRanking()}.bind(this),1000);
    });
    return liEl;
  }
}

export default Person;