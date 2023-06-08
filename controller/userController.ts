import express, { Request, Response,NextFunction } from "express";
import studentModel from "../Model/userMondel"
import { asyncHandler } from "../AsyncHandler"
import {mainAppError,HTTP} from "../middlewares/ErrorDefinder"
import { AdminServiceEmail,resetStudentPassword } from "../utils/emailvat"
import { TokenGenerator } from "../utils/GenerateToken"
import profileModel from "../Model/profileModel"
import mongoose from "mongoose"
import bcrypt from "bcrypt";

// function generateStudentId() {
// 	const characters =
// 		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// 	const length = 4;
// 	let randomId = "K10X";
// 	for (let i = 0; i < length; i++) {
// 		randomId += characters.charAt(
// 			Math.floor(Math.random() * characters.length),
// 		);
// 	}
// 	return randomId;
// }


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
 *         - email
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user first name
 *         lastName:
 *           type: string
 *           description: The user last name
 *         stack:
 *           type: string
 *           description: preferr stack
 *         email:
 *           type: string
 *           description: The prefeered email
 *       example:
 *         firstName: john
 *         lastName: peter
 *         stack: backend engineer
 *         email: johnjames@gmail.com
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
 *              $ref: '#/components/schemas/users'
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
        const { firstName, lastName, email, stack } = req.body
        
         if (!email || !firstName || !lastName  || !stack)
            {
                return res.status(400).json({message:"please enter all field"})
            }

        const usesExist = await studentModel.findOne({ email })
            if (usesExist)
            {
                return res.status(401).json({message:"email already exist"})
        }

        let autoNum: any = (await studentModel.find()).length
         
        function generateMatricNum() {
        let matricNum:string="";
         if (autoNum < 9)
        {
            return  matricNum +=`KX01/FS-0${autoNum +1}-2023`     
        }
        if (autoNum >= 9)
        {
            return  matricNum +=`KX01/FS-${autoNum +1}-2023`     
        }
       
        } 
       
        const studentData = await studentModel.create({
            email,
            firstName,
            lastName,
            stack,
            password: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
            cohort: "COHORT 1",
            matricNumber:generateMatricNum()
            // studentID:generateStudentId()
        })

        const profileData = await profileModel.create({
            _id:studentData._id,
            bio: "",
            gitHubLink: "",
            youtubeUrl:"",
            facebookLink: "",
            linkedinLink: "",
            twitterLink: "",
            phoneNum: "",
            
            
            
        })

        studentData?.profile.push(new mongoose.Types.ObjectId(profileData?._id))
        studentData?.save()

        profileData.user = studentData._id
        profileData.save()

        AdminServiceEmail(studentData.firstName, studentData.lastName, studentData.matricNumber)
				.then((result:any) => {
					console.log("message been sent to you: ");
				})
            .catch((error:any) => console.log(error));
        
         const { studenID, ...info } = studentData._doc
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
 *     userslogin:
 *       type: object
 *       required:
 *         - matricNumber
 *         - password
 *       properties:
 *         matricNumber:
 *           type: string
 *           description: user matric id
 *         password:
 *           type: string
 *           description: combinations of firstName and LastName
 *       example:
 *         matricNumber: KX01/FS-11-2023
 *         password: peterjohn
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
 *              $ref: '#/components/schemas/userslogin'
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
        
        const { matricNumber, password } = req.body
         
         if (!matricNumber || !password) 
            {
                return res.status(400).json({mesage:"field can't be empty"})
        }
        
        const checkId = await studentModel.findOne({ matricNumber }).populate({
            path: "profile",
            options:{createdAt: -1}
        })

        if (checkId)
        {
             const matchPassword = await checkId.matchPassword(password)
                if (matchPassword)
                {
                    const { password, ...info } = checkId._doc
                    
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
                    messeage :"Matric Number Can't Be  Found",
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


/**
 * @swagger
 * components:
 *   schemas:
 *     getAllusers:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - stack
 *         - email
 *         - cohort
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
 *         email:
 *           type: string
 *           description: user phone number
 *         cohort:
 *           type: string
 *           description: default cohort 1
 *       example:
 *         firstName: john
 *         lastName: Alexande
 *         stack: full stack Engineer
 *         phoneNum: 09081713598
 *         email: theo4felix@gmail.com
 */

/**
 * @swagger
 * /api/allstudent:
 *   get:
 *     summary: Returns the list of all the students
 *     tags: [users]
 *     responses:
 *       200:
 *         description: The list of the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/getAllusers'
 */


export const getAllStudent = asyncHandler(async (req: Request, res: Response) => {

    try
    {
        const allUser = await studentModel.find().populate({
            path: "profile",
            options:{createdAt: -1}
        }).populate({
            path: "studentLearning",
            options:{createdAt: -1}
        })

        return res.status(HTTP.OK).json({
            message: "created",
            data: allUser,
            });
        
    } catch (error)
    {
          new mainAppError({
            name: "Error in Fetchibg all User",
            message: "can get all user",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }

})


 

/**
 * @swagger
 * /api/onestudent/{id}:
 *   get:
 *     summary: Get a single student by id
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The student id
 *     responses:
 *       200:
 *         description: The user description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getAllusers'
 *       404:
 *         description: The student was not found
 */


export const getSingleStudent = asyncHandler(async (req: Request, res: Response, next:NextFunction) => {

    try
    {
        const oneUser = await studentModel.findById(req.params.id).populate({
            path: "profile",
            options:{createdAt: -1}
        }).populate({
            path: "studentLearning",
            options:{createdAt: -1}
        }).populate({
            path: "project",
            options:{createdAt: -1}
        }).populate({
            path: "weeklyratingcourse",
            select: 'date allweeklyrating properDate phase',
            options:{createdAt: -1}
        })

        return res.status(HTTP.OK).json({
            message: "get One User",
            data: oneUser,
            });
        
    } catch (error)
    {

        next(
         new mainAppError({
            name: "Error in Fetchibg all one single user",
            message: "can get all user",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
        )

    }

})


/**
 * @swagger
 * components:
 *   schemas:
 *     usersEmailResetPassword:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: provide register email to reset password
 *       example:
 *         email: johndeo@gmail.com
 */


/**
 * @swagger
 * /api/reset/password:
 *   post:
 *      summary: endpoint for student to recieve link to change password
 *      tags: [users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/usersEmailResetPassword'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
 
export const resetUserPassword = asyncHandler(async (req: Request, res: Response, next:NextFunction) => {
    try
    {
        const { email } = req.body
        const user = await studentModel.findOne({ email });
        console.log(user?.firstName)

        if (user)
        {
            const newToken = TokenGenerator({user})
            console.log(newToken)

            resetStudentPassword(user, newToken).then((result) => {
						console.log("message been sent to you: ");
					})
                .catch((error) => console.log(error));
            
            return res.status(200).json({
					message: "Please check your email to set up a new password",
				});

            
        } else
        {
            return res.status(404).json({ message: "email can't be found" });
            
        }
         
    } catch (error)
    {
        
        next(
         new mainAppError({
            name: "Error in Sending Reset passWord Mail",
            message: (error as Error).message,
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
        )
    }
})
 

/**
 * @swagger
 * components:
 *   schemas:
 *     editUsersPassword:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         image:
 *           type: string
 *           description: input the new user password
 *       example:
 *         password: password
 */



/**
 * @swagger
 *  /api/user/{id}/password-change:
 *  patch:
 *    summary: Update user password
 *    tags: [users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/editUsersPassword'
 *    responses:
 *      200:
 *        description: password has been updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/editUsersPassword'
 *      404:
 *        description: The profile was not found
 *      500:
 *        description: Some error happened
 */



export const changePassword = asyncHandler (async(req: Request, res: Response, next:NextFunction) => {
    try
    {
        const { password } = req.body;

        const studentId = await studentModel.findById(req.params.id);
        if (studentId)
        {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);
            
            await studentModel.findByIdAndUpdate(
                studentId?._id,
                {
                    password:hashed,
                },
                { new: true },
            )
            
            return res.status(200).json({
			message: "password has been changed sucessfully",
		});
        } else
        {
            return res.status(404).json({ message: "Unable to change passwor user can be found" });
        }
        

        
    } catch (error)
    {
         next(
         new mainAppError({
            name: "Error in changing password",
            message: (error as Error).message,
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
        )
    }
})