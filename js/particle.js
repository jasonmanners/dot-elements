$.Particle = function(pos, image) {
  this.pos = pos || {
    x : 0,
    y : 0
  };

  this.image      = image;
  this.velocity   = 0;
  this.direction  = 0;
  this.life       = 0;
  this.alive      = 0;
};

$.Particle.prototype = {
  
  update : function(delta) {

    

    this.alive += delta;
    if(this.life < this.alive) {
      return false;
    }
    return true;
  },

  draw : function(ctx, image) {
    image = image || this.image;
    ctx.save();
      ctx.translate(this.pos.x, this.pos.y);
      ctx.drawImage(image, 0, 0, $.const.TILE_SIZE, $.const.TILE_SIZE);
    ctx.restore();
  }

};