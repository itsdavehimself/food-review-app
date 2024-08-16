import styles from './RestaurantSearchCard.module.scss';

interface RestaurantSearchCardProps {
	id: string;
	name: string;
	address: string;
}

const removeCountryAndZip = (address: string): string => {
	const parts = address.split(',');
	parts.pop();
	const [street, ...cityStateZipParts] = parts;
	const cityStateZip = cityStateZipParts
		.join(',')
		.replace(/\d{5}(-\d{4})?$/, '')
		.trim();
	return `${street.trim()}, ${cityStateZip}`;
};

const RestaurantSearchCard: React.FC<RestaurantSearchCardProps> = ({
	id,
	name,
	address,
}) => {
	return (
		<div className={styles['restaurant-card']}>
			<h3>{name}</h3>
			<p>{removeCountryAndZip(address)}</p>
		</div>
	);
};

export default RestaurantSearchCard;
