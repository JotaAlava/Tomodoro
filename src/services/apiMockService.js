import { CONSTANTS } from '../shared/shared';

function randomDate(start, end) {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	);
}

let ids = 100;
const HTTP_VERBS = {
	POST: 'POST',
	PUT: 'PUT',
	GET: 'GET',
	DELETE: 'DELETE',
	DS: 'DS'
};

const localState = {
	contexts: [
		{
			statusCode: 200,
			result: [
				{
					tomatoContextId: 1,
					default: true,
					label: 'Private 1',
					private: true,
					deleted: false
				},
				{
					tomatoContextId: 2,
					default: false,
					label: 'Private 2',
					private: true,
					deleted: false
				},
				{
					tomatoContextId: 3,
					default: true,
					label: 'Public 1',
					private: true,
					deleted: false
				},
				{
					tomatoContextId: 4,
					default: true,
					label: 'Public 2',
					private: false,
					deleted: false
				}
			]
		}
	],
	tomatoes: [
		{
			statusCode: 200,
			result: [
				{
					tomatoId: 1,
					tomatoContextId: 1,
					created: randomDate(new Date(2020, 0, 1), new Date()),
					description: 'Tomato 1'
				},
				{
					tomatoId: 2,
					tomatoContextId: 2,
					created: randomDate(new Date(2020, 0, 1), new Date()),
					description: 'Tomato 2'
				},
				{
					tomatoId: 3,
					tomatoContextId: 3,
					created: randomDate(new Date(2020, 0, 1), new Date()),
					description: 'Tomato 3'
				},
				{
					tomatoId: 4,
					tomatoContextId: 4,
					created: randomDate(new Date(2020, 0, 1), new Date()),
					description: 'Tomato 4'
				}
			]
		}
	]
};

const returns = (url, options) => {
	if (url.endsWith('/item/')) {
		const data = JSON.parse(options.body).data[0];

		let newEntry;
		// eslint-disable-next-line no-prototype-builtins
		if (data.hasOwnProperty('tomatoContext')) {
			newEntry = {
				...data.tomatoContext,
				tomatoContextId: ids++
			};

			localState.contexts[0].result.push(newEntry);
			// eslint-disable-next-line no-prototype-builtins
		} else if (data.hasOwnProperty('tomato')) {
			newEntry = {
				...data.tomato,
				tomatoId: ids++
			};

			const newState = localState.tomatoes[0].result.concat([newEntry]);
			localState.tomatoes[0].result = newState;
		}

		return {
			itemId: 'some item id here'
		};
	} else if (url.includes(CONSTANTS.DATASOURCES.GET_CONTEXTS)) {
		return localState.contexts;
	} else if (url.includes(CONSTANTS.DATASOURCES.GET_TOMATOES)) {
		return localState.tomatoes;
	}
};

const api = async (url, options) => {
	console.log(url);
	console.log(options);

	return Promise.resolve(returns(url, options));
};

const buildOptions = (verb, token, body) => {
	const one = {
		body: JSON.stringify(body),
		method: verb,
		headers: {
			'Content-Type': 'application/json',
			ProductId: process.env.PRODUCT_ID,
			Authorization: `Bearer ${token}`
		}
	};
	const two = {
		method: verb,
		headers: {
			'Content-Type': 'application/json',
			ProductId: process.env.PRODUCT_ID,
			Authorization: `Bearer ${token}`
		}
	};

	return body ? one : two;
};

export { api, buildOptions, HTTP_VERBS };
