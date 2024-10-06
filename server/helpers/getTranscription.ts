import convertToWav from './convertToWav';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import sendAudioToAzure from './sendAudioToAzure';

const getTranscription = async (audioPath: string) => {
	const uniqueFileName = `uploads/converted_audio_${uuidv4()}.wav`;

	await convertToWav(audioPath, uniqueFileName);

	const audioBuffer = fs.readFileSync(uniqueFileName);

	const transcription = await sendAudioToAzure(audioBuffer);

	fs.unlinkSync(uniqueFileName);

	return transcription;
};

export default getTranscription;
