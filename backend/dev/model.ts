import { promises as fsp } from 'fs';

console.log('Model is working.');

export class Model {
  constructor() {
    this.testDatabase();
  }

  async testDatabase() {
    try {
      const database = await fsp.readFile('./backend/prod/db.json');

      console.log(JSON.parse(database.toString()));
      console.log('Database is working.');
    } catch (error) {
      console.log(error);
      console.log('!!! Database is NOT working. !!!');
    }
  }
}