import express, { Request, Response } from "express";
import studentModel from "../Model/userMondel"
import { asyncHandler } from "../AsyncHandler"
import {mainAppError,HTTP} from "../middlewares/ErrorDefinder"
import { AdminServiceEmail } from "../utils/emailvat"
import { TokenGenerator } from "../utils/GenerateToken"

function generateStudentId() {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const length = 4;
	let randomId = "K10X";
	for (let i = 0; i < length; i++) {
		randomId += characters.charAt(
			Math.floor(Math.random() * characters.length),
		);
	}
	return randomId;
}


/**
 * @swagger
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - stack
 *         - phoneNum
 *         - email
 *       properties:
 *         firtsName:
 *           type: string
 *           description: user first name
 *         lastName:
 *           type: string
 *           description: user last name
 *         stack:
 *           type: string
 *           description: user prefer stack
 *         phoneNum:
 *           type: string
 *           description: user phone number
 *         email:
 *           type: string
 *           description: user phone number
 *       example:
 *         firstName: john
 *         lastName: Alexande
 *         stack: full stack Engineer
 *         phoneNum: 09081713598
 *         email: theo4felix@gmail.com
 */



// the $ref is refering to the up schema 


/**
 * @swagger
 * /api/register:
 *   post:
 *      description: Used to register user
 *      tags:
 *          - Create User
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/users'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

export const registerStudent = asyncHandler(async (req:Request, res:Response) => {
    try
    {
        const { firstName, lastName, email,phoneNum, stack } = req.body
        
         if (!email || !firstName || !lastName || !phoneNum || !stack)
            {
                return res.status(400).json({message:"please enter all field"})
            }

        const usesExist = await studentModel.findOne({ email })
            if (usesExist)
            {
                return res.status(401).json({message:"email already exist"})
        }

        const studentData = await studentModel.create({
            email,
            firstName,
            lastName,
            phoneNum,
            stack,
            studentID:generateStudentId()
        })

        AdminServiceEmail(studentData.firstName, studentData.lastName, studentData.studenID)
				.then((result) => {
					console.log("message been sent to you: ");
				})
            .catch((error) => console.log(error));
        
         const { studenID, ...info } = studentData ._doc
       return res.status(201).json({
				message: "  Registration successful Go To Admin to recieve Login id",
				data: info,
			});



    } catch (error)
    {
         new mainAppError({
            name: "Error creating user",
            message: "account can not be created",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
})



/**
 * @swagger
 * components:
 *   schemas:
 *     loginUsers:
 *       type: object
 *       required:
 *         - studentID
 *       properties:
 *         studentID:
 *           type: string
 *           description: user can log in
 *       example:
 *         studentID: K10Xo2p6
 */



/**
 * @swagger
 * /api/login:
 *   post:
 *      description: endpoint for student login
 *      tags:
 *          - Login User
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/loginUsers'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */


export const LoginStudent = asyncHandler(async (req:Request, res:Response) => {
     
    try     
    {
        
        const { studentID } = req.body
         
         if (!studentID )
            {
                return res.status(400).json({mesage:"field can't be empty"})
        }
        
        const checkId = await studentModel.findOne({ studentID }).exec()
        

        if (checkId)
        {
              const { ...info } = checkId._doc
              const token = TokenGenerator({info })
              return res.status(HTTP.OK).json({
                        message: "login success",
                        data: info,
                        token: token
                    })
            
        } else
        {
           return res.status(HTTP.BAD_REQUEST).json({
                    messeage :"StudentID can't be  found",
                })
        }
        
    } catch (error)
    {
         new mainAppError({
            name: "Error in Loging User",
            message: "user can login in",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
        
    }
})
