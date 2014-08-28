$.Camera = function() {
  this.offset = {
    x : 0,
    y : -100
  };

  this.viewWidth  = 0;
  this.gutter     = 0;
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
    }
    else if(pos.x < this.absoluteLeft()) {
      this.offset.x -= this.absoluteLeft() - pos.x;
    }
  },

  absoluteRight : function() {
    return (this.viewWidth - this.gutter) + this.offset.x;
  },

  absoluteLeft : function() {
    return this.offset.x + this.gutter;
  }
};