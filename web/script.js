const level1Questions = [
  {
    key: "appetite",
    label: "Appetite",
    options: [["H", "H - High"], ["L", "L - Low"], ["N", "N - Normal"]]
  },
  {
    key: "thirst",
    label: "Frequency of thirst",
    options: [["H", "H - High"], ["L", "L - Low"], ["N", "N - Normal"]]
  },
  {
    key: "urination",
    label: "Frequency of urination",
    options: [["H", "H - High"], ["L", "L - Low"], ["N", "N - Normal"]]
  },
  {
    key: "vision",
    label: "Vision",
    options: [["I", "I - Impaired"], ["N", "N - Normal"]]
  },
  {
    key: "urineSugar",
    label: "Urine sugar",
    options: [["P", "P - Positive/Present"], ["A", "A - Absent/Negative"]]
  },
  {
    key: "ketonuria",
    label: "Ketonuria",
    options: [["P", "P - Positive/Present"], ["A", "A - Absent/Negative"]]
  },
  {
    key: "fbs",
    label: "Fasting blood sugar",
    options: [["H", "H - High"], ["L", "L - Low"], ["N", "N - Normal"]]
  },
  {
    key: "rbs",
    label: "RBS",
    options: [["H", "H - High"], ["L", "L - Low"], ["N", "N - Normal"]]
  },
  {
    key: "familyHistory",
    label: "Family history of diabetes",
    options: [["P", "P - Present"], ["A", "A - Absent"]]
  },
  {
    key: "ogtt",
    label: "OGTT",
    options: [["D", "D - Diabetic range"], ["N", "N - Normal range"]]
  }
];

const level2Questions = [
  {
    key: "pancreatitis",
    label: "Pancreatitis",
    options: [["P", "P - Present"], ["A", "A - Absent"]]
  },
  {
    key: "carcinoma",
    label: "Carcinoma",
    options: [["P", "P - Present"], ["A", "A - Absent"]]
  },
  {
    key: "cirrhosis",
    label: "Cirrhosis",
    options: [["P", "P - Present"], ["A", "A - Absent"]]
  },
  {
    key: "hcts",
    label: "HCTS",
    options: [["H", "H - High"], ["L", "L - Low"], ["N", "N - Normal"]]
  },
  {
    key: "hepatitis",
    label: "Hepatitis",
    options: [["P", "P - Present"], ["A", "A - Absent"]]
  },
  {
    key: "hormonal",
    label: "Hormonal disorder",
    options: [["P", "P - Present"], ["A", "A - Absent"]]
  },
  {
    key: "pancreatectomy",
    label: "Pancreatectomy",
    options: [["P", "P - Present"], ["A", "A - Absent"]]
  }
];

const level2TriggerLabels = [
  "Pancreatitis: Present",
  "Carcinoma: Present",
  "Cirrhosis: Present",
  "HCTS: High",
  "Hepatitis: Present",
  "Hormonal disorder: Present",
  "Pancreatectomy: Present"
];

const level3Questions = [
  {
    key: "ageGroup",
    label: "Age group",
    options: [["Y", "Y - Young"], ["M", "M - Middle-aged"], ["E", "E - Elderly"]]
  },
  {
    key: "bodyWeight",
    label: "Body weight",
    options: [["N", "N - Normal"], ["A", "A - Above normal"], ["B", "B - Below normal"]]
  },
  {
    key: "duration",
    label: "Duration",
    options: [["W", "W - Weeks"], ["M", "M - Months"], ["Y", "Y - Years"]]
  },
  {
    key: "ketonuria",
    label: "Ketonuria",
    options: [["P", "P - Positive/Present"], ["A", "A - Absent/Negative"]]
  },
  {
    key: "antibodies",
    label: "Auto antibodies",
    options: [["P", "P - Positive/Present"], ["A", "A - Absent/Negative"]]
  }
];

const level1Panel = document.getElementById("level1-panel");
const level2Panel = document.getElementById("level2-panel");
const level3Panel = document.getElementById("level3-panel");
const level2Help = document.getElementById("level2-help");
const resultText = document.getElementById("result-text");
const resultDetails = document.getElementById("result-details");
const combinationMode = document.getElementById("combination-mode");
const combinationFilters = document.getElementById("combination-filters");
const generateCombinationsBtn = document.getElementById("generate-combinations");
const comboSummary = document.getElementById("combo-summary");
const comboBreakdown = document.getElementById("combo-breakdown");
const comboSamples = document.getElementById("combo-samples");
const heightUnit = document.getElementById("height-unit");
const heightCmWrap = document.getElementById("height-cm-wrap");
const heightFtinWrap = document.getElementById("height-ftin-wrap");
const heightCmInput = document.getElementById("height");
const heightFtInput = document.getElementById("height-ft");
const heightInInput = document.getElementById("height-in");

