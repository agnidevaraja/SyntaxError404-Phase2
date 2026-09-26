const fs = require('fs');
const path = require('path');

function escapePdfText(str) {
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function buildSimplePdf(title, subtitle, sections) {
  // Build a valid, multi-page capable PDF-1.4 document
  // We calculate exact byte offsets for xref table
  const linesPerPage = 42;
  const allLines = [];

  allLines.push({ type: 'title', text: title });
  allLines.push({ type: 'subtitle', text: subtitle });
  allLines.push({ type: 'blank' });

  sections.forEach((sec) => {
    allLines.push({ type: 'header', text: sec.heading });
    sec.lines.forEach((line) => {
      allLines.push({ type: 'body', text: line });
    });
    allLines.push({ type: 'blank' });
  });

  // Split into pages
  const pages = [];
  let currentPage = [];
  for (const l of allLines) {
    currentPage.push(l);
    if (currentPage.length >= linesPerPage) {
      pages.push(currentPage);
      currentPage = [];
    }
  }
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  // Generate PDF objects
  // obj 1: Catalog
  // obj 2: Outlines
  // obj 3: Pages
  // obj 4: Font F1 (Helvetica)
  // obj 5: Font F2 (Helvetica-Bold)
  // obj 6: Font F3 (Helvetica-Oblique)
  // Page objects and content stream objects
  const pageObjIds = [];
  const contentObjIds = [];
  let nextObjId = 7;

  for (let i = 0; i < pages.length; i++) {
    pageObjIds.push(nextObjId++);
    contentObjIds.push(nextObjId++);
  }

  const objects = [];

  // obj 1: Catalog
  objects[1] = `<< /Type /Catalog /Pages 3 0 R /Outlines 2 0 R >>`;
  // obj 2: Outlines
  objects[2] = `<< /Type /Outlines /Count 0 >>`;
  // obj 3: Pages
  const pageKids = pageObjIds.map((id) => `${id} 0 R`).join(' ');
  objects[3] = `<< /Type /Pages /Kids [ ${pageKids} ] /Count ${pages.length} >>`;
  // obj 4: Font F1
  objects[4] = `<< /Type /Font /Subtype /Type1 /Name /F1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`;
  // obj 5: Font F2 (Bold)
  objects[5] = `<< /Type /Font /Subtype /Type1 /Name /F2 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`;
  // obj 6: Font F3 (Oblique)
  objects[6] = `<< /Type /Font /Subtype /Type1 /Name /F3 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>`;

  for (let p = 0; p < pages.length; p++) {
    const pageLines = pages[p];
    const pageId = pageObjIds[p];
    const contentId = contentObjIds[p];

    objects[pageId] = `<< /Type /Page /Parent 3 0 R /MediaBox [ 0 0 612 792 ] /Contents ${contentId} 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> /ProcSet [ /PDF /Text ] >> >>`;

    // Construct content stream
    let streamOps = `BT\n`;
    let curY = 740;

    for (const item of pageLines) {
      if (item.type === 'title') {
        streamOps += `/F2 16 Tf\n50 ${curY} Td\n(${escapePdfText(item.text)}) Tj\n`;
        curY -= 22;
        streamOps += `0 -22 Td\n`;
      } else if (item.type === 'subtitle') {
        streamOps += `/F3 10 Tf\n0 -2 Td\n(${escapePdfText(item.text)}) Tj\n`;
        curY -= 16;
        streamOps += `0 -14 Td\n`;
      } else if (item.type === 'header') {
        streamOps += `/F2 12 Tf\n0 -4 Td\n(${escapePdfText(item.text)}) Tj\n`;
        curY -= 18;
        streamOps += `0 -14 Td\n`;
      } else if (item.type === 'blank') {
        curY -= 8;
        streamOps += `0 -8 Td\n`;
      } else {
        streamOps += `/F1 9.5 Tf\n(${escapePdfText(item.text)}) Tj\n`;
        curY -= 14;
        streamOps += `0 -14 Td\n`;
      }
    }

    // Page footer
    streamOps += `/F3 8 Tf\n0 -16 Td\n(Page ${p + 1} of ${pages.length} - St. Jude Preparatory Academy - Grade 9 Academic Exam Syllabus) Tj\n`;
    streamOps += `ET\n`;

    const streamLen = Buffer.byteLength(streamOps, 'utf-8');
    objects[contentId] = `<< /Length ${streamLen} >>\nstream\n${streamOps}endstream`;
  }

  // Assemble full file with xref
  let pdf = `%PDF-1.4\n%\xE2\xE3\xCF\xD3\n`;
  const xrefOffsets = [];

  for (let i = 1; i < nextObjId; i++) {
    xrefOffsets[i] = Buffer.byteLength(pdf, 'utf-8');
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, 'utf-8');
  pdf += `xref\n0 ${nextObjId}\n0000000000 65535 f \n`;

  for (let i = 1; i < nextObjId; i++) {
    const offsetStr = String(xrefOffsets[i]).padStart(10, '0');
    pdf += `${offsetStr} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${nextObjId} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf-8');
}

// Ensure destination directory
const outDir = path.join(__dirname, '..', 'public', 'documents');
fs.mkdirSync(outDir, { recursive: true });

// 1. Generate Full Syllabus Focus PDF (Math + 3 Sciences)
const fullSyllabusSections = [
  {
    heading: '1. MATHEMATICS (Grade 9 Focus)',
    lines: [
      'Scope: High School Preparatory Mathematics - Term 1 Curriculum',
      'Weighting: 25% of Comprehensive Assessment',
      '- Unit 1.1: Real Numbers, Surds, Scientific Notation and Rational Operations',
      '- Unit 1.2: Linear Equations & Coordinate Geometry (Slope-intercept form, midpoints)',
      '- Unit 1.3: Quadratic Expressions, Polynomial Factorization & Difference of Squares',
      '- Unit 1.4: Right-Angle Trigonometric Ratios (Sine, Cosine, Tangent) & Pythagorean Theorem',
      '- Unit 1.5: Descriptive Statistics, Frequency Distributions & Probability Trees',
      'Key Assessment Focus: Multi-step algebraic manipulation & geometric reasoning',
    ],
  },
  {
    heading: '2. PHYSICS (Grade 9 Focus)',
    lines: [
      'Scope: Classical Mechanics & Thermal Physics Foundations',
      'Weighting: 25% of Comprehensive Assessment',
      '- Unit 2.1: Measurements, SI Units, Precision Instruments & Uncertainty Estimation',
      '- Unit 2.2: Kinematics: Displacement, Velocity, Uniform Acceleration & Graphical Analysis',
      '- Unit 2.3: Dynamics & Forces: Newton\'s Three Laws of Motion, Friction & Terminal Velocity',
      '- Unit 2.4: Work, Energy, Conservation of Mechanical Energy & Power Calculations (P=W/t)',
      '- Unit 2.5: Thermal Properties: Kinetic Theory of Matter & Heat Capacity Foundations',
      'Key Assessment Focus: Motion graphs interpretation & vector force diagrams',
    ],
  },
  {
    heading: '3. CHEMISTRY (Grade 9 Focus)',
    lines: [
      'Scope: Atomic Structure, Quantitative Stoichiometry & Chemical Transformations',
      'Weighting: 25% of Comprehensive Assessment',
      '- Unit 3.1: Particulate Structure of Matter, Brownian Motion & Phase Changes',
      '- Unit 3.2: Atomic Structure: Protons, Neutrons, Electrons & Periodic Trends',
      '- Unit 3.3: Chemical Bonding: Ionic Transfer, Covalent Sharing & Formula Masses',
      '- Unit 3.4: The Mole Concept: Avogadro Conversions & Gram-Mole Dimensional Analysis',
      '- Unit 3.5: Redox Reactions & Oxidation State Tracking in Elementary Synthesis',
      'Key Assessment Focus: Quantitative mass-to-mole bridge & stoichiometric ratios',
    ],
  },
  {
    heading: '4. BIOLOGY (Grade 9 Focus)',
    lines: [
      'Scope: Cellular Biology, Plant Systems & Human Physiology',
      'Weighting: 25% of Comprehensive Assessment',
      '- Unit 4.1: Cell Structure, Organelle Functions, Light Microscopy & Magnification (I=AM)',
      '- Unit 4.2: Movement into Cells: Diffusion, Osmosis & Active Membrane Transport',
      '- Unit 4.3: Biological Macromolecules (Carbohydrates, Lipids, Proteins) & Enzyme Kinetics',
      '- Unit 4.4: Plant Physiology: Leaf Structure, Stomata Regulation & Photosynthesis Reactions',
      '- Unit 4.5: Human Organ Systems: Double Circulation, Heart Chambers & Digestive Hydrolysis',
      'Key Assessment Focus: Experimental design, enzyme temperature curves & membrane dynamics',
    ],
  },
];

const fullPdfBuffer = buildSimplePdf(
  'GRADE 9 FULL ACADEMIC SYLLABUS FOCUS',
  'St. Jude Preparatory Academy - Official Term 1 Scope (Mathematics & Core Sciences)',
  fullSyllabusSections
);

fs.writeFileSync(
  path.join(outDir, 'Grade_9_Full_Exam_Syllabus_Focus.pdf'),
  fullPdfBuffer
);
console.log('Created Grade_9_Full_Exam_Syllabus_Focus.pdf successfully');

// 2. Generate Chemistry Specialized Syllabus Focus PDF (3 interrelated topics: Mole Concept, Redox, Redox Stoichiometry)
const chemistrySections = [
  {
    heading: 'CURRICULUM OVERVIEW & TOPIC INTERRELATION',
    lines: [
      'Academic Level: Grade 9 Chemistry Honors / Pre-Advanced Syllabus',
      'Faculty Lead: Dr. Eleanor Vance | St. Jude Preparatory Academy',
      'Core Theme: Quantitative Electron Transfer & Mass Conservation',
      'This syllabus deliberately links three foundational pillars of modern chemistry:',
      '1) The Mole Concept (counting discrete particles by weighing bulk mass)',
      '2) Redox Reactions (tracking fundamental electron exchange across oxidation states)',
      '3) Stoichiometric Redox Analysis (quantifying exact electron and mass balance)',
    ],
  },
  {
    heading: 'TOPIC 1: THE MOLE CONCEPT & MOLAR MASS BRIDGES',
    lines: [
      'Target Mastery: 100% Quantitative Fluency',
      '- Avogadro\'s Constant: N_A = 6.022 x 10^23 particles per mole',
      '- Molar Mass Calculation (M): Summation of atomic weights from Periodic Table (g/mol)',
      '- Fundamental Conversion Formula: n = mass (g) / Molar Mass (g/mol)',
      '- Particle Counting Bridge: Number of Molecules = n * 6.022 x 10^23',
      '- Molar Gas Volume at STP: 1 mole of any ideal gas occupies 22.4 dm^3 (Liters)',
      'Key Diagnostic Trap: Applying coefficient multipliers directly to gram masses instead of moles',
    ],
  },
  {
    heading: 'TOPIC 2: OXIDATION-REDUCTION (REDOX) REACTIONS',
    lines: [
      'Target Mastery: Electron Transfer & State Identification',
      '- Fundamental Concept: Oxidation Is Loss of electrons, Reduction Is Gain (OIL RIG)',
      '- Oxidation Number Assignment Rules: Free elements = 0, Group 1 = +1, Oxygen = -2, Hydrogen = +1',
      '- Identifying Oxidizing Agents (electron acceptors) and Reducing Agents (electron donors)',
      '- Construction of Half-Equations with explicit electron representation (e-)',
      '- Disproportionation & Synthesis Redox Transformations in aqueous solution',
      'Key Diagnostic Trap: Confusing oxidation state increases with electron gain (charge inversion)',
    ],
  },
  {
    heading: 'TOPIC 3: STOICHIOMETRY & QUANTITATIVE REDOX ANALYSIS',
    lines: [
      'Target Mastery: Mass, Electron & Yield Conservation',
      '- Electron Balance Principle: Total electrons lost in oxidation MUST equal electrons gained in reduction',
      '- Balancing complex Redox Equations using electron-conservation half-reaction methods',
      '- Mole-to-Mole Stoichiometric Ratios derived from balanced redox equations',
      '- Limiting Reagent Determination: Using mole-per-coefficient ratios to isolate the limiting species',
      '- Excess Reactant Accounting: Moles remaining = Initial moles - Consumed moles',
      '- Percent Yield Calculations: Percent Yield = (Actual Mass / Theoretical Mass) * 100%',
      'Key Diagnostic Trap: Failure to subtract consumed moles from initial reactant pools',
    ],
  },
];

const chemPdfBuffer = buildSimplePdf(
  'GRADE 9 CHEMISTRY SYLLABUS FOCUS',
  'Interrelated Topics: The Mole Concept, Redox Reactions & Quantitative Stoichiometry',
  chemistrySections
);

fs.writeFileSync(
  path.join(outDir, 'Grade_9_Chemistry_Syllabus_Focus.pdf'),
  chemPdfBuffer
);
console.log('Created Grade_9_Chemistry_Syllabus_Focus.pdf successfully');
