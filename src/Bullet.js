/**
  * Bullet that fires from robot, drones and aliens
  * @class Bullet
  */
var Bullet = cc.Sprite.extend({
	/**
	 * Constructor
	 * @param: {Player,Aliens,Drones} owner = the current owner of the bullet, can be both player and enemies
	 * @param: {Number} speed = the speed of the bullet
	 * @param: {Number} angle = the angle of the bullet
	 */
	ctor: function(owner,speed,angle){
		this._super();

		this.owner = owner;
		this.game = owner.game;

		if(this.owner == this.game.player){
			this.initWithFile('res/images/bullet.png');
		} else {
			this.initWithFile('res/images/alien_bullet.png');
		}
		this.setPosition(new cc.Point(owner.x,owner.y-4));

		this.setScaleX(owner.getScaleX());
		if(owner.getScaleX() == -1){
			this.setRotation(angle);
		} else {
			this.setRotation(-angle);
		}
		
		//Speed by angle
		this.vx = speed*owner.getScaleX()*Math.cos(angle*(Math.PI/180));
		this.vy = speed*owner.getScaleY()*Math.sin(angle*(Math.PI/180));

		this.game.movingObjects.push(this); //replace this.scheduleUpdate(); to enable slowmode and speedmode 
		
	},
	/**
	 * Update the bullet's status, such as position, sprite image, states
	 * @return {Void}
	 */
	update: function(){
		var pos = this.getPosition();
		this.setPosition(new cc.Point(pos.x+this.vx,pos.y+this.vy));

		if(this.hitFloor()||this.outOfBounds()){
			this.beRemoved();
		}
		if(this.owner == this.game.player){
			var enemies = this.game.enemies;
			for(var i = 0; i < enemies.length; i++){
				if(this.hitEnemy(enemies[i])){
					enemies[i].die();
					this.beRemoved();
					break;
				}
			}
		} else {
			if(this.hitEnemy(this.game.player)){
				if(this.game.player.shieldPower > 0){
					this.game.player.takeDamage();
				}else{
					this.game.player.die();
				}
				this.beRemoved();
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
	 * @param {Player,Aliens,Drones} enemy : the enemy hit
	 */
	hitEnemy: function(enemy){
		var posRect = this.getBoundingBoxToWorld();
		var enemyPosRect = enemy.getBoundingBoxToWorld();
		return cc.rectIntersectsRect(posRect,enemyPosRect);
	},
	/**
	 * Get out of the game
	 * @return {Void}
	 */
	beRemoved: function(){
		this.game.removeChild(this);
		var self = this;
		this.game.bullets.splice(this.game.bullets.indexOf(self),1);
		this.game.movingObjects.splice(this.game.movingObjects.indexOf(self),1);
		this.setPosition(new cc.Point(-1000,-1000)); //move it to out of bound (or else something may disappear in the place the bullet vanishes)
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