/**
  * The game layer
  * @class GameLayer
  */
var GameLayer = cc.LayerColor.extend({
	/**
	 * Initialize
	 * @return {Boolean}
	 */
	init: function(){
		this._super(new cc.Color(0,0,0,255));
		this.setPosition(new cc.Point(0,0));

		this.addKeyboardHandlers();
		this.addMouseHandlers();

		this.scheduleUpdate();
		this.movingObjects = [];

		this.player = new Player(this);
		this.addChild(this.player,1);
		this.floor = new Floor();
		this.addChild(this.floor);
		this.player.setFloor(this.floor);

		this.bullets = [];
		this.enemies = [];

		this.spawnDelay = 0;
		this.resetSpawnDelay();

		this.enemiesType = [GameLayer.ENEMIES.GROUND_ALIEN, GameLayer.ENEMIES.FLY_DRONE, GameLayer.ENEMIES.DRIVER_ALIEN];
		this.totalEnemiesType = this.enemiesType.length;

		this.gameTime = 0;

		this.speedMode = false; //for testing in slower computers
		this.movementUpdateDelay = 2; //for slowing down updating movement (for faster computers)
		if(this.speedMode){
			this.movementUpdateDelay = -1;
		}


		return true;
	},
	/**
	 * Function for press key each time
	 * @return {Void}
	 */
	onKeyDown: function(e){
		if(e == cc.KEY.a){ //left
			this.player.move(-1);
		}
		if(e == cc.KEY.d){ //right
			this.player.move(1);
		}
		if(e == cc.KEY.w){ //jump up
			this.player.jump();
		}
		if(e == cc.KEY.space){ //speed mode
			if(this.speedMode)
				this.speedMode = false;
			else 
				this.speedMode = true;
		}
	},
	/**
	 * Function for release key each time
	 * @return {Void}
	 */
	onKeyUp: function(e){
		if(e == cc.KEY.a){
			this.player.decelerateX();
		}
		if(e == cc.KEY.d){
			this.player.decelerateX();
		}
	},
	/**
	 * Add keyboard to the game layer
	 * @return {Void}
	 */
	addKeyboardHandlers: function(){
		var self = this;
		cc.eventManager.addListener({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed : function(e){
				self.onKeyDown(e);
			},
			onKeyReleased: function(e){
				self.onKeyUp(e);
			}
		},this);
	},
	/**
	 * Add mouse to the game layer
	 * @return {Void}
	 */
	addMouseHandlers: function(){
		var self = this;
		cc.eventManager.addListener({
			event: cc.EventListener.MOUSE,
			onMouseDown : function(e){
				self.onMouseDown(e);
			},
			onMouseMoved: function(e){
				self.onMouseMoved(e);
			}
		},this);
	},
	/**
	 * When the screen is clicked by mouse
	 * @return {Void}
	 */
	onMouseDown:function (event) {
		var location = event.getLocation();

		var angle = Math.atan((location.y-this.player.y)/Math.abs(location.x-this.player.x));
		angle = angle * (180/Math.PI);
		this.player.shoot(angle);
	},
	/**
	 * When the screen is knows the mouse moves
	 * @return {Void}
	 */
	 onMouseMoved:function(event){
		var location = event.getLocation();
	},
	/**
	 * Update the game scene
	 * @return {Void}
	 */
	update: function(){
		if(!this.speedMode && this.movementUpdateDelay < 0){
			this.updateTasks();
		} else if (this.speedMode){
			this.updateTasks();
		}
		this.movementUpdateDelay--;
	},
	/**
	 * Update the game movement function
	 * @return {Void}
	 */
	updateTasks: function(){
		if(this.player.alive){this.gameTime++;}
		if(this.spawnDelay < 0 && this.player.alive){
			this.spawnEnemies(this.enemiesType[this.getRandomInt(0,this.totalEnemiesType)]);
		}
		this.spawnDelay--;

		for(var i = 0; i < this.movingObjects.length; i++){
			this.movingObjects[i].update();
		}

		this.movementUpdateDelay = 2;
	},
	/**
	 * Spawn enemies by each type
	 * @return {Void}
	 * @param {Number} enemyType = the type index of the enemy
	 */
	spawnEnemies: function(enemyType){
		var GROUND_ALIEN = GameLayer.ENEMIES.GROUND_ALIEN;
		var FLY_DRONE = GameLayer.ENEMIES.FLY_DRONE;
		var DRIVER_ALIEN = GameLayer.ENEMIES.DRIVER_ALIEN;
		switch(enemyType){
			case GROUND_ALIEN :
				var spawnDir = this.getRandomInt(-2,3);
				if(spawnDir == 0){
					break;
				}
				var newEnemy = new GroundAlien(this,spawnDir);
				this.enemies.push(newEnemy);
				newEnemy.setFloor(this.floor);
				this.addChild(newEnemy);
				break;
			case FLY_DRONE :
				var spawnIndex = this.getRandomInt(-1,2);
				var newEnemy = new FlyDrone(this,spawnIndex);
				this.enemies.push(newEnemy);
				this.addChild(newEnemy);
				break;
			case DRIVER_ALIEN :
				var spawnDir = this.getRandomInt(-2,3);
				if(spawnDir == 0){
					break;
				}
				var newEnemy = new DriverAlien(this,spawnDir);
				this.enemies.push(newEnemy);
				newEnemy.setFloor(this.floor);
				this.addChild(newEnemy);
				break;
		}
		this.resetSpawnDelay();
	},
	/**
	 * Reset the spawn delay time randomly
	 * @return {Void}
	 */
	resetSpawnDelay: function(){
		this.spawnDelay = this.getRandomInt(15,60);
	},
	/**
	 * Returns a random integer between min (included) and max (excluded)
	 * Using Math.round() will give you a non-uniform distribution!
	 * It returns any integer number from [min,max)
	 * @return {Number}
	 * @param {Number} min = the included minimum range
	 * @param {Number} max = the excluded maximum range
	 */
	getRandomInt: function(min, max){
		return Math.floor(Math.random() * (max - min)) + min;
	},
	/**
	 * Returns a random double between min (included) and max (excluded)
	 * It returns any double number from [min,max)
	 * @return {Number}
	 * @param {Number} min = the included minimum range
	 * @param {Number} max = the excluded maximum range
	 */
	getRandomDouble: function(min, max){
		return Math.random() * (max - min) + min;
	}
});

/**
  * The start scene
  * @class StartScene
  */
var StartScene = cc.Scene.extend({
	/**
	 * Start the game layer
	 * @return {Void}
	 */
	onEnter: function(){
		this._super();
		var layer = new GameLayer();
		layer.init();
		this.addChild(layer);
	}
});

/**
  * The static final variables for enemy index for game layer
  * @class GameLayer.ENEMIES
  */
GameLayer.ENEMIES = {
	GROUND_ALIEN: 0,
	FLY_DRONE: 1,
	DRIVER_ALIEN: 2
};
