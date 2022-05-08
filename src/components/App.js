import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Auth0Provider } from '@auth0/auth0-react';
import { ToastContainer } from 'react-toastify';
import { connect } from 'react-redux';

import AboutPage from './about/AboutPage';
import Header from './shared/Header';
import Footer from './shared/Footer';
import PageNotFound from './shared/PageNotFound';
import Tomatoes from './tomato/TomatoesPage';
import Contexts from './context/ContextsPage';
import ContextsEdit from './context/ContextsEdit';
import AccountPage from './account/AccountPage';

import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';

const auth0 = {
	domain: 'mostexpensivedeveloper-dev.us.auth0.com',
	clientId: 'AXQ0Vf8OsgEc9pBgs6tAtWjPrRv4pwYG',
	audience: 'https://mostexpensivedeveloper-dev.us.auth0.com/api/v2/'
};

function App(props) {
	return (
		<div className={props.loading ? 'holy-grail loading-cursor' : 'holy-grail'}>
			<Auth0Provider
				domain={auth0.domain}
				clientId={auth0.clientId}
				audience={auth0.audience}
				redirectUri={window.location.origin}
				scope={'openid'}
			>
				<Header></Header>

				<div className="holy-grail-body">
					<Switch>
						<Route path="/about" component={AboutPage}></Route>
						<Route path="/tomatoes" component={Tomatoes}></Route>
						<Route exact path="/" component={Tomatoes}></Route>
						<Route path="/contexts/:id" component={ContextsEdit}></Route>
						<Route path="/contexts" component={Contexts}></Route>
						<Route path="/account" component={AccountPage}></Route>
						<Route component={PageNotFound}></Route>
					</Switch>
				</div>
				<ToastContainer autoClose={3000} hideProgressBar></ToastContainer>
				<Footer></Footer>
			</Auth0Provider>
		</div>
	);
}

App.propTypes = {
	loading: PropTypes.bool.isRequired
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
	return {
		loading: state.apiCallsInProgress > 0
	};
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps() {
	return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
