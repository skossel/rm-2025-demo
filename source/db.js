const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

// Stelle sicher, dass der data-Ordner existiert
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

function getAnalysisFilePath(analysisId) {
    return path.join(dataDir, `${analysisId}.json`);
}

function getAllAnalyses() {
    const files = fs.readdirSync(dataDir);
    const analyses = files.filter(file => file.endsWith('.json')).map(file => {
        const content = fs.readFileSync(path.join(dataDir, file));
        try {
            return JSON.parse(content);
        } catch (e) {
            console.error('Error parsing file:', file, e);
            return null;
        }
    }).filter(a => a !== null);
    return analyses;
}

function saveAnalysis(analysis) {
    if (!analysis.id) {
        analysis.id = Date.now().toString();
    }
    const filePath = getAnalysisFilePath(analysis.id);
    fs.writeFileSync(filePath, JSON.stringify(analysis, null, 2));
    return analysis;
}

function deleteAnalysis(analysisId) {
    const filePath = getAnalysisFilePath(analysisId);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
    }
    return false;
}

function getAnalysis(analysisId) {
    const filePath = getAnalysisFilePath(analysisId);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        return JSON.parse(content);
    }
    return null;
}

module.exports = {
    getAllAnalyses,
    saveAnalysis,
    deleteAnalysis,
    getAnalysis
};
