var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { openai } from '../openai.js';
const eldenRingRandomizer = express.Router();
eldenRingRandomizer.post('/names', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const prompt = req.body.prompt;
    if (!prompt) {
        res.send('Invalid Prompt, Try Again');
    }
    else {
        console.log(prompt);
        const response = yield openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: "You are a name generator. You generate first and last names given a theme. You only generate one name. Your generated names must be less than 16 total characters. You reply only the name in the form of a CamelCase string with no spaces between names. If you cannot do this your exact reply will be 'Error'"
                },
                {
                    role: 'user',
                    content: `Theme: ${prompt}`
                }
            ]
        });
        if (!response.data.choices || !response.data.choices[0].message) {
            res.send('Server Error, Wait and Try Again');
        }
        else {
            console.log((_a = response.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content);
            console.log(response.data.choices);
            res.send((_b = response.data.choices[0].message) === null || _b === void 0 ? void 0 : _b.content);
        }
    }
}));
export default eldenRingRandomizer;
