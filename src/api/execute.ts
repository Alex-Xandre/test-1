import { cohere } from '../clients/cohereClient';
import { searchPlaces } from '../clients/foursquareClient';
import { AUTH_CODE } from '../config';
import { CommandI } from '../types/command';

import { Request, Response } from 'express';
export default async function execute(req: Request, res: Response) {
  const userMessage = req.query.message as string;
  const code = req.query.code as string;

  if (code !== AUTH_CODE) {
    return res.status(401).json({ error: 'Unauthorized: Invalid code' });
  }

  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ error: "Missing or invalid 'message' parameter" });
  }

  try {
    const cohereResponse = await cohere.chat({
      model: 'command-a-03-2025',
      messages: [
        {
          role: 'user',
          content: `Convert this to a JSON object with schema below. NO explanation. ONLY return valid JSON.

{
  "action": "restaurant_search",
  "parameters": {
    "query": string,
    "near": string,
    "price": string,
    "open_now": boolean,
    "rating": number
  }
}

User request: "${userMessage.trim()}"`,
        },
      ],
    });

    let command: CommandI;

    try {
      const firstChunk = Array.isArray(cohereResponse.message?.content)
        ? cohereResponse.message.content.find((c) => c.type === 'text')?.text
        : cohereResponse.message?.content;

      if (!firstChunk || typeof firstChunk !== 'string') {
        throw new Error('Cohere returned unexpected content format');
      }

      const match = firstChunk.match(/{[\s\S]*}/);
      if (!match) throw new Error('No JSON object found in response');

      command = JSON.parse(match[0]);
    } catch (err) {
      return res.status(500).json({
        error: 'Failed to parse JSON from LLM',
        raw: cohereResponse.message?.content,
        details: String(err),
      });
    }

    if (command.action !== 'restaurant_search' || !command.parameters) {
      return res.status(400).json({ error: 'Invalid command format from LLM' });
    }

    const p = command.parameters;
    const fsqParams: any = { limit: 50 };

    if (p.query) fsqParams.query = p.query;
    if (p.near) fsqParams.near = p.near;
    const priceNum = Number(p.price);
    if (!isNaN(priceNum)) {
      fsqParams.min_price = priceNum;
      fsqParams.max_price = priceNum;
    }
    if (p.open_now !== undefined) fsqParams.open_now = p.open_now;
    console.log('Foursquare params:', fsqParams);
    const fsqResponse = await searchPlaces(fsqParams);

    const results = (fsqResponse.results || []).map((place: any) => ({
      id: place.fsq_place_id || place.fsq_id || '',
      name: place.name || '',
      address: place.location?.formatted_address || '',
      categories: place.categories?.map((c: any) => c.name) || [],
      rating: place.rating || null,
      price: place.price || null,
      hours: place.hours || null,
      website: place.link ? `https://foursquare.com${place.link}` : place.website || null,
      email: place.email || null,
      tel: place.tel || null,
    }));
    console.log(results);
    const filteredResults =
      //@ts-ignore
      typeof p.rating === 'number' ? results.filter((r) => r.rating !== null && r.rating >= p.rating) : results;

    return res.json({ query: userMessage, results: filteredResults });
  } catch (error: any) {
    if (error.isCohereTimeout || error.name === 'CohereTimeoutError') {
      return res.status(504).json({ error: 'LLM request timed out' });
    } else if (error.isCohereError || error.name === 'CohereError') {
      return res.status(error.statusCode || 500).json({ error: error.message, body: error.body });
    } else if (error.isAxiosError) {
      return res.status(error.response?.status || 500).json({
        error: 'Foursquare API error',
        details: error.response?.data || error.message,
      });
    } else {
      return res.status(500).json({ error: 'Unexpected server error', details: String(error) });
    }
  }
}
