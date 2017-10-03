
'use strict';
import Person from './person.js';
debugger;
var students = [
  new Person("Paco", "Vañó", 5),
  new Person("Lucia", "Botella", 10),
  new Person("German", "Ojeda", 3),
  new Person("Salva", "Peris", 1),
  new Person("Oscar", "Carrion", 40),
];

function getRanking(students) {

  students.sort(function(a, b) {
    return (b.points - a.points)
  });

  var studentsEl = document.getElementById("llistat");
  //studentsEl.innerHTML = "";
  while (studentsEl.firstChild) {
    studentsEl.removeChild(studentsEl.firstChild);
  }
  students.forEach(function(studentItem) {
    var liEl = document.createElement("li");
    var t = document.createTextNode(studentItem.surname + ", " + studentItem.name + ", " + studentItem.points + " "); // Create a text node
    liEl.appendChild(t);

    var addPointsEl = document.createElement("button");
    var tb = document.createTextNode("+10");
    addPointsEl.appendChild(tb);

    studentsEl.appendChild(liEl);
    liEl.appendChild(addPointsEl);

    liEl.addEventListener("click", function() {
     
      studentItem.addPoints(10);
      setTimeout(function(){getRanking(students)},1000);
    });

    //console.log(studentItem.surname + ", "+studentItem.name+ ", "+studentItem.points ); 
  });

}


window.onload = function() {
  getRanking(students);
}