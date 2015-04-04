var res = {
    player: "res/images/player.png",
    floor: "res/images/floor.png",
    bullet: "res/images/bullet.png",
    alien_bullet: "res/images/alien_bullet.png",
    ground_alien: "res/images/ground_alien.png",
    fly_drone: "res/images/fly_drone.png",
    driver_alien: "res/images/driver_alien.png",
    player_jetpack: "res/images/player_jetpack.png",
    player_jetpack_flame: "res/images/player_jetpack_flame.png",
    player_aiming_arrow_gun: "res/images/player_aiming_arrow_gun.png",
    player_shield_light: "res/images/player_shield_light.png",
    player_shield_heavy: "res/images/player_shield_heavy.png",
    player_shield_invincible: "res/images/player_shield_invincible.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}