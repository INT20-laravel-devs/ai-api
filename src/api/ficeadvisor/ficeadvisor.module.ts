import { Module } from '@nestjs/common';
import { FiceAdvisorService } from './ficeadvisor.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  providers: [FiceAdvisorService, PrismaService],
  exports: [FiceAdvisorService],
})
export class FiceAdvisorModule {}
