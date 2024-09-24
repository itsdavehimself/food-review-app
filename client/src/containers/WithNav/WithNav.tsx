import Navbar from '../../components/Navbar/Navbar';
import { Outlet } from 'react-router';

const WithNav: React.FC = () => {
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
};

export default WithNav;
