var fs = require('fs');

/*module.exports = {
  saveStudents: saveStudents(),
  getStudents: getStudents(),
  saveGradedTasks: saveGradedTasks(),
  getGradedTasks: getGradedTasks()
};*/

module.exports = {
  saveGradedTasks: saveGradedTasks,
  saveStudents: saveStudents
};

function saveStudents(studentsJSON) {
  console.log(JSON.stringify(studentsJSON));
  fs.writeFile('src/server/data/students.json', JSON.stringify(studentsJSON), 'utf8', (err) => {
    if (err) {
      throw err;
    }
    console.log('The file has been saved!');
  });
}

/*function students() {
    console.log('hola-popo');
    fs.readFile('src/server/data/students.json', 'utf8', function readFileCallback(err, data) {
      if (err) {
        console.log('hola err');
        console.log(err);
        return err;
      }else {
        console.log(data);
        return data;
      }
    });
}*/

function saveGradedTasks(gradedTasksJSON) {
  console.log('LLLLL ->' + JSON.stringify(gradedTasksJSON));
  fs.writeFile('src/server/data/gradedtasks.json', gradedTasksJSON, 'utf8', (err) => {
    if (err) {
      throw err;
    }
    console.log('The file has been saved!');
  });
}

/*function  getGradedTasks() {
  fs.readFile('src/server/data/gradedtasks.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      return data;
    }});
}*/
