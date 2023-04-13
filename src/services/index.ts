// eslint-disable-next-line import/no-extraneous-dependencies
import axios, { AxiosPromise } from 'axios';

const fetchData = (value: string): AxiosPromise => axios.post(`${process.env.VUE_APP_API_URL}/v1/graphql`, {
  query: `{
  Get{
    FeedItem(
      ask: {
        question: "${value}"
      },
      limit: 1
    ){
      title
      _additional {
        answer {
          hasAnswer
          property
          result
          startPosition
          endPosition
        }
      }
    }
  }
}`,
}, { headers: { 'X-OpenAI-Api-Key': process.env.VUE_APP_OPEN_AI_KEY } });

export default fetchData;
