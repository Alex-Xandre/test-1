import { CohereClientV2 } from 'cohere-ai';
import { COHERE_API_KEY } from '../config';

export const cohere = new CohereClientV2({
  token: COHERE_API_KEY,
});
