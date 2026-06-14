/**
 * controller.js — Hydration Calculator
 * Gerencia o estado da aplicação, eventos da UI e renderização dos resultados.
 */

import { calculateDailyGoal, validateProfile } from './model.js';

// ── Estado global da aplicação ────────────────────────────────────────────────
const state = {
  profile: null,
  result: null,
  logs: [],         // { amountMl: number, time: string }[]
  goalMl: 0,
};

// ── Seletores de DOM ──────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

const els = {
  form:           $('profile-form'),
  weight:         $('weight'),
  height:         $('height'),
  age:            $('age'),
  gender:         $('gender'),
  activityLevel:  $('activity-level'),
  climate:        $('climate'),
  errorBox:       $('error-box'),
  errorList:      $('error-list'),
  resultsSection: $('results-section'),

  // Resultado principal
  goalLiters:     $('goal-liters'),
  goalCups:       $('goal-cups'),
  bmiValue:       $('bmi-value'),
  bmiCategory:    $('bmi-category'),
  bmrValue:       $('bmr-value'),

  // Breakdown
  baseMl:         $('base-ml'),
  bmrMl:          $('bmr-ml'),
  climateMl:      $('climate-ml'),
  ageFactorVal:   $('age-factor'),

  // Log de consumo
  logAmount:      $('log-amount'),
  logBtn:         $('log-btn'),
  logList:        $('log-list'),
  progressBar:    $('progress-bar'),
  progressText:   $('progress-text'),
  consumedMl:     $('consumed-ml'),
  remainingMl:    $('remaining-ml'),
  statusMsg:      $('status-msg'),

  resetBtn:       $('reset-btn'),
};

// ── Formatação ────────────────────────────────────────────────────────────────
function fmt(n) { return n.toLocaleString('pt-BR'); }

// ── Exibir / ocultar erros ────────────────────────────────────────────────────
function showErrors(errors) {
  els.errorList.innerHTML = errors.map((e) => `<li>${e}</li>`).join('');
  els.errorBox.style.display = 'block';
}

function clearErrors() {
  els.errorList.innerHTML = '';
  els.errorBox.style.display = 'none';
}

// ── Renderizar resultado principal ────────────────────────────────────────────
function renderResult(result) {
  els.goalLiters.textContent   = result.totalL.toFixed(2) + ' L';
  els.goalCups.textContent     = result.cups + ' copos (250 ml)';
  els.bmiValue.textContent     = result.bmi;
  els.bmiCategory.textContent  = result.bmiCategory;
  els.bmrValue.textContent     = fmt(result.bmr) + ' kcal/dia';

  els.baseMl.textContent       = fmt(result.breakdown.baseMl) + ' ml';
  els.bmrMl.textContent        = '+' + fmt(result.breakdown.bmrAdjustMl) + ' ml';
  els.climateMl.textContent    = '+' + fmt(result.breakdown.climateMl) + ' ml';
  els.ageFactorVal.textContent = '×' + result.breakdown.ageFactor.toFixed(2);

  els.resultsSection.style.display = 'block';
  els.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Renderizar progresso de consumo ───────────────────────────────────────────
function renderProgress() {
  const consumed = state.logs.reduce((sum, l) => sum + l.amountMl, 0);
  const goal     = state.goalMl;
  const pct      = Math.min(100, Math.round((consumed / goal) * 100));
  const remaining = Math.max(0, goal - consumed);

  els.consumedMl.textContent = fmt(consumed) + ' ml';
  els.remainingMl.textContent = fmt(remaining) + ' ml';
  els.progressBar.style.width = pct + '%';
  els.progressText.textContent = pct + '%';

  // Cor da barra por porcentagem
  els.progressBar.className = 'progress-fill';
  if (pct >= 100)     els.progressBar.classList.add('done');
  else if (pct >= 75) els.progressBar.classList.add('almost');
  else if (pct >= 50) els.progressBar.classList.add('half');

  // Mensagem de status
  if (pct >= 100)      els.statusMsg.textContent = '🎉 Meta atingida! Excelente hidratação!';
  else if (pct >= 75)  els.statusMsg.textContent = '💪 Quase lá! Falta pouco.';
  else if (pct >= 50)  els.statusMsg.textContent = '🙂 Na metade! Continue bebendo água.';
  else if (pct > 0)    els.statusMsg.textContent = '💧 Beba mais água ao longo do dia.';
  else                 els.statusMsg.textContent = '📋 Registre seu primeiro copo!';
}

// ── Renderizar lista de logs ──────────────────────────────────────────────────
function renderLogs() {
  if (state.logs.length === 0) {
    els.logList.innerHTML = '<li class="log-empty">Nenhum registro ainda.</li>';
    return;
  }

  els.logList.innerHTML = state.logs
    .map(
      (log, i) => `
      <li class="log-item">
        <span class="log-time">${log.time}</span>
        <span class="log-amount">${fmt(log.amountMl)} ml</span>
        <button class="log-delete" data-index="${i}" aria-label="Remover registro">
          ✕
        </button>
      </li>`
    )
    .join('');

  // Delegação de eventos nos botões de remover
  els.logList.querySelectorAll('.log-delete').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      removeLog(idx);
    });
  });
}

// ── Adicionar log de consumo ──────────────────────────────────────────────────
function addLog(amountMl) {
  const now = new Date();
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  state.logs.push({ amountMl, time });
  renderLogs();
  renderProgress();
}

// ── Remover log ───────────────────────────────────────────────────────────────
function removeLog(index) {
  state.logs.splice(index, 1);
  renderLogs();
  renderProgress();
}

// ── Reset completo ────────────────────────────────────────────────────────────
function reset() {
  state.profile = null;
  state.result  = null;
  state.logs    = [];
  state.goalMl  = 0;
  els.form.reset();
  els.resultsSection.style.display = 'none';
  clearErrors();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Handler do formulário ─────────────────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  clearErrors();

  const profile = {
    weightKg:      parseFloat(els.weight.value),
    heightCm:      parseFloat(els.height.value),
    age:           parseInt(els.age.value, 10),
    gender:        els.gender.value,
    activityLevel: els.activityLevel.value,
    climate:       els.climate.value,
  };

  const { valid, errors } = validateProfile(profile);
  if (!valid) {
    showErrors(errors);
    return;
  }

  const result   = calculateDailyGoal(profile);
  state.profile  = profile;
  state.result   = result;
  state.goalMl   = result.totalMl;
  state.logs     = [];

  renderResult(result);
  renderLogs();
  renderProgress();
}

// ── Handler do log de consumo ────────────────────────────────────────────────
function handleLogSubmit() {
  const amount = parseInt(els.logAmount.value, 10);
  if (!amount || amount <= 0 || amount > 2000) {
    alert('Informe uma quantidade entre 1 e 2000 ml.');
    return;
  }
  addLog(amount);
  els.logAmount.value = '250';
}

// ── Inicialização ─────────────────────────────────────────────────────────────
function init() {
  els.form.addEventListener('submit', handleFormSubmit);
  els.logBtn.addEventListener('click', handleLogSubmit);
  els.resetBtn.addEventListener('click', reset);

  // Permite pressionar Enter no campo de quantidade
  els.logAmount.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogSubmit();
  });
}

init();