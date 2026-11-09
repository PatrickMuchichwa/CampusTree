require('dotenv').config();

const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Test database connection
        const connection = await db.getConnection();

        console.log('MySQL connected successfully');

        connection.release();

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
}

startServer();