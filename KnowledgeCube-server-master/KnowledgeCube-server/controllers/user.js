import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";

export const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    let user = await User.findOne({ email });

    if (user)
      return res.status(400).json({
        message: "User already exists",
      });

    const hashPassword = await bcrypt.hash(password, 10);
    user = {
      name,
      email,
      password: hashPassword,
    };

    const otp = Math.floor(100000 + Math.random() * 900000);

    const actToken = jwt.sign(
      {
        user,
        otp,
      },
      process.env.Act_Secret,
      {
        expiresIn: "5m",
      }
    );

    const data = {
      name,
      otp,
    };

    await sendMail(email, "KnwoledgeCube", data);

    res.status(200).json({
      message: "OTP hasbeen send to your mail. Please check!",
      actToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { otp, actToken } = req.body;

    const verify = jwt.verify(actToken, process.env.Act_Secret);

    if (!verify) {
      return res.status(400).json({
        message: "OTP expired. Please try again.",
      });
    }
    if (verify.otp !== otp) {
      return res.status(400).json({
        message: "Wrong OTP!",
      });
    }

    await User.create({
      name: verify.user.name,
      email: verify.user.email,
      password: verify.user.password,
    });

    res.json({
      message: "User Verified and Registered Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "No user found with this email. Please Register.",
      });
    }

    const mathPassword = await bcrypt.compare(password, user.password);

    if (!mathPassword) {
      return res.status(400).json({
        message: "Wrong password! Please try again.",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.jwt_sec,
      {
        expiresIn: "10d",
      }
    );

    res.json({
      message: `Welcome back ${user.name}!`,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const myProf = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const forgotPass = async(req, res)=>{
  try {
    const {email} = req.body;

    const user = await User.findOne({email})

    if(!user)
      return res.status(404).json({
        message: "No user with this email, check email id!"
    })

    const token = jwt.sign({email}, process.env.forgot_secret)

    const data = {email, token}

    await sendForgotMail("KnowledgeCube", data)

    user.resetPasswordExpire = Date.now() + 10*60*1000;

    await user.save();

    res.json({
      message: "Reset password link is send to your registered mail",
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export const resetPass = async(req,res)=>{
  try {
    const decodedData = jwt.verify(req.query.token, process.env.forgot_secret)

    const user = await User.findOne({email: decodedData.email })

    if(!user) return res.status(404).json({
      message: "No user with this email"
    })

    if(user.resetPasswordExpire === null){
      return res.status(400).json({
        message: "Token Expired"
      })
    }

    if(user.resetPasswordExpire < Date.now()){
      return res.status(400).json({
        message: "Token Expired"
      })
    }

    const password = await bcrypt.hash(req.body.password, 10)

    user.password = password

    user.resetPasswordExpire = null;

    await user.save();

    res.json({
      message: "Password Reset Done"
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

