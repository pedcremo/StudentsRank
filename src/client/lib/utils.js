'use strict';

let CACHE_TEMPLATES = new Map();

/** Hash code funtion usefull for getting an unique id based on a large text */
function hashcode(str) {
  let hash = 0, i, chr;
  if (str.length === 0) {
    return hash;
  }
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function setCookie(cname, cvalue, exdays) {
  if (cvalue && cvalue !== '') {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }
}
function getCookie(cname) {
  let name = cname + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function deleteCookie(name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function loadTemplate(urlTemplate,callback,method='GET',params='',cached=true) {
  cached = false;
  if (CACHE_TEMPLATES.has(urlTemplate)) {
    return callback(CACHE_TEMPLATES.get(urlTemplate));
  }else {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        if (cached) {
          CACHE_TEMPLATES.set(urlTemplate,this.responseText);
        }
        callback(this.responseText);
      }
      if (this.status === 401) {
        if (urlTemplate === 'api/login') {
          $('#loginAlert').show().fadeOut(8000);
        }
      }
    };
    xhttp.open(method, urlTemplate, true);
    if (method === 'POST') {
      if (urlTemplate === 'api/saveStudents' || urlTemplate === 'api/saveGradedTasks' || urlTemplate === 'api/saveAttitudeTasks') {
        xhttp.setRequestHeader('Content-Type', 'application/json');
      }else if (urlTemplate === 'api/uploadImage') {
        console.log('uploading image'); //No special content-type
      }else {
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      }
    }
    xhttp.send(params);
  }
}

function popupwindow(url, title, w, h) {
  let left = (screen.width / 2) - (w / 2);
  let top = (screen.height / 2) - (h / 2);
  return window.open(url, title, 'toolbar=no, location=no, directories=no,' +
                    'status=no, menubar=no,scrollbars=no, resizable=no, copyhistory=no,' +
                    ' width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}

function formatDate(date) {
  var monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December'
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var minute = date.getMinutes();
  var hour = date.getHours();

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hour + ':' + minute;
}
function getIdFromURL(url) {
  let reg = /([0-9,-]*)$/gi;
  let matchResults = url.match(reg);
  return matchResults[0];
}

export {formatDate,popupwindow,hashcode,deleteCookie,setCookie,getCookie,loadTemplate,getIdFromURL};