import { dataSource } from './dsService';
import { postItem, deleteItem, putItem, getItem } from './itemService';
import { CONSTANTS } from '../shared/shared';
import {
	updateByDataSchemaId,
	dataSchemas
} from '../services/omegaDataService';

export async function getDailyNote(token, userId) {
	const body = {
		productId: process.env.PRODUCT_ID,
		userId: userId
	};

	const notes = dataSource(CONSTANTS.DATASOURCES.GET_DAILYNOTES, token, body);

	const toViewModel = (tomatoesWithJsonDate) => {
		return Array.isArray(tomatoesWithJsonDate)
			? tomatoesWithJsonDate.map((t) => {
					return {
						...t,
						created: new Date(t.date)
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

	const pluckEarlierDates = (noteItem, keyToSkip) => {
		const result = [];
		const datesWithNotes = Object.keys(noteItem);
		datesWithNotes.forEach((dateKey) => {
			if (dateKey !== keyToSkip) {
				const entry = {
					date: dateKey,
					note: noteItem[dateKey][0].note
				};

				// If an entry already exists, then we have already selected the most recent version, continue.
				if (!result.includes(entry)) {
					result.push(entry);
				}
			}
		});

		return result;
	};

	const buildFinalResult = (dailyNoteItem) => {
		const todayAsKey = new Date().toLocaleDateString();
		let result = {};

		if (dailyNoteItem[todayAsKey]) {
			result.current = dailyNoteItem[todayAsKey][0].note;
			result.recent = pluckEarlierDates(dailyNoteItem, todayAsKey);
		} else {
			result.current = '';
			result.recent = pluckEarlierDates(dailyNoteItem, todayAsKey);
		}

		return result;
	};

	return notes
		.then(toViewModel)
		.then(sort)
		.then(groupByDay)
		.then(buildFinalResult)
		.catch(async (e) => {
			console.log(e);
			throw new Error(e);
		});
}

export function save(note, token, userId) {
	const newDailyNote = {
		name: `New daily note for user ${userId}.`,
		description: `New daily note for user ${userId}.`,
		productId: process.env.PRODUCT_ID,
		deleted: false,
		data: [
			{
				dailyNote: {
					date: new Date(),
					note: note
					// note: '<p><u>Some text </u></p><p><br></p><p><em>Italic</em></p><p><strong>Strong</strong></p><p><br></p><p><u>And some more random text. And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.Some text </u></p><p><br></p><p><em>Italic</em></p><p><strong>Strong</strong></p><p><br></p><p>And some more random text. And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.<u>Some text </u></p><p><br></p><p><em>Italic</em></p><p><strong>Strong</strong></p><p><br></p><p>And some more random text. And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.<u>Some text </u></p><p><br></p><p><em>Italic</em></p><p><strong>Strong</strong></p><p><br></p><p>And some more random text. And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.<u>Some text </u></p><p><br></p><p><em>Italic</em></p><p><strong>Strong</strong></p><p><br></p><p>And some more random text. And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.<u>Some text </u></p><p><br></p><p><em>Italic</em></p><p><strong>Strong</strong></p><p><br></p><p>And some more random text. And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.And some more random text.</p>'
				}
			}
		]
	};

	return postItem(newDailyNote, token);
}

export function update(tomato, token) {
	return getItem(tomato._itemId, token).then((response) => {
		const item = response[0];
		const updatedItem = updateByDataSchemaId(dataSchemas.tomato, item, tomato);

		return putItem(updatedItem, token);
	});
}

export function remove(contextItemId, token) {
	return deleteItem(contextItemId, token);
}
