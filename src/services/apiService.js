import { STATUS_CODES } from '../shared/shared';

const HTTP_VERBS = {
	POST: 'POST',
	PUT: 'PUT',
	GET: 'GET',
	DELETE: 'DELETE',
	DS: 'DS'
};

const api = async (url, options) => {
	return fetch(url, options).then((response) => response.json());
};

const buildOptions = (verb, token, body) => {
	return body && verb !== HTTP_VERBS.GET
		? {
				body: JSON.stringify(body),
				method: verb,
				headers: {
					'Content-Type': 'application/json',
					ProductId: process.env.PRODUCT_ID,
					Authorization: `Bearer ${token}`
				}
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  }
		: {
				method: verb,
				headers: {
					'Content-Type': 'application/json',
					ProductId: process.env.PRODUCT_ID,
					Authorization: `Bearer ${token}`
				}
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  };
};

const grokResponse = (items) => {
	const msg = 'Unauthorized';

	if (items.statusCode === STATUS_CODES.OK) {
		return Promise.resolve(items.result);
	} else if (items.statusCode === STATUS_CODES.Accepted) {
		return Promise.resolve(items.result);
	} else if (items.statusCode === STATUS_CODES.BadRequest) {
		return Promise.reject(items);
	} else if (items.message === msg) {
		return Promise.reject(items);
	} else if (items.statusCode === STATUS_CODES.Unauthorized) {
		return Promise.reject(new Error('Sign in first.'));
	} else {
		return Promise.reject(items);
	}
};

export { api, buildOptions, grokResponse, HTTP_VERBS };
