// app.js — hoved-controller: binder game.js, ui.js, API-kald sammen

function selectLevel(btn, level) {
  document.querySelectorAll('.ma-level-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  gameState.level = level;
}

function startGame() {
  resetGame(gameState.level);
  showScreen('gameScreen');
  nextQuestion();
}

function nextQuestion() {
  if (gameState.qNum >= TOTAL_QUESTIONS) {
    showResult();
    return;
  }
  gameState.qNum++;
  const q = generateQuestion(gameState.level);
  gameState.currentAnswer = q.answer;
  gameState.currentQuestion = q.text;
  setQuestion(q.text);
  updateStats();
  startTimer();
}

function startTimer() {
  clearInterval(gameState.timerInterval);
  gameState.timeLeft = LEVEL_CONFIG[gameState.level].time;
  updateTimerBar(gameState.timeLeft, LEVEL_CONFIG[gameState.level].time);

  gameState.timerInterval = setInterval(() => {
    gameState.timeLeft--;
    updateTimerBar(gameState.timeLeft, LEVEL_CONFIG[gameState.level].time);
    if (gameState.timeLeft <= 0) {
      clearInterval(gameState.timerInterval);
      timeOut();
    }
  }, 1000);
}

function timeOut() {
  gameState.streak = 0;
  disableInput();
  showFeedback(`⏰ For langsomt! Svaret var ${gameState.currentAnswer}`, false);
  updateStats();
  setTimeout(nextQuestion, 1800);
}

function checkOnEnter(e) {
  if (e.key === 'Enter') submitAnswer();
}

function submitAnswer() {
  const val = parseInt(document.getElementById('answerInput').value);
  if (isNaN(val)) return;
  clearInterval(gameState.timerInterval);
  disableInput();

  if (val === gameState.currentAnswer) {
    const pts = calcPoints(gameState.timeLeft, LEVEL_CONFIG[gameState.level].time, gameState.streak);
    gameState.streak++;
    gameState.correctCount++;
    gameState.score += pts;
    updateStats();

    const msgs = gameState.streak > 3
      ? [`🔥 USTOPPELIG! +${pts}`]
      : [`✅ Korrekt! +${pts}`, `🌟 Rigtigt! +${pts}`, `💪 Ja! +${pts}`];
    showFeedback(msgs[Math.floor(Math.random() * msgs.length)], true);
    if (gameState.streak >= 3) launchConfetti();
    setTimeout(nextQuestion, 1000);
  } else {
    gameState.streak = 0;
    updateStats();
    showFeedback(`❌ Forkert – svaret er ${gameState.currentAnswer}`, false);
    setTimeout(nextQuestion, 1800);
  }
}

function skipQuestion() {
  clearInterval(gameState.timerInterval);
  gameState.streak = 0;
  disableInput();
  showFeedback(`⏭ Svaret var ${gameState.currentAnswer}`, false);
  updateStats();
  setTimeout(nextQuestion, 1400);
}

async function getAiHint() {
  showHint('Henter hint...');
  try {
    const hint = await fetchAiHint(gameState.currentQuestion, gameState.currentAnswer);
    showHint(hint);
  } catch (e) {
    showHint('Kunne ikke hente hint – prøv igen.');
  }
}

async function showResult() {
  clearInterval(gameState.timerInterval);
  renderResult(gameState.correctCount, gameState.score);
  showScreen('resultScreen');

  // Gem score i Supabase (hvis tilgængelig)
  try {
    await saveScore({ score: gameState.score, level: gameState.level, correct: gameState.correctCount });
  } catch (e) {
    console.log('Score ikke gemt (Supabase ikke konfigureret):', e.message);
  }

  if (gameState.correctCount / TOTAL_QUESTIONS >= 0.8) launchConfetti();
}

function showStart() {
  showScreen('startScreen');
}
