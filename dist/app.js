"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const promptRoutes_1 = __importDefault(require("./routes/promptRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const mediaRoutes_1 = __importDefault(require("./routes/mediaRoutes"));
const database_1 = require("./config/database");
const currentPromptRoutes_1 = __importDefault(require("./routes/currentPromptRoutes"));
// Creating express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize Database
(0, database_1.initializeDatabase)()
    .then(() => {
    console.log('Firebase bağlantısı başarılı');
})
    .catch((error) => {
    console.error('Firebase başlatma hatası:', error);
    console.log('Uygulama hata ile devam ediyor...');
});
// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Tarif AI API is running!' });
});
// Use route modules
app.use('/api', promptRoutes_1.default);
app.use('/api', authRoutes_1.default);
app.use('/api', mediaRoutes_1.default);
app.use('/api', currentPromptRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Bir şeyler ters gitti!' });
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
