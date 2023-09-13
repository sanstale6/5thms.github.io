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

  // 玩家属性
  let playerLevel = 1;
  let playerHealth = 100;
  let playerDamage = 10;
  let playerX = mapWidth / 2;
  let playerY = mapHeight / 2;

  // 敌人列表
  let enemies = [];

  // 移动玩家
  function movePlayer(x, y) {
    playerX += x;
    playerY += y;
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';

    updateAttackableEnemies();
  }

  // 更新可攻击的敌人
  function updateAttackableEnemies() {
    const playerRect = player.getBoundingClientRect();

    for (const enemy of enemies) {
      const enemyRect = enemy.element.getBoundingClientRect();
      const distance = getDistance(playerRect, enemyRect);

      if (distance <= attackRange) {
        enemy.element.classList.add('attackable-enemy');
      } else {
        enemy.element.classList.remove('attackable-enemy');
      }
    }
  }

  // 获取两个矩形中心点之间的距离
  function getDistance(rect1, rect2) {
    const rect1X = rect1.left + rect1.width / 2;
    const rect1Y = rect1.top + rect1.height / 2;
    const rect2X = rect2.left + rect2.width / 2;
    const rect2Y = rect2.top + rect2.height / 2;

    return Math.sqrt(Math.pow(rect1X - rect2X, 2) + Math.pow(rect1Y - rect2Y, 2));
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

      // 敌人攻击玩家
      if (Math.abs(playerX - enemy.x) < 25 && Math.abs(playerY - enemy.y) < 25) {
        playerHealth -= Math.floor(Math.random() * 10) + 5;
      }
    }
  }

  // 攻击敌人
  function attackEnemy() {
    const attackableEnemies = document.getElementsByClassName('attackable-enemy');
    const nearestEnemy = getNearestEnemy(attackableEnemies);

    if (nearestEnemy) {
      const healthElement = nearestEnemy.getElementsByClassName('health')[0];
      let [currentHealth, maxHealth] = healthElement.innerText.split('/');
      const enemyHealth = parseInt(currentHealth) - Math.floor(Math.random() * 20) - 10;
      currentHealth = Math.max(enemyHealth, 0);
      healthElement.innerText = currentHealth + '/' + maxHealth;
      
      if (enemyHealth <= 0) {
        gameMap.removeChild(nearestEnemy);
        enemies = enemies.filter(e => e.element !== nearestEnemy);
        playerHealth += Math.floor(Math.random() * 20) + 10;

        // 玩家升级
        if (playerHealth >= 200) {
          playerLevel++;
          playerDamage += 5;
          playerHealth = 100;
        }
      }
    }
  }

  // 获取离玩家最近的敌人
  function getNearestEnemy(enemies) {
    let nearestEnemy = null;
    let minDistance = Number.MAX_VALUE;

    for (const enemy of enemies) {
      const enemyRect = enemy.getBoundingClientRect();
      const distance = getDistance(player.getBoundingClientRect(), enemyRect);

      if (distance < minDistance) {
        minDistance = distance;
        nearestEnemy = enemy;
      }
    }

    return nearestEnemy;
  }

  // 移动玩家事件监听
  document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 37: // Left arrow key
        movePlayer(-5, 0);
        break;
      case 38: // Up arrow key
        movePlayer(0, -5);
        break;
      case 39: // Right arrow key
        movePlayer(5, 0);
        break;
      case 40: // Down arrow key
        movePlayer(0, 5);
        break;
    }
  });

  // 攻击按钮事件监听
  attackButton.addEventListener('click', attackEnemy);

  // 游戏循环
  setInterval(function() {
    createEnemy();
    moveEnemies();

    // 更新玩家信息
    const playerInfo = "等级: " + playerLevel + " 血量: " + playerHealth + "/100 伤害: " + playerDamage;
    document.title = playerInfo;
  }, 1000);
});