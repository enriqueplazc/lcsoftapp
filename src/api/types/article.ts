export interface Article {
  id: number;
  title: string;
  content: string;
  mainImageUrl: string;
  publishedDate: string;
  views: number;
  authorId: number;
  categoryId: number;
  author: Author;
  category: Category;
}

export interface Author {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roleType: string;
  status: boolean;
  position: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}
