$.Shrine = function(pos, color, border) {
  this.pos = pos;
  this.radius = 55;
  this.color  = color;
  this.border = border;

  this.sprite = new $.Sprite();
  // Head
  var head = new $.Piece({
    x : 20,
    y : 20
  });

  // var shrine = this;
  var sColor = this.color;
  var bColor = this.border;
  head.name = 'head';
  head.draw = function(ctx) {
    $.render.fillCircle(ctx, this.center, 20, sColor);
    $.render.strokeCircle(ctx, this.center, 20, 3, bColor);
  };
  // Foot
  var foot = new $.Piece({
    x : 20,
    y : 45
  });
  foot.name = 'foot';
  
  foot.draw = function(ctx) {
    ctx.save();
      ctx.fillStyle = $.utils.colorString(sColor.r, sColor.g, sColor.b, sColor.a);
      ctx.beginPath();
        ctx.rect(this.center.x-15, this.center.y, 30, 10);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = $.utils.colorString(bColor.r, bColor.g, bColor.b, bColor.a);
      ctx.lineWidth = 3;
      ctx.stroke();
    ctx.restore();
    ctx.save();
      ctx.fillStyle = $.utils.colorString(sColor.r, sColor.g, sColor.b, sColor.a);
      ctx.beginPath();
        ctx.rect(this.center.x-25, this.center.y+10, 50, 20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = $.utils.colorString(bColor.r, bColor.g, bColor.b, bColor.a);
      ctx.lineWidth = 3;
      ctx.stroke();
    ctx.restore();
  };

  var idle = new $.Animation();
  idle.skeleton.head = function(delta, center, oCenter) {
    center.y = oCenter.y - 10 - Math.sin(this.alive/250) * 5;
  }.bind(idle);

  this.sprite.pieces.push(foot);
  this.sprite.pieces.push(head);
  
  this.sprite.animations.idle  = idle;
  this.sprite.currentAnimation = this.sprite.animations.idle;
};

$.Shrine.prototype = {
  update : function(delta) {
    this.sprite.update(delta);
  },
  draw : function(ctx) {
    ctx.save();
      ctx.translate(this.pos.x, this.pos.y);
      this.sprite.draw(ctx);
    ctx.restore();
  }
};