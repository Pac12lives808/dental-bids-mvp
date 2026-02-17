import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private config: ConfigService, private prisma: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get<string>('JWT_SECRET') || 'dev-secret',
		});
	}

	async validate(payload: any) {
		const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
		if (!user) return null;
		const { passwordHash, ...rest } = user as any;
		return rest;
	}
}
