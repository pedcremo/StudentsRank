'use strict';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };


function template(responseTPL,scope) {
  //let virt = document.createElement('html');
  //virt.innerHTML = responseTPL;
  let parser = new DOMParser();
  let virt = parser.parseFromString(responseTPL, 'text/html');
  
  let elements = virt.querySelectorAll('[ng-repeat]');

  while (elements && elements[0]) {
    let repeatExpr = elements[0].getAttribute('ng-repeat');
    let words = /(\S*) in (\S*)/.exec(repeatExpr);
    if (words[2].startsWith('scope')) {
      let arrayIt = eval(words[2]);
      words[2] = words[2].substring(6, words[2].lenght); //Remove scope word from beginning
      explodeNode(virt,elements[0],arrayIt,words[1],words[2]);
    }else {
      explodeNode(virt,elements[0],scope[words[2]],words[1],words[2]);
    }
    elements = virt.querySelectorAll('[ng-repeat]');
  }
  //console.log(virt.getElementsByTagName('body')[0].innerHTML);
  //let output = eval('`' + virt.getElementsByTagName('body')[0].innerHTML + '`');
  return virt.getElementsByTagName('body')[0].innerHTML;
}

function explodeNode(virtDom,element,arrayItems,strReplace,strBase) {
  element.removeAttribute('ng-repeat');
  if (arrayItems && arrayItems.length > 0) {
    let str = '';
    let lastSibling = element;
    for (let i = 0;i < (arrayItems.length - 1);i++) {
      let cloned = element.cloneNode(true);
      str = cloned.innerHTML;
      str = str.replaceAll(strReplace,'scope.' + strBase + '[' + (i + 1) + ']');
      cloned.innerHTML = str;
      let parent = element.parentNode;
      parent.insertBefore(cloned,lastSibling.nextSibling);
      lastSibling = cloned;
    }
    str = element.innerHTML;
    str = str.replaceAll(strReplace,'scope.' + strBase + '[0]');
    element.innerHTML = str;
  }else {
    element.innerHTML = '';
  }
}

export {template};
