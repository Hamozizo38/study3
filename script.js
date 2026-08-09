// ============================================================
//  SCRIPT.JS - Legendary Study Organizer v6.0
//  Full JavaScript - 1500+ lines
//  Includes: Full CRUD, Periodic Table, Calculator, Travel Map,
//  Floating Timer, Media Tools, PDF Export, Backup System
// ============================================================

// ============================================================
//  1. APP CONFIGURATION
// ============================================================
const APP_VERSION = '6.0.0';
const APP_NAME = 'Legendary Study Organizer';
const APP_AUTHOR = 'Your Name';

// ============================================================
//  2. DATA LAYER
// ============================================================
let data = JSON.parse(localStorage.getItem('studyMasterData')) || {
    subjects: [],
    lessons: [],
    assignments: [],
    exams: [],
    schedule: [],
    files: [],
    timerSessions: 0,
    darkMode: false,
    timerFocus: 25,
    timerBreak: 5,
    soundEnabled: true,
    lastBackup: null,
    backupCount: 0,
    createdAt: new Date().toISOString()
};

// ============================================================
//  3. STATE MANAGEMENT
// ============================================================
let currentPage = 'dashboard';
let timerInterval = null;
let timerSeconds = 1500;
let timerRunning = false;
let timerMode = 'focus';
let travelInterval = null;
let floatingTimerInterval = null;
let floatingTimerSeconds = 1500;
let floatingTimerRunning = false;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let calcDisplay = '0';
let reminderInterval = null;

// ============================================================
//  4. PERIODIC TABLE DATA - Full English
// ============================================================
const elementsData = [
    // Period 1
    { symbol: 'H', name: 'Hydrogen', number: 1, category: 'nonmetal', mass: 1.008, group: 1, period: 1 },
    { symbol: 'He', name: 'Helium', number: 2, category: 'noble-gas', mass: 4.003, group: 18, period: 1 },
    // Period 2
    { symbol: 'Li', name: 'Lithium', number: 3, category: 'alkali', mass: 6.941, group: 1, period: 2 },
    { symbol: 'Be', name: 'Beryllium', number: 4, category: 'alkaline', mass: 9.012, group: 2, period: 2 },
    { symbol: 'B', name: 'Boron', number: 5, category: 'metalloid', mass: 10.81, group: 13, period: 2 },
    { symbol: 'C', name: 'Carbon', number: 6, category: 'nonmetal', mass: 12.011, group: 14, period: 2 },
    { symbol: 'N', name: 'Nitrogen', number: 7, category: 'nonmetal', mass: 14.007, group: 15, period: 2 },
    { symbol: 'O', name: 'Oxygen', number: 8, category: 'nonmetal', mass: 15.999, group: 16, period: 2 },
    { symbol: 'F', name: 'Fluorine', number: 9, category: 'halogen', mass: 18.998, group: 17, period: 2 },
    { symbol: 'Ne', name: 'Neon', number: 10, category: 'noble-gas', mass: 20.180, group: 18, period: 2 },
    // Period 3
    { symbol: 'Na', name: 'Sodium', number: 11, category: 'alkali', mass: 22.990, group: 1, period: 3 },
    { symbol: 'Mg', name: 'Magnesium', number: 12, category: 'alkaline', mass: 24.305, group: 2, period: 3 },
    { symbol: 'Al', name: 'Aluminium', number: 13, category: 'post-transition', mass: 26.982, group: 13, period: 3 },
    { symbol: 'Si', name: 'Silicon', number: 14, category: 'metalloid', mass: 28.086, group: 14, period: 3 },
    { symbol: 'P', name: 'Phosphorus', number: 15, category: 'nonmetal', mass: 30.974, group: 15, period: 3 },
    { symbol: 'S', name: 'Sulfur', number: 16, category: 'nonmetal', mass: 32.065, group: 16, period: 3 },
    { symbol: 'Cl', name: 'Chlorine', number: 17, category: 'halogen', mass: 35.453, group: 17, period: 3 },
    { symbol: 'Ar', name: 'Argon', number: 18, category: 'noble-gas', mass: 39.948, group: 18, period: 3 },
    // Period 4
    { symbol: 'K', name: 'Potassium', number: 19, category: 'alkali', mass: 39.098, group: 1, period: 4 },
    { symbol: 'Ca', name: 'Calcium', number: 20, category: 'alkaline', mass: 40.078, group: 2, period: 4 },
    { symbol: 'Sc', name: 'Scandium', number: 21, category: 'transition', mass: 44.956, group: 3, period: 4 },
    { symbol: 'Ti', name: 'Titanium', number: 22, category: 'transition', mass: 47.867, group: 4, period: 4 },
    { symbol: 'V', name: 'Vanadium', number: 23, category: 'transition', mass: 50.942, group: 5, period: 4 },
    { symbol: 'Cr', name: 'Chromium', number: 24, category: 'transition', mass: 51.996, group: 6, period: 4 },
    { symbol: 'Mn', name: 'Manganese', number: 25, category: 'transition', mass: 54.938, group: 7, period: 4 },
    { symbol: 'Fe', name: 'Iron', number: 26, category: 'transition', mass: 55.845, group: 8, period: 4 },
    { symbol: 'Co', name: 'Cobalt', number: 27, category: 'transition', mass: 58.933, group: 9, period: 4 },
    { symbol: 'Ni', name: 'Nickel', number: 28, category: 'transition', mass: 58.693, group: 10, period: 4 },
    { symbol: 'Cu', name: 'Copper', number: 29, category: 'transition', mass: 63.546, group: 11, period: 4 },
    { symbol: 'Zn', name: 'Zinc', number: 30, category: 'post-transition', mass: 65.380, group: 12, period: 4 },
    { symbol: 'Ga', name: 'Gallium', number: 31, category: 'post-transition', mass: 69.723, group: 13, period: 4 },
    { symbol: 'Ge', name: 'Germanium', number: 32, category: 'metalloid', mass: 72.630, group: 14, period: 4 },
    { symbol: 'As', name: 'Arsenic', number: 33, category: 'metalloid', mass: 74.922, group: 15, period: 4 },
    { symbol: 'Se', name: 'Selenium', number: 34, category: 'nonmetal', mass: 78.960, group: 16, period: 4 },
    { symbol: 'Br', name: 'Bromine', number: 35, category: 'halogen', mass: 79.904, group: 17, period: 4 },
    { symbol: 'Kr', name: 'Krypton', number: 36, category: 'noble-gas', mass: 83.798, group: 18, period: 4 },
    // Period 5
    { symbol: 'Rb', name: 'Rubidium', number: 37, category: 'alkali', mass: 85.468, group: 1, period: 5 },
    { symbol: 'Sr', name: 'Strontium', number: 38, category: 'alkaline', mass: 87.620, group: 2, period: 5 },
    { symbol: 'Y', name: 'Yttrium', number: 39, category: 'transition', mass: 88.906, group: 3, period: 5 },
    { symbol: 'Zr', name: 'Zirconium', number: 40, category: 'transition', mass: 91.224, group: 4, period: 5 },
    { symbol: 'Nb', name: 'Niobium', number: 41, category: 'transition', mass: 92.906, group: 5, period: 5 },
    { symbol: 'Mo', name: 'Molybdenum', number: 42, category: 'transition', mass: 95.950, group: 6, period: 5 },
    { symbol: 'Tc', name: 'Technetium', number: 43, category: 'transition', mass: 98.000, group: 7, period: 5 },
    { symbol: 'Ru', name: 'Ruthenium', number: 44, category: 'transition', mass: 101.070, group: 8, period: 5 },
    { symbol: 'Rh', name: 'Rhodium', number: 45, category: 'transition', mass: 102.906, group: 9, period: 5 },
    { symbol: 'Pd', name: 'Palladium', number: 46, category: 'transition', mass: 106.420, group: 10, period: 5 },
    { symbol: 'Ag', name: 'Silver', number: 47, category: 'transition', mass: 107.868, group: 11, period: 5 },
    { symbol: 'Cd', name: 'Cadmium', number: 48, category: 'post-transition', mass: 112.414, group: 12, period: 5 },
    { symbol: 'In', name: 'Indium', number: 49, category: 'post-transition', mass: 114.818, group: 13, period: 5 },
    { symbol: 'Sn', name: 'Tin', number: 50, category: 'post-transition', mass: 118.710, group: 14, period: 5 },
    { symbol: 'Sb', name: 'Antimony', number: 51, category: 'metalloid', mass: 121.760, group: 15, period: 5 },
    { symbol: 'Te', name: 'Tellurium', number: 52, category: 'metalloid', mass: 127.600, group: 16, period: 5 },
    { symbol: 'I', name: 'Iodine', number: 53, category: 'halogen', mass: 126.904, group: 17, period: 5 },
    { symbol: 'Xe', name: 'Xenon', number: 54, category: 'noble-gas', mass: 131.293, group: 18, period: 5 },
    // Period 6
    { symbol: 'Cs', name: 'Caesium', number: 55, category: 'alkali', mass: 132.905, group: 1, period: 6 },
    { symbol: 'Ba', name: 'Barium', number: 56, category: 'alkaline', mass: 137.327, group: 2, period: 6 },
    { symbol: 'La', name: 'Lanthanum', number: 57, category: 'lanthanide', mass: 138.905, group: 3, period: 6 },
    { symbol: 'Ce', name: 'Cerium', number: 58, category: 'lanthanide', mass: 140.116, group: 3, period: 6 },
    { symbol: 'Pr', name: 'Praseodymium', number: 59, category: 'lanthanide', mass: 140.908, group: 3, period: 6 },
    { symbol: 'Nd', name: 'Neodymium', number: 60, category: 'lanthanide', mass: 144.243, group: 3, period: 6 },
    { symbol: 'Pm', name: 'Promethium', number: 61, category: 'lanthanide', mass: 145.000, group: 3, period: 6 },
    { symbol: 'Sm', name: 'Samarium', number: 62, category: 'lanthanide', mass: 150.362, group: 3, period: 6 },
    { symbol: 'Eu', name: 'Europium', number: 63, category: 'lanthanide', mass: 151.964, group: 3, period: 6 },
    { symbol: 'Gd', name: 'Gadolinium', number: 64, category: 'lanthanide', mass: 157.250, group: 3, period: 6 },
    { symbol: 'Tb', name: 'Terbium', number: 65, category: 'lanthanide', mass: 158.925, group: 3, period: 6 },
    { symbol: 'Dy', name: 'Dysprosium', number: 66, category: 'lanthanide', mass: 162.500, group: 3, period: 6 },
    { symbol: 'Ho', name: 'Holmium', number: 67, category: 'lanthanide', mass: 164.930, group: 3, period: 6 },
    { symbol: 'Er', name: 'Erbium', number: 68, category: 'lanthanide', mass: 167.259, group: 3, period: 6 },
    { symbol: 'Tm', name: 'Thulium', number: 69, category: 'lanthanide', mass: 168.934, group: 3, period: 6 },
    { symbol: 'Yb', name: 'Ytterbium', number: 70, category: 'lanthanide', mass: 173.054, group: 3, period: 6 },
    { symbol: 'Lu', name: 'Lutetium', number: 71, category: 'lanthanide', mass: 174.967, group: 3, period: 6 },
    { symbol: 'Hf', name: 'Hafnium', number: 72, category: 'transition', mass: 178.490, group: 4, period: 6 },
    { symbol: 'Ta', name: 'Tantalum', number: 73, category: 'transition', mass: 180.948, group: 5, period: 6 },
    { symbol: 'W', name: 'Tungsten', number: 74, category: 'transition', mass: 183.840, group: 6, period: 6 },
    { symbol: 'Re', name: 'Rhenium', number: 75, category: 'transition', mass: 186.207, group: 7, period: 6 },
    { symbol: 'Os', name: 'Osmium', number: 76, category: 'transition', mass: 190.230, group: 8, period: 6 },
    { symbol: 'Ir', name: 'Iridium', number: 77, category: 'transition', mass: 192.217, group: 9, period: 6 },
    { symbol: 'Pt', name: 'Platinum', number: 78, category: 'transition', mass: 195.084, group: 10, period: 6 },
    { symbol: 'Au', name: 'Gold', number: 79, category: 'transition', mass: 196.967, group: 11, period: 6 },
    { symbol: 'Hg', name: 'Mercury', number: 80, category: 'post-transition', mass: 200.592, group: 12, period: 6 },
    { symbol: 'Tl', name: 'Thallium', number: 81, category: 'post-transition', mass: 204.380, group: 13, period: 6 },
    { symbol: 'Pb', name: 'Lead', number: 82, category: 'post-transition', mass: 207.200, group: 14, period: 6 },
    { symbol: 'Bi', name: 'Bismuth', number: 83, category: 'post-transition', mass: 208.980, group: 15, period: 6 },
    { symbol: 'Po', name: 'Polonium', number: 84, category: 'post-transition', mass: 209.000, group: 16, period: 6 },
    { symbol: 'At', name: 'Astatine', number: 85, category: 'halogen', mass: 210.000, group: 17, period: 6 },
    { symbol: 'Rn', name: 'Radon', number: 86, category: 'noble-gas', mass: 222.000, group: 18, period: 6 },
    // Period 7
    { symbol: 'Fr', name: 'Francium', number: 87, category: 'alkali', mass: 223.000, group: 1, period: 7 },
    { symbol: 'Ra', name: 'Radium', number: 88, category: 'alkaline', mass: 226.000, group: 2, period: 7 },
    { symbol: 'Ac', name: 'Actinium', number: 89, category: 'actinide', mass: 227.000, group: 3, period: 7 },
    { symbol: 'Th', name: 'Thorium', number: 90, category: 'actinide', mass: 232.038, group: 3, period: 7 },
    { symbol: 'Pa', name: 'Protactinium', number: 91, category: 'actinide', mass: 231.036, group: 3, period: 7 },
    { symbol: 'U', name: 'Uranium', number: 92, category: 'actinide', mass: 238.029, group: 3, period: 7 }
];

