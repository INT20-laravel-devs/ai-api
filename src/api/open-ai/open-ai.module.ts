import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { FiceAdvisorModule } from '../ficeadvisor/ficeadvisor.module';

@Module({
  providers: [OpenAiService],
  imports: [FiceAdvisorModule],
  exports: [OpenAiService],
})
export class OpenAiModule {}
