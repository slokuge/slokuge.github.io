const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

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

const add_phone_numbers = async (page) => {
    const selector = '#basic-info';
    await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        let telephone_node_html = "<div class='column has-text-centered'>\
                                        <span class='icon'><i class='fas fa-phone'></i></span>\
                                        <p>+33 7 69 36 13 11</p>\
                                    </div>";
        const template = document.createElement('template');
        telephone_node_html = telephone_node_html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = telephone_node_html;
        const telephone_node = template.content.firstChild;
        element.appendChild(telephone_node);
    }, selector);
}

const generate_cv = async (file, browser) => {
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, file.html)}`);
    await page.waitForTimeout(500);
    await add_phone_numbers(page);
    await delete_excess('.to-delete', page);
    await page.pdf({ path: file.output, format: 'A4', scale: 0.6, margin: { top: '1.5cm', bottom: '1.5cm', left: '0.75cm', right: '0.75cm'} });
}

const delete_existing_pdf = () => {
    files.forEach(file => {
        try {
            fs.unlinkSync(file.output);
        } catch (error) {
            console.log(error);
        }
    });
}

delete_existing_pdf();
generate();