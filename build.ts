import { JSDOM } from 'jsdom';
import * as puppeteer from 'puppeteer';
import * as fx from 'fs-extra';
import { join } from 'path';

let domain = 'https://www.krispykreme.com';
let browser;

const runKrispyKreme = async () => {
    const page = await getPage(`https://www.krispykreme.com/menu/doughnuts/`);
    const content = await page.content();
    const dom = new JSDOM(content);
    const donuts = Array.from(
        dom.window.document.querySelectorAll(
            'section.menu-list .container-fluid .menu-items-container .kk-filter-items li',
        ),
    ).map((node: any) => {
        let donut: any = {};
        donut.title = node.querySelector('.title').innerHTML;
        let url = node.querySelector(`a[href]`).getAttribute('href');
        donut.url = `${domain}${url}`;
        donut.img = domain + node.querySelector('img').getAttribute('src');
        donut.imgAlt = domain + node.querySelector('img').getAttribute('alt');
        donut.id = url.split('/').pop();
        donut.types = node.getAttribute('data-filter-names').split('|');
        return donut;
    });
    const types = Array.from(
        donuts.reduce((acc, donut) => {
            donut.types.forEach((t) => acc.add(t));
            acc.delete('');
            return acc;
        }, new Set()),
    );
    for (let i = 0; i < donuts.length; i++) {
        let donut = donuts[i];
        console.log('Visiting', donut.url);
        await page.goto(donut.url);
        const content = await page.content();
        const dom = new JSDOM(content);
        let node: any = dom.window.document.querySelector('.menu-detail');
        donut.bannerUrl =
            domain + node.querySelector('.hero > img').getAttribute('src');
        donut.nutritionalFacts = node
            .querySelector('[data-track="item-detail-nutrition"]')
            .getAttribute('href');
        donut.description = dom.window.document
            .querySelector('.menu-detail > p')
            .innerHTML.split(/\<[^>]*\>/g)
            .join('');
    }
    fx.mkdir(join(__dirname, 'data'));
    fx.writeJsonSync(join(__dirname, './data/types.json'), types);
    fx.writeJsonSync(join(__dirname, './data/donuts.json'), donuts);
};

(async () => {
    browser = await puppeteer.launch();
    await runKrispyKreme();
    browser.close();
})();

async function getPage(url) {
    let page = await browser.newPage();
    await page.goto(url);
    return page;
}
