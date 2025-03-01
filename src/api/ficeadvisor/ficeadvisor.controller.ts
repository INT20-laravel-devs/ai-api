import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FiceAdvisorService } from './ficeadvisor.service';
import { FiceAdvisorLoginDto } from './dto/ficeadvisor-login.dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('/ficeadvisor')
export class FiceAdvisorController {
  constructor(private readonly ficeAdvisorService: FiceAdvisorService) {}

  @UseGuards(AuthGuard())
  @Post()
  async createIntegration(
    @Body() body: FiceAdvisorLoginDto,
    @Req() req: Request,
  ) {
    return this.ficeAdvisorService.createIntegration(req['user'].id, body);
  }
}
