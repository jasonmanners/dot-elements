$.Tile = {
  images : {},

  init : function() {
    for(var i = 0; i < $.const.COLORS.length; i++) {
      var images = [];
      for(var j = 0; j < 4; j++) {
        var canvas = $.Tile.generate($.const.COLORS[i], $.const.TILE_SIZE, $.const.TILE_SIZE);
        var image = {};
        for(var ls = 1; ls >= 0; ls -= 0.1) {
          var lcanvas = $.Tile.applyLighting(canvas, ls, $.const.TILE_SIZE, $.const.TILE_SIZE);

          if(ls == 1) {
            $.Tile.applyGrass(lcanvas.getContext("2d"), $.const.TILE_SIZE, $.const.TILE_SIZE);
          }
          image[ls.toFixed(1)] = lcanvas;
        }

        images.push(image)
      }
      $.Tile.images[$.const.COLORS[i].name] = images;
    }
    console.log($.Tile.images);
  },

  applyLighting : function(_canvas, light, w, h) {
    var canvas  = document.createElement("canvas"),
        ctx     = canvas.getContext("2d");

    canvas.width  = w;
    canvas.height = h;
    ctx.save();
      ctx.drawImage(_canvas, 0, 0, w, h);
      ctx.save();
        ctx.fillStyle = $.utils.colorString(0, 0, 0, 1.0-light);
        ctx.fillRect(0,0,w,h);
      ctx.restore();
    ctx.restore();
    return canvas;
  },

  applyGrass : function(_ctx,w,h) {
    var color = {
      r : 28,
      g : 216,
      b : 94
    };

    var canvas  = document.createElement("canvas"),
        ctx     = canvas.getContext("2d");
    canvas.width = 5;
    canvas.height = 5;

    ctx.save();
      ctx.fillStyle = $.utils.colorString(color.r, color.g, color.b, 1.0);
      ctx.fillRect(0,0,5,2);
    ctx.restore();
    ctx.save();
      ctx.fillStyle = $.utils.colorString(color.r, color.g, color.b, 1.0);
      ctx.fillRect(Math.random()*3+1,0,1,5);
    ctx.restore();
    ctx.save();
      ctx.fillStyle = $.utils.colorString(color.r, color.g, color.b, 1.0);
      ctx.fillRect(Math.random()*3+1,0,1,5);
    ctx.restore();

    _ctx.save();
      _ctx.drawImage(canvas, 0, 0, w, 5);
    _ctx.restore();
  },

  generate : function(color, w, h) {
    var canvas  = document.createElement("canvas"),
        ctx     = canvas.getContext("2d");

    canvas.width  = $.const.TILE_SIZE;
    canvas.height = $.const.TILE_SIZE;
    
    var x,y,lw,lh;
    ctx.save();
      ctx.fillStyle = $.utils.colorString(color.r, color.g, color.b, color.a);
      ctx.fillRect(0,0,w,h);
    ctx.restore();
    ctx.save();
      lw = 4; //Math.floor(Math.random()*5);
      lh = 4; //Math.floor(Math.random()*5);
      x = Math.floor(Math.random()*(w-4))+4;
      y = Math.floor(Math.random()*(h-4))+4;
      ctx.fillStyle = $.utils.colorString(color.r*.9, color.g*.9, color.b*.9, color.a);
      ctx.fillRect(x,y,lw,lh);
    ctx.restore();
    ctx.save();
      lw = 4; //Math.floor(Math.random()*5);
      lh = 4; //Math.floor(Math.random()*5);
      x = Math.floor(Math.random()*(w-4))+4;
      y = Math.floor(Math.random()*(h-4))+4;
      ctx.fillStyle = $.utils.colorString(color.r*1.2, color.g*1.2, color.b*1.2, color.a);
      ctx.fillRect(x,y,lw,lh);
    ctx.restore();
    ctx.save();
      lw = 4; //Math.floor(Math.random()*5);
      lh = 4; //Math.floor(Math.random()*5);
      x = Math.floor(Math.random()*(w-4))+4;
      y = Math.floor(Math.random()*(h-4))+4;
      ctx.fillStyle = $.utils.colorString(color.r*.7, color.g*.7, color.b*.7, color.a);
      ctx.fillRect(x,y,lw,lh);
    ctx.restore();

    return canvas;
  },

};


$.Tile.Dirt = function(pos){
  this.pos      = pos;
  this.image    = $.utils.getRandom($.Tile.images.dirt);
  this.particle = new $.Particle(pos,this.image);
};

$.Tile.Dirt.prototype = {
  draw : function(ctx, image) {
    this.particle.draw(ctx, image);
  }
};