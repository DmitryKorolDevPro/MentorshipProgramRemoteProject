const fs = require('fs').promises;

class Model {
  constructor() {
    this.test();  
  }

  async test() {
    console.log('+model');
    
    try {
      const database = await fs.readFile('./backend/prod/db.json');

      console.log(JSON.parse(database));
      console.log('+database');
    } catch (error) {
      console.log(error);
      console.log('-database');
    }
  }
}

module.exports = new Model();





