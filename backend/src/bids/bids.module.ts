import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';

@Module({
  imports: [PrismaModule],
  controllers: [BidsController],
  providers: [BidsService],
  exports: [BidsService],
})
export class BidsModule {}
