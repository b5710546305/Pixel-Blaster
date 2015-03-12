var Player = cc.Sprite.extend({
	ctor: function(){
		this._super();
		this.initWithFile('res/images/player.png');

		this.setPosition(new cc.Point(screenWidth/2,100));

		this.vx = 0;
		this.vy = 0;

		this.ax = 0;
		this.ay = 0;

		this.scheduleUpdate();
	},
	update: function(){
		var pos = this.getPosition();
		this.vx += this.ax;
		this.vy += this.ay;
		this.setPosition(new cc.Point(pos.x+this.vx,pos.y+this.vy));
	}
});