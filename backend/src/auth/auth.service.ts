import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { City, ProcedureType } from '@prisma/client';

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService, private prisma: PrismaService) {}

	async signupPatient(email: string, password: string): Promise<any> {
		const existing = await this.prisma.user.findUnique({ where: { email } });
		if (existing) throw new BadRequestException('Email already in use');
		const hash = await bcrypt.hash(password, 10);
		const user = await this.prisma.user.create({ data: { email, passwordHash: hash, role: 'PATIENT' as any } as any } as any);
		await this.prisma.patientProfile.create({ data: { userId: user.id } });
		const { passwordHash, ...rest } = user as any;
		return rest;
	}

	async signupOffice(email: string, password: string, officeName: string, city: string, procedures: string[]): Promise<any> {
		const existing = await this.prisma.user.findUnique({ where: { email } });
		if (existing) throw new BadRequestException('Email already in use');
		const hash = await bcrypt.hash(password, 10);
		const user = await this.prisma.user.create({ data: { email, passwordHash: hash, role: 'OFFICE' as any } as any } as any);
		await this.prisma.officeProfile.create({
			data: {
				userId: user.id,
				officeName,
				city: city as City,
				procedures: procedures as ProcedureType[],
			},
		});
		const { passwordHash, ...rest } = user as any;
		return rest;
	}

	async validateUser(email: string, password: string) {
		const user = await this.prisma.user.findUnique({ where: { email } });
		if (!user) return null;
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return null;
		const { passwordHash, ...rest } = user as any;
		return rest;
	}

	async login(user: any) {
		const payload = { sub: user.id, role: user.role };
		return { access_token: this.jwtService.sign(payload) };
	}
}
