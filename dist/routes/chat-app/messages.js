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
import { openai } from '../../openai.js';
const messagesRouter = express.Router();
messagesRouter.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const body = req.body;
    if (!body[1]) {
        res.send({ error: 'Invalid Request, Try Again' });
    }
    else {
        const response = yield openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: body
        });
        if (!response.data.choices || !response.data.choices[0].message) {
            res.send({ error: 'Server Error, Wait and Try Again' });
        }
        else {
            console.log((_a = response.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content);
            console.log(response.data.choices);
            res.send({ success: (_b = response.data.choices[0].message) === null || _b === void 0 ? void 0 : _b.content });
        }
    }
}));
export default messagesRouter;
