( function() {
    "use strict";

    var Castle;

    // background Manager

    Castle = function( oApp ) {

        var game = this; // eslint-disable-line consistent-this

        this.app = oApp;

        this.time = {
            "start": null,
            "current": null
        };


        // Background
        this.sky = {
            "frame": {
                "sx": 7,
                "sy": 207,
                "sw": 254,
                "sh": 190,
                "dx": 0,
                "dy": 0,
                "dw": 254,
                "dh": 190
            },
            "speed": 3,
            "maxOffset": 508 - game.app.width,
            "draw": function() {

                game._drawBackgrSpriteFromFrame( this.frame );
            },
            "update": function() {
                if ( this.frame.dx <= ( this.maxOffset * -1 ) ) {
                    this.frame.dx = 0;
                }
                this.frame.dx -= this.speed;
                this.draw();
            }
        };
        this.sky = {
            "frame": {
                "sx": 7,
                "sy": 207,
                "sw": 254,
                "sh": 190,
                "dx": 0,
                "dy": 0,
                "dw": 254,
                "dh": 190
            },
            "speed": 3,
            "maxOffset": 500 - game.app.width,
            "draw": function() {
                game._drawBackgrSpriteFromFrame( this.frame );
                game._drawBackgrSpriteFromFrame( this.frame );
            },
            "update": function() {
                if ( this.frame.dx <= ( this.maxOffset * -1 ) ) {
                    this.frame.dx = 0;
                }
                this.frame.dx -= this.speed;
                this.draw();
            }
        };
        this.city = {
            "frame": {
                "sx": 566,
                "sy": 133,
                "sw": 125,
                "sh": 60,
                "dx": 0,
                "dy": 145,
                "dw": 125,
                "dh": 60
            },
            "speed": 3,
            "maxOffset": 336 - game.app.width,
            "draw": function() {
                game._drawBackgrSpriteFromFrame( this.frame );
            },
            "update": function() {
                if ( this.frame.dx <= ( this.maxOffset * -1 ) ) {
                    this.frame.dx = 0;
                }
                this.frame.dx -= this.speed;
                this.draw();
            }
        };
        this.building = {
            "frames": {
                "part1":{
                    "sx": 7,
                    "sy": 6,
                    "sw": 126,
                    "sh": 190,
                    "dx": 0,
                    "dy": 108,
                    "dw": 126,
                    "dh": 190
                },
                "part2":{
                    "sx": 142,
                    "sy": 6,
                    "sw": 126,
                    "sh": 190,
                    "dx": 126,
                    "dy": 108,
                    "dw": 126,
                    "dh": 190
                },
                "part3":{
                    "sx": 280,
                    "sy": 6,
                    "sw": 126,
                    "sh": 190,
                    "dx": 252,
                    "dy": 108,
                    "dw": 126,
                    "dh": 190
                },
                "part4":{
                    "sx": 417,
                    "sy": 6,
                    "sw": 126,
                    "sh": 190,
                    "dx": 378,
                    "dy": 108,
                    "dw": 126,
                    "dh": 190
                }
            },
            "speed": 2,
            "maxOffset": 504- game.app.width,
            "draw": function() {
                game._drawBackgrSpriteFromFrame( this.frames.part1 );
                game._drawBackgrSpriteFromFrame( this.frames.part2 );
                game._drawBackgrSpriteFromFrame( this.frames.part3 );
                game._drawBackgrSpriteFromFrame( this.frames.part4 );
                game._drawBackgrSpriteFromFrame( this.frames.part1, 504,108 );
                game._drawBackgrSpriteFromFrame( this.frames.part2, 504,108 );
                game._drawBackgrSpriteFromFrame( this.frames.part3, 504,108 );
                game._drawBackgrSpriteFromFrame( this.frames.part4, 504,108 );
            },
            "update": function() {
                if ( this.frames.dx <= ( this.maxOffset * -1 ) ) {
                    this.frames.dx = 0;
                }
                this.frame.dx -= this.speed;
                this.draw();
            }
        };

        // Ground
        this.ground = {
            "frames":{
                "gr1":{
                    "sx": 608,
                    "sy": 77,
                    "sw": 46,
                    "sh": 15,
                    "dx": 0,
                    "dy": game.app.height - 15,
                    "dw": 46,
                    "dh": 15
                },
                "gr2":{
                    "sx": 608,
                    "sy": 93,
                    "sw": 46,
                    "sh": 15,
                    "dx": 46,
                    "dy": game.app.height - 15,
                    "dw": 46,
                    "dh": 15
                }
            },
            // "speed": 3,
            // "maxOffset": 46 - game.app.width,
            "draw": function() {
                game._drawBackgrSpriteFromFrame( this.frames.gr1 );
                game._drawBackgrSpriteFromFrame( this.frames.gr2 );
            },
            "update": function() {
                // if ( this.frames.dx <= ( this.maxOffset * -1 ) ) {
                //     this.frames.dx = 0;
                // }
                // this.frame.dx -= this.speed;
                this.draw();
            }
        };

        // character
        this.char = {
                    "frames": [
                        {
                            "sx": 3,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 33,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 63,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 94,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 131,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 164,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 198,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 231,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 267,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 300,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 334,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 366,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 397,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 428,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 460,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 492,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        }
                    ],
                    "init": function() {
                        // (re)setting properties
                        this.animation = {
                            "maxSteps": this.frames.length,
                            "step": 0
                        };
                        this.state = {
                            "isInDangerZone": false,
                            "speed": 0,
                            "acceleration": 0,
                            "boost": 0
                        };
                        // this.score = {
                        //     "current": 0,
                        //     "previous": 0
                        // };
                        this.position = {
                            "top": 0,
                            "bottom": 0
                        };
                        this.destinationFrame = {
                            "dx": 60,
                            "dy": game.app.height -36,
                            "dw": 30,
                            "dh": 43
                        };
                    },
                    "draw": function( iStep ) {
                        var oContext = game.app.context,
                            oFrom = this.frames[ iStep ],
                            oDest = this.destinationFrame;

                        oContext.save();
                        oContext.translate( oDest.dx, oDest.dy );
                        oContext.drawImage(
                            game.CharacterSprite,
                            oFrom.sx,
                            oFrom.sy,
                            oFrom.sw,
                            oFrom.sh,
                            oDest.dw / 2 * -1,
                            oDest.dh / 2 * -1,
                            oDest.dw,
                            oDest.dh
                        );
                        oContext.restore();
                    },
                    "update": function( oEvent ) {
                        var self = this;

                        // handle event. we ensure that the sended event is the good one.
                        if ( oEvent ) {
                            if ( oEvent.type === "click" || ( oEvent.type === "keyup" && oEvent.keyCode === 32 ) ) {
                                if ( !game.ended ) {
                                    if ( !this.state.acceleration ) {
                                        game.started = true;

                                    } else {
                                        this.state.speed = this.state.boost;
                                    }
                                } else {
                                    // restart game
                                    return game.init();
                                }
                            } else {
                                return;
                            }
                        }
                    }
                };

        // Utils
        this._drawBackgrSpriteFromFrame = function( oFrame ) {
            this.app.context.drawImage(
                this.BackGroundSprite,
                oFrame.sx,
                oFrame.sy,
                oFrame.sw,
                oFrame.sh,
                oFrame.dx,
                oFrame.dy,
                oFrame.dw,
                oFrame.dh
            );
        };

        this._drawCharSpriteFromFrame = function( oFrame ) {
            this.app.context.drawImage(
                this.CharacterSprite,
                oFrame.sx,
                oFrame.sy,
                oFrame.sw,
                oFrame.sh,
                oFrame.dx,
                oFrame.dy,
                oFrame.dw,
                oFrame.dh
            );
        };

        // Setup Animation loop
        this.animate = function() {
            this.time.current = Date.now();
            this.animationRequestID = window.requestAnimationFrame( this.animate.bind( this ) );

            // draw: clear
            this.app.context.clearRect( 0, 0, this.app.width, this.app.height );
            // draw & animate: background
            this.sky.draw();
            this.city.draw();
            this.building.draw();
            // draw & animate: ground
            this.ground.update();
            // draw & animate: character
            this.char.update();
            if ( this.time.current - this.time.start > 50 ) {
                this.time.start = Date.now();
                ( ++this.char.animation.step < this.char.animation.maxSteps ) || ( this.char.animation.step = 0 );
            }
            this.char.draw( this.char.animation.step );
        };

        // Game over
        this.over = function() {
            this.started = false;
            window.cancelAnimationFrame( this.animationRequestID );
            window.alert( "GameOver" );

            if ( window.confirm( "Recommencer ?" ) ) {
                this.start();
            }
        };

        // Init game
        this.start = function() {
            // declare click & keyup events
            if ( !this.eventsSetted ) { // we need to be sure to listen to events only once. we use a boolean to do it.
                // this.app.canvas.addEventListener( "click", this.bird.update.bind( this.bird ) );
                // window.addEventListener( "keyup", this.bird.update.bind( this.bird ) );
                this.eventsSetted = true;
            }
            // reset some variables
            this.char.init();
            this.time.start = Date.now();
            // launch animation
            this.animate();
        };

        // Load spritesheet
        this.BackGroundSprite = new Image();
        this.BackGroundSprite.addEventListener( "load", this.start.bind( this ) );
        this.BackGroundSprite.src = "./resources/BackGround.png";
        this.CharacterSprite = new Image();
        this.CharacterSprite.addEventListener( "load", this.start.bind( this ) );
        this.CharacterSprite.src = "./resources/spritesChar.png";
    };

    window.Castle = Castle;

} )();
