// ui.js — al DOM-manipulation

function showScreen(id) {
  document.querySelectorAll('.ma-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function updateStats() {
  document.getElementById('scoreDisp').textContent = gameState.score;
  document.getElementById('qNumDisp').textContent = `${gameState.qNum}/${TOTAL_QUESTIONS}`;
  document.getElementById('streakDisp').textContent = gameState.streak;
}

function setQuestion(text) {
  document.getElementById('questionText').textContent = text;
  document.getElementById('feedbackText').textContent = '';
  document.getElementById('feedbackText').className = 'ma-feedback';
  document.getElementById('answerInput').value = '';
  document.getElementById('answerInput').disabled = false;
  document.getElementById('aiHintBox').style.display = 'none';
  document.getElementById('answerInput').focus();
}

function showFeedback(msg, correct) {
  const el = document.getElementById('feedbackText');
  el.textContent = msg;
  el.className = 'ma-feedback ' + (correct ? 'correct' : 'wrong');
}

function disableInput() {
  document.getElementById('answerInput').disabled = true;
}

function updateTimerBar(timeLeft, timerSecs) {
  const pct = Math.max(0, (timeLeft / timerSecs) * 100);
  const fill = document.getElementById('timerFill');
  fill.style.width = pct + '%';
  fill.style.background = pct > 50 ? '#7F77DD' : pct > 25 ? '#EF9F27' : '#E24B4A';
  updateStars(pct);
}

function updateStars(pct) {
  const stars = document.querySelectorAll('.ma-star');
  const lit = pct > 80 ? 5 : pct > 60 ? 4 : pct > 40 ? 3 : pct > 20 ? 2 : 1;
  stars.forEach((s, i) => s.classList.toggle('lit', i < lit));
}

function showHint(text) {
  const box = document.getElementById('aiHintBox');
  box.textContent = '💡 ' + text;
  box.style.display = 'block';
}

function renderResult(correctCount, score) {
  const pct = correctCount / TOTAL_QUESTIONS;
  const data = pct === 1
    ? { title: 'Perfekt runde! 🏆', mascot: '🤖', msg: 'Robotten er slået – flot!' }
    : pct >= 0.8
    ? { title: 'Imponerende!', mascot: '😎', msg: 'Næsten perfekt – godt gået!' }
    : pct >= 0.5
    ? { title: 'Godt forsøg!', mascot: '🙂', msg: 'Fortsæt øvelsen!' }
    : { title: 'Øv dig lidt mere', mascot: '💡', msg: `${correctCount} ud af ${TOTAL_QUESTIONS} rigtige` };

  document.getElementById('resultTitle').textContent = data.title;
  document.getElementById('resultMascot').textContent = data.mascot;
  document.getElementById('resultScore').textContent = score;
  document.getElementById('resultMsg').textContent = data.msg;

  const badges = [];
  if (correctCount === TOTAL_QUESTIONS) badges.push('🏆 Perfekt!');
  if (score > 100) badges.push('💰 100+ point');
  if (gameState.streak >= 3) badges.push('🔥 Streakmaster');
  if (gameState.level === 'svær' && correctCount >= 7) badges.push('🧠 Matematikhelt');

  document.getElementById('badgesRow').innerHTML =
    badges.map(b => `<span class="ma-badge">${b}</span>`).join('');
}
