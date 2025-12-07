// ===== GAME VARIABLES =====
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let gameState = 'menu';
let currentNight = 1;
const TOTAL_NIGHTS = 50;
let lives = 5;
let score = 0;
let timeLeft = 30;
let gameTimer = null;
let nightTimer = null;

// SHOP VARIABLES
let playerDiamonds = 0;
let currentSkin = 'default';
let boughtSkins = ['default'];

// 👈 MISSIONS TRACKING
let missionProgress = {};
let completedMissions = {};

// Player
const player = {
  x: canvas.width / 2,
  y: canvas.height - 40,
  width: 30,
  height: 30,
  speed: 7,
  dx: 0,
  rotation: 0,
  isMoving: false,
  movingDirection: 0
};

// Meteors
let meteors = [];
let meteorSpawnRate = 1;
let difficulty = 1;
let meteorsDestroyedThisNight = 0;

// SKINS DATA
const SKINS = [
  {
    id: 'default',
    name: 'Default',
    price: 0,
    color: '#00FF00',
    description: 'Standart skin'
  },
  {
    id: 'gold',
    name: 'Gold Diamond',
    price: 35000,
    color: '#FFD700',
    description: 'Oltin rangda olmos'
  },
  {
    id: 'ruby',
    name: 'Ruby Fire',
    price: 50000,
    color: '#FF1744',
    description: 'Qizil olovli olmos'
  },
  {
    id: 'sapphire',
    name: 'Sapphire Sky',
    price: 45000,
    color: '#2196F3',
    description: 'Ko\'k osmon olmos'
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    price: 42000,
    color: '#00C853',
    description: 'Yashil emerald'
  },
  {
    id: 'amethyst',
    name: 'Amethyst Purple',
    price: 48000,
    color: '#9C27B0',
    description: 'Binafsha olmos'
  },
  {
    id: 'diamond',
    name: 'Pure Diamond',
    price: 60000,
    color: '#00FFFF',
    description: 'Sof olmosni'
  },
  {
    id: 'titanium',
    name: 'Titanium Steel',
    price: 55000,
    color: '#9E9E9E',
    description: 'Titanium metalik'
  },
  {
    id: 'neon',
    name: 'Neon Pink',
    price: 52000,
    color: '#FF00FF',
    description: 'Qarang\'il oq\'roq\''
  },
  {
    id: 'plasma',
    name: 'Plasma Storm',
    price: 65000,
    color: '#00FF7F',
    description: 'Plasmali yilqini'
  },
  {
    id: 'shadow',
    name: 'Shadow Black',
    price: 38000,
    color: '#1A1A1A',
    description: 'Qora shadow'
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    price: 41000,
    color: '#FF6B35',
    description: 'Quyosh botayotgan rangida'
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    price: 47000,
    color: '#0077BE',
    description: 'Okeanni ko\'k'
  },
  {
    id: 'forest',
    name: 'Forest Green',
    price: 43000,
    color: '#2D5016',
    description: 'O\'rmonni yashili'
  },
  {
    id: 'volcano',
    name: 'Volcano Red',
    price: 58000,
    color: '#E74C3C',
    description: 'Vulkan qizargan'
  }
];

