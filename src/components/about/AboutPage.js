import React from 'react';

const AboutPage = () => {
	return (
		<section className="holy-grail-content">
			<h1>About Tomato Timer</h1>
			<p>
				Tomato Timer is an implementation of the Pomodoro Technique, which is a
				time management system. This system helps people to maximize time
				efficiency. The Pomodoro Technique requires you to break your workday
				into 25-minute chunks separated by 5-minute breaks. These intervals are
				referred to as pomodoros. After about four pomodoros, you take a longer
				break of 15 minutes.
			</p>

			<h5>10x Stand-up Report</h5>
			<p>
				One key way this helps me as a software developer is by composing my
				daily stand-up report pomodoro by pomodoro throughout the day. This
				keeps my stand-up report relevant, accurate and useful for the rest of
				my team.
			</p>
			<hr></hr>
			<h1>The Sophrosyn3 LLC Twist</h1>
			<h5>Track work by work context.</h5>
			<p>
				This feature allows you to jump around different types of work and
				easily pick-up where you left off the next time you sit down to work by
				looking at the logs. I strongly recommend jotting down what you are
				thinking every time you log an entry of work, alongside anything of
				significant note.
			</p>
			<h5>Formatted braindumps as Daily Notes.</h5>
			<p>
				This feature is more effective when used as a braindump or meeting
				notes.
			</p>
			<h5>Contextual TODOs</h5>
			<p>
				Keep track of each discovery or accomplishment as you complete tomatoes.
			</p>
		</section>
	);
};

export default AboutPage;
