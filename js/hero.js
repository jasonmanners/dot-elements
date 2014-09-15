$.Hero = function() {
  this.pos = {
    x : 0,
    y : 0
  };

  this.startPos = {
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
  this.health    = 50;

  this.jumpCounter = 0;

  this.width  = $.const.TILE_SIZE;
  this.height = $.const.TILE_SIZE;
  this.radius = $.const.TILE_SIZE / 2;

  this.mineDistance = 100;

  this.inventory = {
    dirt : 0
  };

  this.timings = {
    mining : {
      current : 0,
      threshold : 250
    },
    shooting : {
      current   : 0,
      threshold : 500
    },
    damage : {
      current   : 0,
      threshold : 250
    },
    returnHome : {
      current   : 30001,
      threshold : 30000
    }
  };
  this.time = 0;
  // this.img = new Image();
  // this.img.src = 'img/running.png';
    
  this.height = 22.5;
  // this.height = 32.5;

  this.frame = {
    num : 0,
    cur : 0,
    step : 250
  };

  this.mode = 0;

  this.shrines = 0;

  this.sprite = new $.Sprite();
  // Head
  var head = new $.Piece({
    x : 7.5,
    y : 7.5
  });
  head.name = 'head';
  head.draw = function(ctx) {
    $.render.fillCircle(ctx, this.center, 7.5, {r: 42, g: 239, b: 247, a: 0.8});
    $.render.strokeCircle(ctx, this.center, 7.5, 3, {r: 11, g: 73, b: 182, a: 0.5});
  };
  // Foot
  var foot = new $.Piece({
    x : 7.5,
    y : 17.5
  });
  foot.name = 'foot';
  foot.draw = function(ctx) {
    // ctx.save();
    //   ctx.beginPath();
    //   ctx.moveTo(this.center.x-6.5, this.center.y - 2.5);
    //   ctx.quadraticCurveTo(this.center.x, this.center.y, this.center.x+6.5, this.center.y - 2.5);
    //   // ctx.lineTo(this.center.x+6.5, this.center.y - 2.5);
    //   ctx.lineTo(this.center.x+2, this.center.y + 13);

    //   ctx.quadraticCurveTo(this.center.x, this.center.y + 15, this.center.x-2, this.center.y + 13);

    //   ctx.lineTo(this.center.x-6.5, this.center.y - 2.5);
    //   ctx.closePath();
    //   ctx.fillStyle = $.utils.colorString(42, 239, 247, 0.8);
    //   ctx.fill();
    //   ctx.strokeStyle = $.utils.colorString(11, 73, 182, 0.5);
    //   ctx.lineWidth = 3;
    //   ctx.stroke();
    // ctx.restore();

    

    $.render.fillCircle(ctx, this.center, 7.5/2, {r: 42, g: 239, b: 247, a: 0.8});
    $.render.strokeCircle(ctx, this.center, 7.5/2, 3, {r: 11, g: 73, b: 182, a: 0.5});
  };

  // Animation
  var idle = new $.Animation();
  idle.skeleton.head = function(delta, center, oCenter) {
    center.y = oCenter.y - 4 - Math.sin(this.alive/250) * 1;
    // Exists for easing out of the run
    center.x = oCenter.x + hero.vel.x/70;
  }.bind(idle);

  var hero = this;
  var left_run = new $.Animation();
  left_run.skeleton.head = function(delta, center, oCenter) {
    center.x = oCenter.x + hero.vel.x/70;
    center.y = oCenter.y - 4 - Math.sin(this.alive/250) * 1;
    // center.y = oCenter.y;
  }.bind(left_run);

  var right_run = new $.Animation();
  right_run.skeleton.head = function(delta, center, oCenter) {
    center.x = oCenter.x + hero.vel.x/70;
    center.y = oCenter.y - 4 - Math.sin(this.alive/250) * 1;
    // center.y = oCenter.y;
  }.bind(right_run);

  this.sprite.pieces.push(foot);
  this.sprite.pieces.push(head);
  
  this.sprite.animations.idle       = idle;
  this.sprite.animations.left_run   = left_run;
  this.sprite.animations.right_run  = right_run;
  this.sprite.currentAnimation = this.sprite.animations.idle;

  this.emitter = new $.Emitter();

};

$.Hero.prototype = {
  
  win : function() {
    return this.shrines === 4;
  },

  lose : function() {
    return this.health <= 0;
  },

  takeDamage : function(dmg) {
    if(this.canTakeAction('damage')) {
      this.timings.damage.current = 0;
      this.health -= dmg;
    }
  },

  returnHome : function() {
    if(this.timings.returnHome.current > this.timings.returnHome.threshold) {
      this.pos.x = this.startPos.x;
      this.pos.y = this.startPos.y;
      this.timings.returnHome.current = 0;
    }
  },

  canTakeAction : function(action) {
    return this.timings[action].current > this.timings[action].threshold;
  },

  getCenter : function() {
    return {
      x: this.pos.x + (this.width/2),
      y: this.pos.y + (this.height/2)
    };
  },

  setMode : function(mode) {
    this.mode = mode;
  },

  power : function(tiles, mouse) {

    var x = Math.floor(mouse.x / $.const.TILE_SIZE),
        y = Math.floor(mouse.y / $.const.TILE_SIZE);

    
    if(this.mode & 1 && tiles[x][y] !== null && this.withinRange(mouse)) {
      if(this.timings.mining.current > this.timings.mining.threshold) {
        tiles[x][y] = null;
        this.inventory.dirt++;


        for(var z = 0; z < 10; z++) {
          $.ParticleEmitter.add.dirt($.utils.deepCopy(mouse), 200*Math.random() + 100, Math.PI*4/3 - Math.PI*Math.random()*2/3);
        }
        this.timings.mining.current = 0;
      }
    }
    else if(this.mode >> 1 & 1 && this.inventory.dirt > 0 && this.withinRange(mouse)) {
      if(tiles[x][y] === null) {
        tiles[x][y] = new $.Tile.Dirt({x: x*$.const.TILE_SIZE, y: y*$.const.TILE_SIZE});
        this.inventory.dirt--;
      }
    }
    else if(this.mode >> 2 & 1) {
      if(this.timings.shooting.current > this.timings.shooting.threshold) {
        var dir = 1;
        if(this.pos.x > mouse.x) {
          dir = -1;
        }

        var dx = mouse.x - this.pos.x;
        var dy = mouse.y - this.pos.y;

        dir = Math.atan2(-dy, dx) + Math.PI*0.5;
        // if(dir < 0) {
        //   dir += 2 * Math.PI;
        // }
        // var soundURL = jsfxr([0,,0.1753,,0.0941,0.6039,0.0981,-0.4154,,,,,,0.4342,0.1938,,,,1,,,,,0.5]);
        // var player = new Audio();
        // player.src = soundURL;
        // player.play();
        // player.addEventListener('ended', function(){
        //   console.log('jump ended')
        // })

        var part = $.ParticleEmitter.add.fireball($.utils.deepCopy(this.pos), 800, dir );
        part.solid = true;
        this.timings.shooting.current = 0;

      }
    }
    document.getElementById('slot-3-qty').innerHTML = this.inventory.dirt;
  },

  withinRange : function(mouse) {
    return Math.abs($.utils.distance(mouse, this.pos)) < this.mineDistance;
  },

  moveLeft : function() {
    this.dir = -1;
    this.acc.x = 650;

    this.sprite.currentAnimation = this.sprite.animations.left_run;
  },
  moveRight : function() {
    this.dir = 1;
    this.acc.x = 650;

    this.sprite.currentAnimation = this.sprite.animations.right_run;
  },
  
  stop : function() {
    this.acc.x = -1000;
    this.sprite.currentAnimation = this.sprite.animations.idle;
  },

  move : function(direction, units) {
    this.pos[direction] += units;
  },

  jump : function() {
    if(this.jumpCounter < 2){
      this.jumpCounter++;
      this.vel.y = -500;

      // var soundURL = jsfxr([0,,0.105,,0.1803,0.3503,,0.2001,,,,,,0.3262,,,,,1,,,0.1502,,0.5]);
      // var player = new Audio();
      // player.src = soundURL;
      // player.play();
    }
  },

  update : function(delta) {
    var step = delta/1000;

    // this.emitter.update(delta, this.pos);

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
    
    this.sprite.update(delta);

    this.time += delta;

    document.getElementById('health').innerHTML = this.health;
    this.updateTimings(delta);
  },

  updateTimings : function(delta) {
    var timingKeys = Object.keys(this.timings),
        i          = timingKeys.length; 

    while(i--) {
      var timing = this.timings[timingKeys[i]];
      if(timing.current <= timing.threshold) {
        timing.current += delta;
      }
    }

    if(!this.canTakeAction('returnHome')) {
      document.getElementById('slot-1-qty').innerHTML = Math.round((this.timings.returnHome.threshold - this.timings.returnHome.current)/1000);
    }
    else if(document.getElementById('slot-1-qty').innerHTML !== '') {
      document.getElementById('slot-1-qty').innerHTML = '';
    }
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
        x : x+5+(this.vel.x/70),
        y : y - ((this.height)/3)*1 - 10 
      };
      var p2 = {
        x : x+5+(this.vel.x/70),
        y : y - ((this.height)/3)*2 - 10
      };

      var ds = Math.sin(this.time/150),
          dc = Math.cos(this.time/150);
      // console.log(this.vel.x   * 0.1)
      var ex = ds*this.width/4 + x+5 + (this.vel.x * -1 * 0.05);
      var ey = dc*5 + y - this.height -10;
      ctx.beginPath();
      ctx.moveTo(x+(this.vel.x/70), this.getCenter().y - 10);
      // ctx.bezierCurveTo(p1.x-ds*this.width, p1.y, p2.x+dc*(this.width/2), p2.y, ex, ey);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x+dc*(this.width/2), p2.y, ex, ey);
      // ctx.bezierCurveTo(p2.x+dc*(this.width/2), p2.y, p1.x+ds*this.width, p1.y+dc*10, x+this.width, this.getCenter().y);
      ctx.bezierCurveTo(p2.x+dc*(this.width/2), p2.y, p1.x, p1.y+dc*10, x+this.width+(this.vel.x/70), this.getCenter().y -10);
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
      ctx.translate(this.pos.x, this.pos.y);
      this.sprite.draw(ctx);
      
    ctx.restore();
    // ctx.save();
    //   // ctx.fillStyle = "rgba(110,179,56,0.5)";
    //   // ctx.fillStyle = "rgba(18,51,64, 0.95)";
    //   ctx.fillStyle = "rgba(42,239,247,0.8)";
    //   ctx.beginPath();
    //   ctx.arc(x+radius+(this.vel.x/70), y+radius-10, radius, 0 , 2 * Math.PI, false);
    //   ctx.closePath();
    //   ctx.fill();
    //   ctx.strokeStyle="rgba(11,73,182,0.5)";
    //   ctx.lineWidth = 3;
    //   ctx.stroke();
    // ctx.restore();
    // ctx.save();
    //   // ctx.fillStyle = "rgba(110,179,56,0.5)";
    //   // ctx.fillStyle = "rgba(18,51,64, 0.95)";
    //   ctx.fillStyle = "rgba(42,239,247,0.8)";
    //   ctx.beginPath();
    //   ctx.arc(x+radius, y+radius+2, radius/2, 0 , 2 * Math.PI, false);
    //   ctx.closePath();
    //   ctx.fill();
    //   ctx.strokeStyle="rgba(11,73,182,0.5)";
    //   ctx.lineWidth = 3;
    //   ctx.stroke();
    // ctx.restore();



    // ctx.save();
    //   ctx.moveTo(x, y);
    //   ctx.lineTo(x+this.width, y);
    //   ctx.strokeStyle = '#FFFFFF';
    //   ctx.stroke();
    // ctx.restore();
  }
};