/**
 * PRUEBA DIAGNÓSTICA DE DESARROLLO WEB - SENA ADSO
 * Lógica de navegación, validación, evaluación pedagógica y exportación
 */
'use strict';

const $ = id => document.getElementById(id);

let index = 0;
let responses = [];
let student = '';
let cohort = '';
let currentFilter = 'all';

// Etiquetas descriptivas para cada tipo de pregunta
const typeLabels = {
  single: 'Selección única',
  multi: 'Selección múltiple (varias correctas)',
  tf: 'Verdadero o falso',
  fill: 'Completar término',
  match: 'Relacionar columnas'
};

// Utilidad para sanitizar texto antes de inyectarlo en el DOM
const escapeHTML = str => String(str ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

// Asegurar integridad de los matchLabels en preguntas de tipo "match"
QUESTIONS.forEach(q => {
  if (q.type === 'match') {
    if (!q.matchLabels || !Array.isArray(q.matchLabels) || q.matchLabels.length === 0) {
      q.matchLabels = q.answerLabels || [];
    }
  }
});

/**
 * Renderiza la interfaz de la pregunta actual
 */
function render() {
  const q = QUESTIONS[index];
  const v = responses[index];

  // Actualizar metadatos del encabezado
  $('counter').textContent = `Pregunta ${index + 1} de ${QUESTIONS.length}`;
  $('topic').textContent = q.topic;
  $('topic').setAttribute('data-topic', q.topic);
  $('type').textContent = typeLabels[q.type] || q.type;

  // Actualizar barra de progreso institucional
  const pct = ((index + 1) / QUESTIONS.length) * 100;
  $('progress').style.width = `${pct}%`;
  $('progress').parentElement.setAttribute('aria-valuenow', Math.round(pct));

  // Limpiar avisos de validación
  hideNotice();

  // Enunciado
  $('question').textContent = q.prompt;

  // Renderizar opciones según el tipo de pregunta
  let html = '';

  if (['single', 'tf'].includes(q.type)) {
    html = `
      <div class="options-stack">
        ${q.options.map((opt, i) => `
          <label class="option-card" for="opt_${i}">
            <input type="radio" id="opt_${i}" name="answer" value="${i}" ${v === i ? 'checked' : ''}>
            <span class="option-text">${escapeHTML(opt)}</span>
          </label>
        `).join('')}
      </div>
    `;
  } else if (q.type === 'multi') {
    html = `
      <div class="options-stack">
        <div class="alert alert-light border small text-muted py-2 px-3 mb-2">
          💡 <strong>Selección múltiple:</strong> Marca todas las opciones que consideres correctas.
        </div>
        ${q.options.map((opt, i) => `
          <label class="option-card" for="opt_${i}">
            <input type="checkbox" id="opt_${i}" name="answer" value="${i}" ${Array.isArray(v) && v.includes(i) ? 'checked' : ''}>
            <span class="option-text">${escapeHTML(opt)}</span>
          </label>
        `).join('')}
      </div>
    `;
  } else if (q.type === 'fill') {
    html = `
      <div class="fill-container">
        <label for="fill" class="form-label fw-bold mb-2">Escribe el término que completa la expresión:</label>
        <input id="fill" class="form-control fill-input-field" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Escribe aquí tu respuesta..." value="${escapeHTML(v || '')}">
        <div class="fill-hint">💡 No distingue entre mayúsculas y minúsculas. Puedes presionar <strong>Enter</strong> para continuar.</div>
      </div>
    `;
  } else if (q.type === 'match') {
    html = `
      <div class="match-grid-container">
        <div class="alert alert-light border small text-muted py-2 px-3 mb-2">
          💡 <strong>Relacionar columnas:</strong> Selecciona en la lista desplegable la correspondencia exacta para cada elemento.
        </div>
        ${q.options.map((opt, i) => `
          <div class="match-item-row">
            <div class="match-target">
              <span class="text-secondary fw-normal">#${i + 1}</span>
              <code>${escapeHTML(opt)}</code>
            </div>
            <div class="match-select-wrap">
              <label for="match_${i}" class="visually-hidden">Correspondencia para ${escapeHTML(opt)}</label>
              <select class="form-select match-select-input" id="match_${i}" data-i="${i}">
                <option value="">Selecciona una opción...</option>
                ${q.matchLabels.map((lbl, j) => `
                  <option value="${j}" ${Array.isArray(v) && v[i] === j ? 'selected' : ''}>${escapeHTML(lbl)}</option>
                `).join('')}
              </select>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  $('answers').innerHTML = html;

  // Event listener para Enter en campos de tipo fill (respetando composición IME)
  if (q.type === 'fill') {
    const fillInput = $('fill');
    if (fillInput) {
      fillInput.focus();
      fillInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.isComposing) {
          e.preventDefault();
          $('next').click();
        }
      });
    }
  }

  // Si es tipo match, escuchar cambios para persistir y actualizar píldoras
  if (q.type === 'match') {
    document.querySelectorAll('.match-select-input').forEach(sel => {
      sel.addEventListener('change', () => {
        save();
        updateDrawer();
      });
    });
  }

  // Si son radios o checkboxes, actualizar píldora al cambiar
  if (['single', 'tf', 'multi'].includes(q.type)) {
    document.querySelectorAll('input[name=answer]').forEach(inp => {
      inp.addEventListener('change', () => {
        save();
        updateDrawer();
      });
    });
  }

  // Estado de botones de navegación
  $('prev').disabled = index === 0;
  $('next').innerHTML = index === QUESTIONS.length - 1
    ? 'Finalizar y Calificar <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>'
    : 'Siguiente <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/></svg>';

  // Actualizar mapa de navegación de preguntas
  updateDrawer();
}

