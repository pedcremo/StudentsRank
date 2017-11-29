'use strict';
import {context} from './context.js';
import {deleteCookie,loadTemplate} from './lib/utils.js';

/** Show Menu  */
function showMenu() {
  $('#navbarNav').show();
}
/** Hide Menu */
function hideMenu() {
  $('navbarNav').hide();
}
/** Generate menu options taking into account logged in user */
function generateMenu() {
  let output = '';
  if (context.user.displayName) {
    output += '<li class="nav-item"><a class="nav-link" href="">Welcome ' + context.user.displayName + '</a></li>';
  }
  output += '<li class="nav-item"><a class="nav-link" href="#addStudent"><button class="btn btn-secondary"> + Student</button></a></li>';
  output += '<li class="nav-item"><a class="nav-link" href="#addGradedTask"><button class="btn btn-secondary"> + Graded task</button></a></li>';
  output += '<li class="nav-item"><a class="nav-link" href="#settings"><button class="btn btn-secondary">Settings</button></a></li>';

  if (context.user.displayName) {
    output += '<li class="nav-item"><a class="nav-link" href="#logout"><button class="btn btn-danger"> LOGOUT</button></a></li>';
  }
  $('#menuButtons').html(output);
}
/** Logout. Delete session in server side and credentials in client side */
function logout() {
  context.user = '';
  deleteCookie('user');
  deleteCookie('connect.sid');

  loadTemplate('api/logout',function(response) {
                context.clear();
                context.login();
              },'GET','',false);
}
export {generateMenu,logout,showMenu,hideMenu};