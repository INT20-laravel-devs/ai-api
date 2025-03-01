import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IntegrationService } from './integration.service';

@ApiTags('Integration')
@Controller('/integrations')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post()
  async createIntegration(@Body() body: { name: string }) {
    return this.integrationService.createIntegration(body.name);
  }
}
