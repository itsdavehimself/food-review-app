import ffmpeg from 'fluent-ffmpeg';

const convertToWav = (inputPath: string, outputPath: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		ffmpeg(inputPath)
			.toFormat('wav')
			.on('end', () => resolve())
			.on('error', (err) => reject(err))
			.save(outputPath);
	});
};

export default convertToWav;
