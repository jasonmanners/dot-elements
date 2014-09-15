$.Game = function() {
  document.getElementById('pause').innerHTML = '';
  this.hero       = null;
  this.running    = false;
  this.canvas     = null;
  this.context    = null;
  this.particles  = null;

  this.width = 800;
  this.height = 450;

  this.time = {
    last  : 0,
    delta : 0,
    total : 0
  };

  this.mouse = {
    x : 0,
    y : 0
  };

  this.shrines = {
    'water' : null,
    'earth' : null,
    'fire'  : null,
    'air'   : null
  };

  this.enemies = [];

  this.init();
};

$.Game.prototype = {

  init : function() {
    this.initObjects();
    this.initCanvas();
    this.initKeybindings();
    this.initMouse();
    this.initParticleEmitter();
    this.initShrines();

    // Init Quickslots
    // @TODO: Build functionality around this
    window.testImg = $.Tile.images.dirt[0]['1.0'];
    var src = $.Tile.images.dirt[0]['1.0'].toDataURL();
    document.getElementById('slot-2-preview').src = src;
    document.getElementById('slot-3-preview').src = src;

    // var col   = $.utils.getRandomIndex(this.world.tiles),
    //       cell  = this.world.findFloor(col);
    //   this.enemies.push(new $.Enemy({x: cell.pos.x, y: cell.pos.y-15}));

    var canvas  = document.createElement("canvas"),
        ctx     = canvas.getContext("2d");

    canvas.width = $.utils.toWorldIndex($.const.SIZE.x);
    canvas.height = $.utils.toWorldIndex($.const.SIZE.y);
    canvas.style.margin = '100px auto';
    canvas.style.display = 'block';
    canvas.className = 'map';
    for(var i = 0; i < this.world.map.length; i++) {
      for(var j = 0; j <  this.world.map[i].length; j++) {
        ctx.fillStyle = '#93C0DD';

        if(this.world.map[i][j] === 1) {
          ctx.fillStyle = '#473020';
        }
        else if(this.world.map[i][j] === 2) {
          ctx.fillStyle = '#93C0DD';
        }
        else if((this.world.map[i][j]-1) % 3 === 0 ) {
          ctx.fillStyle = '#871E1E';
        }
        else if((this.world.map[i][j]-1) % 3 === 1 ) {
          ctx.fillStyle = '#1B7F2F';
        }
        else if((this.world.map[i][j]-1) % 3 === 2 ) {
          ctx.fillStyle = '#436B87';
        }
        ctx.fillRect(i,j,1,1);
      }
    }

    document.getElementById('pause').appendChild(canvas);
  },
  
  initObjects : function() {
    $.Tile.init();

    this.hero   = new $.Hero();
    this.world  = new $.World();
    this.camera = new $.Camera();
    this.camera.offset.x = 1000;
    this.hero.pos.x = 1500;
    this.hero.pos.y = 100;
    this.hero.startPos.x = 1500;
    this.hero.startPos.y = 100;
    this.camera.viewWidth = 800;
    this.camera.gutter.x = 300;
    this.camera.gutter.y = 150;
  },

  initCanvas : function() {
    this.canvas   = document.getElementById('world');
    this.context  = this.canvas.getContext('2d');
  },

  initParticleEmitter : function() {
    this.particles = $.ParticleEmitter;
  },

  initShrines : function() {
    var col = $.utils.getRandom(this.world.tiles);
    // var col = 100;
    for(var i = 0; i < col.length; i++) {
      if(col[i] && col[i].solid) {
        var radius = 75;
        this.shrines.water = new $.Shrine(
          {
            x:col[i].pos.x,
            y:col[i].pos.y-radius
          }, 
          {r: 74, g: 176, b: 244, a: 0.95},
          {r: 16, g: 49, b: 142, a: 0.95}
        );
        this.shrines.water.radius = radius;
        break;
      }
    }

    var col = $.utils.getRandom(this.world.tiles);
    // var col = 100;
    for(var i = 0; i < col.length; i++) {
      if(col[i] && col[i].solid) {
        var radius = 75;
        this.shrines.fire = new $.Shrine(
          {
            x:col[i].pos.x,
            y:col[i].pos.y-radius
          }, 
          {r: 247, g: 42, b: 42, a: 0.8},
          {r: 247, g: 247, b: 42, a: 0.8}
        );
        this.shrines.fire.radius = radius;
        break;
      }
    }

    var col = $.utils.getRandom(this.world.tiles);
    // var col = 100;
    for(var i = 0; i < col.length; i++) {
      if(col[i] && col[i].solid) {
        var radius = 75;
        this.shrines.earth = new $.Shrine(
          {
            x:col[i].pos.x,
            y:col[i].pos.y-radius
          }, 
          {r: 56, g: 63, b: 0, a: 0.8},
          {r: 51, g: 33, b: 1, a: 0.8}
        );
        this.shrines.earth.radius = radius;
        break;
      }
    }

    var x = Math.floor(Math.random()*this.world.tiles.length);
    var y = -6;
    // var col = 100;
    var radius = 75;
    this.shrines.air = new $.Shrine(
      {
        x: x * $.const.TILE_SIZE,
        y: y * $.const.TILE_SIZE
      }, 
      {r: 230, g: 240, b: 255, a: 0.8},
      {r: 200, g: 200, b: 210, a: 0.8}
    );
    this.shrines.air.radius = radius;
    
  },

  initMouse : function() {

    this.canvas.onmousemove = function(e) {
      var rect = this.canvas.getBoundingClientRect();
      // this.mouse.x = e.x - this.canvas.offsetLeft - 5 + this.camera.offset.x;
      this.mouse.x = e.clientX - rect.left - 5 + this.camera.offset.x;
      // this.mouse.y = e.y - this.canvas.offsetTop  - 5 + this.camera.offset.y; 
      this.mouse.y = e.clientY - rect.top - 5 + this.camera.offset.y; 
    }.bind(this);

    this.canvas.onmousedown = function(e) {
      $.pressed.mouse = true;
    }.bind(this);

    this.canvas.onmouseup = function(e) {
      $.pressed.mouse = false;
    }.bind(this);
  },

  initKeybindings : function() {
    // Movement
    $.utils.bindKeyDown('a'  , this.hero.moveLeft.bind(this.hero));
    $.utils.bindKeyDown('d' , this.hero.moveRight.bind(this.hero));
    $.utils.bindKeyDown('space'     , this.hero.jump.bind(this.hero));
    
    $.utils.bindKeyDown('1'     , this.hero.returnHome.bind(this.hero));
    $.utils.bindKeyDown('2'     , this.hero.setMode.bind(this.hero, 1));
    $.utils.bindKeyDown('3'     , this.hero.setMode.bind(this.hero, 2));
    $.utils.bindKeyDown('4'     , this.hero.setMode.bind(this.hero, 4));
    
    $.utils.bindKeyDown('esc'   , function(){
      if(this.hero.mode > 0) {
        this.hero.setMode(0);
      }
      else {
        if(this.running) {
          this.pause();  
        }
        else {
          this.run();
        }
      }
    }.bind(this));
    
    $.utils.bindKeyUp('a'    , this.hero.stop.bind(this.hero));
    $.utils.bindKeyUp('d'   , this.hero.stop.bind(this.hero));
    // $.utils.bindKey('left'  , this.camera.moveLeft.bind(this.camera));
    // $.utils.bindKey('right' , this.camera.moveRight.bind(this.camera));
    // $.utils.bindKey('up'    , this.hero.jump);
    // $.utils.bindKey('z'     , this.hero.power);

    window.onkeydown = function(evt) {
      var key = $.const.KEYS[evt.keyCode] || evt.keyCode;
      console.log('[KEY PRESSED] {%s : %s}', evt.keyCode, key);
      $.pressed[key] = true;
      if($.keybindings.down[key]) {
        $.keybindings.down[key]();
        return false;
      }
    };

    window.onkeyup = function(evt) {
      var key = $.const.KEYS[evt.keyCode] || evt.keyCode;
      $.pressed[key] = false;
      if($.keybindings.up[key]) {
        $.keybindings.up[key]();  
      }
    };
  },

  handleEvents : function() {
    for(var key in $.keybindings) {
      if($.pressed[key]) {
        // console.log('[KEY EVENT] %s', key);
        $.keybindings[key]();
      }
    }
  },

  update : function(delta) {
    // this.handleEvents();
    // if($.pressed.mouse) {
    //   this.hero.power(this.world.tiles, this.mouse);
    // }
    this.hero.update(delta);
    this.world.update(delta);
    this.particles.update(delta);

    if($.pressed.mouse) {
      this.hero.power(this.world.tiles, this.mouse);
    }

    for(var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      if(enemy.jumpOnNextUpdate) {
        enemy.jump();
      }
      enemy.update(delta, this.hero);
    }

    if(this.shrines.water) {
      this.shrines.water.update(delta);  
    }
    if(this.shrines.fire) {
      this.shrines.fire.update(delta);  
    }
    if(this.shrines.earth) {
      this.shrines.earth.update(delta);  
    }
    if(this.shrines.air) {
      this.shrines.air.update(delta);  
    }
    
    

    // @TODO: Make Dusk and Dawn - since its just a mask fade in and out
    if(Math.sin(this.time.total / 50000) > 0 && this.world.isNight()) {
      this.world.setDay();
    }
    else if(Math.sin(this.time.total / 50000) < 0 && this.world.isDay()) {
      this.world.setNight();
    }


    // @TODO: Make this random
    if(Math.random()*100 > 98 && this.enemies.length < 7) {
      var col   = $.utils.getRandomIndex(this.world.tiles),
          cell  = this.world.findFloor(col);
      this.enemies.push(new $.Enemy({x: cell.pos.x, y: cell.pos.y-15}));
    }
  },

  collisions : function() {
    var x = this.hero.getCenter().x,
        y = this.hero.getCenter().y;
    
    var tiles = this.world.tiles;

    this.hero.pos.x = Math.max(0,this.hero.pos.x);
    this.hero.pos.x = Math.min(this.hero.pos.x, $.const.SIZE.x-$.const.TILE_SIZE*2);

    this.hero.pos.y = Math.max(0,this.hero.pos.y);
    this.hero.pos.y = Math.min(this.hero.pos.y, $.const.SIZE.y);

    var numX = 6,
        numY = 8;
    var xLeft = Math.floor(x / $.const.TILE_SIZE) - 3;
    var yTop = Math.floor(y / $.const.TILE_SIZE) - 4;

    xLeft = Math.max(0, xLeft);
    yTop  = Math.max(0, yTop);

    xLeft = Math.min(xLeft, tiles.length - numX);
    
    for(var i = xLeft; i < xLeft+numX; i++) {
      for(var j = yTop; j < yTop+numY; j++) {
        if(tiles[i][j] && tiles[i][j].solid) {
          var cell = tiles[i][j];
          this.characterCollision(this.hero, cell, i, j);
        }
      }
    }


    for(var k = 0; k < this.enemies.length; k++) {
      var enemy = this.enemies[k];

      // Check hero collision
      if($.utils.detectRadiusCollision(this.hero.pos, enemy.pos, 10)) {
        this.hero.takeDamage(enemy.damage);
      }

      // Check tile collision
      var xLeft = Math.floor(enemy.pos.x / $.const.TILE_SIZE) - 3;
      var yTop = Math.floor(enemy.pos.y / $.const.TILE_SIZE) - 4;

      xLeft = Math.max(0, xLeft);
      yTop  = Math.max(0, yTop);

      xLeft = Math.min(xLeft, tiles.length - numX);

      for(var i = xLeft; i < xLeft+numX; i++) {
        for(var j = yTop; j < yTop+numY; j++) {
          if(tiles[i][j] && tiles[i][j].solid) {
            var cell = tiles[i][j];
            var collisions = this.characterCollision(enemy, cell, i, j);
            if(collisions.left || collisions.right){
              enemy.jumpOnNextUpdate = true;
            }
          }
        }
      }
    }

    // for(var i = 0; i < $.ParticleEmitter.particles.length; i++) {
    var i = $.ParticleEmitter.particles.length;
    while(i--) {
      var part = $.ParticleEmitter.particles[i];
      if(part.solid) {
        var j = this.enemies.length;
        while(j--){
          var enemy = this.enemies[j];
          if($.utils.detectRadiusCollision(part.pos, enemy.pos, 30)) {
            this.enemies.splice(j,1);
            $.ParticleEmitter.particles.splice(i,1);

            for(var z = 0; z < 10; z++) {
              $.ParticleEmitter.add.explosion($.utils.deepCopy(enemy.pos), 200*Math.random() + 100, Math.PI*4/3 - Math.PI*Math.random()*2/3);
            }
            // $.ParticleEmitter.addParticle(enemy.pos, 200, Math.PI, {r: 255, g: 255, b: 255, a: 0.5});
            break;
          }
        }
      }
    }

    if(this.shrines.water && $.utils.distance(this.shrines.water.pos, this.hero.pos) < this.shrines.water.radius + this.hero.height) {
      this.hero.shrines++;
      this.shrines.water = null;
    }

    if(this.shrines.earth && $.utils.distance(this.shrines.earth.pos, this.hero.pos) < this.shrines.earth.radius + this.hero.height) {
      this.hero.shrines++;
      this.shrines.earth = null;
    }

    if(this.shrines.fire && $.utils.distance(this.shrines.fire.pos, this.hero.pos) < this.shrines.fire.radius + this.hero.height) {
      this.hero.shrines++;
      this.shrines.fire = null;
    }

    if(this.shrines.air && $.utils.distance(this.shrines.air.pos, this.hero.pos) < this.shrines.air.radius + this.hero.height) {
      this.hero.shrines++;
      this.shrines.air = null;
    }


  },

  characterCollision : function(character, tile, i, j) {
    var pos1 = {
      x : character.pos.x,
      y : character.pos.y,
      width  : character.width,
      height : character.height,
      vel : {
        x : character.vel.x,
        y : character.vel.y
      }
    };

    var pos2 = {
      x : tile.pos.x,
      y : tile.pos.y,
      width  : $.const.TILE_SIZE,
      height : $.const.TILE_SIZE,
      vel : {
        x : 0,
        y : 0
      }
    };
    var collisions = $.utils.detectCollision(pos1, pos2);
    if(collisions.top) {
      // console.log('top');
      character.pos.y = pos2.y+pos2.height;
      character.acc.y = 0;
      character.vel.y = 0;
    }

    if(collisions.bottom) {
      // console.log('BOTTOM');
      while(j) {
        if(this.world.tiles[i][j-1] === null) {
          break;
        }
        j--;
      }
      character.pos.y = this.world.tiles[i][j].pos.y-character.height;
      character.acc.y = 0;
      character.vel.y = 0;
      character.jumpCounter = 0;
    }

    if(collisions.left) {
      // console.log('LEFT');
      character.pos.x = pos2.x+pos2.width;
      // character.vel.x = 0;
    }

    if(collisions.right) {
      // console.log('RIGHT');
      character.pos.x = pos2.x - character.width;
      // this.acc.x = 0;
      // character.vel.x = 0;
    }

    return collisions;
  },

  draw : function() {
    this.context.clearRect(0,0,this.width,this.height);
    this.context.save();
      this.world.drawBackground(this.context,this.width,this.height);
      this.context.translate(-this.camera.offset.x, -this.camera.offset.y);
      this.world.draw(this.context, this.camera);
      for(var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].draw(this.context);
      }
      
      this.particles.draw(this.context);
      this.hero.draw(this.context);

      if(this.shrines.water) {
        this.shrines.water.draw(this.context);
      }

      if(this.shrines.earth) {
        this.shrines.earth.draw(this.context);
      }

      if(this.shrines.fire) {
        this.shrines.fire.draw(this.context);
      }
      if(this.shrines.air) {
        this.shrines.air.draw(this.context);
      }

      if(this.hero.mode !== 0 && this.hero.mode < 4) {
        this.drawMouse(this.context);  
      }
    this.context.restore();
    
    if(this.world.isNight()) {
       var canvas  = document.createElement("canvas"),
           ctx     = canvas.getContext("2d");

      canvas.width  = this.width;
      canvas.height = this.height;

      ctx.save();
        // ctx.globalCompositeOperation = darker;
        ctx.fillStyle = 'rgba(0,0,0,0.9)';
        ctx.fillRect(0,0,this.width,this.height);
      ctx.restore();
      ctx.save();
        ctx.globalCompositeOperation = 'xor';
        // ctx.fillStyle = 'rgba(0,0,0,0.8)';
        var grd = ctx.createRadialGradient(this.hero.pos.x-this.camera.offset.x,this.hero.pos.y-this.camera.offset.y,30,this.hero.pos.x-this.camera.offset.x,this.hero.pos.y-this.camera.offset.y,200);
        grd.addColorStop(0, $.utils.colorString(255, 200, 0, 0.8));
        grd.addColorStop(1, $.utils.colorString(255, 200, 0, 0.0));
        $.render.fillCircle(ctx, {x:this.hero.pos.x-this.camera.offset.x, y: this.hero.pos.y-this.camera.offset.y}, 200, grd);
      ctx.restore();

      this.context.save();
        this.context.drawImage(canvas, 0,0,this.width, this.height);
      this.context.restore();
    }
  },

  drawMouse : function(ctx) {
    var x = Math.floor((this.mouse.x) / $.const.TILE_SIZE) * $.const.TILE_SIZE,
        y = Math.floor((this.mouse.y) / $.const.TILE_SIZE) * $.const.TILE_SIZE;
    
    ctx.save();
      ctx.save();
        ctx.strokeStyle = $.utils.colorString(59, 188, 217, 1);
        ctx.rect(x,y,$.const.TILE_SIZE,$.const.TILE_SIZE);
        ctx.stroke();
        ctx.strokeStyle = $.utils.colorString(18, 51, 64, 1);
        ctx.rect(x,y,$.const.TILE_SIZE,$.const.TILE_SIZE);
        ctx.stroke();
      ctx.restore();
    ctx.restore();
  },

  pause : function() {
    this.running = false;
    document.getElementById('pause-pane').style.display = 'block';
    document.getElementById('pause').style.display = 'block';
    // this.displayPause();
  },

  run : function() {
    this.running = true;
    document.getElementById('pause-pane').style.display = 'none';
    this.time.last = 0;
    this.tick();
  },

  start : function() {
    document.getElementById('ui').style.display = 'block';
    document.getElementById('start').style.display = 'none';
    document.getElementById('died').style.display = 'none';
    this.run();
  },

  tick : function(timestamp) {
    // console.log('time = '+timestamp)
    var drawStart = (timestamp || 0);
    if(this.time.last === 0) {
      this.time.last = drawStart;
    }
    // console.log('[%s - %s]', drawStart, this.time.last)
    this.time.delta = drawStart - this.time.last;
    
    if(this.time.delta > 50) {
      this.time.delta = 50;
    }

    this.time.total += this.time.delta;
    
    // console.log(this.time.delta);
    // console.log('%s --- %s', this.time.delta, timestamp);
    
    this.update(this.time.delta);
    this.collisions();
    this.camera.update(this.hero.pos);
    this.time.last = drawStart;

    if(this.hero.win()){
      this.pause();
      document.getElementById('pause-pane').style.display = 'block';
      document.getElementById('win').style.display = 'block';
      document.getElementById('died').style.display = 'none';
      document.getElementById('pause').style.display = 'none';
    }
    else if(this.hero.lose()) {
      this.pause();
      document.getElementById('pause-pane').style.display = 'block';
      document.getElementById('died').style.display = 'block';
      document.getElementById('pause').style.display = 'none';
    }

    this.draw();
    if(this.running) {
      requestAnimationFrame(this.tick.bind(this));
    }
  }
};