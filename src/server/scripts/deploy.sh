#!/bin/bash
cd /home/pedcremo/StudentsRank
git checkout experimental
git pull origin experimental
npm install
npm restart
#node_modules/forever/bin/forever start src/server/hook.js