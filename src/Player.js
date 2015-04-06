/**
  * Player is the main controling character
  * The sprite is a small robot
  * @class Player
  */
var Player = cc.Sprite.extend({
	/**
	 * Constructor
	 * @param: {GameLayer} game = the current game
	 */
	ctor: function(game){
		this._super();
		this.initWithFile('res/images/player.png');

		this.setPosition(new cc.Point(screenWidth/2,100));

		this.vx = 0; //horizonal speed
		this.vy = 0; //vertical speed
		this.G = -1; //gravity
		this.speed = 7;

		this.ground = null;
		this.floor = null;

		this.game = game;
		this.alive = true;
		this.deadDelay = 20;

		this.blinkTime = 10;
		this.blinkDelay = 4;

		this.shootDelay = 3;
		this.bulletSpeed = 30;
		
		this.game.movingObjects.push(this); //replace this.scheduleUpdate(); to enable slowmode and speedmode 

		this.jetpackOn = false;
		this.jetpackFuel = 5.00;

		this.shieldPower = 0;
		this.invincibleTime = 0;

		this.jetpack = cc.Sprite.create('res/images/player_jetpack.png');
		this.jetpackFlame = cc.Sprite.create('res/images/player_jetpack_flame.png');
		this.jetpack.setPosition(new cc.Point(this.width/2,this.height/2));
		this.jetpackFlame.setPosition(new cc.Point(this.width/2,this.height/2));
		this.addChild(this.jetpack);
		this.addChild(this.jetpackFlame);
		this.jetpack.setVisible(false);
		this.jetpackFlame.setVisible(false);

		this.lightShield = cc.Sprite.create('res/images/player_shield_light.png');
		this.heavyShield = cc.Sprite.create('res/images/player_shield_heavy.png');
		this.invincibleShield = cc.Sprite.create('res/images/player_shield_invincible.png');
		this.lightShield.setPosition(new cc.Point(this.width/2,this.height/2));
		this.heavyShield.setPosition(new cc.Point(this.width/2,this.height/2));
		this.invincibleShield.setPosition(new cc.Point(this.width/2,this.height/2));
		this.addChild(this.lightShield);
		this.addChild(this.heavyShield);
		this.addChild(this.invincibleShield);
		this.lightShield.setVisible(false);
		this.heavyShield.setVisible(false);
		this.invincibleShield.setVisible(false);
	},
	/**
	 * Update the player's status, such as position, sprite image, states
	 * @return {Void}
	 */
	update: function(){
		/**Before Moves*/
		var pos = this.getPosition();
		var posRect = this.getPlayerRect();

		this.setPosition(new cc.Point(pos.x+this.vx,pos.y+this.vy));

		if(pos.y < 0){
			this.die(); //die by falling off
		}

		//Die when hit an enemy
		var enemies = this.game.enemies;
		for(var i = 0; i < enemies.length; i++){
			if(this.collideWithEnemy(enemies[i])){
				if(this.shieldPower > 0){
					enemies[i].die();
					this.takeDamage();
				}
				else {this.die();}
			}
		}

		this.shootDelay--;

		if (this.ground == null) {
			this.vy += this.G;
		}

		/**After Moves*/
		var newPos = this.getPosition();
		var newPosRect = this.getPlayerRect();

		this.handleCollision( posRect, newPosRect );

		if(!this.alive && this.deadDelay > 0){
			this.deadDelay--;
		}

		if(this.atEdgeOrOutOfBounds() && this.alive){
			if(pos.x <= 0){ //left 
				this.setPositionX(0);
			} else if (pos.x >= screenWidth){ //right
				this.setPositionX(screenWidth);
			}
			if (pos.y >= screenHeight){ //ceiling
				this.setPositionY(screenHeight);
			}
		}
		/*
		this.blinkTime--;
		this.blinkDelay--;

		if(this.blinkTime > 0){
			if(this.blinkDelay < 4 && this.blinkDelay >= 2)
				//this.setVisible(false);
			if(this.blinkDelay < 2){
				//this.setVisible(true);
			}
			this.blinkDelay = 4;
		} else {
			//this.setVisible(true);
		}
		*/
		if(this.shieldPower == 3){
			this.invincibleTime--;
			if(this.invincibleTime == 0){
				this.shieldPower = 2;
				this.heavyShield.setVisible(true);
				this.invincibleShield.setVisible(false);
				this.blinkTime = 10;
			}
		}

		if(this.vy <= 0){
			this.jetpackFlame.setVisible(false);
		}
		if(this.jetpackFuel == 0 && this.jetpackOn){
			this.deactivateJetpack();
		}
		

	},
	/**
	 * Slow down movement in X axis to 0
	 * @return {Void}
	 */
	decelerateX: function(){
		while(this.vx > 0) {this.vx -= 1;}
		while(this.vx < 0) {this.vx += 1;}
	},
	/**
	 * move in X axis
	 * @param: {Number} dir = direction (-1 = left, 1 = right)
	 * @return {Void}
	 */
	move: function(dir){
		if(dir == 1){ //right
			this.vx = this.speed;
			this.setScaleX(1);
		}
		if(dir == -1){ //left
			this.vx = -this.speed;
			this.setScaleX(-1);
		}
	},
	/**
	 * Jump while on the ground
	 * @return {Void}
	 */
	jump: function(){
		if (this.ground && !this.jetpackOn) {
			this.vy = 12;
			this.ground = null;
		}
	},
	/**
	 * Get the rectangle that is for player's collision checking in world
	 * @return {cc.Rect}
	 */
	getPlayerRect: function() {
		var spriteRect = this.getBoundingBoxToWorld();
		var spritePos = this.getPosition();

		var dX = this.x - spritePos.x;
		var dY = this.y - spritePos.y;
		return cc.rect( spriteRect.x, //+ dX,
						spriteRect.y, //+ dY,
						spriteRect.width,
						spriteRect.height );
	},
	/**
	 * Check for collision
	 * @param: {cc.Rect} oldRect = the old bounding rectangle before moving
	 * @param: {cc.Rect} newRect = the next bounding rectangle after moves
	 * @return {Void}
	 */
	handleCollision: function(oldRect, newRect){
		if ( this.ground ) {
			if ( !this.ground.onTop( newRect ) ) {
				this.ground = null;
			}
		} else {
			if ( this.vy < 0 ) {
				var topFloor = this.findTopFloor( this.floor, oldRect, newRect );
				
				if ( topFloor ) {
					this.ground = topFloor;
					this.y = topFloor.getTopY()+(this.height/2);
					this.vy = 0;
				}
			}
		}
	},
	/**
	 * Find the floor to stand on
	 * @param: {Floor} floor = the floor
	 * @param: {cc.Rect} oldRect = the old bounding rectangle before moving
	 * @param: {cc.Rect} newRect = the next bounding rectangle after moves
	 * @return {Floor}
	 */
	findTopFloor: function( floor, oldRect, newRect ) {
		var topFloor = null;
		var topFloorY = -1;

		if ( floor.hitTop( oldRect, newRect ) ) {
			if ( floor.getTopY() >= topFloorY ) { //getTopY() = 70
				topFloorY = floor.getTopY();
				topFloor = floor;
			}
		}

		return topFloor;
	},
	/**
	 * Mutator of prefered floor
	 * @param: {Floor} floor = a floor to redefine
	 * @return {Void}
	 */
	setFloor: function(floor){
		this.floor = floor;
	},
	/**
	 * Shoot bullet
	 * @param: {Number} angle = angle by 0-360 or in degree unit
	 * @return {Void}
	 */
	shoot: function(angle){
		if(this.shootDelay < 0){
			var bullet = new Bullet(this,this.bulletSpeed,angle);
			this.game.addChild(bullet);
			this.game.bullets.push(bullet);
			this.shootDelay = 3;
		}
		
	},
	/**
	 * Check if the player hits the enemy
	 * @param: {Aliens, Drones} enemy = the enemy to check collision
	 * @return {Boolean}
	 */
	collideWithEnemy: function(enemy){
		var posRect = this.getBoundingBoxToWorld();
		var enemyPosRect = enemy.getBoundingBoxToWorld();
		return cc.rectIntersectsRect(posRect,enemyPosRect);
	},
	/**
	 * Jetpack goes upward
	 * @return {Void}
	 */
	jetpackThrust: function(dir){
		if(this.jetpackOn){
			if(dir == 1){ //up
				this.vy = this.speed+2;
			}
			if(dir == -1 && this.ground == null){ //down
				this.vy = -(this.speed-1);
			}
			this.jetpackFlame.setVisible(true);
			this.jetpackFuel-= 0.20;
		}
	},
	/**
	 * Get out of the game
	 * @return {Void}
	 */
	die: function(){
		this.game.removeChild(this);
		this.setPosition(new cc.Point(1000,1000)); //move it to out of bound (or else bullet may disappear in the place it dies)
		this.alive = false; //loose life
		if(this.deadDelay == 20) {this.game.life--;}
	},
	/**
	 * Check if the fly-drone flew off the screen
	 * @return {Boolean}
	 */
	atEdgeOrOutOfBounds: function(){
		var pos = this.getPosition();
		return pos.x <= 0||pos.x >= screenWidth||pos.y <= 0||pos.y >= screenHeight;
	},
	/**
	 * Get the jetpack item
	 * @param: {Number} fuel = the flying time of the jetpack
	 * @return {Void}
	 */
	getJetpackItem: function(fuel){
		this.jetpackOn = true;
		this.jetpackFuel = fuel;
		this.jetpack.setVisible(true);
	},
	/**
	 * Remove fully used jetpack
	 * @return {Void}
	 */
	deactivateJetpack:function(){
		this.jetpackOn = false;
		this.jetpack.setVisible(false);
		this.jetpackFlame.setVisible(false);
	},
	/**
	 * Get the shield item
	 * @return {Void}
	 */
	getShieldItem: function(){
		switch(this.shieldPower){
			case 0:
				this.shieldPower = 1; 
				this.lightShield.setVisible(true); break;
			case 1:
				this.shieldPower = 2;
				this.lightShield.setVisible(false);
				this.heavyShield.setVisible(true); break;
			case 2:
				this.shieldPower = 3;
				this.invincibleTime = 80;
				this.heavyShield.setVisible(false);
				this.invincibleShield.setVisible(true); break;
			case 3:
				this.invincibleTime = 80;
				break;
		}
	},
	/**
	 * Do damage on the Shield
	 * @return {Void}
	 */
	takeDamage: function(){
		switch(this.shieldPower){
			case 1:
				this.shieldPower = 0; 
				this.blinkTime = 10;
				this.lightShield.setVisible(false); break;
			case 2:
				this.shieldPower = 1;
				this.blinkTime = 10;
				this.lightShield.setVisible(true);
				this.heavyShield.setVisible(false); break;
			case 3:
				 break;
		}
		
	},
	/**
	 * Add 1 player's life into the game
	 * @return {Void}
	 */
	getExtraLifeItem: function(){
		if(this.game.life < 99){this.game.life++;}
		this.game.updateLife();
	}
});