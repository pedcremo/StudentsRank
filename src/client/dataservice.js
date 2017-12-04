import {loadTemplate} from './lib/utils.js';
import {context} from './context.js'; //Singleton
import Person from './classes/person.js';
import GradedTask from './classes/gradedtask.js';
import AttitudeTask from './classes/attitudetask.js';

/** Get students and grades from server and maintains a local copy in localstorage */
function updateFromServer() {
  if (context.user.id) {
    loadTemplate('api/getStudents',function(response) {
                            loadStudents(response);
                            context.getTemplateRanking();
                          },'GET','',false);

    loadTemplate('api/getGradedTasks',function(response) {
                          loadGradedTasks(response);
                          context.getTemplateRanking();
                        },'GET','',false);

    loadTemplate('api/getAttitudeTasks',function(response) {
                          loadAttitudeTasks(response);
                          context.getTemplateRanking();
                        },'GET','',false);
  }
}
/** Save students in server side */
function saveStudents(arrayStudents) {
  loadTemplate('api/saveStudents',function(response) {
                          console.log('SAVE STUDENTS ' + response);
                      },'POST',arrayStudents,false);

}
/** Save grades in server side */
function saveGradedTasks(arrayGT) {
  loadTemplate('api/saveGradedTasks',function(response) {
                          console.log('SAVE GRADED TASKS ' + response);
                        },'POST',arrayGT,false);
}

/** Save Attitude XP points in server side */
function saveAttitudeTasks(arrayAT) {
  loadTemplate('api/saveAttitudeTasks',function(response) {
                          console.log('SAVE ATTITUDE TASKS ' + response);
                        },'POST',arrayAT,false);
}

/** Load students from AJAX response and map to Person instances in context */
function loadStudents(studentsStr) {
  let students_ = new Map(JSON.parse(studentsStr));
  students_.forEach(function(value_,key_,students_) {
      students_.set(key_,new Person(value_.name,value_.surname,
          value_.attitudeTasks,value_.id));
    });
  context.students = students_;
}

/** Load graded tasks from AJAX response and map to GradedTasks instances in context */
function loadGradedTasks(gradedTasksStr) {
  let gradedTasks_ = new Map(JSON.parse(gradedTasksStr));
  gradedTasks_.forEach(function(value_,key_,gradedTasks_) {
      gradedTasks_.set(key_,new GradedTask(value_.name,value_.description,value_.weight,
          value_.studentsMark,value_.id));
    });
  context.gradedTasks = gradedTasks_;
}

/** Load attitude tasks (XP) from AJAX response and map to attitudeTasks instances in context */
function loadAttitudeTasks(attitudeTasksStr) {
  let attitudeTasks_ = new Map(JSON.parse(attitudeTasksStr));
  attitudeTasks_.forEach(function(value_,key_,attitudeTasks_) {
      attitudeTasks_.set(key_,new AttitudeTask(value_.name,value_.description,value_.points,
          value_.id));
    });
  context.attitudeTasks = attitudeTasks_;
}


export {updateFromServer,saveStudents,saveGradedTasks};
