import styles from './RestaurantSearchCard.module.scss';
import { removeCountryAndZip } from '../../helpers/removeCountryAndZip';

interface RestaurantSearchCardProps {
	name: string;
	address: string;
	onClick: () => void;
}

const RestaurantSearchCard: React.FC<RestaurantSearchCardProps> = ({
	name,
	address,
	onClick,
}) => {
	return (
		<div className={styles['restaurant-card']} onClick={onClick}>
			<h3>{name}</h3>
			<p>{removeCountryAndZip(address)}</p>
		</div>
	);
};

export default RestaurantSearchCard;
