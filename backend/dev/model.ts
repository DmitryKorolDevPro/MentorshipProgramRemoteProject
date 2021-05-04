import { promises as fsp } from 'fs';

interface DatabaseModel {
  getList(): Promise<object[]>;
}

export class Model implements DatabaseModel {
  async getList() {
    try {
      const database = await fsp.readFile('./backend/prod/db.json');
      return JSON.parse(database.toString()).list;
    } catch (error) {
      console.error(`Not able to receive data from database. ${error}`);
    }
  }
}