const { BrowserWindow } = require("electron");
const path = require("path");


const currentDir = __dirname;

module.exports.mainWindow = (loadingWindow, CyberChefVersion) => {
    const mainWindow = new BrowserWindow({
        width: 1300,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(currentDir, "preload.js")
        },
        show: false
    });

    mainWindow.loadFile(path.join(currentDir, "appSource", `CyberChef_${CyberChefVersion}.html`));

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
        loadingWindow.close();
    });
};