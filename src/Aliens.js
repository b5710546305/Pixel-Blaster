/**
  * The first and basic shooting alien that shoots randomly on land
  * @class GroundAlien
  */
var GroundAlien = cc.Sprite.extend({
	/**
	 * Constructor
	 * @param: {GameLayer} game = the current game
	 * @param: {Number} dir = the direction to be spawned (-1 = left, 1 = right)
	 */
	ctor: function(game,dir){
		this._super();
		this.initWithFile('res/images/ground_alien.png');

		/**WARNING!!**/
		/**This is GROUND ALIEN, DO NOT confuses the code with DRIVER ALIEN OR OTHER ALIENS**/

		var spawnHeight = 100;

		if(dir < 0)
			this.setPosition(new cc.Point(0,spawnHeight));
		else
			this.setPosition(new cc.Point(screenWidth,spawnHeight));
		if(dir < 0)
			this.setScaleX((dir/dir))
		else
			this.setScaleX(-(dir/dir))
		

		if(dir < 0)
			this.vx = 4*((dir/dir)); //horizonal speed to right
		else
			this.vx = 4*(-(dir/dir)); //horizonal speed to left
		this.vy = 0; //vertical speed
		this.G = -1; //gravity

		this.ground = null;
		this.floor = null;
		this.game = game;

		this.shootDelay = this.game.getRandomInt(20,80);
		this.game.movingObjects.push(this); //replace this.scheduleUpdate(); to enable slowmode and speedmode 
		
	},
	/**
	 * Update the alien's status, such as position, sprite image, states, shooting time
	 * @return {Void}
	 */
	update: function(){
		/**Before Moves*/
		var pos = this.getPosition();
		var posRect = this.getBoundingBoxToWorld();

		this.setPosition(new cc.Point(pos.x+this.vx,pos.y+this.vy));

		if(pos.y < 0){
			this.die(); //die by falling off
		}

		this.shoot();
		this.shootDelay--;

			if (this.ground == null) {
				this.vy += this.G;
			}

		/**After Moves*/
		var newPos = this.getPosition();
		var newPosRect = this.getBoundingBoxToWorld();

		this.handleCollision( posRect, newPosRect );

		if(this.outOfBounds()){
			this.game.removeChild(this);
			this.setPosition(new cc.Point(-1000,-1000));
			this.vx = 0;
			this.vy = 0;
		}
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
	 * Shoot in randomly generated delay time
	 * @return {Void}
	 */
	shoot: function(){
		var shotSpeed = 10;
		var angle = 0;
		if(this.shootDelay < 0){
			var bullet = new Bullet(this,shotSpeed,angle);
			this.game.addChild(bullet);
			this.game.bullets.push(bullet);
			this.shootDelay = this.game.getRandomInt(20,80);
		}
	},
	/**
	 * Get out of the game
	 * @return {Void}
	 */
	die: function(){
		this.game.removeChild(this);
		this.game.spawnItem(this.x,this.y);
		this.setPosition(new cc.Point(-1000,-1000)); //move it to out of bound (or else bullet may disappear in the place it dies)
		this.vx = 0;
		this.vy = 0;
		this.game.updateScore(100);
	},
	/**
	 * Check if the alien went off the screen
	 * @return {Boolean}
	 */
	outOfBounds: function(){
		var pos = this.getPosition();
		return pos.x < -10||pos.x > screenWidth+10||pos.y < -10||pos.y > screenHeight+10;
	}
});



/**
  * The high speed alien that bashes into the player
  * @class DriverAlien
  */
var DriverAlien = cc.Sprite.extend({
	/**
	 * Constructor
	 * @param: {GameLayer} game = the current game
	 * @param: {Number} dir = the direction to be spawned (-1 = left, 1 = right)
	 */
	ctor: function(game,dir){
		this._super();
		this.initWithFile('res/images/driver_alien.png');

		/**WARNING!!**/
		/**This is DRIVER ALIEN, DO NOT confuses the code with GROUND ALIEN OR OTHER ALIENS**/

		var spawnHeight = 100;

		if(dir < 0)
			this.setPosition(new cc.Point(0,spawnHeight));
		else
			this.setPosition(new cc.Point(screenWidth,spawnHeight));
		if(dir < 0)
			this.setScaleX((dir/dir))
		else
			this.setScaleX(-(dir/dir))
		

		if(dir < 0)
			this.vx = 1*((dir/dir)); //horizonal speed to right
		else
			this.vx = 1*(-(dir/dir)); //horizonal speed to left
		this.vy = 0; //vertical speed
		this.G = -1; //gravity
		this.accelX = 0; //acceleration

		this.ground = null;
		this.floor = null;

		this.game = game;
		this.game.movingObjects.push(this); //replace this.scheduleUpdate(); to enable slowmode and speedmode 
		
	},
	/**
	 * Update the alien's status, such as position, sprite image, states, shooting time
	 * @return {Void}
	 */
	update: function(){
		/**Before Moves*/
		var pos = this.getPosition();
		var posRect = this.getBoundingBoxToWorld();

		this.setPosition(new cc.Point(pos.x+this.vx,pos.y+this.vy));
		this.setAccelerationIntoPlayer();
		this.vx += this.accelX; //speed increase, break
		this.changeFacingDirectionBySpeed();

		if(pos.y < 0){
			this.die(); //die by falling off
		}

			if (this.ground == null) {
				this.vy += this.G;
			}

		/**After Moves*/
		var newPos = this.getPosition();
		var newPosRect = this.getBoundingBoxToWorld();

		this.handleCollision( posRect, newPosRect );

		if(this.outOfBounds()){
			this.game.removeChild(this);
			this.setPosition(new cc.Point(-1000,-1000));
			this.vx = 0;
			this.vy = 0;
		}
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
	 * Increase the speed into player's direction from the driver alien
	 * @return {Void}
	 */
	setAccelerationIntoPlayer: function(){
		var targetPlayer = this.game.player;
		if (this.game.player.alive){ //bash into player while player is alive
			if(this.game.player.x - this.x < 0) {// player is at left
				this.accelX = -1;
			}
			else if(this.game.player.x - this.x > 0) {// player is at right
				this.accelX = 1;
			}
		} else { 
			this.accelX = this.getScaleX(); //just move away after player died
		}
		
	},
	/**
	 * Changes the driver alien's facing direction according to current speed at x
	 * @return {Void}
	 */
	changeFacingDirectionBySpeed: function(){
		if(this.vx > 0){
			this.setScaleX(1);
		}
		else if (this.vx < 0){
			this.setScaleX(-1);
		}
	},
	/**
	 * Get out of the game
	 * @return {Void}
	 */
	die: function(){
		this.game.removeChild(this);
		this.game.spawnItem(this.x,this.y);
		this.setPosition(new cc.Point(-1000,-1000)); //move it to out of bound (or else bullet may disappear in the place it dies)
		this.vx = 0;
		this.vy = 0;
		this.game.updateScore(100);
	},
	/**
	 * Check if the alien went off the screen
	 * @return {Boolean}
	 */
	outOfBounds: function(){
		var pos = this.getPosition();
		return pos.x < -10||pos.x > screenWidth+10||pos.y < -10||pos.y > screenHeight+10;
	}
});