import { dataSource } from './dsService';
import { postItem, deleteItem } from './itemService';
import { CONSTANTS } from '../shared/shared';

export async function getTomatoes(token, userId) {
	const body = {
		productId: process.env.PRODUCT_ID,
		userId: userId
	};

	const tomatoes = dataSource(CONSTANTS.DATASOURCES.GET_TOMATOES, token, body);

	return tomatoes
		.then((tomatoesWithJsonDate) => {
			return Array.isArray(tomatoesWithJsonDate)
				? tomatoesWithJsonDate.map((t) => {
						return {
							...t,
							created: new Date(t.created)
						};
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  })
				: [];
		})
		.then((tomatoesViewModel) => {
			const sortedArray = tomatoesViewModel.sort(
				(a, b) => b.created - a.created
			);

			return sortedArray;
		})
		.catch(async (e) => {
			console.log(e);
			throw new Error(e);
		});
}

export function save(newTomatoData, token, userId) {
	const newTomato = {
		name: `New tomato for user ${userId}.`,
		description: `New tomato for user ${userId}.`,
		productId: process.env.PRODUCT_ID,
		deleted: false,
		data: [
			{
				tomato: { ...newTomatoData, created: new Date().toISOString() }
			}
		]
	};

	return postItem(newTomato, token);
}

export function remove(contextItemId, token) {
	return deleteItem(contextItemId, token);
}