buildQuestionGroup("level1-fields", "l1", level1Questions);
buildQuestionGroup("level2-fields", "l2", level2Questions);
buildQuestionGroup("level3-fields", "l3", level3Questions);
renderCombinationFilters();
syncHeightUnitUI();

function buildQuestionGroup(containerId, prefix, questions) {
  const container = document.getElementById(containerId);
  questions.forEach((q) => {
    const label = document.createElement("label");
    label.textContent = `${q.label}`;

    const select = document.createElement("select");
    select.id = `${prefix}-${q.key}`;

    q.options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt[0];
      option.textContent = opt[1];
      select.append(option);
    });

    label.append(select);
    container.append(label);
  });
}

function analyzeLevel1(symptoms) {
  if (symptoms[9] === "D") {
    return -1;
  }

  if (symptoms[5] === "P" && symptoms[6] === "P" && symptoms[7] === "H") {
    return -1;
  }

  let count = 0;
  symptoms.forEach((c) => {
    if (c === "H" || c === "P" || c === "D" || c === "I") {
      count += 1;
    }
  });

  return count > 5 ? -1 : 0;
}

function analyzeLevel2(symptoms) {
  const secondary = (
    symptoms[0] === "P" ||
    symptoms[1] === "P" ||
    symptoms[2] === "P" ||
    symptoms[3] === "H" ||
    symptoms[4] === "P" ||
    symptoms[5] === "P" ||
    symptoms[6] === "P"
  );

  return secondary ? -1 : 0;
}

function getLevel2TriggerReasons(symptoms) {
  const reasons = [];

  if (symptoms[0] === "P") reasons.push(level2TriggerLabels[0]);
  if (symptoms[1] === "P") reasons.push(level2TriggerLabels[1]);
  if (symptoms[2] === "P") reasons.push(level2TriggerLabels[2]);
  if (symptoms[3] === "H") reasons.push(level2TriggerLabels[3]);
  if (symptoms[4] === "P") reasons.push(level2TriggerLabels[4]);
  if (symptoms[5] === "P") reasons.push(level2TriggerLabels[5]);
  if (symptoms[6] === "P") reasons.push(level2TriggerLabels[6]);

  return reasons;
}

function analyzeLevel3(symptoms) {
  // Insulin-dependent: young OR middle-aged OR elderly, with ketonuria + antibodies present
  // Weight can be normal or below normal; duration can be weeks, months, or years
  const insulinDependent = (
    (symptoms[3] === "P" && symptoms[4] === "P") &&
    (symptoms[1] === "N" || symptoms[1] === "B") &&
    (symptoms[0] === "Y" || symptoms[0] === "M" || symptoms[0] === "E")
  );

  return insulinDependent ? 0 : -1;
}

function readAnswers(prefix, questions) {
  return questions.map((q) => {
    const el = document.getElementById(`${prefix}-${q.key}`);
    return el.value;
  });
}

function computeBMI() {
  const weightVal = parseFloat(document.getElementById("weight").value);
  const weightUnit = document.getElementById("weight-unit").value;
  let weightKg = weightUnit === "lbs" ? weightVal * 0.453592 : weightVal;

  let heightCm;
  if (document.getElementById("height-unit").value === "cm") {
    heightCm = parseFloat(document.getElementById("height").value);
  } else {
    const ft = parseFloat(document.getElementById("height-ft").value) || 0;
    const inches = parseFloat(document.getElementById("height-in").value) || 0;
    heightCm = (ft * 12 + inches) * 2.54;
  }

  if (!weightKg || !heightCm) return null;
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  return Math.round(bmi * 10) / 10;
}

function bmiCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function deriveAgeGroup() {
  const age = parseFloat(document.getElementById("age").value);
  if (!age || age <= 0) return null;
  if (age < 35) return "Y";
  if (age <= 60) return "M";
  return "E";
}

