( function() {
    "use strict";

    var Castle,
        direction = 1, // 1 = right, 2 = left
        movingL = false,
        movingR = false,
        jump = false,
        atk = false,
        shot=false,
        enemydead=false,
        enemyhit=false
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
                if ( game.started ) {
                    if(!atk){
                        movingL=true;
                        direction = 2;
                    }
                }
                break;
            case 39:  /* Right arrow was pressed */
                if ( game.started ) {
                    if(!atk){
                        movingR=true;
                        direction = 1;
                    }
                }
                break;
            case 32: /* space was pressed */
                if ( game.started ) {

                    gunshot.volume = 0.3;
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
        this.timeZombie = {
            "start": null,
            "current": null,
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
        // score
        this.scorescreen = {
            "frames": {
                "cyphers": {
                    "sy": 67,
                    "sw": 6,
                    "sh": 8,
                    "sx": {
                        "0": 46,
                        "1": 53,
                        "2": 59,
                        "3": 66,
                        "4": 73,
                        "5": 81,
                        "6": 87,
                        "7": 94,
                        "8": 101,
                        "9": 108
                    }
                }
            },
            "drawScore": function( iScore ) {
                var aScoreParts = ( iScore + "" ).split( "" ),
                    self = this;

                // drawing score
                aScoreParts.reverse().forEach( function( sScorePart, iIndex ) {
                    var iDx = game.app.width / 2 + 91 - self.frames.cyphers.sw;

                    game._drawBulletFromFrame( {
                        "sx": self.frames.cyphers.sx[ sScorePart ],
                        "sy": self.frames.cyphers.sy,
                        "sw": self.frames.cyphers.sw,
                        "sh": self.frames.cyphers.sh,
                        "dx": iDx - ( iIndex * ( self.frames.cyphers.sw + 2 ) ),
                        "dy": 20,
                        "dw": self.frames.cyphers.sw,
                        "dh": self.frames.cyphers.sh
                    } );
                } );
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
            "speed": 0.7,
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
            "speed": 0.7,
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
                    "dx": 530,
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
                this.destinationFrameZ.dx-=0.03;
                if (movingR===true && !atk) {
                    this.destinationFrameZ.dx-=0.7;
                }
                if (movingL===true && !atk) {
                    this.destinationFrameZ.dx+=0.7;
                }
                //zombie
                if ( game.timeZombie.current - game.timeZombie.start > 100 ) {
                    game.timeZombie.start = Date.now();
                    ( ++game.zombie.animation.step < game.zombie.animation.maxSteps ) || ( game.zombie.animation.step = 0 );
                }
                game.zombie.drawZombie(game.zombie.animation.step);

                        // console.log(game.zombie.destinationFrameZ.dx);


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
                        { // holster out
                            "sx": 551,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 494,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44

                        },
                        {
                            "sx": 443,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 395,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 345,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 291,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        { //shoot
                            "sx": 7,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 63,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 114,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 180,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 233,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        { // holster in
                            "sx": 291,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 345,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44

                        },
                        {
                            "sx": 395,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 443,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 494,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 551,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        }

                    ],
                    "framesAtkL":[
                        { // holster out
                            "sx": 773,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 830,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44

                        },
                        {
                            "sx": 881,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 929,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 979,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 1033,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        { //shoot
                            "sx": 1317,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 1261,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 1210,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 1144,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 1091,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        { // holster in
                            "sx": 1033,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 979,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44

                        },
                        {
                            "sx": 929,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 881,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 830,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
                        },
                        {
                            "sx": 773,
                            "sy": 1417,
                            "sw": 45,
                            "sh": 44
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
                            "dx":(game.app.width + 36) / 2,
                            "dy": game.app.height -36,
                            "dw": 45,
                            "dh": 44
                        };
                        this.destinationFrameAtkL = {
                            "dx":(game.app.width -36) / 2,
                            "dy": game.app.height -36,
                            "dw": 45,
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
                    },
                    "drawAtkL":function ( iStep ) {
                        var oContext = game.app.context,
                            oFrom = this.framesAtkL[ iStep ],
                            oDest = this.destinationFrameAtkL;

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
                        //Char movement
                        if (movingR && !atk) {
                            // draw & animate: character
                            if ( game.time.current - game.time.start > 50 ) {
                                game.time.start = Date.now();
                                ( ++game.char.animationR.stepR < game.char.animationR.maxStepsR ) || ( game.char.animationR.stepR = 0 );
                            }
                            game.char.drawR( game.char.animationR.stepR );

                        }
                        if (movingL && !atk) {
                            // draw & animate: character
                            if ( game.time.current - game.time.start > 50 ) {
                                game.time.start = Date.now();
                                ( ++game.char.animationL.stepL < game.char.animationL.maxStepsL ) || ( game.char.animationL.stepL = 0 );
                            }
                            game.char.drawL( game.char.animationL.stepL );

                        }
                        if(direction===2 && !atk && ( !movingL && !movingR && !jump ) ){
                            if ( game.time.current - game.time.start > 150 ) {
                                game.time.start = Date.now();
                                ( ++game.char.animationIddle.stepIddle < game.char.animationIddle.maxStepIddle ) || ( game.char.animationIddle.stepIddle = 0 );
                            }
                            game.char.drawIddleL( game.char.animationIddle.stepIddle );

                        }
                        if(direction===1 && !atk && ( !movingL && !movingR && !jump ) ){
                            if ( game.time.current - game.time.start > 150 ) {
                                game.time.start = Date.now();
                                ( ++game.char.animationIddle.stepIddle < game.char.animationIddle.maxStepIddle ) || ( game.char.animationIddle.stepIddle = 0 );
                            }
                            game.char.drawIddleR( game.char.animationIddle.stepIddle );
                        }
                        if(direction===1 && atk){
                            if ( game.time.current - game.time.start > 70 ) {
                                game.time.start = Date.now();
                                ( ++game.char.animationAtk.stepAtk < game.char.animationAtk.maxStepsAtk );
                            }
                            game.char.drawAtk( game.char.animationAtk.stepAtk );
                            if (game.char.animationAtk.stepAtk === (game.char.animationAtk.maxStepsAtk-1)) {
                                atk = false;
                                game.char.animationAtk.stepAtk=0;
                            }
                            if (game.char.animationAtk.stepAtk === 8) {
                                gunshot.play();
                                shot=true;
                            }
                        }
                        if(direction===2 && atk){
                            if ( game.time.current - game.time.start > 70 ) {
                                game.time.start = Date.now();
                                ( ++game.char.animationAtk.stepAtk < game.char.animationAtk.maxStepsAtk );
                            }
                            game.char.drawAtkL( game.char.animationAtk.stepAtk );
                            if (game.char.animationAtk.stepAtk === (game.char.animationAtk.maxStepsAtk-1)) {
                                atk = false;
                                game.char.animationAtk.stepAtk=0;
                                gunshot.pause();
                                gunshot.currentTime = 0.0;

                            }
                            if (game.char.animationAtk.stepAtk === 8) {
                                gunshot.play();
                                shot=true;
                            }
                        }
                        if(direction===1 && shot && !enemyhit){
                            game.bullet.update();
                        }
                        if(direction===2 && shot && !enemyhit){
                            game.bullet.updateL();
                        }
                        //hitzones

                        if (((game.char.destinationFrameR.dx||game.char.destinationFrameAtk.dx||game.char.destinationFrameL.dx||game.char.destinationFrameIddle.dx)+26) >= game.zombie.destinationFrameZ.dx ){
                            game.hp = game.hp - game.damage;

                            for (var i = 0; i < 50; i++) {
                                game.zombie.destinationFrameZ.dx+=1;
                                game.sky.updateL();
                                game.city.updateL();
                                game.building.updateL();
                                // draw & animate: ground
                                game.ground.updateL();
                            }
                        }
                        if(shot && ((game.bullet.frame.dx + 11)>=game.zombie.destinationFrameZ.dx)){
                            game.enemyHp = game.enemyHp - 1;
                            enemyhit = true;
                        }
                        if (enemyhit) {
                            game.bullet.init();
                            enemyhit=false;
                            shot=false;
                        }

                    }

                };

        // bullet
        this.bullet = {
            "frame": {
                    "sx": 154,
                    "sy": 74,
                    "sw": 11,
                    "sh": 4,
                    "dx": ((game.app.width + 36)/ 2),
                    "dy": (game.app.height -55),
                    "dw": 11,
                    "dh": 4
            },
            "frameL": {
                    "sx": 202,
                    "sy": 74,
                    "sw": 11,
                    "sh": 4,
                    "dx": (((game.app.width - 36)-11)/ 2),
                    "dy": (game.app.height -55),
                    "dw": 11,
                    "dh": 4
            },
            "speed": 2,
            "maxOffset": game.app.width,
            "init": function () {
                this.frame.dx=((game.app.width + 36)/ 2);
            },
            "draw": function() {
                game._drawBulletFromFrame( this.frame );
            },
            "drawL": function() {
                game._drawBulletFromFrame( this.frameL );
            },
            "update": function() {
                if ( this.frame.dx >= this.maxOffset) {
                    shot=false;
                    game.bullet.init();
                }
                this.frame.dx += this.speed;
                this.draw();
            },
            "updateL": function() {
                if ( this.frameL.dx <= 0 ) {
                    shot=false;
                    this.frameL.dx=(((game.app.width - 36)-11)/ 2);
                }
                this.frameL.dx -= this.speed;
                this.drawL();
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
        this._drawBulletFromFrame = function( oFrame ) {
            this.app.context.drawImage(
                this.Hud,
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
            this.timeZombie.current = Date.now();
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
                if( !movingL && !movingR && !jump ){
                    // draw: background
                    this.sky.draw();
                    this.city.draw();
                    this.building.draw();
                    // draw & animate: ground
                    this.ground.draw();
                }
                if (movingR && !atk) {
                    // draw & animate: background
                    this.sky.update();
                    this.city.update();
                    this.building.update();
                    // draw & animate: ground
                    this.ground.update();
                }
                if (movingL && !atk) {
                    // draw & animate: background
                    this.sky.updateL();
                    this.city.updateL();
                    this.building.updateL();
                    // draw & animate: ground
                    this.ground.updateL();
                }
                //draw: char
                this.char.update();

                //draw hud
                this.hud.draw();
                game.scorescreen.drawScore( game.score );
                game.zombie.update();
                if (this.enemyHp <= 0) {
                    enemydead=true;
                }
                if (enemydead) {
                    game.zombie.init();
                    this.difficulty = this.difficulty + 5;
                    this.damage = this.damage + 1;
                    this.enemyHp = this.difficulty;
                    this.score = this.score+10;
                    enemydead=false;
                }

            }

            if (game.hp <= 0){
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
            // window.cancelAnimationFrame( this.animationRequestID );
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

            // sound efx

            this.gunshot = document.getElementById("gunshot"); //gunshot

            // reset some variables
            this.hp = 10;
            this.enemyHp = 5;
            this.difficulty=5;
            this.damage=1;
            this.started = false;
            this.failed = false;
            this.ended = false;
            this.char.init();
            this.bullet.init();
            this.zombie.init();
            this.hud.init();
            this.score=0;
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
