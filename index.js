const STORAGE_KEYS = {
    COMPONENTS: 'catalinas_components_data',
    CATEGORIES: 'catalinas_categories_config'
};
let showCostDetails = false;
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

let currentStack = {
    erp: [],
    pms: [],
    crm: [],
    field: [],
    hr: [],
    bi: []
};

// Inicializar la aplicación
function init() {
    console.log('🚀 Iniciando Stack Builder...');
    loadFromStorage();
    initializeStack(); // ← Nueva línea
    renderCategories();
    renderComponents();
    updateCosts();
    console.log('✅ Stack Builder inicializado');
    updateRadarChart();
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

    // Verificar si el componente ya existe en alguna categoría
    const existingCategories = [];
    component.covers.forEach(category => {
        if (currentStack[category] && currentStack[category].includes(componentKey)) {
            existingCategories.push(category);
        }
    });

    if (existingCategories.length > 0) {
        alert(`${component.name} ya está en: ${existingCategories.map(c => getCategoryName(c)).join(', ')}`);
        return;
    }

    // Detectar conflictos (componentes multi-categoría vs otros multi-categoría)
    const conflicts = [];
    component.covers.forEach(category => {
        const existing = currentStack[category] || [];
        existing.forEach(existingKey => {
            const existingComponent = componentsData[existingKey];
            if (existingComponent.covers.length > 1) {
                conflicts.push({
                    category: category,
                    existing: existingKey,
                    existingName: existingComponent.name
                });
            }
        });
    });

    // Si hay conflictos multi-categoría, mostrar opciones
    if (conflicts.length > 0) {
        const conflictMsg = conflicts.map(c =>
            `• ${getCategoryName(c.category)}: ${c.existingName}`
        ).join('\n');

        const message = `${component.name} tiene conflictos con sistemas multi-categoría:\n\n${conflictMsg}\n\n¿Qué querés hacer?`;

        const options = [
            'Reemplazar todo (eliminar sistemas existentes)',
            'Solo reemplazar en categorías con conflicto',
            'Que convivan ambos (agregar junto a los existentes)',
            'Cancelar'
        ];

        let choice = '';
        while (!choice) {
            const input = prompt(
                `${message}\n\nEscribí el número de tu opción:\n` +
                `1. ${options[0]}\n` +
                `2. ${options[1]}\n` +
                `3. ${options[2]}\n` +
                `4. ${options[3]}`
            );

            if (input === null || input === '4') return; // Cancelar

            if (['1', '2', '3'].includes(input)) {
                choice = input;
            } else {
                alert('Por favor, escribí 1, 2, 3 o 4');
            }
        }

        if (choice === '1') {
            // Reemplazar todo - remover componentes conflictivos completamente
            conflicts.forEach(conflict => {
                removeComponentCompletely(conflict.existing);
            });
        } else if (choice === '2') {
            // Solo reemplazar en categorías con conflicto
            const conflictCategories = [...new Set(conflicts.map(c => c.category))];
            conflictCategories.forEach(category => {
                currentStack[category] = currentStack[category].filter(key => {
                    const comp = componentsData[key];
                    return comp.covers.length === 1; // Mantener solo componentes de una sola categoría
                });
            });
        }
        // Si choice === '3', no hacer nada (que convivan)
    }

    // Agregar a todas las categorías que cubre
    component.covers.forEach(category => {
        if (!currentStack[category]) currentStack[category] = [];
        currentStack[category].push(componentKey);
        updateSlot(category);
    });

    updateCosts();
    updateRadarChart();
}

