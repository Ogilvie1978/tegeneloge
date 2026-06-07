// confetti.js — konfetti-animation

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#7F77DD','#1D9E75','#EF9F27','#D85A30','#E24B4A','#AFA9EC','#5DCAA5'];
  const pieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: -10,
    r: Math.random() * 7 + 4,
    c: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 4 + 2,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 8,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.vy += 0.08;
    });
    frame++;
    if (frame < 130) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}
