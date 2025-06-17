// Datos locales para edición
let categoriesConfig = {};
let componentsData = {};
let currentEditingCategory = null;
let currentEditingComponent = null;

// Inicializar editor
function init() {
    console.log('🚀 Iniciando Editor de Configuración...');
    loadFromStorage();
    renderCategories();
    renderComponents();
    setupStatSliders();
    console.log('✅ Editor inicializado');
}

// Cargar datos desde localStorage
function loadFromStorage() {
    try {
        const savedCategories = localStorage.getItem('catalinas_categories_config');
        const savedComponents = localStorage.getItem('catalinas_components_data');
        
        if (savedCategories) {
            categoriesConfig = JSON.parse(savedCategories);
        } else {
            // Datos por defecto
            categoriesConfig = {
                "erp": { name: "ERP / Contabilidad", emoji: "💼", placeholder: "Arrastra aquí tu ERP" },
                "pms": { name: "PMS", emoji: "🏨", placeholder: "Property Management" },
                "crm": { name: "CRM", emoji: "👥", placeholder: "Gestión de Clientes" },
                "field": { name: "Field Service", emoji: "🔧", placeholder: "Órdenes de Trabajo" },
                "hr": { name: "RRHH", emoji: "👨‍💼", placeholder: "Recursos Humanos" },
                "bi": { name: "BI / Analytics", emoji: "📊", placeholder: "Business Intelligence" }
            };
        }
        
        if (savedComponents) {
            componentsData = JSON.parse(savedComponents);
        } else {
            // Datos por defecto básicos
            componentsData = {};
        }
        
        console.log('✅ Datos cargados desde localStorage');
    } catch (e) {
        console.warn('⚠️ Error cargando datos:', e.message);
        showMessage('Error cargando datos guardados', 'error');
    }
}

