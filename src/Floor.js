/**
  * The floor is the basic grounding of the game
  * @class Floor
  */
var Floor = cc.Sprite.extend({
	/**
	 * Constructor
	 */
	ctor: function(){
		this._super();
		this.initWithFile('res/images/floor.png');

		this.setAnchorPoint(new cc.Point(0,0));

		this.setPosition(new cc.Point(0,-30));
	},
	/**
	 * Return the top most y-value of the floor's `rect'
	 * @return {Number}
	 */
    getTopY: function() {
        return cc.rectGetMaxY( this.getFloorRect() );
    },
    /**
	 * Get the rectangle that is for the floor's collision checking in world
	 * @return {cc.Rect}
	 */
	getFloorRect: function(){
		return this.getBoundingBoxToWorld();
	},
	/**
	 * Check if something is hitting the top of the floor
	 * @param: {cc.Rect} oldRect = the old bounding rectangle before moving
	 * @param: {cc.Rect} newRect = the next bounding rectangle after moves
	 * @return {Boolean}
	 */
	hitTop: function(oldRect, newRect){
		var f_rect = this.getBoundingBoxToWorld(); //Current Bounding Rectangle
        if ( cc.rectGetMinY( oldRect ) >= cc.rectGetMaxY( f_rect ) ) {
        	//if the feet of something [y = cc.rectGetMinY( oldRect )]
        	//is on top of the floor [y = cc.rectGetMaxY( brect )]
            var loweredNewRect = cc.rect( newRect.x,
                                          newRect.y - 1,
                                          newRect.width,
                                          newRect.height + 1 ); //lower collision state for 1 unit of something
            var uRect = cc.rectUnion( oldRect, newRect ); //fusion the old and new collision state
            return cc.rectIntersectsRect( uRect, f_rect ); //check if the something and the floor are stick to each other
        }
        return false; //if the feet of something is not at the floor's top
	},
	/**
	 * Check if something is hitting the top of the floor
	 * @param: {cc.Rect} rect = the rectangle to check is on top or not
	 * @return {Boolean}
	 */
	onTop: function( rect ) {
        var f_rect = this.getBoundingBoxToWorld(); //Floor's rectangle
        var f_minx = cc.rectGetMinY( f_rect ); //Floor's left most side
        var f_maxx = cc.rectGetMaxY( f_rect ); //Floor's right most side
        var minx = cc.rectGetMinY( rect ); //Object's left most side
        var maxx = cc.rectGetMaxY( rect ); //Object's right most side
        return ( minx <= f_maxx ) && ( f_minx <= maxx );
    }
});