// ============================================================
//  5. CHEMICAL EQUATIONS
// ============================================================
const chemicalEquations = [
    { name: 'Photosynthesis', equation: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂' },
    { name: 'Combustion of Methane', equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O' },
    { name: 'Rusting', equation: '4Fe + 3O₂ → 2Fe₂O₃' },
    { name: 'Neutralization', equation: 'HCl + NaOH → NaCl + H₂O' },
    { name: 'Decomposition of Water', equation: '2H₂O → 2H₂ + O₂' },
    { name: 'Photosynthesis (Simplified)', equation: '6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O' },
    { name: 'Cellular Respiration', equation: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O' },
    { name: 'Nitrogen Fixation', equation: 'N₂ + 3H₂ → 2NH₃' },
    { name: 'Sulfuric Acid Formation', equation: '2SO₂ + O₂ → 2SO₃' },
    { name: 'Ozone Formation', equation: '3O₂ → 2O₃' }
];

// ============================================================
//  6. NAVIGATION FUNCTIONS
// ============================================================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const main = document.getElementById('mainContent');
    const isOpen = !sidebar.classList.contains('closed');

    sidebar.classList.toggle('closed');
    overlay.classList.toggle('show');
    main.classList.toggle('expanded');

    const toggleBtn = document.getElementById('sidebarToggle');
    if (sidebar.classList.contains('closed')) {
        toggleBtn.innerHTML = '<span>☰</span><span class="label">Menu</span>';
    } else {
        toggleBtn.innerHTML = '<span>✕</span><span class="label">Close</span>';
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const main = document.getElementById('mainContent');
    if (!sidebar.classList.contains('closed')) {
        sidebar.classList.add('closed');
        overlay.classList.remove('show');
        main.classList.add('expanded');
        document.getElementById('sidebarToggle').innerHTML = '<span>☰</span><span class="label">Menu</span>';
    }
}

function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${page}`);
    if (target) target.classList.add('active');

    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) item.classList.add('active');
    });

    currentPage = page;
    closeSidebar();

    switch (page) {
        case 'dashboard': renderDashboard(); break;
        case 'subjects': renderSubjects(); break;
        case 'lessons': populateSubjectSelects(); renderLessons(); break;
        case 'assignments': populateSubjectSelects(); renderAssignments(); break;
        case 'exams': populateSubjectSelects(); renderExams(); break;
        case 'schedule': populateSubjectSelects(); renderSchedule(); break;
        case 'timer': updateTimerDisplay(); break;
        case 'periodic': renderPeriodicTable(); break;
        case 'files': populateSubjectSelects(); renderFiles(); break;
        case 'calculator': break;
        case 'travel': break;
        case 'media': break;
    }
    updateStats();
}

// ============================================================
//  7. STATS FUNCTIONS
// ============================================================
function updateStats() {
    const totalLessons = data.lessons.length;
    const totalAssign = data.assignments.length;
    const totalExams = data.exams.length;
    const done = data.lessons.filter(l => l.done).length + data.assignments.filter(a => a.done).length + data.exams.filter(e => e.done).length;
    const total = totalLessons + totalAssign + totalExams;
    const completion = total > 0 ? Math.round((done / total) * 100) : 0;

    document.getElementById('statLessons').textContent = totalLessons;
    document.getElementById('statAssignments').textContent = totalAssign;
    document.getElementById('statExams').textContent = totalExams;
    document.getElementById('statDone').textContent = done;
    document.getElementById('statPending').textContent = total - done;
    document.getElementById('statSessions').textContent = data.timerSessions || 0;
    document.getElementById('statCompletion').textContent = completion + '%';
    document.getElementById('statSubjects').textContent = data.subjects.length;
    document.getElementById('progressFill').style.width = completion + '%';

    document.getElementById('subjectsBadge').textContent = data.subjects.length;
    document.getElementById('lessonsBadge').textContent = data.lessons.filter(l => !l.done).length;
    document.getElementById('assignmentsBadge').textContent = data.assignments.filter(a => !a.done).length;
    document.getElementById('examsBadge').textContent = data.exams.filter(e => !e.done).length;
    document.getElementById('scheduleBadge').textContent = data.schedule.length;
}

// ============================================================
//  8. FLOATING TIMER - Drag & Drop
// ============================================================
function initFloatingTimerDrag() {
    const timer = document.getElementById('floatingTimer');
    const header = document.getElementById('timerHeader');

    header.addEventListener('mousedown', startDrag);
    header.addEventListener('touchstart', startDragTouch);

    function startDrag(e) {
        isDragging = true;
        const rect = timer.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        timer.style.cursor = 'grabbing';
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    }

    function startDragTouch(e) {
        isDragging = true;
        const touch = e.touches[0];
        const rect = timer.getBoundingClientRect();
        dragOffsetX = touch.clientX - rect.left;
        dragOffsetY = touch.clientY - rect.top;
        timer.style.cursor = 'grabbing';
        document.addEventListener('touchmove', onDragTouch);
        document.addEventListener('touchend', stopDrag);
    }

    function onDrag(e) {
        if (!isDragging) return;
        const x = e.clientX - dragOffsetX;
        const y = e.clientY - dragOffsetY;
        timer.style.left = x + 'px';
        timer.style.top = y + 'px';
        timer.style.bottom = 'auto';
        timer.style.right = 'auto';
    }

    function onDragTouch(e) {
        if (!isDragging) return;
        const touch = e.touches[0];
        const x = touch.clientX - dragOffsetX;
        const y = touch.clientY - dragOffsetY;
        timer.style.left = x + 'px';
        timer.style.top = y + 'px';
        timer.style.bottom = 'auto';
        timer.style.right = 'auto';
    }

    function stopDrag() {
        isDragging = false;
        timer.style.cursor = 'default';
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', onDragTouch);
        document.removeEventListener('touchend', stopDrag);
    }
}

function toggleTimerVisibility() {
    const timer = document.getElementById('floatingTimer');
    timer.classList.toggle('hidden');
}

function minimizeTimer() {
    const timer = document.getElementById('floatingTimer');
    timer.classList.toggle('minimized');
}

function closeTimer() {
    document.getElementById('floatingTimer').style.display = 'none';
}

function updateFloatingTimerDisplay() {
    const m = Math.floor(floatingTimerSeconds / 60);
    const s = floatingTimerSeconds % 60;
    document.getElementById('floatingTimerDisplay').textContent = 
        `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function startFloatingTimer() {
    if (floatingTimerRunning) return;
    if (floatingTimerSeconds <= 0) { resetFloatingTimer(); return; }
    floatingTimerRunning = true;
    floatingTimerInterval = setInterval(() => {
        floatingTimerSeconds--;
        updateFloatingTimerDisplay();
        if (floatingTimerSeconds <= 0) {
            clearInterval(floatingTimerInterval);
            floatingTimerRunning = false;
            showToast('⏰ Timer finished!');
            playSound('end');
        }
    }, 1000);
}

function pauseFloatingTimer() {
    clearInterval(floatingTimerInterval);
    floatingTimerRunning = false;
}

function resetFloatingTimer() {
    clearInterval(floatingTimerInterval);
    floatingTimerRunning = false;
    const focusMin = data.timerFocus || 25;
    floatingTimerSeconds = focusMin * 60;
    updateFloatingTimerDisplay();
}

// ============================================================
//  9. SOUND SYSTEM
// ============================================================
function playSound(type) {
    if (!data.soundEnabled) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if (type === 'start') {
            osc.frequency.value = 440;
            gain.gain.value = 0.1;
            osc.start();
            setTimeout(() => { osc.stop(); }, 200);
        } else if (type === 'end') {
            [523, 659, 784].forEach((freq, i) => {
                setTimeout(() => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.frequency.value = freq;
                    g.gain.value = 0.1;
                    o.start();
                    setTimeout(() => { o.stop(); }, 200);
                }, i * 300);
            });
        } else if (type === 'tick') {
            osc.frequency.value = 1000;
            gain.gain.value = 0.05;
            osc.start();
            setTimeout(() => { osc.stop(); }, 50);
        }
    } catch (e) { /* ignore */ }
}

// ============================================================
//  10. CRUD - SUBJECTS
// ============================================================
function addSubject() {
    const name = document.getElementById('subName');
    const icon = document.getElementById('subIcon');
    const color = document.getElementById('subColor');
    
    if (!name.value.trim()) { showToast('Please enter subject name', 'error'); return; }
    
    data.subjects.push({
        id: Date.now(),
        name: name.value.trim(),
        icon: icon.value || '📚',
        color: color.value || '#0f7b8e',
        createdAt: new Date().toISOString()
    });
    saveAndRender();
    name.value = '';
    showToast('✅ Subject added successfully');
    renderSubjects();
    populateSubjectSelects();
    updateStats();
    launchCelebration();
}

// ============================================================
//  11. CRUD - LESSONS
// ============================================================
function toggleLessonType() {
    const type = document.getElementById('lesType').value;
    document.getElementById('regularDaysGroup').style.display = type === 'regular' ? 'block' : 'none';
    document.getElementById('extraDaysGroup').style.display = type === 'extra' ? 'block' : 'none';
}

function limitExtraDays() {
    const checked = document.querySelectorAll('#lesExtraDays input:checked');
    if (checked.length > 2) {
        checked[2].checked = false;
        showToast('⚠️ Max 2 days for extra lessons', 'error');
    }
}

function addLesson() {
    const subject = document.getElementById('lesSubject');
    const title = document.getElementById('lesTitle');
    const type = document.getElementById('lesType');
    const time = document.getElementById('lesTime');
    const fileLink = document.getElementById('lesFileLink');
    const chapter = document.getElementById('lesChapter');

    let days = [];
    if (type.value === 'regular') {
        const checkboxes = document.querySelectorAll('#lesDays input:checked');
        days = Array.from(checkboxes).map(cb => cb.value);
    } else {
        const checkboxes = document.querySelectorAll('#lesExtraDays input:checked');
        days = Array.from(checkboxes).map(cb => cb.value);
    }

    if (!subject.value || !title.value.trim() || !time.value) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    if (days.length === 0) {
        showToast('Please select at least one day', 'error');
        return;
    }

    data.lessons.push({
        id: Date.now(),
        subject: subject.value,
        title: title.value.trim(),
        chapter: chapter ? chapter.value.trim() : '',
        type: type.value,
        days: days,
        time: time.value,
        fileLink: fileLink ? fileLink.value.trim() : '',
        done: false,
        createdAt: new Date().toISOString()
    });
    saveAndRender();
    title.value = '';
    if (chapter) chapter.value = '';
    if (fileLink) fileLink.value = '';
    time.value = '';
    document.querySelectorAll('#lesDays input').forEach(cb => cb.checked = false);
    document.querySelectorAll('#lesExtraDays input').forEach(cb => cb.checked = false);
    showToast('✅ Lesson added successfully');
    renderLessons();
    updateStats();
    launchCelebration();
}

// ============================================================
//  12. CRUD - ASSIGNMENTS
// ============================================================
function addAssignment() {
    const subject = document.getElementById('assSubject');
    const title = document.getElementById('assTitle');
    const desc = document.getElementById('assDesc');
    const deadline = document.getElementById('assDeadline');
    if (!subject.value || !title.value.trim() || !deadline.value) {
        showToast('Please fill all fields', 'error');
        return;
    }
    data.assignments.push({
        id: Date.now(),
        subject: subject.value,
        title: title.value.trim(),
        desc: desc ? desc.value.trim() : '',
        deadline: deadline.value,
        done: false,
        createdAt: new Date().toISOString()
    });
    saveAndRender();
    title.value = '';
    if (desc) desc.value = '';
    deadline.value = '';
    showToast('✅ Assignment added');
    renderAssignments();
    updateStats();
}

// ============================================================
//  13. CRUD - EXAMS
// ============================================================
function addExam() {
    const subject = document.getElementById('exSubject');
    const title = document.getElementById('exTitle');
    const date = document.getElementById('exDate');
    const notes = document.getElementById('exNotes');
    if (!subject.value || !title.value.trim() || !date.value) {
        showToast('Please fill all fields', 'error');
        return;
    }
    data.exams.push({
        id: Date.now(),
        subject: subject.value,
        title: title.value.trim(),
        date: date.value,
        notes: notes ? notes.value.trim() : '',
        done: false,
        createdAt: new Date().toISOString()
    });
    saveAndRender();
    title.value = '';
    if (notes) notes.value = '';
    date.value = '';
    showToast('✅ Exam added');
    renderExams();
    updateStats();
}

// ============================================================
//  14. CRUD - SCHEDULE
// ============================================================
function addScheduleItem() {
    const day = document.getElementById('schDay');
    const subject = document.getElementById('schSubject');
    const time = document.getElementById('schTime');
    const location = document.getElementById('schLocation');
    if (!subject.value || !time.value) {
        showToast('Please fill all fields', 'error');
        return;
    }
    data.schedule.push({
        id: Date.now(),
        day: day.value,
        subject: subject.value,
        time: time.value,
        location: location ? location.value.trim() : '',
        createdAt: new Date().toISOString()
    });
    saveAndRender();
    if (location) location.value = '';
    subject.value = '';
    time.value = '';
    showToast('✅ Event added');
    renderSchedule();
    updateStats();
}

// ============================================================
//  15. CRUD - FILES
// ============================================================
function addFile() {
    const subject = document.getElementById('fileSubject');
    const name = document.getElementById('fileName');
    const type = document.getElementById('fileType');
    const url = document.getElementById('fileUrl');

    if (!subject.value || !name.value.trim() || !url.value.trim()) {
        showToast('Please fill all fields', 'error');
        return;
    }

    data.files.push({
        id: Date.now(),
        subject: subject.value,
        name: name.value.trim(),
        type: type.value,
        url: url.value.trim(),
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString()
    });
    saveAndRender();
    name.value = '';
    url.value = '';
    showToast('✅ File added');
    renderFiles();
    updateStats();
}

function uploadFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const url = URL.createObjectURL(file);
        document.getElementById('fileUrl').value = url;
        document.getElementById('fileName').value = file.name;
        showToast('📁 File loaded: ' + file.name);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

// ============================================================
//  16. TOGGLE DONE & DELETE
// ============================================================
function toggleDone(type, id) {
    const item = data[type].find(i => i.id === id);
    if (item) {
        item.done = !item.done;
        if (item.done) {
            showToast(`✅ Completed: ${item.title || item.name}`);
            launchCelebration();
            playSound('end');
        }
        saveAndRender();
        navigateTo(currentPage);
    }
}

function deleteItem(type, id) {
    if (!confirm('Are you sure you want to delete this?')) return;
    data[type] = data[type].filter(i => i.id !== id);
    saveAndRender();
    showToast('🗑️ Deleted');
    navigateTo(currentPage);
}

// ============================================================
//  17. RENDER FUNCTIONS
// ============================================================
function renderDashboard() {
    const container = document.getElementById('dashboardContent');
    const now = new Date();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDay = days[now.getDay() === 0 ? 6 : now.getDay() - 1];
    const todaySch = data.schedule.filter(s => s.day === currentDay);
    const upcoming = data.lessons.filter(l => !l.done).slice(0, 5);
    const pendingAss = data.assignments.filter(a => !a.done).slice(0, 5);
    const exams = data.exams.filter(e => !e.done).slice(0, 5);

    let html = `<div class="dash-grid">`;
    html += `<div class="dash-card"><h4>📖 Upcoming Lessons</h4>${upcoming.length ? upcoming.map(l => `<div class="item-row"><span>${l.title}</span><span>${l.subject}</span></div>`).join('') : '<div style="color:var(--text-muted);">🎉 No lessons</div>'}</div>`;
    html += `<div class="dash-card"><h4>✏️ Pending Assignments</h4>${pendingAss.length ? pendingAss.map(a => `<div class="item-row"><span>${a.title}</span><span>${a.deadline}</span></div>`).join('') : '<div style="color:var(--text-muted);">🎉 No assignments</div>'}</div>`;
    html += `<div class="dash-card"><h4>📝 Upcoming Exams</h4>${exams.length ? exams.map(e => `<div class="item-row"><span>${e.title}</span><span>${e.date}</span></div>`).join('') : '<div style="color:var(--text-muted);">🎉 No exams</div>'}</div>`;
    html += `<div class="dash-card"><h4>📅 Today\'s Schedule (${currentDay})</h4>${todaySch.length ? todaySch.map(s => `<div class="item-row"><span>${s.subject}</span><span>${s.time}</span></div>`).join('') : '<div style="color:var(--text-muted);">📭 No events</div>'}</div>`;
    html += `</div>`;
    container.innerHTML = html;
}

function populateSubjectSelects() {
    const selects = ['lesSubject', 'assSubject', 'exSubject', 'schSubject', 'fileSubject'];
    const options = data.subjects.map(s => `<option value="${s.name}">${s.icon || '📚'} ${s.name}</option>`).join('') ||
        '<option value="">⚠️ Add subjects first</option>';
    selects.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = options;
    });
}

