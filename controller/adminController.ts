import express, { Request, Response, NextFunction } from "express";
import userModel from "../Model/userMondel"
import { asyncHandler } from "../AsyncHandler"
import { TokenGenerator } from "../utils/GenerateToken"
import profileModel from "../Model/profileModel"
import mongoose from "mongoose"
import {mainAppError,HTTP} from "../middlewares/ErrorDefinder"



/**
 * @swagger
 * components:
 *   schemas:
 *     adimregistration:
 *       type: object
 *       required:
 *         - firstName
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           description: Topice of what you learn
 *         email:
 *           type: string
 *           description: brief description of what you learn
 *         password:
 *           type: string
 *           description: state the course you are in for
 *       example:
 *         title: Tochukwu
 *         email: admin@gmail.com
 *         password: javascript
 */


/**
 * @swagger
 * /api/register/admin:
 *   post:
 *      summary: admin registration end point
 *      tags: [admin authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/adimregistration'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

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
                        message: "Registration successfull",
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

export const loginAdmin = asyncHandler(async (req: any, res:any, next:NextFunction) => {
    try
    {
        const { email, password } = req.body

        if (!email || !password)
        {
            return res.status(400).json({mesage:"field can't be empty"}) 
        }

        const checkUser = await userModel.findOne({ email })

        if (checkUser)
        {
            const matchPassword = await checkUser.matchPassword(password)
              if (matchPassword && checkUser.role == "admin")
                {
                    const { password, ...info } = checkUser._doc
                    
                    const token = TokenGenerator({ info })
                    console.log(token)

                    return res.status(HTTP.OK).json({
                        message: "login success",
                        data: info,
                        token: token
                    })
                       
                } else
                {
                     return res.status(HTTP.BAD_REQUEST).json({ message:"wrong password" })
                }
        } else
        {
             return res.status(HTTP.BAD_REQUEST).json({
                    messeage :"user can't  be found",
                })
        }


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