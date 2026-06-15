import { useState } from "react";
import { Sidebar } from "../../components/SideBar";
import { SummaryPanel } from "../SummaryPanel";
import "./Water.css";

// ── Constants ───────────────────────────────────────────────────────────
const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary:   0.030,
  moderate:    0.035,
  active:      0.040,
  very_active: 0.045,
};

const CLIMATE_ADDITIONS: Record<string, number> = {
  cold:      0,
  temperate: 200,
  hot:       500,
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface Profile {
  weightKg:      number;
  heightCm:      number;
  age:           number;
  gender:        string;
  activityLevel: string;
  climate:       string;
}

interface Result {
  totalMl:     number;
  totalL:      number;
  cups:        number;
  bmi:         number;
  bmiCategory: string;
  bmr:         number;
  breakdown: {
    baseMl:      number;
    bmrAdjustMl: number;
    climateMl:   number;
    ageFactor:   number;
  };
}

interface Log {
  amountMl: number;
  time:     string;
}

// ── Calculation Logic ─────────────────────────────────────────────────
function getAgeFactor(age: number): number {
  if (age < 18)  return 0.90;
  if (age <= 30) return 1.00;
  if (age <= 55) return 0.95;
  return 0.90;
}

function calculateBMR(weightKg: number, heightCm: number, age: number, gender: string): number {
  if (gender === 'male') {
    return 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
  }
  return 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
}

function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string } {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  let category: string;
  if (bmi < 18.5)      category = 'Underweight';
  else if (bmi < 25.0) category = 'Normal weight';
  else if (bmi < 30.0) category = 'Overweight';
  else                 category = 'Obesity';
  return { bmi: Math.round(bmi * 10) / 10, category };
}

function calculateDailyGoal(profile: Profile): Result {
  const { weightKg, heightCm, age, gender, activityLevel, climate } = profile;
  const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 0.035;
  const climateAdd         = CLIMATE_ADDITIONS[climate] ?? 200;
  const ageFactor          = getAgeFactor(age);
  const baseMl             = weightKg * activityMultiplier * 1000;
  const bmr                = calculateBMR(weightKg, heightCm, age, gender);
  const bmrAdjust          = (bmr / 2000) * 200;
  const { bmi, category: bmiCategory } = calculateBMI(weightKg, heightCm);
  const subtotal = baseMl + bmrAdjust + climateAdd;
  const totalMl  = Math.ceil(subtotal * ageFactor);
  const totalL   = Math.round(totalMl / 10) / 100;
  const cups     = Math.ceil(totalMl / 250);
  return {
    totalMl, totalL, cups, bmi, bmiCategory,
    bmr: Math.round(bmr),
    breakdown: {
      baseMl:      Math.round(baseMl),
      bmrAdjustMl: Math.round(bmrAdjust),
      climateMl:   climateAdd,
      ageFactor,
    },
  };
}

function validateProfile(profile: Profile): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!profile.weightKg || profile.weightKg <= 0 || profile.weightKg > 300)
    errors.push('Weight must be between 1 and 300 kg.');
  if (!profile.heightCm || profile.heightCm < 50 || profile.heightCm > 250)
    errors.push('Height must be between 50 and 250 cm.');
  if (!profile.age || profile.age < 1 || profile.age > 120)
    errors.push('Age must be between 1 and 120 years old.');
  if (!['male', 'female'].includes(profile.gender))
    errors.push('Gender must be either "male" or "female".');
  if (!Object.keys(ACTIVITY_MULTIPLIERS).includes(profile.activityLevel))
    errors.push('Invalid activity level.');
  if (!Object.keys(CLIMATE_ADDITIONS).includes(profile.climate))
    errors.push('Invalid climate.');
  return { valid: errors.length === 0, errors };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

// Using your exact CSS classes
function getProgressClass(pct: number): string {
  if (pct >= 100) return 'progress-fill done';
  if (pct >= 75)  return 'progress-fill almost';
  if (pct >= 50)  return 'progress-fill half';
  return 'progress-fill';
}

function getStatusMsg(pct: number): string {
  if (pct >= 100) return ' Goal reached! Excellent hydration!';
  if (pct >= 75)  return ' Almost there! Just a little bit left.';
  if (pct >= 50)  return ' Halfway through! Keep drinking water.';
  if (pct > 0)    return ' Drink more water throughout the day.';
  return '📋 Log your first glass!';
}

