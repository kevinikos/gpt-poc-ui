// eslint-disable-next-line import/no-extraneous-dependencies
import { rest } from 'msw';
import { ArticleDTO, PostArticleDTO } from '@/types/ArticleDTO';

const articles: ArticleDTO[] = [];

export const handlers = [
  rest.post<PostArticleDTO>(`${process.env.VUE_APP_API_PROXY_URL}/articles`, async (req, res, ctx) => {
    const body = await req.json();

    const newArticle = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: body.title,
      content: body.content,
    };

    articles.push(newArticle);

    return res(ctx.delay(1000), ctx.status(201), ctx.json(newArticle));
  }),

  rest.get(`${process.env.VUE_APP_API_PROXY_URL}/articles`, (_req, res, ctx) => res(
    ctx.delay(2000),
    ctx.status(200),
    ctx.json(articles),
  )),

  rest.delete(`${process.env.VUE_APP_API_PROXY_URL}/articles/:id`, (req, res, ctx) => {
    const articleId = req.params.id;

    const articleIndex = articles.findIndex((article) => article.id === articleId);
    if (articleIndex === -1) {
      return res(ctx.delay(1000), ctx.status(404));
    }

    articles.splice(articleIndex, 1);

    return res(ctx.delay(1000), ctx.status(200), ctx.json(articles));
  }),
];

export default {};
