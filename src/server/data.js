var fs = require('fs');

/*module.exports = {
  saveStudents: saveStudents(),
  getStudents: getStudents(),
  saveGradedTasks: saveGradedTasks(),
  getGradedTasks: getGradedTasks()
};*/

module.exports = {
  getStudents: students,
  getGradedTasks: getGradedTasks
};

function saveStudents(studentsJSON) {
  fs.writeFile('src/server/data/students.json', studentsJSON, 'utf8', (err) => {
    if (err) {
      throw err;
    }
    console.log('The file has been saved!');
  });
}

function students() {
  console.log('hola-popo');
  fs.readFile('src/server/data/students.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log('hola err');
      console.log(err);
    } else {
      console.log('hola');
      return data;
    }});
}

function saveGradedTasks(gradedTasksJSON) {
  fs.writeFile('src/server/data/gradedtasks.json', gradedTasksJSON, 'utf8', (err) => {
    if (err) {
      throw err;
    }
    console.log('The file has been saved!');
  });
}

function  getGradedTasks() {
  fs.readFile('src/server/data/gradedtasks.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      return data;
    }});
}
