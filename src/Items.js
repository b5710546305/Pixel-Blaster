/**
  * The item class that will extends into various items
  * @class Item (abstract)
  */
var Item = cc.Sprite.extend({
	/**
	 * Constructor
	 * @param: {GameLayer} game = the current game
	 */
	ctor: function(game){
		this._super();

		/**WARNING!!**/
		/**This is ABSTRACT CLASS, this class will not be visible in game at all, only its subclasses**/

		this.game = game;

		this.game.movingObjects.push(this); //replace this.scheduleUpdate(); to enable slowmode and speedmode 
		
		this.vx = 0; //horizonal speed
		this.vy = 0; //vertical speed
		this.G = -1; //gravity
		this.speed = 3;

		this.ground = null;
		this.floor = this.game.floor;

		this.appearTime = 180;
	},
	/**
	 * Update the item's status, such as position, usually falling into the ground
	 * @return {Void}
	 */
	update: function(){
		/**Before Moves*/
		var pos = this.getPosition();
		var posRect = this.getBoundingBoxToWorld();

		this.setPosition(new cc.Point(pos.x+this.vx,pos.y+this.vy));

		if(this.ground == null){
			this.vy += this.G;
		}

		/**After Moves*/
		var newPos = this.getPosition();
		var newPosRect = this.getBoundingBoxToWorld();

		this.handleCollision( posRect, newPosRect );

		this.appearTime--;

		if(this.appearTime < 0){
			this.beRemoved();
		}

		if(this.outOfBounds()){
			this.game.removeChild(this);
		}

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
	 * Check if the alien went off the screen
	 * @return {Boolean}
	 */
	outOfBounds: function(){
		var pos = this.getPosition();
		return pos.x < -10||pos.x > screenWidth+10||pos.y < -10||pos.y > screenHeight+10;
	},
	/**
	 * Get out of the game
	 * @return {Void}
	 */
	beRemoved: function(){
		this.game.removeChild(this);
		this.setPosition(new cc.Point(1000,1000)); //move it to out of bound (or else something may disappear in the place the bullet vanishes)
	}
});

/**
  * The static final variables for enemy index for game layer
  * @class GameLayer.ENEMIES
  */
Item.TYPE = {
	//60% chance of no items
	EXTRA_LIFE: 0, //5% chance of this
	JETPACK: 1, //15% chance of this
	SHIELD: 2 //20% chance of this
};

/**
  * The extra life item class
  * @class ExtraLifeItem
  */
var ExtraLifeItem = Item.extend({
	/**
	 * Constructor
	 * @param: {GameLayer} game = the current game
	 */
	ctor: function(game,x,y){
		this._super(game);

		this.initWithFile('res/images/item_extra_life.png');

		this.setPosition(new cc.Point(x,y));		

		this.game.movingObjects.push(this); //replace this.scheduleUpdate(); to enable slowmode and speedmode 
		
	}
});

/**
  * The jetpack item class
  * @class JetpackItem
  */
var JetpackItem = Item.extend({
	/**
	 * Constructor
	 * @param: {GameLayer} game = the current game
	 */
	ctor: function(game,x,y){
		this._super(game);

		this.initWithFile('res/images/item_jetpack.png');

		this.setPosition(new cc.Point(x,y));		

		this.game.movingObjects.push(this); //replace this.scheduleUpdate(); to enable slowmode and speedmode 
		
	}
});

/**
  * The shield item class
  * @class ShieldItem
  */
var ShieldItem = Item.extend({
	/**
	 * Constructor
	 * @param: {GameLayer} game = the current game
	 */
	ctor: function(game,x,y){
		this._super(game);

		this.initWithFile('res/images/item_shield.png');

		this.setPosition(new cc.Point(x,y));		

		this.game.movingObjects.push(this); //replace this.scheduleUpdate(); to enable slowmode and speedmode 
		
	}
});