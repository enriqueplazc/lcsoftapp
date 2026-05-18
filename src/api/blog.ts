import { joinUrl } from '../utils/join-url';
import { ApiResponse, Article } from './types';
import { AxiosInstance } from 'axios';

export class BlogApi {
  private readonly path = '/posts';

  constructor(private readonly instance: AxiosInstance) {}
  async findAll() {
    const response = await this.instance.get<ApiResponse<Article[]>>(
      joinUrl(this.path)
    );
    return response.data;
  }

  async findById(articleId: string) {
    const response = await this.instance.get<ApiResponse<Article>>(
      joinUrl(this.path, articleId)
    );
    return response.data;
  }
}