function validatePersonalInfo() {
  const age = parseFloat(document.getElementById("age").value);
  const weight = parseFloat(document.getElementById("weight").value);

  if (!age || age < 1 || age > 120) {
    return "Age must be between 1 and 120.";
  }
  if (!weight || weight < 1 || weight > 900) {
    return "Weight must be a positive number.";
  }

  if (document.getElementById("height-unit").value === "cm") {
    const h = parseFloat(document.getElementById("height").value);
    if (!h || h < 30 || h > 300) return "Height (cm) must be between 30 and 300.";
  } else {
    const ft = parseFloat(document.getElementById("height-ft").value);
    const inches = parseFloat(document.getElementById("height-in").value);
    if (!ft || ft < 1 || ft > 9) return "Feet must be between 1 and 9.";
    if (isNaN(inches) || inches < 0 || inches > 11) return "Inches must be between 0 and 11.";
  }
  return null;
}

function questionDefinitionsForMode(mode) {
  if (mode === "level1") {
    return level1Questions.map((q) => ({ id: q.key, label: q.label, options: q.options }));
  }

  if (mode === "level2") {
    return level2Questions.map((q) => ({ id: q.key, label: q.label, options: q.options }));
  }

  if (mode === "level3") {
    return level3Questions.map((q) => ({ id: q.key, label: q.label, options: q.options }));
  }

  return [
    ...level1Questions.map((q) => ({ id: `l1_${q.key}`, label: `L1 ${q.label}`, options: q.options })),
    ...level2Questions.map((q) => ({ id: `l2_${q.key}`, label: `L2 ${q.label}`, options: q.options })),
    ...level3Questions.map((q) => ({ id: `l3_${q.key}`, label: `L3 ${q.label}`, options: q.options }))
  ];
}

function renderCombinationFilters() {
  const defs = questionDefinitionsForMode(combinationMode.value);
  combinationFilters.innerHTML = "";

  defs.forEach((def) => {
    const label = document.createElement("label");
    label.textContent = def.label;

    const select = document.createElement("select");
    select.id = `combo-${def.id}`;

    const anyOpt = document.createElement("option");
    anyOpt.value = "*";
    anyOpt.textContent = "Any";
    select.append(anyOpt);

    def.options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt[0];
      option.textContent = opt[1];
      select.append(option);
    });

    label.append(select);
    combinationFilters.append(label);
  });

  resetCombinationOutput();
}

function selectedCombinationFilters(mode) {
  const defs = questionDefinitionsForMode(mode);
  const filters = {};

  defs.forEach((def) => {
    const el = document.getElementById(`combo-${def.id}`);
    if (el && el.value !== "*") {
      filters[def.id] = el.value;
    }
  });

  return filters;
}

function scenarioMatchesFilters(scenario, filters) {
  return Object.entries(filters).every(([key, value]) => scenario[key] === value);
}

function formatScenarioSummary(mode, scenario) {
  if (mode !== "endToEnd") {
    return Object.entries(scenario).map(([k, v]) => `${k}:${v}`).join(" | ");
  }

  const l1 = level1Questions.map((q) => `${q.key}:${scenario[`l1_${q.key}`] || "-"}`).join(",");
  const l2 = level2Questions.map((q) => `${q.key}:${scenario[`l2_${q.key}`] || "-"}`).join(",");
  const l3 = level3Questions.map((q) => `${q.key}:${scenario[`l3_${q.key}`] || "-"}`).join(",");
  return `L1[${l1}] L2[${l2}] L3[${l3}]`;
}

