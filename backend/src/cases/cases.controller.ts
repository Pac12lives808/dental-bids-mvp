import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CasesService } from './cases.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { SubscriptionActiveGuard } from '../auth/guards/subscription-active.guard';

@Controller('cases')
export class CasesController {
  constructor(private service: CasesService) {}

  /**
   * GET /cases/open
   * Returns open cases in the office's city that they haven't bid on yet.
   * Requires OFFICE role with active subscription.
   */
  @UseGuards(JwtAuthGuard, SubscriptionActiveGuard)
  @Roles('OFFICE')
  @Get('open')
  async getOpenCases(
    @Request() req: any,
    @Query('take') take?: string,
    @Query('cursor') cursor?: string,
  ) {
    const user = req.user;
    const takeNum = take ? parseInt(take, 10) : 20;
    const result = await this.service.getOpenCases(user.id, takeNum, cursor);
    return result;
  }

  /**
   * GET /cases/:id
   * Returns HIPAA-safe case details (no patient PHI).
   * Requires OFFICE role with active subscription.
   */
  @UseGuards(JwtAuthGuard, SubscriptionActiveGuard)
  @Roles('OFFICE')
  @Get(':id')
  async getCaseById(@Param('id') caseId: string) {
    const caseDetails = await this.service.getCaseById(caseId);
    return caseDetails;
  }
}