// Renderizar categorías
function renderCategories() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    
    if (Object.keys(categoriesConfig).length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No hay categorías</h3>
                <p>Agrega una nueva categoría para comenzar</p>
            </div>
        `;
        return;
    }
    
    Object.keys(categoriesConfig).forEach(key => {
        const category = categoriesConfig[key];
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${category.emoji} ${category.name}</div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="editCategory('${key}')">✏️</button>
                    <button class="btn btn-danger" onclick="deleteCategory('${key}')">🗑️</button>
                </div>
            </div>
            <div class="card-body">
                <div><strong>Clave:</strong> ${key}</div>
                <div><strong>Placeholder:</strong> ${category.placeholder}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Renderizar componentes
function renderComponents() {
    const container = document.getElementById('components-container');
    container.innerHTML = '';
    
    if (Object.keys(componentsData).length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No hay componentes</h3>
                <p>Agrega un nuevo componente para comenzar</p>
            </div>
        `;
        return;
    }
    
    Object.keys(componentsData).forEach(key => {
        const component = componentsData[key];
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${component.name}</div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="editComponent('${key}')">✏️</button>
                    <button class="btn btn-danger" onclick="deleteComponent('${key}')">🗑️</button>
                </div>
            </div>
            <div class="card-body">
                <div><strong>Clave:</strong> ${key}</div>
                <div><strong>Cubre:</strong> ${component.covers ? component.covers.join(', ') : 'N/A'}</div>
                <div class="card-meta">
                    <span><strong>Mensual:</strong> $${component.pricing ? component.pricing.monthly_license.toLocaleString() : 'N/A'}</span>
                    <span><strong>Anual:</strong> $${component.pricing ? component.pricing.annual_license.toLocaleString() : 'N/A'}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// === FUNCIONES DE CATEGORÍAS ===

function addCategory() {
    currentEditingCategory = null;
    document.getElementById('category-modal-title').textContent = 'Agregar Categoría';
    document.getElementById('category-key').value = '';
    document.getElementById('category-name').value = '';
    document.getElementById('category-emoji').value = '';
    document.getElementById('category-placeholder').value = '';
    document.getElementById('category-modal').style.display = 'block';
}

function editCategory(key) {
    currentEditingCategory = key;
    const category = categoriesConfig[key];
    document.getElementById('category-modal-title').textContent = 'Editar Categoría';
    document.getElementById('category-key').value = key;
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-emoji').value = category.emoji;
    document.getElementById('category-placeholder').value = category.placeholder;
    document.getElementById('category-modal').style.display = 'block';
}

function saveCategoryModal() {
    const key = document.getElementById('category-key').value.trim();
    const name = document.getElementById('category-name').value.trim();
    const emoji = document.getElementById('category-emoji').value.trim();
    const placeholder = document.getElementById('category-placeholder').value.trim();
    
    if (!key || !name) {
        alert('La clave y el nombre son obligatorios');
        return;
    }
    
    // Si estamos editando y cambió la clave, eliminar la anterior
    if (currentEditingCategory && currentEditingCategory !== key) {
        delete categoriesConfig[currentEditingCategory];
    }
    
    categoriesConfig[key] = {
        name: name,
        emoji: emoji,
        placeholder: placeholder
    };
    
    closeCategoryModal();
    renderCategories();
    showMessage('Categoría guardada correctamente', 'success');
}

function deleteCategory(key) {
    if (confirm(`¿Estás seguro de eliminar la categoría "${categoriesConfig[key].name}"?`)) {
        delete categoriesConfig[key];
        renderCategories();
        showMessage('Categoría eliminada', 'success');
    }
}

function closeCategoryModal() {
    document.getElementById('category-modal').style.display = 'none';
    currentEditingCategory = null;
}

// === FUNCIONES DE COMPONENTES ===

function addComponent() {
    currentEditingComponent = null;
    document.getElementById('component-modal-title').textContent = 'Agregar Componente';
    clearComponentForm();
    updateCategoryCheckboxes();
    document.getElementById('component-modal').style.display = 'block';
}

function editComponent(key) {
    currentEditingComponent = key;
    const component = componentsData[key];
    document.getElementById('component-modal-title').textContent = 'Editar Componente';
    
    // Llenar formulario
    document.getElementById('component-key').value = key;
    document.getElementById('component-name').value = component.name || '';
    
    // Precios
    if (component.pricing) {
        document.getElementById('monthly-license').value = component.pricing.monthly_license || '';
        document.getElementById('annual-license').value = component.pricing.annual_license || '';
        document.getElementById('implementation').value = component.pricing.implementation || '';
        document.getElementById('migration').value = component.pricing.migration || '';
        document.getElementById('training').value = component.pricing.training || '';
    }
    
    // Stats
    if (component.stats) {
        Object.keys(component.stats).forEach(stat => {
            const slider = document.getElementById(`stat-${stat.replace('_', '-')}`);
            if (slider) {
                slider.value = component.stats[stat];
                updateStatValue(slider);
            }
        });
    }
    
    // Pros y contras
    document.getElementById('component-pros').value = component.pros ? component.pros.join(', ') : '';
    document.getElementById('component-cons').value = component.cons ? component.cons.join(', ') : '';
    
    updateCategoryCheckboxes(component.covers);
    document.getElementById('component-modal').style.display = 'block';
}

function clearComponentForm() {
    document.getElementById('component-key').value = '';
    document.getElementById('component-name').value = '';
    document.getElementById('monthly-license').value = '';
    document.getElementById('annual-license').value = '';
    document.getElementById('implementation').value = '';
    document.getElementById('migration').value = '';
    document.getElementById('training').value = '';
    document.getElementById('component-pros').value = '';
    document.getElementById('component-cons').value = '';
    
    // Reset stats sliders
    document.querySelectorAll('.stat-item input[type="range"]').forEach(slider => {
        slider.value = 5;
        updateStatValue(slider);
    });
}

function updateCategoryCheckboxes(selectedCategories = []) {
    const container = document.getElementById('component-covers');
    container.innerHTML = '';
    
    Object.keys(categoriesConfig).forEach(key => {
        const category = categoriesConfig[key];
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `
            <input type="checkbox" id="covers-${key}" value="${key}" ${selectedCategories.includes(key) ? 'checked' : ''}>
            <label for="covers-${key}">${category.emoji} ${category.name}</label>
        `;
        container.appendChild(div);
    });
}

function saveComponentModal() {
    const key = document.getElementById('component-key').value.trim();
    const name = document.getElementById('component-name').value.trim();
    
    if (!key || !name) {
        alert('La clave y el nombre son obligatorios');
        return;
    }
    
    // Recopilar categorías seleccionadas
    const covers = [];
    document.querySelectorAll('#component-covers input[type="checkbox"]:checked').forEach(checkbox => {
        covers.push(checkbox.value);
    });
    
    // Recopilar precios
    const pricing = {
        monthly_license: parseInt(document.getElementById('monthly-license').value) || 0,
        annual_license: parseInt(document.getElementById('annual-license').value) || 0,
        implementation: parseInt(document.getElementById('implementation').value) || 0,
        migration: parseInt(document.getElementById('migration').value) || 0,
        training: parseInt(document.getElementById('training').value) || 0
    };
    
    // Recopilar stats
    const stats = {
        customization: parseInt(document.getElementById('stat-customization').value),
        cost_efficiency: parseInt(document.getElementById('stat-cost-efficiency').value),
        productivity: parseInt(document.getElementById('stat-productivity').value),
        ai_ready: parseInt(document.getElementById('stat-ai-ready').value),
        analytics: parseInt(document.getElementById('stat-analytics').value),
        automation: parseInt(document.getElementById('stat-automation').value),
        implementation_ease: parseInt(document.getElementById('stat-implementation-ease').value),
        market_reliability: parseInt(document.getElementById('stat-market-reliability').value),
        support_quality: parseInt(document.getElementById('stat-support-quality').value),
        integration: parseInt(document.getElementById('stat-integration').value)
    };
    
    // Recopilar pros y contras
    const prosText = document.getElementById('component-pros').value.trim();
    const consText = document.getElementById('component-cons').value.trim();
    const pros = prosText ? prosText.split(',').map(p => p.trim()).filter(p => p) : [];
    const cons = consText ? consText.split(',').map(c => c.trim()).filter(c => c) : [];
    
    // Si estamos editando y cambió la clave, eliminar la anterior
    if (currentEditingComponent && currentEditingComponent !== key) {
        delete componentsData[currentEditingComponent];
    }
    
    componentsData[key] = {
        name: name,
        covers: covers,
        pricing: pricing,
        stats: stats,
        pros: pros,
        cons: cons
    };
    
    closeComponentModal();
    renderComponents();
    showMessage('Componente guardado correctamente', 'success');
}

function deleteComponent(key) {
    if (confirm(`¿Estás seguro de eliminar el componente "${componentsData[key].name}"?`)) {
        delete componentsData[key];
        renderComponents();
        showMessage('Componente eliminado', 'success');
    }
}

function closeComponentModal() {
    document.getElementById('component-modal').style.display = 'none';
    currentEditingComponent = null;
}

// === FUNCIONES DE STATS SLIDERS ===

function setupStatSliders() {
    document.querySelectorAll('.stat-item input[type="range"]').forEach(slider => {
        slider.addEventListener('input', function() {
            updateStatValue(this);
        });
    });
}

function updateStatValue(slider) {
    const valueSpan = slider.parentElement.querySelector('.stat-value');
    valueSpan.textContent = slider.value;
}

// === FUNCIONES DE IMPORT/EXPORT ===

function importCategories() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.js';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                let content = event.target.result;
                if (file.name.endsWith('.js')) {
                    const match = content.match(/let categoriesConfig\s*=\s*(\{[\s\S]*?\});/);
                    if (match) content = match[1];
                }
                
                categoriesConfig = JSON.parse(content);
                renderCategories();
                showMessage('Categorías importadas correctamente', 'success');
            } catch (e) {
                showMessage('Error al importar categorías: ' + e.message, 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportCategories() {
    const dataStr = JSON.stringify(categoriesConfig, null, 2);
    const blob = new Blob([`let categoriesConfig = ${dataStr};`], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categoriesConfig.js';
    a.click();
    URL.revokeObjectURL(url);
    showMessage('Categorías exportadas', 'success');
}

function importComponents() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.js';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                let content = event.target.result;
                if (file.name.endsWith('.js')) {
                    const match = content.match(/let componentsData\s*=\s*(\{[\s\S]*?\});/);
                    if (match) content = match[1];
                }
                
                componentsData = JSON.parse(content);
                renderComponents();
                showMessage('Componentes importados correctamente', 'success');
            } catch (e) {
                showMessage('Error al importar componentes: ' + e.message, 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportComponents() {
    const dataStr = JSON.stringify(componentsData, null, 2);
    const blob = new Blob([`let componentsData = ${dataStr};`], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'componentsData.js';
    a.click();
    URL.revokeObjectURL(url);
    showMessage('Componentes exportados', 'success');
}

// === FUNCIONES GENERALES ===

function saveAll() {
    try {
        localStorage.setItem('catalinas_categories_config', JSON.stringify(categoriesConfig));
        localStorage.setItem('catalinas_components_data', JSON.stringify(componentsData));
        showMessage('Todos los datos guardados correctamente', 'success');
    } catch (e) {
        showMessage('Error al guardar: ' + e.message, 'error');
    }
}

function showMessage(text, type) {
    const existing = document.querySelector('.message');
    if (existing) existing.remove();
    
    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.textContent = text;
    
    document.querySelector('.container').insertBefore(message, document.querySelector('.main-content'));
    
    setTimeout(() => {
        message.remove();
    }, 4000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', init);

// Cerrar modales al hacer click fuera
window.addEventListener('click', function(event) {
    const categoryModal = document.getElementById('category-modal');
    const componentModal = document.getElementById('component-modal');
    
    if (event.target === categoryModal) {
        closeCategoryModal();
    }
    if (event.target === componentModal) {
        closeComponentModal();
    }
});