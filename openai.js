"use strict";
exports.__esModule = true;
exports.openai = void 0;
require('dotenv').config();
var openai_1 = require("openai");
var configuration = new openai_1.Configuration({
    organization: process.env.OPENAI_API_ORG,
    apiKey: process.env.OPENAI_API_KEY
});
exports.openai = new openai_1.OpenAIApi(configuration);
