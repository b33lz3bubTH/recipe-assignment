import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.middleware';
import { UsersService } from '../services/users';

const router = Router();
const usersService = new UsersService();

// Protected route - Get current user profile
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Protected route - Update user profile
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { username } = req.body;

    if (!username) {
      res.status(400).json({
        success: false,
        message: 'Username is required'
      });
      return;
    }

    // Here you would typically update the user in the database
    // For now, we'll just return the current user data
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: req.user.id,
        email: req.user.email,
        username: username
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router; 