function updateSlot(category) {
    const slot = document.querySelector(`[data-category="${category}"]`);
    if (!slot) return;

    const categoryConfig = categoriesConfig[category];
    const components = currentStack[category] || [];

    if (components.length === 0) {
        // Slot vacío
        slot.classList.remove('filled');
        slot.innerHTML = `
            <div class="slot-label">${categoryConfig.emoji} ${categoryConfig.name}</div>
            <div class="slot-content">${categoryConfig.placeholder}</div>
        `;
    } else {
        // Slot con componentes
        slot.classList.add('filled');
        const totalCost = components.reduce((sum, key) =>
            sum + componentsData[key].pricing.monthly_license, 0);

        const componentsList = components.map(key => {
            const comp = componentsData[key];
            return `<div class="component-in-slot">
                <strong>${comp.name}</strong> - $${comp.pricing.monthly_license.toLocaleString()}/mes
                <button class="remove-component-btn" onclick="removeFromCategory('${key}', '${category}')">&times;</button>
            </div>`;
        }).join('');

        slot.innerHTML = `
            <div class="slot-label">${categoryConfig.emoji} ${categoryConfig.name}</div>
            <div class="slot-content">
                ${componentsList}
                <div class="slot-total">Total: $${totalCost.toLocaleString()}/mes</div>
            </div>
        `;
    }
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

    // Obtener todos los componentes únicos en uso
    const allComponents = new Set();
    Object.values(currentStack).forEach(categoryArray => {
        if (Array.isArray(categoryArray)) {
            categoryArray.forEach(componentKey => allComponents.add(componentKey));
        }
    });

    // Calcular totales únicos (sin duplicados)
    let totalMonthly = 0;
    let totalAnnual = 0;

    allComponents.forEach(componentKey => {
        const component = componentsData[componentKey];
        if (component) {
            totalMonthly += component.pricing.monthly_license;
            totalAnnual += component.pricing.annual_license;
        }
    });

    // Mostrar solo resumen o detalle según el estado
    if (!showCostDetails) {
        // Vista resumida
        monthlyContainer.innerHTML = `
            <div class="cost-summary">
                <div class="cost-total-line">
                    <span class="cost-label">Total Mensual:</span>
                    <span class="cost-value">$${totalMonthly.toLocaleString()}</span>
                </div>
                <button class="cost-toggle-btn" onclick="toggleCostDetails()">▼ Ver detalle</button>
            </div>
        `;

        annualContainer.innerHTML = `
            <div class="cost-summary">
                <div class="cost-total-line">
                    <span class="cost-label">Total Anual:</span>
                    <span class="cost-value">$${totalAnnual.toLocaleString()}</span>
                </div>
                <button class="cost-toggle-btn" onclick="toggleCostDetails()">▼ Ver detalle</button>
            </div>
        `;
    } else {
        // Vista detallada
        monthlyContainer.innerHTML = `
            <div class="cost-summary">
                <div class="cost-total-line">
                    <span class="cost-label">Total Mensual:</span>
                    <span class="cost-value">$${totalMonthly.toLocaleString()}</span>
                </div>
                <button class="cost-toggle-btn" onclick="toggleCostDetails()">▲ Ocultar detalle</button>
            </div>
            <div class="cost-details">
                ${generateCostDetails('monthly')}
            </div>
        `;

        annualContainer.innerHTML = `
            <div class="cost-summary">
                <div class="cost-total-line">
                    <span class="cost-label">Total Anual:</span>
                    <span class="cost-value">$${totalAnnual.toLocaleString()}</span>
                </div>
                <button class="cost-toggle-btn" onclick="toggleCostDetails()">▲ Ocultar detalle</button>
            </div>
            <div class="cost-details">
                ${generateCostDetails('annual')}
            </div>
        `;
    }

    // Actualizar totales en la parte inferior
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

    const allComponents = new Set();
    Object.values(currentStack).forEach(categoryArray => {
        if (Array.isArray(categoryArray)) {
            categoryArray.forEach(componentKey => allComponents.add(componentKey));
        }
    });

    if (allComponents.size === 0) return;

    // SUMAR stats en lugar de promediar
    const sumStats = {
        customization: 0,
        cost_efficiency: 0,
        productivity: 0,
        ai_ready: 0,
        analytics: 0,
        automation: 0,
        implementation_ease: 0,
        market_reliability: 0,
        support_quality: 0,
        integration: 0
    };

    allComponents.forEach(componentKey => {
        const component = componentsData[componentKey];
        if (component && component.stats) {
            Object.keys(sumStats).forEach(stat => {
                sumStats[stat] += component.stats[stat] || 0;
            });
        }
    });

    // Normalizar: dividir entre el máximo posible (10 * cantidad de componentes)
    const maxPossible = allComponents.size * 10;
    const normalizedStats = {};
    Object.keys(sumStats).forEach(stat => {
        normalizedStats[stat] = (sumStats[stat] / maxPossible) * 10;
    });

    // Dibujar radar chart con nuevas categorías
    drawRadarChart(ctx, normalizedStats, canvas.width, canvas.height);
}

