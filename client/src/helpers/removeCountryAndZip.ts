export const removeCountryAndZip = (address: string): string => {
	const parts = address.split(',');
	parts.pop();
	const [street, ...cityStateZipParts] = parts;
	const cityStateZip = cityStateZipParts
		.join(',')
		.replace(/\d{5}(-\d{4})?$/, '')
		.trim();
	return `${street.trim()}, ${cityStateZip}`;
};
