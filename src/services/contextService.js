import { dataSource } from './dsService';
import { postItem, deleteItem } from './itemService';
import { CONSTANTS } from '../shared/shared';

export async function getContexts(token, userId) {
	const body = {
		productId: process.env.PRODUCT_ID,
		userId: userId
	};

	try {
		return dataSource(CONSTANTS.DATASOURCES.GET_CONTEXTS, token, body).then(
			(res) => {
				return Array.isArray(res) ? res : [];
			}
		);
	} catch (e) {
		throw new Error(e);
	}
}

export function saveContext(newContext, token, userId) {
	const newContextItem = {
		name: `New context for user ${userId}.`,
		description: `New context for user ${userId}.`,
		productId: process.env.PRODUCT_ID,
		deleted: false,
		data: [
			{
				dataSchemaId: 'BA0D22F8-2053-470D-8B82-4BCA8077212C',
				tomatoContext: {
					created: new Date().toISOString(),
					default: newContext.default,
					label: newContext.label,
					private: true,
					deleted: false
				}
			}
		]
	};

	return postItem(newContextItem, token);
}

export function remove(contextItemId, token) {
	return deleteItem(contextItemId, token);
}
