/**
  * The first and basic shooting alien that shoots randomly on land
  * @class GroundAlien
  */
var GroundAlien = cc.Sprite.extend({
	/**
	 * Constructor
	 * @param: {GameLayer} game = the current game
	 * @param: {Number} dir = the direction to be spawned (-1 = left, 1 = right)
	 */
	ctor: function(game,dir){
		this._super();
		this.initWithFile('res/images/ground_alien.png');

		var spawnHeight = 100;

		if(dir < 0)
			this.setPosition(new cc.Point(0,spawnHeight));
		else
			this.setPosition(new cc.Point(screenWidth,spawnHeight));

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

		this.shootDelay = this.game.getRandomInt(20,80);

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

		if(pos.y > screenHeight){
			this.die(); //die by falling off
		}

		this.shoot();
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
    },
    /**
	 * Shoot in randomly generated delay time
	 * @return {Void}
	 */
    shoot: function(){
    	var shotSpeed = 10;
    	var angle = 0;
    	if(this.shootDelay < 0){
			var bullet = new Bullet(this,shotSpeed,angle);
			this.game.addChild(bullet);
			this.game.bullets.push(bullet);
			this.shootDelay = this.game.getRandomInt(20,80);
		}
    },
    /**
	 * Get out of the game
	 * @return {Void}
	 */
    die: function(){
    	this.game.removeChild(this);
    	this.setPosition(new cc.Point(-1000,-1000)); //move it to out of bound [hell] (or else bullet may disappear in the place it dies)
    }
});