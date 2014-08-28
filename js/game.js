$.Game = function() {
  this.hero     = null;
  this.running  = false;
  this.canvas   = null;
  this.context  = null;

  this.init();

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
  }
};

$.Game.prototype = {

  init : function() {
    this.initObjects();
    this.initCanvas();
    this.initKeybindings();
    this.initMouse();
  },
  
  initObjects : function() {
    $.Tile.init();

    this.hero   = new $.Hero();
    this.world  = new $.World();
    this.camera = new $.Camera();
    this.camera.offset.x = 1000;
    this.hero.pos.x = 1500;
    this.camera.viewWidth = 800;
    this.camera.gutter = 100;
  },

  initCanvas : function() {
    this.canvas   = document.getElementById('world');
    this.context  = this.canvas.getContext('2d');
  },

  initMouse : function() {

    this.canvas.onmousemove = function(e) {
      console.log(e)
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
    
    $.utils.bindKeyDown('1'     , this.hero.setMode.bind(this.hero, 1));
    $.utils.bindKeyDown('2'     , this.hero.setMode.bind(this.hero, 2));
    $.utils.bindKeyDown('3'     , this.hero.setMode.bind(this.hero, 4));
    $.utils.bindKeyDown('esc'     , this.hero.setMode.bind(this.hero, 0));
    
    // Interaction
    $.utils.bindKeyDown('z'     , this.hero.power.bind(this.hero, this.world.tiles));

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
    for(key in $.keybindings) {
      if($.pressed[key]) {
        console.log('[KEY EVENT] %s', key);
        $.keybindings[key]();
      }
    }
  },

  update : function(delta) {
    // this.handleEvents();
    if($.pressed.mouse) {
      this.hero.power(this.world.tiles, this.mouse);
    }
    this.hero.update(delta);
    this.world.update(delta);
  },

  collisions : function() {
    var x = this.hero.getCenter().x,
        y = this.hero.getCenter().y;

    var numX = 6,
        numY = 8;
    var xLeft = Math.floor(x / $.const.TILE_SIZE) - 3;
    var yTop = Math.floor(y / $.const.TILE_SIZE) - 4;
    // console.log()
    if(xLeft < 0) {
      xLeft = 0;
    }
    if(yTop < 0) {
      yTop = 0;
    }

    var tiles = this.world.tiles;
    for(var i = xLeft; i < xLeft+numX; i++) {
      for(var j = yTop; j < yTop+numY; j++) {
        if(tiles[i][j] !== null) {
          this.hero.handleCollision(tiles[i][j].pos, $.const.TILE_SIZE, i, j);
        }
      }
    }


    // var lCol = false,
    //     rCol = false,
    //     left = null,
    //     right = null;

    // var y = Math.round(this.hero.getCenter().y / $.const.TILE_SIZE);

    // if(y > 0){
    //   left = lcolumn[y-1],
    //   right = rcolumn[y-1];
    //   lCol = left !== null && this.hero.checkCollisionX(left.pos,$.const.TILE_SIZE);
    //   rCol = right !== null && this.hero.checkCollisionX(right.pos,$.const.TILE_SIZE);
    // }
    

    // if(lCol) {
    //   this.hero.handleCollision({
    //     x : this.hero.pos.x,
    //     y : left.pos.y
    //   });
    // }
    // else if(rCol) {
    //   this.hero.handleCollision({
    //     x : this.hero.pos.x,
    //     y : right.pos.y
    //   }); 
    // }
    // else {
    //   for(var i = 0 ; i < column.length; i++) {
    //     var tile = column[i];
    //     if(tile) {
    //       var ty = tile.pos.y;
    //       // Need to add in check for caves and walls
    //       if(this.hero.checkCollisionY(ty, $.const.TILE_SIZE)) {
    //         var x = this.hero.pos.x;
    //         // if(rcolumn[i-1] !== null && rcolumn[i-1].pos.x <= this.hero.pos.x + this.hero.width) {
    //         //   console.log('FUCK')
    //         //   x = rcolumn[i-1].pos.x
    //         // }
    //         this.hero.handleCollision({
    //           x : x,
    //           y : ty
    //         });
    //       }
    //     }
    //   }
    // }
    

  },

  draw : function() {
    this.context.clearRect(0,0,this.width,this.height);
    this.context.save();
      this.world.drawBackground(this.context,this.width,this.height);
      this.context.translate(-this.camera.offset.x, -this.camera.offset.y);
      this.world.draw(this.context, this.camera);
      this.hero.draw(this.context);

      if(this.hero.mode !== 0) {
        this.drawMouse(this.context);  
      }

    this.context.restore();
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
    // this.displayPause();
  },

  run : function() {
    this.running = true;
    this.tick();
  },

  start : function() {
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
      alert('You Win!');
    }

    this.draw();
    if(this.running) {
      requestAnimationFrame(this.tick.bind(this));
    }
  }
};