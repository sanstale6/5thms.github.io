document.addEventListener('DOMContentLoaded', function() {
  // 游戏配置
  const mapWidth = 600;
  const mapHeight = 400;
  const playerSize = 20;
  const enemySize = 20;
  const maxEnemies = 4;
  const attackRange = playerSize + 4 * enemySize;

  // 获取游戏元素
  const gameMap = document.getElementById('game-map');
  const player = document.getElementById('player');
  const attackButton = document.getElementById('attack-button');
  const moveButtons = document.getElementsByClassName('move-button');

  // 玩家位置
  let playerX = mapWidth / 2;
  let playerY = mapHeight / 2;

  // 敌人列表
  let enemies = [];

  // 设置玩家位置
  function setPlayerPosition(x, y) {
    playerX = Math.max(0, Math.min(x, mapWidth - playerSize));
    playerY = Math.max(0, Math.min(y, mapHeight - playerSize));
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';

    updateAttackableEnemies();
  }

  // 移动玩家
  function movePlayer(dx, dy) {
    setPlayerPosition(playerX + dx, playerY + dy);
  }

  // 更新可攻击的敌人
  function updateAttackableEnemies() {
    for (const enemy of enemies) {
      const enemyRect = enemy.element.getBoundingClientRect();
      const distance = getDistance(playerX, playerY, enemyRect.left, enemyRect.top);

      if (distance <= attackRange) {
        enemy.element.classList.add('attackable-enemy');
      } else {
        enemy.element.classList.remove('attackable-enemy');
      }
    }
  }

  // 获取两个点之间的距离
  function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  // 创建敌人
  function createEnemy() {
    if (enemies.length < maxEnemies) {
      const x = Math.random() * (mapWidth - enemySize);
      const y = Math.random() * (mapHeight - enemySize);
      const health = Math.floor(Math.random() * 100) + 1;
      const enemyElement = document.createElement('div');
      enemyElement.classList.add('enemy');
      enemyElement.style.left = x + 'px';
      enemyElement.style.top = y + 'px';
      gameMap.appendChild(enemyElement);

      const healthElement = document.createElement('div');
      healthElement.classList.add('health');
      healthElement.innerText = health + '/100';
      enemyElement.appendChild(healthElement);

      enemies.push({ element: enemyElement, x: x, y: y, health: health });
    }
  }

  // 移动敌人
  function moveEnemies() {
    for (const enemy of enemies) {
      const dx = playerX - enemy.x > 0 ? 1 : -1;
      const dy = playerY - enemy.y > 0 ? 1 : -1;

      enemy.x += dx;
      enemy.y += dy;
      enemy.element.style.left = enemy.x + 'px';
      enemy.element.style.top = enemy.y + 'px';
    }
  }

  // 攻击敌人
  function attackEnemy() {
    const attackableEnemies = document.getElementsByClassName('attackable-enemy');
    const nearestEnemy = getNearestEnemy(attackableEnemies);

    if (nearestEnemy) {
      const healthElement = nearestEnemy.getElementsByClassName('health')[0];
      let [currentHealth, maxHealth] = healthElement.innerText.split('/');
      currentHealth = parseInt(currentHealth) - Math.floor(Math.random() * 20) - 10;
      currentHealth = Math.max(currentHealth, 0);
      healthElement.innerText = currentHealth + '/' + maxHealth;
    }
  }

  // 获取离玩家最近的敌人
  function getNearestEnemy(enemies) {
    let nearestEnemy = null;
    let minDistance = Number.MAX_VALUE;

    for (const enemy of enemies) {
      const enemyRect = enemy.getBoundingClientRect();
      const distance = getDistance(playerX, playerY, enemyRect.left, enemyRect.top);

      if (distance < minDistance) {
        minDistance = distance;
        nearestEnemy = enemy;
      }
    }

    return nearestEnemy;
  }

  // 移动按钮点击事件
  for (const button of moveButtons) {
    button.addEventListener('click', function() {
      const direction = button.dataset.direction;

      switch (direction) {
        case "up":
          movePlayer(0, -5);
          break;
        case "down":
          movePlayer(0, 5);
          break;
        case "left":
          movePlayer(-5, 0);
          break;
        case "right":
          movePlayer(5, 0);
          break;
      }
    });
  }

  // 攻击按钮点击事件
  attackButton.addEventListener('click', attackEnemy);

  // 游戏循环
  setInterval(function() {
    createEnemy();
    moveEnemies();
  }, 1000);
});