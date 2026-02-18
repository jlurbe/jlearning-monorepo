import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './models/login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const adminUsername = process.env['ADMIN_USERNAME'];
    const adminPassword = process.env['ADMIN_PASSWORD'];

    if (username === adminUsername && pass === adminPassword) {
      // In a real application, you would return the user object from the database
      // Here we just return a mock user object with the admin details
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = {
        userId: 'admin-id',
        username: adminUsername,
        password: adminPassword,
      };
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