// MISSIONS DATA
const MISSIONS = [
  {
    id: 1,
    name: 'Night 5',
    description: 'Night 5 gacha yetib kor',
    levels: [
      { level: 1, target: 2, reward: 500 },
      { level: 2, target: 3, reward: 1000 },
      { level: 3, target: 5, reward: 2000 }
    ],
    type: 'nights'
  },
  {
    id: 2,
    name: 'Night 10',
    description: 'Night 10 gacha yetib kor',
    levels: [
      { level: 1, target: 5, reward: 1500 },
      { level: 2, target: 7, reward: 2500 },
      { level: 3, target: 10, reward: 4000 }
    ],
    type: 'nights'
  },
  {
    id: 3,
    name: 'Night 15',
    description: 'Night 15 gacha yetib kor',
    levels: [
      { level: 1, target: 10, reward: 2500 },
      { level: 2, target: 12, reward: 4000 },
      { level: 3, target: 15, reward: 6000 }
    ],
    type: 'nights'
  },
  {
    id: 4,
    name: 'Survivor',
    description: 'Yaxshi qochuvchi bo\'lishni',
    levels: [
      { level: 1, target: 100, reward: 2000 },
      { level: 2, target: 300, reward: 5000 },
      { level: 3, target: 500, reward: 10000 }
    ],
    type: 'meteors'
  },
  {
    id: 5,
    name: 'Night Runner',
    description: '3ta tunni bir satrida tugat',
    levels: [
      { level: 1, target: 3, reward: 1000 },
      { level: 2, target: 5, reward: 2500 },
      { level: 3, target: 10, reward: 5000 }
    ],
    type: 'nights_consecutive'
  },
  {
    id: 6,
    name: 'Diamond Collector',
    description: 'Ko\'p olmos to\'pla',
    levels: [
      { level: 1, target: 50000, reward: 5000 },
      { level: 2, target: 100000, reward: 10000 },
      { level: 3, target: 200000, reward: 20000 }
    ],
    type: 'diamonds'
  },
  {
    id: 7,
    name: 'Night 20',
    description: 'Night 20 gacha yetib kor',
    levels: [
      { level: 1, target: 15, reward: 3500 },
      { level: 2, target: 18, reward: 5500 },
      { level: 3, target: 20, reward: 8000 }
    ],
    type: 'nights'
  },
  {
    id: 8,
    name: 'Night 25',
    description: 'Night 25 gacha yetib kor',
    levels: [
      { level: 1, target: 20, reward: 4500 },
      { level: 2, target: 23, reward: 7000 },
      { level: 3, target: 25, reward: 10000 }
    ],
    type: 'nights'
  },
  {
    id: 9,
    name: 'Life Saver',
    description: 'Jonlarni saqlash',
    levels: [
      { level: 1, target: 5, reward: 3000 },
      { level: 2, target: 10, reward: 6000 },
      { level: 3, target: 20, reward: 12000 }
    ],
    type: 'lives_saved'
  },
  {
    id: 10,
    name: 'Night 30',
    description: 'Night 30 gacha yetib kor',
    levels: [
      { level: 1, target: 25, reward: 5500 },
      { level: 2, target: 28, reward: 8500 },
      { level: 3, target: 30, reward: 12000 }
    ],
    type: 'nights'
  },
  {
    id: 11,
    name: 'Night 35',
    description: 'Night 35 gacha yetib kor',
    levels: [
      { level: 1, target: 30, reward: 6500 },
      { level: 2, target: 33, reward: 10000 },
      { level: 3, target: 35, reward: 14000 }
    ],
    type: 'nights'
  },
  {
    id: 12,
    name: 'Night 40',
    description: 'Night 40 gacha yetib kor',
    levels: [
      { level: 1, target: 35, reward: 7500 },
      { level: 2, target: 38, reward: 11500 },
      { level: 3, target: 40, reward: 16000 }
    ],
    type: 'nights'
  },
  {
    id: 13,
    name: 'Night 45',
    description: 'Night 45 gacha yetib kor',
    levels: [
      { level: 1, target: 40, reward: 8500 },
      { level: 2, target: 43, reward: 13000 },
      { level: 3, target: 45, reward: 18000 }
    ],
    type: 'nights'
  },
  {
    id: 14,
    name: 'Night 50 - MASTER',
    description: 'Night 50 gacha - YAKUNIY TUN!',
    levels: [
      { level: 1, target: 45, reward: 10000 },
      { level: 2, target: 48, reward: 15000 },
      { level: 3, target: 50, reward: 25000 }
    ],
    type: 'nights'
  },
  {
    id: 15,
    name: 'Speed Runner',
    description: 'Tezlikcha meteor qoch',
    levels: [
      { level: 1, target: 10, reward: 2000 },
      { level: 2, target: 20, reward: 5000 },
      { level: 3, target: 50, reward: 10000 }
    ],
    type: 'speed'
  },
  {
    id: 16,
    name: 'Perfect Night',
    description: 'Jonlarisiz yechish',
    levels: [
      { level: 1, target: 1, reward: 5000 },
      { level: 2, target: 3, reward: 10000 },
      { level: 3, target: 5, reward: 20000 }
    ],
    type: 'perfect'
  },
  {
    id: 17,
    name: 'Grinder',
    description: 'Ko\'p o\'yna',
    levels: [
      { level: 1, target: 100, reward: 3000 },
      { level: 2, target: 500, reward: 8000 },
      { level: 3, target: 1000, reward: 20000 }
    ],
    type: 'games_played'
  },
  {
    id: 18,
    name: 'Champion',
    description: 'Eng qiyin missiya',
    levels: [
      { level: 1, target: 50, reward: 30000 },
      { level: 2, target: 50, reward: 50000 },
      { level: 3, target: 50, reward: 75000 }
    ],
    type: 'master'
  },
  {
    id: 19,
    name: 'Meteor Slayer',
    description: 'Ko\'p meteorni yo\'q qil',
    levels: [
      { level: 1, target: 500, reward: 5000 },
      { level: 2, target: 1000, reward: 12000 },
      { level: 3, target: 2000, reward: 25000 }
    ],
    type: 'meteors_destroyed'
  },
  {
    id: 20,
    name: 'Lucky Night',
    description: 'Katta bonus olyapt',
    levels: [
      { level: 1, target: 5000, reward: 3000 },
      { level: 2, target: 20000, reward: 8000 },
      { level: 3, target: 50000, reward: 25000 }
    ],
    type: 'bonus'
  },
  {
    id: 21,
    name: 'Early Bird',
    description: 'Dastlab tunlarni tugatish',
    levels: [
      { level: 1, target: 3, reward: 1500 },
      { level: 2, target: 5, reward: 3000 },
      { level: 3, target: 10, reward: 6000 }
    ],
    type: 'nights'
  },
  {
    id: 22,
    name: 'Mid Night',
    description: 'O\'rtadagi tunlarni tugatish',
    levels: [
      { level: 1, target: 20, reward: 4000 },
      { level: 2, target: 25, reward: 7000 },
      { level: 3, target: 30, reward: 12000 }
    ],
    type: 'nights'
  },
  {
    id: 23,
    name: 'Late Night',
    description: 'Kuni tugatayotgan tunlarni',
    levels: [
      { level: 1, target: 40, reward: 7000 },
      { level: 2, target: 45, reward: 12000 },
      { level: 3, target: 50, reward: 20000 }
    ],
    type: 'nights'
  },
  {
    id: 24,
    name: 'Collection',
    description: '5ta skin ol',
    levels: [
      { level: 1, target: 3, reward: 10000 },
      { level: 2, target: 5, reward: 20000 },
      { level: 3, target: 10, reward: 50000 }
    ],
    type: 'skins'
  },
  {
    id: 25,
    name: 'Treasure Hunter',
    description: 'Ko\'p olmos qid',
    levels: [
      { level: 1, target: 25000, reward: 2500 },
      { level: 2, target: 75000, reward: 7500 },
      { level: 3, target: 150000, reward: 25000 }
    ],
    type: 'diamonds'
  },
  {
    id: 26,
    name: 'Time Master',
    description: 'Ko\'p vaqt tiqish',
    levels: [
      { level: 1, target: 10, reward: 5000 },
      { level: 2, target: 25, reward: 12000 },
      { level: 3, target: 50, reward: 30000 }
    ],
    type: 'time_played'
  },
  {
    id: 27,
    name: 'Meteor Expert',
    description: 'Yaxshi meteorlarni yo\'q qil',
    levels: [
      { level: 1, target: 50, reward: 1000 },
      { level: 2, target: 150, reward: 3000 },
      { level: 3, target: 300, reward: 7000 }
    ],
    type: 'meteors'
  },
  {
    id: 28,
    name: 'Diamond Master',
    description: 'Olmoslarning shaхsida',
    levels: [
      { level: 1, target: 100000, reward: 15000 },
      { level: 2, target: 300000, reward: 35000 },
      { level: 3, target: 500000, reward: 75000 }
    ],
    type: 'diamonds'
  },
  {
    id: 29,
    name: 'Life Guardian',
    description: 'Jonlarni yaxshi saqlash',
    levels: [
      { level: 1, target: 10, reward: 5000 },
      { level: 2, target: 20, reward: 12000 },
      { level: 3, target: 40, reward: 25000 }
    ],
    type: 'lives_saved'
  },
  {
    id: 30,
    name: 'Ultimate Legend',
    description: 'Barcha tunni tugatib MASTER bo\'l',
    levels: [
      { level: 1, target: 50, reward: 40000 },
      { level: 2, target: 50, reward: 60000 },
      { level: 3, target: 50, reward: 100000 }
    ],
    type: 'champion'
  }
];

