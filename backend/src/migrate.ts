import { migrator } from './db';

async function migrate() {
  console.log('Starting migration...');
  const { error, results } = await migrator.migrateToLatest();

  if (error) {
    console.error('Migration failed', error);
  } else {
    console.log('Migrations completed successfully');
    if (results && results.length > 0) {
      results.forEach((result) => {
        console.log(`Migration ${result.migrationName} executed`);
      });
    } else {
      console.log('No new migrations to execute');
    }
  }
}

migrate();