const { promises: fs } = require("fs");
const path = require("path");
const decompress = require("decompress");

const { localApp, remoteApp } = require("./version.json");


const currentDir = __dirname;
const versionFile = path.join(currentDir, "version.json");
const appSource = path.relative(currentDir, "appSource");
const releaseURL = "https://github.com/gchq/CyberChef/releases";

module.exports.updater = async () => {
    if (await isOutdated()) {
        try {
            console.log("App is outdated, dowloading latest CyberrChef");

            const response = await fetch(`${releaseURL}/download/${remoteApp}/CyberChef_${remoteApp}.zip`);
            const arrayBuffer = await response.arrayBuffer();

            await decompress(arrayBufferToBuffer(arrayBuffer), appSource);

            console.log("CyberChef downloaded and extracted successfully");

            const data = await fs.readFile(versionFile, "utf8");
            const jsonData = JSON.parse(data);

            jsonData.localApp = remoteApp;

            try {
                await fs.writeFile(versionFile, JSON.stringify(jsonData, null, 4), "utf8");
                console.log("Version updated, latest version: " + remoteApp);
                return remoteApp;
            } catch (error) {
                console.error("Error writing version:", error);
                return;
            }
        } catch (error) {
            console.error("Error reading version:", error);
            return;
        }
    }
    else {
        console.log("App up to date, current version: " + localApp);
        return remoteApp;
    }
};

async function isOutdated() {
    try {
        const response = await fetch(releaseURL + "/latest", { redirect: "follow" });
        const remoteAppVersion = response.url.replace(releaseURL + "/tag/", "");

        const data = await fs.readFile(versionFile, "utf8");
        const jsonData = JSON.parse(data);

        jsonData.localApp = await haveRequiredFiles() ? localApp : "";
        jsonData.remoteApp = remoteAppVersion;

        try {
            await fs.writeFile(versionFile, JSON.stringify(jsonData, null, 4), "utf8");
            console.log(`Latest version: ${remoteAppVersion}`);
        } catch (error) {
            console.error("Error writing version:", error);
            return;
        }

        return remoteAppVersion !== jsonData.localApp;
    } catch (error) {
        console.error("Error reading version:", error);
        return;
    }
}

async function haveRequiredFiles() {
    try {
        const fileList = await fs.readdir(appSource);
        return fileList.some((fileName) => /^CyberChef_[\d.]+\.html$/.test(fileName));
    } catch (error) {
        console.log(error);
        return false;
    }
}

function arrayBufferToBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}