import { api, buildOptions, HTTP_VERBS } from './apiService';
import { STATUS_CODES } from '../shared/shared';

const path = 'ds/';
const dataSource = async (dataSourceId, token, body) => {
	const url = process.env.API_URL + path + dataSourceId;

	const httpResponse = await api(
		url,
		buildOptions(HTTP_VERBS.POST, token, body)
	);

	const items = httpResponse;
	const msg = 'Unauthorized';

	if (items.statusCode === STATUS_CODES.OK) {
		return Promise.resolve(items.result);
	} else if (items.statusCode === STATUS_CODES.BadRequest) {
		return Promise.reject(items);
	} else if (items.message === msg) {
		return Promise.reject(items);
	} else {
		return Promise.reject(items);
	}
};

export { dataSource };
