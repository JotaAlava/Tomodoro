import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import {
	ga,
	EventType,
	Label,
	Categories,
	EventNames
} from '../../services/utility';

const AboutPage = () => {
	const { user } = useAuth0();

	useEffect(async () => {
		const type = EventType.Event;
		const eventName = EventNames.NAVIGATION.about;
		const eventLabel = Label.buildLabel(eventName, user ? user.sub : 'no-user');
		const eventCategory = Categories.NAVIGATION;

		ga(type, eventName, eventCategory, eventLabel);
	}, []);

	return (
		<section className="holy-grail-content">
			<h1>About ElPomodoro</h1>
			<p>
				ElPomodoro is an implementation of the Pomodoro Technique, which is a
				time management system. This system helps people to maximize time
				efficiency. The Pomodoro Technique requires you to break your workday
				into 25-minute chunks separated by 5-minute breaks. These intervals are
				referred to as pomodoros. After about four pomodoros, you take a longer
				break of 15 minutes.
			</p>

			<h5>10x Stand-up Report</h5>
			<p>
				Keep your stand-up reports relevant, accurate and useful for the rest of
				your team by reviwing your pomodoros for the previous, and current day.
			</p>
			<hr></hr>
			<h1>The Sophrosyn3 LLC Twist</h1>
			<h5>Track work by work context.</h5>
			<p>
				This feature allows you to jump around different types of work and
				easily pick-up where you left off. When switching contexts, looking at
				the logs will jog your mind and help you maximize productive time.
			</p>
			<h5>Contextual, braindumps as Daily Notes.</h5>
			<p>
				Jot down meeting notes, thoughts and goals. Streamline objective
				discovery.
			</p>
			<h5>Contextual TODOs</h5>
			<p>
				Build a checklist of discovered item, that need to be tackled. And look
				back at what you were able to accomplish/not-accomplish every day.
			</p>
		</section>
	);
};

export default AboutPage;
