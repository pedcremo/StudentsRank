/**
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 * @tutorial pointing-criteria
 */ 

import Person from './person.js';
import GradedTask from './gradedtask.js';
import {hashcode,getElementTd,deleteContent,loadTemplate} from './utils.js';
//let instance = null;

class Context {
  
  constructor() {
   
  
    this.students = [];
    this.gradedTasks = [];

    if (localStorage.getItem('students')){
        var students_ = JSON.parse(localStorage.getItem('students'));
        for (let i=0;i<students_.length;i++){
        //students_.forEach(function(itemStudent){
            var p = new Person(students_[i].name,students_[i].surname,students_[i].points,students_[i].gradedTasks);
            //p.gradedTasks = students_[i].gradedTasks;
            this.students.push(p);
        };
    };
    if (localStorage.getItem('gradedTasks')){
        this.gradedTasks = JSON.parse(localStorage.getItem('gradedTasks'));
    };    
   // return instance;  
  }

  initMenu(){
    let addTask = document.getElementById("addGradedTask");
    addTask.addEventListener("click", () => {
        this.addGradedTask();
    });
    let addStudent = document.getElementById("addStudent");
    addStudent.addEventListener("click", () => {
        this.addPerson();
    });
  }
  
  /** Draw Students rank table in descendent order using points as a criteria */
  getRanking(){

        if (this.students && this.students.length>0){
            this.students.sort(function(a, b) {
                return (b.points - a.points);
            });
            localStorage.setItem("students",JSON.stringify(this.students));
            let studentsEl = document.createElement("table");
            let contentEl = document.getElementById("content");
    
            deleteContent()

            contentEl.appendChild(studentsEl);

            let headerString="<tr><td colspan='3'></td>";
            this.gradedTasks.forEach(function(taskItem){            
                headerString+="<td>"+taskItem.name+"</td>";
            });
            studentsEl.innerHTML= headerString;
            this.students.forEach(function(studentItem) {
                var liEl = studentItem.getHTMLView();
                studentsEl.appendChild(liEl);
            });
        }
    }
    /** Create a form to create a GradedTask that will be added to every student */
   addGradedTask(){        
        let taskName = prompt("Please enter your task name");
        let gtask = new GradedTask(taskName);
        this.gradedTasks.push(gtask);
        localStorage.setItem('gradedTasks',JSON.stringify(this.gradedTasks));
        this.students.forEach(function(studentItem) {            
            studentItem.addGradedTask(gtask);
        });
        this.getRanking();
    }

    addPerson(){        

        var callback = function(){ 
            let saveStudent = document.getElementById("newStudent");
            saveStudent.addEventListener("submit", () => {
                //alert("Save student");
                let name = document.getElementById("idFirstName").value;
                let surnames = document.getElementById("idSurnames").value;
                let student = new Person(name,surnames,0,[]);
                this.gradedTasks.forEach(function(iGradedTask){                        
                        student.addGradedTask(new GradedTask(iGradedTask.name));
                });
                this.students.push(student);
                localStorage.setItem("students",JSON.stringify(this.students));
            });
        }.bind(this);

        loadTemplate('templates/addStudent.html',callback);

        
    }
}

export let context = new Context(); //Singleton export