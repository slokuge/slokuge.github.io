const puppeteer = require('puppeteer');
const path = require('path');

const files = [
    { html: "resume/index.html", output: "./src/documents/cv-sadsitha-lokuge.pdf" },
    { html: "resume-fr/index.html", output: "./src/documents/cv-sadsitha-lokuge-fr.pdf" }
]

const generate = async () => {
    const browser = await puppeteer.launch();
    try {
        for (let i = 0; i < files.length; ++i) {
            await generate_cv(files[i], browser);
        }
    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
    }
}

const delete_excess = async (selector, page) => {
    await page.evaluate((sel) => {
        let elements = document.querySelectorAll(sel);
        for (let i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }, selector);
}

const generate_cv = async (file, browser) => {
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, file.html)}`);
    await page.waitForTimeout(500);
    await delete_excess('.to-delete', page);
    await page.pdf({ path: file.output, format: 'A4', scale: 0.6, margin: { top: '1.5cm', bottom: '1.5cm', left: '0.75cm', right: '0.75cm'} });
}

generate();