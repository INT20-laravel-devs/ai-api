import { Module } from '@nestjs/common';
import { FiceAdvisorService } from './ficeadvisor.service';

@Module({
  providers: [FiceAdvisorService],
  exports: [FiceAdvisorService],
})
export class FiceAdvisorModule {}
