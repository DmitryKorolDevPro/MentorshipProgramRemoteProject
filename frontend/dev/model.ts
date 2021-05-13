/* eslint-disable no-shadow */
import { view } from './view.js';
class Model {
  currentList: object[];
  currentPage: number;
  itemsPerPage: number;
  hostName: string;

  constructor() {
    this.currentList = [];
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.hostName = 'http://localhost:5500';
    // this.handleClick = this.handleClick.bind(this);
  }
  async getDataFromBE(page: number) {
    try {
      return (await fetch(`${this.hostName}/api/sneakers/${page}`))
        .json()
        .then((list) => {
          if (list.length === 0) {
            throw new Error('Error. Stock is empty');
          }

          return list;
        });
    } catch (error) {
      view.catchError(error);
    }
  }
  async nextPageExists(page: number): Promise<boolean> {
    try {
      return (await fetch(`${this.hostName}/api/sneakers/check/${page}`))
        .json()
        .then(
          (page) => page.exists,
        );
    } catch (error) {
      return false;
    }
  }
}

const model = new Model();

export { model };
