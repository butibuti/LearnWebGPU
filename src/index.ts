import express from 'express'


const layouts = require("express-ejs-layouts");
const app: express.Express = express();
const path = require('path');

const PORT = process.env.PORT || 5000;

app.use(layouts);
app.use(express.static(path.join(__dirname+"/../", 'public')));

app.set('views', path.join(__dirname+"/../", 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router: express.Router = express.Router();
router.get('/', (req, res) => res.render('pages/index'));
router.get('/games/', (req, res) => res.render('pages/game'));
router.get('/games/game_find', (req, res) => res.render('pages/game_find'));
router.get('/games/game_magurossy', (req, res) => res.render('pages/game_magurossy'));
router.get('/games/game_jetSaber', (req, res) => res.render('pages/game_jetSaber'));
router.get('/tool/tool_3DtoDot', (req, res) => res.render('pages/tool_3DtoDot'));
app.use(router);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));