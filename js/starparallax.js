var canvas = null,
    container = document.getElementById("gameCanvasContainer");

canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var DEFAULT_WIDTH = 800;
var DEFAULT_HEIGHT = 600;

canvas.width = DEFAULT_WIDTH;
canvas.height = DEFAULT_HEIGHT;
container.appendChild(canvas);

var demo = new Demo();

/*==============================*/
/* Main Loop
/*==============================*/

var main = function () {
    var now = Date.now(),
        delta = now - then;

    if (demo) {
        demo.update(delta / 1000);
        demo.render();
    }

    then = now;
};

var then = Date.now();
setInterval(main, 1000 / demo.FPS);

/*================================================*/
/* Main Game Class */
/*================================================*/

/*
 * helper function
 * returns random integer between min and max
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Demo() {
    this.FPS = 60;
    this.started = false;
    this.bgLayers = new Array();
    this.numBgLayers = 12;
    this.baseStarNum = 6;
}

Demo.prototype.update = function (delta) {
    if (!this.started) {
        this.started = true;
        this.initBackground();
        console.log("started");
    } else {
        for (var i = 0; i < this.bgLayers.length; i++) {
            for (var j = 0; j < this.bgLayers[i].length; j++) {
                var star = this.bgLayers[i][j];

                if (this.inBounds(star.x, star.y)) {
                    // move star
                    star.x += star.speed.x;
                    star.y += star.speed.y;
                } else {
                    // reset star
                    star.x = getRandomInt(0, canvas.width);
                    star.y = 1;
                }
            }
        }
    }
};

Demo.prototype.render = function () {
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.save(); // save context
    ctx.fillStyle = ctx.strokeStyle = "#FFFFFF";

    for (var i = 0; i < this.bgLayers.length; i++) {
        for (var j = 0; j < this.bgLayers[i].length; j++) {
            var star = this.bgLayers[i][j];

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();
        }
    }
    ctx.restore(); // restore context
};

/*
 * initialise star field
 * stars divided into layers
 * layers have different speeds
 * stars in faster layers are larger
 */
Demo.prototype.initBackground = function () {
    for (var i = this.numBgLayers; i > 0; i--) {
        var stars = new Array();

        for (var j = 0; j < this.baseStarNum * i; j++) {
            var star = {
                x: getRandomInt(0, canvas.width),
                y: getRandomInt(0, canvas.height),
                radius: 1 / i,
                speed: {
                    x: 0,
                    y: 2 / i
                }
            };
            stars.push(star);
        }
        this.bgLayers.push(stars);
    }
};

Demo.prototype.inBounds = function (x, y) {
    return ((x > 0 && x < canvas.width) && (y > 0 && y < canvas.height));
};