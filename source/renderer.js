document.addEventListener('DOMContentLoaded', () => {
    const analysisList = document.getElementById('analysisList');
    const newAnalysisBtn = document.getElementById('newAnalysisBtn');
    const modal = document.getElementById('modal');
    const analysisTitleInput = document.getElementById('analysisTitle');
    const saveAnalysisBtn = document.getElementById('saveAnalysisBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    function loadAnalyses() {
        window.api.getAnalyses().then(analyses => {
            analysisList.innerHTML = '';
            analyses.forEach(analysis => {
                const li = document.createElement('li');
                li.textContent = analysis.title;
                li.addEventListener('click', () => {
                    window.api.openAnalysis(analysis.id);
                });
                // Löschen-Button hinzufügen
                const delBtn = document.createElement('button');
                delBtn.textContent = 'Löschen';
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm('Möchten Sie diese Analyse wirklich löschen?')) {
                        window.api.deleteAnalysis(analysis.id).then(() => {
                            loadAnalyses();
                        });
                    }
                });
                li.appendChild(delBtn);
                analysisList.appendChild(li);
            });
        });
    }

    newAnalysisBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    saveAnalysisBtn.addEventListener('click', () => {
        const title = analysisTitleInput.value.trim();
        if (title) {
            const analysis = {
                title: title,
                variants: [],
                criteria: [],
                ratings: {},
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            };
            window.api.saveAnalysis(analysis).then(() => {
                analysisTitleInput.value = '';
                modal.style.display = 'none';
                loadAnalyses();
            });
        } else {
            alert('Bitte geben Sie einen Titel ein.');
        }
    });

    loadAnalyses();
});
