import React from 'react';
import { browserHistory } from 'react-router-dom';

const HomePage = (props) => {
	props.history.push('/tomatoes');

	return (
		<main role="main" className="inner cover">
			<h1 className="cover-heading">Cover your page.</h1>
			<p className="lead">
				Cover is a one-page template for building simple and beautiful home
				pages. Download, edit the text, and add your own fullscreen background
				photo to make it your own.
			</p>
			<p className="lead">
				<a href="#" className="btn btn-lg btn-secondary">
					Learn more
				</a>
			</p>
		</main>
	);
};

export default HomePage;
