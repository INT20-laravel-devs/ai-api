import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { ChatModule } from './api/chat/chat.module';
import {OpenAiModule} from "./api/open-ai/open-ai.module";

@Module({
  imports: [AuthModule, UserModule, ChatModule, OpenAiModule],
})
export class AppModule {}
