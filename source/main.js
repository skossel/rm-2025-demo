const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db');

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 600,
        minHeight: 400,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    mainWindow.loadFile('source/index.html');
}

function createAnalysisWindow(analysisId) {
    const analysisWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    // Übergibt die Analyse-ID als Query-Parameter
    analysisWindow.loadFile('source/analysisWindow.html', { query: { id: analysisId } });
}

app.whenReady().then(() => {
    createMainWindow();

    ipcMain.handle('open-analysis', (event, analysisId) => {
        createAnalysisWindow(analysisId);
    });

    ipcMain.handle('get-analyses', async () => {
        return db.getAllAnalyses();
    });

    ipcMain.handle('save-analysis', async (event, analysis) => {
        return db.saveAnalysis(analysis);
    });

    ipcMain.handle('delete-analysis', async (event, analysisId) => {
        return db.deleteAnalysis(analysisId);
    });

    ipcMain.handle('get-analysis', async (event, analysisId) => {
        return db.getAnalysis(analysisId);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
