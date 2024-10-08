import styles from './Navbar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faHouse,
	faLocationDot,
	faUser,
	faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

const Navbar: React.FC = () => {
	const navigate = useNavigate();
	const houseIcon = <FontAwesomeIcon icon={faHouse} />;
	const mapIcon = <FontAwesomeIcon icon={faLocationDot} />;
	const userIcon = <FontAwesomeIcon icon={faUser} />;
	const searchIcon = <FontAwesomeIcon icon={faMagnifyingGlass} />;
	const user = useAppSelector((state) => state.user);

	const handleClick = (destination: string): void => {
		navigate(`/${destination}`);
	};

	return (
		<>
			<nav className={styles.navbar}>
				<button className={styles['nav-btn']} onClick={() => handleClick('')}>
					{houseIcon}
				</button>
				<button
					className={styles['nav-btn']}
					onClick={() => handleClick('explore')}
				>
					{searchIcon}
				</button>
				<button
					className={styles['nav-btn']}
					onClick={() => handleClick(`user/${user.username}`)}
				>
					{userIcon}
				</button>
			</nav>
		</>
	);
};

export default Navbar;
