/**
  * The explosion effect class
  * @class Explosiont
  */
var Explosion = cc.Sprite.extend({
	/**
	 * Constructor
	 * @param: {Player,Aliens,Drones, Bullet} owner = the current owner of the explosion]
	 * @param {Number} x = starting x position
	 * @param {Number} y = starting y position
	 */
	ctor: function(owner,x,y){
		this._super();

		/**WARNING!!**/
		/**This is just an effect**/
		this.game = owner.game;

		this.initWithFile('res/images/explosion.png');

		this.setPosition(new cc.Point(x,y));		

		this.game.movingObjects.push(this); //replace this.scheduleUpdate(); to enable slowmode and speedmode 

		this.appearTime = 3;
	},
	/**
	 * Update the explosioneffect
	 * @return {Void}
	 */
	update: function(){
		this.appearTime--;

		if(this.appearTime < 0){
			this.beRemoved();
		}

	},
	/**
	 * Get out of the game
	 * @return {Void}
	 */
	beRemoved: function(){
		this.game.removeChild(this);
		var self = this;
		this.game.items.splice(this.game.items.indexOf(self),1);
		this.game.movingObjects.splice(this.game.movingObjects.indexOf(self),1);
		this.setPosition(new cc.Point(10000,-10000)); //move it to out of bound (or else it will be cheating accidentally)
	}
});