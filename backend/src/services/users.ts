import { Model } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUsers, UsersEntity } from "../models/users";
import { appConfig } from "../config";

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
  };
  tokens: TokenResponse;
}

export class UsersService {
  constructor(private model: Model<IUsers> = UserModel) {}

  private generateTokens(userPayload: { id: string; email: string; username: string }): TokenResponse {
    // @ts-ignore - Ignoring JWT typing issues for now
    const accessToken = jwt.sign(
      userPayload, 
      appConfig.jwtSecret, 
      { expiresIn: appConfig.jwtExpiresIn }
    );

    // @ts-ignore - Ignoring JWT typing issues for now
    const refreshToken = jwt.sign(
      userPayload, 
      appConfig.jwtSecret, 
      { expiresIn: appConfig.jwtRefreshExpiresIn }
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async registration(data: UsersEntity): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.model.findOne({
      $or: [{ email: data.email }, { username: data.username }]
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Hash the password
    const saltRounds = appConfig.bcryptSaltRounds;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Create user with hashed password
    const user = await this.model.create({
      ...data,
      password: hashedPassword
    });

    // Generate tokens
    const tokens = this.generateTokens({
      id: (user._id as any).toString(),
      email: user.email,
      username: user.username
    });

    return {
      user: {
        id: (user._id as any).toString(),
        email: user.email,
        username: user.username
      },
      tokens
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user by email
    const user = await this.model.findOne({ email });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = this.generateTokens({
      id: (user._id as any).toString(),
      email: user.email,
      username: user.username
    });

    return {
      user: {
        id: (user._id as any).toString(),
        email: user.email,
        username: user.username
      },
      tokens
    };
  }

  async verifyToken(token: string) {
    try {
      // @ts-ignore - Ignoring JWT typing issues for now
      return jwt.verify(token, appConfig.jwtSecret) as { id: string; email: string; username: string };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      // @ts-ignore - Ignoring JWT typing issues for now
      const payload = jwt.verify(refreshToken, appConfig.jwtSecret) as { id: string; email: string; username: string };
      
      // Check if user still exists
      const user = await this.model.findById(payload.id);
      if (!user) {
        throw new Error('User not found');
      }

      return this.generateTokens({
        id: (user._id as any).toString(),
        email: user.email,
        username: user.username
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}