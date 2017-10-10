/**
 * Person prototype. We store personal information and points that reflect daily classroom job
 *
 * @constructor
 * @param {string} name - Person name
 * @param {string} surname - Person surname
 * @param {number} points - Person points 
 * @tutorial pointing-criteria
 */ 
 

class Person {
  constructor(name,surname,points,context) {
    this.name = name;
    this.surname = surname;
    this.points = points;
    this.context = context;    
  }    

  addPoints(points) {
        this.points += points;
  }

  addGradedTask(taskInstance) {
        this.tasks.push(taskInstance);
  }
  getHTMLView() {
    var liEl = document.createElement("li");
    var t = document.createTextNode(this.surname + ", " + this.name + ", " + this.points + " "); // Create a text node
    liEl.appendChild(t);

    var addPointsEl = document.createElement("button");
    var tb = document.createTextNode("+20");
    addPointsEl.appendChild(tb);

    //studentsEl.appendChild(liEl);
    liEl.appendChild(addPointsEl);

    liEl.addEventListener("click", () => {
          this.addPoints(20);
          setTimeout(function(){this.context.getRanking()}.bind(this),1000);
    });
    return liEl;
  }
}

export default Person;