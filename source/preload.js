const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getAnalyses: () => ipcRenderer.invoke('get-analyses'),
    saveAnalysis: (analysis) => ipcRenderer.invoke('save-analysis', analysis),
    deleteAnalysis: (analysisId) => ipcRenderer.invoke('delete-analysis', analysisId),
    getAnalysis: (analysisId) => ipcRenderer.invoke('get-analysis', analysisId),
    openAnalysis: (analysisId) => ipcRenderer.invoke('open-analysis', analysisId)
});
