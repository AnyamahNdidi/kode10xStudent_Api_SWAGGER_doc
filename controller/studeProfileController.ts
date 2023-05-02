import express, { Request, Response } from "express";
import studentModel from "../Model/userMondel"
import leaningModel from "../Model/learningModel"
import profileModel from "../Model/profileModel";
import { asyncHandler } from "../AsyncHandler";
import {mainAppError,HTTP} from "../middlewares/ErrorDefinder"

export const creatProfile = asyncHandler(async (req: Request, res: Response) => {
    try
    {
       
        const { bio, gitHubLink, linkedinLink, facebookLink, twitterLink } = req.body
        
         if (!bio || !gitHubLink || !linkedinLink  || !facebookLink || !twitterLink)
            {
                return res.status(400).json({message:"please enter all field"})
        }

        const getStudent  = await studentModel.findById(req.params.id)
        
        const createProfile:any = await profileModel.create({
            bio,
            gitHubLink,
            linkedinLink,
            facebookLink,
            twitterLink
        })


        createProfile.user = getStudent
        createProfile.save()
      

  
      
        
    } catch (error)
    {
           new mainAppError({
            name: "Error creating profile",
            message: "account can not be created",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
})