export interface Retrospective {
  id: string;
  date: string;
  week: number;
  day_count: number;
  author: string;
  summary: string;
  keep: string;
  problem: string;
  try: string;
  memo: string;
  created_at: string;
}

export type Author = '최희정' | '김창훈';

export interface RetrospectiveFormData {
  author: Author;
  summary: string;
  keep: string;
  problem: string;
  try: string;
  memo: string;
}