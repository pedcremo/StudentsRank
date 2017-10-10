class Task {
  constructor(name) {
    this.name = name;    
    this.points = 0;    
  }    

  addPoints(points) {
        this.points += points;
  }

}

export default Task;