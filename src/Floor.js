var Floor = cc.Sprite.extend({
	ctor: function(){
		this._super();
		this.initWithFile('res/images/floor.png');

		this.setAnchorPoint(new cc.Point(0,0));

		this.setPosition(new cc.Point(0,-19));
	}
});