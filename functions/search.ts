import * as config from '../config.json';
import fetch from 'node-fetch';

export async function getSearchResults(query) {
  const res = await fetch(`${config.MEILIURL}indexes/results/search`, {
    method: "POST",
    body: `{ "q": "${query}", "limit": 10000 }`
  });
  const data = await res.json();
  return data;
}