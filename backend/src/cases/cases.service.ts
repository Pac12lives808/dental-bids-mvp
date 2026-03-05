import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get open cases for an office user to browse and bid on.
   * - Filters by office's city
   * - Excludes cases where the office has already bid (any status)
   * - Returns newest first
   * - Supports cursor-based pagination
   */
  async getOpenCases(officeUserId: string, take: number = 20, cursor?: string) {
    // Validate and cap take
    const limitedTake = Math.min(Math.max(take, 1), 50);

    // Get office profile to determine city
    const officeProfile = await this.prisma.officeProfile.findUnique({
      where: { userId: officeUserId },
      select: { city: true },
    });

    if (!officeProfile) {
      throw new NotFoundException('Office profile not found');
    }

    // Query open cases in the office's city, excluding cases where office already bid
    const cases = await this.prisma.case.findMany({
      where: {
        status: 'OPEN',
        city: officeProfile.city,
        bids: {
          none: {
            officeId: officeUserId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limitedTake + 1, // Fetch one extra to determine if there's a next page
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true,
        procedure: true,
        city: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            bids: true,
          },
        },
      },
    });

    // Determine if there's a next page
    const hasMore = cases.length > limitedTake;
    const casesToReturn = hasMore ? cases.slice(0, limitedTake) : cases;
    const nextCursor = hasMore ? casesToReturn[casesToReturn.length - 1].id : null;

    // Transform to HIPAA-safe format
    const safeCases = casesToReturn.map((c) => ({
      id: c.id,
      procedure: c.procedure,
      city: c.city,
      status: c.status,
      createdAt: c.createdAt,
      bidsCount: c._count.bids,
    }));

    return {
      cases: safeCases,
      nextCursor,
    };
  }

  /**
   * Get a specific case by ID.
   * Returns HIPAA-safe fields only (no patient PHI).
   */
  async getCaseById(caseId: string) {
    const c = await this.prisma.case.findUnique({
      where: { id: caseId },
      select: {
        id: true,
        procedure: true,
        city: true,
        status: true,
        createdAt: true,
        description: true,
        _count: {
          select: {
            bids: true,
          },
        },
      },
    });

    if (!c) {
      throw new NotFoundException('Case not found');
    }

    // Return HIPAA-safe shape
    return {
      id: c.id,
      procedure: c.procedure,
      city: c.city,
      status: c.status,
      createdAt: c.createdAt,
      notes: c.description || null,
      bidsCount: c._count.bids,
    };
  }
}
