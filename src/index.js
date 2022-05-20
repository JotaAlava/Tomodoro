import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import './index.css';
import configureStore from './redux/configureStore';
import {
	ga,
	EventType,
	Label,
	Categories,
	EventNames
} from './services/utility';

const store = configureStore();

ReactDOM.render(
	<ReduxProvider store={store}>
		<Router>
			<App></App>
		</Router>
	</ReduxProvider>,
	document.getElementById('app')
);
