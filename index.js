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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var openai_1 = require("./openai");
var express = require('express');
var app = express();
var PORT = process.env.PORT;
app.use(express.json());
app.post('/chat-gpt/eldenring/names', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var prompt, response;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                prompt = req.body.prompt;
                if (!!prompt) return [3 /*break*/, 1];
                res.send('Invalid Prompt, Try Again');
                return [3 /*break*/, 3];
            case 1:
                console.log(prompt);
                return [4 /*yield*/, openai_1.openai.createChatCompletion({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: "You are a name generator. You generate first and last names given a theme. You only generate one name. Your generated names must be less than 16 total characters. You reply only the name in the form of a CamelCase string with no spaces between names. If you cannot do this your exact reply will be 'Error'"
                            },
                            {
                                role: 'user',
                                content: "Theme: ".concat(prompt)
                            }
                        ]
                    })];
            case 2:
                response = _c.sent();
                if (!response.data.choices || !response.data.choices[0].message) {
                    res.send('Server Error, Wait and Try Again');
                }
                else {
                    console.log((_a = response.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content);
                    console.log(response.data.choices);
                    res.send((_b = response.data.choices[0].message) === null || _b === void 0 ? void 0 : _b.content);
                }
                _c.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
app.listen(PORT, function () {
    console.log("Server is healthy");
});
