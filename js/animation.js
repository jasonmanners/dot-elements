$.Animation = function() {
  this.life       = 0;
  this.alive      = 0;
  this.skeleton   = {};
};

$.Animation.prototype = {
  update : function(delta) {
    this.alive += delta;
  }
};