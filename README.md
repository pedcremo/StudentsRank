
http://blog.karmadust.com/automatic-node-js-deployments-on-a-linux-server-via-github/
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

# For production deployment
Start node server with forever <pre>npm start</pre>
Stop node server <pre>npm stop</pre>

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

gradedtasks branch
==================

# 2 points context.students conversion and app adaptation from array to Map
# 2 points basic routing mechanism
# 2 points CRUD student 
# 1 points CRUD gradedtasks
# 1 point jsdoc3 documentation up to date according to changes
# 1 point worthy css
# 1 More visible graded tasks feature implemented. A button to show one mode gradedtasks. We are able to see the last one when we create ranking list 

Optional -> 2 points Remove any createElement present in code (All tag generation templated based) 

SUPER GREAT: Implement a ng-repeat attribute inside basic template system (2 points more in the 1st term final mark)


templator branch
================
# 2 points. New settings menu button to fine tune % assigned to XP tasks and % Assigned to graded tasks. Save in localstorage at the moment 
# 1 point. Sort Students ranking taking into account new finalGrade() method aimed to calculate final grade using GT% and XP%
# 2 points. Enhance student form adding new field to upload an image profile to server using as name student id 
# 2 deploy inside docker container our app
# 1 updated documentation able to generate with jsdoc3
# 2 points custom css from scratch  

#docker. We want to create a container for our app

1. Install docker
2. docker run node:latest node --version //Try to find docker containers with latest node and npm packages installed
3. docker run -d -p 8000:8000 -v $(pwd):/src -w /src node:latest npm start
4. ckeck if running docker ps

Save docker container into a file -> docker save -o {path_dest_tar} {name_image} 
Ex. docker save -o /tmp/runking gifted_goldberg
Load docker container -> docker load -i runking.tar 

READ: getting started with docker blogs.msdn.microsoft.com


Apache + node
sudo a2enmod proxy.load
sudo a2enmod proxy_html.load
sudo a2ensite runking.conf
