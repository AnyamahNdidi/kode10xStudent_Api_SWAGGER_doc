import express, { Request, Response, NextFunction } from "express";
import studentModel from "../Model/userMondel"
import ratingModel from "../Model/ratingModel"
import mongoose from "mongoose";
import { asyncHandler } from "../AsyncHandler";
import { mainAppError, HTTP } from "../middlewares/ErrorDefinder"



/**
 * @swagger
 * components:
 *   schemas:
 *     studentrating:
 *       type: object
 *       required:
 *         - allweeklyrating
 *       properties:
 *         allweeklyrating:
 *           type: array
 *           description: should it an array of object containing course and rating
 *       example:
 *         allweeklyrating:
 *           - course: "javascript"
 *             rate: 4
 *           - course: "html"
 *             rate: 7
 *           - course: "typescript"
 *             rate: 7
 */


/**
 * @swagger
 * /api/ratelecture/{id}:
 *   post:
 *      summary: endpoint sudent to rate their learning
 *      tags: [rating course]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The student id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/studentrating'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */

export const studentRating = asyncHandler(async (req: Request, res: Response, next:NextFunction) => {
    try
    {
        const studentInfo:any = await studentModel.findById(req.params.id)
         
        // console.log("gvdjhbk",studentInfo)
        if (!studentInfo) {
        next(
          new mainAppError({
            name: "",
            message: "student is not register",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
        );
        }
        
        const ratingUser:any = await req.body.allweeklyrating.map((rating:any) => {
            
            return {
                course: rating.course,
                rate: rating.rate,
                
            }
        })

        console.log(ratingUser)
        let properDate = new Date()
        let year = properDate.getFullYear()
        let month = properDate.toLocaleString("en-US", { month: "long" })
        let day = properDate.toLocaleString("en-US", { day: "2-digit" })
        
        console.log("kvdf",year, month, day)

        const createRatin = await ratingModel.create({
            allweeklyrating: ratingUser,
            properDate: day + " " + month + " " + year,
            phase:"phase2"
        })

        studentInfo?.weeklyratingcourse.push(new mongoose.Types.ObjectId(createRatin?._id))
        studentInfo.save()

     

     return res.status(HTTP.CREATED).json({
         message: "rating successfully",
         data: createRatin,
       

        })
    
    } catch (err:any)
    {
        
       return res.status(500).json({
          message: `useert ${err.message}`
        })
    }
})




/**
 * @swagger
 * /api/getall/studentrating/{id}:
 *   get:
 *     summary: used to get all student rating
 *     tags: [rating course]
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
 *               $ref: '#/components/schemas/studentrating'
 *       404:
 *         description: The student was not found
 */

export const getAllStudentRating = asyncHandler( async (req: Request, res: Response, next:NextFunction) => {
  try {
    const getStat = await studentModel.findById(req.params.id).populate({
            path: "weeklyratingcourse",
            select: 'date allweeklyrating properDate phase',
            options:{createdAt: -1}
    },)
      
      const { profile, studentLearning, project, ...info} = getStat?._doc
    res.status(201).json({
      status: "stat record has been added successfully",
      data: info,
    });
  } catch (error) {
     next(
         new mainAppError({
            name: "Error in Fetchibg  one student rating",
            message: "can get all user",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
        )
  }
});









// export const createRating = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
//     try
//     { 
//         const studentInfo:any = await studentModel.findById(req.params.id)

//         if (!studentInfo) {
//         next(
//           new mainAppError({
//             name: "",
//             message: "student is not register",
//             status: HTTP.BAD_REQUEST,
//             isSuccess:false
//         })
//         );
//       }
        
//          const ratingUser = await req.body.studentrating.map((rating:any) => {
//             return {
//                 course: rating.course,
//                 rate: rating.rate,
                
//             }
//         })
//         const studentrating = {
//                 $push: {
//                     // Set the value of the 'trk' field to an array containing two objects
//                     studentrating: ratingUser
//                 }
// };
        
//           console.log(typeof req.body.studentrating)
    
//         await studentModel.updateOne(studentInfo, studentrating )

//         // console.log(ratingUser)

       
//         // studentInfo?.studentrating.push(ratingUser)
//         // studentInfo?.save()

//         return res.status(HTTP.CREATED).json({
//             message: "rating successfully",

//         })
        
//     } catch (err:any)
//     {
//          return res.status(500).json({
//             message: `useert ${err.message}`
//         })
//     }
// })