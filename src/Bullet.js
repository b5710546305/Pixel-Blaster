/**
  * Bullet that fires from robot, drones and aliens
  * @class Bullet
  */
  var Bullet = cc.Sprite.extend({
	/**
	 * Constructor
	 */
	ctor: function(owner,angle){
		this._super();
		this.initWithFile('res/images/bullet.png');

		this.owner = owner;

		this.setPosition(new cc.Point(owner.x,owner.y-4));


		this.scheduleUpdate();
		
	},
	/**
	 * Update the bullet's status, such as position, sprite image, states
	 * @return {Void}
	 */
	update: function(){
		var pos = this.getPosition();
		var posRect = this.getBoundingBoxToWorld();
		//this.vy += this.G;
		this.setPosition(new cc.Point(pos.x+this.vx,pos.y+this.vy));
	}
});