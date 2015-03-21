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
		this.vx = 30*owner.getScaleX()*Math.cos(angle*(Math.PI/180));
		this.vy = 30*owner.getScaleY()*Math.sin(angle*(Math.PI/180));

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

		if(this.hitFloor()){
			this.game.removeChild(this);
		}
	},
	/**
	 * Check if the bullet hits the floor
	 * @return {Boolean}
	 */
	hitFloor: function(){
		var posRect = this.getBoundingBoxToWorld();
		var floorPosRect = this.game.floor.getBoundingBoxToWorld();
		return cc.rectIntersectsRect(posRect,floorPosRect);
	}
});