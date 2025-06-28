import { Router, Request, Response } from 'express';
import { celebrate } from 'celebrate';
import { UsersService } from '../services/users';
import { registerSchema, loginSchema, refreshSchema, verifySchema } from '../validators/auth.validator';

const router = Router();
const usersService = new UsersService();

router.post('/register', celebrate(registerSchema), async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const result = await usersService.registration({ username, email, password });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      res.status(409).json({
        success: false,
        message: error.message
      });
      return;
    }
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.post('/login', celebrate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await usersService.login(email, password);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error: any) {
    if (error.message.includes('Invalid email or password')) {
      res.status(401).json({
        success: false,
        message: error.message
      });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.post('/refresh', celebrate(refreshSchema), async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await usersService.refreshToken(refreshToken);
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens
    });
  } catch (error: any) {
    if (error.message.includes('Invalid refresh token') || error.message.includes('User not found')) {
      res.status(401).json({
        success: false,
        message: error.message
      });
      return;
    }
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.post('/verify', celebrate(verifySchema), async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const payload = await usersService.verifyToken(token);
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: payload
    });
  } catch (error: any) {
    if (error.message.includes('Invalid token')) {
      res.status(401).json({
        success: false,
        message: error.message
      });
      return;
    }
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router; 