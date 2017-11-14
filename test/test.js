var text = '<table class="table table-striped table-hover"> ' +
'<thead class="thead-dark"> ' +
'   <tr><th>Name</th><th>Actions</th><th>XP Points</th><th></th><th>GT.name</th></tr> ' +
'   </thead> ' +
'   <tbody id="idTableRankingBody"> ' +
'       <tr ng-repeat="person in TPL_PERSONS"> ' +
'           <td> ' +
'               <a href="#student/${person.getId()}">${person.surname}, ${person.name}</a> ' +
'           </td> ' +
'           <td> ' +
'               <a href="#editStudent/${person.getId()}"><button class="btnS btn btn-success"> ' +
'               <i class="fa fa-pencil fa-1x"></i></button></a><a href="#deleteStudent/${person.getId()}"> ' +
'              <button class="btnS btn btn-danger"><i class="fa fa-trash-o fa-1x"></i></button></a> ' +
'          </td> ' +
'            <td> ' +
'                <strong>${person.getTotalPoints()}</strong> ' +
'            </td> ' +
'            <td> ' +
'                <a href="#addXP/${person.getId()}"><button class="btnS btn btn-primary">+XP</button></a> ' +
'            </td> ' +
'            <td ng-repeat="GT in GradedTasks"> ' +
'                <input type="number" class="gradedTaskInput" idPerson="${person.getId()}" idGradedTask="${GT}" min=0 max=100 value=""/> ' +
'            </td> ' +
'        </tr> ' +
'    </tbody> ' +
'</table>';

var virt = document.createElement('html');
virt.innerHTML = text;
var elements = virt.querySelectorAll('[ng-repeat]');
let scope = {};

let josep = {name:'Josep', surname:'Borrol',getId: function() {return 4;},getTotalPoints: function() {return 6}};
let pere = {name:'Pere', surname:'Cresp',getId: function() {return 4;},getTotalPoints: function() {return 6}};
let joan = {name:'Joan', surname:'Giner',getId: function() {return 4;},getTotalPoints: function() {return 6}};

scope.TPL_PERSONS = [josep,pere,joan];
scope.GradedTasks = ['first','second'];

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };

while (elements && elements[0]) {
  let repeatExpr = elements[0].getAttribute('ng-repeat');
  let words = /(\S*) in (\S*)/.exec(repeatExpr);
  explodeNode(virt,elements[0],scope[words[2]],words[1],words[2]);
  elements = virt.querySelectorAll('[ng-repeat]');
}
//console.log(virt.innerHTML);
//String.raw`virt.innerHTML`;
window.onload = function() {
  let cont = window.document.getElementById('content'); 
  cont.innerHTML = eval('`' + virt.getElementsByTagName('body')[0].innerHTML + '`');
}
//console.log(eval ('`' + virt.innerHTML + '`'));

function explodeNode(virtDom,element,arrayItems,strReplace,strBase) {
  element.removeAttribute('ng-repeat');
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
}