function computeCombinationsForMode(mode, filters) {
  const CAP = 50000;
  const stats = {
    total: 0,
    breakdown: {},
    samples: [],
    truncated: false,
    cap: CAP
  };

  function collect(outcome, scenario) {
    if (stats.total >= CAP) {
      stats.truncated = true;
      return;
    }
    if (!scenarioMatchesFilters(scenario, filters)) {
      return;
    }

    stats.total += 1;
    stats.breakdown[outcome] = (stats.breakdown[outcome] || 0) + 1;

    if (stats.samples.length < 20) {
      stats.samples.push({ outcome, summary: formatScenarioSummary(mode, scenario) });
    }
  }

  if (mode === "level1") {
    enumerateQuestionSpace(level1Questions, {}, (answers, scenario) => {
      const result = analyzeLevel1(answers);
      const outcome = result === 0 ? "Low-risk at Level 1" : "Possible diabetes risk at Level 1";
      collect(outcome, scenario);
    });
    return stats;
  }

  if (mode === "level2") {
    enumerateQuestionSpace(level2Questions, {}, (answers, scenario) => {
      const result = analyzeLevel2(answers);
      const outcome = result === 0 ? "Primary pattern" : "Secondary pattern";
      collect(outcome, scenario);
    });
    return stats;
  }

  if (mode === "level3") {
    enumerateQuestionSpace(level3Questions, {}, (answers, scenario) => {
      const result = analyzeLevel3(answers);
      const outcome = result === 0 ? "Insulin-dependent pattern" : "Non-insulin-dependent pattern";
      collect(outcome, scenario);
    });
    return stats;
  }

  const l1Filter = {};
  const l2Filter = {};
  const l3Filter = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (key.startsWith("l1_")) l1Filter[key.slice(3)] = value;
    if (key.startsWith("l2_")) l2Filter[key.slice(3)] = value;
    if (key.startsWith("l3_")) l3Filter[key.slice(3)] = value;
  });

  enumerateQuestionSpace(level1Questions, l1Filter, (l1Answers, l1Scenario) => {
    const l1Result = analyzeLevel1(l1Answers);
    const scenarioL1 = prefixScenarioKeys(l1Scenario, "l1");

    if (l1Result === 0) {
      collect("Low-risk at Level 1", scenarioL1);
      return;
    }

    enumerateQuestionSpace(level2Questions, l2Filter, (l2Answers, l2Scenario) => {
      const l2Result = analyzeLevel2(l2Answers);
      const scenarioL2 = prefixScenarioKeys(l2Scenario, "l2");
      const mergedL1L2 = { ...scenarioL1, ...scenarioL2 };

      if (l2Result === -1) {
        collect("Secondary pattern at Level 2", mergedL1L2);
        return;
      }

      enumerateQuestionSpace(level3Questions, l3Filter, (l3Answers, l3Scenario) => {
        const l3Result = analyzeLevel3(l3Answers);
        const scenarioL3 = prefixScenarioKeys(l3Scenario, "l3");
        const fullScenario = { ...mergedL1L2, ...scenarioL3 };
        const outcome = l3Result === 0
          ? "Insulin-dependent pattern at Level 3"
          : "Non-insulin-dependent pattern at Level 3";
        collect(outcome, fullScenario);
      });
    });
  });

  return stats;
}

function enumerateQuestionSpace(questions, fixedValues, onEach) {
  const answers = [];
  const scenario = {};

  function walk(index) {
    if (index === questions.length) {
      onEach([...answers], { ...scenario });
      return;
    }

    const q = questions[index];
    const fixed = fixedValues[q.key];
    const values = fixed ? [fixed] : q.options.map((opt) => opt[0]);

    values.forEach((value) => {
      answers.push(value);
      scenario[q.key] = value;
      walk(index + 1);
      answers.pop();
      delete scenario[q.key];
    });
  }

  walk(0);
}

function prefixScenarioKeys(scenario, prefix) {
  const out = {};
  Object.entries(scenario).forEach(([key, value]) => {
    out[`${prefix}_${key}`] = value;
  });
  return out;
}

function resetCombinationOutput() {
  comboSummary.classList.add("hidden");
  comboSummary.textContent = "";
  comboBreakdown.classList.add("hidden");
  comboBreakdown.innerHTML = "";
  comboSamples.classList.add("hidden");
  comboSamples.innerHTML = "";
}

function renderCombinationOutput(mode, stats) {
  // Summary
  comboSummary.textContent = `Matching combinations: ${stats.total}`;
  comboSummary.classList.remove("hidden");

  // Breakdown table — built with DOM to avoid XSS
  comboBreakdown.innerHTML = "";
  const breakdownTitle = document.createElement("strong");
  breakdownTitle.textContent = `Outcome breakdown (${mode})`;
  comboBreakdown.append(breakdownTitle);

  const bTable = document.createElement("table");
  const bHead = bTable.createTHead();
  const bHRow = bHead.insertRow();
  ["Outcome", "Count"].forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    bHRow.append(th);
  });
  const bBody = bTable.createTBody();
  const entries = Object.entries(stats.breakdown).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    const row = bBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 2;
    cell.textContent = "No combinations found";
  } else {
    entries.forEach(([label, count]) => {
      const row = bBody.insertRow();
      const c1 = row.insertCell(); c1.textContent = label;
      const c2 = row.insertCell(); c2.textContent = count;
    });
  }
  comboBreakdown.append(bTable);
  comboBreakdown.classList.remove("hidden");

  // Sample table
  comboSamples.innerHTML = "";
  const samplesTitle = document.createElement("strong");
  samplesTitle.textContent = `Sample combinations (first ${stats.samples.length})`;
  if (stats.truncated) {
    const note = document.createElement("span");
    note.style.color = "#b45309";
    note.textContent = ` — results capped at ${stats.cap.toLocaleString()} matches to avoid browser freeze`;
    samplesTitle.append(note);
  }
  comboSamples.append(samplesTitle);

  const sTable = document.createElement("table");
  const sHead = sTable.createTHead();
  const sHRow = sHead.insertRow();
  ["#", "Outcome", "Combination"].forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    sHRow.append(th);
  });
  const sBody = sTable.createTBody();
  if (stats.samples.length === 0) {
    const row = sBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 3;
    cell.textContent = "No samples to show";
  } else {
    stats.samples.forEach((sample, index) => {
      const row = sBody.insertRow();
      const c1 = row.insertCell(); c1.textContent = index + 1;
      const c2 = row.insertCell(); c2.textContent = sample.outcome;
      const c3 = row.insertCell(); c3.textContent = sample.summary;
    });
  }
  comboSamples.append(sTable);
  comboSamples.classList.remove("hidden");
}

