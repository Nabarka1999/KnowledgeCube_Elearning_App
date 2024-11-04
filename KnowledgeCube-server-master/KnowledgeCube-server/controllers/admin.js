import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lectures.js";
import {rm} from "fs";
import { promisify } from "util";
import fs from 'fs';
import {User} from '../models/User.js';

export const createCourse = async (req, res) => {
    try {
        const {title, description, category, author, price, duration}= req.body

        const thumbnail = req.file;

        await Courses.create({
            title,
            description,
            category,
            author,
            thumbnail: thumbnail?.path,
            duration,
            price
        })

        res.status(201).json({
            message: "Course created successfully!"
        })
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }


export const addLectures = async(req,res)=>{
  try {
    const course = await Courses.findById(req.params.id);

    if(!course){
      return res.status(404).json({
        message: "No course found with this ID"
      })
    }

    const {title,description}=req.body
    const file= req.file
    const lecture= await Lecture.create({
      title,
      description,
      video: file?.path,
      course: course._id
    })

    res.status(201).json({
      message: "Lecture added successfully",
      lecture,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const deleteLecture = async(req,res)=>{
  try {
    const lecture = await Lecture.findById(req.params.id)

    rm(lecture.video,()=>{
      
    })

    await lecture.deleteOne();

    res.json({
      message: "Lecture deleted."
    })

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const unlinkAsync = promisify(fs.unlink)
export const deleteCourse = async(req, res)=>{
  try {
    const course = await Courses.findById(req.params.id)

    const lectures = await Lecture.find({course: course._id})

    await Promise.all(
      lectures.map(async(lecture)=>{
        await unlinkAsync(lecture.video);
      })
    )

    rm(course.thumbnail, ()=>{

    })

    await Lecture.find({course: req.params.id}).deleteMany()

    await course.deleteOne()

    await User.updateMany({},{$pull:{subscription: req.params.id}});

    res.json({
      message: "Course deleted"
    })

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const getAllStats = async(req,res)=>{
  try {
    const totalCourse = (await Courses.find()).length;

    const totalLectures = (await Lecture.find()).length;

    const totalUsers = (await User.find()).length;

    const stats={
      totalCourse,
      totalLectures,
      totalUsers
    }

    res.json({
      stats
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    })
  }
}

export const getAllUsers = async(req, res)=>{
  try {
    const users = await User.find({_id:{$ne : req.user._id}}).select("-password");

  res.json({users})
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: error.message,
    })
  }
}

export const updateRole = async(req,res)=>{
  try {
    if(req.user.mainrole!== "superadmin") {
      return res.status(403).json({
        message: "You are not authorized to do this. Please contact the admin."
      })
    }
    const user = await User.findById(req.params.id)

    if(user.role === "user"){
      user.role = "admin"
      await user.save()

      return res.status(200).json({
        message: "Role updated to admin"
      })
    }

    if(user.role === "admin"){
      user.role = "user"
      await user.save()

      return res.status(200).json({
        message: "Role updated to user"
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: error.message,
    })
  }
}