import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IsString, IsEmail, IsArray, IsOptional } from 'class-validator';
import { AuthService } from './auth.service';

class SignupPatientDto {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
}

class SignupOfficeDto {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
    @IsString()
    officeName: string;
    @IsString()
    city: string;
    @IsArray()
    @IsOptional()
    procedures: string[];
}

class LoginDto {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @Post('signup/patient')
    async signupPatient(@Body() dto: SignupPatientDto): Promise<any> {
        const user = await this.auth.signupPatient(dto.email, dto.password);
        return { user };
    }

    @Post('signup/office')
    async signupOffice(@Body() dto: SignupOfficeDto): Promise<any> {
        const user = await this.auth.signupOffice(dto.email, dto.password, dto.officeName, dto.city, dto.procedures || []);
        return { user };
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() dto: LoginDto): Promise<any> {
        const user = await this.auth.validateUser(dto.email, dto.password);
        if (!user) return { error: 'Invalid credentials' };
        return this.auth.login(user);
    }
}
