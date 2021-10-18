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
router.get('/techs/', (req, res) => res.render('pages/techs'));
router.get('/choose/', (req, res) => res.render('pages/choose'));
router.get('/games/game_choose', (req, res) => res.render('pages/game_choose'));
router.get('/games/game_ochinobi', (req, res) => res.render('pages/game_ochinobi'));
router.get('/games/game_find', (req, res) => res.render('pages/game_find'));
router.get('/games/game_magurossy', (req, res) => res.render('pages/game_magurossy'));
router.get('/games/game_jetSaber', (req, res) => res.render('pages/game_jetSaber'));
router.get('/jam/Left', (req, res) => res.render('pages/jam_Left'));
router.get('/techs/tech_3DtoDot', (req, res) => res.render('pages/tech_3DtoDot'));
router.get('/techs/live2DWithGLSL', (req, res) => res.render('pages/tech_live2DwithGLSL',{model:"tenshi_01",shaders:["rainbow.glsl","Block.glsl"]}));
router.get('/techs/butiengine', (req, res) => res.render('pages/tech_dx12Engine'));

router.get('/techs/shaders/:shaderName', (req, res) => {
    var shaderPath='pages/shaders/'+req.params.shaderName;
    try{ res.render(shaderPath);}
    catch(err){
        res.status(500);

    }
});

app.use(router);
app.use(function (req, res, next) {
    // 出力するデータ
    var data = {
        method: req.method,
        protocol: req.protocol,
        version: req.httpVersion,
        url: req.url
    };
 
    console.log(req.url);
    // エラーを返却
    res.status(404);
    if (req.xhr) {
        res.json(data);
    } else {
        res.render('pages/errors/404')
    }
});
app.use(function (err:Error, req:any, res:any, next:Function) {
    // 出力するデータ
    var data = {
        method: req.method,
        protocol: req.protocol,
        version: req.httpVersion,
        url: req.url,
    };
    res.status(500);
    if (req.xhr) {
        res.json(data);
    } else {
        res.render('pages/errors/500')
    }
});
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));