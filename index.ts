import express, { Application } from "express"
import { mainApp } from "./mainApp"
import db from "./config/db"
import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
const port:number = 9092
const app: Application = express()


const server = app.listen(port, () => {
    console.log(`Server listeningxcv on port ${port}`)
})
mainApp(app)
db()
app.set("view engine", "ejs")

 const swaggerDefinition = {
  basePath: '/',
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Stuent portal api ',
    description: 'this is for kode10x student portal registration api build with node js',
  },
  servers: [
    { url: '/' },
     ],
//    consumes: ['application/json'],
   produces: ['application/json']
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./controller/*.ts'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocs, { explorer: true }));



process.on("uncaughtException", (error:Error) => {
     console.log("stop here: uncaughtException  ")
    console.log(error)
    process.exit(1)
})

process.on("unhandledRejection", (reason:any) => {
       console.log("stopn here: unhandledRejection")
    console.log(reason)

    server.close(() => {
        process.exit(1)
    })
})