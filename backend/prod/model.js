"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require('fs').promises;
class Model {
    constructor() {
        this.test();
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('+model');
            try {
                const database = yield fs.readFile('./backend/prod/db.json');
                console.log(JSON.parse(database));
                console.log('+database');
            }
            catch (error) {
                console.log(error);
                console.log('-database');
            }
        });
    }
}
module.exports = new Model();
