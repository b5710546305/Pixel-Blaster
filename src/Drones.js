/**
  * The first kind of drone that flies into player
  * @class FlyDrone
  */
var FlyDrone = cc.Sprite.extend({
	/**
	 * Constructor
	 * @param: {GameLayer} game = the current game
	 * @param: {Number} spawnIndex = the place to be spawned (-1 = topLeft, 0 = ceiling, 1 = topRight)
	 */
	ctor: function(game,spawnIndex){
		this._super();
		this.initWithFile('res/images/fly_drone.png');

		this.game = game;

		/**WARNING!!**/
		/**This is FLY DRONE, DO NOT confuses the code with OTHER DRONES**/

		var topLeft = -1;
		var ceiling = 0;
		var topRight = 1;
		switch(spawnIndex){
			case topLeft :
				this.setPosition(new cc.Point(0,screenHeight-this.game.getRandomInt(0,100)));
				break;
			case topRight :
				this.setPosition(new cc.Point(screenWidth,screenHeight-this.game.getRandomInt(0,100)));
				break;
			case ceiling :
				this.setPosition(new cc.Point(this.game.getRandomInt(0,screenWidth),screenHeight));
				break;
		}

		this.targetPlayer = this.game.player;

		this.vx = 0;
		this.vy = 0;

		this.speed = 6;

		this.game.movingObjects.push(this);
		
	},
	/**
	 * Update the drone's status, such as position, sprite image, states, speed, direction
	 * @return {Void}
	 */
	update: function(){
		var pos = this.getPosition();
		var posRect = this.getBoundingBoxToWorld();

		this.setSpeedTowardsPlayer();

		this.setPosition(new cc.Point(pos.x+this.vx,pos.y+this.vy));

		if(this.outOfBounds()){
			this.game.removeChild(this);
		}

	},
	/**
	 * Make the direction of the drone's velocity been set to be towards player all the time
	 * @return {Void}
	 */
	setSpeedTowardsPlayer: function(){
		var pos = this.getPosition();
		var playerPos = this.targetPlayer.getPosition();
		var XDiff = pos.x-playerPos.x; if(XDiff == 0) {XDiff = 0.0001;}
		var YDiff = pos.y-playerPos.y;
		var angleToPlayer = Math.atan(YDiff/XDiff);
		//Speed by angle
		var dirX = 1; 
		var dirY = 1;
		if(YDiff > 0 && XDiff > 0){//1st Quadrant from drone to player fix
			//angleToPlayer > 0
			dirX = -1; //move left
			dirY = -1; //move down
		}
		if(YDiff > 0 && XDiff < 0){//2nd Quadrant from drone to player fix
			//angleToPlayer < 0
			dirX = 1; //move right
			dirY = 1; //move down
		}
		if(YDiff < 0 && XDiff < 0){//3rd Quadrant from drone to player fix
			//angleToPlayer > 0
			dirX = 1; //move right
			dirY = 1; //move up
		}
		if(YDiff < 0 && XDiff > 0){//4th Quadrant from drone to player fix
			//angleToPlayer < 0
			dirX = -1; //move left
			dirY = -1; //move up
		}
		this.vx = this.speed*dirX*Math.cos(angleToPlayer);
		this.vy = this.speed*dirY*Math.sin(angleToPlayer);
		if(!this.targetPlayer.alive){ //fly away sadly if the player is already dead
			this.vx = 0;
			this.vy = this.speed;
		}
	},
	/**
	 * Get out of the game
	 * @return {Void}
	 */
	die: function(){
		this.game.removeChild(this);
		this.setPosition(new cc.Point(-1000,-1000)); //move it to out of bound (or else bullet may disappear in the place it dies)
		this.vx = 0;
		this.vy = 0;
	},
	/**
	 * Check if the fly-drone flew off the screen
	 * @return {Boolean}
	 */
	outOfBounds: function(){
		var pos = this.getPosition();
		return pos.x < 0||pos.x > screenWidth||pos.y < 0||pos.y > screenHeight;
	}
});