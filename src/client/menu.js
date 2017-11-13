'use strict'
import {context} from './context.js';
import {deleteCookie,loadTemplate} from './utils.js';

function generateMenu() {
  let output = '';
  if (context.user.displayName) {
    output += '<li class="nav-item"><a class="nav-link" href="">Welcome ' + context.user.displayName + '</a></li>';
  }
  output += '<li class="nav-item"><a class="nav-link" href="#addStudent"><button class="btn btn-secondary"> + Student</button></a></li>';
  output += '<li class="nav-item"><a class="nav-link" href="#addGradedTask"><button class="btn btn-secondary"> + Graded task</button></a></li>';
  if (context.user.displayName) {
    output += '<li class="nav-item"><a class="nav-link" href="#logout"><button class="btn btn-danger"> LOGOUT</button></a></li>';
  }
  document.getElementById('menuButtons').innerHTML = output;
}

function logout() {
  context.user = '';
  deleteCookie('user');
  deleteCookie('connect.sid');
  loadTemplate('api/logout',function(response) {
                context.login();
              },'GET','',false);
}
export {generateMenu,logout};
