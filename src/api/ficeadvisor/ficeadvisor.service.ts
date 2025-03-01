import { BadRequestException, Injectable } from '@nestjs/common';
import { FiceAdvisorLoginDto } from './dto/ficeadvisor-login.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FiceAdvisorService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly ficeAdvisorUrl = process.env.FICEADVISOR;

  private readonly header = {
    'Content-Type': 'application/json',
  };

  async createIntegration(
    userId: string,
    body: FiceAdvisorLoginDto,
  ): Promise<{ message: string }> {
    const res = await fetch(`${this.ficeAdvisorUrl}/auth/login`, {
      method: 'POST',
      headers: this.header,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new BadRequestException('Invalid credentials');
    }
    const { refreshToken } = await res.json();
    const { id } = await this.prisma.integration.findFirst({
      where: { name: 'FiceAdvisor' },
    });
    await this.prisma.userIntegrations.create({
      data: {
        userId,
        integrationId: id,
        payload: JSON.stringify({ ...body, token: refreshToken }),
      },
    });
    return { message: 'Success!' };
  }

  async getAllTeachers(queryParams: { search?: string }): Promise<string> {
    let url = `${this.ficeAdvisorUrl}/teachers`;
    if (queryParams.search) {
      url += `?search=${queryParams.search}`;
    }
    return fetch(url, { method: 'GET', headers: this.header }).then(
      (response) => response.json(),
    );
  }

  async getTeacher(pathParams: { id: string }): Promise<string> {
    const url = `${this.ficeAdvisorUrl}/teachers/${pathParams.id}`;
    return fetch(url, { method: 'GET', headers: this.header }).then(
      (response) => response.json(),
    );
  }

  async getTeacherComments(params: {
    teacherId: string;
    subjectId?: string;
    year?: number;
    semester?: number;
    sortBy?: string;
    page?: number;
    pageSize?: number;
  }): Promise<string> {
    const { teacherId, ...queryParams } = params;
    let url = `${this.ficeAdvisorUrl}/teachers/${teacherId}/comments`;

    const queryString = new URLSearchParams(queryParams as any).toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return fetch(url, { method: 'GET', headers: this.header }).then(
      (response) => response.json(),
    );
  }
}
