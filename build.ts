import { pathExists, pathExistsSync } from 'fs-extra';
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
        donut.nutritionalFacts =
            domain +
            node
                .querySelector('[data-track="item-detail-nutrition"]')
                .getAttribute('href');
        donut.description = dom.window.document
            .querySelector('.menu-detail > p')
            .innerHTML.split(/\<[^>]*\>/g)
            .join('');
    }
    if (!pathExistsSync(join(__dirname, 'data'))) {
        fx.mkdir(join(__dirname, 'data'));
    }
    fx.removeSync(join(__dirname, './data/types.json'));
    fx.removeSync(join(__dirname, './data/donuts.json'));
    fx.writeJsonSync(join(__dirname, './data/types.json'), types);
    fx.writeJsonSync(join(__dirname, './data/donuts.json'), donuts);
};

(async () => {
    browser = await puppeteer.launch();
    await runProvoBakery();
    browser.close();
})();

async function getPage(url) {
    let page = await browser.newPage();
    await page.goto(url);
    return page;
}

const runProvoBakery = async () => {
    const page = await getPage(`https://www.theprovobakery.com/temporary-menu`);
    const content = await page.content();
    const dom = new JSDOM(content);
    const domain = 'https://www.theprovobakery.com';
    const donuts = Array.from(
        dom.window.document.querySelectorAll('.product-block:not(.clear)'),
    ).map((node: any) => {
        let donut: any = {};
        donut.title = node.querySelector('.product-title').innerHTML;
        let url = node.querySelector(`.product-title`).getAttribute('href');
        donut.url = `${domain}${url}`;
        console.log('donut-title', donut.title);
        donut.img = node.querySelector('.image-container img')
            ? domain +
              node.querySelector('.image-container img').getAttribute('src')
            : null;
        donut.imgAlt = node.querySelector('.image-container img')
            ? node.querySelector('.image-container img').getAttribute('alt')
            : null;
        donut.id = url.split('/').pop();
        return donut;
    });
    for (let i = 0; i < donuts.length; i++) {
        let donut = donuts[i];
        console.log('Visiting', donut.url);
        await page.goto(donut.url);
        const content = await page.content();
        const dom = new JSDOM(content);
        donut.description = dom.window.document.querySelector(
            '.product-excerpt',
        )
            ? dom.window.document
                  .querySelector('.product-excerpt')
                  .innerHTML.split(/\<[^>]*\>/g)
                  .join('')
            : '';
        donut.price = dom.window.document.querySelector(
            '.sqs-money-native',
        ).innerText;
    }
    if (!pathExistsSync(join(__dirname, 'data'))) {
        fx.mkdir(join(__dirname, 'data'));
    }
    // fx.removeSync(join(__dirname, './data/types.json'));
    fx.removeSync(join(__dirname, './data/donuts.json'));
    // fx.writeJsonSync(join(__dirname, './data/types.json'), types);
    fx.writeJsonSync(join(__dirname, './data/donuts.json'), donuts);
};
