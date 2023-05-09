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
import passport from "passport";
import cookie from "cookie-session";
import "./controller/socailController"

export const mainApp = (app:Application) => {
    
    app.use(express.json()).use(cors())
        .use("/api", studentRouter)
        .use("/api", learnRouter)
        .use("/api", profileEdit)
        .use("/api", projectRouters)
        .use("/api", studentvote)
        .use(cookie({
            name: "session",
            keys: ["key1", "keys2"],
            maxAge: 24 * 60 * 60 * 1000
        }))
        .use((req: Request, res: Response, next: NextFunction) => {
            if (req.session && !req.session.regenerate)
            {
                req.session.regenerate = (cb: any) => {
                    return cb()
                }
                if (req.session && !req.session.save)
                {
                    req.session.save = (cb: any) => {
                        return cb()
                    }
                }
                next()
            }
        })
        .use(passport.initialize())
        .use(passport.session())
       
        .get("/success", (req: Request, res: Response) => {
            res.status(200).json({
                message: `Auth Successful `,
            })
            
        })
        .get("/failure", (req: Request, res: Response) => {
            res.status(200).json({
                message: "Something went wrong",
            })
            
        })
        .get('/api/auth/google/',
            passport.authenticate('google', { scope: ["email",'profile'] })
        );

    

       app.get('/auth/google/callback', 
           passport.authenticate('google',
               {
                   successRedirect:"/success",
                   failureRedirect: '/failure'
               }),

       )
        
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