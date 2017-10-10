(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _person = require('./person.js');

var _person2 = _interopRequireDefault(_person);

var _gradedtask = require('./gradedtask.js');

var _gradedtask2 = _interopRequireDefault(_gradedtask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Context = function () {
    function Context() {
        _classCallCheck(this, Context);

        this.students = [new _person2.default("Paco", "Vañó", 5, this), new _person2.default("Lucia", "Botella", 10, this), new _person2.default("German", "Ojeda", 3, this), new _person2.default("Salva", "Peris", 1, this), new _person2.default("Oscar", "Carrion", 40, this)];
    }

    _createClass(Context, [{
        key: 'getRanking',
        value: function getRanking() {
            this.students.sort(function (a, b) {
                return b.points - a.points;
            });

            var studentsEl = document.getElementById("llistat");
            //studentsEl.innerHTML = "";
            while (studentsEl.firstChild) {
                studentsEl.removeChild(studentsEl.firstChild);
            }

            this.students.forEach(function (studentItem) {
                var liEl = studentItem.getHTMLView();
                studentsEl.appendChild(liEl);
            });
        }
    }, {
        key: 'addGradedTask',
        value: function addGradedTask(name) {
            //let task = New Task(name);
            var taskName = prompt("Please enter your task name");

            this.students.forEach(function (studentItem) {
                //let gTask = new GradedTask(name);
                studentItem.addGradedTask(new _gradedtask2.default(taskName));
            });
        }
    }]);

    return Context;
}();

exports.default = Context;

},{"./gradedtask.js":2,"./person.js":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GradedTask = function () {
  function GradedTask(name) {
    _classCallCheck(this, GradedTask);

    this.name = name;
    this.points = 0;
  }

  _createClass(GradedTask, [{
    key: "addPoints",
    value: function addPoints(points) {
      this.points += points;
    }
  }]);

  return GradedTask;
}();

exports.default = GradedTask;

},{}],3:[function(require,module,exports){
'use strict';

var _context = require('./context.js');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
  var context = new _context2.default();
  context.getRanking();
};

},{"./context.js":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Person prototype. We store personal information and points that reflect daily classroom job
 *
 * @constructor
 * @param {string} name - Person name
 * @param {string} surname - Person surname
 * @param {number} points - Person points 
 * @tutorial pointing-criteria
 */

var Person = function () {
  function Person(name, surname, points, context) {
    _classCallCheck(this, Person);

    this.name = name;
    this.surname = surname;
    this.points = points;
    this.context = context;
  }

  _createClass(Person, [{
    key: "addPoints",
    value: function addPoints(points) {
      this.points += points;
    }
  }, {
    key: "addGradedTask",
    value: function addGradedTask(taskInstance) {
      this.tasks.push(taskInstance);
    }
  }, {
    key: "getHTMLView",
    value: function getHTMLView() {
      var _this = this;

      var liEl = document.createElement("li");
      var t = document.createTextNode(this.surname + ", " + this.name + ", " + this.points + " "); // Create a text node
      liEl.appendChild(t);

      var addPointsEl = document.createElement("button");
      var tb = document.createTextNode("+20");
      addPointsEl.appendChild(tb);

      //studentsEl.appendChild(liEl);
      liEl.appendChild(addPointsEl);

      liEl.addEventListener("click", function () {
        _this.addPoints(20);
        setTimeout(function () {
          this.context.getRanking();
        }.bind(_this), 1000);
      });
      return liEl;
    }
  }]);

  return Person;
}();

exports.default = Person;

},{}]},{},[3]);
