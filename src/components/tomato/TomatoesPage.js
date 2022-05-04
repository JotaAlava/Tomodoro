import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as tomatoActions from '../../redux/actions/tomatoActions';
import * as contextActions from '../../redux/actions/contextActions';
// Prop types helps us specify that props that our component accepts
import SignInMessage from '../shared/SignInMessage';
import { useAuth0 } from '@auth0/auth0-react';
import DailyNotes from '../notes/DailyNotes';
import TomatoesTable from './TomatoTable';
import Todo from '../todo/todo';

const TomatoesPage = (props) => {
	const { isAuthenticated } = useAuth0();

	if (isAuthenticated) {
		return (
			<>
				<section className="holy-grail-content mitad">
					<TomatoesTable></TomatoesTable>
				</section>
				<section className="holy-grail-content-2">
					<Todo></Todo>
				</section>
				<section className="holy-grail-content">
					<DailyNotes></DailyNotes>
				</section>
			</>
		);
	} else if (!isAuthenticated) {
		return (
			<section className="holy-grail-content mitad">
				<SignInMessage></SignInMessage>
			</section>
		);
	}
};

TomatoesPage.propTypes = {
	tomatoes: PropTypes.object.isRequired,
	tomato: PropTypes.object.isRequired
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
	return {
		contexts: state.contexts,
		selectedContext: state.selectedContext,
		tomatoes: state.tomatoes
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
	return {
		tomato: bindActionCreators(tomatoActions, dispatch),
		context: bindActionCreators(contextActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(TomatoesPage);
