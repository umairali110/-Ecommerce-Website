
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Roles('admin')
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }
   @Post('verify-otp')
verifyOtp(@Body() body: any) {
  return this.authService.verifyOtp(
    body.email,
    body.otp,
    body.name,
    body.password,
  );
}
}