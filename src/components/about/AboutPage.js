import React from 'react';

const AboutPage = () => {
	return (
		<main role="main" className="inner cover other-page">
			<h1>About Tomodoro</h1>
			<p>
				Tomodoro is an implementation of the Pomodoro Technique, which is a time
				management system. This system helps people to maximize time efficiency.
				The Pomodoro Technique requires you to break your workday into 25-minute
				chunks separated by 5-minute breaks. These intervals are referred to as
				pomodoros. After about four pomodoros, you take a longer break of 15
				minutes.
			</p>

			<h1>The Tomodoro Twist</h1>
			<h5>Track work by work context.</h5>
			<p>
				This feature allows you to jump around different types of work and
				easily pick-up where you left off the next time you sit down to work by
				looking at the logs. I strongly recommend jotting down what you are
				thinking every time you log an entry of work, alongside anything of
				significant note.
			</p>
			<hr></hr>
			<h5>Formatted braindumps as Daily Notes.</h5>
			<p>
				This feature is more effective when used as a priority list, braindump
				and checklist. One key way this helps me as a software developer is by
				composing my daily stand-up report pomodoro by pomodoro throughout the
				day. This keeps my stand-up report relevant, accurate and useful for the
				rest of my team.
			</p>
			<p>
				A great nice to have is that when it comes time to ask for a salary
				raise, you can very easliy look back at these notes/log and compose a
				point-by-point essay demonstrating all the work that you have done for
				your employer.
			</p>
		</main>
	);
};

export default AboutPage;
