import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CasesModule } from './cases/cases.module';
import { BidsModule } from './bids/bids.module';
import { StripeModule } from './stripe/stripe.module';
import { OfficesModule } from './offices/offices.module';
import { RolesGuard } from './auth/roles.guard';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [path.join(__dirname, '..', '.env')],
    }),
    PrismaModule,
    AuthModule,
    CasesModule,
    BidsModule,
    StripeModule,
    OfficesModule,
      ],
        controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
