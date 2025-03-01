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

  private readonly bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYzBmYjg3MS0xMWRkLTQwOGMtYTU2Yy0xN2VlY2I3MTA2Y2IiLCJ1c2VybmFtZSI6IklsbGlhMTgiLCJjcmVhdGVkQXQiOjE3NDA4MzExNjU5MDcsImlhdCI6MTc0MDgzMTE2NSwiZXhwIjoxNzQyMDQwNzY1fQ.Y-ZJjjbfWRI8_4XGPQkNmrEfuXj-NmV-nvawobFveYM';


  async getDisciplines1(queryParams: { search?: string }): Promise<string> {
    let url = `${this.ficeAdvisorUrl}/disciplines`;
    if (queryParams.search) {
      url += `?search=${queryParams.search}`;
    }
    return fetch(url, { method: 'GET', headers: this.header }).then(
      (response) => response.json(),
    );
  }

  async getGroups(queryParams: { search?: string }): Promise<string> {
    let url = `${this.ficeAdvisorUrl}/groups`;
    if (queryParams.search) {
      url += `?search=${queryParams.search}`;
    }
    return fetch(url, { method: 'GET', headers: this.header }).then(
      (response) => response.json(),
    );
  }

  async createEvent(body: {
    groupId: string;
    name: string;
    disciplineId: string;
    eventType: string;
    teacherIds: string[];
    startTime: string;
    endTime: string;
    period: string;
    url: string;
    disciplineInfo: string;
    eventInfo: string;
  }, token: string) {
    console.dir(body,{depth:null})
    const url = `${this.ficeAdvisorUrl}/schedule/events`;
    const headers = { ...this.header, 'Authorization': `Bearer ${token}` };

    return fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }

  async getDisciplines(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
    groups?: string[];
  }) {
    const url = new URL(`${this.ficeAdvisorUrl}/disciplines`);

    if (params.page !== undefined) url.searchParams.append("page", params.page.toString());
    if (params.pageSize !== undefined) url.searchParams.append("pageSize", params.pageSize.toString());
    if (params.search !== undefined) url.searchParams.append("search", params.search);
    if (params.sort !== undefined) url.searchParams.append("sort", params.sort);
    if (params.order !== undefined) url.searchParams.append("order", params.order);
    if (params.groups && params.groups.length > 0) {
      params.groups.forEach(groupId => url.searchParams.append("groups", groupId));
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.header,
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch disciplines:", error);
      throw error;
    }
  }



  async getTeacherComments(params: { teacherId: string, subjectId?: string, year?: number, semester?: number, sortBy?: string, page?: number, pageSize?: number }): Promise<string> {
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
