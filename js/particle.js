$.Particle = function(pos, image) {
  this.pos = pos || {
    x : 0,
    y : 0
  };

  this.image      = image;
  this.vel        = 0;
  this.dir        = 0;
  this.life       = 0;
  this.alive      = 0;
  this.solid      = false;
};

$.Particle.prototype = {
  
  update : function(delta) {
    var step = delta/1000;

    this.pos.x += step * this.vel * Math.sin(this.dir);
    this.pos.y += step * this.vel * Math.cos(this.dir);
    this.alive += delta;  
      
    this.alive += delta;
    if(this.alive > this.life) {
      return true;
    }
    return false;
  },

  draw : function(ctx, image) {
    image = image || this.image;
    ctx.save();
      ctx.translate(this.pos.x, this.pos.y);
      ctx.drawImage(image, 0, 0, $.const.TILE_SIZE, $.const.TILE_SIZE);
    ctx.restore();
  }

};


$.ParticleEmitter = {
  particles : [],

  update : function(delta) {
    var particles = $.ParticleEmitter.particles;
    for(var i = 0; i < particles.length; i++) {
      // if update returns true the particle should be removed
      if(particles[i].update(delta)) {
        // remove
        $.ParticleEmitter.particles.splice(i,1);
        i--;
      }
    }
  },

  draw : function(ctx) {
    var particles = $.ParticleEmitter.particles;
    for(var i = 0; i < particles.length; i++) {
      particles[i].draw(ctx);
    }
  },

  addParticle : function(pos, vel, dir, color) {
    var canvas  = document.createElement("canvas"),
        ctx     = canvas.getContext("2d");

    canvas.width  = 5;
    canvas.height = 5;

    ctx.save();
      ctx.fillStyle = $.utils.colorString(color.r, color.g, color.b, color.a);
      ctx.fillRect(0,0,5,5);
    ctx.restore();


    var particle = new $.Particle(pos, canvas);
    particle.vel = vel;
    particle.dir = dir;
    particle.life = 2000;

    $.ParticleEmitter.particles.push(particle);
  }
};