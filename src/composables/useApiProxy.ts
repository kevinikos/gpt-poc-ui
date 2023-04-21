import { computed, ref } from 'vue';
import { fetchSummary as apiFetchSummary, SummaryItem } from '@/services/apiProxy';
import { Destination } from '@/types/FormState';

type FetchState<T> =
  | { type: 'IDLE'}
  | { type: 'LOADING' }
  | { type: 'SUCCESS', data: T }
  | { type: 'ERROR', message: string };

type SummaryRecord = Record<string, SummaryItem>;

export const useApiProxy = () => {
  const summary = ref<FetchState<SummaryRecord>>({
    type: 'IDLE',
  });

  const isSummaryLoading = computed<boolean>(() => summary.value.type === 'LOADING');

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

  return {
    fetchSummary,
    removeDSummaryFromRecord,
    isSummaryLoading,
    summary,
  };
};

export default null;
