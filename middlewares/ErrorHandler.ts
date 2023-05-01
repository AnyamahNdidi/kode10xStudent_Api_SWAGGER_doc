import { Request, Response, NextFunction } from "express"
import { mainAppError, HTTP } from "./ErrorDefinder"

const ErrorBuilder = (err: mainAppError, res: Response) => {
    
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        name: err.name,
        messgae: err.message,
        status: HTTP.BAD_REQUEST,
        stack:err.stack
    })
    
}

export const errorHandler = (
    err: mainAppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    ErrorBuilder(err, res)
}