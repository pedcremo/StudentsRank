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

/** Pass a text or an element ang get a td table element wrapping it. */ 
function getElementTd(text) {
  let tdEl = document.createElement('td');
  let t = text;
  if (typeof text === 'string' || typeof text === 'number') {
    t = document.createTextNode(text); // Create a text node
  }
  tdEl.appendChild(t);
  return tdEl;
}

function deleteContent() {
  let contentEl = document.getElementById('content');

  while (contentEl.firstChild) {
    contentEl.removeChild(contentEl.firstChild);
  }
}

function loadTemplate(urlTemplate,callback) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      document.getElementById('content').innerHTML =
      this.responseText;
      callback(this.responseText);
    }
  };
  xhttp.open('GET', urlTemplate, true);
  xhttp.send();
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

export {formatDate,popupwindow,hashcode,getElementTd,deleteContent,loadTemplate};
