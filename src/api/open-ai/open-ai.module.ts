import { Module } from '@nestjs/common';
import { OpenAiController } from './open-ai.controller';
import { OpenAiService } from './open-ai.service';
import {FiceAdvisorModule} from "../ficeadvisor/ficeadvisor.module";

@Module({
  controllers: [OpenAiController],
  providers: [OpenAiService],
  imports: [FiceAdvisorModule],
  exports: [OpenAiService],
})
export class OpenAiModule {}
