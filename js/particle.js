$.Particle = function(pos, image) {
  this.pos = pos || {
    x : 0,
    y : 0
  };

  this.size = {
    x : $.const.TILE_SIZE, 
    y : $.const.TILE_SIZE
  };

  this.image      = image;
  this.vel        = {
    x : 0,
    y : 0
  };
  this.dir        = 0;
  this.life       = 0;
  this.alive      = 0;
  this.solid      = false;
  this.mass       = 0;
  this.grow       = 0;
};

$.Particle.prototype = {
  
  update : function(delta) {
    var step = delta/1000;

    if(this.emitter && this.alive > 100) {
      this.emitter.update(delta, this.pos);
    }

    var grav = 0;
    this.vel.y += step * $.const.GRAVITY * this.mass;
    this.pos.x += step * this.vel.x;
    this.pos.y += step * this.vel.y;
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
      ctx.scale(1+(this.grow * this.alive/this.life), 1+(this.grow * this.alive/this.life));
      ctx.drawImage(image, 0, 0, this.size.x, this.size.y);
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
    particle.vel.x = vel * Math.sin(dir);
    particle.vel.y = vel * Math.cos(dir);
    particle.dir = dir;
    particle.life = 2000;

    $.ParticleEmitter.particles.push(particle);

    return particle;
  },

  add : {
    fireball : function(pos, vel, dir) {
      var canvas  = document.createElement("canvas"),
          ctx     = canvas.getContext("2d");

      canvas.width  = 20;
      canvas.height = 20;

      var grd = ctx.createRadialGradient(10,10,2,10,10,7.5);
      grd.addColorStop(0, $.utils.colorString(255, 255, 0, 0.8));
      grd.addColorStop(1, $.utils.colorString(255, 0, 0, 0.8));
      

      $.render.fillCircle(ctx, {x:10,y:10}, 9, grd);

      var particle = new $.Particle(pos, canvas);
      particle.vel.x = vel * Math.sin(dir);
      particle.vel.y = vel * Math.cos(dir);
      particle.dir = dir;
      particle.life = 2000;
      particle.size.x = 20;
      particle.size.y = 20;
      particle.emitter = new $.Emitter();

      $.ParticleEmitter.particles.push(particle);
      return particle;
    },

    explosion : function(pos, vel, dir) {
      var canvas  = document.createElement("canvas"),
          ctx     = canvas.getContext("2d");

      canvas.width  = 15;
      canvas.height = 15;

      var grd = ctx.createRadialGradient(7.5,7.5,1,7.5,7.5,3);
      // grd.addColorStop(1, $.utils.colorString(255, 255, 255, 0.4));
      grd.addColorStop(0, $.utils.colorString(0, 0, 0, 0.8));
      grd.addColorStop(1, $.utils.colorString(0, 0, 0, 0.0));
      

      $.render.fillCircle(ctx, {x:7.5,y:7.5}, 3, grd);

      var particle = new $.Particle(pos, canvas);
      particle.vel.x = vel * Math.sin(dir);
      particle.vel.y = vel * Math.cos(dir);
      particle.dir = dir;
      particle.mass = 2.0;
      particle.life = 1000;

      $.ParticleEmitter.particles.push(particle);
      return particle;
    },

    dirt : function(pos, vel, dir) {
      var canvas  = document.createElement("canvas"),
          ctx     = canvas.getContext("2d");

      canvas.width  = 15;
      canvas.height = 15;
      
      ctx.save();
        ctx.fillStyle = "rgba(75,50,35,0.6)";
        ctx.fillRect(5,5,5,5);
      ctx.restore();

      var particle = new $.Particle(pos, canvas);
      particle.vel.x = vel * Math.sin(dir);
      particle.vel.y = vel * Math.cos(dir);
      particle.dir = dir;
      particle.mass = 2.0;
      particle.life = 1000;

      $.ParticleEmitter.particles.push(particle);
      return particle;
    },
  }
};

$.Emitter = function() {

};

$.Emitter.prototype = {
  update : function(delta, _pos) {
    var pos = $.utils.deepCopy(_pos);

    var tots = Math.random() * 10 + 10;
    for(var i = 0; i < tots; i++) {
      var canvas  = document.createElement("canvas"),
        ctx     = canvas.getContext("2d");

      canvas.width  = 6;
      canvas.height = 6;
      
      var alpha = Math.random()*0.7 + 0.3;
      var colr = 150 + Math.random()*100;


      var red     = $.utils.colorString(150 + Math.random()*100,0,0,alpha);
      var lellow  = $.utils.colorString(colr,colr,0, alpha);

      var fill = red;
      if(Math.random() > 0.7) {
        fill = lellow;
      }

      ctx.save();
        ctx.fillStyle = fill;
        ctx.fillRect(2,0,2,6);
      ctx.restore();

      ctx.save();
        ctx.fillStyle = fill;
        ctx.fillRect(0,2,6,2);
      ctx.restore();

      ctx.save();
        ctx.fillStyle = $.utils.colorString(colr,colr,0, alpha);
        ctx.fillRect(2,2,2,2);
      ctx.restore();


      var particle = new $.Particle({
        x : pos.x + Math.random()*20 - 10,
        y : pos.y - Math.random()*5 + 5
      },canvas);
      particle.life = Math.random()* 1250 + 250;
      
      particle.vel.x = Math.random()*100 - 50;
      particle.vel.y = Math.random()*100 - 50;
      
      var size = Math.random() * 3 + 8;
      particle.size.x = size;
      particle.size.y = size;

      particle.grow = -0.25;
      particle.mass = 0;
      
      $.ParticleEmitter.particles.push(particle);  
    }
  }
};