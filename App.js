const cluster    = require('cluster');
const express    = require('express');
const bodyParser = require('body-parser');
var cors         = require('cors');
const path    = require("path");
const dotenv     = require('dotenv');

const numCPUs = 1;

if (cluster.isMaster) {

    console.log(`Master ${process.pid} is running`);
  
    // Fork workers.
    console.log(numCPUs)
    for (let i = 0; i < 1; i++) {
      cluster.fork();
    }
  
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an Express application
    const app = express();

    // cors
    app.use(cors())

    // parse request to body parser
    app.use(bodyParser.json({extended:true,defer:true}));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.engine('html', require('ejs').renderFile);

    // Bad request
    app.use((err,req,res,next)=>{
        if ( err.status === 400 ) {
            res.status(400).send( {
                status: false,
                massage: "Bad request"
            } );
            return;
        }
        next();
    })

    app.use(express.static(path.join(__dirname, 'public')))

    // Routes
    app.use("/", require("./routes/views.route"));
    app.use("/api/dev/", require("./routes/dev.route"));
    app.use("/api/user/", require("./routes/user.route"));

    // Server configuration
    dotenv.config( {path: '.env/config.env'} );
    const port = process.env.PORT || 8081;

    app.listen( port, () => {
        console.log( 'Server is running on port ' + port + '\n=> http://localhost:' + port  );
    })

    console.log(`Worker ${process.pid} started`);
}