/**
 * Guarda la respuesta de la pregunta actual en el arreglo responses
 */
function save() {
  const q = QUESTIONS[index];

  if (q.type === 'fill') {
    const el = $('fill');
    responses[index] = el ? el.value.trim() : '';
  } else if (q.type === 'match') {
    const selects = [...document.querySelectorAll('.match-select-input')];
    responses[index] = selects.map(e => (e.value === '' ? null : Number(e.value)));
  } else if (q.type === 'multi') {
    const checked = [...document.querySelectorAll('input[name=answer]:checked')];
    responses[index] = checked.map(e => Number(e.value)).sort((a, b) => a - b);
  } else {
    const selected = document.querySelector('input[name=answer]:checked');
    responses[index] = selected ? Number(selected.value) : null;
  }
}

/**
 * Valida si una pregunta ha sido respondida en su totalidad
 */
function complete(q, v) {
  if (v === null || v === undefined) return false;
  if (q.type === 'match') {
    return Array.isArray(v) && v.length === q.options.length && v.every(x => x !== null && x !== undefined && x !== '');
  }
  if (q.type === 'multi') {
    return Array.isArray(v) && v.length > 0;
  }
  if (q.type === 'fill') {
    return typeof v === 'string' && v.trim().length > 0;
  }
  return Number.isInteger(v);
}

/**
 * Evalúa si la respuesta del aprendiz es correcta
 */
