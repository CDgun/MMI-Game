( function() {
    "use strict";

    var Castle,
        direction = 1, // 1 = right, 2 = left
        movingL = false,
        movingR = false,
        jump = false,
        atk = false
        ;

    // keyboard Manager
    function doKeyDown(evt){
        switch (evt.keyCode) {
            // case 38:  /* Up arrow was pressed */
            //     jump = true;
            //     break;
            case 40:  /* Down arrow was pressed */

                break;
            case 37:  /* Left arrow was pressed */
                movingL=true;
                direction = 2;
                break;
            case 39:  /* Right arrow was pressed */
                movingR=true;
                direction = 1;
                break;
            case 32: /* space was pressed */
                if ( game.started ) {
                    atk = true;
                }
                break;
            }

    }
    function doKeyUp(evt){
        switch (evt.keyCode) {
            case 40:  /* Down arrow was pressed */

                break;
            case 37:  /* Left arrow was released */
                movingL=false;
                break;
            case 39:  /* Right arrow was released */
                movingR=false;
                break;
            case 32: /* space was pressed */
                if ( !game.started ) {
                    game.started = true;
                }
                if ( game.failed ) {
                    game.start();
                }
                break;
            }
    }


    // background Manager

    Castle = function( oApp ) {

        var game = this; // eslint-disable-line consistent-this

        this.app = oApp;

        this.time = {
            "start": null,
            "current": null
        };
        // Starting Screen
        this.starting = {
           "frame": {
               "sx": 48,
               "sy": 195,
               "sw": 119,
               "sh": 77,
               "dx": (game.app.width - 119)/2,
               "dy": game.app.height/2 - 100,
               "dw": 119,
               "dh": 77
           },
           "draw": function() {
               var oContext = game.app.context;

                oContext.drawImage(game.IntroBackgr,0,0,800, 529,0,0, 500, 312);

                game._drawTitleFromFrame( this.frame );

                oContext.font="20px GameFont";
                oContext.fillStyle="white";
                oContext.fillText("Press SPACE to play !",(game.app.width-240 ) / 2,game.app.height-80);
            }
        };
        //Game over Screen
        this.overScreen = {
           "frames": {
               "back": {
                   "sx": 7,
                   "sy": 262,
                   "sw": 256,
                   "sh": 192,
                   "dx": 0,
                   "dy": 0,
                   "dw": game.app.width,
                   "dh": game.app.height
               },
               "over": {
                   "sx": 10,
                   "sy": 200,
                   "sw": 119,
                   "sh": 25,
                   "dx": (game.app.width - 119)/2,
                   "dy": (game.app.height- 25)/2 ,
                   "dw": 119,
                   "dh": 25
               }

           },
           "draw": function() {
               var oContext = game.app.context;

               game._drawGameoverFromFrame( this.frames.back );
               game._drawGameoverFromFrame( this.frames.over );

               oContext.font="20px GameFont";
               oContext.fillStyle="white";
               oContext.fillText("Press SPACE to restart !",(game.app.width-245 ) / 2,game.app.height-80);
           }
        };
        // Hud
        this.hud = {
            "frames": {
                "hudBcg": {
                    "sx": 6,
                    "sy": 5,
                    "sw": 111,
                    "sh": 23,
                    "dx": 20 ,
                    "dy": 20,
                    "dw": 111,
                    "dh": 23
                },
                "hp": {
                    "sx": 32,
                    "sy": 72,
                    "sw": 5,
                    "sh": 3,
                    "dx": 20 + 30 , // hudbcg.dx + dist for hp
                    "dy": 20 + 4, // hudBcg.dy + dist hp
                    "dw": 5,
                    "dh": 3
                },
                "weapon": {
                    "sx": 149,
                    "sy": 50,
                    "sw": 20,
                    "sh": 20,
                    "dx": 20 + 125,// hudbcg.dx + dist for weapon
                    "dy": 20,  // hudBcg.dy
                    "dw": 20,
                    "dh": 20
                }
            },
            "livesDx": [],
            "init": function() {
                while ( this.frames.hp.dx <= (50 + (6 * game.hp)) ) {
                    this.livesDx.push( this.frames.hp.dx );
                    this.frames.hp.dx += 6;
                }
            },
            "draw": function() {
                var i = 0;

                game._drawHudFromFrame( this.frames.hudBcg );
                game._drawHudFromFrame( this.frames.weapon );
                // draw hpbar
                for (i = 0 ; i < game.hp; i++ ) {
                   game._drawHudFromFrame( this.frames.hp, this.livesDx[ i ] );
                }

             }
        };

        // Background
        this.sky = {
            "frame": {
                "sx": 8,
                "sy": 207,
                "sw": 2036,
                "sh": 192,
                "dx": -1018+game.app.width,
                "dy": 0,
                "dw": 2036,
                "dh": 192
            },
            "speed": 0.1,
            "maxOffset": 2036 - game.app.width,
            "draw": function() {
                game._drawBackgrSpriteFromFrame( this.frame );
            },
            "update": function() {
                if ( this.frame.dx <= ( this.maxOffset * -1 ) ) {
                    this.frame.dx = -1018+game.app.width;
                }
                this.frame.dx -= this.speed;
                this.draw();
            },
            "updateL": function() {
                if ( this.frame.dx >= 0 ) {
                    this.frame.dx = -1018+game.app.width;
                }
                this.frame.dx += this.speed;
                this.draw();
            }
        };

        this.city = {
            "frame": {
                "sx": 8,
                "sy": 428,
                "sw": 2020,
                "sh": 61,
                "dx": -1010+game.app.width,
                "dy": 149,
                "dw": 2020,
                "dh": 61
            },
            "speed": 0.3,
            "maxOffset": 2020 - game.app.width,
            "draw": function() {
                game._drawBackgrSpriteFromFrame( this.frame );
            },
            "update": function() {
                if ( this.frame.dx <= ( this.maxOffset * -1 ) ) {
                    this.frame.dx = -1010+game.app.width;
                }
                this.frame.dx -= this.speed;
                this.draw();
            },
            "updateL": function() {
                if ( this.frame.dx >= 0 ) {
                    this.frame.dx = -1010+game.app.width;
                }
                this.frame.dx += this.speed;
                this.draw();
            }
        };
        this.building = {
            "frame": {
                "sx": 8,
                "sy": 6,
                "sw": 2020,
                "sh": 192,
                "dx": -1010+game.app.width,
                "dy": 108,
                "dw": 2020,
                "dh": 192
            },
            "speed": 1.2,
            "maxOffset": 2020- game.app.width,
            "draw": function() {
                game._drawBackgrSpriteFromFrame( this.frame );

            },
            "update": function() {
                if ( this.frame.dx <= ( this.maxOffset * -1 ) ) {
                    this.frame.dx = -1010+game.app.width;
                }
                this.frame.dx -= this.speed;
                this.draw();
            },
            "updateL": function() {
                if ( this.frame.dx >=0 ) {
                    this.frame.dx = -1010+game.app.width;
                }
                this.frame.dx += this.speed;
                this.draw();
            }
        };

        // Ground
        this.ground = {
            "frame":{
                "sx": 7,
                "sy": 521,
                "sw": 2028,
                "sh": 15,
                "dx": -1014+game.app.width,
                "dy": game.app.height - 15,
                "dw": 2028,
                "dh": 15
            },
            "speed": 1.2,
            "maxOffset": 2028 - game.app.width,
            "draw": function() {
                game._drawBackgrSpriteFromFrame( this.frame );
            },
            "update": function() {
                if ( this.frame.dx <= ( this.maxOffset * -1 ) ) {
                    this.frame.dx = -1014+game.app.width;
                }
                this.frame.dx -= this.speed;
                this.draw();
            },
            "updateL": function() {
                if ( this.frame.dx >= 0 ) {
                    this.frame.dx = -1014+game.app.width;
                }
                this.frame.dx += this.speed;
                this.draw();
            }
        };

        //zombie
        this.zombie ={
            "framesZ":[
                {
                    "sx": 22,
                    "sy": 3,
                    "sw": 23,
                    "sh": 47

                },
                {
                    "sx": 48,
                    "sy": 3,
                    "sw": 23,
                    "sh": 47

                },
                {
                    "sx": 75,
                    "sy": 3,
                    "sw": 23,
                    "sh": 47
                },
                {
                    "sx": 101,
                    "sy": 3,
                    "sw": 23,
                    "sh": 47

                },
                {
                    "sx": 36,
                    "sy": 112,
                    "sw": 23,
                    "sh": 47

                },
                {
                    "sx": 63,
                    "sy": 112,
                    "sw": 23,
                    "sh": 47

                },
                {
                    "sx": 90,
                    "sy": 112,
                    "sw": 23,
                    "sh": 47

                },
                {
                    "sx": 120,
                    "sy": 57,
                    "sw": 23,
                    "sh": 47

                },
                {
                    "sx": 90,
                    "sy": 57,
                    "sw": 23,
                    "sh": 47

                },
                {
                    "sx": 62,
                    "sy": 57,
                    "sw": 23,
                    "sh": 47

                },
                {
                    "sx": 38,
                    "sy": 57,
                    "sw": 23,
                    "sh": 47

                },
                {
                    "sx": 14,
                    "sy": 57,
                    "sw": 23,
                    "sh": 47

                }
            ],
            "init": function() {
                // (re)setting properties
                this.animation = {
                    "maxSteps": this.framesZ.length,
                    "step": 0
                };
                this.state = {
                    "isInDangerZone": false,
                    "speed": 0
                };
                this.destinationFrameZ = {
                    "dx": game.app.width-23,
                    "dy": game.app.height -36,
                    "dw": 23,
                    "dh": 47
                };
            },
            "drawZombie":function ( iStep ) {
                var oContext = game.app.context,
                    oFrom = this.framesZ[ iStep ],
                    oDest = this.destinationFrameZ;

                oContext.save();
                oContext.translate( oDest.dx, oDest.dy );
                oContext.drawImage(
                    game.zombieSprite,
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
            "update": function() {
                this.framesZ.dx -= game.ground.speed;
                if ( this.framesZ.dx < ( this.framesZ.dw * -1 ) ) {
                    this.framesZ.dx = game.app.width;
                }
                //zombie
                if ( game.time.current - game.time.start > 100 ) {
                    game.time.start = Date.now();
                    ( ++game.zombie.animation.step < game.zombie.animation.maxSteps ) || ( game.zombie.animation.step = 0 );
                }
                game.zombie.drawZombie(game.zombie.animation.step);

            }
        };
        // character

        this.char = {
                    "framesIddleR": [
                        {
                            "sx": 143,
                            "sy": 448,
                            "sw": 26,
                            "sh": 44
                        },
                        {
                            "sx": 174,
                            "sy": 448,
                            "sw": 26,
                            "sh": 44
                        },
                        {
                            "sx": 207,
                            "sy": 448,
                            "sw": 26,
                            "sh": 44
                        },
                        {
                            "sx": 239,
                            "sy": 448,
                            "sw": 26,
                            "sh": 44
                        }
                    ],
                    "framesIddleL": [
                        {
                            "sx": 896,
                            "sy": 448,
                            "sw": 26,
                            "sh": 44
                        },
                        {
                            "sx": 864,
                            "sy": 448,
                            "sw": 26,
                            "sh": 44
                        },
                        {
                            "sx": 832,
                            "sy": 448,
                            "sw": 26,
                            "sh": 44
                        },
                        {
                            "sx": 799,
                            "sy": 448,
                            "sw": 26,
                            "sh": 44
                        }
                    ],
                    "framesR": [
                        {
                            "sx": -3,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 29,
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
                            "sx": 163,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 195,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 227,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 263,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 295,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 327,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 359,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 393,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 424,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 455,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 487,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        }
                    ],
                    "framesL":[
                        {
                            "sx": 1290,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 1258,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 1225,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 1193,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 1155,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 1124,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 1091,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 1060,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 1024,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 992,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 960,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 928,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 895,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 863,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 832,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        },
                        {
                            "sx": 799,
                            "sy": 153,
                            "sw": 30,
                            "sh": 43
                        }
                    ],
                    "framesJumpR":[
                        {
                            "sx": 139,
                            "sy": 402,
                            "sw": 37,
                            "sh": 42,
                            "dy": game.app.height -36
                        },                              //quitte le sol
                        {
                            "sx": 139,
                            "sy": 402,
                            "sw": 37,
                            "sh": 42,
                            "dy": game.app.height -42
                        },
                        {
                            "sx": 180,
                            "sy": 402,
                            "sw": 37,
                            "sh": 42,
                            "dy": game.app.height -48
                        },
                        {
                            "sx": 260,
                            "sy": 404,
                            "sw": 37,
                            "sh": 42,
                            "dy": game.app.height -54
                        },
                        {
                            "sx": 299,
                            "sy": 404,
                            "sw": 37,
                            "sh": 42,
                            "dy": game.app.height -60
                        },
                        {
                            "sx": 339,
                            "sy": 404,
                            "sw": 37,
                            "sh": 42,
                            "dy": game.app.height -54
                        },
                        {
                            "sx": 380,
                            "sy": 404,
                            "sw": 37,
                            "sh": 42,
                            "dy": game.app.height -42
                        },
                        {                           // retouche le sol
                            "sx": 427,
                            "sy": 402,
                            "sw": 37,
                            "sh": 42,
                            "dy": game.app.height -36
                        },
                        {
                            "sx": 468,
                            "sy": 402,
                            "sw": 37,
                            "sh": 42,
                            "dy": game.app.height -36
                        },
                        {
                            "sx": 508,
                            "sy": 153,
                            "sw": 37,
                            "sh": 42,
                            "dy": game.app.height -36
                        },
                        {
                            "sx": 549,
                            "sy": 153,
                            "sw": 37,
                            "sh": 42,
                            "dy": game.app.height -36
                        }
                    ],
                    "framesDown":[],
                    "framesAtk":[
                        {
                            "sx": 47,
                            "sy": 1417,
                            "sw": 34,
                            "sh": 44,
                            "dw": 34
                        },
                        {
                            "sx": 87,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44,
                            "dw": 45
                        },
                        {
                            "sx": 138,
                            "sy": 1417,
                            "sw": 31,
                            "sh": 44,
                            "dw": 31
                        }
                    ],
                    "init": function() {
                        // (re)setting properties
                        this.animationR = {
                            "maxStepsR": this.framesR.length,
                            "stepR": 0
                        };
                        this.animationIddle = {
                            "maxStepIddle": this.framesIddleR.length,
                            "stepIddle": 0
                        };
                        this.animationL = {
                            "maxStepsL": this.framesL.length,
                            "stepL": 0
                        };
                        this.animationUp = {
                            "maxStepsUp": this.framesJumpR.length,
                            "stepUp": 0
                        };
                        this.animationDown = {
                            "maxStepsDown": this.framesDown.length,
                            "stepDown": 0
                        };
                        this.animationAtk = {
                            "maxStepsAtk": this.framesAtk.length,
                            "stepAtk": 0
                        };
                        this.state = {
                            "isInDangerZone": false,
                            "speed": 0,
                        };
                        this.destinationFrameR = {
                            "dx": game.app.width / 2,
                            "dy": game.app.height -36,
                            "dw": 30,
                            "dh": 44
                        };
                        this.destinationFrameL = {
                            "dx": game.app.width / 2,
                            "dy": game.app.height -36,
                            "dw": 30,
                            "dh": 44
                        };
                        this.destinationFrameIddle = {
                            "dx": game.app.width / 2,
                            "dy": game.app.height -36,
                            "dw": 26,
                            "dh": 44
                        };
                        // this.destinationFrameJump = {
                        //     "dx": game.app.width / 2,
                        //     "dw": 37,
                        //     "dh": 42
                        // };
                        this.destinationFrameAtk = {
                            "dx":game.app.width / 2,
                            "dy": game.app.height -36,
                            "dh": 44
                        };
                    },
                    "drawR": function( iStep ) {
                        var oContext = game.app.context,
                            oFrom = this.framesR[ iStep ],
                            oDest = this.destinationFrameR;

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
                    "drawL": function( iStep ) {
                        var oContext = game.app.context,
                            oFrom = this.framesL[ iStep ],
                            oDest = this.destinationFrameL;

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
                    "drawIddleR":function ( iStep ) {
                        var oContext = game.app.context,
                            oFrom = this.framesIddleR[ iStep ],
                            oDest = this.destinationFrameIddle;

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
                    "drawIddleL":function ( iStep ) {
                        var oContext = game.app.context,
                            oFrom = this.framesIddleL[ iStep ],
                            oDest = this.destinationFrameIddle;

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
                    // "drawJumpR":function ( iStep ) {
                    //     var oContext = game.app.context,
                    //         oFrom = this.framesJumpR[ iStep ],
                    //         oDest = this.destinationFrameJump;
                    //
                    //     oContext.save();
                    //     oContext.translate( oDest.dx, oDest.dy );
                    //     oContext.drawImage(
                    //         game.CharacterSprite,
                    //         oFrom.sx,
                    //         oFrom.sy,
                    //         oFrom.sw,
                    //         oFrom.sh,
                    //         oDest.dw / 2 * -1,
                    //         oDest.dh / 2 * -1,
                    //         oDest.dw,
                    //         oDest.dh
                    //     );
                    //     oContext.restore();
                    // },
                    "drawAtk":function ( iStep ) {
                        var oContext = game.app.context,
                            oFrom = this.framesAtk[ iStep ],
                            oDest = this.destinationFrameAtk;

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
                    }
                    // "update": function( oEvent ) {
                    //     var self = this;
                    //
                    //     // handle event. we ensure that the sended event is the good one.
                    //     // if ( oEvent ) {
                    //     //     if ( ( oEvent.type === "keydown" && oEvent.keyCode === 68 ) || ( oEvent.type === "keydown" && oEvent.keyCode === 39 ) ) {
                    //     //         game.char.animation.movingR=true;
                    //     //     } else {
                    //     //         return;
                    //     //     }
                    //     // }else if ( ( oEvent.type === "keyup" && oEvent.keyCode === 68 ) || ( oEvent.type === "keyup" && oEvent.keyCode === 39 ) ) {
                    //     //     game.char.animation.movingR=false;
                    //     // } else {
                    //     //     return;
                    //     // }
                    //
                    // }
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
        this._drawTitleFromFrame = function( oFrame ) {
            this.app.context.drawImage(
                this.Title,
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
        this._drawGameoverFromFrame = function( oFrame ) {
            this.app.context.drawImage(
                this.GameOver,
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

        this._drawHudFromFrame = function( oFrame, iNewDx ) {
            var iDx;

            if ( iNewDx == null ) {
                iDx = oFrame.dx;
            } else {
                iDx = iNewDx;
            }
            this.app.context.drawImage(
                this.Hud,
                oFrame.sx,
                oFrame.sy,
                oFrame.sw,
                oFrame.sh,
                iDx,
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
            //launch music/animation if game is started
            if (game.started) {
                //stop IntroMusic
                // IntroMusic.src="";
                IntroMusic.pause();
                IntroMusic.currentTime = 0.0;
                //game music
                GameMusic.play();
                GameMusic.volume = 0.2;
            }

            //Char movement
            if (movingR===true) {
                // draw & animate: background
                this.sky.update();
                this.city.update();
                this.building.update();
                // draw & animate: ground
                this.ground.update();
                // draw & animate: character
                if ( this.time.current - this.time.start > 50 ) {
                    this.time.start = Date.now();
                    ( ++this.char.animationR.stepR < this.char.animationR.maxStepsR ) || ( this.char.animationR.stepR = 0 );
                }
                this.char.drawR( this.char.animationR.stepR );

            }
            if (movingL===true) {
                // draw & animate: background
                this.sky.updateL();
                this.city.updateL();
                this.building.updateL();
                // draw & animate: ground
                this.ground.updateL();
                // draw & animate: character
                // this.char.update();
                if ( this.time.current - this.time.start > 50 ) {
                    this.time.start = Date.now();
                    ( ++this.char.animationL.stepL < this.char.animationL.maxStepsL ) || ( this.char.animationL.stepL = 0 );
                }
                this.char.drawL( this.char.animationL.stepL );

            }
            if(direction===2 && (movingL===false && movingR===false && jump === false)){
                // draw: background
                this.sky.draw();
                this.city.draw();
                this.building.draw();
                // draw & animate: ground
                this.ground.draw();
                if ( this.time.current - this.time.start > 150 ) {
                    this.time.start = Date.now();
                    ( ++this.char.animationIddle.stepIddle < this.char.animationIddle.maxStepIddle ) || ( this.char.animationIddle.stepIddle = 0 );
                }
                this.char.drawIddleL( this.char.animationIddle.stepIddle );

            }
            if(direction===1 && (movingL===false && movingR===false && jump === false)){
                // draw: background
                this.sky.draw();
                this.city.draw();
                this.building.draw();
                // draw & animate: ground
                this.ground.draw();
                if ( this.time.current - this.time.start > 150 ) {
                    this.time.start = Date.now();
                    ( ++this.char.animationIddle.stepIddle < this.char.animationIddle.maxStepIddle ) || ( this.char.animationIddle.stepIddle = 0 );
                }
                this.char.drawIddleR( this.char.animationIddle.stepIddle );

            }
            // if(direction===1 && jump === true){
            //     // draw: background
            //     this.sky.update();
            //     this.city.update();
            //     this.building.update();
            //     // draw & animate: ground
            //     this.ground.update();
            //     if ( this.time.current - this.time.start > 150 ) {
            //         this.time.start = Date.now();
            //         ( ++this.char.animationJump.stepJump < this.char.animationJump.maxStepJump );
            //     }
            //     this.char.drawJumpR( this.char.animationJump.stepJump );
            // }

            //draw hud
            this.hud.draw();
            if (game.hp === 0){
                game.over();
            }
            if ( !game.started && !game.failed) {
                this.starting.draw();
            }


        };

        // Game over
        this.over = function() {
            this.started = false;
            this.failed =true;
            window.cancelAnimationFrame( this.animationRequestID );
            // window.alert( "GameOver" );
            game.overScreen.draw();
            // stop game music
            GameMusic.pause();
            GameMusic.currentTime = 0.0;
            // launch game over sound
            GameOverMusic.play();
            GameOverMusic.volume = 0.5;

        };



        // Init game
        this.start = function() {
            // declare click & keyup events
            if ( !this.eventsSetted ) { // we need to be sure to listen to events only once. we use a boolean to do it.
                window.addEventListener('keydown',doKeyDown,true);
                window.addEventListener('keyup',doKeyUp,true);
                this.eventsSetted = true;
            }
            //Assign audio to Music
            this.IntroMusic = document.getElementById("IntroMusic");
            this.GameOverMusic = document.getElementById("GameOverMusic");; //Game Over sound efx
            this.GameMusic = document.getElementById("GameMusic"); //Game music
            // reset some variables
            this.hp = 10;
            this.started = false;
            this.failed = false;
            this.ended = false;
            this.char.init();
            this.zombie.init();
            this.hud.init();
            this.time.start = Date.now();

            //launch Music
            if (!game.started) {
                GameOverMusic.pause();
                GameOverMusic.currentTime = 0.0;

                IntroMusic.play();
                IntroMusic.volume = 0.5;
            }

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
        this.Title = new Image();
        this.Title.addEventListener( "load", this.start.bind( this ) );
        this.Title.src = "./resources/Title.png";
        this.zombieSprite = new Image();
        this.zombieSprite.addEventListener( "load", this.start.bind( this ) );
        this.zombieSprite.src = "./resources/zombie.png";
        this.IntroBackgr = new Image();
        this.IntroBackgr.addEventListener( "load", this.start.bind( this ) );
        this.IntroBackgr.src = "./resources/Intro.jpg";
        this.Hud = new Image();
        this.Hud.addEventListener( "load", this.start.bind( this ) );
        this.Hud.src = "./resources/hud.png";
        this.GameOver = new Image();
        this.GameOver.addEventListener( "load", this.start.bind( this ) );
        this.GameOver.src = "./resources/GameOver.png";
    };

    window.Castle = Castle;

} )();
