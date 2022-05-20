import { api, buildOptions, HTTP_VERBS } from './apiService';
import { STATUS_CODES } from '../shared/shared';

const running = [];
const path = 'ds/';
const dataSource = async (dataSourceId, token, body) => {
	const url = process.env.API_URL + path + dataSourceId;

	if (!running.includes(dataSourceId)) {
		running.push(dataSourceId);
		const httpResponse = await api(
			url,
			buildOptions(HTTP_VERBS.POST, token, body)
		);

		const index = running.indexOf(dataSourceId);
		if (index > -1) {
			running.splice(index, 1); // 2nd parameter means remove one item only
		}

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
	} else {
		debugger;
		return Promise.reject([]);
	}
};

export { dataSource };
