import express, { Request, Response } from "express";
import studentModel from "../Model/userMondel"
import leaningModel from "../Model/learningModel"
import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier";
import profileModel from "../Model/profileModel";
import studentVote from "../Model/studentVote";
import { asyncHandler } from "../AsyncHandler";
import { mainAppError, HTTP } from "../middlewares/ErrorDefinder"


export const createStudentForVote = asyncHandler(async(req: Request, res: Response) => {
    try
    {
        const { firstName, lastName } = req.body
        
        if (!firstName || !lastName )
            {
                return res.status(400).json({message:"please enter all fiembld"})
            }

       const checkStudent = await studentModel.find({lastName, firstName }).exec()
        
        if (!checkStudent)
        {

                        //      return res.status(404).json({
            //     message: `candidate ${firstName} ${lastName} has already been nominate`
            
            // const checkCandidate = await studentVote.find({ firstName: firstName, lastName: lastName })
            // if (!checkCandidate)
            // {
            //       return res.status(201).json({
            //     message:"student sucessfully nominated"
            // })
            // } else
            // {
            //      return res.status(404).json({
            //     message: `candidate ${firstName} ${lastName} has already been nominate`
            // });
            // }

              return res.status(201).json({
                message: `sucessfully added candidate`
            });

          
        } else
        {
            return res.status(404).json({
                message: `invalid candidate no student is bearing ${firstName} ${lastName} check properly`
            });
        }
        
    } catch (error)
    {
          new mainAppError({
            name: "Error in createing candidate for vote",
            message: "account can not be created",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
})