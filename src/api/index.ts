import { BlogApi } from './blog';
import { instance } from './instance';

export const blogApi = new BlogApi(instance);

export * from './types';
