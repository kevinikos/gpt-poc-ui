import { computed, ref } from 'vue';
import {
  deleteArticle as apiDeleteArticle,
  fetchArticles as apiFetchArticles,
  fetchSummary as apiFetchSummary,
  postArticle as apiPostArticle,
  SummaryItem,
} from '@/services/apiProxy';
import { Destination } from '@/types/FormState';
import { ArticleDTO, PostArticleDTO } from '@/types/ArticleDTO';

type FetchState<T> =
  | { type: 'IDLE'}
  | { type: 'LOADING' }
  | { type: 'SUCCESS', data: T }
  | { type: 'ERROR', message: string };

type SummaryRecord = Record<string, SummaryItem>;
export type Article = ArticleDTO;

export const useApiProxy = () => {
  const summary = ref<FetchState<SummaryRecord>>({
    type: 'IDLE',
  });
  const articles = ref<FetchState<Article[]>>({
    type: 'IDLE',
  });
  const postedArticle = ref<FetchState<Article>>({
    type: 'IDLE',
  });
  const deletedArticle = ref<FetchState<null>>({
    type: 'IDLE',
  });

  const isSummaryLoading = computed<boolean>(() => summary.value.type === 'LOADING');
  const areArticlesLoading = computed<boolean>(() => articles.value.type === 'LOADING');
  const isPostArticleLoading = computed<boolean>(() => postedArticle.value.type === 'LOADING');
  const isDeleteArticleLoading = computed<boolean>(() => deletedArticle.value.type === 'LOADING');

  const fetchSummary = async (destinations: Destination[]) => {
    if (isSummaryLoading.value) return;

    try {
      summary.value = { type: 'LOADING' };
      const countries: string[] = destinations.map((destination) => destination.name);

      const { data } = await apiFetchSummary(countries);
      const dataRecord = data.reduce((acc, item) => {
        acc[item.country.toLowerCase()] = item;

        return acc;
      }, {} as SummaryRecord);

      summary.value = {
        type: 'SUCCESS',
        data: dataRecord,
      };
    } catch (e) {
      summary.value = { type: 'ERROR', message: (e as Error).message };
      console.error('Error fetching summary:', e);
    }
  };

  const removeDSummaryFromRecord = (destination: string) => {
    if (summary.value.type !== 'SUCCESS') return;

    const { [destination.toLowerCase()]: deleted, ...newSummary } = summary.value.data;
    summary.value.data = newSummary;
  };

  const fetchArticles = async (handleSuccess: (data: Article[]) => void) => {
    if (areArticlesLoading.value) return;

    try {
      articles.value = { type: 'LOADING' };

      const { data } = await apiFetchArticles();

      articles.value = {
        type: 'SUCCESS',
        data,
      };
      handleSuccess(data);
    } catch (e) {
      articles.value = { type: 'ERROR', message: (e as Error).message };
      console.error('Error fetching articles:', e);
    }
  };

  const postArticle = async (
    articleDto: PostArticleDTO,
    handleSuccess: (data: Article) => void,
  ) => {
    if (isPostArticleLoading.value) return;
    if (articles.value.type !== 'SUCCESS') return;

    try {
      postedArticle.value = { type: 'LOADING' };

      const { data } = await apiPostArticle(articleDto);

      postedArticle.value = {
        type: 'SUCCESS',
        data,
      };
      articles.value.data.push(data);
      handleSuccess(data);
    } catch (e) {
      postedArticle.value = { type: 'ERROR', message: (e as Error).message };
      console.error('Error creating a new article:', e);
    }
  };

  const deleteArticle = async (articleId: string, handleSuccess: () => void) => {
    if (isDeleteArticleLoading.value) return;
    if (articles.value.type !== 'SUCCESS') return;

    try {
      deletedArticle.value = { type: 'LOADING' };

      await apiDeleteArticle(articleId);

      deletedArticle.value = {
        type: 'SUCCESS',
        data: null,
      };

      const articleIndex = articles.value.data.findIndex((article) => article.id === articleId);
      articles.value.data.splice(articleIndex, 1);
      handleSuccess();
    } catch (e) {
      deletedArticle.value = { type: 'ERROR', message: (e as Error).message };
      console.error('Error deleting the article:', e);
    }
  };

  return {
    fetchSummary,
    removeDSummaryFromRecord,
    isSummaryLoading,
    summary,
    postArticle,
    deleteArticle,
    fetchArticles,
    isDeleteArticleLoading,
    isPostArticleLoading,
    areArticlesLoading,
    deletedArticle,
    postedArticle,
    articles,
  };
};

export default null;