// ===== LOCALSTORAGE FUNCTIONS =====
function saveGameData() {
  const gameData = {
    playerDiamonds: playerDiamonds,
    currentSkin: currentSkin,
    boughtSkins: boughtSkins,
    missionProgress: missionProgress,
    completedMissions: completedMissions,
    lastPlayed: new Date().toISOString()
  };
  localStorage.setItem('meteorYomgirGameData', JSON.stringify(gameData));
  console.log('✅ Saqlandi:', gameData);
}

function loadGameData() {
  const savedData = localStorage.getItem('meteorYomgirGameData');
  if (savedData) {
    try {
      const gameData = JSON.parse(savedData);
      playerDiamonds = gameData.playerDiamonds || 0;
      currentSkin = gameData.currentSkin || 'default';
      boughtSkins = gameData.boughtSkins || ['default'];
      missionProgress = gameData.missionProgress || {};
      completedMissions = gameData.completedMissions || {};
      console.log('✅ Yuklandi:', gameData);
    } catch (e) {
      console.error('❌ Ma\'lumot yuklanishida xato:', e);
    }
  } else {
    console.log('📝 Birinchi marta o\'yin. Yangi ma\'lumot yaratilmoqda...');
  }
}

function clearGameData() {
  localStorage.removeItem('meteorYomgirGameData');
  console.log('🗑️ Barcha ma\'lumot o\'chirildi');
}

