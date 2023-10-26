 // Required External Modules

 import * as dotenv from "dotenv";
 import express from "express";
 import cors from "cors";
 import helmet from "helmet";
 
 dotenv.config()
 
 // Required Database Modules
 
 
 
 // App Variables
 
 const PORT: number = parseInt(process.env.PORT as string, 10) || 7001;
 const ENV: string = process.env.ENVIRONMENT?.toLowerCase() as string || 'local_dev';
 
 const app = express();
 
 // App Configuration
 
 // Enables and sets defaults for a myriad of small middleware packages that set HTTP response headers. It's VERY important:
 app.use(helmet());
 // Enables cross-origin request handling across the board (prevents CORS-related errors):
 app.use(cors());
 // Parses incoming requests into JSON format and enables you to access the request BODY:
 app.use(express.json());
 
 // Server Endpoints
 app.use(require('./endpoints/moduleEndpoints'));
 
 // Server Activation
 
app.listen(PORT, () => {
    console.log(`Server is running in ${ENV} environment.`);
    console.log(`Listening on port ${PORT}`);
});
 
 
 
 
 