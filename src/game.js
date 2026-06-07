// game.js — spilmotor: spørgsmål, timer, point

const TOTAL_QUESTIONS = 10;

const LEVEL_CONFIG = {
  let:    { time: 15, range: [1, 10],  ops: ['+', '-'] },
  mellem: { time: 12, range: [2, 20],  ops: ['+', '-', '×'] },
  svær:   { time: 9,  range: [5, 50],  ops: ['+', '-', '×', '÷'] },
};

let gameState = {
  level: 'let',
  score: 0,
  qNum: 0,
  streak: 0,
  correctCount: 0,
  currentAnswer: 0,
  currentQuestion: '',
  timerInterval: null,
  timeLeft: 15,
  active: false,
};

function rnd(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function generateQuestion(level) {
  const cfg = LEVEL_CONFIG[level];
  const ops = cfg.ops;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;

  if (op === '×') {
    a = rnd(2, level === 'svær' ? 12 : 10);
    b = rnd(2, level === 'svær' ? 12 : 10);
    answer = a * b;
  } else if (op === '÷') {
    b = rnd(2, 12);
    answer = rnd(2, 12);
    a = b * answer;
  } else {
    a = rnd(...cfg.range);
    b = rnd(...cfg.range);
    if (op === '-' && b > a) [a, b] = [b, a];
    answer = op === '+' ? a + b : a - b;
  }

  return { text: `${a} ${op} ${b} = ?`, answer };
}

function calcPoints(timeLeft, timerSecs, streak) {
  const timeBonus = Math.round((timeLeft / timerSecs) * 10);
  const streakBonus = streak > 2 ? 5 : 0;
  return 10 + timeBonus + streakBonus;
}

function resetGame(level) {
  gameState = {
    level,
    score: 0,
    qNum: 0,
    streak: 0,
    correctCount: 0,
    currentAnswer: 0,
    currentQuestion: '',
    timerInterval: null,
    timeLeft: LEVEL_CONFIG[level].time,
    active: true,
  };
}
