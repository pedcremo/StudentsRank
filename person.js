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
  constructor(name,surname,points) {
    this.name = name;
    this.surname = surname;
    this.points = points;
  }    

  addPoints(points) {
        this.points += points;
  }
}

export default Person;