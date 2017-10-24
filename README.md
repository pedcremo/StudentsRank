# Introduction 
The purpose of this project is to program a Students rank mini app using entiterly raw ES6 without the use
of any third party library. The aim is to learn as much as possible only in javascript.

Obviously we know that real web frontend development doesn't work this way, but the real chance now is, to 
focus on learning javascript in order to be able in the future to really appreciate how much useful is a framework or 3rd party library.

# Prerequisites
npm and node should be installed on your system
recommended npm version 3.5.0 or greater 
recommended node version 4.2.5 or greater 

Recommended but not mandatory to install gulp as a global package
<pre>
npm install -g gulp
</pre>

# First time we clone or download the project 
Install dependencies and modules used for development purposes
<pre>nmp install </pre>
We wait until node_modules folder has been filled with all development modules needed for our app

# For continous development 
Main gulp task
<pre>./node_modules/gulp/bin/gulp.js</pre> 
or 
<pre>gulp</pre> 
if has been installed globally.

Other interesting gukp tasks

*vet. For syntax and quality checking

# Key points about the development stack  we have chosen for this app

* Gulp as a mechanism to automate all our tasks: transpiling, concatenate, minify js code, pass code quality checkings, testing, launch test server ...
* ES6 as a base for all javascript code
* It is forbidden the use of any third party javascript library for deployment purposes. We program all with raw ES6
* Babel as a transpiler from ES6 code to ES5 code 100% compatible with all modern and quite old browser ecosystem
* SPA. Single page application. Business logic on client side at the maximum as possible
* We use npm and node only as developing helping tools never as modules to be used in the production environment.
* Intensive use of AJAX (consequence of SPA model)

# Interesting
ES6 Modules - Single Instance Pattern https://k94n.com/es6-modules-single-instance-pattern

ES6 template literals

# Worth to understand

* "This"common problems in javascript
* How Forms submit via post or get data
* AJAX technique
* CALLBACKS patterns in javascript
* Template system | ES6 template literals

