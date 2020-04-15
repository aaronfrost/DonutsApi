import * as express from 'express';
import * as cors from 'cors';
import * as donutTypes from './data/types.json';
import * as donuts from './data/donuts.json';
const app = express();
const port = 3000;

interface Donut {
    title: string;
    url: string;
    img: string;
    imgAlt: string;
    id: string;
    types: string[];
    bannerUrl: string;
    nutritionalFacts: string;
    description: string;
}

app.use(cors());
app.use(express.static('static'));
app.get('/', (req, res) => {
    res.json({
        hello: 'Welcome to the DonutAPI.',
        apis: [
            {
                api: 'donuts',
                description:
                    "Get's all Donuts from the api. Can optionally provide type as a a CSV query param",
            },
            {
                api: 'donuts/:id',
                description: "Get's a donut from the api",
            },
            {
                api: 'types',
                description: "Get's all donut types the api",
            },
        ],
    });
});

app.get('/donuts', (req, res) => {
    const type: string = req.query.type as string;
    let ds: Donut[] = (donuts as unknown) as Donut[];
    if (type) {
        const types = type.split(',');
        ds = ds.filter((donut) =>
            donut.types.reduce((acc, type) => {
                return acc || types.includes(type);
            }, false),
        );
    }
    res.json(ds);
});
app.get('/donuts/:donutId', (req, res) => {
    const donutId = req.params.donutId;
    const donut = ((donuts as unknown) as Donut[]).find(
        (donut: Donut) => donut.id === donutId,
    );
    res.json(donut || {});
});
app.get('/types', (req, res) => res.json(donutTypes));

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`),
);
