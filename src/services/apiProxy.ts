import axios, { AxiosResponse } from 'axios';

export type SummaryItem = {
  country: string;
  summary: string;
  links: string[];
}
export type Summary = SummaryItem[];

export const fetchSummary = (countries: string[]): Promise<AxiosResponse<Summary>> => (
  axios.post(`${process.env.VUE_APP_API_PROXY_URL}/summary`, {
    countries,
  })
);

export default {};
