import * as userModel from "../models/user.model.js";

export const getUserById = async (userId) => {
  try {
    return await userModel.findById(userId);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updateData) => {
  try {
    const { fullName, email, address } = updateData;

    const updateFields = {};
    if (fullName !== undefined) updateFields.fullName = fullName;
    if (email !== undefined) updateFields.email = email;
    if (address !== undefined) updateFields.address = address;

    return await userModel.updateUser(userId, updateFields);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const updateUserAvatar = async (userId, avatarUrl) => {
  try {
    return await userModel.updateUser(userId, { avatarUrl });
  } catch (error) {
    console.error("Error updating user avatar:", error);
    throw error;
  }
};

export const getUserByIdentifier = async (identifier) => {
  try {
    return await userModel.findByIdentifier(identifier);
  } catch (error) {
    console.error("Error getting user by identifier:", error);
    throw error;
  }
};

export const createUser = async ({ identifier }) => {
  try {
    return await userModel.createUser({ identifier });
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const findByIdentifier = async (identifier) => {
  try {
    return await userModel.findByIdentifier(identifier);
  } catch (error) {
    console.error("Error finding user by identifier:", error);
    throw error;
  }
};
