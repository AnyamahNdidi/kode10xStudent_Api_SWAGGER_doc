import express, { Application, Request, Response, NextFunction, application } from "express"
import cors from "cors"
import { errorHandler } from "./middlewares/ErrorHandler"
import studentRouter from "./Routers/studentRouter"
import learnRouter from "./Routers/learningRouter"
import profileEdit from "./Routers/profileEditRouter"
import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { swaggerDocs } from "./utils/swaggerIntialixation"
import projectRouters from "./Routers/projectRouter"
import studentvote from "./Routers/studentVoteRouter"

export const mainApp = (app:Application) => {
    
    app.use(express.json()).use(cors())
        .use("/api", studentRouter )       
        .use("/api", learnRouter)   
        .use("/api", profileEdit)   
        .use("/api", projectRouters)   
        .use("/api", studentvote)   
        
    //   .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
     .get("/", (req: Request, res: Response) => {
            
            res.status(200).json({
                message:"api is ready"
            })
        
     })
    .get("/api/ejs:id", (req: Request, res: Response) => {
            
             const id = req.params.id
             const name = "edwin"
            return res.render("AdminVerification",{id, name})
        })
    
    .use(errorHandler)
}