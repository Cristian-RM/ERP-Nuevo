const STORAGE_KEYS = {
    COMPONENTS: 'catalinas_components_data',
    CATEGORIES: 'catalinas_categories_config'
};
// Configuración de categorías (JSON editable)
let categoriesConfig = {
    "erp": {
        name: "ERP / Contabilidad",
        emoji: "💼",
        placeholder: "Arrastra aquí tu ERP"
    },
    "pms": {
        name: "PMS",
        emoji: "🏨",
        placeholder: "Property Management"
    },
    "crm": {
        name: "CRM",
        emoji: "👥",
        placeholder: "Gestión de Clientes"
    },
    "field": {
        name: "Field Service",
        emoji: "🔧",
        placeholder: "Órdenes de Trabajo"
    },
    "hr": {
        name: "RRHH",
        emoji: "👨‍💼",
        placeholder: "Recursos Humanos"
    },
    "bi": {
        name: "BI / Analytics",
        emoji: "📊",
        placeholder: "Business Intelligence"
    }
};

// Datos de componentes (JSON editable)
let componentsData = {
    "odoo": {
        name: "Odoo",
        covers: ["erp", "field", "bi"],
        pricing: {
            monthly_license: 2500,
            annual_license: 30000,
            implementation: 15000,
            migration: 8000,
            training: 5000
        },
        stats: {
            integration: 9,
            usability: 7,
            scalability: 8,
            support: 6,
            customization: 9,
            learning_curve: 4
        },
        pros: ["Altamente integrado", "Open source", "Modular"],
        cons: ["Curva de aprendizaje", "Requiere personalización"]
    },
    "hubspot": {
        name: "HubSpot",
        covers: ["crm"],
        pricing: {
            monthly_license: 1400,
            annual_license: 17000,
            implementation: 5000,
            migration: 3000,
            training: 2000
        },
        stats: {
            integration: 8,
            usability: 9,
            scalability: 7,
            support: 8,
            customization: 6,
            learning_curve: 8
        },
        pros: ["Fácil de usar", "Excelente marketing", "Integraciones"],
        cons: ["Costoso en niveles altos", "Limitado en personalización"]
    },
    "dynamics": {
        name: "Microsoft Dynamics 365",
        covers: ["field", "crm"],
        pricing: {
            monthly_license: 5800,
            annual_license: 70000,
            implementation: 25000,
            migration: 15000,
            training: 10000
        },
        stats: {
            integration: 8,
            usability: 6,
            scalability: 9,
            support: 8,
            customization: 10,
            learning_curve: 3
        },
        pros: ["Altamente personalizable", "Integración Microsoft", "Robusto"],
        cons: ["Complejo", "Costoso", "Curva de aprendizaje alta"]
    },
    "mews": {
        name: "Mews PMS",
        covers: ["pms"],
        pricing: {
            monthly_license: 800,
            annual_license: 9600,
            implementation: 8000,
            migration: 12000,
            training: 4000
        },
        stats: {
            integration: 8,
            usability: 9,
            scalability: 7,
            support: 7,
            customization: 5,
            learning_curve: 7
        },
        pros: ["Moderno", "API robusta", "Fácil uso"],
        cons: ["Joven en el mercado", "Limitado en personalización"]
    },
    "bamboohr": {
        name: "BambooHR",
        covers: ["hr"],
        pricing: {
            monthly_license: 600,
            annual_license: 7200,
            implementation: 3000,
            migration: 2000,
            training: 1500
        },
        stats: {
            integration: 6,
            usability: 9,
            scalability: 6,
            support: 8,
            customization: 5,
            learning_curve: 9
        },
        pros: ["Muy fácil de usar", "Interfaz moderna", "Buen soporte"],
        cons: ["Limitado para empresas grandes", "Pocas integraciones"]
    },
    "powerbi": {
        name: "Power BI",
        covers: ["bi"],
        pricing: {
            monthly_license: 300,
            annual_license: 3600,
            implementation: 5000,
            migration: 2000,
            training: 3000
        },
        stats: {
            integration: 9,
            usability: 7,
            scalability: 8,
            support: 7,
            customization: 8,
            learning_curve: 6
        },
        pros: ["Integración Microsoft", "Potente", "Costo razonable"],
        cons: ["Requiere conocimiento técnico", "Limitado fuera de Microsoft"]
    }
};

