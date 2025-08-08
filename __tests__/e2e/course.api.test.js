"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("..//../src");
describe('/course', () => {
    it('should return  200 and empty array', () => {
        (0, supertest_1.default)(src_1.app)
            .get('/courses')
            .expect(200, []);
    });
});
