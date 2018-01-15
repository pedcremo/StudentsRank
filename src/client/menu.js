'use strict';
import {context} from './context.js';
import {deleteCookie,setCookie,loadTemplate} from './lib/utils.js';
import {updateFromServer} from './dataservice.js';
import {events} from './lib/eventsPubSubs.js';

let settings = {};
events.subscribe('settings/change',(obj) => {
  settings = obj;
});
/** Show Menu  */
function showMenu() {
  $('#navbarNav').show();
}
/** Hide Menu */
function hideMenu() {
  let sel = $('#navbarNav');
  sel.show().hide();
}
/** Generate menu options taking into account logged in user */
function generateMenu() {
  let output = '';
  if (context.user.displayName) {
    output += '<li class="nav-item"><a class="nav-link" href="">' + context.user.displayName + '</a></li>';
  }
  let subjects = context.user.subjects;
  output += '<li class="nav-item"><select id="subjectsItems">';
  for (let i = 0;i < subjects.length;i++) {
    if (subjects[i] === context.user.defaultSubject) { 
      output += '<option selected value="' + subjects[i] + '">' + subjects[i] + '</option>';
    }else {
      output += '<option value="' + subjects[i] + '">' + subjects[i] + '</option>';
    }
  }
  output += '<option value="NEW subject">NEW subject</option>';
  output += '</select><br><span id="termMenu">' + settings.defaultTerm + '</span></li>';

  output += '<li class="nav-item"><a class="nav-link" href="#addStudent"><button class="btn btn-secondary"> + Student</button></a></li>';
  output += '<li class="nav-item"><a class="nav-link" href="#addGradedTask"><button class="btn btn-secondary"> + Graded task</button></a></li>';
  output += '<li class="nav-item"><a class="nav-link" href="#settings"><button class="btn btn-secondary">Settings</button></a></li>';

  if (context.user.displayName) {
    output += '<li class="nav-item"><a class="nav-link" href="#logout"><button class="btn btn-danger"> LOGOUT</button></a></li>';
  }
  $('#menuButtons').html(output);
  $('#subjectsItems').change(function() {
    let optionSubject = $(this).children(':selected').val();
    if (optionSubject === 'NEW subject') {
      console.log("addSubject in menu NEW subject selected");
      addSubject();
    }else {
      context.user.defaultSubject = optionSubject;
      setCookie('user',JSON.stringify(context.user),7);
      loadTemplate('api/changeSubject',function(response) {
        updateFromServer();
        //context.getTemplateRanking();
      },'GET','newsubject=' + optionSubject,false);
    }
  });
}
/** Logout. Delete session in server side and credentials in client side */
function logout() {
  context.user = '';
  deleteCookie('user');
  deleteCookie('connect.sid');
  hideMenu();
  loadTemplate('api/logout',function(response) {
                context.clear();
                context.login();
                document.location.href = '/';
              },'GET','',false);
}

function addSubject(funcCallback) {
  let callback = function(responseText) {
    $('#content').html($('#content').html() + responseText);
    //$('#content').html(responseText);
    //alert("epqoe");
    console.log('XIXI 0');
    loadTemplate('api/getSharedGroups',function(response) {
      let sharedGroups = JSON.parse(response);
      let option = '';
      option += '<option selected value=""></option>';
      for (let i=0;i<sharedGroups.length;i++){
        option += '<option value="'+ sharedGroups[i].defaultSubject + '">' + sharedGroups[i].defaultSubject+ ' - ' + sharedGroups[i].hits + ' students</option>';
      }
      console.log('XIXI 1');
      $('#sharedGroups').append(option);
    },'GET','',false);

    $('#SubjectModal').modal('toggle');
    let prova = $('#newSubject');
    if (!prova.length) {
      console.log('MACHO #newSubject dont select');
    }else{
      console.log('XIXI 2');
    }
    
    prova.on("submit",(event) => {
      //alert("SUBMIT newSubject");
      event.preventDefault();
      loadTemplate('api/addSubject',function(response) {
        context.user.defaultSubject = $('#subjectName').val();
        context.user.subjects.push($('#subjectName').val());
        //updateFromServer();
        //updateFromServer();
        $('#SubjectModal').modal('toggle');
        $('.modal-backdrop').remove();
        //document.location.href = '/';
        events.publish('/context/newGradedTask',null);
        if (funcCallback) funcCallback();
        
      },'GET','newSubject=' + $('#subjectName').val() + '&sharedGroup=' + $('select[name=sharedGroups]').val(),false);
      //return false; //Abort submit
    });
  };
  loadTemplate('templates/addSubject.html',callback);
}
export {generateMenu,addSubject,logout,showMenu,hideMenu};