let currentStack = {};

// Inicializar la aplicación
function init() {
    console.log('🚀 Iniciando Stack Builder...');
    loadFromStorage(); // ← Nueva línea
    renderCategories();
    renderComponents();
    updateCosts();
    console.log('✅ Stack Builder inicializado');
}

function renderCategories() {
    const container = document.getElementById('stack-builder');
    if (!container) {
        console.error('❌ No se encontró el contenedor stack-builder');
        return;
    }
    
    container.innerHTML = '';

    Object.keys(categoriesConfig).forEach(categoryKey => {
        const category = categoriesConfig[categoryKey];
        const div = document.createElement('div');
        div.className = 'stack-slot';
        div.dataset.category = categoryKey;

        div.innerHTML = `
            <div class="slot-label">${category.emoji} ${category.name}</div>
            <div class="slot-content">${category.placeholder}</div>
        `;

        // Agregar event listeners
        div.addEventListener('dragover', handleDragOver);
        div.addEventListener('drop', handleDrop);
        div.addEventListener('dragleave', handleDragLeave);

        container.appendChild(div);
    });

    console.log(`✅ ${Object.keys(categoriesConfig).length} categorías renderizadas`);
}
// Renderizar componentes disponibles
function renderComponents() {
    const container = document.getElementById('components-list');
    if (!container) {
        console.error('❌ No se encontró el contenedor components-list');
        return;
    }
    
    container.innerHTML = '';

    Object.keys(componentsData).forEach(key => {
        const component = componentsData[key];
        const div = document.createElement('div');
        div.className = 'component-item';
        div.draggable = true;
        div.dataset.component = key;

        div.innerHTML = `
            <div class="component-name">${component.name}</div>
            <div class="component-covers">Cubre: ${component.covers.map(c => getCategoryName(c)).join(', ')}</div>
            <div class="component-price">$${component.pricing.monthly_license.toLocaleString()}/mes</div>
        `;

        // Agregar event listeners directamente al crear el elemento
        div.addEventListener('dragstart', handleDragStart);
        div.addEventListener('dragend', handleDragEnd);

        container.appendChild(div);
    });

    // Configurar slots después de renderizar componentes
    setupSlots();
    console.log(`✅ ${Object.keys(componentsData).length} componentes renderizados`);
}

