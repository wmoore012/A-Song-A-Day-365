const API = 'https://api.giphy.com/v1/gifs/search';

export async function giphySearch(query, { apiKey, limit = 8, rating = 'pg-13' } = {}){
	if (!apiKey) throw new Error('giphy: missing apiKey');
	const url = `${API}?api_key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(query)}&limit=${limit}&rating=${rating}`;
	const r = await fetch(url);
	if (!r.ok) throw new Error(`giphy: http ${r.status}`);
	const j = await r.json();
	const arr = Array.isArray(j?.data) ? j.data : [];
	return arr.map(x => x?.images?.downsized_medium?.url).filter(Boolean);
}