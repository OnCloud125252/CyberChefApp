const { app, BrowserWindow } = require("electron");
const path = require("path");

// const { localApp: localAppVersion } = require("./version.json");
const { updater } = require("./updater.js");
const { mainWindow } = require("./main.js");


const currentDir = __dirname;
const loaderType = "cyberchef";

app.whenReady().then(async () => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

async function createWindow() {
    const loadingWindow = new BrowserWindow({
        frame: false,
        width: 300,
        height: 400,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(currentDir, "preload.js")
        }
    });

    loadingWindow.loadFile(path.join(currentDir, "components", "loader", `${loaderType}.html`));

    loadingWindow.once("ready-to-show", async () => {
        const localAppVersion = await updater();
        await delay(500);
        mainWindow(loadingWindow, localAppVersion);
    });
}

function delay(time) {
    // eslint-disable-next-line no-undef
    return new Promise(resolve => setTimeout(resolve, time));
}