// ===== SETUP CANVAS =====
function resizeCanvas() {
  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 150;
  if (canvas.width > 800) canvas.width = 800;
  if (canvas.height > 600) canvas.height = 600;
  
  player.y = canvas.height - 40;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ===== METEOR CLASS =====
class Meteor {
  constructor() {
    this.radius = 8 + Math.random() * 12;
    this.x = Math.random() * (canvas.width - this.radius * 2);
    this.y = -this.radius - Math.random() * 100;
    this.speedY = 1.8 + Math.random() * 2 + difficulty * 1;
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.opacity = 1;
    this.isDestroyed = false;
    this.explosionParticles = [];
    this.trail = [];
  }

  update() {
    if (this.isDestroyed) {
      this.explosionParticles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.3;
        particle.opacity -= 0.03;
        
        if (particle.opacity <= 0) {
          this.explosionParticles.splice(index, 1);
        }
      });
      return;
    }

    this.trail.push({
      x: this.x + this.radius,
      y: this.y + this.radius,
      radius: this.radius,
      opacity: 0.6
    });

    if (this.trail.length > 8) {
      this.trail.shift();
    }

    this.trail.forEach((t, idx) => {
      t.opacity = 0.6 * (idx / this.trail.length);
    });

    this.y += this.speedY;
    this.x += this.speedX;

    if (this.x < 0 || this.x + this.radius * 2 > canvas.width) {
      this.speedX *= -1;
    }
  }

  draw() {
    if (this.isDestroyed) {
      this.explosionParticles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      return;
    }

    this.trail.forEach(t => {
      ctx.save();
      ctx.globalAlpha = t.opacity;
      ctx.fillStyle = '#FF8C42';
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#FF6B35';
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 200, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(this.x + this.radius, this.y + this.radius, this.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  isOffScreen() {
    return this.y > canvas.height;
  }

  collidesWith(rect) {
    const meteorCenterX = this.x + this.radius;
    const meteorCenterY = this.y + this.radius;
    const rectCenterX = rect.x + rect.width / 2;
    const rectCenterY = rect.y + rect.height / 2;

    const distX = Math.abs(meteorCenterX - rectCenterX);
    const distY = Math.abs(meteorCenterY - rectCenterY);

    return distX < (this.radius + rect.width / 2) && 
           distY < (this.radius + rect.height / 2);
  }

  explode() {
    this.isDestroyed = true;
    
    const particleCount = 12 + Math.random() * 12;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 3 + Math.random() * 5;
      
      this.explosionParticles.push({
        x: this.x + this.radius,
        y: this.y + this.radius,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        color: ['#FF6B35', '#FFA500', '#FFD700', '#FF4500'][Math.floor(Math.random() * 4)],
        opacity: 1
      });
    }
  }
}

// ===== PLAYER FUNCTIONS =====
function drawPlayer() {
  const skinData = SKINS.find(s => s.id === currentSkin);
  const skinColor = skinData ? skinData.color : '#00FF00';

  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  
  ctx.rotate(player.rotation);
  
  ctx.fillStyle = skinColor;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2;
  
  const size = player.width / 2;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, size + 8, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();
}

function updatePlayer() {
  player.x += player.dx;
  
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }
  
  if (player.dx !== 0) {
    player.isMoving = true;
    if (player.dx < 0) {
      player.movingDirection = -1;
    } else {
      player.movingDirection = 1;
    }
    player.rotation += 0.15 * player.movingDirection;
  } else {
    player.isMoving = false;
    if (player.rotation > 0.05) {
      player.rotation -= 0.05;
    } else if (player.rotation < -0.05) {
      player.rotation += 0.05;
    } else {
      player.rotation = 0;
    }
  }
}

function resetPlayerPosition() {
  player.x = canvas.width / 2 - player.width / 2;
  player.rotation = 0;
}

// ===== METEOR FUNCTIONS =====
function spawnMeteors() {
  if (Math.random() < meteorSpawnRate * 0.043) {
    meteors.push(new Meteor());
  }
  
  if (currentNight > 15 && Math.random() < meteorSpawnRate * 0.022) {
    meteors.push(new Meteor());
  }
  
  if (currentNight > 30 && Math.random() < meteorSpawnRate * 0.031) {
    meteors.push(new Meteor());
  }
  
  if (currentNight > 40 && Math.random() < meteorSpawnRate * 0.040) {
    meteors.push(new Meteor());
  }
}

function updateMeteors() {
  meteors.forEach((meteor, index) => {
    meteor.update();
    
    if (!meteor.isDestroyed && meteor.collidesWith(player)) {
      lives--;
      meteor.explode();
      resetPlayerPosition();
      updateLivesDisplay();
      
      if (lives <= 0) {
        endGame();
      }
      return;
    }
    
    if (meteor.isOffScreen()) {
      meteors.splice(index, 1);
      score += 10;
      meteorsDestroyedThisNight++;
      updateScoreDisplay();
    }
    
    if (meteor.isDestroyed && meteor.explosionParticles.length === 0 && meteor.isOffScreen()) {
      meteors.splice(index, 1);
    }
  });
}

function drawMeteors() {
  meteors.forEach(meteor => meteor.draw());
}

// ===== MISSION TRACKING FUNCTIONS 👈 =====
function updateMissionProgress() {
  // Night missiyalari
  if (!missionProgress['nights']) {
    missionProgress['nights'] = 0;
  }
  missionProgress['nights'] = currentNight;

  // Meteor yo'q qilganlari
  if (!missionProgress['meteors']) {
    missionProgress['meteors'] = 0;
  }
  missionProgress['meteors'] += meteorsDestroyedThisNight;

  // Bonus
  const bonus = meteorsDestroyedThisNight * 5;
  if (!missionProgress['bonus']) {
    missionProgress['bonus'] = 0;
  }
  missionProgress['bonus'] += bonus;

  // Diamonds
  if (!missionProgress['diamonds']) {
    missionProgress['diamonds'] = 0;
  }
  missionProgress['diamonds'] = playerDiamonds;

  // Skins
  if (!missionProgress['skins']) {
    missionProgress['skins'] = 0;
  }
  missionProgress['skins'] = boughtSkins.length;

  console.log('📊 Mission Progress:', missionProgress);
}

function checkMissionCompletion() {
  MISSIONS.forEach(mission => {
    if (!completedMissions[mission.id]) {
      completedMissions[mission.id] = { level1: false, level2: false, level3: false };
    }

    mission.levels.forEach(level => {
      const levelKey = `level${level.level}`;
      if (!completedMissions[mission.id][levelKey]) {
        let isCompleted = false;

        switch (mission.type) {
          case 'nights':
            if (missionProgress['nights'] >= level.target) {
              isCompleted = true;
            }
            break;
          case 'meteors':
            if (missionProgress['meteors'] >= level.target) {
              isCompleted = true;
            }
            break;
          case 'bonus':
            if (missionProgress['bonus'] >= level.target) {
              isCompleted = true;
            }
            break;
          case 'diamonds':
            if (missionProgress['diamonds'] >= level.target) {
              isCompleted = true;
            }
            break;
          case 'skins':
            if (missionProgress['skins'] >= level.target) {
              isCompleted = true;
            }
            break;
          case 'master':
            if (missionProgress['nights'] >= level.target) {
              isCompleted = true;
            }
            break;
        }

        if (isCompleted) {
          completedMissions[mission.id][levelKey] = true;
          console.log(`✅ MISSIYA BAJARILDI: ${mission.name} - Level ${level.level} - +${level.reward} 💎`);
        }
      }
    });
  });
}

function claimMissionRewards() {
  let totalReward = 0;
  let claimedMissions = [];

  MISSIONS.forEach(mission => {
    if (completedMissions[mission.id]) {
      mission.levels.forEach((level, idx) => {
        const levelKey = `level${level.level}`;
        if (completedMissions[mission.id][levelKey] && !completedMissions[mission.id][`${levelKey}_claimed`]) {
          totalReward += level.reward;
          completedMissions[mission.id][`${levelKey}_claimed`] = true;
          claimedMissions.push(`${mission.name} - Level ${level.level}: +${level.reward} 💎`);
        }
      });
    }
  });

  if (totalReward > 0) {
    playerDiamonds += totalReward;
    saveGameData();
    console.log(`✅ ${claimedMissions.length} MISSIYA REWARD OLINDI! +${totalReward} 💎`);
    claimedMissions.forEach(m => console.log('  ' + m));
    return totalReward;
  }

  return 0;
}

// ===== NIGHT FUNCTIONS =====
function startNight() {
  gameState = 'playing';
  timeLeft = 30;
  meteors = [];
  meteorsDestroyedThisNight = 0;
  resetPlayerPosition();
  meteorSpawnRate = 0.5 + (currentNight - 1) * 0.015;
  
  if (nightTimer) clearInterval(nightTimer);
  nightTimer = setInterval(() => {
    timeLeft--;
    updateTimeDisplay();
    
    if (timeLeft <= 0) {
      completeNight();
    }
  }, 1000);
}

function completeNight() {
  clearInterval(nightTimer);
  gameState = 'night-complete';
  
  const bonus = meteorsDestroyedThisNight * 5;
  score += 100 + bonus;
  playerDiamonds += 100 + bonus;

  // 👈 MISSION PROGRESS UPDATE VA CHECK
  updateMissionProgress();
  checkMissionCompletion();
  const missionReward = claimMissionRewards();
  
  saveGameData();
  
  showOverlay('overlay-night-complete');
  document.getElementById('completed-night').textContent = currentNight;
  document.getElementById('remaining-lives').textContent = lives;
  document.getElementById('meteors-destroyed').textContent = meteorsDestroyedThisNight;
  document.getElementById('bonus-score').textContent = bonus;
  
  // 👈 MISSION REWARD SHOW
  if (missionReward > 0) {
    document.getElementById('mission-reward-display').textContent = `+ ${missionReward} 🎁`;
    document.getElementById('mission-reward-display').style.display = 'block';
  } else {
    document.getElementById('mission-reward-display').style.display = 'none';
  }
  
  updateScoreDisplay();
}

function nextNight() {
  if (currentNight >= TOTAL_NIGHTS) {
    winGame();
  } else {
    currentNight++;
    updateNightDisplay();
    hideAllOverlays();
    startNight();
  }
}

function winGame() {
  gameState = 'victory';
  clearInterval(nightTimer);
  playerDiamonds += score;
  
  // 👈 FINAL MISSION CHECK
  updateMissionProgress();
  checkMissionCompletion();
  const missionReward = claimMissionRewards();
  
  saveGameData();
  showOverlay('overlay-victory');
  document.getElementById('victory-score').textContent = score;
}

function endGame() {
  gameState = 'gameover';
  clearInterval(nightTimer);
  playerDiamonds += Math.floor(score / 2);
  
  // 👈 MISSION CHECK
  updateMissionProgress();
  checkMissionCompletion();
  const missionReward = claimMissionRewards();
  
  saveGameData();
  showOverlay('overlay-gameover');
  document.getElementById('final-night').textContent = currentNight;
  document.getElementById('final-score').textContent = score;
}

// ===== UI UPDATES =====
function updateNightDisplay() {
  document.getElementById('night-val').textContent = currentNight;
}

function updateTimeDisplay() {
  document.getElementById('time-val').textContent = timeLeft;
}

function updateScoreDisplay() {
  document.getElementById('score-val').textContent = playerDiamonds;
}

function updateLivesDisplay() {
  document.getElementById('lives-val').textContent = lives;
}

// ===== SHOP FUNCTIONS =====
function openShop() {
  if (gameState === 'playing') {
    pauseGame();
  }
  setTimeout(() => {
    renderSkins();
    showOverlay('overlay-shop');
  }, 100);
}

function renderSkins() {
  const skinsGrid = document.getElementById('skins-grid');
  if (!skinsGrid) return;
  
  skinsGrid.innerHTML = '';
  
  SKINS.forEach(skin => {
    const skinCard = document.createElement('div');
    skinCard.className = 'skin-card';
    if (currentSkin === skin.id) {
      skinCard.classList.add('selected');
    }
    
    const isOwned = boughtSkins.includes(skin.id);
    const canBuy = playerDiamonds >= skin.price;
    
    let buttonText = '';
    let buttonClass = 'btn-skin';
    
    if (isOwned) {
      buttonText = 'TANLANGAN ✓';
      buttonClass += ' owned';
    } else if (canBuy && skin.price > 0) {
      buttonText = 'SOT KUP OL';
      buttonClass += ' buyable';
    } else if (skin.price === 0) {
      buttonText = 'BEPUL OLMOQ';
    } else {
      buttonText = 'ARZON ❌';
      buttonClass += ' expensive';
    }
    
    skinCard.innerHTML = `
      <div class="skin-preview" style="background-color: ${skin.color}; box-shadow: 0 0 20px ${skin.color}"></div>
      <h3>${skin.name}</h3>
      <p>${skin.description}</p>
      <p class="skin-price">${skin.price === 0 ? 'FREE' : skin.price + ' 💎'}</p>
      <button class="${buttonClass}" onclick="buySkinDirect('${skin.id}', ${skin.price})">${buttonText}</button>
    `;
    
    skinsGrid.appendChild(skinCard);
  });
  
  document.getElementById('shop-diamonds').textContent = playerDiamonds;
  const currentSkinName = SKINS.find(s => s.id === currentSkin);
  document.getElementById('current-skin').textContent = currentSkinName ? currentSkinName.name : 'Default';
}

function buySkinDirect(skinId, price) {
  if (boughtSkins.includes(skinId)) {
    currentSkin = skinId;
    saveGameData();
    renderSkins();
    alert('✅ Skin tanlandi: ' + SKINS.find(s => s.id === skinId).name);
    return;
  }
  
  if (price === 0 || playerDiamonds >= price) {
    if (price > 0) {
      playerDiamonds -= price;
    }
    boughtSkins.push(skinId);
    currentSkin = skinId;
    updateScoreDisplay();
    saveGameData();
    renderSkins();
    alert('✅ Skin sotib olindi! 🎉\n' + SKINS.find(s => s.id === skinId).name);
  } else {
    const need = price - playerDiamonds;
    alert('❌ Olmosing yetarli emas!\n' + need + ' ta olmos ko\'proq kerak.');
  }
}

// ===== MISSIONS FUNCTIONS 👈 =====
function openMissions() {
  if (gameState === 'playing') {
    pauseGame();
  }
  setTimeout(() => {
    renderMissions();
    showOverlay('overlay-missions');
  }, 100);
}

function renderMissions() {
  const missionsList = document.getElementById('missions-list');
  if (!missionsList) return;
  
  missionsList.innerHTML = '';
  
  MISSIONS.forEach((mission, idx) => {
    const missionCard = document.createElement('div');
    missionCard.className = 'mission-card';
    
    let levelsHTML = '';
    mission.levels.forEach(level => {
      const levelKey = `level${level.level}`;
      const isCompleted = completedMissions[mission.id] && completedMissions[mission.id][levelKey];
      const isClaimed = completedMissions[mission.id] && completedMissions[mission.id][`${levelKey}_claimed`];
      
      let statusIcon = '⭕';
      if (isCompleted && isClaimed) {
        statusIcon = '✅';
      } else if (isCompleted && !isClaimed) {
        statusIcon = '🔴';
      }
      
      levelsHTML += `
        <div class="mission-level ${isCompleted ? 'completed' : ''}">
          <span>${statusIcon} Level ${level.level}: ${level.target} → +${level.reward} 💎</span>
        </div>
      `;
    });
    
    missionCard.innerHTML = `
      <div class="mission-header">
        <h3>🎯 ${mission.name}</h3>
        <span class="mission-id">#${idx + 1}</span>
      </div>
      <p class="mission-desc">${mission.description}</p>
      <div class="mission-levels">
        ${levelsHTML}
      </div>
      <button class="btn-collect" onclick="openMissionCollect(${mission.id})">🎁 COLLECT</button>
    `;
    
    missionsList.appendChild(missionCard);
  });
}

function openMissionCollect(missionId) {
  const mission = MISSIONS.find(m => m.id === missionId);
  let reward = 0;
  let completedLevels = [];

  mission.levels.forEach(level => {
    const levelKey = `level${level.level}`;
    if (completedMissions[mission.id] && completedMissions[mission.id][levelKey] && !completedMissions[mission.id][`${levelKey}_claimed`]) {
      reward += level.reward;
      completedLevels.push(`Level ${level.level}: +${level.reward} 💎`);
      completedMissions[mission.id][`${levelKey}_claimed`] = true;
    }
  });

  if (reward > 0) {
    playerDiamonds += reward;
    updateScoreDisplay();
    saveGameData();
    renderMissions();
    alert(`✅ REWARD OLINDI!\n\n${completedLevels.join('\n')}\n\nJami: +${reward} 💎`);
  } else {
    alert('❌ Hozir hech qanday reward yo\'q!\n\nMissiyani tugatishingiz kerak.');
  }
}

// ===== OVERLAY FUNCTIONS =====
function showOverlay(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) {
    overlay.classList.remove('hidden');
  }
}

