import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './home/HomePage';
import AboutPage from './about/AboutPage';
import Header from './shared/Header';
import PageNotFound from './shared/PageNotFound';
import Tomatoes from './tomato/TomatoesPage';
import Contexts from './context/ContextsPage';
import ContextsEdit from './context/ContextsEdit';
import AccountPage from './account/AccountPage';
import { Auth0Provider } from '@auth0/auth0-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';

const auth0 = {
	domain: 'mostexpensivedeveloper-dev.us.auth0.com',
	clientId: 'AXQ0Vf8OsgEc9pBgs6tAtWjPrRv4pwYG',
	audience: 'https://mostexpensivedeveloper-dev.us.auth0.com/api/v2/'
};

function App() {
	return (
		<Auth0Provider
			domain={auth0.domain}
			clientId={auth0.clientId}
			audience={auth0.audience}
			redirectUri={window.location.origin}
			scope={'openid'}
		>
			<div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column no-scroll">
				<Header />
				<Switch>
					<Route exact path="/" component={HomePage}></Route>
					<Route path="/about" component={AboutPage}></Route>
					<Route path="/tomatoes" component={Tomatoes}></Route>
					<Route path="/contexts/:id" component={ContextsEdit}></Route>
					<Route path="/contexts" component={Contexts}></Route>
					<Route path="/account" component={AccountPage}></Route>
					<Route component={PageNotFound}></Route>
				</Switch>
				<ToastContainer autoClose={3000} hideProgressBar></ToastContainer>
			</div>
		</Auth0Provider>
	);
}

export default App;
