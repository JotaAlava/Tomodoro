import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import { useAuth0 } from '@auth0/auth0-react';
import * as dailyNoteActions from '../../redux/actions/dailyNoteActions';
import { getDailyNote } from '../../services/dailyNoteService';
import Title from '../shared/Title';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

const DailyNotes = (props) => {
	const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
	const [value, setValue] = useState(undefined);
	const [saving, setSaving] = useState(false);
	const [dailyNote, setDailyNote] = useState(undefined);

	useEffect(async () => {
		if (isAuthenticated && user && user.sub) {
			const token = await getAccessTokenSilently();
			props.actions.loadNotes(token, user.sub).then((loadedNotes) => {
				setValue(loadedNotes.current);
			});
			// const dailyNoteItem = await getDailyNote(token, user.sub);

			// setPreviousNotes(pluckEarlierDates(dailyNoteItem, todayAsKey));

			// setDailyNote(existingNote);
			// setValue(existingNote);
		}
	}, [isAuthenticated, dailyNote]);

	const onSave = async (event) => {
		event.preventDefault();

		console.log('Will save:');
		console.log(value);

		const token = await getAccessTokenSilently();

		await props.actions.saveNotes(value, token, user.sub);

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

				{props.notes.current === undefined || value === undefined ? (
					<p className="previous-notes empty-notes">Loading daily note...</p>
				) : (
					<>
						<ReactQuill theme="snow" value={value} onChange={setValue} />
						<form onSubmit={onSave}>
							<button
								type="submit"
								disabled={saving}
								className="btn btn-primary margin-top"
							>
								{saving ? 'Saving daily note...' : 'Save Note'}
							</button>
						</form>
					</>
				)}

				{props.notes.recent && props.notes.recent.length > 0 ? (
					<div className="previous-notes margin-top">
						{props.notes.recent.map((note, index) => {
							return (
								<div key={note.date} className="margin-top">
									<h2>{note.date}</h2>
									<hr></hr>
									<RenderHtmlDangerously
										html={note.note}
									></RenderHtmlDangerously>
								</div>
							);
						})}
					</div>
				) : (
					<div className="previous-notes margin-top empty-previous-notes">
						<span className="empty-notes">No previous notes.</span>
					</div>
				)}
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
		actions: bindActionCreators(dailyNoteActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyNotes);
