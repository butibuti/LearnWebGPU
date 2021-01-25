"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const path = require('path');
const PORT = process.env.PORT || 5000;
app.use(express_1.default.static(path.join(__dirname + "/../", 'public')));
app.set('views', path.join(__dirname + "/../", 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const router = express_1.default.Router();
app.use(router);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
//# sourceMappingURL=index.js.map