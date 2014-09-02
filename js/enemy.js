$.Enemy = function(pos) {
  this.pos = pos || {
    x : 0,
    y : 0
  };
  
  this.vel = {
    x   : 0,
    y   : 0,
    max : 150,
    delta : {
      x : 0,
      y : 0
    }
  };

  this.acc = {
    x : 150,
    y : 0
  };

  this.delta = {
    x : 0,
    y : 0
  };

  this.mass = 5;

  this.prevPos   = this.pos;
  this.dir = 1;

  this.health    = 100;


  this.width  = $.const.TILE_SIZE;
  this.height = $.const.TILE_SIZE;
  this.radius = $.const.TILE_SIZE / 2;

  this.time = 0;
};

$.Enemy.prototype = {
  update : function(delta, hero) {
    if(this.pos.x - hero.pos.x > 0) {
      this.dir = -1;
    }
    else {
      this.dir = 1;
    }

    var step = delta/1000;
    this.vel.delta.x = this.dir * step * this.acc.x;

    if(Math.abs(this.vel.x + this.vel.delta.x) <= this.vel.max) {
      this.vel.x += this.vel.delta.x;
    }
    // console.log(this.vel.x)
    if(this.vel.x < 0 && this.dir === 1 || this.vel.x > 0 && this.dir === -1) {  
      this.vel.x = 0;
    }
    // console.log(step * this.mass * $.const.GRAVITY)
    // console.log(this.acc.y)
    // @TODO: Add back in gravity
    // this.vel.y += (step * this.acc.y) + (step * $.const.GRAVITY * this.mass);

    this.delta.x = this.vel.x * step;
    this.delta.y = this.vel.y * step;
    // console.log('[%s * %s = %s]', step, this.vel.y, this.delta.y)
    this.prevPos = {
      x : this.pos.x,
      y : this.pos.y
    };

    this.pos.x += this.delta.x;
    this.pos.y += this.delta.y;

    this.time += delta;
  },

  draw : function(ctx) {
    ctx.save();
      $.render.fillCircle(ctx, this.pos, this.radius, {r:0,g:0,b:0,a:1});
    ctx.restore();
  }
};