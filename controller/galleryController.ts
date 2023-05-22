import express, { Request, Response, NextFunction } from "express";
import galleryModel from "../Model/GalleryModel"
import cloudinary from "../utils/cloudinary";
import { asyncHandler } from "../AsyncHandler"
import { TokenGenerator } from "../utils/GenerateToken"
import mongoose from "mongoose"
import { mainAppError, HTTP } from "../middlewares/ErrorDefinder"
import {UserAdmin} from "../interface/galleryInterface"


/**
 * @swagger
 * components:
 *   schemas:
 *     uploadgallery:
 *       type: object
 *       required:
 *         - title
 *         - image
 *       properties:
 *         title:
 *           type: string
 *           description: The user biography
 *         image:
 *           type: file
 *           description: The user biography
 *       example:
 *         title: party image
 *         image: file.jpg
 */






export const  postImage = asyncHandler(async (req: any, res:any, next:NextFunction) => {
    try
    {
        const {title, image} = req.body
        const adminuser = req.user as any

        // console.log(adminuser.info.role)

        if (adminuser?.info?.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized Only Admin Can Updload ' });
        }
        const imageupload :{ secure_url: string, public_id:string} = await cloudinary.uploader.upload(req?.file?.path)
         
        const galleryData = await galleryModel.create({
            title,
            image: imageupload.secure_url,
            imgaeId: imageupload.public_id
        })

        return res.status(200).json({
            message: "image uploaded sucessfully",
            data:galleryData
        })

  
        
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

export const  getAllImage = asyncHandler(async (req:Request, res:Response, next:NextFunction) => {
    try
    {

        const galleryData = await galleryModel.find()

        return res.status(200).json({
            message: "All sucessfully",
            data:galleryData
        })

  
        
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