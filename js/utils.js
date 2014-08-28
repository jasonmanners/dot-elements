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
    return Math.sqrt(Math.pow((obj1.x-obj2.x),2) + Math.pow((obj1.y-obj2.y),2))
  },

  colorString : function(r,g,b,a) {
    return 'rgba('+Math.floor(r)+','+Math.floor(g)+','+Math.floor(b)+','+a+')';
  },

  getRandom : function(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
  },

  toIndex : function(num, size) {
    return Math.floor(num / size);
  }
};

$.const = {
  NUM_SEEDS : 3,
  TILE_SIZE : 15,
  SIZE      : {
    x : 6000,
    y : 900
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
    '27' : 'esc',
  },
  WIDTH : 800,
  HEIGHT: 450,
  GRAVITY : 300
};