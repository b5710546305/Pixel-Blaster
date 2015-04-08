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

		this.player = null;

		this.floor = new Floor();
		this.addChild(this.floor);
		
		this.player = new Player(this);
		this.player.setFloor(this.floor);
		this.addChild(this.player,1);

		this.life = 4;

		this.bullets = [];
		this.enemies = [];
		this.items = [];

		this.spawnDelay = 0;
		this.resetSpawnDelay();

		this.enemiesType = [GameLayer.ENEMIES.GROUND_ALIEN, GameLayer.ENEMIES.FLY_DRONE, GameLayer.ENEMIES.DRIVER_ALIEN];
		this.totalEnemiesType = this.enemiesType.length;

		this.gameTime = 0;

		this.speedMode = true; //for testing in slower computers
		this.movementUpdateDelay = 2; //for slowing down updating movement (for faster computers)
		if(this.speedMode){
			this.movementUpdateDelay = -1;
		}

		this.titleLabel = cc.Sprite.create('res/images/ui/title.png')
		this.titleLabel.setPosition( new cc.Point( screenWidth/2, (screenHeight/2)+200 ) );
		this.addChild(this.titleLabel);
		this.titleLabel.setVisible(true);

		this.playLabel = cc.Sprite.create('res/images/ui/play.png')
		this.playLabel.setPosition( new cc.Point( screenWidth/2, (screenHeight/2) ) );
		this.addChild(this.playLabel);
		this.playLabel.setVisible(true);

		this.howToPlayLabel = cc.Sprite.create('res/images/ui/how-to-play.png')
		this.howToPlayLabel.setPosition( new cc.Point( 0-this.howToPlayLabel.width, 150 ));
		this.addChild(this.howToPlayLabel);
		this.howToPlayLabel.setVisible(true);

		this.lifeLabel = cc.LabelTTF.create('Life:'+this.life,'Arial',40);
		this.lifeLabel.setPosition( new cc.Point( 50, screenHeight-20 ) );
		this.addChild( this.lifeLabel );
		this.lifeLabel.setVisible(false);

		this.gameOverLabel = cc.LabelTTF.create('Game Over','Arial',40);
		this.gameOverLabel.setPosition( new cc.Point( screenWidth/2, screenHeight/2 ) );
		this.addChild(this.gameOverLabel);
		this.gameOverLabel.setVisible(false);

		//states:
		this.state = GameLayer.STATE.TITLE;

		return true;
	},
	/**
	 * Run the components for gameplay state
	 * @return {Void}
	 */
	startGame: function(){
		this.titleLabel.setVisible(false);
		this.playLabel.setVisible(false);
		this.howToPlayLabel.setVisible(false);
		this.lifeLabel.setVisible(true);
		this.gameOverLabel.setVisible(false);
		
		this.state = GameLayer.STATE.GAMEPLAY;
	},
	/**
	 * Reset To Title
	 * @return {Void}
	 */
	restartGame: function(){
		this.titleLabel.setVisible(true);
		this.playLabel.setVisible(true);
		this.howToPlayLabel.setVisible(true);
		this.lifeLabel.setVisible(false);
		this.gameOverLabel.setVisible(false);
		this.state = GameLayer.STATE.TITLE;
	},
	/**
	 * Revive the player back to the game
	 * @return {Void}
	 */
	respawnPlayer: function(){
		this.player = new Player(this);
		this.addChild(this.player,1);
		this.player.setFloor(this.floor);
		this.player.alive = true;
		this.player.deadDelay = 20;
		this.updateLife();
	},
	/**
	 * Update current life remaining
	 * @return {Void}
	 */
	updateLife: function(){
		this.lifeLabel.setString('Life:'+this.life);
	},
	/**
	 * Function for press key each time
	 * @return {Void}
	 */
	onKeyDown: function(e){
		if(e == cc.KEY.a){ //left
			if(this.state == GameLayer.STATE.GAMEPLAY){
				this.player.move(-1);
			}
		}
		if(e == cc.KEY.d){ //right
			if(this.state == GameLayer.STATE.GAMEPLAY){
				this.player.move(1);
			}
		}
		if(e == cc.KEY.w){ //jump up
			if(this.state == GameLayer.STATE.GAMEPLAY){
				this.player.jump();
				this.player.jetpackThrust(1);
			}
		}
		if(e == cc.KEY.s){ //duck
			if(this.state == GameLayer.STATE.GAMEPLAY){
				this.player.jetpackThrust(-1);
			}
		}
		if(e == cc.KEY.space){ //speed mode
			if(this.speedMode)
				this.speedMode = false;
			else 
				this.speedMode = true;
		}
		if(e == cc.KEY.enter){ //warp
			switch(this.state){
			case GameLayer.STATE.TITLE:
				this.startGame();
				break;
			case GameLayer.STATE.GAMEOVER:
				this.state = GameLayer.STATE.TITLE;
				break;
			}
		}
		if(e == cc.KEY.p){ //pause
			switch(this.state){
			case GameLayer.STATE.GAMEPLAY:
				this.state = GameLayer.STATE.PAUSE;
				break;
			case GameLayer.STATE.PAUSE:
				this.state = GameLayer.STATE.GAMEPLAY;
				break;
			}
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
		if(this.state == GameLayer.STATE.GAMEPLAY){
			this.player.shoot(angle);
		}
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

		if(this.player){
			if(!this.player.alive && this.player.deadDelay <= 0){
				if(this.life >= 0){
					this.respawnPlayer();
				} else if (this.life < 0){
					this.gameOver();
				}
			}
		}
		
	},
	/**
	 * Update the game movement function
	 * @return {Void}
	 */
	updateTasks: function(){
		switch(this.state){
			case GameLayer.STATE.TITLE:
				break;
			case GameLayer.STATE.GAMEPLAY:
				if(this.player.alive){this.gameTime++;}
				if(this.spawnDelay < 0 && this.player.alive){
					this.spawnEnemies(this.enemiesType[this.getRandomInt(0,this.totalEnemiesType)]);
				}
				this.spawnDelay--;
				break;
			case GameLayer.STATE.PAUSE:
				break;
			case GameLayer.STATE.GAMEOVER:
				break;
		}
		

		for(var i = 0; i < this.movingObjects.length; i++){
			this.movingObjects[i].update();
		}

		this.howToPlayLabel.setPositionX(this.howToPlayLabel.x+2);
		if(this.howToPlayLabel.x > screenWidth+this.howToPlayLabel.width*2){
			this.howToPlayLabel.setPositionX(0-this.howToPlayLabel.setPositionX.width);
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
				var spawnDir = this.getRandomInt(-3,3);
				if(spawnDir == 0){
					spawnDir = 1;
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
				var spawnDir = this.getRandomInt(-3,3);
				if(spawnDir == 0){
					spawnDir = 1;
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
	 * End the game
	 * @return {Void}
	 */
	gameOver: function(){
		this.state = GameLayer.STATE.GAMEOVER;
		this.gameOverLabel.setVisible(true);
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
	},
	/**
	 * Pops up an item randomly from enemies or from sky
	 * This function will be called inside enemies classes
	 * @param {Number} x = x position
	 * @param {Number} y = y position
	 * @return {Void}
	 */
	spawnItem: function(x,y){
		var chance = this.getRandomInt(0,100);
		if(chance < 5){
			var item = new ExtraLifeItem(this,x,y);
			this.addChild(item);
		}
		if(chance >= 5 && chance < 5+15){
			var item = new JetpackItem(this,x,y);
			this.addChild(item);
		}
		if(chance >= 5+15 && chance < 5+15+20){
			var item = new ShieldItem(this,x,y);
			this.addChild(item);
		}
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

/**
  * The static final variables for state index for game layer
  * @class GameLayer.STATE
  */
GameLayer.STATE = {
	TITLE: 0,
	GAMEPLAY: 1,
	PAUSE: 2,
	GAMEOVER: 3
};

