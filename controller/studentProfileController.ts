import express, { Request, Response } from "express";
import studentModel from "../Model/userMondel"
import leaningModel from "../Model/learningModel"
import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier";
import profileModel from "../Model/profileModel";
import { asyncHandler } from "../AsyncHandler";
import { mainAppError, HTTP } from "../middlewares/ErrorDefinder"


/**
 * @swagger
 * components:
 *   schemas:
 *     editUsers:
 *       type: object
 *       required:
 *         - bio
 *         - phoneNum
 *         - gitHubLink
 *         - linkedinLink
 *         - facebookLink
 *         - twitterLink
 *       properties:
 *         bio:
 *           type: string
 *           description: The user biography
 *         gitHubLink:
 *           type: string
 *           description: The user last name
 *         linkedinLink:
 *           type: string
 *           description: preferr stack
 *         facebookLink:
 *           type: string
 *           description: The prefeered email
 *         twitterLink:
 *           type: string
 *           description: The prefeered email
 *       example:
 *         bio: about your self........
 *         phoneNum: about your self........
 *         gitHubLink: https://github.com/gideonekeke
 *         linkedinLink: https://linkedle.com/gideonekeke
 *         facebookLink: https://facebook.com/gideonekeke
 *         twitterLink: https://teitter.com/gideonekeke
 */


/**
 * @swagger
 *  /api/edit/profile/{id}:
 *  patch:
 *    summary: Update user profile
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
 *            $ref: '#/components/schemas/editUsers'
 *    responses:
 *      200:
 *        description: The profile has been updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/editUsers'
 *      404:
 *        description: The profile was not found
 *      500:
 *        description: Some error happened
 */

export const editProfile = asyncHandler(async (req: Request, res: Response) => {
    try
    {
       
        const { bio, gitHubLink, linkedinLink, facebookLink, twitterLink,phoneNum } = req.body
        
        //  if (!bio || !gitHubLink || !linkedinLink  || !facebookLink || !twitterLink)
        //     {
        //         return res.status(400).json({message:"please enter all field"})
        // }

        const user = await profileModel.findByIdAndUpdate(
			req.params.id,
            {
                bio,
                phoneNum,
                gitHubLink,
                linkedinLink,
                facebookLink,
                twitterLink

            },
			{ new: true },
		);
		return res.status(200).json({
			message: "user info has been updated successfully",
			data: user,
		});

  
      
        
    } catch (error)
    {
           new mainAppError({
            name: "Error edit profile",
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
 *     editUsersProfile:
 *       type: object
 *       required:
 *         - image
 *       properties:
 *         image:
 *           type: file
 *           description: The user biography
 *       example:
 *         avatar: file.jpg
 */


/**
 * @swagger
 *  /api/editprofile/{id}:
 *  patch:
 *    summary: Update user image profile
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
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/editUsersProfile'
 *    responses:
 *      200:
 *        description: The profile has been updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/editUsersProfile'
 *      404:
 *        description: The profile was not found
 *      500:
 *        description: Some error happened
 */



export const editPic = asyncHandler(async(req: any, res: any) => {
    try
    {
		// const oldUser = await profileModel.findById(req.params.id);
		// // await cloudinary.uploader.destroy(oldUser?.avatarID!);

		// let streamUpload = (req: any) => {
		// 	return new Promise(async (resolve: any, reject: any) => {
		// 		let stream: string | any = cloudinary.uploader.upload_stream(
		// 			(error: any, result: Buffer) => {
		// 				if (result) {
		// 					return resolve(result);
		// 				} else {
		// 					console.log("reading Error: ", error);
		// 					return reject(error);
		// 				}
		// 			},
		// 		);

		// 		streamifier.createReadStream(req?.file!.buffer!).pipe(stream);
		// 	});
		// };

		// const image: any = await streamUpload(req);

		// const user = await profileModel.findByIdAndUpdate(
		// 	req.params.id,
		// 	{ avatar: image.secure_url! },
		// 	{ new: true },
		// );

		// return res.status(200).json({
		// 	message: "user found, update done!",
		// 	data: user,
		// });

        
    const image: { secure_url: string } = await cloudinary.uploader.upload(
      req?.file!.path
    );

    const user = await profileModel.findByIdAndUpdate(
      req.params.id,
      { avatar: image.secure_url! },
      { new: true }
    );
    return res.status(200).json({
      message: "profile image updated successfully",
      data: user,
    });

        
        


      
    } catch (error)
    {
          new mainAppError({
            name: "Error editin image profile",
            message: "account can not be created",
            status: HTTP.BAD_REQUEST,
            isSuccess:false
        })
    }
})