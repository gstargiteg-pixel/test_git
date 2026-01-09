// Keyboard Layout Data (QWERTY + Hangul 2-Set)
const keyboardLayout = [
    [
        { en: '`', ko: '~' }, { en: '1', ko: '!' }, { en: '2', ko: '@' }, { en: '3', ko: '#' },
        { en: '4', ko: '$' }, { en: '5', ko: '%' }, { en: '6', ko: '^' }, { en: '7', ko: '&' },
        { en: '8', ko: '*' }, { en: '9', ko: '(' }, { en: '0', ko: ')' }, { en: '-', ko: '_' },
        { en: '=', ko: '+' }, { en: 'Backspace', width: 2 }
    ],
    [
        { en: 'Tab', width: 1.5 }, { en: 'q', ko: 'ㅂ' }, { en: 'w', ko: 'ㅈ' }, { en: 'e', ko: 'ㄷ' },
        { en: 'r', ko: 'ㄱ' }, { en: 't', ko: 'ㅅ' }, { en: 'y', ko: 'ㅛ' }, { en: 'u', ko: 'ㅕ' },
        { en: 'i', ko: 'ㅑ' }, { en: 'o', ko: 'ㅐ' }, { en: 'p', ko: 'ㅔ' }, { en: '[', ko: '{' },
        { en: ']', ko: '}' }, { en: '\\', ko: '|', width: 1 }
    ],
    [
        { en: 'Caps Lock', width: 1.8 }, { en: 'a', ko: 'ㅁ' }, { en: 's', ko: 'ㄴ' }, { en: 'd', ko: 'ㅇ' },
        { en: 'f', ko: 'ㄹ' }, { en: 'g', ko: 'ㅎ' }, { en: 'h', ko: 'ㅗ' }, { en: 'j', ko: 'ㅓ' },
        { en: 'k', ko: 'ㅏ' }, { en: 'l', ko: 'ㅣ' }, { en: ';', ko: ':' }, { en: "'", ko: '"' },
        { en: 'Enter', width: 2.2 }
    ],
    [
        { en: 'Shift', width: 2.4 }, { en: 'z', ko: 'ㅋ' }, { en: 'x', ko: 'ㅌ' }, { en: 'c', ko: 'ㅊ' },
        { en: 'v', ko: 'ㅍ' }, { en: 'b', ko: 'ㅠ' }, { en: 'n', ko: 'ㅜ' }, { en: 'm', ko: 'ㅡ' },
        { en: ',', ko: '<' }, { en: '.', ko: '>' }, { en: '/', ko: '?' }, { en: 'Shift', width: 2.4 }
    ],
    [
        { en: 'Ctrl', width: 1.5 }, { en: 'Alt', width: 1.5 }, { en: 'Space', width: 6 },
        { en: 'Alt', width: 1.5 }, { en: 'Ctrl', width: 1.5 }
    ]
];

// Sample Words
const words = ["솔숲", "개구쟁이", "호랑이", "대한민국", "컴퓨터", "바다", "하늘", "꽃", "사랑", "우주", "별", "달"];
let currentWordIndex = 0;
let startTime = null;
let typedCount = 0;
let correctCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    initKeyboard();
    loadNextWord();

    const input = document.getElementById('typing-input');

    // Always focus input
    document.addEventListener('click', () => input.focus());
    input.focus();

    input.addEventListener('input', (e) => {
        const val = e.target.value;
        const currentTarget = document.getElementById('current-word').textContent;

        if (!startTime) startTimer();

        // Highlight keys based on last char typed (simplified)
        if (val.length > 0) {
            const lastChar = val[val.length - 1];
            // highlightKey(lastChar); 
        }

        // Check if word matches (simplified logic for exact match)
        if (val === currentTarget) {
            correctCount++;
            typedCount += val.length;
            loadNextWord();
            input.value = '';
            updateStats();
        }
    });

    // Keydown for highlighting
    document.addEventListener('keydown', (e) => {
        highlightKey(e.key.toLowerCase());
    });

    document.addEventListener('keyup', (e) => {
        unhighlightKey(e.key.toLowerCase());
    });
});

function initKeyboard() {
    const keyboardContainer = document.getElementById('keyboard');

    keyboardLayout.forEach(row => {
        const rowEl = document.createElement('div');
        rowEl.className = 'row';

        row.forEach(key => {
            const keyEl = document.createElement('div');
            keyEl.className = 'key';
            if (key.width) keyEl.style.flexGrow = key.width;
            if (['Backspace', 'Tab', 'Caps Lock', 'Enter', 'Shift', 'Ctrl', 'Alt'].includes(key.en)) {
                keyEl.classList.add('special');
                keyEl.textContent = key.en;
                keyEl.dataset.key = key.en.toLowerCase();
            } else if (key.en === 'Space') {
                keyEl.dataset.key = ' ';
            } else {
                // Show dual characters
                keyEl.innerHTML = `<span class="top-char">${key.ko || ''}</span><span class="bottom-char">${key.en.toUpperCase()}</span>`;
                keyEl.dataset.key = key.en;
            }
            rowEl.appendChild(keyEl);
        });
        keyboardContainer.appendChild(rowEl);
    });
}

function loadNextWord() {
    const wordDisplay = document.getElementById('current-word');
    const word = words[Math.floor(Math.random() * words.length)];
    wordDisplay.textContent = word;
}

function highlightKey(key) {
    if (key === ' ') key = 'Space';
    // Simplified mapping for Hangul to QWERTY key if needed
    // For now, relies on 'keydown' returning QWERTY codes even in KR mode mostly, 
    // but typically browsers return the resulting char. This is a complex topic (Hangul decomposition).
    // Start with basic visual feedback for QWERTY keys.
    const keyEl = document.querySelector(`.key[data-key="${key}"]`);
    if (keyEl) keyEl.classList.add('active');
}

function unhighlightKey(key) {
    if (key === ' ') key = 'Space';
    const keyEl = document.querySelector(`.key[data-key="${key}"]`);
    if (keyEl) keyEl.classList.remove('active');
}

function startTimer() {
    startTime = Date.now();
    setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('time').textContent = formatTime(elapsed);

        // Approx CPM
        if (elapsed > 0) {
            const cpm = Math.floor((typedCount / elapsed) * 60);
            document.getElementById('cpm').textContent = cpm;
        }
    }, 1000);
}

function updateStats() {
    // Updates accuracy, etc.
}

function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}
