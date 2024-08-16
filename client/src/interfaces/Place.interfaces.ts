export interface Place {
	id: string;
	displayName: {
		text: string;
	};
	formattedAddress: string;
	photos: Photo[];
	priceLevel: string;
	photoUrl: string;
}

export interface Photo {
	authorAttributions: AuthorAttribution[];
	heightPx: number;
	name: string;
	widthPx: number;
}

export interface AuthorAttribution {
	displayName: string;
	photoUri: string;
	uri: string;
}
