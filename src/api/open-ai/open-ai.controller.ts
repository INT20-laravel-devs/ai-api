import { Body, Controller, Get, Post } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Open AI')
@Controller('open-ai')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post('request')
  async sendRequest(@Body() body: { message: string }) {
    return this.openAiService.sendRequest(body.message);
  }

  @Get('assistants')
  findAllAssistants() {
    return this.openAiService.getAllAssistants();
  }

  @Post('message')
  sendMessage() {
    return this.openAiService.create();
  }

  @Post('run')
  async run() {
    return this.openAiService.createRun();
  }

  @Get('run')
  async getRun() {
    return this.openAiService.getRun();
  }
}
