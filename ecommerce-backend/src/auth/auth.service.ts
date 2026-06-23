import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { Otp } from './entities/otp.entity';

@Injectable()
export class AuthService {
 constructor(
  @InjectRepository(Users)
  private userRepo: Repository<Users>,
  private jwtService: JwtService,
  private emailService: EmailService,
  @InjectRepository(Otp)
private otpRepo: Repository<Otp>,
) {}

async register(data: any) {
  const existingUser = await this.userRepo.findOne({
    where: { email: data.email },
  });

  if (existingUser) {
    return { message: 'Email already exists ❌' };
  }

  const otp = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  const otpRecord = this.otpRepo.create({
  email: data.email,
  otp,
});

await this.otpRepo.save(otpRecord);

  await this.emailService.sendOtpEmail(
    data.email,
    otp,
  );

  return {
    message: 'OTP sent to email ✔',
  };
}

async verifyOtp(
  email: string,
  otp: string,
  name?: string,
  password?: string,
) {
  const otpRecord = await this.otpRepo.findOne({
    where: {
      email,
      otp,
    },
    order: {
      id: 'DESC',
    },
  });

  if (!otpRecord) {
    return {
      message: 'Invalid OTP ❌',
    };
  }

  await this.otpRepo.delete({
    email,
  });

  if (!name || !password) {
    return { message: 'Name and password required ❌' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = this.userRepo.create({
    name,
    email,
    password: hashedPassword,
    role: 'user',
  });

  await this.userRepo.save(user);

  return {
    message: 'Registration successful ✔',
  };
}
  async login(data: any) {
    const user = await this.userRepo.findOne({
      where: { email: data.email },
    });

   if (!user) {
  throw new Error('Invalid email or password');
}

  const isMatch = await bcrypt.compare(
  data.password,
  user.password || ''
);

   if (!user || !user.password) {
  throw new Error('Invalid credentials');
}

    const token = this.jwtService.sign({
      id: user.id,
      role: user.role,
    });

    const { password, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }
}