// ── Main Component ──────────────────────────────────────────────────────
export default function WaterPage() {
  // Active screen toggle in sidebar
  const [activeTab, setActiveTab] = useState<'calculator' | 'summary'>('calculator');

  // Form states
  const [weight,        setWeight]        = useState('');
  const [height,        setHeight]        = useState('');
  const [age,           setAge]           = useState('');
  const [gender,        setGender]        = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [climate,       setClimate]       = useState('');

  // Application state
  const [errors,    setErrors]    = useState<string[]>([]);
  const [result,    setResult]    = useState<Result | null>(null);
  const [logs,      setLogs]      = useState<Log[]>([]);
  const [logAmount, setLogAmount] = useState('250');

  // ── Handlers ────────────────────────────────────────────────────────────────


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);

    const profile: Profile = {
      weightKg:      parseFloat(weight),
      heightCm:      parseFloat(height),
      age:           parseInt(age, 10),
      gender,
      activityLevel,
      climate,
    };

    const { valid, errors: errs } = validateProfile(profile);
    if (!valid) {
      setErrors(errs);
      return;
    }

    const res = calculateDailyGoal(profile);
    setResult(res);
    setLogs([]);
  }

  function handleLogSubmit() {
    const amount = parseInt(logAmount, 10);
    if (!amount || amount <= 0 || amount > 2000) {
      alert('Please enter an amount between 1 and 2000 ml.');
      return;
    }
    const now  = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setLogs((prev) => [...prev, { amountMl: amount, time }]);
    setLogAmount('250');
  }

  function removeLog(index: number) {
    setLogs((prev) => prev.filter((_, i) => i !== index));
  }

  function reset() {
    setWeight(''); setHeight(''); setAge('');
    setGender(''); setActivityLevel(''); setClimate('');
    setErrors([]); setResult(null); setLogs([]);
    setLogAmount('250');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Progress calculations ─────────────────────────────────────────────────────
  const consumed  = logs.reduce((sum, l) => sum + l.amountMl, 0);
  const goalMl    = result?.totalMl ?? 0;
  const pct       = goalMl > 0 ? Math.min(100, Math.round((consumed / goalMl) * 100)) : 0;
  const remaining = Math.max(0, goalMl - consumed);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <title>Water</title>
      <Sidebar />   
      
        {/* ── Main content ── */}
      <main>
        <div className="container">

          {/* ══ SCREEN: CALCULATOR ══ */}
          {activeTab === 'calculator' && (
            <>
              <div className="header">
                <div className="drop"></div>
                <h1>Hydration Calculator</h1>
              </div>

              {/* Errors */}
              {errors.length > 0 && (
                <div id="error-box" style={{ display: 'block' }}>
                  <p>Please fix the errors below:</p>
                  <ul id="error-list">
                    {errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              )}

              {/* Form */}
              <div className="card">
                <h2>Your Profile</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid-2">
                    <div className="field">
                      <label htmlFor="weight">Weight</label>
                      <input id="weight" type="number" min="1" max="300" step="0.1"
                        placeholder="70" value={weight}
                        onChange={(e) => setWeight(e.target.value)} />
                      <span className="unit">kg</span>
                    </div>
                    <div className="field">
                      <label htmlFor="height">Height</label>
                      <input id="height" type="number" min="50" max="250"
                        placeholder="170" value={height}
                        onChange={(e) => setHeight(e.target.value)} />
                      <span className="unit">cm</span>
                    </div>
                    <div className="field">
                      <label htmlFor="age">Age</label>
                      <input id="age" type="number" min="1" max="120"
                        placeholder="30" value={age}
                        onChange={(e) => setAge(e.target.value)} />
                      <span className="unit">years old</span>
                    </div>
                    <div className="field">
                      <label htmlFor="gender">Gender</label>
                      <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="activity-level">Activity Level</label>
                      <select id="activity-level" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                        <option value="">Select</option>
                        <option value="sedentary">Sedentary</option>
                        <option value="moderate">Moderate</option>
                        <option value="active">Active</option>
                        <option value="very_active">Very Active</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="climate">Climate</label>
                      <select id="climate" value={climate} onChange={(e) => setClimate(e.target.value)}>
                        <option value="">Select</option>
                        <option value="cold">Cold</option>
                        <option value="temperate">Temperate</option>
                        <option value="hot">Hot</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary">Calculate my goal </button>
                </form>
              </div>

              {/* Results */}
              {result && (
                <div id="results-section" style={{ display: 'block' }}>

                  {/* Main Metrics */}
                  <div className="card">
                    <h2>Your Daily Goal</h2>
                    <div className="metric-grid">
                      <div className="metric">
                        <div className="label">Water Target</div>
                        <div className="value" id="goal-liters">{result.totalL.toFixed(2)} L</div>
                      </div>
                      <div className="metric">
                        <div className="label">Glasses (250 ml)</div>
                        <div className="value" id="goal-cups">{result.cups}</div>
                      </div>
                      <div className="metric teal">
                        <div className="label">BMI</div>
                        <div className="value" id="bmi-value">{result.bmi}</div>
                      </div>
                      <div className="metric teal">
                        <div className="label">Classification</div>
                        <div className="value" id="bmi-category" style={{ fontSize: '1rem' }}>{result.bmiCategory}</div>
                      </div>
                      <div className="metric">
                        <div className="label">BMR</div>
                        <div className="value" id="bmr-value" style={{ fontSize: '1rem' }}>{fmt(result.bmr)} kcal/day</div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="breakdown">
                      <h3>How it was calculated</h3>
                      <div className="breakdown-row">
                        <span className="desc">Base (weight × activity)</span>
                        <span className="val" id="base-ml">{fmt(result.breakdown.baseMl)} ml</span>
                      </div>
                      <div className="breakdown-row">
                        <span className="desc">Metabolic Adjustment (BMR)</span>
                        <span className="val" id="bmr-ml">+{fmt(result.breakdown.bmrAdjustMl)} ml</span>
                      </div>
                      <div className="breakdown-row">
                        <span className="desc">Climate Adjustment</span>
                        <span className="val" id="climate-ml">+{fmt(result.breakdown.climateMl)} ml</span>
                      </div>
                      <div className="breakdown-row">
                        <span className="desc">Age Factor</span>
                        <span className="val" id="age-factor">×{result.breakdown.ageFactor.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="card">
                    <h2>Today's Progress</h2>

                    <div className="progress-stats">
                      <span>Consumed: <strong id="consumed-ml">{fmt(consumed)} ml</strong></span>
                      <span>Remaining: <strong id="remaining-ml">{fmt(remaining)} ml</strong></span>
                    </div>

                    <div className="progress-track">
                      <div id="progress-bar"
                        className={getProgressClass(pct)}
                        style={{ width: pct + '%' }}>
                        <span id="progress-text">{pct}%</span>
                      </div>
                    </div>

                    <p id="status-msg">{getStatusMsg(pct)}</p>

                    {/* Add intake log */}
                    <div className="log-input-row">
                      <input
                        id="log-amount"
                        type="number"
                        min="1"
                        max="2000"
                        value={logAmount}
                        onChange={(e) => setLogAmount(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleLogSubmit(); }}
                        placeholder="250"
                      />
                      <button id="log-btn" onClick={handleLogSubmit}>+ Log Water (ml)</button>
                    </div>

                    {/* Log history list */}
                    <ul className="log-list" id="log-list">
                      {logs.length === 0
                        ? <li className="log-empty">No entries logged yet.</li>
                        : logs.map((log, i) => (
                          <li key={i} className="log-item">
                            <span className="log-time">{log.time}</span>
                            <span className="log-amount">{fmt(log.amountMl)} ml</span>
                            <button
                              className="log-delete"
                              aria-label="Remove entry"
                              onClick={() => removeLog(i)}
                            >✕</button>
                          </li>
                        ))
                      }
                    </ul>
                  </div>

                  {/* Reset button */}
                  <div style={{ textAlign: 'right' }}>
                    <button id="reset-btn" className="btn-ghost" onClick={reset}>
                       Recalculate
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══ SCREEN: SUMMARY ══ */}
          {activeTab === 'summary' && (
            <SummaryPanel />
          )}

        </div>
      </main>
      <SummaryPanel />
    </>
  );
}