import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const AUTH_CODE = process.env.AUTH_CODE;
export const COHERE_API_KEY = process.env.COHERE_API_KEY;
export const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
export const FOURSQUARE_API_BASE = `"${process.env.FOURSQUARE_API_BASE}"`;
