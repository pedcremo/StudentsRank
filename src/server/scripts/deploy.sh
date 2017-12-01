#!/bin/bash
git checkout experimental
git pull
npm install
npm stop
npm start
forever src/server/hook.js