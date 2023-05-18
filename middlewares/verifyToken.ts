import jwt from "jsonwebtoken"
import express, { Request, Response, NextFunction } from "express";
import userModel from "../Model/userMondel"
import { asyncHandler } from "../AsyncHandler"

export const verify = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
    let token;

    if (req.headers.authorization)
    {
        try
        {
            token = req.headers.authorization.split(" ")[1]
            jwt.verify(token, "thisisthesecrect", (err, decodedToken) => {
                 if (err) {
                    return res.status(403).json({ message: 'Failed to authenticate token' });
                    }
                    // Set the decoded token in the request object for later use
                    req.user = decodedToken;
                    next();
            })
            
        } catch (error:any)
        {
            return res.status(400).json({
                message:`not authorization token failed ${error.message}`
            })
        }
        
    }

    if (!token)
    {
        return res.status(401).json({message: `not authorization, no token provided`})
    }
})