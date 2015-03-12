var Player = cc.Sprite.extend({
	ctor: function(){
		this._super();
		this.initWithFile('res/images/player.png');

		this.setPosition(new cc.Point(screenWidth/2,100));

		this.vx = 0;
		this.vy = 0;

		this.G = 1;

		this.scheduleUpdate();
		
	},
	update: function(){
		var pos = this.getPosition();
		//this.vy += this.G;
		this.setPosition(new cc.Point(pos.x+this.vx,pos.y+this.vy));
		//this.autoDecelerateX();
	},
	decelerateX: function(){
		while(this.vx > 0) {this.vx -= 1;}
		while(this.vx < 0) {this.vx += 1;}
	},
	move: function(dir){
		if(dir == 1){
			this.vx = 5;
			//this.getSprite().scaleX = 1;
		}
		if(dir == -1){
			this.vx = -5;
			//this.getSprite().scaleX = -1;
		}
	}
});