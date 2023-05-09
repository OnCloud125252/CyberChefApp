const { promises: fs } = require("fs");
const path = require("path");
const { load } = require("cheerio");


const currentDir = __dirname;

module.exports.injectHtml = async (CyberChefVersion) => {
    const htmlDir = path.join(currentDir, "appSource", `CyberChef_${CyberChefVersion}.html`);

    try {
        const html = await fs.readFile(htmlDir, "utf-8");
        const $ = load(html);

        $("#banner > div:nth-child(1) > a").remove();

        await fs.writeFile(htmlDir, $.html());
        console.log("Successfully injected html");
    } catch (error) {
        console.log("Failed to inject html");
        console.error(error);
    }
};