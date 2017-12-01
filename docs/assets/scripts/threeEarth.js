var ThreeEarth = function () {

  /**
   * 相机
   * @type {null}
   */
  this.camera = null;

  /**
   * 场景
   */
  this.scene = void(0);

  /**
   * 渲染器
   */
  this.renderer = void(0);

  /**
   * 地图图层
   */
  this.earth = void(0);

  /**
   * cloud图层
   */
  this.cloud = void(0);
  this.pointLight = void(0);
  this.ambientLight = void(0);
  this.mouseDown = false;
  this.mouseX = 0;
  this.mouseY = 0;
};

ThreeEarth.prototype.init = function () {
  var that = this;
  // initialization
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  this.camera.position.z = 160;

  // Earth terrain
  var earth_texture = new THREE.TextureLoader().load("./assets/images/earth.jpeg");
  var earth_bump = new THREE.TextureLoader().load("./assets/images/bump.jpeg");
  var earth_specular = new THREE.TextureLoader().load("./assets/images/spec.jpeg");
  var earth_geometry = new THREE.SphereGeometry(30, 32, 32);
  var earth_material = new THREE.MeshPhongMaterial({
    shininess: 40,
    bumpScale: 1,
    map: earth_texture,
    bumpMap: earth_bump,
    specularMap: earth_specular
  });
  this.earth = new THREE.Mesh(earth_geometry, earth_material);
  this.scene.add(this.earth);

  // Earth cloud
  var cloud_texture = new THREE.TextureLoader().load('./assets/images/cloud.png');
  var cloud_geometry = new THREE.SphereGeometry(31, 32, 32);
  var cloud_material = new THREE.MeshBasicMaterial({
    shininess: 10,
    map: cloud_texture,
    transparent: true,
    opacity: 0.8
  });
  this.cloud = new THREE.Mesh(cloud_geometry, cloud_material);
  this.scene.add(this.cloud);

  // point light (upper left)
  this.pointLight = new THREE.PointLight(0xffffff);
  this.pointLight.position.set(-400, 100, 150);
  this.scene.add(this.pointLight);

  // ambient light
  this.ambientLight = new THREE.AmbientLight(0x222222);
  this.scene.add(this.ambientLight);

  // renderer
  this.renderer = new THREE.WebGLRenderer({alpha: true});
  this.renderer.setClearColor(0xffffff, 0);
  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.renderer.setSize(window.innerWidth - 20, window.innerHeight);
  document.body.appendChild(this.renderer.domElement);

  // event handler
  window.addEventListener('resize', that.onWindowResize.bind(that), false);
  document.addEventListener('mousemove', function (e) {
    that.onMouseMove(e);
  }, false);
  document.addEventListener('mousedown', function (e) {
    that.onMouseDown(e);
  }, false);
  document.addEventListener('mouseup', function (e) {
    that.onMouseUp(e);
  }, false);
};

ThreeEarth.prototype.animate = function () {
  window.requestAnimationFrame(this.animate.bind(this));
  this.earth.rotation.y += 0.001;
  this.cloud.rotation.y += 0.001;
  this.renderer.render(this.scene, this.camera);
};

/**
 * 窗口大小变化事件
 */
ThreeEarth.prototype.onWindowResize = function () {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
};

/**
 * 鼠标移到
 * @param evt
 */
ThreeEarth.prototype.onMouseMove = function (evt) {
  if (!this.mouseDown) return;
  evt.preventDefault();
  var deltaX = evt.clientX - this.mouseX, deltaY = evt.clientY - this.mouseY;
  this.mouseX = evt.clientX;
  this.mouseY = evt.clientY;
  this.rotateScene(deltaX, deltaY);
};

/**
 * 鼠标按下
 * @param evt
 */
ThreeEarth.prototype.onMouseDown = function (evt) {
  evt.preventDefault();
  this.mouseDown = true;
  this.mouseX = evt.clientX;
  this.mouseY = evt.clientY;
};

/**
 * 鼠标抬起
 * @param evt
 */
ThreeEarth.prototype.onMouseUp = function (evt) {
  evt.preventDefault();
  this.mouseDown = false;
};

/**
 * 旋转当前场景视图
 * @param deltaX
 * @param deltaY
 */
ThreeEarth.prototype.rotateScene = function (deltaX, deltaY) {
  this.earth.rotation.y += deltaX / 300;
  this.earth.rotation.x += deltaY / 300;
  this.cloud.rotation.y += deltaX / 300;
  this.cloud.rotation.x += deltaY / 300;
};
