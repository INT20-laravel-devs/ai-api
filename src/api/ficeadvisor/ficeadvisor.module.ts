import { Module } from '@nestjs/common';
import { FiceAdvisorService } from './ficeadvisor.service';
import { PrismaService } from '../../database/prisma.service';
import { FiceAdvisorController } from './ficeadvisor.controller';

@Module({
  providers: [FiceAdvisorService, PrismaService],
  exports: [FiceAdvisorService],
  controllers: [FiceAdvisorController],
})
export class FiceAdvisorModule {}
