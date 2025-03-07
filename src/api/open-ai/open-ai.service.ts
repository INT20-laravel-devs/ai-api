import {BadRequestException, Injectable} from '@nestjs/common';
import OpenAI from 'openai';
import {FiceAdvisorService} from "../ficeadvisor/ficeadvisor.service";
import {PrismaService} from "../../database/prisma.service";

@Injectable()
export class OpenAiService {
  constructor(
    private readonly ficeAdvisorService:FiceAdvisorService,
    private readonly prismaService: PrismaService,
  ) {
  }
  private readonly openAi = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY ?? '',
  });

  private readonly assistantId = 'asst_dPUdY6N2oV3Rkl5THgeRjCuD';

  async getAllAssistants() {
    return this.openAi.beta.assistants.list();
  }

  async createThread() {
    return this.openAi.beta.threads.create({});
  }

  async addMessageToThread(threadId: string, message: string, userId: string) {
    await this.openAi.beta.threads.messages.create(threadId,
      { role: 'user', content: message })
    return this.createRun(threadId, userId);
  }

  async createRun(threadId: string, userId: string) {
    let run = await this.openAi.beta.threads.runs.create(
      threadId,
      { assistant_id: this.assistantId }
    );
    const payload = await this.prismaService.userIntegrations.findFirst({
      where: {
        userId,
      }
    })
    if (!payload) {
      throw new BadRequestException('Incorrect user');
    }

    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      run = await this.openAi.beta.threads.runs.retrieve(run.thread_id, run.id);
      console.log(`🔄 Поточний статус: ${run.status}`);

      if (run.status === 'completed' || run.status === 'failed') {
        if (run.status === 'failed') {
          console.dir(run, { depth: null });
          throw new BadRequestException('Помилка під час виконання run.');
        }
        break;
      }

      if (run.status === 'requires_action' && run.required_action) {
        const toolCalls = run.required_action.submit_tool_outputs.tool_calls;

        const toolResponses = await Promise.all(toolCalls.map(async (toolCall) => {
          const method = toolCall.function.name;
          const param = JSON.parse(toolCall.function.arguments);

          try {
            const result = await this.ficeAdvisorService[method](param, JSON.parse(payload.payload as any).token);
            return {
              tool_call_id: toolCall.id,
              output: JSON.stringify(result),
            };
          } catch (error) {
            console.error(`❌ Помилка виконання функції ${method}:`, error);
            return {
              tool_call_id: toolCall.id,
              output: JSON.stringify({ error: "Помилка під час виконання функції" }),
            };
          }
        }));

        await this.openAi.beta.threads.runs.submitToolOutputs(run.thread_id, run.id, {
          tool_outputs: toolResponses,
        });
      }
    }

    const messages = await this.openAi.beta.threads.messages.list(run.thread_id) as any;
    return messages.data[0]?.content[0].text.value || "Немає відповіді від OpenAI.";
  }
}
