#!/bin/bash
rm -rf ./db
mkdir db
NODE_ENV=development node_modules/.bin/sequelize db:migrate
NODE_ENV=development node_modules/.bin/sequelize db:seed:all
