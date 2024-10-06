import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const sendAudioToAzure = async (audioBuffer: Buffer): Promise<any> => {
	if (!process.env.SPEECH_KEY) {
		return 'Azure speech key not found';
	}

	if (!process.env.SPEECH_REGION) {
		return 'Azure speech region not found';
	}

	const speechConfig = sdk.SpeechConfig.fromSubscription(
		process.env.SPEECH_KEY,
		process.env.SPEECH_REGION
	);
	speechConfig.speechRecognitionLanguage = 'en-US';

	const audioConfig = sdk.AudioConfig.fromWavFileInput(audioBuffer);
	const speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

	return new Promise((resolve, reject) => {
		let finalTranscript = '';

		// Add event handler for when speech is recognized
		speechRecognizer.recognized = (s, event) => {
			if (event.result.reason === sdk.ResultReason.RecognizedSpeech) {
				console.log(`Recognized: ${event.result.text}`);
				finalTranscript += event.result.text + ' ';
			} else if (event.result.reason === sdk.ResultReason.NoMatch) {
				console.log('No Match: Speech could not be recognized.');
			}
		};

		// Add event handler for when speech ends
		speechRecognizer.speechEndDetected = (s, event) => {
			speechRecognizer.stopContinuousRecognitionAsync(
				() => {
					console.log('Recognition stopped.');
					resolve(finalTranscript.trim());
				},
				(err) => {
					console.error(`Error stopping recognition: ${err}`);
					reject(err);
				}
			);
		};

		// Handle any cancellation errors
		speechRecognizer.canceled = (s, event) => {
			console.log('Recognition canceled.');
			console.log(`Cancellation Reason: ${event.reason}`);

			if (event.reason === sdk.CancellationReason.Error) {
				console.log(`ErrorCode: ${event.errorCode}`);
				console.log(`ErrorDetails: ${event.errorDetails}`);
				reject({
					error: `CANCELED: ErrorCode=${event.errorCode}`,
					details: event.errorDetails,
				});
			} else {
				resolve({ error: 'Recognition canceled for unknown reasons' });
			}

			speechRecognizer.close();
		};
		// Start continuous recognition
		speechRecognizer.startContinuousRecognitionAsync(
			() => {
				console.log('Recognition started.');
			},
			(err) => {
				console.error(`Error starting recognition: ${err}`);
				reject(err);
			}
		);
	});
};

export default sendAudioToAzure;
