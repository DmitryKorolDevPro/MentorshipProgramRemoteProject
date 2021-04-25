"use strict";
class Controller {
    constructor() {
        this.test();
    }
    test() {
        console.log('+controller');
    }
}
module.exports = new Controller();
