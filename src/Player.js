/**
  * Player is the main controling character
  * The sprite is a small robot
  * @class Player
  */
var Player = cc.Sprite.extend({
	/**
	 * Constructor
	 */
	ctor: function(game){
		this._super();
		this.initWithFile('res/images/player.png');

		this.setPosition(new cc.Point(screenWidth/2,100));

		this.vx = 0; //horizonal speed
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
	 * Update the player's status, such as position, sprite image, states
	 * @return {Void}
	 */
	update: function(){
		/**Before Moves*/
		var pos = this.getPosition();
		var posRect = this.getPlayerRect();
		//this.vy += this.G;
		this.setPosition(new cc.Point(pos.x+this.vx,pos.y+this.vy));
		//this.autoDecelerateX();
		//if(!this.collisionBottomCheck()) {

		this.shootDelay--;

			if (this.ground == null) {
				this.vy += this.G;
			}
			//this.canJump = false;
		//}
		//else (this.canJump = true;)

		/**After Moves*/
		var newPos = this.getPosition();
		var newPosRect = this.getPlayerRect();

		this.handleCollision( posRect, newPosRect );
	},
	/**
	 * Slow down movement in X axis to 0
	 * @return {Void}
	 */
	decelerateX: function(){
		while(this.vx > 0) {this.vx -= 1;}
		while(this.vx < 0) {this.vx += 1;}
	},
	/**
	 * move in X axis
	 * @param: {Number} dir = direction (-1 = left, 1 = right)
	 * @return {Void}
	 */
	move: function(dir){
		if(dir == 1){ //right
			this.vx = 5;
			this.setScaleX(1);
		}
		if(dir == -1){ //left
			this.vx = -5;
			this.setScaleX(-1);
		}
	},
	/**
	 * Jump while on the ground
	 * @return {Void}
	 */
	jump: function(){
		if (this.ground) {
			this.vy = 8;
			this.ground = null;
		}
	},
	/**
	 * Get the rectangle that is for player's collision checking in world
	 * @return {cc.Rect}
	 */
    getPlayerRect: function() {
        var spriteRect = this.getBoundingBoxToWorld();
        var spritePos = this.getPosition();

        var dX = this.x - spritePos.x;
        var dY = this.y - spritePos.y;
        return cc.rect( spriteRect.x, //+ dX,
                        spriteRect.y, //+ dY,
                        spriteRect.width,
                        spriteRect.height );
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
	 * Mutator of prefered floor
	 * @param: {Floor} floor = a floor to redefine
	 * @return {Void}
	 */
	setFloor: function(floor){
		this.floor = floor;
	},
	/**
	 * UShoot bullet
	 * @return {Void}
	 */
	shoot: function(angle){
		if(this.shootDelay < 0){
			var bullet = new Bullet(this,angle);
			this.game.addChild(bullet);

			this.shootDelay = 3;
		}
		
	}
});