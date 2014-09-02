$.Sprite = function() {
  this.pieces     = [];
  this.animations = {};

  this.canvas = null;
  this.ctx   = null;

  this.init();
};

$.Sprite.prototype = {
  init : function() {
    // this.canvas  = document.createElement("canvas"),
    // this.ctx     = this.canvas.getContext("2d");
  },
  
  draw : function(ctx) {
    var pieces = this.pieces;
    
    for(var i = 0; i < pieces.length; i++) {
      pieces[i].draw(ctx);
    }
  },

  update : function(delta) {
    this.currentAnimation.update(delta);

    var pieces = this.pieces;
    
    for(var i = 0; i < pieces.length; i++) {
      if(this.currentAnimation.skeleton[pieces[i].name]) {
        this.currentAnimation.skeleton[pieces[i].name](delta, pieces[i].center, pieces[i].orginalCenter);
      }
    }
  }

};

$.Piece = function(pos) {
  this.center = pos;
  this.orginalCenter = {
    x: pos.x,
    y: pos.y
  };
  this.name = '';
};

$.Piece.prototype = {
  draw : function(ctx) {}
};

// $.Sprite


// piece = {
//   center = x, y
//   relation : {
//     otherPiece.center
//     <possible function>
//   }


// }

/*******************************
  PoC Sprite
    - 2 Circle Shapes, same color
    - 1 Larger above a smaller one, centered on x
    
  based on a Sprite size of 30 x 45 canvas

  var LargePiece = {
    center : {
      x : 15,
      y : 15
    }

    image : function(ctx) {
      $.render.fillCircle(ctx, this.center, 15, {r: 42, g: 239, b: 247, a: 0.8});
    }
  }

  var SmallPiece = {
    center : {
      x : 15,
      y : 25
    }

    image : function(ctx) {
      $.render.fillCircle(ctx, this.center, 5, {r: 42, g: 239, b: 247, a: 0.8});
    }
  }

*********************************/
// (function(){
//   var LargePiece = {
//     center : {
//       x : 15,
//       y : 15
//     },

//     draw : function(ctx) {
//       $.render.fillCircle(ctx, this.center, 15, {r: 42, g: 239, b: 247, a: 0.8});
//       $.render.strokeCircle(ctx, this.center, 15, 3, {r: 11, g: 73, b: 182, a: 0.5});
//     }
//   }

//   var SmallPiece = {
//     center : {
//       x : 15,
//       y : 35
//     },

//     draw : function(ctx) {
//       $.render.fillCircle(ctx, this.center, 5, {r: 42, g: 239, b: 247, a: 0.8});
//       $.render.strokeCircle(ctx, this.center, 5, 3, {r: 11, g: 73, b: 182, a: 0.5});
//     }
//   }

//   var lPiece = new $.Piece(LargePiece.center);
//   lPiece.draw = LargePiece.draw;
//   lPiece.name = 'head';

//   var sPiece = new $.Piece(SmallPiece.center);
//   sPiece.draw = SmallPiece.draw;
//   sPiece.name = 'foot';

//   var anim = new $.Animation();
//   anim.skeleton.head = function(delta, center, oCenter) {
//     center.y = oCenter.y - 6 - Math.sin(this.alive/250) * 3;
//   }.bind(anim);

//   anim.skeleton.foot = function(delta, center) {
    
//   }.bind(anim);

//   $.POC_SPRITE = new $.Sprite();


//   $.POC_SPRITE.pieces.push(lPiece);
//   $.POC_SPRITE.pieces.push(sPiece);

//   $.POC_SPRITE.animations.idle = anim;
//   $.POC_SPRITE.currentAnimation = $.POC_SPRITE.animations.idle;
// })();