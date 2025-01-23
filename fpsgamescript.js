let scene, camera, renderer;
let controls;
let bullets = [];
let enemies = [];
let player = { x: 0, y: 0, z: 0, ammo: 30, maxAmmo: 30, reloadTime: 2, isReloading: false };
let instructions = document.getElementById('instructions');
let gameContainer = document.getElementById('game-container');


// Initialize Three.js Scene
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  controls = new THREE.PointerLockControls(camera, document.body);


  // Add Pointer Lock Events
  instructions.addEventListener('click', () => {
        controls.lock();
  });


  controls.addEventListener('lock', () => {
        instructions.style.display = 'none';
        gameContainer.style.display = 'block';
  });


  controls.addEventListener('unlock', () => {
        instructions.style.display = 'block';
        gameContainer.style.display = 'none';
  });


  // Floor
  const floorGeometry = new THREE.PlaneGeometry(200, 200);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);


  // Lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10).normalize();
  scene.add(light);


  camera.position.y = 5;


  spawnEnemies();
  animate();
}


// Spawn Enemies
function spawnEnemies() {
  for (let i = 0; i < 5; i++) {
        const enemyGeometry = new THREE.BoxGeometry(2, 2, 2);
        const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
        enemy.position.set(
          Math.random() * 100 - 50,
          1,
          Math.random() * 100 - 50
        );
        enemies.push(enemy);
        scene.add(enemy);
  }
}


// Shoot Bullets
function shoot() {
  if (player.ammo > 0 && !player.isReloading) {
        player.ammo--;
        const bulletGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        bullet.position.copy(camera.position);
        bullet.velocity = new THREE.Vector3();
        bullet.velocity.copy(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(1));
        bullets.push(bullet);
        scene.add(bullet);
  } else if (player.ammo === 0) {
        console.log('Out of ammo! Reload!');
  }
}


// Reload
function reload() {
  if (!player.isReloading && player.ammo < player.maxAmmo) {
        player.isReloading = true;
        console.log('Reloading...');
        setTimeout(() => {
          player.ammo = player.maxAmmo;
          player.isReloading = false;
          console.log('Reload complete!');
        }, player.reloadTime * 1000);
  }
}


// Update Bullets
function updateBullets() {
  bullets.forEach((bullet, index) => {
        bullet.position.add(bullet.velocity);
        // Check collision with enemies
        enemies.forEach((enemy, enemyIndex) => {
          if (bullet.position.distanceTo(enemy.position) < 1) {
            scene.remove(enemy);
            enemies.splice(enemyIndex, 1);
            scene.remove(bullet);
            bullets.splice(index, 1);
          }
        });
        // Remove bullets if they go too far
        if (bullet.position.length() > 200) {
          scene.remove(bullet);
          bullets.splice(index, 1);
        }
  });
}


// Game Loop
function animate() {
  requestAnimationFrame(animate);
  updateBullets();
  controls.update();
  renderer.render(scene, camera);
}


// Event Listeners
window.addEventListener('click', (e) => {
  if (e.button === 0) shoot(); // Left-click to shoot
});


window.addEventListener('keydown', (e) => {
  if (e.key === 'r') reload(); // R to reload
});


// Start the Game
init();