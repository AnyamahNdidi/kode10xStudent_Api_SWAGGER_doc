import express, { Request, Response } from "express";
import studentModel from "../Model/userMondel"
import leaningModel from "../Model/learningModel"
import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier";
import profileModel from "../Model/profileModel";
import studentVote from "../Model/studentVote";
import { asyncHandler } from "../AsyncHandler";
import { mainAppError, HTTP } from "../middlewares/ErrorDefinder"


/**
 * @swagger
 * components:
 *   schemas:
 *     studentlearning:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         firstName:
 *           type: string
 *           description: register student first namr
 *         decs:
 *           type: string
 *           description: brief description of what you learn
 *         course:
 *           type: string
 *           description: state the course you are in for
 *       example:
 *         title: DataTypes
 *         decs: i learn how to clear varaible
 *         course: javascript
 */





export const createStudentForVote = asyncHandler(async(req: Request, res: Response) => {
    try
    {
        const { firstName, lastName } = req.body
        
        if (!firstName || !lastName )
            {
                return res.status(400).json({message:"please enter all fiembld"})
            }

        const checkStudent = await studentModel.find({ lastName, firstName }).populate("profile").exec()
        
        // console.log(checkStudent)
        
        if (checkStudent.length > 0)
        {
            const checkCandidate = await studentVote.find({ lastName, firstName }).exec()
            console.log(checkCandidate)
            if (checkCandidate.length > 0)
            {
               return res.status(301).json({
                    message: "candidate has already been nominated  choose another one",
                    data:checkCandidate[0]
                })
            } 

            let createStudent = {
                firstName: checkStudent[0].firstName,
                lastName: checkStudent[0].lastName,
                fullName: checkStudent[0].lastName + checkStudent[0].lastName,
                image: checkStudent[0].profile[0].avatar,
                role: "student of the week",
                gitHubLink:checkStudent[0].profile[0].gitHubLink   
            }

            const createCandidate = await studentVote.create(createStudent)

            return res.status(201).json({
                Message: "candidate has been added ",
                data:createCandidate
            })

             
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



export const voteStudent = asyncHandler(async(req: Request, res: Response) => {
    try
    {
       
        const id = req.params.id
        const userVotingID = req.params.userVotingID
        
        let checkItem = await studentVote.find({ user: { $in: [userVotingID] } }).exec()
        console.log("check", checkItem)

        if (!(checkItem.length > 0))
        {
            const voted = await studentVote.findByIdAndUpdate(
            id,
            {
                $push: { user: userVotingID },
            },
            { new: true }
            );

            const getUser = await studentVote.findById(id);
            const votersData = getUser?.user.length;

             await studentVote.findByIdAndUpdate(
                    req.params.id,
                    {
                        voter: votersData,
                    },
                    { new: true }
                    );

            console.log(votersData)
            return res.status(201).json({
                message: "vote casted sucessfully",
                data: {
                    numberOfVote: votersData,
                    voted
                   
                }
            });

        } else
        {
             return res.status(201).json({
            message:'user has  already voted before'
        })
        }
       
        
    } catch (error:any)
    {

         return res.status(500).json({
            message: `${error.message}`
        })
        //    new mainAppError({
        //     name: "Error voting for student",
        //     message: "account can not be created",
        //     status: HTTP.BAD_REQUEST,
        //     isSuccess:false
        // })
    }
})
export const deleteStudentVote = asyncHandler(async(req: Request, res: Response) => {
    try
    {
       
        const id = req.params.id
        const userVotingID = req.params.userVotingID
        
        let checkItem = await studentVote.find({ user: { $in: [userVotingID] } }).exec()
        console.log("check", checkItem)

        if (checkItem.length > 0)
        {
            const voted = await studentVote.findByIdAndUpdate(
            id,
            {
                $pull: { user: userVotingID },
            },
            { new: true }
            );

            const getUser = await studentVote.findById(id);
            const votersData = getUser?.user.length;

             await studentVote.findByIdAndUpdate(
                    req.params.id,
                    {
                        voter: votersData,
                    },
                    { new: true }
                    );

            console.log(votersData)
            return res.status(201).json({
                message: "vote has been deleted",
            });

        } else
        {
             return res.status(201).json({
            message:'You have not cast any vote so why do you want to delete vote'
        })
        }
       
        
    } catch (error:any)
    {

         return res.status(500).json({
            message: `${error.message}`
        })
        //    new mainAppError({
        //     name: "Error voting for student",
        //     message: "account can not be created",
        //     status: HTTP.BAD_REQUEST,
        //     isSuccess:false
        // })
    }
})