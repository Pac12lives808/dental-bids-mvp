import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
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
  await app.listen(port);
  console.log(`Application running on port ${port}`);
}
bootstrap();
