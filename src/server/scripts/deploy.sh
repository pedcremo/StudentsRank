#!/bin/bash

git checkout master
git pull origin master
npm install
npm stop
npm start
