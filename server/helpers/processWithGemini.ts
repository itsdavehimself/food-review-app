import { GoogleGenerativeAI } from '@google/generative-ai';
import { originalPrompt } from '../prompts/basePrompt';

const processWithGemini = async (transcript: string) => {
	if (!process.env.MY_GEMINI_API_KEY) {
		console.log('Gemini API key not found');
		return 'Gemini API key not found';
	}
	const genAI = new GoogleGenerativeAI(process.env.MY_GEMINI_API_KEY);
	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

	const prompt = originalPrompt(transcript);

	const result = await model.generateContent(prompt);

	return result.response.text();
};

export default processWithGemini;
