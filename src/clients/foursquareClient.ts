import axios from 'axios';
import { FOURSQUARE_API_BASE, FOURSQUARE_API_KEY } from '../config';

export async function searchPlaces(params: Record<string, any>) {
  const response = await axios.get("https://places-api.foursquare.com/places/search", {
    headers: {
      Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
      Accept: 'application/json',
      'X-Places-Api-Version': '2025-06-17',
    },
    params,
  });
  console.log(response.data)
  return response.data;
}
