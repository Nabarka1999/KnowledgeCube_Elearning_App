import { instance } from "../index.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lectures.js";
import { Payment } from "../models/Payment.js";
import { Progress } from "../models/Progress.js";
import { User } from "../models/User.js";
import crypto from "crypto";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Courses.find();

    res.json({
      courses,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOneCourse = async (req, res) => {
  try {
    const course = await Courses.findById(req.params.id);

    res.json({
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const fetchLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ course: req.params.id });

    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
      return res.json({ lectures });
    }

    if (!user.subscription.includes(req.params.id)) {
      return res.status(400).json({
        message: "You do not have subcription to this course.",
      });
    }

    res.json({ lectures });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const fetchOneLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
      return res.json({ lecture });
    }

    if (!user.subscription.includes(lecture.course)) {
      return res.status(400).json({
        message: "You do not have subcription to this course.",
      });
    }

    res.json({ lecture });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const courses = await Courses.find({ _id: req.user.subscription });

    res.json({
      courses,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const checkOut = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const course = await Courses.findById(req.params.id);

    if (user.subscription.includes(course._id)) {
      return res.status(400).json({
        message: "You already have this course",
      });
    }

    const options = {
      amount: Number(course.price * 100),
      currency: "INR",
    };

    const order = await instance.orders.create(options);
    res.status(201).json({
      order,
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//payment method
export const payVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      const user = await User.findById(req.user._id);

      const course = await Courses.findById(req.params.id);

      user.subscription.push(course._id);

      await Progress.create({
        course: course._id,
        completedLectures: [],
        user: req.user._id,
      });

      await user.save();

      res.status(200).json({
        message: "Congratulations! Payment successful.",
      });
    } else {
      return res.status(400).json({
        message: "Payment Failed.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.query.course,
    });

    if (!progress) {
      return res.status(404).json({
        message: "null",
      });
    }
    // const allLectures = (await Lecture.find({course: req.query.course})).length;
    // const completedLectures= progress[0].completedLectures.length

    // Fetch all lectures that currently exist for the course
    const allLecturesData = await Lecture.find({ course: req.query.course });
    const allLectures = allLecturesData.length;

    // Filter completed lectures to ensure only existing lectures are counted
    const completedLectures = progress.completedLectures.filter((lectureId) =>
      allLecturesData.some(
        (lecture) => lecture._id.toString() === lectureId.toString()
      )
    ).length;

    const progressPercent = parseFloat(
      ((completedLectures * 100) / allLectures).toFixed(2)
    );

    res.json({
      progressPercent,
      completedLectures,
      allLectures,
      progress,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.query.course,
    });
    const { lectureId } = req.query;

    // Check if the lecture exists before adding progress
    const lectureExists = await Lecture.findById(lectureId);
    if (!lectureExists) {
      return res.status(404).json({ message: "Lecture does not exist" });
    }

    if (progress.completedLectures.includes(lectureId)) {
      return res.json({
        message: "Progress updated",
      });
    }
    progress.completedLectures.push(lectureId);

    await progress.save();

    res.status(201).json({
      message: "New Progress Added!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// export const searchCourses = async (req, res) => {
//   try {
//     const { query } = req.query; // Capture the search query from the request

//     // Use regex for flexible search on multiple fields
//     const searchQuery = {
//       $or: [
//         { title: { $regex: query, $options: "i" } },      // Case-insensitive search on title
//         { description: { $regex: query, $options: "i" } }, // Case-insensitive search on description
//         { category: { $regex: query, $options: "i" } },    // Case-insensitive search on category
//         { author: { $regex: query, $options: "i" } },      // Case-insensitive search on author
//       ],
//     };

//     const courses = await Courses.find(searchQuery); // Perform the search on the Courses collection

//     if (courses.length === 0) {
//       return res.status(404).json({
//         message: "No courses found matching your search.",
//       });
//     }

//     res.json({
//       message: "Courses found",
//       courses,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };
