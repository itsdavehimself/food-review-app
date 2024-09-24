import { useEffect, useState } from 'react';
import styles from './LocationSearch.module.scss';
import useAddressPredictions from '../../helpers/useAddressPredictions';
import { useAppSelector } from '../../app/hooks';

interface LocationSearchProps {
	setLocation: React.Dispatch<React.SetStateAction<string>>;
	setLocationMatch: React.Dispatch<React.SetStateAction<boolean>>;
	clearLocationInput: boolean;
	setClearLocationInput: React.Dispatch<React.SetStateAction<boolean>>;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
	setLocation,
	setLocationMatch,
	clearLocationInput,
	setClearLocationInput,
}) => {
	const [input, setInput] = useState('');
	const predictions = useAddressPredictions(input);
	const locationSearch = useAppSelector((state) => state.search.location);

	const onClick = (prediction: string) => {
		setLocation(prediction);
		setInput(prediction);
	};

	useEffect(() => {
		const isMatch = predictions.includes(input);
		setLocationMatch(isMatch);
	}, [input, predictions, setLocationMatch]);

	useEffect(() => {
		if (locationSearch !== '') {
			setInput(locationSearch);
		}
	}, [locationSearch]);

	useEffect(() => {
		if (clearLocationInput) {
			setInput('');
			setClearLocationInput(false);
		}
	}, [clearLocationInput, setClearLocationInput]);

	const showPredictions = input && !predictions.includes(input);

	return (
		<div className={styles.container}>
			<input
				className={styles['location-input']}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Location"
			/>
			{showPredictions && (
				<ul className={styles.predictionList}>
					{predictions.map((prediction, index) => (
						<li
							key={index}
							className={styles.predictionItem}
							onClick={() => onClick(prediction)}
						>
							{prediction}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default LocationSearch;
