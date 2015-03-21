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

		this.addMouseHandlers();

		this.scheduleUpdate();

		this.player = new Player(this);
		this.addChild(this.player,1);

		this.floor = new Floor();
		this.addChild(this.floor);
		this.player.setFloor(this.floor);

		//this.player.floors.forEach( function( f ) {
        //    this.addChild( f );
        //}, this.player );

		console.log(this.floor.getTopY());

		this.bulletTest = cc.Sprite.create("res/images/bullet.png");		
     	this.addChild(this.bulletTest);

		return true;
	},
	/**
	 * Function for press key each time
	 * @return {Void}
	 */
	onKeyDown: function(e){
		if(e == cc.KEY.a){
			this.player.move(-1);
			//console.log("left");
		}
		if(e == cc.KEY.d){
			this.player.move(1);
			//console.log("right");
		}
		if(e == cc.KEY.w){
			this.player.jump();
			//console.log("jump");
		}
		//if(e == cc.KEY.c){
		//	this.player.shoot();
			//console.log("shoot");
		//}
		//if(e == cc.KEY.w){
		//	this.player.faceUp = true;
		//}
		//test with "console.log(message)"

	},
	/**
	 * Function for release key each time
	 * @return {Void}
	 */
	onKeyUp: function(e){
		if(e == cc.KEY.a){
			this.player.decelerateX();
		}
		if(e == cc.KEY.d){
			this.player.decelerateX();
		}
		//if(e == cc.KEY.w){
		//	this.player.faceUp = false;
		//}

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
	 * Add mouse to the game layer
	 * @return {Void}
	 */
	addMouseHandlers: function(){
		var self = this;
		cc.eventManager.addListener({
			event: cc.EventListener.MOUSE,
			onMouseDown : function(e){
				self.onMouseDown(e);
			},
			onMouseMoved: function(e){
				self.onMouseMoved(e);
			}
		},this);
	},
	/**
	 * When the screen is clicked by mouse
	 * @return {Void}
	 */
    onMouseDown:function (event) {
		var location = event.getLocation();
		//gameLayer.removeChild(redCircle);
		/*
		for(i=0;i<4;i++){
			var redBullet = cc.Sprite.create("redbullet.png");
			redBullet.xSpeed=bulletSpeed*Math.cos(i*Math.PI/2);
			redBullet.ySpeed=bulletSpeed*Math.sin(i*Math.PI/2);
			gameLayer.addChild(redBullet);	
			redBullet.setPosition(location);
			redBullet.schedule(function(){
     			this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
				if(this.getPosition().x>500 || this.getPosition().y>500 || this.getPosition().x<0 || this.getPosition().y<0){
					gameLayer.removeChild(this);
				}
			})
		}
		*/
		var angle = Math.atan((location.y-this.player.y)/Math.abs(location.x-this.player.x));
		angle = angle * (180/Math.PI);
		this.player.shoot(angle);
	},
	/**
	 * When the screen is not touched by mouse anymore
	 * @return {Void}
	 */
	 onMouseMoved:function(event){
		var location = event.getLocation();
		this.bulletTest.setPosition(location);
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