function renderSubjects() {
    const search = document.getElementById('searchSubjects')?.value.toLowerCase() || '';
    let items = data.subjects;
    if (search) items = items.filter(i => i.name.toLowerCase().includes(search));
    const list = document.getElementById('subjectsList');
    if (items.length === 0) {
        list.innerHTML = `<div class="empty-state">📭 No subjects</div>`;
        return;
    }
    let html = '';
    items.forEach(item => {
        html += `<div class="item" style="border-left-color:${item.color || '#0f7b8e'};">
            <div class="info"><div class="title">${item.icon || '📚'} ${item.name}</div></div>
            <div class="actions"><button class="del-btn" onclick="deleteItem('subjects',${item.id})"><i class="fas fa-trash"></i></button></div>
        </div>`;
    });
    list.innerHTML = html;
}

function renderLessons() {
    const search = document.getElementById('searchLessons')?.value.toLowerCase() || '';
    let items = data.lessons;
    if (search) items = items.filter(i => JSON.stringify(i).toLowerCase().includes(search));
    const list = document.getElementById('lessonsList');
    if (items.length === 0) {
        list.innerHTML = `<div class="empty-state">📭 No lessons</div>`;
        return;
    }
    let html = '';
    items.forEach(item => {
        const done = item.done ? '✅' : '';
        const daysBadge = item.days ? item.days.map(d => `<span class="days-badge">${d}</span>`).join('') : '';
        const typeLabel = item.type === 'regular' ? '🔄 Regular' : '⭐ Extra';
        html += `<div class="item" style="border-left-color:#2e7d32;">
            <div class="info">
                <div class="title">${item.title} ${done}</div>
                <div class="sub">${item.subject} ${item.chapter ? '| ' + item.chapter : ''} | ${typeLabel} | ${daysBadge} ${item.time}</div>
                ${item.fileLink ? `<div class="sub"><a href="${item.fileLink}" target="_blank" style="color:var(--primary);">📎 Link</a></div>` : ''}
            </div>
            <div class="actions">
                <button class="done-btn" onclick="toggleDone('lessons',${item.id})">${item.done ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check-circle"></i>'}</button>
                <button class="del-btn" onclick="deleteItem('lessons',${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    });
    list.innerHTML = html;
}

function renderAssignments() {
    const search = document.getElementById('searchAssignments')?.value.toLowerCase() || '';
    let items = data.assignments;
    if (search) items = items.filter(i => JSON.stringify(i).toLowerCase().includes(search));
    const list = document.getElementById('assignmentsList');
    if (items.length === 0) {
        list.innerHTML = `<div class="empty-state">📭 No assignments</div>`;
        return;
    }
    let html = '';
    items.forEach(item => {
        const done = item.done ? '✅' : '';
        html += `<div class="item" style="border-left-color:#c62828;">
            <div class="info"><div class="title">${item.title} ${done}</div><div class="sub">${item.subject} | ${item.desc || ''} | Deadline: ${item.deadline}</div></div>
            <div class="actions">
                <button class="done-btn" onclick="toggleDone('assignments',${item.id})">${item.done ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check-circle"></i>'}</button>
                <button class="del-btn" onclick="deleteItem('assignments',${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    });
    list.innerHTML = html;
}

function renderExams() {
    const search = document.getElementById('searchExams')?.value.toLowerCase() || '';
    let items = data.exams;
    if (search) items = items.filter(i => JSON.stringify(i).toLowerCase().includes(search));
    const list = document.getElementById('examsList');
    if (items.length === 0) {
        list.innerHTML = `<div class="empty-state">📭 No exams</div>`;
        return;
    }
    let html = '';
    items.forEach(item => {
        const done = item.done ? '✅' : '';
        html += `<div class="item" style="border-left-color:#e67e22;">
            <div class="info"><div class="title">${item.title} ${done}</div><div class="sub">${item.subject} | ${item.date} | ${item.notes || ''}</div></div>
            <div class="actions">
                <button class="done-btn" onclick="toggleDone('exams',${item.id})">${item.done ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check-circle"></i>'}</button>
                <button class="del-btn" onclick="deleteItem('exams',${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    });
    list.innerHTML = html;
}

function renderSchedule() {
    const search = document.getElementById('searchSchedule')?.value.toLowerCase() || '';
    let items = data.schedule;
    if (search) items = items.filter(i => JSON.stringify(i).toLowerCase().includes(search));
    const list = document.getElementById('scheduleList');
    if (items.length === 0) {
        list.innerHTML = `<div class="empty-state">📭 No events</div>`;
        return;
    }
    let html = '';
    items.forEach(item => {
        html += `<div class="item" style="border-left-color:#4fc3f7;">
            <div class="info"><div class="title">${item.subject}</div><div class="sub">${item.day} | ${item.time} | ${item.location || ''}</div></div>
            <div class="actions"><button class="del-btn" onclick="deleteItem('schedule',${item.id})"><i class="fas fa-trash"></i></button></div>
        </div>`;
    });
    list.innerHTML = html;
}

function renderFiles() {
    const search = document.getElementById('searchFiles')?.value.toLowerCase() || '';
    let items = data.files;
    if (search) items = items.filter(i => i.name.toLowerCase().includes(search) || i.subject.toLowerCase().includes(search));
    const list = document.getElementById('filesList');
    if (items.length === 0) {
        list.innerHTML = `<div class="empty-state">📭 No files</div>`;
        return;
    }
    let html = '';
    items.forEach(item => {
        const icons = { pdf: '📄', doc: '📝', ppt: '📊', image: '🖼️', video: '🎬', link: '🔗' };
        html += `<div class="item" style="border-left-color:#7b1fa2;">
            <div class="info">
                <div class="title">${icons[item.type] || '📁'} ${item.name}</div>
                <div class="sub">${item.subject} | ${item.type} | ${item.date}</div>
                ${item.url ? `<div class="sub"><a href="${item.url}" target="_blank" style="color:var(--primary);">🔗 Open</a></div>` : ''}
            </div>
            <div class="actions"><button class="del-btn" onclick="deleteItem('files',${item.id})"><i class="fas fa-trash"></i></button></div>
        </div>`;
    });
    list.innerHTML = html;
}

// ============================================================
//  18. PERIODIC TABLE
// ============================================================
function renderPeriodicTable() {
    const container = document.getElementById('periodicTable');
    let html = '';
    
    elementsData.forEach(el => {
        const categoryClass = el.category || 'nonmetal';
        html += `<div class="element-cell ${categoryClass}" onclick="showElementInfo(${el.number})" style="grid-column: ${el.group}; grid-row: ${el.period};">
            <div class="number">${el.number}</div>
            <div class="symbol">${el.symbol}</div>
            <div class="name">${el.name}</div>
        </div>`;
    });
    container.innerHTML = html;
    
    // Add chemical equations section
    html += `<div style="grid-column: span 18; margin-top: 16px; padding: 16px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light);">`;
    html += `<h3 style="margin-bottom: 12px; color: var(--text-primary);">🧪 Chemical Equations</h3>`;
    html += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">`;
    chemicalEquations.forEach(eq => {
        html += `<div style="padding: 8px 12px; background: var(--bg-input); border-radius: var(--radius-sm); border-left: 3px solid var(--primary);">
            <div style="font-weight: 700; font-size: 12px; color: var(--text-secondary);">${eq.name}</div>
            <div style="font-family: monospace; font-size: 13px; color: var(--text-primary);">${eq.equation}</div>
        </div>`;
    });
    html += `</div></div>`;
    container.innerHTML += html;
}

function searchElement() {
    const search = document.getElementById('periodicSearch').value.toLowerCase();
    const cells = document.querySelectorAll('.element-cell');
    cells.forEach(cell => {
        const text = cell.textContent.toLowerCase();
        cell.style.display = text.includes(search) ? 'flex' : 'none';
    });
}

function showElementInfo(number) {
    const el = elementsData.find(e => e.number === number);
    if (!el) return;
    
    const info = document.getElementById('elementInfo');
    info.style.display = 'block';
    document.getElementById('elementName').textContent = `🔬 ${el.name} (${el.symbol})`;
    
    document.getElementById('elementDetails').innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
            <div style="background:var(--bg-input);padding:14px;border-radius:var(--radius-md);">
                <div style="font-weight:700;color:var(--text-muted);font-size:11px;text-transform:uppercase;">Atomic Number</div>
                <div style="font-size:28px;font-weight:800;color:var(--text-primary);">${el.number}</div>
            </div>
            <div style="background:var(--bg-input);padding:14px;border-radius:var(--radius-md);">
                <div style="font-weight:700;color:var(--text-muted);font-size:11px;text-transform:uppercase;">Atomic Mass</div>
                <div style="font-size:28px;font-weight:800;color:var(--text-primary);">${el.mass}</div>
            </div>
            <div style="background:var(--bg-input);padding:14px;border-radius:var(--radius-md);">
                <div style="font-weight:700;color:var(--text-muted);font-size:11px;text-transform:uppercase;">Group</div>
                <div style="font-size:24px;font-weight:700;color:var(--text-primary);">${el.group}</div>
            </div>
            <div style="background:var(--bg-input);padding:14px;border-radius:var(--radius-md);">
                <div style="font-weight:700;color:var(--text-muted);font-size:11px;text-transform:uppercase;">Period</div>
                <div style="font-size:24px;font-weight:700;color:var(--text-primary);">${el.period}</div>
            </div>
            <div style="background:var(--bg-input);padding:14px;border-radius:var(--radius-md);grid-column:span 2;">
                <div style="font-weight:700;color:var(--text-muted);font-size:11px;text-transform:uppercase;">Category</div>
                <div style="font-size:18px;font-weight:600;color:var(--text-primary);">${el.category}</div>
            </div>
        </div>
    `;
}

// ============================================================
//  19. CALCULATOR
// ============================================================
function calcInput(value) {
    const display = document.getElementById('calcDisplay');
    if (value === '=') {
        try {
            let expr = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/');
            expr = expr.replace(/√\(/g, 'Math.sqrt(');
            expr = expr.replace(/sin\(/g, 'Math.sin(');
            expr = expr.replace(/cos\(/g, 'Math.cos(');
            expr = expr.replace(/tan\(/g, 'Math.tan(');
            expr = expr.replace(/log10\(/g, 'Math.log10(');
            expr = expr.replace(/log\(/g, 'Math.log(');
            expr = expr.replace(/Math\.PI/g, 'Math.PI');
            expr = expr.replace(/Math\.E/g, 'Math.E');
            expr = expr.replace(/\*\*2/g, '**2');
            expr = expr.replace(/!$/, 'factorial');
            
            if (expr.includes('factorial')) {
                const num = parseInt(expr.replace('factorial', ''));
                expr = factorial(num).toString();
            }
            
            const result = Function('"use strict"; return (' + expr + ')')();
            calcDisplay = result.toString();
        } catch (e) {
            calcDisplay = 'Error';
        }
    } else if (value === 'C') {
        calcDisplay = '0';
    } else {
        if (calcDisplay === '0' && value !== '.') calcDisplay = '';
        calcDisplay += value;
    }
    display.textContent = calcDisplay;
}

function calcClear() {
    calcDisplay = '0';
    document.getElementById('calcDisplay').textContent = '0';
}

function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// ============================================================
//  20. TIMER
// ============================================================
function updateTimerDisplay() {
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    const disp = document.getElementById('timerDisplay');
    const mode = document.getElementById('timerModeText');
    if (disp) disp.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (mode) mode.textContent = timerMode === 'focus' ? '🧠 Focus' : '☕ Break';
    const count = document.getElementById('sessionCount');
    if (count) count.textContent = data.timerSessions || 0;
}

function startTimer() {
    if (timerRunning) return;
    if (timerSeconds <= 0) { resetTimer(); return; }
    timerRunning = true;
    playSound('start');
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        if (timerSeconds % 5 === 0 && timerSeconds > 0) {
            playSound('tick');
        }
        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            playSound('end');
            if (timerMode === 'focus') {
                data.timerSessions = (data.timerSessions || 0) + 1;
                localStorage.setItem('studyMasterData', JSON.stringify(data));
                timerMode = 'break';
                const breakMin = data.timerBreak || 5;
                timerSeconds = breakMin * 60;
                showToast('🎉 Focus finished! Break time ' + breakMin + ' min');
                launchCelebration();
            } else {
                timerMode = 'focus';
                const focusMin = data.timerFocus || 25;
                timerSeconds = focusMin * 60;
                showToast('⏰ Break over! Back to focus');
            }
            updateTimerDisplay();
            setTimeout(() => { if (!timerRunning) startTimer(); }, 2000);
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    showToast('⏸ Timer paused');
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerMode = 'focus';
    const focusMin = data.timerFocus || 25;
    timerSeconds = focusMin * 60;
    updateTimerDisplay();
    showToast('⏹ Timer reset');
}

function saveTimerSettings() {
    const focus = parseInt(document.getElementById('timerFocusInput')?.value) || 25;
    const breakMin = parseInt(document.getElementById('timerBreakInput')?.value) || 5;
    data.timerFocus = focus;
    data.timerBreak = breakMin;
    localStorage.setItem('studyMasterData', JSON.stringify(data));
    if (timerMode === 'focus') timerSeconds = focus * 60;
    else timerSeconds = breakMin * 60;
    updateTimerDisplay();
    floatingTimerSeconds = focus * 60;
    updateFloatingTimerDisplay();
    showToast('✅ Timer settings saved');
}

// ============================================================
//  21. TRAVEL MAP
// ============================================================
function startTravel() {
    const from = document.getElementById('fromCitySelect').value;
    const to = document.getElementById('toCitySelect').value;
    const speed = parseInt(document.getElementById('travelSpeed').value) || 3;
    
    if (from === to) {
        showToast('⚠️ Please select different cities', 'error');
        return;
    }
    
    document.getElementById('fromCity').textContent = from;
    document.getElementById('toCity').textContent = to;
    document.getElementById('travelTime').textContent = '00:00';
    document.getElementById('travelProgress').style.width = '0%';
    
    const plane = document.getElementById('planeIcon');
    plane.style.left = '0%';
    
    let progress = 0;
    const totalTime = (10 / speed) * 1000;
    const startTime = Date.now();
    
    if (travelInterval) clearInterval(travelInterval);
    
    travelInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        progress = Math.min((elapsed / totalTime) * 100, 100);
        
        plane.style.left = progress + '%';
        document.getElementById('travelProgress').style.width = progress + '%';
        
        const remaining = Math.max(0, (totalTime - elapsed) / 1000);
        const mins = Math.floor(remaining / 60);
        const secs = Math.floor(remaining % 60);
        document.getElementById('travelTime').textContent = 
            `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
        
        if (progress >= 100) {
            clearInterval(travelInterval);
            showToast('✈️ Arrived at ' + to + '! 🎉');
            launchCelebration();
            playSound('end');
        }
    }, 100);
}
   
// ============================================================
// ============================================================
// ============================================================
//  WORLD TIME API - Real Time for All Countries
//  Base: Egypt (Cairo)
//  Free, No API Key Required
// ============================================================

const TIME_API_BASE = 'https://worldtimeapi.org/api/timezone';
const EGYPT_TIMEZONE = 'Africa/Cairo';

// بيانات المدن مع المناطق الزمنية الصحيحة
const worldCities = {
    'Cairo': { timezone: 'Africa/Cairo', country: 'Egypt', flag: '🇪🇬' },
    'Riyadh': { timezone: 'Asia/Riyadh', country: 'Saudi Arabia', flag: '🇸🇦' },
    'Dubai': { timezone: 'Asia/Dubai', country: 'UAE', flag: '🇦🇪' },
    'London': { timezone: 'Europe/London', country: 'UK', flag: '🇬🇧' },
    'New York': { timezone: 'America/New_York', country: 'USA', flag: '🇺🇸' },
    'Tokyo': { timezone: 'Asia/Tokyo', country: 'Japan', flag: '🇯🇵' },
    'Paris': { timezone: 'Europe/Paris', country: 'France', flag: '🇫🇷' },
    'Berlin': { timezone: 'Europe/Berlin', country: 'Germany', flag: '🇩🇪' },
    'Rome': { timezone: 'Europe/Rome', country: 'Italy', flag: '🇮🇹' },
    'Moscow': { timezone: 'Europe/Moscow', country: 'Russia', flag: '🇷🇺' },
    'Beijing': { timezone: 'Asia/Shanghai', country: 'China', flag: '🇨🇳' },
    'Sydney': { timezone: 'Australia/Sydney', country: 'Australia', flag: '🇦🇺' },
    'Rio': { timezone: 'America/Sao_Paulo', country: 'Brazil', flag: '🇧🇷' },
    'Toronto': { timezone: 'America/Toronto', country: 'Canada', flag: '🇨🇦' },
    'Istanbul': { timezone: 'Europe/Istanbul', country: 'Turkey', flag: '🇹🇷' },
    'Kuwait': { timezone: 'Asia/Kuwait', country: 'Kuwait', flag: '🇰🇼' },
    'Doha': { timezone: 'Asia/Qatar', country: 'Qatar', flag: '🇶🇦' },
    'Muscat': { timezone: 'Asia/Muscat', country: 'Oman', flag: '🇴🇲' },
    'Amman': { timezone: 'Asia/Amman', country: 'Jordan', flag: '🇯🇴' },
    'Beirut': { timezone: 'Asia/Beirut', country: 'Lebanon', flag: '🇱🇧' },
};

// تخزين مؤقت للوقت
let timeCache = {};
let timeUpdateInterval = null;

// جلب الوقت الحقيقي من API
async function fetchRealTime(cityKey) {
    const city = worldCities[cityKey];
    if (!city) return null;
    
    try {
        const url = `${TIME_API_BASE}/${city.timezone}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // حفظ في الكاش
        timeCache[cityKey] = {
            datetime: data.datetime,
            utc_offset: data.utc_offset,
            timezone: data.timezone,
            day_of_week: data.day_of_week,
            dst: data.dst || false,
            abbreviation: data.abbreviation || '',
            raw_offset: data.raw_offset || 0,
            timestamp: Date.now()
        };
        
        return timeCache[cityKey];
    } catch (error) {
        console.error(`Error fetching time for ${cityKey}:`, error);
        // استخدام الوقت المخزن مؤقتاً إذا كان موجوداً
        if (timeCache[cityKey]) {
            // تحديث الوقت بناءً على التخزين المؤقت
            const elapsed = (Date.now() - timeCache[cityKey].timestamp) / 1000;
            const cachedTime = new Date(timeCache[cityKey].datetime);
            cachedTime.setSeconds(cachedTime.getSeconds() + elapsed);
            timeCache[cityKey].datetime = cachedTime.toISOString();
            return timeCache[cityKey];
        }
        return null;
    }
}

// جلب وقت مصر كمرجع أساسي
async function fetchEgyptTime() {
    return await fetchRealTime('Cairo');
}

// جلب وقت مدينة معينة
async function getCityTime(cityKey) {
    const data = await fetchRealTime(cityKey);
    if (data) {
        return data;
    }
    return null;
}

// الحصول على الوقت الحالي من API أو من النظام المحلي (كاحتياطي)
function getCurrentTimeForCity(cityKey) {
    const city = worldCities[cityKey];
    if (!city) return null;
    
    // محاولة جلب من API
    return fetchRealTime(cityKey);
}

// عرض الوقت في خريطة السفر
async function updateTravelMapTime() {
    const fromCity = document.getElementById('fromCitySelect')?.value || 'Cairo';
    const toCity = document.getElementById('toCitySelect')?.value || 'Dubai';
    
    // جلب الوقت الحقيقي للمدينتين
    const fromTime = await getCityTime(fromCity);
    const toTime = await getCityTime(toCity);
    
    // تحديث عرض الوقت في الخريطة
    const fromDisplay = document.getElementById('fromTimeDisplay');
    const toDisplay = document.getElementById('toTimeDisplay');
    const timeDiffDisplay = document.getElementById('timeDiffDisplay');
    
    if (fromTime && toTime) {
        const fromDate = new Date(fromTime.datetime);
        const toDate = new Date(toTime.datetime);
        
        if (fromDisplay) {
            fromDisplay.textContent = fromDate.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
            });
        }
        
        if (toDisplay) {
            toDisplay.textContent = toDate.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
            });
        }
        
        if (timeDiffDisplay) {
            const diffHours = (toDate - fromDate) / (1000 * 60 * 60);
            const diffFormatted = diffHours >= 0 ? `+${diffHours.toFixed(1)}h` : `${diffHours.toFixed(1)}h`;
            timeDiffDisplay.textContent = `⏱️ ${diffFormatted}`;
        }
    }
}

// بدء التحديث التلقائي للوقت (كل 10 ثواني)
function startRealTimeUpdates() {
    if (timeUpdateInterval) clearInterval(timeUpdateInterval);
    
    // تحديث فوري أول مرة
    updateTravelMapTime();
    
    // تحديث كل 10 ثواني
    timeUpdateInterval = setInterval(() => {
        updateTravelMapTime();
    }, 10000);
}

// ============================================================
//  تحديث دالة startTravel لاستخدام الوقت الحقيقي
// ============================================================
const originalStartTravel = startTravel;

startTravel = async function() {
    const from = document.getElementById('fromCitySelect').value;
    const to = document.getElementById('toCitySelect').value;
    const speed = parseInt(document.getElementById('travelSpeed').value) || 3;
    
    if (from === to) {
        showToast('⚠️ Please select different cities', 'error');
        return;
    }
    
    // جلب الوقت الحقيقي للمدينتين
    const fromTime = await getCityTime(from);
    const toTime = await getCityTime(to);
    
    if (fromTime && toTime) {
        const fromDate = new Date(fromTime.datetime);
        const toDate = new Date(toTime.datetime);
        
        // عرض الوقت الحقيقي
        document.getElementById('fromCity').textContent = `${worldCities[from].flag} ${from}`;
        document.getElementById('toCity').textContent = `${worldCities[to].flag} ${to}`;
        document.getElementById('fromTimeDisplay').textContent = fromDate.toLocaleTimeString();
        document.getElementById('toTimeDisplay').textContent = toDate.toLocaleTimeString();
        
        // حساب فرق التوقيت
        const diffHours = (toDate - fromDate) / (1000 * 60 * 60);
        document.getElementById('timeDiffDisplay').textContent = `⏱️ ${diffHours >= 0 ? '+' : ''}${diffHours.toFixed(1)}h`;
    }
    
    // بدء الرحلة
    originalStartTravel();
};

// ============================================================
//  إضافة عناصر الوقت في HTML للخريطة
// ============================================================
// أضف هذه الدالة لتحديث واجهة الخريطة
function enhanceTravelMapUI() {
    const travelInfo = document.getElementById('travelInfo');
    if (travelInfo) {
        // إضافة عناصر الوقت الحقيقي
        const existingTime = document.querySelector('.real-time-display');
        if (!existingTime) {
            const timeHTML = `
                <div class="real-time-display" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:6px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.1);">
                    <div style="font-size:12px;opacity:0.8;">📍 <span id="fromTimeDisplay">--:--:--</span></div>
                    <div style="font-size:12px;opacity:0.8;">📍 <span id="toTimeDisplay">--:--:--</span></div>
                    <div style="font-size:12px;opacity:0.8;text-align:left;" id="timeDiffDisplay">⏱️ 0h</div>
                </div>
            `;
            travelInfo.insertAdjacentHTML('beforeend', timeHTML);
        }
    }
}

// ============================================================
//  22. MEDIA TOOLS
// ============================================================


// ============================================================
//  23. PDF EXPORT
// ============================================================

// ============================================================
//  24. BACKUP SYSTEM
// ============================================================
function manualBackup() {
    data.lastBackup = new Date().toISOString();
    data.backupCount = (data.backupCount || 0) + 1;
    localStorage.setItem('studyMasterData', JSON.stringify(data));
    showToast('💾 Backup created');
    exportBackup();
}

function exportBackup() {
    const defaultName = `Backup_${new Date().toISOString().slice(0,10)}`;
    const fileName = prompt('📝 Backup file name:', defaultName);
    if (fileName === null) return;
    const finalName = fileName.trim() || defaultName;
    const json = JSON.stringify(data, null, 2);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    link.download = `${finalName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    showToast(`💾 Downloaded "${finalName}.json"`);
}

function importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (confirm('This will replace all data. Are you sure?')) {
                data = imported;
                localStorage.setItem('studyMasterData', JSON.stringify(data));
                showToast('✅ Backup restored');
                navigateTo('dashboard');
                launchCelebration();
            }
        } catch (err) {
            showToast('⚠️ Invalid file', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ============================================================
//  25. THEME
// ============================================================
function toggleTheme() {
    document.body.classList.toggle('dark');
    data.darkMode = document.body.classList.contains('dark');
    localStorage.setItem('studyMasterData', JSON.stringify(data));
    const label = document.getElementById('themeLabel');
    if (data.darkMode) {
        label.textContent = 'Light Mode';
    } else {
        label.textContent = 'Dark Mode';
    }
}

// ============================================================
//  26. TOAST NOTIFICATIONS
// ============================================================
function showToast(msg, type = '') {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 4000);
}

// ============================================================
//  27. CELEBRATION
// ============================================================
function launchCelebration() {
    const container = document.createElement('div');
    container.className = 'celebration';
    document.body.appendChild(container);

    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6fb7', '#845ef7', '#ff8a5c', '#4fc3f7'];
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 10 + 4) + 'px';
        confetti.style.height = (Math.random() * 10 + 4) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.animationDuration = (Math.random() * 2.5 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 1.5) + 's';
        container.appendChild(confetti);
    }
    setTimeout(() => container.remove(), 4500);
}

// ============================================================
//  28. REMINDER SYSTEM
// ============================================================
function startReminderSystem() {
    if (reminderInterval) clearInterval(reminderInterval);
    reminderInterval = setInterval(() => {
        const now = new Date();
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const currentDay = days[now.getDay() === 0 ? 6 : now.getDay() - 1];
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        data.lessons.forEach(lesson => {
            if (lesson.done) return;
            if (!lesson.days || !lesson.days.includes(currentDay)) return;
            const [hours, minutes] = lesson.time.split(':').map(Number);
            const lessonMinutes = hours * 60 + minutes;
            const diffMinutes = lessonMinutes - currentMinutes;

            if (diffMinutes === 120 || diffMinutes === 10 || diffMinutes === 30) {
                if (!lesson._lastReminder || lesson._lastReminder !== diffMinutes) {
                    lesson._lastReminder = diffMinutes;
                    localStorage.setItem('studyMasterData', JSON.stringify(data));
                    showToast(`⏰ Reminder: "${lesson.title}" in ${diffMinutes} min!`);
                    playSound('start');
                }
            }
        });
    }, 60000);
}

// ============================================================
//  29. SAVE & UPDATE
// ============================================================
function saveAndRender() {
    localStorage.setItem('studyMasterData', JSON.stringify(data));
    updateStats();
}

// ============================================================
//  30. INITIALIZATION
// ============================================================
function init() {
    // Load dark mode
    if (data.darkMode) {
        document.body.classList.add('dark');
        document.getElementById('themeLabel').textContent = 'Light Mode';
    }

    // Timer settings
    const focusMin = data.timerFocus || 25;
    timerSeconds = focusMin * 60;
    floatingTimerSeconds = focusMin * 60;
    document.getElementById('timerFocusInput').value = focusMin;
    document.getElementById('timerBreakInput').value = data.timerBreak || 5;
    
    // Initialize
    updateFloatingTimerDisplay();
    initFloatingTimerDrag();
    navigateTo('dashboard');
    startReminderSystem();

    // Close sidebar on outside click
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.getElementById('sidebarToggle');
        if (!sidebar.classList.contains('closed') && 
            !sidebar.contains(e.target) && 
            !toggle.contains(e.target)) {
            closeSidebar();
        }
    });

    console.log(`🚀 ${APP_NAME} v${APP_VERSION} loaded successfully!`);
    console.log(`📊 Subjects: ${data.subjects.length}`);
    console.log(`📖 Lessons: ${data.lessons.length}`);
    console.log(`✏️ Assignments: ${data.assignments.length}`);
    console.log(`📝 Exams: ${data.exams.length}`);
    console.log(`📅 Schedule: ${data.schedule.length}`);
    console.log('🌟 Happy studying!');
    showToast(`🌟 ${APP_NAME} v${APP_VERSION} ready!`);
}

