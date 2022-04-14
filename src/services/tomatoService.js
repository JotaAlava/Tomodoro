import { dataSource } from './dsService';
import { postItem, deleteItem, putItem, getItem } from './itemService';
import { CONSTANTS } from '../shared/shared';
import { updateByDataSchemaId } from '../services/omegaDataService';
import assert from './assert';

const dataSchemaTableName = 'tomato';
export async function getTomatoes(token, userId) {
	const body = {
		productId: process.env.PRODUCT_ID,
		userId: userId
	};

	const tomatoes = dataSource(CONSTANTS.DATASOURCES.GET_TOMATOES, token, body);

	const toViewModel = (tomatoesWithJsonDate) => {
		return Array.isArray(tomatoesWithJsonDate)
			? tomatoesWithJsonDate.map((t) => {
					return {
						...t,
						created: new Date(t.created)
					};
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  })
			: [];
	};

	const sort = (tomatoesViewModel) => {
		const sortedArray = tomatoesViewModel.sort((a, b) => b.created - a.created);

		return sortedArray;
	};

	const groupByDay = (tomatoesViewModel) => {
		const byDate = {};
		tomatoesViewModel.forEach((tomato) => {
			const index = tomato.created.toLocaleDateString('en-US');
			const row = byDate[index];

			if (row) {
				byDate[index].push(tomato);
			} else {
				byDate[index] = [tomato];
			}
		});

		return byDate;
	};

	return tomatoes
		.then(toViewModel)
		.then(sort)
		.then(groupByDay)
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

export function update(tomato, token) {
	return getItem(tomato._itemId, token).then((response) => {
		const item = response[0];
		const tomatoRow = item.data.find((row) => {
			// eslint-disable-next-line no-prototype-builtins
			return row.hasOwnProperty(dataSchemaTableName);
		});

		assert(tomatoRow, 'Existing row exists.');
		assert(tomatoRow.dataSchemaId, 'DataSchemaId was found.');

		const updatedItem = updateByDataSchemaId(
			dataSchemaTableName,
			tomatoRow.dataSchemaId,
			item,
			tomato
		);

		return putItem(updatedItem, token);
	});
}

export function remove(contextItemId, token) {
	return deleteItem(contextItemId, token);
}
