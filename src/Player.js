var Player = cc.Sprite.extend({
	/**
	 * Constructor
	 */
	ctor: function(){
		this._super();
		this.initWithFile('res/images/player.png');

		this.setPosition(new cc.Point(screenWidth/2,100));

		this.vx = 0;
		this.vy = 0;

		this.G = -1;

		this.onFloor = true;

		this.scheduleUpdate();
		
	},
	/**
	 * Update the player's status, such as position, sprite image, states
	 * @return {Void}
	 */
	update: function(){
		var pos = this.getPosition();
		//this.vy += this.G;
		this.setPosition(new cc.Point(pos.x+this.vx,pos.y+this.vy));
		//this.autoDecelerateX();
		//if(!this.collisionBottomCheck()) {
			this.vy += this.G; 
			//this.canJump = false;
		//}
		//else (this.canJump = true;)
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
		if(dir == 1){
			this.vx = 5;
			//this.getSprite().scaleX = 1;
		}
		if(dir == -1){
			this.vx = -5;
			//this.getSprite().scaleX = -1;
		}
	},
	/**
	 * Jump while can jump
	 * @return {Void}
	 */
	jump: function(){
		if (this.onFloor) {this.vy = 8;}
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
        return cc.rect( spriteRect.x + dX,
                        spriteRect.y + dY,
                        spriteRect.width,
                        spriteRect.height );
    },
    /**
	 * Check for collision
	 * @param: {cc.Rect} oldPosRect = ??
	 * @param: {cc.Rect} newPosRect = ??
	 * @return {Boolean}
	 */
	collisionCheck: function(oldPosRect, newPosRect){
		if(!this.onFloor){
			if(this.vy <= 0){
				
			}
		}

		return false;
	}
});