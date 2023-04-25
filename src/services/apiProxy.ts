import axios, { AxiosResponse } from 'axios';
import { ArticleDTO, PostArticleDTO } from '@/types/ArticleDTO';

export type SummaryItem = {
  country: string;
  summary: string;
  links: string[];
  // eslint-disable-next-line camelcase
  dangerous_level: string;
}
export type Summary = SummaryItem[];

export const fetchSummary = (countries: string[]): Promise<AxiosResponse<Summary>> => (
  axios.post(`${process.env.VUE_APP_API_PROXY_URL}/summary`, {
    countries,
  })
);

export const fetchArticles = () => (
  axios.get<ArticleDTO[]>(`${process.env.VUE_APP_API_PROXY_URL}/articles`)
);

export const postArticle = (articleDto: PostArticleDTO) => (
  axios.post<ArticleDTO>(`${process.env.VUE_APP_API_PROXY_URL}/articles`, {
    title: articleDto.title,
    content: articleDto.content,
  })
);

export const deleteArticle = (id: string) => (
  axios.delete<null>(`${process.env.VUE_APP_API_PROXY_URL}/articles/${id}`)
);

export default {};
