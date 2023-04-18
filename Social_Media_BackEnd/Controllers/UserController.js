import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

// Get all users
export const getAllUsers = async (req, res) =>
{
  try {
    let users = await UserModel.find();
    users = users.map((user) =>
    {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    })
    res.status(200).json(users);

  } catch (error) {
    res.status(500).json(error);
  }
}

// Get a user
export const getUser = async (req, res) =>
{
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {

      // user - password (take password out for the datas)
      const { password, ...otherDetails } = user._doc
      res.status(200).json(otherDetails);
    }

    else {
      res.status(404).json("No such user exists");
    }
      
  } catch (error) {
    res.status(500).json(error);
  }

};

// Update a user
export const updateUser = async (req, res) =>
{
  const id = req.params.id;

  const { _id, currentUserAdminStatus, password } = req.body;

  if (id === _id) {
    try {

      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({user, token});

    } catch (error) {
      res.status(500).json(error);
    }
  }

  else {
    res.status(403).json("Access Denied, you can only update your own profile.");
  }
};

// Delete User
export const deleteUser = async (req, res) =>
{
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;

  if (currentUserId === id || currentUserAdminStatus) {
    
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User successfully deleted");

    } catch (error) {
      res.status(500).json(error);
    }
  }

  else {
    res.status(403).json("Access Denied, you can only delete your own profile.");
  }
};

// Follow a user
export const followUser = async (req, res) =>
{
  const id = req.params.id;
  const { _id } = req.body;

  // You can't follow yourself
  if (_id === id) {
    res.status(403).json("Action forbidden");
  }
  else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      // If user doesn't already follows that guy
      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { followings: id } });

        res.status(200).json("User followed!");
      }

      else {
        res.status(403).json("User is Already followed by you");
      }

    } catch (error) {
      res.status(500).json(error);
    }
  }
}

// Unfollow a user

export const UnFollowUser = async (req, res) =>
{
  const id = req.params.id;
  const { _id } = req.body;

  // You can't follow yourself
  if (_id === id) {
    res.status(403).json("Action forbidden");
  }
  else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      // If user doesn't already follows that guy
      if (followUser.followers.includes(_id)) {
        await followUser.updateOne({ $pull: { followers: _id } });
        await followingUser.updateOne({ $pull: { followings: id } });

        res.status(200).json("User unfollowed!");
      }

      else {
        res.status(403).json("User is not followed by you");
      }

    } catch (error) {
      res.status(500).json(error);
    }
  }
}