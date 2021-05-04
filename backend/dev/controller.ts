import { Model } from './model.js';
const model = new Model();

export type ResponseObj = {
  statusCode: number,
  // pageNumber: number,
  result: object[]
}

export class Controller {


  async getAllItems(): Promise<ResponseObj> {
    const response: ResponseObj = {
      statusCode: 200,
      // pageNumber: 1,
      result: []
    }

    response.result = await model.getList();
    // response.pageNumber = await this.getMaxPageNumb(await this.getItemPerPage());

    if (!Array.isArray(response.result)) {
      response.statusCode = 500;
    }

    if (response.result.length === 0) {
      response.statusCode = 204;
    }

    return response;
  }

  async getFiveItems(page: any): Promise<ResponseObj> {
    const response: ResponseObj = {
      statusCode: 200,
      // pageNumber: 1,
      result: []
    }

    let list = (await this.getAllItems()).result;
    const itemsPerPage = model.getItemPerPage();
    const maxPage = await this.getMaxPageNumb();
    // response.pageNumber = maxPage;

    page = parseInt(page);
    if (isNaN(page) || page < 1 || page > maxPage) {
      response.statusCode = 400;
      return response;
    }

    list = list.splice(--page * itemsPerPage, 5);
    response.result = list.filter(item => item !== undefined);
    return response;
  }

  async getMaxPageNumb() {
    const pageNeed = model.getItemPerPage();
    let list = (await this.getAllItems()).result;
    const maxPageNumber = Math.ceil(list.length / pageNeed);
    return maxPageNumber;
  }

  async getExistPage(maxpage: number) {
    const maxPage = await this.getMaxPageNumb();
    if (maxpage <= maxPage) {
      return true;
    }
    else {
      return false;
    }

  }

}
