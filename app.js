const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/screenshot', async (req, res) => {
    let url = req.query.url;
    let width = parseInt(req.query.width) || 1920; // デフォルトの横幅を1920pxに変更

    if (!url) {
        return res.status(400).send({
            error: 'URL is required'
        });
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
            width: width,
            height: 0
        }); // 高さは不要なので0に設定
        await page.goto(url, {
            waitUntil: 'networkidle2'
        });
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await new Promise(r => setTimeout(r, 2000));
        const screenshot = await page.screenshot({
            fullPage: true
        });

        await browser.close();

        res.set('Content-Type', 'image/png');
        res.send(screenshot);
    } catch (error) {
        res.status(500).send({
            error: error.toString()
        });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});