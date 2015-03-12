var GameLayer = cc.LayerColor.extend({
	init: function(){
		this._super(new cc.Color(0,0,0,255));
		this.setPosition(new cc.Point(0,0));

		this.addKeyboardHandlers();

		this.scheduleUpdate();

		return true;
	},
	onKeyDown: function(e){
		//test with "console.log(message)"
	},
	onKeyUp: function(e){
		
	},

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
	update: function(){
		
	}
});

var StartScene = cc.Scene.extend({
	onEnter: function(){
		this._super();
		var layer = new GameLayer();
		layer.init();
		this.addChild(layer);
	}
});

