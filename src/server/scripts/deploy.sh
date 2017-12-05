#!/bin/bash
cd /home/pedcremo/StudentsRank
git checkout master
git pull origin master
npm install
npm stop
npm start
#node_modules/forever/bin/forever start src/server/hook.js
