$.World = function() {
  this.tiles = [];
  this.width = 50;
  this.backdrop = null;
  this.tileImages = [];

  this.generateBackdrop();
  // this.generateTileImages();
  this.generateWorld();
};

$.World.prototype = {

  generateWorld : function() {
    var numTilesX  = Math.floor($.const.SIZE.x / $.const.TILE_SIZE),
        numTilesY  = Math.floor($.const.SIZE.y / $.const.TILE_SIZE),
        floorStart = Math.floor(200 / $.const.TILE_SIZE);

    var peaks = Array.apply(null, new Array(numTilesX)).map(Number.prototype.valueOf,0);
    this.applyPeaks(peaks, 0, peaks.length-1, 10, 3);
    
    for(var i = 0; i < numTilesX; i++) {
      var current = [];
      for(var j = 0; j < numTilesY; j++) {
        var randomTile  = Math.floor(Math.random()*100) < 1,
            randomAtt = false;
        if(i > 0) {
          randomAtt   = Math.floor(Math.random()*10) < 3 && this.tiles[i-1][j] !== null;
        }

        randomTile = false;
        randomAtt = false;

        var curFloor = floorStart - peaks[i];
            
        if(j < curFloor && !randomTile && !randomAtt) {
          current.push(null);
        }
        else {
          var tile = new $.Tile.Dirt({x: i*$.const.TILE_SIZE, y: j*$.const.TILE_SIZE});
          current.push(tile);
        }
      }

      this.tiles[i] = current;
    }
    /********************************************
      Generating a world will be done in 5 phases
      1. Determine the horizon (use fractals for this)
      2. Distribute a handfull of seeds, $.const.NUM_SEEDS * seed types
      3. Grow seeds until horizon to bottom is full alternate directions when growing
      4. Create caverns 
    
    ********************************************/
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

  generateBackdrop : function() {
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


    this.backdrop = canvas;
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

    canvas.width = 100;
    canvas.height = 25;
    // Mountains
    ctx.save();
      ctx.beginPath();
      ctx.moveTo(0,25);
      ctx.lineTo(15,15);
      ctx.lineTo(25,10);
      ctx.lineTo(35,5);
      ctx.lineTo(55,15);
      ctx.lineTo(75,10);
      ctx.lineTo(100,8);
      ctx.lineTo(100,25);
      ctx.lineTo(0,25);
      ctx.closePath();
      ctx.fillStyle = 'rgb(137,97,67)';
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
    var left  = Math.floor(camera.offset.x / $.const.TILE_SIZE),
        right = Math.floor((camera.offset.x + camera.viewWidth) / $.const.TILE_SIZE);
    for(var i = left-5; i < right+5; i++) {
      var row = this.tiles[i];
      var light = 1.0;
      for(var j = 0; j < row.length; j++) {
        if(row[j] !== null){

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