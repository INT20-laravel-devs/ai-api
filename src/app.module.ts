import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { ChatModule } from './api/chat/chat.module';

@Module({
  imports: [AuthModule, UserModule, ChatModule],
})
export class AppModule {}
