import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';

export default function useAddressPredictions(input: string) {
	const [predictions, setPredictions] = useState<string[]>([]);
	const autocomplete = useRef<google.maps.places.AutocompleteService | null>(
		null
	);

	if (!autocomplete.current) {
		autocomplete.current = new window.google.maps.places.AutocompleteService();
	}

	const getPlacePredictions = (input: string) => {
		autocomplete.current?.getPlacePredictions({ input }, (predictions) => {
			if (predictions) {
				// Filter predictions to include only cities
				const cityPredictions = predictions.filter((prediction) => {
					// Check if the prediction description contains "City"
					return prediction.types.includes('locality');
				});
				setPredictions(
					cityPredictions.map((prediction) => prediction.description)
				);
			}
		});
	};

	const debouncedGetPlacePredictions = useCallback(
		debounce(getPlacePredictions, 500),
		[]
	);

	useEffect(() => {
		if (input.trim() !== '') {
			debouncedGetPlacePredictions(input);
		} else {
			setPredictions([]);
		}
	}, [input, debouncedGetPlacePredictions]);

	return predictions;
}
