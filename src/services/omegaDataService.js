import assert from './assert';

/**
 * Plucks the data schema from an omega server response
 */
export function pluckByDataSchemaId(
	dataSchemaTableName,
	dataSchemaId,
	omegaServerResponse
) {
	assert(
		Object.prototype.hasOwnProperty.call(omegaServerResponse, 'result'),
		'result prop is missing'
	);
	assert(
		Object.prototype.hasOwnProperty.call(omegaServerResponse, 'statusCode'),
		'statusCode prop is missing'
	);

	const result = [];
	omegaServerResponse.result.forEach((item) => {
		const dataSchemaRows = item.data ? item.data : [];

		dataSchemaRows.forEach((ds) => {
			if (ds.dataSchemaId === dataSchemaId) {
				result.push(ds[dataSchemaTableName]);
			}
		});
	});

	return result;
}

export function updateByDataSchemaId(
	dataSchemaTableName,
	dataSchemaId,
	item,
	updatedRow
) {
	assert(
		Object.prototype.hasOwnProperty.call(item, 'data'),
		'item data is missing'
	);

	const dataSchemaRows = item.data ? item.data : [];
	const tableName = dataSchemaTableName;
	const idProp = `${tableName}Id`;

	let rowToUpdate = dataSchemaRows.find((ds) => {
		return ds[tableName][idProp] === updatedRow[idProp];
	});

	const newRow = {
		dataSchemaId
	};
	newRow[tableName] = updatedRow;

	const neww = JSON.parse(JSON.stringify(newRow));
	const updatedItem = setByDataSchemaId(item, rowToUpdate, neww);

	return updatedItem;
}

function setByDataSchemaId(item, old, neww) {
	assert(
		Object.prototype.hasOwnProperty.call(item, 'data'),
		'item data is missing'
	);

	assert(
		Object.prototype.hasOwnProperty.call(old, 'dataSchemaId'),
		'data has no dataSchemaId'
	);

	assert(
		Object.prototype.hasOwnProperty.call(neww, 'dataSchemaId'),
		'new data has no dataSchemaId'
	);

	const index = item.data.indexOf(old);
	item.data[index] = neww;

	return item;
}
