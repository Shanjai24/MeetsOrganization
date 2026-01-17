const db = require('../config/db');

const initializeDatabase = async () => {
    try {
        console.log('📦 Initializing database with default categories...');

        // Insert default categories
        const categories = [
            'M Team',
            'Academic',
            'COA',
            'Skill',
            'Business'
        ];

        for (const category of categories) {
            const [existing] = await db.query(
                'SELECT id FROM categories WHERE name = ?',
                [category]
            );

            if (existing.length === 0) {
                await db.query(
                    'INSERT INTO categories (name) VALUES (?)',
                    [category]
                );
                console.log(`✅ Created category: ${category}`);
            } else {
                console.log(`⏭️  Category already exists: ${category}`);
            }
        }

        console.log('✅ Database initialization complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
};

initializeDatabase();
