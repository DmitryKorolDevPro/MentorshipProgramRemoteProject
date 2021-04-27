import { Model } from './model.js';
const model = new Model();

export type ResponseObj = {
  statusCode: number,
  result: object[]
}

export class Controller {
  async getAllItems() {
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

  async getFiveItems(page: any) {
    const response: ResponseObj = {
      statusCode: 200,
      result: []
    }

    let list = (await this.getAllItems()).result;

    const itemsPerPage = 5;
    const maxPageNumber = Math.ceil(list.length / itemsPerPage);

    page = parseInt(page);
    if (isNaN(page) || page < 1 || page > maxPageNumber) {
      response.statusCode = 400;
      return response;
    }

    list = list.splice(--page * itemsPerPage, 5);
    response.result = list.filter(item => item !== undefined);

    return response;
  }
}
