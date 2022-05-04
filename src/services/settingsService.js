import { dataSource } from './dsService';
import { postItem, putItem, getItem, deleteItem } from './itemService';
import { CONSTANTS } from '../shared/shared';

export async function load(token, userId) {
	const body = {
		productId: process.env.PRODUCT_ID,
		userId: userId
	};

	try {
		return dataSource(CONSTANTS.DATASOURCES.GET_SETTINGS, token, body).then(
			(res) => {
				return Array.isArray(res) ? res[0] : {};
			}
		);
	} catch (e) {
		throw new Error(e);
	}
}

export function save(settings, token, userId) {
	const newContextItem = {
		name: `New settings for user ${userId}.`,
		description: `New settings for user ${userId}.`,
		productId: process.env.PRODUCT_ID,
		deleted: false,
		data: [
			{
				settings: {
					workLength: settings.workLength,
					shortBreakLength: settings.shortBreakLength,
					longBreakLength: settings.longBreakLength
				}
			}
		]
	};

	return postItem(newContextItem, token);
}

export async function update(newSettings, token) {
	const oldSettingsItemRes = await getItem(newSettings._itemId, token);
	const oldSettings = oldSettingsItemRes[0];

	// This type of update only works when we allow one entry per datar row
	oldSettings.data[0].settings = JSON.parse(JSON.stringify(newSettings));

	return putItem(oldSettings, token);
}

export function remove(contextItemId, token) {
	return deleteItem(contextItemId, token);
}
