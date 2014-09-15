$.keybindings = {
  up    : {},
  down  : {}
};
$.pressed = {};

$.utils = {
  bindKeyDown : function(key, handler) {
    $.keybindings.down[key] = handler;
  },
  bindKeyUp   : function(key, handler) {
    $.keybindings.up[key] = handler;
  },

  requestAnimFrame : function() {
    return  window.requestAnimationFrame        ||
            window.webkitRequestAnimationFrame  ||
            window.mozRequestAnimationFrame     ||
            window.oRequestAnimationFrame       ||
            window.msRequestAnimationFrame      ||
            function(/* function */ callback) {
              window.setTimeout(callback, 1000 / 60);
            };
  },

  distance : function(obj1, obj2) {
    return Math.sqrt(Math.pow((obj1.x-obj2.x),2) + Math.pow((obj1.y-obj2.y),2));
  },

  colorString : function(r,g,b,a) {
    return 'rgba('+Math.floor(r)+','+Math.floor(g)+','+Math.floor(b)+','+a+')';
  },

  getRandom : function(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
  },

  getRandomIndex : function(arr) {
    return Math.floor(Math.random()*arr.length);
  },

  toIndex : function(num, size) {
    return Math.floor(num / size);
  },

  toWorldIndex : function(num) {
    return $.utils.toIndex(num, $.const.TILE_SIZE);
  },

  deepCopy : function(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  detectRadiusCollision : function(pos1, pos2, dist) {
    return $.utils.distance(pos1, pos2) < dist;
  },

  detectCollision : function(pos1, pos2) {
    var collisions = {
      top     : false,
      right   : false,
      bottom  : false,
      left    : false
    };
    // This will need to handle Tops && Caves
    var hlx = pos1.x,
        hrx = pos1.x + pos1.width,
        hty = pos1.y,
        hby = pos1.y + pos1.height,
        hcx = pos1.x + pos1.width / 2,
        hcy = pos1.y + pos1.height/ 2;

    var plx = pos2.x,
        prx = pos2.x + pos2.width,
        pty = pos2.y,
        pby = pos2.y + pos2.height,
        pcx = pos2.x + pos2.width /2,
        pcy = pos2.y + pos2.height/2;

    
    //top
    if(hty < pby && hty > pty && pos1.vel.y < 0 && Math.abs(hcx - pcx) < pos2.width/2) {
      // console.log('TOP');
      collisions.top = true;
    }
    // Bottom
    if(hby > pty && hby < pby && Math.abs(hcx - pcx) < pos2.width/2) {
      // console.log('BOTTOM');
      // debugger;
      collisions.bottom = true;
    }

    // LEFT
    if(hlx < prx && hlx > plx && $.utils.toIndex(hcy, pos2.width) === $.utils.toIndex(pty, pos2.width)) {
      // console.log('LEFT');
      collisions.left = true;
    }
    // Right
    else if(hrx > plx && hrx < prx && $.utils.toIndex(hcy, pos2.width) === $.utils.toIndex(pty, pos2.width)) {
      // console.log('RIGHT');
      collisions.right = true;
    }

    return collisions;
  }
};

$.render = {
  fillCircle : function(ctx, pos, radius, color) {
    var fillStyle = color;
    if(color.r !== undefined && color.g !== undefined && color.b !== undefined ) {
      fillStyle = $.utils.colorString(color.r, color.g, color.b, color.a || 1);
    }

    ctx.save();
      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0 , 2 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
    ctx.restore();
  },

  strokeCircle : function(ctx, pos, radius, line, color) {
    ctx.save();
      ctx.strokeStyle = $.utils.colorString(color.r, color.g, color.b, color.a);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0 , 2 * Math.PI, false);
      ctx.closePath();
      ctx.lineWidth = line;
      ctx.stroke();
    ctx.restore();
  },

};

$.const = {
  NUM_SEEDS : 3,
  // TILE_SIZE : 15,
  TILE_SIZE : 15,
  SIZE      : {
    x : 7000,
    y : 2000
  },
  CAMERA : {
    x : 800, 
    y : 400
  },
  COLORS : [
    // {r: 54, g: 34, b: 24, a: 0.9},
    {name: 'dirt', r: 153, g: 107, b: 74, a: 1.0},
    // {r: 39, g: 143, b: 6, a: 0.9}
  ],
  KEYS : {
    '38' : 'up',
    '40' : 'down',
    '39' : 'right',
    '37' : 'left',
    '90' : 'z',
    '65' : 'a',
    '87' : 'w',
    '68' : 'd',
    '83' : 's',
    '32' : 'space',
    '49' : '1',
    '50' : '2',
    '51' : '3',
    '52' : '4',
    '27' : 'esc',
    '192': '`'
  },
  WIDTH : 800,
  HEIGHT: 450,
  GRAVITY : 300,

  CELL_AUTOMATA : {
    BIRTH   : 3,
    DEATH   : 4,
    STARVE  : 4,
    OVER    : 4,
    ROUGH_STEPS   : 12,
    FINE_STEPS    : 4,
    CHANCE_START : 0.4,
    FLOOR_START : 13
  }
};