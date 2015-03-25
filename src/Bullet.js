/**
  * Bullet that fires from robot, drones and aliens
  * @class Bullet
  */
  var Bullet = cc.Sprite.extend({
	/**
	 * Constructor
	 * @param: {Player,Aliens} owner = the current owner of the bullet, can be both player and enemies
	 * @param: {Number} speed = the speed of the bullet
	 * @param: {Number} angle = the angle of the bullet
	 */
	ctor: function(owner,speed,angle){
		this._super();
		this.initWithFile('res/images/bullet.png');

		this.owner = owner;

		this.game = owner.game;

		this.setPosition(new cc.Point(owner.x,owner.y-4));

		//if(!owner.faceUp){
			this.setScaleX(owner.getScaleX());
			//this.vx = 10*owner.getScaleX(); //horizonal speed
			//this.vy = 0; //vertical speed
		
		if(owner.getScaleX() == -1){
			this.setRotation(angle);
		} else {
			this.setRotation(-angle);
		}
		
		//Speed by angle
		this.vx = speed*owner.getScaleX()*Math.cos(angle*(Math.PI/180));
		this.vy = speed*owner.getScaleY()*Math.sin(angle*(Math.PI/180));

		this.scheduleUpdate();
		
	},
	/**
	 * Update the bullet's status, such as position, sprite image, states
	 * @return {Void}
	 */
	update: function(){
		var pos = this.getPosition();
		//this.vy += this.G;
		this.setPosition(new cc.Point(pos.x+this.vx,pos.y+this.vy));

		if(this.hitFloor()||this.outOfBounds()){
			this.game.removeChild(this);
		}
		if(this.owner == this.game.player){
			var enemies = this.game.enemies;
			for(var i = 0; i < enemies.length; i++){
				if(this.hitEnemy(enemies[i])){
					enemies[i].die();
					this.game.removeChild(this);
					break;
				}
			}
		} else {
			if(this.hitEnemy(this.game.player)){
				this.game.player.die();
				this.game.removeChild(this);
			}
		}
		
		
	},
	/**
	 * Check if the bullet hits the floora
	 * @return {Boolean}
	 */
	hitFloor: function(){
		var posRect = this.getBoundingBoxToWorld();
		var floorPosRect = this.game.floor.getBoundingBoxToWorld();
		return cc.rectIntersectsRect(posRect,floorPosRect);
	},
	/**
	 * Check if the bullet hits the enemy
	 * @return {Boolean}
	 * @param {Player,Aliens} enemy : the enemy hit
	 */
	hitEnemy: function(enemy){
		var posRect = this.getBoundingBoxToWorld();
		var enemyPosRect = enemy.getBoundingBoxToWorld();
		return cc.rectIntersectsRect(posRect,enemyPosRect);
	},
	/**
	 * Check if the bullet flew off the screen
	 * @return {Boolean}
	 */
	outOfBounds: function(){
		var pos = this.getPosition();
		return pos.x < 0||pos.x > screenWidth||pos.y < 0||pos.y > screenHeight;
	}
});