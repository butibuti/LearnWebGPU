import express from 'express'

const app: express.Express = express();
const path = require('path');

const PORT = process.env.PORT || 5000;


app.use(express.static(path.join(__dirname+"/../", 'public')));
app.set('views', path.join(__dirname+"/../", 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router: express.Router = express.Router();
router.get('/', (req, res) => res.render('pages/index'));
app.use(router);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));