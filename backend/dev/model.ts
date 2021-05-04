import { promises as fsp } from 'fs';

interface DatabaseModel {
  getList(): object[] | object;
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

  getItemPerPage() {
    const itemsinPage = 5;
    return itemsinPage;
  }
}