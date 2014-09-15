var canvas   = document.getElementById('world');
var context  = this.canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;
var mouse = {
  x : 0,
  y : 0
};

var mousedown = false;

canvas.onmousemove = function(e) {
  var rect = canvas.getBoundingClientRect();
  // this.mouse.x = e.x - this.canvas.offsetLeft - 5 + this.camera.offset.x;
  mouse.x = e.clientX - rect.left - 5;
  // this.mouse.y = e.y - this.canvas.offsetTop  - 5 + this.camera.offset.y; 
  mouse.y = e.clientY - rect.top - 5;
};


canvas.onmousedown = function(e) {
  mousedown = true;
}

canvas.onmouseup = function(e) {
  mousedown = false;
}

function init2D(arr, num) {
  for(var i = 0; i <= num; i++) {
    arr[i] = [];
    for(var j = 0; j <= num; j++) {
      arr[i].push(0);
    }
  }
}

var density     = [];
var x           = [];
var x0          = [];
var y           = [];
var y0          = [];
var prevDensity = [];

init2D(density, 80);
init2D(x, 80);
init2D(y, 80);
init2D(prevDensity, 80);
init2D(x0, 80);
init2D(y0, 80);
// init2D(prevDensity, 40);
// fluid[19][38].density += 0.8;
// fluid[20][38].density += 0.8;

var last = 0;

function density_transfer(particle,step) {
  return particle.density * particle.y * step;
}

function diffuse(arr, prevArr, step, diffuse, b) {
  var abs = step * arr.length * arr.length * diffuse;
  for(var k = 0; k < 20; k++) {
    for(var i = 1; i < arr.length-1; i++) {
      for(var j = 1; j < arr[i].length-1; j++) {
        prevArr[i][j] = arr[i][j];
        var left    = arr[i-1][j],
            top     = arr[i-1][j-1],
            right   = arr[i+1][j],
            bottom  = arr[i][j+1];
        // var transfer = density_transfer(bottom, step);
        // fluid[i][j].density += transfer;
        // bottom.density -= transfer;
        // console.log((fluid[i][j].density + a * (left.density + right.density + top.density + bottom.density)) / (1 + 4 * a))
        // console.log(left.density);
        // console.log(top.density);
        // console.log(right.density);
        // console.log(bottom.density);
        arr[i][j] = (prevArr[i][j] + abs * (left+ right + top + bottom)) / (1 + 4 * abs);
        arr[i][j] = Math.min(arr[i][j], 1.0);
        // fluid[i][j].prevDensity= fluid[i][j].density;
        // console.log(transfer)
      }
    }
    // console.log('P7');
    setBounds(b, arr);
  }
}

function copy(arr) {
  return JSON.parse(JSON.stringify(arr));
}

function swap(arr1, arr2) {
  var tmp = copy(arr1);
  arr2 = arr1;
  arr1 = tmp;
}

function advect(dens, pDens, xVel, yVel, step, b) {
  // var stepSize = step * dens.length-2;
  var stepSize = step * dens.length-2;

  for(var i = 1; i < dens.length-1; i++) {
    for(var j = 1; j < dens[i].length-1; j++) {  
      var x = i - stepSize*xVel[i][j];
      var y = j - stepSize*yVel[i][j];

      x = Math.max(0.5, x);
      x = Math.min(x, dens.length-2+0.5);
      
      var i0 = Math.floor(x);
      var i1 = i0+1;

      y = Math.max(0.5, y);
      y = Math.min(y, dens.length-2+0.5);

      var j0 = Math.floor(y);
      var j1 = j0+1;

      var s1 = x-i0;
      var s0 = 1-s1;
      var t1 = y-j0;
      var t0 = 1 - t1;
      // console.log(s1,s0,t1,t0);
      dens[i][j] =  s0*(t0*pDens[i0][j0] + t1*pDens[i0][j1]) + 
                    s1*(t0*pDens[i1][j0] + t1*pDens[i1][j1]);
    }
  }
  // console.log('P6');
  setBounds(b, dens);
}


function project(_x, _y, _x0, _y0) {
  var h = 1.0/(_x.length-2);

  for(var i = 1; i < _x.length-1; i++) {
    for(var j = 1; j < _x[i].length-1; j++) {  
      _y0[i][j] = -0.5 * h * (_x[i+1][j] - _x[i-1][j] + _y[i][j+1] - _y[i][j-1]);
      _x0[i][j] = 0;
    }
  }
  // console.log('P1');
  setBounds(0,_y0);
  // console.log('P2');
  setBounds(0,_x0);
  for(var k = 0; k < 20; k++) {
    for(var i = 1; i < _x.length-1; i++) {
      for(var j = 1; j < _x[i].length-1; j++) {
        _x0[i][j] = (_y0[i][j] + _x0[i-1][j] + _x0[i+1][j] + _x0[i][j-1] + _x0[i][j+1]) / 4;
      }
    }
    // console.log('P3');
    setBounds(0,_x0);
  }

  for(var i = 1; i < _x.length-1; i++) {
    for(var j = 1; j < _x.length-1; j++) {
      _x[i][j] -= 0.5 * (_x0[i+1][j] - _x0[i-1][j]) / h;
      _y[i][j] -= 0.5 * (_x0[i][j+1] - _x0[i][j-1]) / h;
    }
  }
  setBounds(1,_x);
  setBounds(2,_y);
}

