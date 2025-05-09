import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import promptRoutes from './routes/promptRoutes';
import authRoutes from './routes/authRoutes';
import mediaRoutes from './routes/mediaRoutes';
import currentPromptRoutes from './routes/currentPromptRoutes';
import combinationRoutes from './routes/combinationRoutes';
import recipeRoutes from './routes/recipeRoutes';
import recipeImageRoutes from './routes/recipeImageRoutes';
import menuRoutes from './routes/menuRoutes';
import { initializeDatabase } from './config/database';

// Creating express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initializeDatabase()
    .then(() => {
        console.log('Firebase bağlantısı başarılı');
    })
    .catch((error) => {
        console.error('Firebase başlatma hatası:', error);
        console.log('Uygulama hata ile devam ediyor...');
    });

// Routes
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Tarif AI API is running!' });
});

// Use route modules
app.use('/api', promptRoutes);
app.use('/api', authRoutes);
app.use('/api', mediaRoutes);
app.use('/api', currentPromptRoutes);
app.use('/api', combinationRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/recipe-images', recipeImageRoutes);
app.use('/api/menu', menuRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Bir şeyler ters gitti!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});