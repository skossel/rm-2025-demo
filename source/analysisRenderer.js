function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

document.addEventListener('DOMContentLoaded', () => {
    const analysisId = getQueryParam('id');
    let analysisData;

    const analysisTitleElem = document.getElementById('analysisTitle');
    const analysisContainer = document.getElementById('analysisContainer');
    const addVariantBtn = document.getElementById('addVariantBtn');
    const addCriterionBtn = document.getElementById('addCriterionBtn');

    const variantModal = document.getElementById('variantModal');
    const variantNameInput = document.getElementById('variantName');
    const saveVariantBtn = document.getElementById('saveVariantBtn');
    const cancelVariantBtn = document.getElementById('cancelVariantBtn');

    const criterionModal = document.getElementById('criterionModal');
    const criterionNameInput = document.getElementById('criterionName');
    const criterionTypeSelect = document.getElementById('criterionType');
    const criterionWeightInput = document.getElementById('criterionWeight');
    const saveCriterionBtn = document.getElementById('saveCriterionBtn');
    const cancelCriterionBtn = document.getElementById('cancelCriterionBtn');

    function loadAnalysis() {
        window.api.getAnalysis(analysisId).then(data => {
            if (data) {
                analysisData = data;
                analysisTitleElem.textContent = analysisData.title;
                renderAnalysisTable();
            } else {
                alert('Analyse nicht gefunden.');
            }
        });
    }

    function renderAnalysisTable() {
        analysisContainer.innerHTML = '';
        const table = document.createElement('table');

        // Kopfzeile: Leere Zelle + Varianten-Namen
        const headerRow = document.createElement('tr');
        const emptyCell = document.createElement('th');
        emptyCell.textContent = '';
        headerRow.appendChild(emptyCell);
        analysisData.variants.forEach(variant => {
            const th = document.createElement('th');
            th.classList.add('variant-header');
            th.textContent = variant.name;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Zeilen für jedes Kriterium
        analysisData.criteria.forEach(criterion => {
            const row = document.createElement('tr');
            const criterionCell = document.createElement('td');
            criterionCell.classList.add('criteria-column');
            criterionCell.textContent = `${criterion.name} (${criterion.type})`;
            row.appendChild(criterionCell);

            analysisData.variants.forEach(variant => {
                const cell = document.createElement('td');
                const rating = (analysisData.ratings &&
                    analysisData.ratings[variant.id] &&
                    analysisData.ratings[variant.id][criterion.id]) || '-';
                cell.textContent = rating;
                row.appendChild(cell);
            });
            table.appendChild(row);
        });

        // Totale Zeile
        const totalRow = document.createElement('tr');
        const totalLabel = document.createElement('td');
        totalLabel.textContent = 'Total';
        totalRow.appendChild(totalLabel);

        analysisData.variants.forEach(variant => {
            let total = 0;
            analysisData.criteria.forEach(criterion => {
                const rating = parseFloat((analysisData.ratings &&
                    analysisData.ratings[variant.id] &&
                    analysisData.ratings[variant.id][criterion.id]) || 0);
                total += rating;
            });
            const cell = document.createElement('td');
            cell.textContent = `${total.toFixed(1)}%`;
            totalRow.appendChild(cell);
        });
        table.appendChild(totalRow);

        analysisContainer.appendChild(table);
    }

    addVariantBtn.addEventListener('click', () => {
        variantModal.style.display = 'block';
    });

    cancelVariantBtn.addEventListener('click', () => {
        variantModal.style.display = 'none';
    });

    saveVariantBtn.addEventListener('click', () => {
        const name = variantNameInput.value.trim();
        if (name) {
            const newVariant = { id: Date.now().toString(), name: name };
            analysisData.variants.push(newVariant);
            analysisData.ratings[newVariant.id] = {};
            analysisData.modified = new Date().toISOString();
            window.api.saveAnalysis(analysisData).then(() => {
                variantNameInput.value = '';
                variantModal.style.display = 'none';
                renderAnalysisTable();
            });
        } else {
            alert('Bitte geben Sie einen Namen für die Variante ein.');
        }
    });

    addCriterionBtn.addEventListener('click', () => {
        criterionModal.style.display = 'block';
    });

    cancelCriterionBtn.addEventListener('click', () => {
        criterionModal.style.display = 'none';
    });

    saveCriterionBtn.addEventListener('click', () => {
        const name = criterionNameInput.value.trim();
        const type = criterionTypeSelect.value;
        const weight = parseFloat(criterionWeightInput.value);
        if (name && !isNaN(weight)) {
            if (analysisData.criteria.some(c => c.name === name)) {
                alert('Dieses Kriterium existiert bereits.');
                return;
            }
            const newCriterion = { id: Date.now().toString(), name: name, type: type, weight: weight };
            analysisData.criteria.push(newCriterion);
            analysisData.variants.forEach(variant => {
                if (!analysisData.ratings[variant.id]) {
                    analysisData.ratings[variant.id] = {};
                }
                analysisData.ratings[variant.id][newCriterion.id] = 0;
            });
            analysisData.modified = new Date().toISOString();
            window.api.saveAnalysis(analysisData).then(() => {
                criterionNameInput.value = '';
                criterionWeightInput.value = '';
                criterionModal.style.display = 'none';
                renderAnalysisTable();
            });
        } else {
            alert('Bitte füllen Sie alle Felder aus.');
        }
    });

    loadAnalysis();
});
