/**
 * model.js — Hydration Calculator
 * Responsável pela lógica de cálculo da meta de hidratação.
 */

const ACTIVITY_MULTIPLIERS = {
  sedentary:   0.030,
  moderate:    0.035,
  active:      0.040,
  very_active: 0.045,
};

const CLIMATE_ADDITIONS = {
  cold:      0,
  temperate: 200,
  hot:       500,
};

/**
 * Calcula o fator de ajuste pela idade.
 * Crianças e idosos têm necessidades diferentes.
 * @param {number} age - Idade em anos
 * @returns {number} - Fator multiplicador
 */
function getAgeFactor(age) {
  if (age < 18)  return 0.90;
  if (age <= 30) return 1.00;
  if (age <= 55) return 0.95;
  return 0.90;
}

/**
 * Estima a Taxa Metabólica Basal (TMB) usando a fórmula de Harris-Benedict.
 * Usada como base para estimar necessidades de líquidos.
 * @param {number} weightKg
 * @param {number} heightCm
 * @param {number} age
 * @param {string} gender - 'male' | 'female'
 * @returns {number} - TMB em kcal/dia
 */
function calculateBMR(weightKg, heightCm, age, gender) {
  if (gender === 'male') {
    return 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
  }
  return 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
}

/**
 * Calcula o IMC e retorna a classificação.
 * @param {number} weightKg
 * @param {number} heightCm
 * @returns {{ bmi: number, category: string }}
 */
function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  let category;
  if (bmi < 18.5)      category = 'Abaixo do peso';
  else if (bmi < 25.0) category = 'Peso normal';
  else if (bmi < 30.0) category = 'Sobrepeso';
  else                 category = 'Obesidade';

  return { bmi: Math.round(bmi * 10) / 10, category };
}

/**
 * Calcula a meta diária de água com base no perfil completo do usuário.
 *
 * Fórmula combinada:
 *   base = peso(kg) × multiplicador_atividade × 1000
 *   ajuste_tmb = (TMB / 2000) × 200  (pessoas com metabolismo maior precisam de mais água)
 *   ajuste_clima = adição fixa por clima
 *   ajuste_idade = fator multiplicador por faixa etária
 *   total = (base + ajuste_tmb + ajuste_clima) × ajuste_idade
 *
 * @param {Object} profile
 * @param {number} profile.weightKg
 * @param {number} profile.heightCm
 * @param {number} profile.age
 * @param {string} profile.gender
 * @param {string} profile.activityLevel
 * @param {string} profile.climate
 * @returns {Object} - Detalhamento completo da meta
 */
function calculateDailyGoal(profile) {
  const { weightKg, heightCm, age, gender, activityLevel, climate } = profile;

  const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 0.035;
  const climateAdd         = CLIMATE_ADDITIONS[climate] ?? 200;
  const ageFactor          = getAgeFactor(age);

  const baseml    = weightKg * activityMultiplier * 1000;
  const bmr       = calculateBMR(weightKg, heightCm, age, gender);
  const bmrAdjust = (bmr / 2000) * 200;
  const { bmi, category: bmiCategory } = calculateBMI(weightKg, heightCm);

  const subtotal = baseml + bmrAdjust + climateAdd;
  const totalMl  = Math.ceil(subtotal * ageFactor);
  const totalL   = Math.round(totalMl / 10) / 100;
  const cups     = Math.ceil(totalMl / 250);

  return {
    totalMl,
    totalL,
    cups,
    bmi,
    bmiCategory,
    bmr: Math.round(bmr),
    breakdown: {
      baseMl:      Math.round(baseml),
      bmrAdjustMl: Math.round(bmrAdjust),
      climateMl:   climateAdd,
      ageFactor,
    },
  };
}

/**
 * Valida os dados de entrada do perfil do usuário.
 * @param {Object} profile
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateProfile(profile) {
  const errors = [];

  if (!profile.weightKg || profile.weightKg <= 0 || profile.weightKg > 300)
    errors.push('Peso deve estar entre 1 e 300 kg.');

  if (!profile.heightCm || profile.heightCm < 50 || profile.heightCm > 250)
    errors.push('Altura deve estar entre 50 e 250 cm.');

  if (!profile.age || profile.age < 1 || profile.age > 120)
    errors.push('Idade deve estar entre 1 e 120 anos.');

  if (!['male', 'female'].includes(profile.gender))
    errors.push('Sexo deve ser "male" ou "female".');

  if (!Object.keys(ACTIVITY_MULTIPLIERS).includes(profile.activityLevel))
    errors.push('Nível de atividade inválido.');

  if (!Object.keys(CLIMATE_ADDITIONS).includes(profile.climate))
    errors.push('Clima inválido.');

  return { valid: errors.length === 0, errors };
}

export { calculateDailyGoal, validateProfile, calculateBMI, calculateBMR };