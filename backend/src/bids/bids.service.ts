import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BidsService {
	constructor(private prisma: PrismaService) {}

	async upsertBid(officeUserId: string, caseId: string, priceCents: number, availability?: string, notes?: string) {
		const c = await this.prisma.case.findUnique({ where: { id: caseId } });
		if (!c) throw new NotFoundException('Case not found');

		const officeProfile = await this.prisma.officeProfile.findUnique({ where: { userId: officeUserId } });
		if (!officeProfile) throw new NotFoundException('Office profile not found');

		// Eligibility checks
		if (officeProfile.city !== c.city) throw new ForbiddenException('Office city mismatch');
		if (!officeProfile.procedures || !officeProfile.procedures.includes(c.procedure as any)) throw new ForbiddenException('Procedure not supported');

		// Use OfficeSubscription for billing and limits
		const sub = await this.prisma.officeSubscription.findUnique({ where: { officeId: officeProfile.id } }).catch(() => null);
		if (!sub || sub.status !== 'ACTIVE') throw new ForbiddenException('Subscription not active');
		// Enforce monthly limits
		if (sub.estimatesLimitMonthly !== null && sub.estimatesUsedThisMonth >= sub.estimatesLimitMonthly) {
			throw new ForbiddenException('Monthly estimate limit reached');
		}

		// Upsert based on unique(caseId, officeId) constraint
		const existing = await this.prisma.bid.findUnique({ where: { caseId_officeId: { caseId, officeId: officeUserId } } as any });
		if (existing) {
			return this.prisma.bid.update({ where: { id: existing.id }, data: { priceCents, availability, notes } });
		}

		// Create bid and atomically increment usage
		const result = await this.prisma.$transaction(async (tx) => {
			const b = await tx.bid.create({ data: { caseId, officeId: officeUserId, priceCents, availability, notes } });
			await tx.officeSubscription.update({ where: { id: sub.id }, data: { estimatesUsedThisMonth: { increment: 1 } as any } });
			return b;
		});

		return result;
	}
}
