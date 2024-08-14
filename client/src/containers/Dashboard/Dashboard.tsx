import styles from './Dashboard.module.scss';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Cookies from 'js-cookie';
import { logout } from '../../app/slices/userSlice';

const Dashboard: React.FC = () => {
	const state = useAppSelector((state) => state.user);
	const dispatch = useAppDispatch();

	const handleLogout = (): void => {
		dispatch(logout());
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
