import app from './src/app.js'
import { poolPromise } from './src/config/db.config.js';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await poolPromise;
    console.log('Database connected.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
})();
