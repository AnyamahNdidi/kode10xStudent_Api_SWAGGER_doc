import express, { Request, Response, NextFunction } from "express";
import galleryModel from "../Model/GalleryModel"
import cloudinary from "../utils/cloudinary";
import { asyncHandler } from "../AsyncHandler"
import { TokenGenerator } from "../utils/GenerateToken"
import mongoose from "mongoose"
import { mainAppError, HTTP } from "../middlewares/ErrorDefinder"
import {UserAdmin} from "../interface/galleryInterface"



export const  postImage = asyncHandler((req: Request, res: Response, next:NextFunction) => {
    try
    {
        const adminuser = req.user as UserAdmin

        if (adminuser?.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized Only Admin Can Updload ' });
        }
        
        
        
    } catch (error)
    {
                 next(
         new mainAppError({
            name: "Error in uplaoding gallery",
            message: "can't upload images to gallery",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
        )
    }
})