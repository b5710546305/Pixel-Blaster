/**
  * The first kind of drone that flies into player
  * @class FlyDrone
  */
  var FlyDrone = cc.Sprite.extend({
	/**
	 * Constructor
	 * @param: {GameLayer} game = the current game
	 * @param: {Number} dir = the direction to be spawned (-1 = left, 1 = right)
	 */
	ctor: function(game,spawnIndex){
		this._super();
		this.initWithFile('res/images/fly_drone.png');

		var spawnHeight = 500;
		this.setPosition(new cc.Point(300,spawnHeight));

		this.game = game;

		this.targetPlayer = this.game.player;

		this.vx = 0;
		this.vy = 0;

		this.speed = 6;

		this.scheduleUpdate();
		
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
	},
	/**
	 * Get out of the game
	 * @return {Void}
	 */
    die: function(){
    	this.game.removeChild(this);
    	this.setPosition(new cc.Point(-1000,-1000)); //move it to out of bound (or else bullet may disappear in the place it dies)
    }
});