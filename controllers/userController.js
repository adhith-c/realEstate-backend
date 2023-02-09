require("dotenv").config();
const User = require("../models/user");
const Otp = require("../models/otp");
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");

const {
  hashPassword,
  comparePassword,
  hashOtp,
  compareOtp,
} = require("../utils/helper");

const { sendOtpVerification } = require("../utils/otpMailer");
const { default: mongoose } = require("mongoose");
const {
  validateSignup,
  validateOtp,
  validateLogin,
  validateChangeEmail,
  validateEmailOtp,
} = require("../utils/validator");

exports.homePage = async (req, res) => {
  try {
    console.log("home page");
    res.send("homepage");
  } catch (err) {
    console.log(err);
  }
};

// exports.register = async (req, res) => {
//   try {
//     res.send("SIGNUP");
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.register = async (req, res) => {
  const { error, value } = validateSignup(req.body);
  if (error) {
    console.log("error", error);
    res.json({ error });
  } else {
    try {
      console.log(req.body);
      const { firstName, lastName, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        if (existingUser.isVerified == false) {
          await User.findOneAndDelete({ email });
        }
      }
      const userName = await User.findOne({ email });
      if (!userName) {
        const hashedpassword = hashPassword(password);
        const user = await User.create({
          firstName,
          lastName,
          email,
          password: hashedpassword,
        });
        user.save().then(async (data) => {
          await Otp.findOneAndDelete({ userEmail: email });
          sendOtpVerification(data, req, res);
        });
      } else {
        res.send("");
      }
    } catch (err) {
      console.log(err);
      res.json({ err });
    }
  }
};

exports.otpVerify = async (req, res) => {
  const { error, value } = validateOtp(req.body);
  try {
    const { otp, email } = req.body;
    const userOtp = await Otp.findOne({ userEmail: email });
    if (Date.now() < userOtp.expiresAt) {
      const isValidOtp = compareOtp(otp, userOtp.otp);
      if (isValidOtp) {
        await User.findOneAndUpdate({ email }, { isVerified: true });
        await Otp.findOneAndDelete({ userEmail: email });
        const userEmail = await User.findOne({ email });
        // const token = jwt.sign(
        //   {
        //     id: userEmail._id,
        //     name: userEmail.firstName + userEmail.lastName,
        //     type: "user",
        //   },
        //   process.env.JWT_ACCESS_TOKEN
        // );
        res.send(true);
      } else {
        res.send(false);
      }
    } else {
      console.log("otp expired");
      await Otp.findOneAndDelete({ userEmail: email });
      await User.findOneAndDelete({ email: email });
      res.send("");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById({ _id: userId });
    await Otp.findOneAndDelete({ userId });
    const email = user.email;
    sendOtpVerification({ _id: userId, email }, req, res);
  } catch (err) {
    console.log(err);
  }
};

exports.userLogin = async (req, res) => {
  const { error, value } = validateLogin(req.body);
  if (!error) {
    try {
      const { user, pwd } = req.body;
      const userEmail = await User.findOne({ email: user });
      // let user;
      if (!userEmail) return res.sendStatus(401);
      const isValidPass = comparePassword(pwd, userEmail.password);
      if (isValidPass) {
        const accessToken = jwt.sign(
          {
            UserInfo: {
              email: userEmail.email,
              type: "user",
            },
          },
          "75d4ac5a25940d574bfabe0556e7dfd74e1c989091df1008ff5b50a77dd14d3f2dce4597802d6ab5fa158ff068f08c90dbf311a57512e030a932d8a8b608d91c",
          // process.env.JWY_ACCESS_TOKEN,
          { expiresIn: "1d" }
        );
        const newRefreshToken = jwt.sign(
          {
            email: userEmail.email,
          },
          process.env.JWT_REFRESH_TOKEN,
          { expiresIn: "5d" }
        );

        let newRefreshTokenArray = !cookies?.jwt
          ? userEmail.refreshToken
          : userEmail.refreshToken.filter((rt) => rt !== cookies.jwt);
        if (cookies?.jwt) {
          const refreshToken = cookies.jwt;
          const foundToken = await User.find({ refreshToken }).exec();

          if (!foundToken) {
            newRefreshTokenArray = [];
          }
          res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          });
        }
        userEmail.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await userEmail.save();
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        const id = userEmail._id;
        res.json({ accessToken, id });
      } else {
        res.sendStatus(401);
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log(error);
    res.status(401).json({ error });
  }
};

exports.addProfilePic = async (req, res) => {
  try {
    const { id, url } = req.body;
    const user = await User.findByIdAndUpdate(id, { url: url });
    res.send(user);
  } catch (err) {
    console.log(err);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body });
    res.send(user);
  } catch (err) {
    console.log(err);
  }
};

exports.handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const hackedUser = await User.findOne({ email: decoded.email }).exec();
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
      }
    );
    return res.sendStatus(403);
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN,
    async (err, decoded) => {
      if (err) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }
      if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: decoded.email,
            type: "user",
          },
        },
        process.env.JWY_ACCESS_TOKEN,
        { expiresIn: "1d" }
      );

      const newRefreshToken = jwt.sign(
        {
          email: foundUser.email,
        },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: "5d" }
      );

      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    }
  );
};

exports.getSingleUser = async (req, res) => {
  try {
    const data = await User.findById({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    console.log("data is", data);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500);
  }
};
exports.getAllusers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};
exports.getEmailUser = async (req, res) => {
  try {
    const email = req.body.email;
    console.log("email is", email);
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(200).json({ user });
    } else {
      const msg = "not found";
      res.status(200).json({ msg });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

exports.changeEmail = async (req, res) => {
  const { error, value } = validateChangeEmail(req.body);
  if (!error) {
    try {
      console.log("req,", req.body);
      const userMail = req.body.oldEmail;
      const user = await User.findOne({ email: userMail });
      // await Otp.findOneAndDelete({ userEmail: userMail });
      await Otp.deleteMany({ userEmail: userMail });
      await Otp.deleteMany({ userEmail: req.body.email });

      sendOtpVerification({ _id: user._id, email: req.body.email }, req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  } else {
    console.log(error);
  }
};
exports.verifyOtp = async (req, res) => {
  const { error, value } = validateEmailOtp(req.body);
  if (!error) {
    try {
      const otp = req.body.otp;
      const newEmail = req.body.email;
      console.log("req,", req.body);
      const userMail = req.body.oldEmail;
      // const user = await User.findOne({ email: userMail });
      const userOtp = await Otp.findOne({ userEmail: newEmail });
      let message = "";
      if (Date.now() < userOtp.expiresAt) {
        const isValidOtp = compareOtp(otp, userOtp.otp);
        if (isValidOtp) {
          console.log("valid otp");
          await User.findOneAndUpdate(
            { email: userMail },
            { email: newEmail, isVerified: true }
          );
          await Otp.findOneAndDelete({ userEmail: newEmail });
          message = "verified";
        } else {
          console.log("invalid otp");
          message = "invalid-otp";
          // res.status(401);
        }
      } else {
        console.log("otp expired");
        await Otp.findOneAndDelete({ userEmail: userMail });
        message = "otp-expired";
        //await User.findOneAndDelete({ email: email });
        // res.status(403);
      }
      res.status(200).json({ message });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  } else {
    console.log(error);
    res.status(401).json({ error });
  }
};