function hideOverlay(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

function hideAllOverlays() {
  document.getElementById('overlay-menu').classList.add('hidden');
  document.getElementById('overlay-pause').classList.add('hidden');
  document.getElementById('overlay-night-complete').classList.add('hidden');
  document.getElementById('overlay-gameover').classList.add('hidden');
  document.getElementById('overlay-victory').classList.add('hidden');
  document.getElementById('overlay-shop').classList.add('hidden');
  document.getElementById('overlay-missions').classList.add('hidden');
  document.getElementById('overlay-rules').classList.add('hidden');
}

// ===== GAME LOOP =====
function gameLoop() {
  ctx.fillStyle = '#000814';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  for (let i = 0; i < 100; i++) {
    const x = (i * 37) % canvas.width;
    const y = (i * 73) % canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  if (gameState === 'playing') {
    updatePlayer();
    spawnMeteors();
    updateMeteors();
    
    drawPlayer();
    drawMeteors();
  }
  
  requestAnimationFrame(gameLoop);
}

// ===== KEYBOARD CONTROLS =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    player.dx = -player.speed;
  }
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    player.dx = player.speed;
  }
  if (e.key === 'p' || e.key === 'P') {
    if (gameState === 'playing') {
      pauseGame();
    } else if (gameState === 'paused') {
      resumeGame();
    }
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' ||
      e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    player.dx = 0;
  }
});