function updateResult(message, risk = false) {
  resultText.textContent = message;
  resultText.classList.toggle("result-risk", risk);
  resultText.classList.toggle("result-ok", !risk);
}

function updateResultDetails(lines = []) {
  if (!lines.length) {
    resultDetails.classList.add("hidden");
    resultDetails.innerHTML = "";
    return;
  }

  const items = lines.map((line) => `<li>${line}</li>`).join("");
  resultDetails.innerHTML = `<strong>What this means</strong><ul>${items}</ul>`;
  resultDetails.classList.remove("hidden");
}

function updateLevel2Help(message = "") {
  if (!message) {
    level2Help.textContent = "";
    level2Help.classList.add("hidden");
    return;
  }

  level2Help.textContent = message;
  level2Help.classList.remove("hidden");
}

function profileName() {
  const name = document.getElementById("name").value.trim();
  return name.length > 0 ? name : "User";
}

function personalInfoFilled() {
  const basicFilled = ["name", "age", "weight", "sex", "weight-unit", "height-unit"].every((id) => {
    const value = document.getElementById(id).value;
    return value !== "";
  });

  if (!basicFilled) {
    return false;
  }

  if (heightUnit.value === "cm") {
    return heightCmInput.value !== "";
  }

  return heightFtInput.value !== "" && heightInInput.value !== "";
}

function syncHeightUnitUI() {
  const useCm = heightUnit.value === "cm";
  heightCmWrap.classList.toggle("hidden", !useCm);
  heightFtinWrap.classList.toggle("hidden", useCm);

  if (useCm) {
    heightCmInput.required = true;
    heightFtInput.required = false;
    heightInInput.required = false;
  } else {
    heightCmInput.required = false;
    heightFtInput.required = true;
    heightInInput.required = true;
  }
}

