$.Hero = function() {
  this.pos = {
    x : 0,
    y : 0
  };
  
  this.vel = {
    x   : 0,
    y   : 0,
    max : 300,
    delta : {
      x : 0,
      y : 0
    }
  };

  this.acc = {
    x : 0,
    y : 0
  };

  this.delta = {
    x : 0,
    y : 0
  };

  this.mass = 5;

  this.prevPos   = this.pos;
  this.dir = 1;

  this.powers    = [];
  this.health    = 100;

  this.jumpCounter = 0;

  this.width  = $.const.TILE_SIZE;
  this.height = $.const.TILE_SIZE;
  this.radius = $.const.TILE_SIZE / 2;

  this.mineDistance = 100;

  this.inventory = {
    dirt : 0
  };


  this.time = 0;
  // this.img = new Image();
  // this.img.src = 'img/running.png';
    
  // this.height = 32;
  this.height = 15;

  this.frame = {
    num : 0,
    cur : 0,
    step : 250
  };

  this.mode = 0;

  this.shrines = 0;
};

$.Hero.prototype = {
  
  win : function() {
    return this.shrines === 4;
  },

  getCenter : function() {
    return {
      x: this.pos.x + (this.width/2),
      y: this.pos.y + (this.height/2)
    }
  },

  setMode : function(mode) {
    this.mode = mode;
  },

  power : function(tiles, mouse) {

    var x = Math.floor(mouse.x / $.const.TILE_SIZE),
        y = Math.floor(mouse.y / $.const.TILE_SIZE);

    
    if(this.mode & 1 && tiles[x][y] !== null && this.withinRange(mouse)) {
      tiles[x][y] = null;
      this.inventory.dirt++;
    }
    else if(this.mode >> 1 & 1 && this.inventory.dirt > 0 && this.withinRange(mouse)) {
      if(tiles[x][y] === null) {
        tiles[x][y] = new $.Tile.Dirt({x: x*$.const.TILE_SIZE, y: y*$.const.TILE_SIZE});
        this.inventory.dirt--;

      }
    }
    else if(this.mode >> 2 & 1) {
      console.log('FIRE', this.mode)
    }
    document.getElementById('dirt-num').innerHTML = this.inventory.dirt;
  },

  withinRange : function(mouse) {
    return Math.abs($.utils.distance(mouse, this.pos)) < this.mineDistance;
  },

  moveLeft : function() {
    this.dir = -1;
    this.acc.x = 650;
  },
  moveRight : function() {
    this.dir = 1;
    this.acc.x = 650;
  },
  
  stop : function() {
    this.acc.x = -1000;
  },

  move : function(direction, units) {
    this.pos[direction] += units;
  },

  handleCollision : function(pos, size, i, j) {
    var hlx = this.pos.x,
        hrx = this.pos.x + this.width,
        hty = this.pos.y,
        hby = this.pos.y + this.height,
        hcx = this.pos.x + this.width / 2,
        hcy = this.pos.y + this.height / 2;

    var plx = pos.x,
        prx = pos.x + size,
        pty = pos.y,
        pby = pos.y + size,
        pcx = pos.x + size/2,
        pcy = pos.y + size/2;

    
    //top
    if(hty < pby && hty > pty && Math.abs(hcx - pcx) < size/2) {
      this.pos.y = pby;
      this.acc.y = 0;
      this.vel.y = 0;
      return true;
    }
    // Bottom
    else if(hby > pty && hby < pby && Math.abs(hcx - pcx) < size/2) {
      this.pos.y = pty-this.height;
      this.acc.y = 0;
      this.vel.y = 0;
      this.jumpCounter = 0;
      // debugger;
      return true;
    }

    
    if(hlx < prx && hlx > plx && $.utils.toIndex(hty, size) === $.utils.toIndex(pty, size)) {
      this.pos.x = prx;
      // this.acc.x = 0;
      this.vel.x = 0;
    }
    // Right
    else if(hrx > plx && hrx < prx && $.utils.toIndex(hty, size) === $.utils.toIndex(pty, size)) {
      this.pos.x = plx - this.width;
      // this.acc.x = 0;
      this.vel.x = 0;
    }

    return false;
  },

  jump : function() {
    
    if(this.jumpCounter < 2){
      console.log('jump')
      this.jumpCounter++;
      this.vel.y = -500;
    }
  },

  update : function(delta) {
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
    this.vel.y += (step * this.acc.y) + (step * $.const.GRAVITY * this.mass);

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
    var x   = this.pos.x,
        y   = this.pos.y;

    // ctx.save();
    //   ctx.translate(x, y);
    //   ctx.scale(this.dir, 1);
    //   ctx.drawImage(this.img, 32*(this.frame.num), 0, 30, 42, 0, 0, 32, 42);
    // ctx.restore();
    var radius = 15/2;
    
    ctx.save();
      var p1 = {
        x : x+5,
        y : y - ((this.height)/3)*1
      };
      var p2 = {
        x : x+5,
        y : y - ((this.height)/3)*2
      };

      var ds = Math.sin(this.time/150),
          dc = Math.cos(this.time/150);
      // console.log(this.vel.x   * 0.1)
      var ex = ds*this.width/4 + x+5 + (this.vel.x * -1 * 0.05);
      var ey = dc*5 + y - this.height;
      ctx.beginPath();
      ctx.moveTo(x, this.getCenter().y);
      // ctx.bezierCurveTo(p1.x-ds*this.width, p1.y, p2.x+dc*(this.width/2), p2.y, ex, ey);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x+dc*(this.width/2), p2.y, ex, ey);
      // ctx.bezierCurveTo(p2.x+dc*(this.width/2), p2.y, p1.x+ds*this.width, p1.y+dc*10, x+this.width, this.getCenter().y);
      ctx.bezierCurveTo(p2.x+dc*(this.width/2), p2.y, p1.x, p1.y+dc*10, x+this.width, this.getCenter().y);
      // ctx.strokeStyle = "rgba(0,0,0,1.0)";
      ctx.strokeStyle = "#400900";
      ctx.stroke();
      // ctx.lineTo(this.getCenter().y, x);
      // ctx.arc(x+radius, y+radius, radius, 0 , 1 * Math.PI, false);
      ctx.closePath();
      // ctx.fillStyle = "rgba(11,30,38,0.95)";
      ctx.fillStyle = "rgba(255,3,0,0.6)";
      ctx.fill();
      // debugger;
    ctx.restore();

    // ctx.save();
    //   ctx.strokeStyle = "rgba(11,30,38,0.95)";
    //   ctx.beginPath();
    //   ctx.arc(x+radius, y+radius, radius, 0 , 2 * Math.PI, false);
    //   ctx.closePath();
    //   ctx.lineWidth = 3;
    //   ctx.stroke();
    // ctx.restore();

    ctx.save();
      // ctx.fillStyle = "rgba(110,179,56,0.5)";
      // ctx.fillStyle = "rgba(18,51,64, 0.95)";
      ctx.fillStyle = "rgba(42,239,247,0.8)";
      ctx.beginPath();
      ctx.arc(x+radius, y+radius, radius, 0 , 2 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle="rgba(11,73,182,1.0)";
      ctx.lineWidth = 1;
      ctx.stroke();
    ctx.restore();



    // ctx.save();
    //   ctx.moveTo(x, y);
    //   ctx.lineTo(x+this.width, y);
    //   ctx.strokeStyle = '#FFFFFF';
    //   ctx.stroke();
    // ctx.restore();
  }
};