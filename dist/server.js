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
import cors from 'cors';
export const app = express();
const PORT = process.env._PORT || 8080;
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use((req, _res, next) => {
    const bodyCopy = Object.assign({}, req.body);
    if (bodyCopy.password) {
        bodyCopy.password = 'hidden';
    }
    console.log('<-----Body Logger Start----->');
    console.log('Received: ', new Date().toLocaleString());
    console.log('Request Body: ', bodyCopy);
    console.log('<-----Body Logger End----->');
    next();
});
import apiRouter from './api.js';
import { getUserByEmail } from './db/users-fs.js';
app.use('/api', apiRouter);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is listening on port: ${PORT}`);
    const res = yield getUserByEmail('dev.cjfritz@gmail.com');
    console.log('final user response: ', res);
}));
