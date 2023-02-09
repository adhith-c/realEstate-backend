require("dotenv").config();
const Admin = require("../models/admin");
const User = require("../models/user");
const Property = require("../models/property");
const Banner = require("../models/banner");
const Chat = require("../models/chat");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/helper");
const { validateAdmin } = require("../utils/validator");

exports.getAdminLogin = async (req, res) => {
  try {
    const admin = await Admin.find({});
    if (admin.length == 0) {
      const hashedpassword = hashPassword(process.env.PASSWORD);
      const newAdmin = new Admin({
        name: process.env.NAME,
        email: process.env.EMAIL,
        password: hashedpassword,
      });
      await newAdmin.save();
      res.send(newAdmin);
    } else {
      res.send("login page of admin");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postAdminLogin = async (req, res) => {
  const { error, value } = validateAdmin(req.body);
  if (!error) {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      console.log("admin", admin);
      if (admin) {
        const isValid = comparePassword(password, admin.password);
        console.log("valid", isValid);
        if (isValid) {
          const token = jwt.sign(
            {
              id: admin._id,
              name: admin.name,
              type: "admin",
            },
            process.env.JWT_ADMIN_SECRET_KEY
          );
          res.status(200).json({ accessToken: token, id: admin._id });
        } else {
          res.send("incorrect password");
        }
      } else {
        // res.send("invalid email");
        const hashedpassword = hashPassword(process.env.PASSWORD);
        const newAdmin = new Admin({
          name: process.env.NAME,
          email: process.env.EMAIL,
          password: hashedpassword,
        });
        await newAdmin.save();
        if (email === newAdmin.email) {
          const isValidPass = comparePassword(password, newAdmin.password);
          if (isValidPass) {
            const token = jwt.sign(
              {
                id: admin._id,
                name: admin.name,
                type: "admin",
              },
              process.env.JWT_ADMIN_SECRET_KEY
            );
            res.status(200).json({ id: admin._id, accessToken: token });
          } else {
            res.send("incorrect password");
          }
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  } else {
    console.log(error);
    res.json({ error });
  }
};

exports.userDetails = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log(err);
  }
};

exports.banners = async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.send(banners);
  } catch (err) {
    console.log(err);
  }
};

exports.addBanners = async (req, res) => {
  try {
    const { offer, description } = req.body;
    const newBanner = new Banner({
      offer,
      description,
    });
    await newBanner.save();
    res.send(newBanner);
  } catch (err) {
    console.log(err);
  }
};
exports.blockUnblockUser = async (req, res) => {
  try {
    console.log("inside blockkk");
    let { id } = req.params;
    const blockuser = await User.findOne({
      _id: id,
    });
    // id = mongoose.Types.ObjectId(id);
    // let status = blockuser.status;
    if (blockuser.isBlocked) {
      await User.findByIdAndUpdate(id, {
        isBlocked: false,
        status: "active",
      });
      res.status(200).json({ msg: "unBlocked" });
    } else {
      await User.findByIdAndUpdate(id, {
        isBlocked: true,
        status: "blocked",
      });
      res.status(202).json({ msg: "blocked" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

exports.getUserCount = async (req, res) => {
  try {
    const userCount = await User.find({}).count();
    res.status(200).json({ userCount });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
exports.getPropertyCount = async (req, res) => {
  try {
    const propertyCount = await Property.find({}).count();
    console.log(propertyCount);
    res.status(200).json({ propertyCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};
exports.getChatCount = async (req, res) => {
  try {
    const chatCount = await Chat.find({}).count();
    console.log(chatCount);
    res.status(200).json({ chatCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};
