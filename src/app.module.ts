import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { ChatModule } from './api/chat/chat.module';
import { OpenAiModule } from './api/open-ai/open-ai.module';
import { FiceAdvisorModule } from './api/ficeadvisor/ficeadvisor.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ChatModule,
    OpenAiModule,
    FiceAdvisorModule,
  ],
})
export class AppModule {}
