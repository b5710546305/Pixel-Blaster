var GameLayer = cc.LayerColor.extend({
	init: function(){
		this._super(new cc.Color(0,0,0,255));
		this.setPosition(new cc.Point(0,0));

		this.addKeyboardHandlers();

		this.scheduleUpdate();

		this.player = new Player();
		this.addChild(this.player,1);

		return true;
	},
	onKeyDown: function(e){
		if(e == cc.KEY.left){
			this.player.move(-1);
			console.log("left");
		}
		if(e == cc.KEY.right){
			this.player.move(1);
			console.log("right");
		}
		//test with "console.log(message)"

	},
	onKeyUp: function(e){
		this.player.decelerateX();
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