// Configurar slots (separado de componentes)
function setupSlots() {
    const slots = document.querySelectorAll('.stack-slot');
    
    slots.forEach(slot => {
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('drop', handleDrop);
        slot.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.component);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const componentKey = e.dataTransfer.getData('text/plain');
    const component = componentsData[componentKey];
    const targetCategory = e.currentTarget.dataset.category;

    if (component.covers.includes(targetCategory)) {
        addComponentToStack(componentKey, targetCategory);
    } else {
        alert(`${component.name} no cubre la categoría ${getCategoryName(targetCategory)}`);
    }
}

function addComponentToStack(componentKey, targetCategory) {
    const component = componentsData[componentKey];

    // Si el componente cubre múltiples categorías, agregarlo a todas
    component.covers.forEach(category => {
        if (currentStack[category]) {
            removeFromSlot(category);
        }
        currentStack[category] = componentKey;
        updateSlot(category, component);
    });

    updateCosts();
    updateRadarChart();
}

function updateSlot(category, component) {
    const slot = document.querySelector(`[data-category="${category}"]`);
    if (!slot) return;
    
    const originalLabel = slot.querySelector('.slot-label').textContent;
    slot.classList.add('filled');
    slot.innerHTML = `
        <div class="slot-label">${originalLabel}</div>
        <div class="slot-content">
            <strong>${component.name}</strong><br>
            <small>$${component.pricing.monthly_license.toLocaleString()}/mes</small>
        </div>
        <button class="remove-btn" onclick="removeFromSlot('${category}')">&times;</button>
    `;
}

function removeFromSlot(category) {
    const componentKey = currentStack[category];
    if (!componentKey) return;

    const component = componentsData[componentKey];

    // Remover de todas las categorías que cubre este componente
    component.covers.forEach(cat => {
        delete currentStack[cat];
        const slot = document.querySelector(`[data-category="${cat}"]`);
        if (slot) {
            const originalLabel = slot.querySelector('.slot-label').textContent;
            slot.classList.remove('filled');
            slot.innerHTML = `
                <div class="slot-label">${originalLabel}</div>
                <div class="slot-content">${getSlotPlaceholder(cat)}</div>
            `;
        }
    });

    updateCosts();
    updateRadarChart();
}

function updateCosts() {
    const monthlyContainer = document.getElementById('monthly-costs');
    const annualContainer = document.getElementById('annual-costs');

    if (!monthlyContainer || !annualContainer) return;

    let totalMonthly = 0;
    let totalAnnual = 0;

    const usedComponents = new Set(Object.values(currentStack));

    monthlyContainer.innerHTML = '';
    annualContainer.innerHTML = '';

    usedComponents.forEach(componentKey => {
        const component = componentsData[componentKey];
        const monthly = component.pricing.monthly_license;
        const annual = component.pricing.annual_license;

        totalMonthly += monthly;
        totalAnnual += annual;

        monthlyContainer.innerHTML += `
            <div class="cost-item">
                <span>${component.name}</span>
                <span>$${monthly.toLocaleString()}</span>
            </div>
        `;

        annualContainer.innerHTML += `
            <div class="cost-item">
                <span>${component.name}</span>
                <span>$${annual.toLocaleString()}</span>
            </div>
        `;
    });

    const totalMonthlyEl = document.getElementById('total-monthly');
    const totalAnnualEl = document.getElementById('total-annual');
    
    if (totalMonthlyEl) totalMonthlyEl.textContent = totalMonthly.toLocaleString();
    if (totalAnnualEl) totalAnnualEl.textContent = totalAnnual.toLocaleString();
}

function updateRadarChart() {
    const canvas = document.getElementById('radarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    // Configurar tamaño del canvas
    canvas.width = 280;
    canvas.height = 280;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const usedComponents = new Set(Object.values(currentStack));
    if (usedComponents.size === 0) return;

    // Calcular promedios de stats
    const avgStats = {
        integration: 0,
        usability: 0,
        scalability: 0,
        support: 0,
        customization: 0,
        learning_curve: 0
    };

    usedComponents.forEach(componentKey => {
        const component = componentsData[componentKey];
        Object.keys(avgStats).forEach(stat => {
            avgStats[stat] += component.stats[stat];
        });
    });

    Object.keys(avgStats).forEach(stat => {
        avgStats[stat] /= usedComponents.size;
    });

    // Dibujar radar chart
    drawRadarChart(ctx, avgStats, canvas.width, canvas.height);
}

function drawRadarChart(ctx, stats, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    const labels = ['Integración', 'Usabilidad', 'Escalabilidad', 'Soporte', 'Personalización', 'Facilidad'];
    const values = Object.values(stats);
    const angleStep = (Math.PI * 2) / labels.length;

    // Dibujar ejes y etiquetas
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    for (let i = 0; i < labels.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Etiquetas
        ctx.fillStyle = '#4a5568';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        const labelX = centerX + Math.cos(angle) * (radius + 20);
        const labelY = centerY + Math.sin(angle) * (radius + 20);
        ctx.fillText(labels[i], labelX, labelY);
    }

    // Dibujar círculos de referencia
    for (let r = 0.2; r <= 1; r += 0.2) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * r, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Dibujar área de datos
    ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;

    ctx.beginPath();
    for (let i = 0; i < values.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = values[i] / 10; // Normalizar a 0-1
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dibujar puntos
    ctx.fillStyle = '#667eea';
    for (let i = 0; i < values.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = values[i] / 10;
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Funciones de utilidad
function getCategoryName(category) {
    return categoriesConfig[category]?.name || category;
}

function getSlotPlaceholder(category) {
    return categoriesConfig[category]?.placeholder || 'Arrastra componente aquí';
}
function exportStack() {
    const usedComponents = new Set(Object.values(currentStack));
    let report = 'RESUMEN DEL STACK TECNOLÓGICO - LAS CATALINAS\n\n';

    report += 'COMPONENTES SELECCIONADOS:\n';
    usedComponents.forEach(componentKey => {
        const component = componentsData[componentKey];
        report += `\n• ${component.name}\n`;
        report += `  Cubre: ${component.covers.map(c => getCategoryName(c)).join(', ')}\n`;
        report += `  Costo mensual: $${component.pricing.monthly_license.toLocaleString()}\n`;
        report += `  Pros: ${component.pros.join(', ')}\n`;
        report += `  Contras: ${component.cons.join(', ')}\n`;
    });

    const totalMonthly = Array.from(usedComponents).reduce((sum, key) =>
        sum + componentsData[key].pricing.monthly_license, 0);
    const totalAnnual = Array.from(usedComponents).reduce((sum, key) =>
        sum + componentsData[key].pricing.annual_license, 0);

    report += `\nCOSTOS TOTALES:\n`;
    report += `Mensual: $${totalMonthly.toLocaleString()}\n`;
    report += `Anual: $${totalAnnual.toLocaleString()}\n`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stack-tecnologico-catalinas.txt';
    a.click();
}

function clearStack() {
    if (confirm('¿Estás seguro de que querés limpiar todo el stack?')) {
        currentStack = {};
        document.querySelectorAll('.stack-slot').forEach(slot => {
            slot.classList.remove('filled');
            const categoryKey = slot.dataset.category;
            const category = categoriesConfig[categoryKey];
            if (category) {
                slot.innerHTML = `
                    <div class="slot-label">${category.emoji} ${category.name}</div>
                    <div class="slot-content">${category.placeholder}</div>
                `;
            }
        });
        updateCosts();
    }
}



function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.js,.txt';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                let content = event.target.result;
                
                if (file.name.endsWith('.js')) {
                    const match = content.match(/let componentsData\s*=\s*(\{[\s\S]*?\});/);
                    if (match) {
                        content = match[1];
                    }
                }
                
                const newData = JSON.parse(content);
                componentsData = newData;
                
                // Guardar en localStorage
                localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(componentsData, null, 2));
                
                renderComponents();
                updateCosts();
                alert(`✅ Datos importados y guardados desde ${file.name}`);
            } catch (e) {
                alert(`❌ Error al importar archivo: ${e.message}`);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportData() {
    // Guardar en localStorage
    localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(componentsData, null, 2));
    
    // Exportar archivo
    const dataStr = JSON.stringify(componentsData, null, 2);
    const blob = new Blob([`let componentsData = ${dataStr};`], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'componentsData.js';
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('💾 Datos guardados en localStorage y exportados');
}

function importCategories() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.js,.txt';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                let content = event.target.result;
                
                if (file.name.endsWith('.js')) {
                    const match = content.match(/let categoriesConfig\s*=\s*(\{[\s\S]*?\});/);
                    if (match) {
                        content = match[1];
                    }
                }
                
                const newCategories = JSON.parse(content);
                categoriesConfig = newCategories;
                
                // Guardar en localStorage
                localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categoriesConfig, null, 2));
                
                clearStack();
                renderCategories();
                renderComponents();
                alert(`✅ Categorías importadas y guardadas desde ${file.name}`);
            } catch (e) {
                alert(`❌ Error al importar categorías: ${e.message}`);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportCategories() {
    // Guardar en localStorage
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categoriesConfig, null, 2));
    
    // Exportar archivo
    const dataStr = JSON.stringify(categoriesConfig, null, 2);
    const blob = new Blob([`let categoriesConfig = ${dataStr};`], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categoriesConfig.js';
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('💾 Categorías guardadas en localStorage y exportadas');
}
function loadFromStorage() {
    try {
        // Cargar categorías
        const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        if (savedCategories) {
            categoriesConfig = JSON.parse(savedCategories);
            console.log('✅ Categorías cargadas desde localStorage');
        }

        // Cargar componentes
        const savedComponents = localStorage.getItem(STORAGE_KEYS.COMPONENTS);
        if (savedComponents) {
            componentsData = JSON.parse(savedComponents);
            console.log('✅ Componentes cargados desde localStorage');
        }
    } catch (e) {
        console.warn('⚠️ Error cargando desde localStorage:', e.message);
    }
}