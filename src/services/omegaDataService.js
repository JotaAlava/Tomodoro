import assert from './assert';

export const dataSchemas = {
	tomatoContext: 'BA0D22F8-2053-470D-8B82-4BCA8077212C'
};

export const dataSchemaNames = {
	'BA0D22F8-2053-470D-8B82-4BCA8077212C': 'tomatoContext'
};

/**
 * Plucks the data schema from an omega server response
 */
export function pluckByDataSchemaId(dataSchemaId, obj) {
	assert(
		Object.prototype.hasOwnProperty.call(obj, 'result'),
		'result prop is missing'
	);
	assert(
		Object.prototype.hasOwnProperty.call(obj, 'statusCode'),
		'statusCode prop is missing'
	);

	const result = [];
	obj.result.forEach((item) => {
		const dataSchemaRows = item.data ? item.data : [];

		dataSchemaRows.forEach((ds) => {
			if (ds.dataSchemaId === dataSchemaId) {
				result.push(ds[dataSchemaNames[dataSchemaId]]);
			}
		});
	});

	return result;
}
