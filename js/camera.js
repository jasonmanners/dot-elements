$.Camera = function() {
  this.offset = {
    x : 0,
    y : -100
  };

  this.viewWidth  = 0;
  this.viewHeight  = 450;
  this.gutter     = {
    x : 0,
    y : 0
  };
};

$.Camera.prototype = {
  moveLeft : function() {
    this.move('x', -1);
  },
  moveRight : function() {
    this.move('x',  1);
  },
  move : function(direction, units) {
    this.offset[direction] += units;
  },

  update : function(pos) {
    if(pos.x > this.absoluteRight()) {
      this.offset.x += pos.x - this.absoluteRight();
      this.offset.x = Math.min(this.offset.x, $.const.SIZE.x-this.viewWidth-$.const.TILE_SIZE);
    }
    else if(pos.x < this.absoluteLeft()) {
      this.offset.x -= this.absoluteLeft() - pos.x;
      this.offset.x = Math.max(this.offset.x, 0);
    }

    if(pos.y > this.absoluteBottom()) {
      this.offset.y += pos.y - this.absoluteBottom();
    }
    else if(pos.y < this.absoluteTop()) {
      this.offset.y -= this.absoluteTop() -  pos.y;
    }
  },

  absoluteRight : function() {
    return (this.viewWidth - this.gutter.x) + this.offset.x;
  },

  absoluteLeft : function() {
    return this.offset.x + this.gutter.x;
  },

  absoluteTop : function() {
    return this.offset.y + this.gutter.y;
  },

  absoluteBottom : function() {
    return (this.viewHeight - this.gutter.y) + this.offset.y;
  }
};