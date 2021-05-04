import { Model } from './model.js';
const model = new Model();

export interface ResponseObj {
  statusCode: number,
  result: object[]
}

export class Controller {
  maxPage: number;
  itemsPerPage: number;

  constructor () {
    this.itemsPerPage = 5;
    this.maxPage = 0;
    this.setMaxPage();
  };

  async getAllItems(): Promise<ResponseObj> {
    const response: ResponseObj = {
      statusCode: 200,
      result: []
    }

    response.result = await model.getList();

    if (!Array.isArray(response.result)) {
      response.statusCode = 500;
    }

    if (response.result.length === 0) {
      response.statusCode = 204;
    }

    return response;
  }

  async getItems(req: string):Promise<ResponseObj> {
    const response: ResponseObj = {
      statusCode: 200,
      result: []
    }

    let list: object[] = (await this.getAllItems()).result;
    let page: number = parseInt(req);
    
    if (this.pageIsNotValid(page)) {
      response.statusCode = 400;
      return response;
    }

    list = list.splice(((page - 1) * this.itemsPerPage), this.itemsPerPage);
    response.result = list.filter(item => item !== undefined);
    return response;
  }

  async setMaxPage(): Promise<void> {
    const list: object[] = (await this.getAllItems()).result;
    this.maxPage = Math.ceil(list.length / this.itemsPerPage);
  }

  checkIfPageExists(req: string): boolean {
    let page:number = parseInt(req);
    
    if (this.pageIsNotValid(page)) {
      return false;
    } else {
      return true;
    }
  }

  pageIsNotValid(page: number): boolean {
    return isNaN(page) || page < 1 || page > this.maxPage;
  }
}
