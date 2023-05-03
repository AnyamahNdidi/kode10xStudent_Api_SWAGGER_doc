import express, { Request, Response } from "express";
import studentModel from "../Model/userMondel"
import leaningModel from "../Model/learningModel"
import { asyncHandler } from "../AsyncHandler"
import {mainAppError,HTTP} from "../middlewares/ErrorDefinder"
import { AdminServiceEmail } from "../utils/emailvat"
import { TokenGenerator } from "../utils/GenerateToken"
import mongoose from "mongoose";


/**
 * @swagger
 * components:
 *   schemas:
 *     studentlearning:
 *       type: object
 *       required:
 *         - title
 *         - decs
 *         - course
 *       properties:
 *         title:
 *           type: string
 *           description: Topice of what you learn
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



/**
 * @swagger
 * /api/student/learning/{id}:
 *   post:
 *      summary: endpoint for creating leaning
 *      tags: [learning]
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
 *              $ref: '#/components/schemas/studentlearning'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */




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

/**
 * @swagger
 * /api/learning/{id}:
 *   get:
 *     summary: Get a single learning student
 *     tags: [learning]
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


export const retrieveOneUserLearning = asyncHandler(async (req:Request, res:Response) => {
  try {
    const getLearning = await studentModel.findById(req.params.id).populate({
      path: "studentLearning",
      options: {
        limit: 3,
        sort: { createdAt: -1 },
      },
    });

    res.status(HTTP.OK).json({
      status: "successful",
      data: getLearning,
    });
  } catch (err) {
      new mainAppError({
            name: "Error i showing leerning",
            message: "can't display learning",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
  }
})