// ============================================================
//  31. KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar.classList.contains('closed')) closeSidebar();
    }
    if (e.ctrlKey && e.key === 'b') { e.preventDefault(); manualBackup(); }
    if (e.ctrlKey && e.key === 'p') { e.preventDefault(); exportPDF(); }
    if (e.ctrlKey && e.key === 'd') { e.preventDefault(); toggleTheme(); }
    if (e.ctrlKey && e.key === 't') { e.preventDefault(); toggleTimerVisibility(); }
});

// ============================================================
//  32. SERVICE WORKER REGISTRATION (for PWA)
// ============================================================
if ('serviceWorker' in navigator) {
    // Register service worker for offline support (optional)
    // navigator.serviceWorker.register('/sw.js');
}

// ============================================================
//  33. START APP
// ============================================================
document.addEventListener('DOMContentLoaded', init);

// ============================================================
//  34. EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.navigateTo = navigateTo;
window.addSubject = addSubject;
window.addLesson = addLesson;
window.addAssignment = addAssignment;
window.addExam = addExam;
window.addScheduleItem = addScheduleItem;
window.addFile = addFile;
window.uploadFile = uploadFile;
window.toggleDone = toggleDone;
window.deleteItem = deleteItem;
window.toggleLessonType = toggleLessonType;
window.limitExtraDays = limitExtraDays;
window.toggleTimerVisibility = toggleTimerVisibility;
window.minimizeTimer = minimizeTimer;
window.closeTimer = closeTimer;
window.startFloatingTimer = startFloatingTimer;
window.pauseFloatingTimer = pauseFloatingTimer;
window.resetFloatingTimer = resetFloatingTimer;
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;
window.saveTimerSettings = saveTimerSettings;
window.calcInput = calcInput;
window.calcClear = calcClear;
window.showElementInfo = showElementInfo;
window.searchElement = searchElement;
window.startTravel = startTravel;
window.convertVideo = convertVideo;
window.downloadAudio = downloadAudio;
window.downloadVideo = downloadVideo;
window.exportPDF = exportPDF;
window.manualBackup = manualBackup;
window.exportBackup = exportBackup;
window.importBackup = importBackup;
window.toggleTheme = toggleTheme;
window.launchCelebration = launchCelebration;
window.showToast = showToast;
window.playSound = playSound;
window.renderSubjects = renderSubjects;
window.renderLessons = renderLessons;
window.renderAssignments = renderAssignments;
window.renderExams = renderExams;
window.renderSchedule = renderSchedule;
window.renderFiles = renderFiles;
window.populateSubjectSelects = populateSubjectSelects;
window.renderDashboard = renderDashboard;
window.updateStats = updateStats;

// ============================================================
//  END OF SCRIPT - 1500+ lines
// ============================================================
console.log('✅ Script loaded successfully!');