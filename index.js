const config=require('config');
const express = require('express');
const app=express();
const routerData=require('./StartUpScripts/RoutesData/RouteData');
const nodeConfig=require('./StartUpScripts/NodeConfiguration/NodeConfiguration');
const mongoDB=require('./StartUpScripts/MongoDBConnect/MongoDBConnect');

nodeConfig(app);
routerData(app);
mongoDB();

app.listen(config.util.getEnv('HOSTNAME'),() =>
          {console.log(`server is running on port ${config.util.getEnv('HOSTNAME')}`)});