var canvas = document.createElement( "canvas" ),
    ctx = canvas.getContext( "2d" ),
    container = document.getElementById( "gameCanvasContainer" );

var DEFAULT_WIDTH = 800, DEFAULT_HEIGHT = 600;

canvas.width = DEFAULT_WIDTH;
canvas.height = DEFAULT_HEIGHT;
container.appendChild(canvas);

var demo = new Demo( );

/*
 * helper function
 * returns random integer between min and max
 */
var getRandomInt = function( min, max ) {
    return Math.floor( Math.random( ) * ( max - min + 1 )) + min;
}

/*==============================*/
/* Main Loop
/*==============================*/

var animationFrame = 
    window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     || null;

var main = function( ) {
    var now = Date.now( ),
        delta = now - then;

    if( demo ) {
        demo.update( delta / 1000 );
        demo.render( );
    }

    then = now;
};

var then = Date.now( );

if( animationFrame !== null ) {
    var mainLoop = function( ) {
        main( );
        animationFrame( mainLoop, canvas );
    }

    animationFrame( mainLoop, canvas );
} else {
    // for IE9
    setInterval( main, 1000 / demo.FPS );
}

/*================================================*/
/* Main Demo Class */
/*================================================*/

function Demo( ) {
    this.FPS = 60; // for setInterval fallback only
    this.started = false;
    this.bgLayers = [];
    this.numBgLayers = 12;
    this.baseStarNum = 16;
    this.baseStarRadius = 1.5;
    this.baseStarSpeed = {
        x: 0,
        y: 100
    };
}

Demo.prototype.update = function(delta) {
    if ( ! this.started ) {
        // initialise demo

        this.started = true;
        this.initBackground( );
        console.log( "Demo started" );
    } else {
        for( var i = 0; i < this.bgLayers.length; i++ ) {
            for( var j = 0; j < this.bgLayers[ i ].length; j++ ) {
                var star = this.bgLayers[ i ][ j ];

                if( this.inBounds( star.x, star.y )) {
                    // move star
                    star.x += star.speed.x * delta;
                    star.y += star.speed.y * delta;
                } else {
                    // reset star
                    star.x = getRandomInt( 0, canvas.width );
                    star.y = 1;
                }
            }
        }
    }
};

Demo.prototype.render = function( ) {
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#FFF";
    ctx.fillRect( 0, 0, canvas.width, canvas.height );
    ctx.strokeRect( 0, 0, canvas.width, canvas.height );
    ctx.fillStyle = "#FFF";

    for ( var i = 0; i < this.bgLayers.length; i++) {
        for( var j = 0; j < this.bgLayers[ i ].length; j++ ) {
            var star = this.bgLayers[ i ][ j ];

            if( star.radius >= 0.5 ) {
                ctx.beginPath( );
                ctx.arc( star.x, star.y, star.radius, 0, 2 * Math.PI, false );
                ctx.fill( );
            } else {
                // circles cannot be seen below this point
                // cheaper to render square pixels instead

                ctx.fillRect( star.x, star.y, 1, 1 );
            }
        }
    }
};

/*
 * initialise star field
 * stars divided into layers
 * layers have different speeds
 * stars in faster layers are larger
 */
Demo.prototype.initBackground = function( ) {
    for( var i = this.numBgLayers; i > 0; i-- ) {
        var stars = [];

        for( var j = 0; j < this.baseStarNum * i; j++ ) {
            var star = {
                x: getRandomInt( 0, canvas.width ),
                y: getRandomInt( 0, canvas.height ),
                radius: Math.round( this.baseStarRadius / i * 100 ) / 100,
                speed: {
                    x: Math.round( this.baseStarSpeed.x / i * 100 ) / 100,
                    y: Math.round( this.baseStarSpeed.y / i * 100 ) / 100 
                }
            };
            stars.push( star );
        }
        this.bgLayers.push( stars );
    }
};

Demo.prototype.inBounds = function( x, y ) {
    return (( x > 0 && x < canvas.width ) && ( y > 0 && y < canvas.height ));
};