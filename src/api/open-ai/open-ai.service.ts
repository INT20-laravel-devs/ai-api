import {Injectable} from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class OpenAiService {
  private readonly openAi = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY ?? '',
  });

  async sendRequest(message: string) {
    const response = this.openAi.chat.completions.create({
      model: 'g-67c321a20f38819192ef9fcf90922551-test',
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    })
    return response;
  }
}