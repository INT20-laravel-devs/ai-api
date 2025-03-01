import {Injectable} from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class OpenAiService {
  private readonly openAi = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY ?? '',
  });

  private readonly assistantId = 'asst_dPUdY6N2oV3Rkl5THgeRjCuD';

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

  async getAllAssistants () {
    return this.openAi.beta.assistants.list();
  }

  async createMessage(message: string) {
    return this.openAi.beta.threads.create({
      messages: [{
        role: 'user',
        content: 'Знайди викладача Рокового'
      }]
    })
  }

  async createRun () {
    return this.openAi.beta.threads.createAndRun({
      assistant_id: this.assistantId,
      thread: {
        messages: [
          { role: "user", content: "Знайди викладача Рокового." },
        ],
      },
    });
  }

  async getRun() {
    return this.openAi.beta.threads.runs.retrieve(
      'thread_nDoPBRwgjqwTH5FbkiRPLzEy',
      'run_HCcWcbtV5QVDf6WqSxFoSalP',
    )
  }
}