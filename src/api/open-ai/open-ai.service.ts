import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly openAi = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY ?? '',
  });

  private readonly assistantId = 'asst_dPUdY6N2oV3Rkl5THgeRjCuD';

  async getAllAssistants() {
    return this.openAi.beta.assistants.list();
  }

  async createRun(content: string) {
    return this.openAi.beta.threads.createAndRun({
      assistant_id: this.assistantId,
      thread: {
        messages: [{ role: 'user', content }],
      },
    });
  }

  async getRun() {
    return this.openAi.beta.threads.runs.retrieve(
      'thread_nDoPBRwgjqwTH5FbkiRPLzEy',
      'run_HCcWcbtV5QVDf6WqSxFoSalP',
    );
  }
}
