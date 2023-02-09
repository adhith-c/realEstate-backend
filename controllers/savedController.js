const Property = require("../models/property");
const User = require("../models/user");
const Saved = require("../models/saved");

exports.getSaved = async (req, res) => {
  try {
    const userEmail = req.user.UserInfo.email;
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.json({ msg: "not valid user" });
    const saved = await Saved.findOne({ userId: user._id }).populate({
      path: "userId",
      path: "Items",
      populate: {
        path: "propertyId",
      },
    });
    console.log("saved:", saved);
    if (saved) {
      res.json({ saved: saved });
    } else {
      res.sendStatus(400).json({ msg: "nothing" });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addToSaved = async (req, res) => {
  try {
    console.log("inside contollerrrr");
    let propertyId = req.params.id;
    const userEmail = req.user.UserInfo.email;
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.json({ msg: "not valid user" });
    let userExist = await Saved.findOne({
      userId: user._id,
    });
    if (userExist) {
      console.log("inside userrrrrr");
      let propertyExist = await Saved.findOne({
        $and: [
          {
            userId: user._id,
          },
          {
            Items: {
              $elemMatch: {
                propertyId,
              },
            },
          },
        ],
      });
      if (propertyExist) {
        console.log("proppppppp");
        return res.json({ msg: "property already exist" });
      } else {
        console.log("else prop exist");

        await Saved.updateOne(
          {
            userId: user._id,
          },
          {
            $push: {
              Items: {
                propertyId,
              },
            },
          }
        );
        return res.json({ msg: "added successfully" });
      }
      // res.sendStatus(200).json({ saved: saved });
    } else {
      console.log("else userexist");

      let saved = new Saved({
        userId: user._id,
        Items: [
          {
            propertyId,
          },
        ],
      });
      await saved.save();
      return res.json({ saved });
    }
  } catch (err) {
    console.log(err);
  }
};
