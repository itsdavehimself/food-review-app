import { useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { Place } from '../../interfaces/Place.interfaces';

const serverUrl = import.meta.env.VITE_SERVER_URL;

interface AudioRecorderProps {
	place: Place | null;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ place }) => {
	const [isRecording, setIsRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);

	const startRecording = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		mediaRecorderRef.current = new MediaRecorder(stream);

		mediaRecorderRef.current.ondataavailable = (event) => {
			audioChunksRef.current.push(event.data);
		};

		mediaRecorderRef.current.onstop = () => {
			const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
			setAudioBlob(audioBlob);
			audioChunksRef.current = [];
		};

		mediaRecorderRef.current.start();
		setIsRecording(true);
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	const sendAudioToBackend = () => {
		if (audioBlob) {
			const accessToken = Cookies.get('accessToken');

			if (!accessToken) {
				throw new Error('No access token found. User is not authenticated.');
			}

			if (!place) {
				throw new Error('Place is missing.');
			}

			const formData = new FormData();
			formData.append('audioFile', audioBlob, 'recording.wav');
			formData.append('restaurantId', place.id);
			formData.append('displayName', place.displayName.text);
			formData.append('address', place.formattedAddress);
			formData.append('photoUrl', place.photoUrl);

			fetch(`${serverUrl}/api/reviews/createReview`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				body: formData,
			})
				.then((response) => response.json())
				.then((data) => {
					console.log('Audio sent successfully:', data);
				})
				.catch((error) => {
					console.error('Error sending audio:', error);
				});
		}
	};

	return (
		<div>
			<button
				onPointerDown={() => {
					startRecording();
				}}
				onPointerUp={() => {
					stopRecording();
				}}
				onPointerLeave={() => {
					stopRecording();
				}}
				disabled={isRecording}
			>
				{isRecording ? 'Recording...' : 'Hold to Record'}
			</button>
			<br />
			<button onClick={sendAudioToBackend} disabled={!audioBlob}>
				Send Recording
			</button>
		</div>
	);
};

export default AudioRecorder;