function correct(q, v) {
  if (v === null || v === undefined) return false;

  if (q.type === 'fill') {
    const userStr = String(v).trim().toLowerCase();
    const stripSpecial = s => s.replace(/['"<>]/g, '').trim();
    return q.answer.some(a => {
      const target = a.toLowerCase().trim();
      return target === userStr || stripSpecial(target) === stripSpecial(userStr);
    });
  }

  if (['match', 'multi'].includes(q.type)) {
    return Array.isArray(v) && JSON.stringify(v) === JSON.stringify(q.answer);
  }

  return v === q.answer;
}

/**
 * Genera una representación textual legible de la respuesta
 */
function format(q, v) {
  if (v === null || v === undefined) return 'Sin responder';

  if (q.type === 'fill') {
    return String(v);
  }

  if (q.type === 'match') {
    return q.options.map((opt, i) => {
      const labelIdx = Array.isArray(v) ? v[i] : null;
      const labelText = (labelIdx !== null && labelIdx !== undefined && q.matchLabels[labelIdx])
        ? q.matchLabels[labelIdx]
        : 'Sin responder';
      return `${opt} → ${labelText}`;
    }).join(' | ');
  }

  if (q.type === 'multi') {
    return Array.isArray(v) && v.length > 0
      ? v.map(i => q.options[i]).join(', ')
      : 'Sin responder';
  }

  return q.options[v] || 'Sin responder';
}

/**
 * Muestra el aviso de validación con estilo SENA
 */
function showNotice(msg) {
  const notice = $('notice');
  notice.textContent = msg;
  notice.hidden = false;
  notice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideNotice() {
  const notice = $('notice');
  notice.textContent = '';
  notice.hidden = true;
}

/**
 * Genera y actualiza la grilla de navegación rápida de 40 preguntas
 */
function updateDrawer() {
  const drawer = $('question-drawer');
  if (!drawer) return;

  drawer.innerHTML = QUESTIONS.map((q, i) => {
    const isAnswered = complete(q, responses[i]);
    const isActive = i === index;
    const classes = ['q-nav-pill'];
    if (isActive) classes.push('active');
    if (isAnswered) classes.push('answered');

    return `<button type="button" class="${classes.join(' ')}" data-jump="${i}" title="Pregunta ${i + 1} (${q.topic}): ${isAnswered ? 'Respondida' : 'Pendiente'}">${i + 1}</button>`;
  }).join('');

  drawer.querySelectorAll('.q-nav-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      save();
      const targetIdx = Number(btn.getAttribute('data-jump'));
      index = targetIdx;
      render();
    });
  });
}

/**
 * Finaliza la evaluación, calcula la calificación y genera el reporte formativo
 */
