import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userAuthRouter from './routes/userAuthRoutes';
import favoritesRouter from './routes/favoritesRoutes';
import bookmarksRouter from './routes/bookmarksRoutes';
import userSavedDataRouter from './routes/userSavedDataRoutes';
import reviewRouter from './routes/reviewRoutes';

const port = Number(process.env.PORT) || 3000;

dotenv.config();

const app = express();
app.use(express.json());

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);

app.use(cookieParser());
app.use('/api/auth', userAuthRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/bookmarks', bookmarksRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/savedData', userSavedDataRouter);

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
	console.log(
		'MONGO_URI is not defined. Make sure it is set in your environment variables.'
	);
	process.exit(1);
}

mongoose
	.connect(mongoURI)
	.then(() => {
		console.log('Connected to MongoDB');
		app.listen(port, '0.0.0.0', () => {
			console.log(`Server is listening at http://0.0.0.0:${port}`);
		});
	})
	.catch((err) => {
		console.error('Failed to connect to MongoDB', err);
		process.exit(1);
	});
