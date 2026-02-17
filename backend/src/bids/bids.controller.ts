import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';

class CreateBidDto {
  caseId: string;
  priceCents: number;
  availability?: string;
  notes?: string;
}

@Controller('bids')
export class BidsController {
  constructor(private service: BidsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('OFFICE')
  @Post()
  async upsert(@Body() dto: CreateBidDto, @Request() req: any): Promise<any> {
    const user = req.user;
    const bid = await this.service.upsertBid(user.id, dto.caseId, dto.priceCents, dto.availability, dto.notes);
    return { bid };
  }
}