// ===== MOBILE TOUCH CONTROLS =====
const leftTouchBtn = document.getElementById('left-touch');
const rightTouchBtn = document.getElementById('right-touch');

if (leftTouchBtn) {
  leftTouchBtn.addEventListener('touchstart', () => { player.dx = -player.speed; });
  leftTouchBtn.addEventListener('touchend', () => { player.dx = 0; });
}

if (rightTouchBtn) {
  rightTouchBtn.addEventListener('touchstart', () => { player.dx = player.speed; });
  rightTouchBtn.addEventListener('touchend', () => { player.dx = 0; });
}

// ===== BUTTONS =====
document.getElementById('start-btn').addEventListener('click', () => {
  difficulty = parseFloat(document.getElementById('difficulty').value);
  currentNight = 1;
  lives = 5;
  score = 0;
  player.rotation = 0;
  hideAllOverlays();
  updateNightDisplay();
  updateLivesDisplay();
  updateScoreDisplay();
  startNight();
});

const shopBtn = document.getElementById('shop-btn');
if (shopBtn) {
  shopBtn.addEventListener('click', openShop);
}

const missionsBtn = document.getElementById('missions-btn');
if (missionsBtn) {
  missionsBtn.addEventListener('click', openMissions);
}

const rulesBtn = document.getElementById('rules-btn');
if (rulesBtn) {
  rulesBtn.addEventListener('click', () => {
    if (gameState === 'playing') pauseGame();
    setTimeout(() => {
      showOverlay('overlay-rules');
    }, 100);
  });
}

