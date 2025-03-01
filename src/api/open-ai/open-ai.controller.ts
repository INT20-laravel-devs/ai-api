import { Body, Controller, Get, Post } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Open AI')
@Controller('open-ai')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Get('assistants')
  findAllAssistants() {
    return this.openAiService.getAllAssistants();
  }

  @Post('run')
  async run(
    @Body()body:  {content: string}
  ) {
    return this.openAiService.createRun(body.content)
  }
}