function drawRadarChart(ctx, stats, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    const labels = [
        'Personalización',
        'Costo-Eficiencia',
        'Productividad',
        'IA Ready',
        'Analytics',
        'Automatización',
        'Fácil Implementar',
        'Confiabilidad',
        'Soporte',
        'Integración'
    ];
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

        // Etiquetas más pequeñas para que quepan
        ctx.fillStyle = '#4a5568';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        const labelX = centerX + Math.cos(angle) * (radius + 25);
        const labelY = centerY + Math.sin(angle) * (radius + 25);
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
        const value = values[i] / 10; // Ya normalizado
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
    // Obtener todos los componentes únicos en uso
    const allComponents = new Set();
    Object.values(currentStack).forEach(categoryArray => {
        if (Array.isArray(categoryArray)) {
            categoryArray.forEach(componentKey => allComponents.add(componentKey));
        }
    });

    if (allComponents.size === 0) {
        alert('No hay componentes seleccionados para exportar');
        return;
    }

    let report = 'RESUMEN DEL STACK TECNOLÓGICO - LAS CATALINAS\n\n';

    // Mostrar por categorías
    report += 'COMPONENTES POR CATEGORÍA:\n';
    Object.keys(currentStack).forEach(category => {
        const components = currentStack[category] || [];
        if (components.length > 0) {
            report += `\n${getCategoryName(category).toUpperCase()}:\n`;
            components.forEach(componentKey => {
                const component = componentsData[componentKey];
                if (component) {
                    report += `  • ${component.name} - $${component.pricing.monthly_license.toLocaleString()}/mes\n`;
                }
            });

            const categoryTotal = components.reduce((sum, key) =>
                sum + (componentsData[key]?.pricing.monthly_license || 0), 0);
            report += `  Subtotal categoría: $${categoryTotal.toLocaleString()}/mes\n`;
        }
    });

    // Resumen de componentes únicos
    report += '\n\nRESUMEN DE COMPONENTES ÚNICOS:\n';
    allComponents.forEach(componentKey => {
        const component = componentsData[componentKey];
        if (component) {
            report += `\n• ${component.name}\n`;
            report += `  Cubre: ${component.covers.map(c => getCategoryName(c)).join(', ')}\n`;
            report += `  Costo mensual: $${component.pricing.monthly_license.toLocaleString()}\n`;
            report += `  Costo anual: $${component.pricing.annual_license.toLocaleString()}\n`;
            report += `  Pros: ${component.pros.join(', ')}\n`;
            report += `  Contras: ${component.cons.join(', ')}\n`;
        }
    });

    // Calcular totales únicos
    const totalMonthly = Array.from(allComponents).reduce((sum, key) =>
        sum + (componentsData[key]?.pricing.monthly_license || 0), 0);
    const totalAnnual = Array.from(allComponents).reduce((sum, key) =>
        sum + (componentsData[key]?.pricing.annual_license || 0), 0);

    report += `\nCOSTOS TOTALES (SIN DUPLICADOS):\n`;
    report += `Mensual: $${totalMonthly.toLocaleString()}\n`;
    report += `Anual: $${totalAnnual.toLocaleString()}\n`;

    // Detectar duplicados por categoría
    report += `\nANÁLISIS DE DUPLICADOS:\n`;
    Object.keys(currentStack).forEach(category => {
        const components = currentStack[category] || [];
        if (components.length > 1) {
            const categoryTotal = components.reduce((sum, key) =>
                sum + (componentsData[key]?.pricing.monthly_license || 0), 0);
            report += `• ${getCategoryName(category)}: ${components.length} sistemas - $${categoryTotal.toLocaleString()}/mes\n`;
            components.forEach(key => {
                const comp = componentsData[key];
                if (comp) {
                    report += `  - ${comp.name}\n`;
                }
            });
        }
    });

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stack-tecnologico-catalinas.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function clearStack() {
    if (confirm('¿Estás seguro de que querés limpiar todo el stack?')) {
        initializeStack(); // Reinicializar arrays vacíos

        Object.keys(categoriesConfig).forEach(category => {
            updateSlot(category);
        });

        updateCosts();
        updateRadarChart();
    }
}


function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.js,.txt';
    input.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
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
    input.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
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

function initializeStack() {
    currentStack = {};
    Object.keys(categoriesConfig).forEach(category => {
        currentStack[category] = [];
    });
}

function removeComponentCompletely(componentKey) {
    const component = componentsData[componentKey];

    component.covers.forEach(category => {
        if (currentStack[category]) {
            currentStack[category] = currentStack[category].filter(key => key !== componentKey);
            updateSlot(category);
        }
    });
}
function removeFromCategory(componentKey, category) {
    if (!currentStack[category]) return;

    // Remover solo de esta categoría
    currentStack[category] = currentStack[category].filter(key => key !== componentKey);

    // Verificar si el componente sigue en otras categorías
    const component = componentsData[componentKey];
    const stillInUse = component.covers.some(cat =>
        currentStack[cat] && currentStack[cat].includes(componentKey)
    );

    // Si ya no está en ninguna categoría, preguntar si remover completamente
    if (!stillInUse) {
        const otherCategories = component.covers.filter(cat => cat !== category);
        if (otherCategories.length > 0) {
            const remove = confirm(
                `${component.name} ya no está en ${getCategoryName(category)}.\n\n¿También remover de: ${otherCategories.map(c => getCategoryName(c)).join(', ')}?`
            );

            if (remove) {
                removeComponentCompletely(componentKey);
            }
        }
    }

    updateSlot(category);
    updateCosts();
    updateRadarChart(); // ← Agregar esta línea

}

function exportStackToExcel() {
    // Verificar que hay componentes
    const allComponents = new Set();
    Object.values(currentStack).forEach(categoryArray => {
        if (Array.isArray(categoryArray)) {
            categoryArray.forEach(componentKey => allComponents.add(componentKey));
        }
    });

    if (allComponents.size === 0) {
        alert('No hay componentes seleccionados para exportar');
        return;
    }

    // Crear workbook
    const wb = XLSX.utils.book_new();

    // Hoja 1: Resumen por categorías
    const categoryData = [['Categoría', 'Componente', 'Costo Mensual', 'Costo Anual']];

    Object.keys(currentStack).forEach(category => {
        const components = currentStack[category] || [];
        if (components.length > 0) {
            components.forEach(componentKey => {
                const component = componentsData[componentKey];
                if (component) {
                    categoryData.push([
                        getCategoryName(category),
                        component.name,
                        component.pricing.monthly_license,
                        component.pricing.annual_license
                    ]);
                }
            });
        }
    });

    const ws1 = XLSX.utils.aoa_to_sheet(categoryData);
    XLSX.utils.book_append_sheet(wb, ws1, "Por Categorías");

    // Hoja 2: Componentes únicos detallados
    const componentData = [['Componente', 'Categorías que Cubre', 'Costo Mensual', 'Costo Anual', 'Implementación', 'Migración', 'Training', 'Pros', 'Contras']];

    allComponents.forEach(componentKey => {
        const component = componentsData[componentKey];
        if (component) {
            componentData.push([
                component.name,
                component.covers.map(c => getCategoryName(c)).join(', '),
                component.pricing.monthly_license,
                component.pricing.annual_license,
                component.pricing.implementation,
                component.pricing.migration,
                component.pricing.training,
                component.pros.join(', '),
                component.cons.join(', ')
            ]);
        }
    });

    const ws2 = XLSX.utils.aoa_to_sheet(componentData);
    XLSX.utils.book_append_sheet(wb, ws2, "Detalle Componentes");

    // Hoja 3: Análisis de costos
    const totalMonthly = Array.from(allComponents).reduce((sum, key) =>
        sum + (componentsData[key]?.pricing.monthly_license || 0), 0);
    const totalAnnual = Array.from(allComponents).reduce((sum, key) =>
        sum + (componentsData[key]?.pricing.annual_license || 0), 0);
    const totalImplementation = Array.from(allComponents).reduce((sum, key) =>
        sum + (componentsData[key]?.pricing.implementation || 0), 0);

    const costData = [
        ['Concepto', 'Valor'],
        ['Total Mensual', totalMonthly],
        ['Total Anual', totalAnnual],
        ['Costo Implementación', totalImplementation],
        ['', ''],
        ['Análisis por Categoría', ''],
        ['Categoría', 'Cantidad Sistemas', 'Costo Mensual']
    ];

    Object.keys(currentStack).forEach(category => {
        const components = currentStack[category] || [];
        if (components.length > 0) {
            const categoryTotal = components.reduce((sum, key) =>
                sum + (componentsData[key]?.pricing.monthly_license || 0), 0);
            costData.push([
                getCategoryName(category),
                components.length,
                categoryTotal
            ]);
        }
    });

    const ws3 = XLSX.utils.aoa_to_sheet(costData);
    XLSX.utils.book_append_sheet(wb, ws3, "Análisis Costos");

    // Exportar archivo
    const fileName = `stack-tecnologico-catalinas-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

function exportStackToPDF() {
    // Verificar que hay componentes
    const allComponents = new Set();
    Object.values(currentStack).forEach(categoryArray => {
        if (Array.isArray(categoryArray)) {
            categoryArray.forEach(componentKey => allComponents.add(componentKey));
        }
    });

    if (allComponents.size === 0) {
        alert('No hay componentes seleccionados para exportar');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let yPosition = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height - 20;

    // Función para agregar nueva página si es necesario
    function checkNewPage() {
        if (yPosition > pageHeight) {
            doc.addPage();
            yPosition = 20;
        }
    }

    // Título
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('STACK TECNOLÓGICO - LAS CATALINAS', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 15;

    // Resumen por categorías
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('COMPONENTES POR CATEGORÍA', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    Object.keys(currentStack).forEach(category => {
        const components = currentStack[category] || [];
        if (components.length > 0) {
            checkNewPage();

            // Nombre de categoría
            doc.setFont(undefined, 'bold');
            doc.text(`${getCategoryName(category)}:`, 20, yPosition);
            yPosition += lineHeight;

            doc.setFont(undefined, 'normal');

            // Componentes de la categoría
            components.forEach(componentKey => {
                const component = componentsData[componentKey];
                if (component) {
                    checkNewPage();
                    doc.text(`• ${component.name} - $${component.pricing.monthly_license.toLocaleString()}/mes`, 25, yPosition);
                    yPosition += lineHeight;
                }
            });

            // Subtotal de categoría
            const categoryTotal = components.reduce((sum, key) =>
                sum + (componentsData[key]?.pricing.monthly_license || 0), 0);
            doc.setFont(undefined, 'bold');
            doc.text(`Subtotal: $${categoryTotal.toLocaleString()}/mes`, 25, yPosition);
            yPosition += 10;
            doc.setFont(undefined, 'normal');
        }
    });

    checkNewPage();
    yPosition += 5;

    // Resumen de costos totales
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('RESUMEN DE COSTOS', 20, yPosition);
    yPosition += 10;

    const totalMonthly = Array.from(allComponents).reduce((sum, key) =>
        sum + (componentsData[key]?.pricing.monthly_license || 0), 0);
    const totalAnnual = Array.from(allComponents).reduce((sum, key) =>
        sum + (componentsData[key]?.pricing.annual_license || 0), 0);
    const totalImplementation = Array.from(allComponents).reduce((sum, key) =>
        sum + (componentsData[key]?.pricing.implementation || 0), 0);

    doc.setFontSize(12);
    doc.text(`Total Mensual: $${totalMonthly.toLocaleString()}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Total Anual: $${totalAnnual.toLocaleString()}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Implementación: $${totalImplementation.toLocaleString()}`, 20, yPosition);
    yPosition += 15;

    // Detalle de componentes
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('DETALLE DE COMPONENTES', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    allComponents.forEach(componentKey => {
        const component = componentsData[componentKey];
        if (component) {
            checkNewPage();

            // Nombre del componente
            doc.setFont(undefined, 'bold');
            doc.text(component.name, 20, yPosition);
            yPosition += lineHeight;

            doc.setFont(undefined, 'normal');

            // Detalles
            doc.text(`Cubre: ${component.covers.map(c => getCategoryName(c)).join(', ')}`, 25, yPosition);
            yPosition += lineHeight;
            doc.text(`Costo mensual: $${component.pricing.monthly_license.toLocaleString()}`, 25, yPosition);
            yPosition += lineHeight;
            doc.text(`Costo anual: $${component.pricing.annual_license.toLocaleString()}`, 25, yPosition);
            yPosition += lineHeight;

            // Pros y contras (con wrap de texto)
            const prosText = `Pros: ${component.pros.join(', ')}`;
            const consText = `Contras: ${component.cons.join(', ')}`;

            const prosLines = doc.splitTextToSize(prosText, 170);
            const consLines = doc.splitTextToSize(consText, 170);

            prosLines.forEach(line => {
                checkNewPage();
                doc.text(line, 25, yPosition);
                yPosition += lineHeight;
            });

            consLines.forEach(line => {
                checkNewPage();
                doc.text(line, 25, yPosition);
                yPosition += lineHeight;
            });

            yPosition += 5; // Espacio entre componentes
        }
    });

    // Guardar PDF
    const fileName = `stack-tecnologico-catalinas-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}
function toggleCostDetails() {
    showCostDetails = !showCostDetails;
    updateCosts();
}

function generateCostDetails(type) {
    let html = '';

    Object.keys(currentStack).forEach(category => {
        const components = currentStack[category] || [];
        if (components.length > 0) {
            html += `<div class="cost-category">
                <div class="cost-category-header">${getCategoryName(category)}</div>`;

            components.forEach(componentKey => {
                const comp = componentsData[componentKey];
                if (comp) {
                    const cost = type === 'monthly' ? comp.pricing.monthly_license : comp.pricing.annual_license;
                    html += `<div class="cost-item">
                        <span>${comp.name}</span>
                        <span>$${cost.toLocaleString()}</span>
                    </div>`;
                }
            });

            const categoryTotal = components.reduce((sum, key) => {
                const comp = componentsData[key];
                return comp ? sum + (type === 'monthly' ? comp.pricing.monthly_license : comp.pricing.annual_license) : sum;
            }, 0);

            html += `<div class="cost-category-total">Subtotal: $${categoryTotal.toLocaleString()}</div>
                </div>`;
        }
    });

    return html;
}