$.Shrine = function(pos, color) {
  this.pos = pos;
  this.radius = 15;
  this.color = color;
  console.log(pos)
};

$.Shrine.prototype = {
  draw : function(ctx) {
    $.render.fillCircle(ctx, this.pos, this.radius, this.color);
  }
};