function density_step(step) {
  // for(var i = 19; i < 22; i++) {
  //   for(var j = 1; j < density[i].length-1; j++) {
  //     density[i][38] += step * 1.0;
  //   }
  // }
  if(mousedown)
    density[Math.floor(mouse.x/5)][Math.floor(mouse.y/5)] += 1000 * step;
  // prevDensity = copy(density);
  swap(density, prevDensity);
  // diffuse(density, prevDensity, step, 0.001, 0);
  diffuse(density, prevDensity, step, 0.00025, 0);
  swap(density, prevDensity);
  advect(density, prevDensity, x, y, step, 0);
}

function velocity_step(step) {
  // for(var i = 20; i < 30; i++) {
  //   x[i][38] += step * 1.0;
  //   y[i][38] += step * 60;
  // }
  x[Math.floor(mouse.x/5)][Math.floor(mouse.y/5)] += 100 * step;
  y[Math.floor(mouse.x/5)][Math.floor(mouse.y/5)] += 150 * step;
  // console.log(y[Math.floor(mouse.x/10)])
  // x0 = copy(x);
  // y0 = copy(y);
  swap(x, x0);
  swap(y, y0);

  diffuse(x, x0, step, 0.01, 1);
  diffuse(y, y0, step, 0.01, 2);
  project(x, y, x0, y0);

  // x0 = copy(x);
  // y0 = copy(y);
  swap(x, x0);
  swap(y, y0);

  advect(x, x0, x0, y0, step, 1);
  advect(y, y0, x0, y0, step, 2);
  project(x, y, x0, y0);

}

function setBounds (b, _x) {
  for(i = 1; i < _x.length-1; i++) {
    _x[0][i] = b===1 ? -_x[1][i] : _x[1][i];
    _x[_x.length-1][i] = b===1 ? -_x[_x.length-2][i] : _x[_x.length-2][i];
    
    _x[i][0] = b===2 ? -_x[i][1] : _x[i][1];
    _x[i][_x.length-1] = b===2 ? -_x[i][_x.length-2] : _x[i][_x.length-2];
  }

  // console.log(_x[1][0],_x[0][1]);
  // console.log(_x)
  _x[0][0] = 0.5 * (_x[1][0] + _x[0][1]);
  _x[0][_x.length-1] = 0.5 * (_x[1][_x.length-1] + _x[0][_x.length-2]);

  _x[_x.length-1][0] = 0.5 * (_x[_x.length-2][0] + _x[_x.length-1][1]);
  _x[_x.length-1][_x.length-1] = 0.5 * (_x[_x.length-2][_x.length-1] + _x[_x.length-1][_x.length-2]);


  // Add in object here
}

// for(var i = 10; i < 30; i++) {
//     // for(var j = 1; j < density[i].length-1; j++) {
//     density[i][38] += step * 1.0 * 10;
//     // }
//   }

// for(var i = 20; i < 30; i++) {
//   x[i][38] +=  0.01;
//   y[i][38] +=  0.04;
// }
function tick(timestamp) {
  var drawStart = (timestamp || 0);
  if(last === 0) {
    last = drawStart;
  }
  // console.log('[%s - %s]', drawStart, this.time.last)
  delta = drawStart - last;
  
  if(delta > 50) {
    delta = 50;
  }
  
  // var step = delta/1000;
  var step = delta/1000;
  
  /*********************************************
          ********* UPDATE *********
  **********************************************/
  // Introduce denstity - could be anything

  // Diffuse
  // velocity_step(step);
  density_step(step);
  

  /*********************************************
          ********* DRAW *********
  **********************************************/

  context.clearRect(0,0,400,400);
  var xoffset = 0;
  var yoffset = 0;
  for(var i = 0; i < density.length; i++) {
    for(var j = 0; j < density[i].length; j++) {
      // if(!isNumber(fluid[i][j])) {
      //   console.log('um')
      // }
      var dens = density[i][j] || 0;
      dens = Number(dens.toFixed(2));
      dens = dens > 0.2 ? dens+0.5 : dens > 0.1 ? dens + 0.2 : dens;
      
      context.save();
        var _x = i*5+xoffset;
        var _y = j*5+yoffset;
        
        context.fillStyle = "rgba(255,255,255,"+dens+")";
        if(dens > 0.5) {

          // context.beginPath();
          // context.arc(_x,_y, 5, 0 , 2 * Math.PI, false);
          // context.closePath();
          // context.fill();
          context.fillStyle = "rgba(255,0,0,"+dens+")";
          context.fillRect(_x,_y,5,5);  
        }
        else {
          
          context.fillRect(_x,_y,5,5);  
        }
        
        
        
      context.restore();
      // context.save();
      //   context.fillStyle = "rgba(18,51,64, "+x[i][j]+")";
      //   context.fillRect(i*10+5,j*10+5,5,5);
      // context.restore();
      context.save();
        context.beginPath();
        context.moveTo(i*5+5, j*5+5);
        context.lineTo(i*5+x[i][j]+5, j*5+y[i][j]+5);
        context.closePath();
        context.strokeStyle = '#FFF';
        context.stroke();
      context.restore();
    }
  }

  // context.save();
  //   // ctx.fillStyle = "rgba(110,179,56,0.5)";
  //   context.fillStyle = "rgba(18,51,64, 0.95)";
  //   context.beginPath();
  //   context.arc(400, 300, 50, 0 , 2 * Math.PI, false);
  //   context.closePath();
  //   context.fill();
  // context.restore();
  
  last = drawStart;

  requestAnimationFrame(tick);  
}

tick();