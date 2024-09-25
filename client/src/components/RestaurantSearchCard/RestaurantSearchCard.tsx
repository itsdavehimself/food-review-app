import styles from './RestaurantSearchCard.module.scss';
import { removeCountryAndZip } from '../../helpers/removeCountryAndZip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faBookmark as faBookmarkSolid,
	faStar as faStarSolid,
	faCheckCircle as faCheckCircleSolid,
} from '@fortawesome/free-solid-svg-icons';
import {
	faStar,
	faBookmark,
	faCheckCircle,
} from '@fortawesome/free-regular-svg-icons';
import { toggleFavorite } from '../../helpers/toggleFavorites';
import { useAppDispatch } from '../../app/hooks';

interface RestaurantSearchCardProps {
	name: string;
	address: string;
	restaurantId: string;
	isFavorited: boolean;
	onClick: () => void;
}

const RestaurantSearchCard: React.FC<RestaurantSearchCardProps> = ({
	name,
	address,
	restaurantId,
	isFavorited,
	onClick,
}) => {
	const dispatch = useAppDispatch();

	const handleToggleFavorite = (e: any) => {
		toggleFavorite(e, restaurantId, dispatch);
	};
	return (
		<div className={styles['restaurant-card']} onClick={onClick}>
			<div className={styles['restaurant-info']}>
				<h3>{name}</h3>
				<p>{removeCountryAndZip(address)}</p>
			</div>
			<div className={styles.icons}>
				<FontAwesomeIcon
					icon={isFavorited ? faStarSolid : faStar}
					className={styles.icon}
					onClick={handleToggleFavorite}
				/>
				<FontAwesomeIcon icon={faBookmark} className={styles.icon} />
				<FontAwesomeIcon icon={faCheckCircle} className={styles.icon} />
			</div>
		</div>
	);
};

export default RestaurantSearchCard;
