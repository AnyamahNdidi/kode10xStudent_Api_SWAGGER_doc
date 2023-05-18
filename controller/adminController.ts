import express, { Request, Response, NextFunction } from "express";
import userModel from "../Model/userMondel"
import { asyncHandler } from "../AsyncHandler"
import { TokenGenerator } from "../utils/GenerateToken"
import profileModel from "../Model/profileModel"
import mongoose from "mongoose"
import {mainAppError,HTTP} from "../middlewares/ErrorDefinder"


export const registerAdmin = asyncHandler(async (req: Request, res: Response, next:NextFunction) => {
    try
    {
        const { firstName, email, password } = req.body
        
        if (!firstName || ! email || !password)
        {
            return res.status(400).json({message:"please enter all field"})
        }

        const usesExist = await userModel.findOne({ email })
            if (usesExist)
            {
                return res.status(401).json({message:"email already exist"})
            }

        const role = req.body.role || 'admin';
       
        const adminData:any = await userModel.create({
            firstName,
            email,
            password,
            role,
        })
        

    const profileData = await profileModel.create({
            _id:adminData._id,
            // bio: "",
            // gitHubLink: "",
            // youtubeUrl:"",
            // facebookLink: "",
            // linkedinLink: "",
            // twitterLink: "",
            // phoneNum: "",  
        })

        adminData?.profile.push(new mongoose.Types.ObjectId(profileData?._id))
        adminData?.save()

        profileData.user = profileData._id
        profileData.save()
        
       
        const token = TokenGenerator({ _id:adminData?._id, email:adminData?.email, role:adminData?.role})
        
        
       return res.status(HTTP.OK).json({
                        message: "login success",
                        data: adminData,
                        token: token
                    })


        
    } catch (err)
    {
         next(
         new mainAppError({
            name: "Error in Creating Admin",
            message: "can't register admin",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
        )
    }
})