function finish() {
  let score = 0;
  const counts = {
    HTML: { good: 0, total: 0 },
    CSS: { good: 0, total: 0 },
    Bootstrap: { good: 0, total: 0 },
    Git: { good: 0, total: 0 }
  };

  QUESTIONS.forEach((q, i) => {
    counts[q.topic] ??= { good: 0, total: 0 };
    counts[q.topic].total++;
    if (correct(q, responses[i])) {
      score++;
      counts[q.topic].good++;
    }
  });

  const finalPoints = +(score * 2.5).toFixed(1);
  const percentage = +((score / QUESTIONS.length) * 100).toFixed(1);

  // Clasificación pedagógica de la línea base diagnóstica
  let levelClass = '';
  let levelTitle = '';
  let levelDesc = '';

  if (finalPoints >= 75) {
    levelClass = 'verdict-level-advanced';
    levelTitle = 'LÍNEA BASE: NIVEL CONSOLIDADO / AVANZADO';
    levelDesc = '¡Excelente punto de partida! Posees conocimientos previos sólidos en desarrollo web y control de versiones que te permitirán liderar y profundizar con fluidez en los proyectos formativos del trimestre.';
  } else if (finalPoints >= 45) {
    levelClass = 'verdict-level-intermediate';
    levelTitle = 'LÍNEA BASE: NIVEL INTERMEDIO / EN CONSTRUCCIÓN';
    levelDesc = '¡Buen punto de partida! Identificas conceptos y estructuras clave. Durante las sesiones formativas con el docente afianzarás y llevarás a la práctica estos fundamentos.';
  } else {
    levelClass = 'verdict-level-initial';
    levelTitle = 'LÍNEA BASE: NIVEL INICIAL / CONCEPTUAL';
    levelDesc = '¡Estado de conocimiento inicial identificado con éxito! Este diagnóstico le permite al docente orientar la formación para construir paso a paso las competencias técnicas desde sus bases.';
  }

  // Cambiar visibilidad de secciones
  $('exam').hidden = true;
  $('results').hidden = false;

  // 1. Certificado / Resumen Institucional
  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  $('summary').innerHTML = `
    <div class="d-flex justify-content-center align-items-center gap-2 mb-2">
      <img src="img/sena-logo-green.svg" alt="SENA" width="40" height="40">
      <h3 class="h5 fw-bold text-dark mb-0">Servicio Nacional de Aprendizaje - SENA</h3>
    </div>
    <div class="text-secondary fw-semibold small mb-1">Regional Antioquia · Centro de Servicios y Gestión Empresarial</div>
    <p class="text-muted small mb-3">Programa ADSO · Docente: <strong>Álvaro Pérez Niño</strong> · ${escapeHTML(today)}</p>

    <div class="row justify-content-center mb-3">
      <div class="col-md-8 text-start bg-light p-3 rounded border">
        <div><strong>Aprendiz:</strong> ${escapeHTML(student)}</div>
        ${cohort ? `<div><strong>Ficha ADSO:</strong> ${escapeHTML(cohort)}</div>` : ''}
        <div><strong>Docente:</strong> Álvaro Pérez Niño</div>
        <div><strong>Total Preguntas:</strong> ${QUESTIONS.length} ítems evaluados</div>
      </div>
    </div>

    <div class="result-score-number">${finalPoints.toLocaleString('es-CO')} <span class="fs-4 text-muted fw-normal">/ 100 pts</span></div>
    
    <div class="mb-3">
      <span class="result-verdict-pill ${levelClass}">
        ${levelTitle}
      </span>
    </div>

    <p class="fs-6 text-dark mb-1">
      Respuestas acertadas en la exploración: <strong>${score} de ${QUESTIONS.length} (${percentage}%)</strong>.
    </p>
    <p class="text-secondary small mb-0 px-md-3">
      ${levelDesc}
    </p>
  `;

  // 2. Rendimiento por Área Temática
  const topicIcons = {
    HTML: '🌐',
    CSS: '🎨',
    Bootstrap: '⚡',
    Git: '🌿'
  };

  $('bytopic').innerHTML = Object.entries(counts).map(([t, x]) => {
    const tPoints = (x.good * 2.5).toFixed(1);
    const tPct = ((x.good / x.total) * 100).toFixed(0);
    return `
      <div class="topic-score-card">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="fw-bold text-dark">${topicIcons[t] || '📄'} ${t}</span>
          <span class="badge text-bg-light border">${x.good}/${x.total} (${tPoints} pts)</span>
        </div>
        <div class="progress mb-2" style="height: 8px;">
          <div class="progress-bar" style="width: ${tPct}%;"></div>
        </div>
        <div class="text-end small text-muted">${tPct}% de efectividad</div>
      </div>
    `;
  }).join('');

  // 3. Renderizar retroalimentación de las 40 preguntas
  renderReviewCards();

  // Scroll arriba suavemente
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Renderiza las tarjetas de retroalimentación según el filtro activo
 */
function renderReviewCards() {
  const container = $('review');
  if (!container) return;

  const filteredQuestions = QUESTIONS.map((q, i) => ({
    question: q,
    idx: i,
    isCorrect: correct(q, responses[i]),
    userResp: responses[i]
  })).filter(item => {
    if (currentFilter === 'correct') return item.isCorrect;
    if (currentFilter === 'incorrect') return !item.isCorrect;
    return true;
  });

  if (filteredQuestions.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info text-center py-4">
        No hay preguntas para mostrar con el filtro seleccionado.
      </div>
    `;
    return;
  }

  container.innerHTML = filteredQuestions.map(({ question: q, idx: i, isCorrect, userResp }) => `
    <div class="feedback-card ${isCorrect ? 'correct' : 'incorrect'}">
      <div class="d-flex justify-content-between align-items-start gap-2 mb-2 flex-wrap">
        <div class="feedback-title">
          <span class="text-secondary fw-semibold">#${i + 1}.</span> ${escapeHTML(q.prompt)}
        </div>
        <div>
          <span class="topic-tag" data-topic="${q.topic}">${q.topic}</span>
          <span class="feedback-badge ${isCorrect ? 'badge-correct' : 'badge-incorrect'}">
            ${isCorrect ? '✅ Acertada' : 'ℹ️ Por Afianzar'}
          </span>
        </div>
      </div>

      <div class="feedback-detail">
        <strong>Tu respuesta:</strong> 
        <span class="${isCorrect ? 'text-success fw-semibold' : 'text-danger fw-semibold'}">
          ${escapeHTML(format(q, userResp))}
        </span>
      </div>

      ${!isCorrect ? `
        <div class="feedback-detail text-dark">
          <strong>Respuesta esperada:</strong> 
          <span class="text-success fw-semibold">${escapeHTML(format(q, q.answer))}</span>
        </div>
      ` : ''}

      <div class="feedback-explain">
        <strong>💡 Justificación formativa:</strong> ${escapeHTML(q.explain)}
      </div>
    </div>
  `).join('');
}

// --------------------------------------------------------------------------
// Inicialización y Controladores de Eventos
// --------------------------------------------------------------------------

// Iniciar Prueba desde la pantalla de bienvenida
$('start').addEventListener('click', () => {
  student = $('student').value.trim();
  cohort = $('cohort') ? $('cohort').value.trim() : '';

  if (!student) {
    $('student').focus();
    $('student').classList.add('is-invalid');
    return;
  }
  $('student').classList.remove('is-invalid');

  // Inicializar respuestas en null para las 40 preguntas
  responses = Array(QUESTIONS.length).fill(null);
  index = 0;

  $('welcome').hidden = true;
  $('exam').hidden = false;
  render();
});

// Navegación hacia atrás
$('prev').addEventListener('click', () => {
  save();
  if (index > 0) {
    index--;
    render();
  }
});

// Navegación hacia adelante o finalización
$('next').addEventListener('click', () => {
  save();
  const q = QUESTIONS[index];

  if (!complete(q, responses[index])) {
    showNotice('Por favor completa la respuesta antes de continuar al siguiente ítem.');
    return;
  }

  hideNotice();

  if (index === QUESTIONS.length - 1) {
    // Si hay preguntas previas sin contestar, avisar
    const unansweredCount = responses.filter((v, i) => !complete(QUESTIONS[i], v)).length;
    if (unansweredCount > 0) {
      if (!confirm(`Tienes ${unansweredCount} pregunta(s) sin responder. ¿Deseas finalizar y calificar la prueba de todos modos?`)) {
        return;
      }
    }
    finish();
  } else {
    index++;
    render();
  }
});

// Alternar cajón del mapa de 40 preguntas
$('toggle-drawer-btn').addEventListener('click', () => {
  const drawer = $('question-drawer');
  const isHidden = drawer.hidden;
  drawer.hidden = !isHidden;
  $('toggle-drawer-btn').setAttribute('aria-expanded', String(isHidden));
});

// Filtros de la retroalimentación final
document.querySelectorAll('.filter-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    renderReviewCards();
  });
});

// Botón de imprimir / guardar en PDF
const printBtn = $('print-btn');
if (printBtn) {
  printBtn.addEventListener('click', () => {
    window.print();
  });
}

// Botón de reiniciar la prueba
$('restart').addEventListener('click', () => {
  if (confirm('¿Estás seguro de que deseas reiniciar la prueba? Se borrarán todas las respuestas actuales.')) {
    location.reload();
  }
});

// Descargar reporte completo en formato CSV
$('download').addEventListener('click', () => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const rows = [
    ['Servicio Nacional de Aprendizaje SENA', 'Regional Antioquia', 'Centro de Servicios y Gestión Empresarial'],
    ['Programa', 'Tecnología en Análisis y Desarrollo de Software (ADSO)', 'Docente', 'Álvaro Pérez Niño'],
    ['Aprendiz', student, 'Ficha ADSO', cohort || 'N/A', 'Fecha', todayStr],
    [],
    ['Nro', 'Competencia / Tema', 'Enunciado de la Pregunta', 'Respuesta del Aprendiz', '¿Acertada?', 'Puntos']
  ];

  QUESTIONS.forEach((q, i) => {
    const isOk = correct(q, responses[i]);
    rows.push([
      i + 1,
      q.topic,
      q.prompt,
      format(q, responses[i]),
      isOk ? 'Sí' : 'No',
      isOk ? 2.5 : 0
    ]);
  });

  // Codificación UTF-8 con BOM para apertura perfecta en Excel en español
  const csvContent = '\ufeff' + rows.map(r =>
    r.map(cell => '"' + String(cell ?? '').replaceAll('"', '""') + '"').join(';')
  ).join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = student.toLowerCase().replace(/[^a-z0-9]/g, '_');
  a.href = url;
  a.download = `sena_diagnostico_${safeName || 'aprendiz'}_${todayStr}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});
