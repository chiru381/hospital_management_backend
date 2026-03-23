import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtUtilsService } from '../utils/jwt-utils.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtUtilsService: JwtUtilsService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string; user: any }> {
    const { confirmPassword, ...userData } = registerDto;

    if (userData.password !== confirmPassword) {
      throw new ConflictException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findOne({
      where: [{ email: userData.email }, { username: userData.username }],
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const role = await this.roleRepository.findOne({ where: { id: userData.roleId } });
    if (!role) {
      throw new ConflictException('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role,
      dob: new Date(userData.dob),
      status: userData.status || 'active',
      isactive: userData.isactive !== undefined ? userData.isactive : true,
    });

    await this.userRepository.save(user);

    const payload = { sub: user.id, email: user.email, role: role.rolename };
    const accessToken = this.jwtUtilsService.generateAccessToken(payload);
    const refreshToken = this.jwtUtilsService.generateRefreshToken(payload);

    const { password, ...userDetails } = user;
    return { 
      message: 'User registered successfully', 
      user: {
        ...userDetails,
        role: role.rolename
      }
    };
  }

  async login(loginDto: LoginDto): Promise<{ message: string; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['role'],
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isactive || user.status !== 'active') {
      throw new UnauthorizedException('Account is inactive');
    }

    const payload = { sub: user.id, email: user.email, role: user.role.rolename };
    const accessToken = this.jwtUtilsService.generateAccessToken(payload);
    const refreshToken = this.jwtUtilsService.generateRefreshToken(payload);

    return { 
      message: 'Login successful', 
      accessToken, 
      refreshToken 
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtUtilsService.verifyToken(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['role'],
      });

      if (!user || !user.isactive || user.status !== 'active') {
        throw new UnauthorizedException('Invalid token');
      }

      const newPayload = { sub: user.id, email: user.email, role: user.role.rolename };
      const accessToken = this.jwtUtilsService.generateAccessToken(newPayload);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(): Promise<{ message: string }> {
    // In a real app, you might blacklist the token or handle on client side
    return { message: 'Logged out successfully' };
  }
}