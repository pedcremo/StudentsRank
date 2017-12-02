#!/bin/bash
cd /home/pedcremo/StudentsRank
git checkout experimental
git pull origin experimental
npm install
npm stop
npm start
node_modules/forever/bin/forever start src/server/hook.js