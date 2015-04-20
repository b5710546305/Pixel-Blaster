/**
  * The explosion effect class
  * @class ExplosionEffect
  */
var ExplosionEffect = cc.Sprite.extend({
	/**
	 * Constructor
	 * @param: {GameLayer} game = the current game
	 */
	ctor: function(game){
		this._super();

		/**WARNING!!**/
		/**This is just an effect**/

		this.game = game;

		this.game.movingObjects.push(this); //replace this.scheduleUpdate(); to enable slowmode and speedmode 

		this.appearTime = 10;

		this.game.items.push(this);
	}
});