import express, { Request, Response } from "express";
import studentModel from "../Model/userMondel"
import leaningModel from "../Model/learningModel"
import { asyncHandler } from "../AsyncHandler"
import {mainAppError,HTTP} from "../middlewares/ErrorDefinder"
import { AdminServiceEmail } from "../utils/emailvat"
import { TokenGenerator } from "../utils/GenerateToken"
import mongoose from "mongoose";




export const createLearning = asyncHandler(async(req:Request, res:Response) => {
    try
    {
        const { title, decs, course } = req.body

        if (!title || !decs || !course)
        {
            return res.status(400).json({mesage:"please enter all field"})
        }
        const getStudent = await studentModel.findById(req.params.id)

        const createStudentLearning:any = await leaningModel.create({
            title, 
            decs,
            course,
        })

        createStudentLearning.user = getStudent
        createStudentLearning.save()

        getStudent?.studentLearning.push(new mongoose.Types.ObjectId(createStudentLearning?._id))
        getStudent!.save()
 



         return res.status(HTTP.OK).json({
            message: "learning  created successfully",
            data: createStudentLearning
        })



        

    } catch (error)
    {
         new mainAppError({
            name: "Error creating leerning",
            message: "account can not be created",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
})

