import {loadTemplate} from './lib/utils.js';
import {context} from './context.js'; //Singleton
import Person from './classes/person.js';
import GradedTask from './classes/gradedtask.js';

/** Get students and grades from server and maintains a local copy in localstorage */
function updateFromServer() {
  if (context.user.id) {
    loadTemplate('api/getStudents',function(response) {
                            //localStorage.setItem('students',response);
                            loadStudents(response);
                            context.getTemplateRanking();
                          },'GET','',false);
    loadTemplate('api/getGradedTasks',function(response) {
                          //localStorage.setItem('gradedTasks',response);
                          loadGradedTasks(response);
                          context.getTemplateRanking();
                        },'GET','',false);
  }
}
/** Save students in localstorage and in server side */
function saveStudents(arrayStudents) {
  //localStorage.setItem('students',arrayStudents);
  loadTemplate('api/saveStudents',function(response) {
                          console.log('SAVE STUDENTS ' + response);
                        //},'POST',localStorage.getItem('students'),false);
                      },'POST',arrayStudents,false);

}
/** Save grades in localstorage and in server side */
function saveGradedTasks(arrayGT) {
  //localStorage.setItem('gradedTasks',arrayGT);
  loadTemplate('api/saveGradedTasks',function(response) {
                          console.log('SAVE GRADED TASKS ' + response);
                        },'POST',arrayGT,false);
}
/** Load students from AJAX response and map to Person instances in context */
function loadStudents(studentsStr) {
  //if (localStorage.getItem('students')) {
    let students_ = new Map(JSON.parse(studentsStr));
    students_.forEach(function(value_,key_,students_) {
        students_.set(key_,new Person(value_.name,value_.surname,
          value_.attitudeTasks,value_.id));
      });
    context.students = students_;
  }

//}
/** Load graded tasks from AJAX response and map to GradedTasks instances in context */
function loadGradedTasks(gradedTasksStr) {
  //if (localStorage.getItem('gradedTasks')) {
    let gradedTasks_ = new Map(JSON.parse(gradedTasksStr));
    gradedTasks_.forEach(function(value_,key_,gradedTasks_) {
        gradedTasks_.set(key_,new GradedTask(value_.name,value_.description,value_.weight,
          value_.studentsMark,value_.id));
      });
    context.gradedTasks = gradedTasks_;
  //}
}

export {updateFromServer,saveStudents,saveGradedTasks};
