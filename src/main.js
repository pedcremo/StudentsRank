'use strict';

import {context} from './context.js';

/** Once the page is loaded we get a context app object an generate students rank view. */
window.onload = function() {
  context.initMenu();
  context.getTemplateRanking();
};


/** Primitive routing mechanism */
window.onclick = function(e) {
  e = e || event;
  var isLink = findParent('a',e.target || e.srcElement);
  if (isLink) {
    //window.alert('LINK');
    switch (true) {
      case /#student/.test(isLink.href):
        let reg = /([0-9,-]*)$/gi;
        let matchResults = isLink.href.match(reg);
        let personInstance = context.getPersonById(matchResults[0]);
        personInstance.getHTMLDetail();
        break;
      case /#platan/.test(isLink.href):
        window.alert('platan');
        break;
      default:
        window.location.pathname = '';
    }
  }
};

//find first parent with tagName [tagname] so nested a are triggered too
function findParent(tagname,el) {
  while (el) {
    if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
      return el;
    }
    el = el.parentNode;
  }
  return null;
}
