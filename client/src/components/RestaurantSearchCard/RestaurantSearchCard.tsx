import styles from './RestaurantSearchCard.module.scss';
import { removeCountryAndZip } from '../../helpers/removeCountryAndZip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faBookmark as faBookmarkSolid,
	faHeart as faHeartSolid,
	faCheckCircle as faCheckCircleSolid,
} from '@fortawesome/free-solid-svg-icons';
import {
	faHeart,
	faBookmark,
	faCheckCircle,
} from '@fortawesome/free-regular-svg-icons';
import { toggleFavorite } from '../../helpers/toggleFavorites';
import { useAppDispatch } from '../../app/hooks';
import { Place } from '../../interfaces/Place.interfaces';

interface RestaurantSearchCardProps {
	place: Place;
	isFavorited: boolean;
	onClick: () => void;
}

const RestaurantSearchCard: React.FC<RestaurantSearchCardProps> = ({
	place,
	isFavorited,
	onClick,
}) => {
	const dispatch = useAppDispatch();

	const handleToggleFavorite = (e: any) => {
		toggleFavorite(e, place, dispatch);
	};
	return (
		<div className={styles['restaurant-card']} onClick={onClick}>
			<div className={styles['restaurant-info']}>
				<h3>{place.displayName.text}</h3>
				<p>{removeCountryAndZip(place.formattedAddress)}</p>
			</div>
			<div className={styles.icons}>
				<FontAwesomeIcon
					icon={isFavorited ? faHeartSolid : faHeart}
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
