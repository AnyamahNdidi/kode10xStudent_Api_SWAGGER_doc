import express, { Request, Response } from "express";
import studentModel from "../Model/userMondel"
import studentProject from "../Model/creatProjectModel"
import { asyncHandler } from "../AsyncHandler";
import { mainAppError, HTTP } from "../middlewares/ErrorDefinder"
import userMondel from "../Model/userMondel";
import mongoose from "mongoose";


/**
 * @swagger
 * components:
 *   schemas:
 *     studentProject:
 *       type: object
 *       required:
 *         - title
 *         - decs
 *         - url
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
 *         title: online store
 *         decs: allow user to order stuff online
 *         url: https://www.jumia.com
 */


/**
 * @swagger
 * /api/create/project/{id}:
 *   post:
 *      summary: allow student to uplaod their project
 *      tags: [projects]
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
 *              $ref: '#/components/schemas/studentProject'
 *      responses:
 *          '200':
 *              description: Resource added successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */


export const createStudentProject = asyncHandler(async(req:Request, res:Response) => {
    try
    {
        const { title, decs, url } = req.body;

         if (!title || !decs || !url)
        {
            return res.status(400).json({mesage:"please enter all field"})
        }
        
        const getStudent = await userMondel.findById(req.params.id)
        
        const projectData:any = await studentProject.create({
            title,
            decs,
            url,
            projectType:"web Application",
        })

        projectData.user = getStudent,
        projectData.save() 
        
        getStudent?.project.push(new mongoose.Types.ObjectId(projectData?._id))
        getStudent?.save()
        

        return res.status(201).json({
      status: "project created successfully",
      data: projectData,
    });
    } catch (error)
    {
            new mainAppError({
            name: "Error creating student Project",
            message: "account can not be created",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        }) 
    }
})

/**
 * @swagger
 * /api/project/{id}/limit:
 *   get:
 *     summary: Get a student project with limit of 3 
 *     tags: [projects]
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
 *               $ref: '#/components/schemas/studentProject'
 *       404:
 *         description: The student was not found
 */


export const getUserProjectWithLimit = asyncHandler(async (req:Request, res:Response) => {
  try {
    const getProject:any = await studentModel.findById(req.params.id).populate({
      path: "project",
      options: {
        limit: 3,
        sort: { createdAt: -1 },
      },
    });
      
      const {studentLearning, profile, ...info} = getProject._doc

    res.status(HTTP.OK).json({
      status: "successful",
      data: info,
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


/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     summary: Get a student all project with no limit
 *     tags: [projects]
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
 *               $ref: '#/components/schemas/studentProject'
 *       404:
 *         description: The student was not found
 */


export const getUserAllProject= asyncHandler(async (req:Request, res:Response) => {
  try {
    const getProject:any = await studentModel.findById(req.params.id).populate({
      path: "project",
      options: {
        sort: { createdAt: -1 },
      },
    });
      
       const {studentLearning, profile, ...info} = getProject._doc
    res.status(HTTP.OK).json({
      status: "successful",
      data: info,
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