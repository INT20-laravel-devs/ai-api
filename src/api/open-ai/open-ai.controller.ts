import {OpenAiService} from "./open-ai.service";
import {Body, Controller, Post} from "@nestjs/common";

@Controller('open-ai')
export class OpenAiController {

  constructor(private readonly openAiService: OpenAiService) {
  }

  @Post('run')
  async run(
    @Body() body: {content: string, userId: string},
  ) {
    return this.openAiService.addMessageToThread('thread_4T5Ghh9UBpxSaiTuDKzixysi', body.content, body.userId)
  }
}