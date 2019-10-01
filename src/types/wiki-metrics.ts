export interface Article {
  article: string;
  views: number;
  rank: number;
}

export interface Item {
  project: string;
  access: string;
  year: string;
  month: string;
  day: string;
  articles: Article[];
}

export interface WikiMetrics {
  items: Item[];
}
