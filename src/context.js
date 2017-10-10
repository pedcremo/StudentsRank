import Person from './person.js';


class Context {

  constructor() {
    this.students = [
        new Person("Paco", "Vañó", 5,this),
        new Person("Lucia", "Botella", 10,this),
        new Person("German", "Ojeda", 3,this),
        new Person("Salva", "Peris", 1,this),
        new Person("Oscar", "Carrion", 40,this)
    ]; 
  }

  getRanking(){
        this.students.sort(function(a, b) {
            return (b.points - a.points)
        });

        var studentsEl = document.getElementById("llistat");
        //studentsEl.innerHTML = "";
        while (studentsEl.firstChild) {
            studentsEl.removeChild(studentsEl.firstChild);
        }

        this.students.forEach(function(studentItem) {
            var liEl = studentItem.getHTMLView();
            studentsEl.appendChild(liEl);
        });
    }
}

export default Context;