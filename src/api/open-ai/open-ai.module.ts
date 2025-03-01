import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { FiceAdvisorModule } from '../ficeadvisor/ficeadvisor.module';
import {OpenAiController} from "./open-ai.controller";
import {PrismaService} from "../../database/prisma.service";

@Module({
  providers: [OpenAiService, PrismaService],
  imports: [FiceAdvisorModule],
  exports: [OpenAiService],
  controllers: [OpenAiController]
})
export class OpenAiModule {}
