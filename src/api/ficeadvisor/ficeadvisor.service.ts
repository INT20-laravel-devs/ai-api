import { Injectable } from '@nestjs/common';

@Injectable()
export class FiceAdvisorService {
  private readonly ficeAdvisorUrl = process.env.FICEADVISOR;

  private readonly header = {
    'Content-Type': 'application/json',
  };

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
