import {Body, Controller, Get, Post} from "@nestjs/common";
import {OpenAiService} from "./open-ai.service";

@Controller('open-ai')
export class OpenAiController {
  constructor(
    private readonly openAiService: OpenAiService
  ) {
  }

  @Post('request')
  async sendRequest(@Body() body: {message: string}) {
    return this.openAiService.sendRequest(body.message);
  }

  @Get('assistants')
  async findAllAssistants() {
    return this.openAiService.getAllAssistants();
  }

  @Post('message')
  async sendMessage() {
    return this.openAiService.createMessage()
  }

  @Post('run')
  async run() {
    return this.openAiService.createRun()
  }

  @Get('run')
  async getRun(){
    return this.openAiService.getRun()
  }
}
