import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository, UserRepository } from '../repositories/user.repository';
import { RegisterDTO, LoginDTO } from '../dtos/auth.dto';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { env } from '../config/env';
import type { User } from '@prisma/client';

export class AuthService {
  private userRepository: IUserRepository;

  constructor(userRepository?: IUserRepository) {
    this.userRepository = userRepository || new UserRepository();
  }

  async register(data: RegisterDTO): Promise<{ token: string; user: Omit<User, 'password'> }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new ConflictError('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.userRepository.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    // Generate token
    const token = this.generateToken(user);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  }

  async login(data: LoginDTO): Promise<{ token: string; user: Omit<User, 'password'> }> {
    // Find user
    const user = await this.userRepository.findByUsername(data.username);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
  }
}
