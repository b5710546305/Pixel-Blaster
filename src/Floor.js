var Floor = cc.Sprite.extend({
	/**
	 * Constructor
	 */
	ctor: function(){
		this._super();
		this.initWithFile('res/images/floor.png');

		this.setAnchorPoint(new cc.Point(0,0));

		this.setPosition(new cc.Point(0,-19));
	},
	/**
	 * Return the top most y-value of the floor's `rect'
	 * @return {Number}
	 */
    getTopY: function() {
        return cc.rectGetMaxY( this.getBoundingBoxToWorld() );
    }
});