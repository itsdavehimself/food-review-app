const originalPrompt = (transcript: string) => {
	return `Summarize this <transcript>${transcript}</transcript> 
                    into a brief, clear, and casual summary that will be displayed back to the person who wrote the review.
                    There is no sentence limit or minimum, but ensure all of the keypoints are mentioned in
                    a way that is valuable for someone to quickly get a sense of the positives and negatives.

                    Write the summary in 2nd person past tense.
                    
                    Once the summary is completed, you are to create a list of highlights and lowlights.
                    Mention the most important details, like specific food items mentioned, restaurant ambience/decor,
                    service, and any other key details. Make a line break after each highlight or lowlight item. Do not use commas or periods.
                    
                    Lastly, you will give a review based on the review out of 10. Use a decimal, i.e. 7.4/10.
                    
                    The format of your output should be labeled as follows:
                    Summary:
                    Highlights:
                    Lowlights:
                    Rating:
                    
                    Do not add any superfluous text.
                    If any of "highlights," "lowlights," are empty, simply write "None."
                    Do not add bullets or dashes for any lists.
                    Do not add any markdown or styles to the text.`;
};

const basePrompt = `Your job is to summarize this <transcript></transcript> into a clear, 
                    casual summary for a restaurant review app. 
                    
                    Always include a summary of food quality as it is a key factor for all users. 
                    Focus on the user’s stated priorities: {variable} (such as value, service, and ambiance)
                    when generating highlights, lowlights, and the rating.

                    In cases where price or value is mentioned, weigh that more heavily in generating the
                    overall rating. Similarly, if ambiance or service is emphasized, adapt the rating and
                    summary accordingly.

                    Once the summary is completed, generate a list of highs and lows, categorizing them
                    based on the user’s preferences.

                    Lastly, give a rating out of 10, with heavier weighting based on the user's preferences
                    for value, service, and ambiance. Food is always considered, but doesn’t need to be weighed
                    heavily unless otherwise indicated.

                    Output format:
                    Summary:
                    Highlights:
                    Lowlights:
                    Rating:`;

export { originalPrompt, basePrompt };
