import express from 'express';
import * as process from "node:process";
import dotenv from 'dotenv';
dotenv.config()


const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: express.Request, res: express.Response) => {
    res.send('Hello World!');
})

//health check api
app.get("/api/health", (req: express.Request, res: express.Response) => {
    res.send({
        message: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        port: port,
        hostname: req.hostname,
        protocol: req.protocol
    });
})

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
})