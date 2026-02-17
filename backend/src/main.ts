import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import * as path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  // Env validation BEFORE NestFactory.create to fail fast
  const logger = new Logger('env-check');
  
  const requiredEnvs = ['DATABASE_URL', 'STRIPE_SECRET_KEY'];
  const stripeEnvs = ['STRIPE_PRICE_LAUNCH', 'STRIPE_PRICE_GROWTH', 'STRIPE_PRICE_LEADER'];
  
  // Check required envs
  const missingRequired = requiredEnvs.filter(e => !process.env[e]);
  if (missingRequired.length) {
    const msg = `[STARTUP ERROR] Missing required env vars: ${missingRequired.join(', ')}`;
    logger.error(msg);
    throw new Error(msg);
  }
  
  // Check Stripe price IDs
  const missingPrices = stripeEnvs.filter(e => !process.env[e]);
  if (missingPrices.length) {
    const msg = `[STARTUP ERROR] Missing Stripe price env vars: ${missingPrices.join(', ')}`;
    logger.error(msg);
    throw new Error(msg);
  }
  
  // Log env presence (boolean only, no values)
  const allEnvs = [
    'DATABASE_URL',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_LAUNCH',
    'STRIPE_PRICE_GROWTH',
    'STRIPE_PRICE_LEADER',
    'FRONTEND_URL',
  ];
  const presence: Record<string, boolean> = {};
  for (const e of allEnvs) presence[e] = !!process.env[e];
  logger.log('Env presence: ' + JSON.stringify(presence));

  // Warn for optional-but-important Stripe webhook secret (needed for production webhooks)
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    logger.warn('[LOCAL DEV OK] STRIPE_WEBHOOK_SECRET not set — use Stripe CLI for local webhook testing: stripe listen --forward-to localhost:3001/stripe/webhook');
  }

  const app = await NestFactory.create(AppModule);

    // Trust proxy for correct IP logging behind AWS load balancer
      app.getHttpAdapter().getInstance().set('trust proxy', 1);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

    // Enable Helmet for security headers
      app.use(helmet());

        // Enable rate limiting
          app.use(
                rateLimit({
                        windowMs: 15 * 60 * 1000, // 15 minutes
                              max: 100, // limit each IP to 100 requests per windowMs
                                  })
                                    );
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  const port = process.env.PORT || 3001;

    app.use(
    '/stripe/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );
  await app.listen(port);
  console.log(`Application running on port ${port}`);
}
bootstrap();
