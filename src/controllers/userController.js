import * as userService from '../services/userService.js';
import { validateUpdateProfile } from '../validators/userValidator.js';

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        id: user.id,
        identifier: user.identifier,
        fullName: user.fullName,
        email: user.email,
        address: user.address,
        avatarUrl: user.avatarUrl,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Validate input data
    const validation = validateUpdateProfile(updateData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Update user profile
    const updatedUser = await userService.updateUserProfile(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        identifier: updatedUser.identifier,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        address: updatedUser.address,
        avatarUrl: updatedUser.avatarUrl,
        updatedAt: updatedUser.updated_at
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    
    // Handle specific database errors
    if (error.message && error.message.includes('UNIQUE constraint')) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({
        success: false,
        message: 'Avatar URL is required'
      });
    }

    // Validate URL format
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
    if (!urlPattern.test(avatarUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid avatar URL format. Must be a valid image URL.'
      });
    }

    const updatedUser = await userService.updateUserAvatar(userId, avatarUrl);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatarUrl: updatedUser.avatarUrl
      }
    });
  } catch (error) {
    console.error('Upload Avatar Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

