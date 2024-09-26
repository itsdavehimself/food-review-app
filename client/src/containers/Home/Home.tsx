import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Cookies from 'js-cookie';
import { logout } from '../../app/slices/userSlice';
import { clearSearch } from '../../app/slices/searchSlice';

const Dashboard: React.FC = () => {
	const state = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();

	const handleLogout = async (): Promise<void> => {
		await fetch('http://localhost:3000/api/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});
		dispatch(logout());
		dispatch(clearSearch());
		Cookies.remove('accessToken');
	};

	return (
		<div>
			{state.username}
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
};

export default Dashboard;
