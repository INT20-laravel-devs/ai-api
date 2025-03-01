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

  async getTeacherById(pathParams: { id: string }): Promise<string> {
    const url = `${this.ficeAdvisorUrl}/teachers/${pathParams.id}`;
    return fetch(url, { method: 'GET', headers: this.header }).then(
      (response) => response.json(),
    );
  }
}
