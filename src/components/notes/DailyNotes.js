import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import { useAuth0 } from '@auth0/auth0-react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import * as dailyNoteActions from '../../redux/actions/dailyNoteActions';
import Title from '../shared/Title';
import { onSessionEnd } from '../../services/utility';
import Loading from '../shared/Loading';
import SignInMessage from '../shared/SignInMessage';

const DailyNotes = (props) => {
	const { isAuthenticated, getAccessTokenSilently, user, logout } = useAuth0();
	const [value, setValue] = useState(undefined);
	const [saving, setSaving] = useState(false);
	const [dailyNote, setDailyNote] = useState(undefined);
	const [loading, setLoading] = useState(false);

	useEffect(async () => {
		const cxtId =
			props.selectedContext !== null && props.selectedContext.tomatoContextId;

		if (cxtId && isAuthenticated && user && user.sub && !loading) {
			setLoading(true);

			const token = await getAccessTokenSilently();

			props.actions
				.loadNotes(token, cxtId)
				.then((loadedNotes) => {
					setValue(loadedNotes.current);
					setLoading(false);
				})
				.catch((error) => {
					onSessionEnd(error, logout);
					setLoading(false);
				});
		}
	}, [isAuthenticated, dailyNote, props.selectedContext]);

	const onSave = async (event) => {
		event.preventDefault();

		const token = await getAccessTokenSilently();
		const cxtId = props.selectedContext.tomatoContextId;
		if (cxtId) {
			await props.actions
				.saveNotes(
					{
						value,
						tomatoContextId: cxtId
					},
					token,
					user.sub
				)
				.catch((error) => {
					onSessionEnd(error, logout);
				});
		} else {
			toast.error('No context selected!');
		}
	};

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
			<>
				<Title text={'Daily Notes'}></Title>
				{props.contexts.length > 0 ? (
					<>
						{props.notes.current === undefined || value === undefined ? (
							<>
								{props.selectedContext === null ? (
									<div className="note-box mega-margin-bottom">
										<p className="previous-notes empty-notes loading-quill">
											No context selected.
										</p>
									</div>
								) : (
									<>
										{loading ? (
											<div className="loading-height">
												<Loading></Loading>
											</div>
										) : (
											<div className="note-box">
												<ReactQuill
													theme="snow"
													value={value || ''}
													onChange={setValue}
												/>
												<form onSubmit={onSave}>
													<button
														id="save_note"
														type="submit"
														disabled={saving}
														className="btn btn-primary margin-top"
													>
														{saving ? 'Saving daily note...' : 'Save Note'}
													</button>
												</form>
											</div>
										)}
									</>
								)}
							</>
						) : (
							<>
								{loading ? (
									<div className="loading-height">
										<Loading></Loading>
									</div>
								) : (
									<div className="note-box">
										<ReactQuill
											theme="snow"
											value={value || ''}
											onChange={setValue}
										/>
										<form onSubmit={onSave}>
											<button
												id="save_note"
												type="submit"
												disabled={saving}
												className="btn btn-primary margin-top"
											>
												{saving ? 'Saving daily note...' : 'Save Note'}
											</button>
										</form>
									</div>
								)}
							</>
						)}
					</>
				) : (
					<div className="note-box note-box-borders note-scroll margin-top loading-height">
						<span className="empty-notes empty-previous-notes">
							No contexts.
						</span>
					</div>
				)}

				{props.contexts.length > 0 ? (
					<>
						{props.notes.recent && props.notes.recent.length > 0 ? (
							<div className="note-box note-box-borders note-scroll margin-top">
								{props.notes.recent.map((note) => {
									return (
										<div
											key={note.date}
											className="margin-top justify-previous-note"
										>
											<h2 className="align-date">{note.date}</h2>
											<hr></hr>
											<RenderHtmlDangerously
												html={note.note}
											></RenderHtmlDangerously>
										</div>
									);
								})}
							</div>
						) : (
							<div className="note-box note-box-borders note-scroll margin-top">
								<span className="empty-notes empty-previous-notes margin-top">
									No previous notes.
								</span>
							</div>
						)}
					</>
				) : (
					<div className="note-box note-box-borders note-scroll margin-top loading-height">
						<span className="empty-notes empty-previous-notes">
							No contexts.
						</span>
					</div>
				)}
			</>
		);
	} else {
		return (
			<main role="main" className="inner cover">
				<SignInMessage></SignInMessage>
			</main>
		);
	}
};

DailyNotes.propTypes = {
	notes: PropTypes.object.isRequired,
	contexts: PropTypes.array
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
	return {
		notes: state.notes,
		selectedContext: state.selectedContext,
		contexts: state.contexts
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(dailyNoteActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyNotes);