document.getElementById("check-level1").addEventListener("click", () => {
  if (!personalInfoFilled()) {
    updateResult("Please complete your personal details first, then click Check Level 1.", true);
    document.getElementById("result-panel").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const validationError = validatePersonalInfo();
  if (validationError) {
    updateResult(validationError, true);
    document.getElementById("result-panel").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  // Auto-derive age group for Level 3
  const derivedGroup = deriveAgeGroup();
  if (derivedGroup) {
    const ageSel = document.getElementById("l3-ageGroup");
    if (ageSel) ageSel.value = derivedGroup;
  }

  const level1 = readAnswers("l1", level1Questions);
  const result = analyzeLevel1(level1);
  const name = profileName();

  const bmi = computeBMI();
  const bmiLine = bmi ? `Your BMI is ${bmi} (${bmiCategory(bmi)}).` : null;

  level2Panel.classList.add("hidden");
  level3Panel.classList.add("hidden");
  updateLevel2Help("");
  updateResultDetails([]);

  if (result === 0) {
    updateResult(`${name}, your answers in Step 1 look low-risk for diabetes right now. If you still have symptoms, please speak with a doctor.`, false);
    updateResultDetails([
      bmiLine,
      "Current answers do not strongly match diabetes risk in this screening.",
      "This is not a final diagnosis. If symptoms continue, get blood sugar tests done."
    ].filter(Boolean));
  } else {
    updateResult(`${name}, Step 1 shows possible diabetes risk. Please continue to Step 2 for a clearer result.`, true);
    updateResultDetails([
      bmiLine,
      "Your Step 1 pattern suggests possible diabetes-related changes.",
      "Step 2 helps decide whether the pattern looks primary or secondary."
    ].filter(Boolean));
    level2Panel.classList.remove("hidden");
    updateLevel2Help("To move to Level 3, select A (Absent) for all P/A items and keep HCTS as L or N (not High).");
  }

  document.getElementById("result-panel").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("check-level2").addEventListener("click", () => {
  const level2 = readAnswers("l2", level2Questions);
  const result = analyzeLevel2(level2);
  const name = profileName();

  level3Panel.classList.add("hidden");

  if (result === -1) {
    const reasons = getLevel2TriggerReasons(level2);
    if (reasons.length > 0) {
      updateResult(`${name}, Step 2 suggests a secondary diabetes pattern, so Step 3 is locked. Trigger points: ${reasons.join(", ")}. Please consult a doctor for proper testing.`, true);
      updateResultDetails([
        "Likely type from this path: Secondary diabetes pattern (not classified as primary Type 1/Type 2 by this tool).",
        "This pattern can happen when another health condition affects insulin control.",
        `In your answers, key trigger(s): ${reasons.join(", ")}.`,
        "Possible outcome if untreated: persistently high blood sugar and long-term organ complications.",
        "Recommended next step: consult a doctor for tests like fasting glucose, HbA1c, and cause-focused evaluation."
      ]);
      updateLevel2Help(`Blocked from Level 3 because: ${reasons.join(", ")}. Change these to reach PRIMARY pattern.`);
    } else {
      updateResult(`${name}, Step 2 suggests a secondary diabetes pattern, so Step 3 is locked. Please consult a doctor for proper testing.`, true);
      updateResultDetails([
        "Likely type from this path: Secondary diabetes pattern.",
        "This path does not proceed to primary subtype check (Step 3).",
        "Recommended next step: medical confirmation and root-cause evaluation."
      ]);
      updateLevel2Help("Blocked from Level 3 because Level 2 matched SECONDARY pattern.");
    }
    document.getElementById("result-panel").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  updateResult(`${name}, Step 2 suggests a primary diabetes pattern. You can now continue to Step 3 for subtype check.`, true);
  updateResultDetails([
    "Likely type from this stage: Primary diabetes pattern.",
    "Step 3 will help classify whether your answers align more with insulin-dependent or non-insulin-dependent pattern."
  ]);
  updateLevel2Help("Great. Level 2 is PRIMARY, so Level 3 is now available.");
  level3Panel.classList.remove("hidden");
  document.getElementById("result-panel").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("check-level3").addEventListener("click", () => {
  const level3 = readAnswers("l3", level3Questions);
  const result = analyzeLevel3(level3);
  const name = profileName();

  if (result === 0) {
    updateResult(`${name}, Step 3 suggests an insulin-dependent diabetes pattern. Please visit a doctor soon for confirmation and treatment planning.`, true);
    updateResultDetails([
      "Likely type from this path: Insulin-dependent pattern.",
      "Typical outcome: insulin treatment is often needed, based on doctor evaluation.",
      "Do not self-medicate. Get medical confirmation and a treatment plan."
    ]);
  } else {
    updateResult(`${name}, Step 3 suggests a non-insulin-dependent diabetes pattern. Please consult a doctor to confirm and discuss next steps.`, true);
    updateResultDetails([
      "Likely type from this path: Non-insulin-dependent pattern.",
      "Typical outcome: doctor may start lifestyle management and/or oral medicines.",
      "Medical confirmation is still required before any treatment decision."
    ]);
  }

  document.getElementById("result-panel").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("reset-all").addEventListener("click", () => {
  document.querySelectorAll("input").forEach((el) => {
    el.value = "";
  });

  document.querySelectorAll("select").forEach((el) => {
    el.selectedIndex = 0;
  });

  level2Panel.classList.add("hidden");
  level3Panel.classList.add("hidden");
  updateLevel2Help("");
  updateResultDetails([]);
  resultText.className = "";
  updateResult("Fill in your details and click Check Level 1 to start your self-check.", false);
  resetCombinationOutput();
  syncHeightUnitUI();
});

combinationMode.addEventListener("change", renderCombinationFilters);
heightUnit.addEventListener("change", syncHeightUnitUI);

generateCombinationsBtn.addEventListener("click", () => {
  const mode = combinationMode.value;
  const filters = selectedCombinationFilters(mode);
  const stats = computeCombinationsForMode(mode, filters);
  renderCombinationOutput(mode, stats);
});
