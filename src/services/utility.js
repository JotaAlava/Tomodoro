import { toast } from 'react-toastify';

export const isSessionExpired = (err) => {
	return err.message === 'Unauthorized';
};

export const onSessionEnd = (err, logout) => {
	toast.warn('Your session has ended.');
	setTimeout(() => {
		if (isSessionExpired(err)) {
			logout();
		}
	}, 2000);
};
