"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const layouts = require("express-ejs-layouts");
const app = express_1.default();
const path = require('path');
const PORT = process.env.PORT || 5000;
app.use(layouts);
app.use(express_1.default.static(path.join(__dirname + "/../", 'public')));
app.set('views', path.join(__dirname + "/../", 'views'));
app.set('view engine', 'ejs');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const router = express_1.default.Router();
router.get('/', (req, res) => res.render('pages/index'));
router.get('/games/', (req, res) => res.render('pages/game'));
router.get('/games/game_find', (req, res) => res.render('pages/game_find'));
router.get('/games/game_magurossy', (req, res) => res.render('pages/game_magurossy'));
router.get('/games/game_jetSaber', (req, res) => res.render('pages/game_jetSaber'));
app.use(router);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
//# sourceMappingURL=index.js.map