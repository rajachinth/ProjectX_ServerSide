const config=require('config');
const cors=require('cors');
const bodyParser=require('body-parser');

const NodeConfiguration = (app) => {
    
    process.env.HOSTNAME || 3000;
    process.env.NODE_ENV || 'development';

    process.on('uncaughtException',(error)=>{
        console.log(`uncaught execption:${error}`);
    })
    process.on('unhandledRejection',(error)=>{
        console.log(`unhandled rejections:${error}`);
    })
    if(!config.get('DB_Config')) process.exit(1);
    
    app.use(bodyParser.json({limit:'1000KB',type:'application/json'}));
    console.log(`Server running in "${config.util.getEnv('NODE_ENV')}" mode and on port "${config.util.getEnv('HOSTNAME')}"`);
    app.use(cors({
        origin:'*',
        allowedHeaders:'*',
        exposedHeaders:'*',
    }));
}

module.exports=NodeConfiguration;