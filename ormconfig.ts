import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
});

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dataSource, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dataSource, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('unknown environment');
}

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

module.exports = dataSource;
