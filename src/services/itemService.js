import { api, buildOptions, HTTP_VERBS, grokResponse } from './apiService';

const path = 'item/';

const postItem = async (body, token) => {
	const url = process.env.API_URL + path;
	const httpResponse = await api(
		url,
		buildOptions(HTTP_VERBS.POST, token, body)
	);

	return grokResponse(httpResponse);
};

const deleteItem = async (itemId, token) => {
	const url = process.env.API_URL + path + itemId;
	const httpResponse = await api(url, buildOptions(HTTP_VERBS.DELETE, token));

	return grokResponse(httpResponse);
};

const putItem = async (item, token) => {
	const url = process.env.API_URL + path + item.itemId;
	const httpResponse = await api(
		url,
		buildOptions(HTTP_VERBS.PUT, token, item)
	);

	return grokResponse(httpResponse);
};

const getItem = async (itemId, token) => {
	const url = process.env.API_URL + path + itemId;
	const httpResponse = await api(url, buildOptions(HTTP_VERBS.GET, token));

	return grokResponse(httpResponse);
};

export { postItem, deleteItem, putItem, getItem };
