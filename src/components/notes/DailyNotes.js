import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import { useAuth0 } from '@auth0/auth0-react';
import * as dailyNoteActions from '../../redux/actions/dailyNoteActions';
import { save, getDailyNote } from '../../services/dailyNoteService';
import Title from '../shared/Title';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

const DailyNotes = (props) => {
	const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
	const [value, setValue] = useState('');
	const [saving, setSaving] = useState(false);
	const [dailyNote, setDailyNote] = useState(undefined);
	const [previousNotes, setPreviousNotes] = useState([]);

	useEffect(async () => {
		if (isAuthenticated) {
			const token = await getAccessTokenSilently();
			const dailyNoteItem = await getDailyNote(token, user.sub);
			const todayAsKey = new Date().toLocaleDateString();
			const existingNote = dailyNoteItem[todayAsKey][0].note;
			setPreviousNotes(pluckEarlierDates(dailyNoteItem, todayAsKey));

			setDailyNote(existingNote);
			setValue(existingNote);
		}
	}, [isAuthenticated, dailyNote]);

	const pluckEarlierDates = (noteItem, key) => {
		const result = [];
		const datesWithNotes = Object.keys(noteItem);
		datesWithNotes.forEach((dateKey) => {
			if (dateKey !== key) {
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

	const onSave = async (event) => {
		event.preventDefault();

		// Figure out if it's a new note or not
		// If there is no note for today, then it is new. Create the item for it

		console.log('Will save:');
		console.log(value);

		const token = await getAccessTokenSilently();

		await props.notes.saveNotes(value, token, user.sub);

		// If there is a note for today, then it is not new. Update the content of the note
		// All done!
	};

	const noToolbar = { toolbar: false, theme: 'snow' };
	function createMarkup(html) {
		return { __html: html };
	}

	function RenderHtmlDangerously(prop) {
		return <div dangerouslySetInnerHTML={createMarkup(prop.html)} />;
	}
	// TODO: Set a max heigh for the daily note so that it's scrollable instead of making the whole page scrollable
	// TODO: Also add the ability to page over the notes of the last 10 days. Datasource already should return notes from yesterday
	if (isAuthenticated) {
		return (
			<main role="main" className="inner cover">
				<Title text={'Daily Notes'}></Title>

				<ReactQuill theme="snow" value={value} onChange={setValue} />
				<form onSubmit={onSave}>
					<button type="submit" disabled={saving} className="btn btn-primary">
						{saving ? 'Saving daily note...' : 'Save Note'}
					</button>
				</form>

				<div className="previous-notes">
					{previousNotes.length > 0 ? (
						<>
							{previousNotes.map((note, index) => {
								return (
									<>
										<h2>{note.date}</h2>
										<RenderHtmlDangerously
											key={index}
											html={note.note}
										></RenderHtmlDangerously>
									</>
								);
							})}
						</>
					) : (
						<span>No previous notes.</span>
					)}
				</div>
			</main>
		);
	} else {
		return (
			<main role="main" className="inner cover">
				<p>Sign-in for Daily Notes</p>
			</main>
		);
	}
};

DailyNotes.propTypes = {
	notes: PropTypes.object.isRequired
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
	return {
		notes: state.notes
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
	return {
		notes: bindActionCreators(dailyNoteActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyNotes);
