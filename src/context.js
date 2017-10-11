import Person from './person.js';
import GradedTask from './gradedtask.js';
 import {hashcode,getElementTd} from './utils.js';

class Context {

  constructor() {
    this.students = [
        new Person("Paco", "Vañó", 5,this),
        new Person("Lucia", "Botella", 10,this),
        new Person("German", "Ojeda", 3,this),
        new Person("Salva", "Peris", 1,this),
        new Person("Oscar", "Carrion", 40,this)
    ]; 
    var addTask = document.getElementById("addGradedTask");
    addTask.addEventListener("click", () => {
          this.addGradedTask();
    });
    this.gradedTasks = [];
  }

  getRanking(){
        this.students.sort(function(a, b) {
            return (b.points - a.points)
        });

        var studentsEl = document.getElementById("llistat");
   
        while (studentsEl.firstChild) {
            studentsEl.removeChild(studentsEl.firstChild);
        }

        let headerString="<tr><td colspan='3'></td>";
        this.gradedTasks.forEach(function(taskItem){
            //studentsEl.appendChild(getElementTd(taskItem.name));
            headerString+="<td>"+taskItem.name+"</td>";
        });
        studentsEl.innerHTML= headerString;
        this.students.forEach(function(studentItem) {
            var liEl = studentItem.getHTMLView();
            studentsEl.appendChild(liEl);
        });
    }
   addGradedTask(){
        //let task = New Task(name);
        let taskName = prompt("Please enter your task name");
        let gtask = new GradedTask(taskName);
        this.gradedTasks.push(gtask);
        this.students.forEach(function(studentItem) {
            //let gTask = new GradedTask(name);
            studentItem.addGradedTask(gtask);
        });
        this.getRanking();
    }
}

export default Context;