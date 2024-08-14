import Navbar from '../../components/Navbar/Navbar';
import { Outlet } from 'react-router';
import styles from './WithNav.module.scss';

const WithNav: React.FC = () => {
	return (
		<>
			<Navbar />
			<div className={styles['added-margin']}>
				<Outlet />
			</div>
		</>
	);
};

export default WithNav;
