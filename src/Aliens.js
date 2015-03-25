/**
  * The first and basic shooting alien
  * @class Alien
  */
var GroundAlien = cc.Sprite.extend({
	/**
	 * Constructor
	 * @param: {GameLayer} game = the current game
	 * @param: {Number} dir = the direction to be spawned (-1 = left, 1 = right)
	 */
	ctor: function(game,dir){
		this._super();
		this.initWithFile('res/images/player.png');

		if(dir < 0)
			this.setPosition(new cc.Point(0,100));
		else
			this.setPosition(new cc.Point(screenWidth,100));

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

		this.shootDelay = 3;

		//this.aimingRotation = 0;

		//this.faceUp = false;

		this.scheduleUpdate();
		
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

		this.shootDelay--;

			if (this.ground == null) {
				this.vy += this.G;
			}

		/**After Moves*/
		var newPos = this.getPosition();
		var newPosRect = this.getBoundingBoxToWorld();

		this.handleCollision( posRect, newPosRect );
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
    }
});