import {Body, Controller, Post} from "@nestjs/common";
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
}
