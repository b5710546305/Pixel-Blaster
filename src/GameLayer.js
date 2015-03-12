/**
  * The game layer
  * @class GameLayer
  */
var GameLayer = cc.LayerColor.extend({
	/**
	 * Initialize
	 * @return {Boolean}
	 */
	init: function(){
		this._super(new cc.Color(0,0,0,255));
		this.setPosition(new cc.Point(0,0));

		this.addKeyboardHandlers();

		this.scheduleUpdate();

		this.player = new Player();
		this.addChild(this.player,1);

		this.floor = new Floor();
		this.addChild(this.floor);
		this.player.setFloor(this.floor);

		//this.player.floors.forEach( function( f ) {
        //    this.addChild( f );
        //}, this.player );

		console.log(this.floor.getTopY());

		return true;
	},
	/**
	 * Function for press key each time
	 * @return {Void}
	 */
	onKeyDown: function(e){
		if(e == cc.KEY.left){
			this.player.move(-1);
			console.log("left");
		}
		if(e == cc.KEY.right){
			this.player.move(1);
			console.log("right");
		}
		if(e == cc.KEY.z){
			this.player.jump();
			console.log("z");
		}
		//test with "console.log(message)"

	},
	/**
	 * Function for release key each time
	 * @return {Void}
	 */
	onKeyUp: function(e){
		if(e == cc.KEY.left){
			this.player.decelerateX();
		}
		if(e == cc.KEY.right){
			this.player.decelerateX();
		}

	},
	/**
	 * Add keyboard to the game layer
	 * @return {Void}
	 */
	addKeyboardHandlers: function(){
		var self = this;
		cc.eventManager.addListener({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed : function(e){
				self.onKeyDown(e);
			},
			onKeyReleased: function(e){
				self.onKeyUp(e);
			}
		},this);
	},
	/**
	 * Update the game scene
	 * @return {Void}
	 */
	update: function(){
		
	}
});

/**
  * The start scene
  * @class StartScene
  */
var StartScene = cc.Scene.extend({
	/**
	 * Start the game layer
	 * @return {Void}
	 */
	onEnter: function(){
		this._super();
		var layer = new GameLayer();
		layer.init();
		this.addChild(layer);
	}
});