document.getElementById('close-shop-btn').addEventListener('click', () => {
  hideOverlay('overlay-shop');
  if (gameState === 'paused') {
    resumeGame();
  }
});

document.getElementById('close-missions-btn').addEventListener('click', () => {
  hideOverlay('overlay-missions');
  if (gameState === 'paused') {
    resumeGame();
  }
});

const closeRulesBtn = document.getElementById('close-rules-btn');
if (closeRulesBtn) {
  closeRulesBtn.addEventListener('click', () => {
    hideOverlay('overlay-rules');
    if (gameState === 'paused') {
      resumeGame();
    }
  });
}

document.getElementById('pause-btn').addEventListener('click', () => {
  if (gameState === 'playing') pauseGame();
});

document.getElementById('resume-btn').addEventListener('click', () => {
  resumeGame();
});

document.getElementById('next-night-btn').addEventListener('click', () => {
  nextNight();
});

document.getElementById('again-btn').addEventListener('click', () => {
  difficulty = 1;
  currentNight = 1;
  lives = 5;
  score = 0;
  player.rotation = 0;
  hideAllOverlays();
  updateNightDisplay();
  updateLivesDisplay();
  updateScoreDisplay();
  showOverlay('overlay-menu');
});

document.getElementById('victory-again-btn').addEventListener('click', () => {
  difficulty = 1;
  currentNight = 1;
  lives = 5;
  score = 0;
  player.rotation = 0;
  hideAllOverlays();
  updateNightDisplay();
  updateLivesDisplay();
  updateScoreDisplay();
  showOverlay('overlay-menu');
});

document.getElementById('menu-btn').addEventListener('click', () => {
  clearInterval(nightTimer);
  hideAllOverlays();
  showOverlay('overlay-menu');
});

document.getElementById('menu2-btn').addEventListener('click', () => {
  hideAllOverlays();
  showOverlay('overlay-menu');
});

document.getElementById('victory-menu-btn').addEventListener('click', () => {
  hideAllOverlays();
  showOverlay('overlay-menu');
});

function pauseGame() {
  if (gameState === 'playing') {
    gameState = 'paused';
    clearInterval(nightTimer);
    showOverlay('overlay-pause');
    document.getElementById('pause-night').textContent = currentNight;
    document.getElementById('pause-lives').textContent = lives;
  }
}

function resumeGame() {
  gameState = 'playing';
  hideOverlay('overlay-pause');
  nightTimer = setInterval(() => {
    timeLeft--;
    updateTimeDisplay();
    if (timeLeft <= 0) {
      completeNight();
    }
  }, 1000);
}

// ===== INITIALIZATION =====
console.log('🎮 GAME STARTING...');
loadGameData();
updateScoreDisplay();
updateNightDisplay();
updateLivesDisplay();
gameLoop();