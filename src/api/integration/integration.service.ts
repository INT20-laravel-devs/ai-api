import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class IntegrationService {
  constructor(private readonly prisma: PrismaService) {}

  async createIntegration(name: string) {
    return this.prisma.integration.create({
      data: {
        name,
      },
    });
  }
}
