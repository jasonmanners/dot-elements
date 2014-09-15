$.World = function() {
  this.tiles    = [];
  this.map      = [];
  this.caverns  = [];
  this.width = 50;
  this.backdrop = null;
  this.tileImages = [];
      this.isNightBool = false;
    this.isDayBool = true;
  this.generateBackdrop();
  // this.generateTileImages();
  this.generateWorld();
};

$.World.prototype = {

  generateCellMap : function(width, height) {

    var cellMap = Array.apply(null, Array(width)).map(function(){
      return Array.apply(null, Array(height)).map(function(){
        if(Math.random() < $.const.CELL_AUTOMATA.CHANCE_START) {
          return 1;
        }
        return 0;
      });
    });
    return cellMap;
  },

  generateCaverns : function(map) {
    var i = $.const.CELL_AUTOMATA.ROUGH_STEPS;
    while(i--) {
      this.caveSimulationStep(map);
    }

    this.smoothCaves(map);
  },

  smoothCaves : function(map) {
    for(var i = 1; i < map.length-1; i++)  {
      for(var j = 1; j < map[i].length-1; j++) {
        var count = 0;
        // left
        if(map[i-1][j]) {
          count++;
        }
        if(map[i+1][j]) {
          count++;
        }
        if(map[i][j-1]) {
          count++;
        }
        if(map[i][j+1]) {
          count++;
        }

        if(count < 2) {
          map[i][j] = 0;
        }
      }
    }
  },

  caveSimulationStep : function(map) {
    var prevMap     = $.utils.deepCopy(map);

    for(var i = 0; i < map.length; i++) {
      for(var j = 0; j < map[i].length; j++) {
        var nAlive = this.countAliveNeighbors(prevMap, i, j);

        if(prevMap[i][j]) {
          // if(nAlive < $.const.CELL_AUTOMATA.STARVE || nAlive > $.const.CELL_AUTOMATA.OVER) {
          if(nAlive < $.const.CELL_AUTOMATA.DEATH) {
            map[i][j] = 0;
          }
          else {
            map[i][j] = 1;
          }
        }
        else {
          if(nAlive > $.const.CELL_AUTOMATA.BIRTH) {
            map[i][j] = 1;
          }
          else {
            map[i][j] = 0;
          }
        }
      }
    }
    return map;
  },

  countAliveNeighbors : function(map, x, y) {
    var xLength = map.length,
        yLength = map[0].length;

    var count = 0;
    for(var i = -1; i < 2; i++) {
      for(var j = -1; j < 2; j++) {
        var nx = x + i,
            ny = y + j;

        if(i === 0 && j === 0) {
          // Do Nothing
        }
        // @TODO redo condition
        else if(nx < 0 || ny < 0 || nx > xLength-1 || ny > yLength-1) {
          count++;
        }
        else if(map[nx][ny]) {
          count++;
        }

      }
    }
    return count;
  },

  generateTopSoil : function(map, floor) {
    for(var i = 20; i < map.length-20; i++) {
      for(var j = floor; j < floor+5; j++) {
        map[i][j] = 1;
      }
    }
  },

  fillDirt : function(map) {
    var i = map.length;
    while(i--) {
      this.tiles[i] = [];
      var j = map[i].length;
      while(j--) {
        this.tiles[i][j] = null;
        if(map[i][j] === 1) {
          this.tiles[i][j] = new $.Tile.Dirt({x: i*$.const.TILE_SIZE, y: j*$.const.TILE_SIZE});
        }
        // this.tiles[i]map[i][j]
      }
    }
  },

  applyOceans : function(map) {
    for(var i = 0; i < 20; i++) {
      for(var j = 50; j < map[i].length; j++) {
        map[i][j] = 1;
      }
    }

    for(var i = map.length-21; i < map.length; i++) {
      for(var j = 50; j < map[i].length; j++) {
        map[i][j] = 1;
      }
    }
  },

  applyCaverns : function(map, cellMap, floor) {
    var mapOffsetX = 20,
        mapOffsetY = floor;

    for(var i = 0; i < cellMap.length; i++) {
      for(var j = 0; j < cellMap[i].length; j++) {
        map[i+mapOffsetX][j+mapOffsetY] = cellMap[i][j];
      }
    }
  },

  getCaverns : function(map) {
    var curCount = 2;
    this.caverns[0] = 0;
    this.caverns[1] = 0;
    for(var i = 1; i < map.length-1; i++) {
      for(var j = 1; j < map.length-1; j++) {
        if(map[i][j] === 0) {
          this.caverns[curCount] = 0;
          this.floodFill(i, j, map, curCount);
          curCount++;
        }
      }
    }

    for(var i = 0; i < map.length; i++) {
      for(var j = 0; j < map.length; j++) {
        this.caverns[map[i][j]] = this.caverns[map[i][j]] || {index : map[i][j], count : 0};
        this.caverns[map[i][j]].count++;
      }
    }
    
    for(var i = 0; i < map.length; i++) {
      for(var j = 0; j < map.length; j++) {
        if(this.caverns[map[i][j]].count < 200) {
          map[i][j] = 1;
        }
      }
    }
  },

  floodFill : function(x, y, map, replace) {
    if(x > 0 && y > 0 && x < map.length && y < map[0].length && map[x][y] === 0) {
      map[x][y] = replace;
      this.floodFill(x-1, y, map, replace);
      this.floodFill(x+1, y, map, replace);
      this.floodFill(x, y-1, map, replace);
      this.floodFill(x, y+1, map, replace);
    }
  },

  generateWorld : function() {
    var numX        = $.utils.toWorldIndex($.const.SIZE.x),
        numY        = $.utils.toWorldIndex($.const.SIZE.y),
        floorStart  = $.utils.toWorldIndex(200);

    var map = Array.apply(null, Array(numX)).map(function(){
      return Array.apply(null, Array(numY)).map(function(){ return 0;});
    });

    var cellMap = this.generateCellMap(numX - 40, numY - floorStart - 5);
    this.generateCaverns(cellMap);
    this.applyCaverns(map, cellMap, floorStart + 5);
    this.generateTopSoil(map, floorStart);
    this.applyOceans(map);

    var peaks = Array.apply(null, new Array(numX-40)).map(Number.prototype.valueOf,0);
    this.applyPeaks(peaks, 0, peaks.length-1, 10, 3);

    for(var i = 0; i < peaks.length; i++) {
      var start = Math.min(floorStart, floorStart - peaks[i]),
          end   = Math.max(floorStart, floorStart - peaks[i]);
      var alive = 1;
      if(peaks[i] < 0) {
        alive = 0;
      }
      for(var j = start; j < end; j++) {
        map[i][j] = alive;
      }
    }

    this.getCaverns(map);
    this.map = map;
    this.fillDirt(map);
    //@TODO: Fill Water


    // var map = this.generateCellMap();
    // for(var i = 0; i < $.const.CELL_AUTOMATA.STEPS; i++) {
    //   map = this.caveSimulationStep(map);  
    // }

    // var i = map.length;
    // while(i--) {
    //   this.tiles[i] = [];
    //   var j = map[i].length;
    //   while(j--) {
    //     this.tiles[i][j] = null;
    //     if(map[i][j] && j > $.const.CELL_AUTOMATA.FLOOR_START) {
    //       this.tiles[i][j] = new $.Tile.Dirt({x: i*$.const.TILE_SIZE, y: j*$.const.TILE_SIZE});
    //     }

    //     // this.tiles[i]map[i][j]
    //   }
    // }
    // var numTilesX  = $.utils.toWorldIndex($.const.SIZE.x),
    //     numTilesY  = $.utils.toWorldIndex($.const.SIZE.y),
    //     floorStart = $.utils.toWorldIndex(200);

    // var peaks = Array.apply(null, new Array(numTilesX)).map(Number.prototype.valueOf,0);
    // this.applyPeaks(peaks, 0, peaks.length-1, 10, 3);
    
    // // first and last 20 are water
    // for(var i = 20; i < numTilesX-20; i++) {
    //   var current = [];
    //   for(var j = 0; j < numTilesY; j++) {
    //     var randomTile  = Math.floor(Math.random()*100) < 1,
    //         randomAtt = false;
    //     if(i > 0) {
    //       randomAtt   = Math.floor(Math.random()*10) < 3 && this.tiles[i-1][j] !== null;
    //     }

    //     randomTile = false;
    //     randomAtt = false;

    //     var curFloor = floorStart - peaks[i];
            
    //     if(j < curFloor && !randomTile && !randomAtt) {
    //       current.push(null);
    //     }
    //     else {
    //       var tile = new $.Tile.Dirt({x: i*$.const.TILE_SIZE, y: j*$.const.TILE_SIZE});
    //       current.push(tile);
    //     }
    //   }

    //   this.tiles[i] = current;
    // }

    // for(var i = 0; i < numTilesX-20; i++) {
    //   var current = [];
    //   for(var j = 0; j < numTilesY; j++) {
    //     var tile = new $.Tile.Dirt({x: i*$.const.TILE_SIZE, y: j*$.const.TILE_SIZE});
    //     current.push(tile);
    //   }
    //   this.tiles[i] = current;
    // }
    // for(var i = numTilesX-20; i < numTilesX-20; i++) {

    /********************************************
      Generating a world will be done in 5 phases
      1. Determine the horizon (use fractals for this)
      2. Distribute a handfull of seeds, $.const.NUM_SEEDS * seed types
      3. Grow seeds until horizon to bottom is full alternate directions when growing
      4. Create caverns 
    
    ********************************************/
  },

  setDay : function() {
    this.isNightBool = false;
    this.isDayBool = true;
    this.backdrop = this.day;
  },

  setNight : function() {
    this.isNightBool = true;
    this.isDayBool = false;
    // this.backdrop = this.night;
  },

  isDay : function() {
    // return this.backdrop === this.day;
    return this.isDayBool;
  },

  isNight : function() {
    // return this.backdrop === this.night;
    return this.isNightBool;
  },

  findFloor: function(col) {
    for(var i = 0; i < this.tiles[col].length; i++) {
      if(this.tiles[col][i] !== null && this.tiles[col][i].solid) {
        return this.tiles[col][i];
      }
    }
  },

  applyPeaks : function(arr, start, end, size, times) {
    // console.log('PEAKS %s', times)
    var mid = Math.floor((end - start) / 2) + start;
    var peak = Math.floor(Math.random() * size - (size/2));
    // var peak = 3;
    arr[mid] = peak;

    var radius = Math.floor(Math.random() * 8)+2;
    for(var i = mid-radius; i < mid+radius; i++) {
      arr[i] = peak;
    }

    var mul = 1;
    if(peak < 0) {
      mul = -1;
    }
    //left
    for(var i = Math.abs(peak); i >= 0; i--) {
      arr[i+mid-radius] = peak - (mul*((peak*mul) - i));
    }
    //right
    for(var i = 0; i < Math.abs(peak); i++) {
      arr[i+mid+radius] = peak - (i*mul);
    }

    if(times > 0) {
      this.applyPeaks(arr, start, mid, size, times-1);
      this.applyPeaks(arr, mid+1, end, size, times-1);
    } 

  },

  generateDay : function() {
    var w = $.const.WIDTH,
        h = $.const.HEIGHT;

    var canvas  = document.createElement("canvas"),
        ctx     = canvas.getContext("2d");

    canvas.width  = w;
    canvas.height = h;
          
    ctx.save();
      ctx.rect(0,0,w,h);
      var gradient = ctx.createLinearGradient(0,h,0,0);
      gradient.addColorStop(0, '#93C0DD');   
      gradient.addColorStop(1, '#309AE0');   
      ctx.fillStyle = gradient;
      ctx.fill();
    ctx.restore();
    ctx.save();
      ctx.drawImage(this.generateMountainScape(), 0, 0, w, h);
    ctx.restore();

    return canvas;
  },

  generateNight : function() {
    var w = $.const.WIDTH,
        h = $.const.HEIGHT;

    var canvas  = document.createElement("canvas"),
        ctx     = canvas.getContext("2d");

    canvas.width  = w;
    canvas.height = h;
          
    ctx.save();
      ctx.rect(0,0,w,h);
      var gradient = ctx.createLinearGradient(0,h,0,0);
      gradient.addColorStop(0, '#112233');   
      gradient.addColorStop(1, '#000000');   
      ctx.fillStyle = gradient;
      ctx.fill();
    ctx.restore();

    return canvas;
  },

  generateBackdrop : function() {
    this.day = this.generateDay();
    this.night = this.generateNight();
    this.backdrop = this.day;
  },

  /* 
    @TODO: 
      [ ] Make initial canvas bigger
      [ ] different colors
      [ ] slight shading
      [ ] Own layer for parallax
      [ ] Fractal mountains
  */
  generateMountainScape : function() {
    var canvas  = document.createElement("canvas"),
        ctx     = canvas.getContext("2d");

    canvas.width = 400;
    canvas.height = 100;
    // Mountains
    ctx.save();
      ctx.beginPath();
      ctx.moveTo(0,100);
      ctx.lineTo(Math.random()*50, Math.random()*400);
      ctx.lineTo(Math.random()*50+50, Math.random()*400);
      ctx.lineTo(Math.random()*50+100, Math.random()*400);
      ctx.lineTo(Math.random()*50+150, Math.random()*400);
      ctx.lineTo(Math.random()*50+200, Math.random()*400);
      ctx.lineTo(Math.random()*50+250, Math.random()*400);
      ctx.lineTo(Math.random()*50+300, Math.random()*400);
      ctx.lineTo(Math.random()*50+350, Math.random()*400);
      ctx.lineTo(400,100);
      ctx.lineTo(0,100);
      ctx.closePath();
      ctx.fillStyle = 'rgb(100,80,60)';
      ctx.fill();
    ctx.restore();
    // Clouds
    ctx.save();
      ctx.fillStyle = "rgba(240,240,255,0.5)";
      ctx.beginPath();
      ctx.arc(5, 5, 2, 0 , 2 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
    ctx.restore();
    return canvas;
  },

  update : function(delta) {

  },

  drawBackground : function(ctx) {
    ctx.save();
      ctx.drawImage(this.backdrop, 0, 0);
    ctx.restore();
  },

  draw : function(ctx, camera) {
    var left  = $.utils.toWorldIndex(camera.offset.x),
        right = $.utils.toWorldIndex(camera.offset.x + camera.viewWidth);

    left  = Math.max(5, left);
    right = Math.min(right, this.tiles.length-5);

    var top     = $.utils.toWorldIndex(camera.offset.y),
        bottom  = $.utils.toWorldIndex(camera.offset.y + camera.viewHeight);

    top     = Math.max(5, top);
    bottom  = Math.min(bottom, this.tiles[0].length-5);

    for(var i = left-5; i < right+5; i++) {
      var row = this.tiles[i];
      var light = 1.0;

      for(var j = top-5; j < bottom+5; j++) {
        if(row[j] !== null && row[j].solid){

          // row[j].image = $.utils.getRandom(this.tileImages[0][light.toFixed(1)]);
          row[j].draw(ctx, row[j].image[light.toFixed(1)]);
          light -= 0.1;
          if(light < 0) {
            light = 0;
          }
        }
        else {
          light = 1.0;
        }
      }
    }
  }
};