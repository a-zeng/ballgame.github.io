// Initialize Phaser, and create a 800px by 600px game
var game = new Phaser.Game(800, 600, Phaser.AUTO, "game");

// Creates the global variables
var score = 0;
var bestScore = 0;
var ballVelocityRefresh = 0;
var ballSpawnRefresh = 0;
var ballSpawnTimer = 0;
var healthSpawnTimer = 0;
var healthSpawnDelay = 7000;
var randomDelay = 0;
var one = 1;
    // Variables that indicate buttonPresses
var var1 = 0;
var var2 = 0;
var var3 = 0;
var var4 = 0;

var pressCooldown = 100;


var splashState = {
    
    preload: function() { 
        // Sets the stage background color
        game.stage.backgroundColor = '#71c5cf';
        
        // state the title
        this.labelGameName = game.add.text(240, 110, "Ball Game", { font: "72px Times New Roman", fill: "#ed0a0a" });
        
        // Writes "Press SPACEBAR to start"
        this.labelGameStart = game.add.text(210, 510, "Press SPACEBAR to start", { font: "36px Times New Roman", fill: "#ffffff"});
        
        // Writes "Press SPACEBAR to start"
        this.labelGameStart = game.add.text(90, 460, "Press SHIFT to see controls and directions", { font: "36px Times New Roman", fill: "#ffffff"});
        
        
    },

    create: function() {     
            
        // Starts the game if spacebar is pressed
        var spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceBar.onDown.add(this.start, this);
        
        // Opens the controls and directions when pressed
        var shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        shift.onDown.add(this.controls, this);
        
        // Calls the debug function when 0 is pressed
        var zero = game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
        zero.onDown.add(this.debug, this);
    },
            
    start: function() {
        // Adds times before each refresh timer begins
        ballSpawnTimer = game.time.now + 3000;
        ballSpawnRefresh = game.time.now + 10000;
        ballVelocityRefresh = game.time.now + 5000;
        
        healthSpawnTimer = game.time.now + healthSpawnDelay;
        
        // Switches game state to main
        game.state.start('main'); 
    },
    
    debug: function() {
        // Switches the game state to game over state
        game.state.start('gameOver');
    },
    
    controls: function() {
        // Switches the game state to the controls state
        game.state.start('control');
    },
};

var mainState = {
    
    preload: function() { 
        
        // Loading the images
        game.load.image('box', 'img/commandBox.png')
        game.load.image('divider','img/dividerLine.png');
        game.load.image('dividerHalf', 'img/dividerLineHalf.png');
        game.load.image('ball', 'img/redBall.png');
        game.load.image('uiBox', 'img/uiBox.png');
        game.load.image('health', 'img/health.png');

    },

    create: function() { 
        // Change the background color of the game to blue
        game.stage.backgroundColor = "#71c5cf"
        
        // Sets the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Draw the boxes and add properties to them
        this.boxes = game.add.group();
        
        this.box1 = game.add.sprite(0, 400, 'box');
        this.box2 = game.add.sprite(200, 400, 'box');
        this.box3 = game.add.sprite(400, 400, 'box');
        this.box4 = game.add.sprite(600, 400, 'box');
        
        this.boxes.add(this.box1);
        this.boxes.add(this.box2);
        this.boxes.add(this.box3);
        this.boxes.add(this.box4);
        
        game.physics.arcade.enable(this.box1);
        game.physics.arcade.enable(this.box2);
        game.physics.arcade.enable(this.box3);
        game.physics.arcade.enable(this.box4);
        
        // Draw the divider lines and add properties to them
        this.dividers = game.add.group();
        
        for(i = 0; i < 4; i++) {
            this.divider = game.add.sprite(-5 + (i * 200), 0, 'divider');
        }
        this.divider = game.add.sprite(0, 0, 'divider');
        this.divider = game.add.sprite(790, 0, 'divider');
        
        this.dividers.add(this.divider);
        
        
        // Draws the UI Box and add properties
        this.uiBoxes = game.add.group();
        var uiBox = game.add.sprite(0, 490, 'uiBox');
        game.physics.arcade.enable(uiBox);
        this.uiBoxes.add(uiBox);
        
        // Draws the numbers for corresponding boxes
        this.one = game.add.text(90, 435, "1", { font: "30px Times New Roman", fill: "#000000"});
        this.two = game.add.text(290, 435, "2", { font: "30px Times New Roman", fill: "#000000"});
        this.three = game.add.text(490, 435, "3", { font: "30px Times New Roman", fill: "#000000"});
        this.four = game.add.text(690, 435, "4", { font: "30px Times New Roman", fill: "#000000"});
        
        // Keep the score and write it on the screen
        this.labelScore = game.add.text(30, 515, "Score: 0" , { font: "30px Times New Roman", fill: "#000000" }); 
        // Creates a best score
        this.labelBestScore = game.add.text(30, 545, "High Score: " + bestScore, { font: "30px Times New Roman", fill: "#000000" });
        
        // Creates the player's health
        this.playerHealth = 5;
        this.labelPlayerHealth = game.add.text(270, 530, "Health: " + this.playerHealth, { font: "30px Times New Roman", fill: "#ed0a0a" });
        
        // Add the ball group
        this.balls = game.add.group();
        
        // Add the health pack group
        this.health = game.add.group();
        
        // Assigning buttons to their corresponding functions
        var buttonOne = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        buttonOne.onDown.add(this.onDownOne, this);
        var buttonTwo = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        buttonTwo.onDown.add(this.onDownTwo, this);
        var buttonThree = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        buttonThree.onDown.add(this.onDownThree, this);
        var buttonFour = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        buttonFour.onDown.add(this.onDownFour, this);
        
        // Adds the cooldown timers for the buttons
        this.refreshOne = 0;
        this.refreshTwo = 0;
        this.refreshThree = 0;
        this.refreshFour = 0;
        
        // Adds the fall velocity of the balls
        this.fallVelocity = 200;
        
        // Adds the ball spawn rate
        this.spawnRate = 1500;
        
        // Creates text for the ball velocity and spawn rate
        this.labelSpawnRate = game.add.text(510, 545, "Spawn Rate: " + this.spawnRate, { font: "30px Times New Roman", fill: "#000000" }); 
        this.labelBallVelocity = game.add.text(510, 515, "Ball Velocity: " + this.fallVelocity, { font: "30px Times New Roman", fill: "#000000" });
        
//        this.labelRandom = game.add.text(0, 490, randomDelay, { font: "30px Times New Roman", fill: "#000000" })
        
    },
    
    // Functions that control the ball drops and their locations
    dropBallLocation: function() {
        var i = Math.ceil(Math.random() * 4);
        this.dropOneBall(-115 + (i * 200), 0); 
    },               
    dropOneBall: function(xcoord, ycoord) {
        var ball = game.add.sprite(xcoord, ycoord, 'ball');
        game.physics.arcade.enable(ball);
        ball.body.velocity.y = this.fallVelocity;
        this.balls.add(ball);
    },
    
    // Functions that control the health drops and locations
    dropHealthLocation: function() {
        var i = Math.ceil(Math.random() * 4);
        this.dropHealth(-115 + (i * 200), 0);
    },
    dropHealth: function(xcoord, ycoord) {
        var health = game.add.sprite(xcoord, ycoord, 'health');
        game.physics.arcade.enable(health);
        health.body.velocity.y = this.fallVelocity;
        this.health.add(health);
    },
    
    // Function for when the ball touches the uiBox
    damageBall: function(ball, uiBox) {
        "use strict";
        this.playerHealth -= 1;
        this.labelPlayerHealth.text = "Health: " + this.playerHealth;
        ball.destroy();
    },
    
    // Function for when the health touches the uiBox
    gainHealth: function(health, uiBox) {
        "use strict";
        this.playerHealth += 1;
        this.labelPlayerHealth.text = "Health: " + this.playerHealth;
        health.destroy();
    },
    
    // Functions for box and ball collisions
    buttonBoxOne: function(box1, ball) {
        "use strict";
        score += 10;
        this.labelScore.text = "Score: " + score;
        ball.destroy();
    },
    buttonBoxTwo: function(box2, ball) {
        "use strict";
        score += 10;
        this.labelScore.text = "Score: " + score;
        ball.destroy();
    },
    buttonBoxThree: function(box3, ball) {
        "use strict";
        score += 10;
        this.labelScore.text = "Score: " + score;
        ball.destroy();
    },
    buttonBoxFour: function(box4, ball) {
        "use strict";
        score += 10;
        this.labelScore.text = "Score: " + score;
        ball.destroy();
    },
        
    // Functions for box and health collisions
    buttonBoxOneHealth: function(box1, health) {
        "use strict";
        score -= 50;
        this.labelScore.text = "Score: " + score;
        health.destroy();
    },
    buttonBoxTwoHealth: function(box2, health) {
        "use strict";
        score -= 50;
        this.labelScore.text = "Score: " + score;
        health.destroy();
    },
    buttonBoxThreeHealth: function(box3, health) {
        "use strict";
        score -= 50;
        this.labelScore.text = "Score: " + score;
        health.destroy();
    },
    buttonBoxFourHealth: function(box4, health) {
        "use strict";
        score -= 50;
        this.labelScore.text = "Score: " + score;
        health.destroy();
    },
    
    
    // Functions that set values of button presses to one, indicating a button press and setting a cooldown to prevent rapid button pressing (vague description)
    onDownOne: function() {
        if (game.time.now > this.refreshOne) {
            "use strict";
            var1 += 1; 
            this.refreshOne = game.time.now + pressCooldown;
        }
    },
    onDownTwo: function() {
        if (game.time.now > this.refreshTwo) {
            "use strict";
            var2 += 1;
            this.refreshTwo = game.time.now + pressCooldown;
        }
    },
    onDownThree: function() {
        if (game.time.now > this.refreshThree) {
            "use strict";
            var3 += 1;  
            this.refreshThree = game.time.now + pressCooldown;
        }
    },
    onDownFour: function() {
        if (game.time.now > this.refreshFour) {
            "use strict";
            var4 += 1;
            this.refreshFour = game.time.now + pressCooldown;
        }
    }, 
    
    // Update function
	update: function() {
        
        // Statements that continue from the button press system
        // These statements allow the buttonBox functions to be executed and need to be in the update function
        if (var1 >= 1) {
            game.physics.arcade.overlap(this.balls, this.box1, this.buttonBoxOne, null, this);
            game.physics.arcade.overlap(this.health, this.box1, this.buttonBoxOneHealth, null, this);
            this.one.setStyle({ font: "30px Times New Roman", fill: '#ffba00'});
            var1 = 0;
        } else if (game.time.now + 10 < this.refreshOne) {    
            this.one.setStyle({ font: "30px Times New Roman", fill: '#ffba00'});
        } else {
            this.one.setStyle({ font: "30px Times New Roman", fill: '#000000'});
        }
        
        if (var2 >= 1) {
            game.physics.arcade.overlap(this.balls, this.box2, this.buttonBoxTwo, null, this);
            game.physics.arcade.overlap(this.health, this.box2, this.buttonBoxTwoHealth, null, this);
            this.two.setStyle({ font: "30px Times New Roman", fill: '#ffba00'}); 
            var2 = 0;
        } else if (game.time.now + 10 < this.refreshTwo) { 
            this.two.setStyle({ font: "30px Times New Roman", fill: '#ffba00'});
        } else {
            this.two.setStyle({ font: "30px Times New Roman", fill: '#000000'});
        }
        
        if (var3 >= 1) {
            game.physics.arcade.overlap(this.balls, this.box3, this.buttonBoxThree, null, this);
            game.physics.arcade.overlap(this.health, this.box3, this.buttonBoxThreeHealth, null, this);
            this.three.setStyle({ font: "30px Times New Roman", fill: '#ffba00'});
            var3 = 0;
        } else if (game.time.now + 10 < this.refreshThree) {
            this.three.setStyle({ font: "30px Times New Roman", fill: '#ffba00'});
        } else {
            this.three.setStyle({ font: "30px Times New Roman", fill: '#000000'});
        }
        
        if (var4 >= 1) {
            game.physics.arcade.overlap(this.balls, this.box4, this.buttonBoxFour, null, this);
            game.physics.arcade.overlap(this.health, this.box4, this.buttonBoxFourHealth, null, this);
            this.four.setStyle({ font: "30px Times New Roman", fill: '#ffba00'});
            var4 = 0;      
        } else if (game.time.now + 10 < this.refreshFour) {
            this.four.setStyle({ font: "30px Times New Roman", fill: '#ffba00'});
        } else {
            this.four.setStyle({ font: "30px Times New Roman", fill: '#000000'});
        }
        
        // Controls the ball collision damage mechanism
        game.physics.arcade.overlap(this.balls, this.uiBoxes, this.damageBall, null, this);
        
        // Controls the health gaining mechanism
        game.physics.arcade.overlap(this.health, this.uiBoxes, this.gainHealth, null, this);
        
        // Mechanism that controls the ball speedup
        if(game.time.now > ballVelocityRefresh) {
            this.fallVelocity += 20;
            ballVelocityRefresh = game.time.now + 2000;
            this.labelBallVelocity.text = "Ball Velocity: " + this.fallVelocity;
        }
        
        // Mechanism that increases the ball spawn rate
        if(game.time.now > ballSpawnRefresh && this.spawnRate > 500) {
            this.spawnRate -= 100;
            ballSpawnRefresh = game.time.now + 2500;
            this.labelSpawnRate.text = "Spawn Rate: " + this.spawnRate;
        }
        
        // Mechanism that shows switches to game over state if the player's health is less than 0
        if(this.playerHealth <= 0) {
            this.restartGame();
            game.time.now = 0;
        }
        
        // Every spawnRate, call the "dropBallLocation" function
        if(game.time.now > ballSpawnTimer) {
            this.dropBallLocation();
            ballSpawnTimer = game.time.now + this.spawnRate;
        }
        
        // Every random amount of time, drop a health pack
        if(game.time.now > healthSpawnTimer) {
            this.dropHealthLocation();
            randomDelay = Math.floor(Math.random() * 10000) + 3000;
//            this.labelRandom.text = randomDelay;
            healthSpawnTimer = game.time.now + randomDelay;
        }
        
        
	},
	
    restartGame: function() {
        // Replaces score with best score if score > the best score
        if (score > bestScore) {
            bestScore = score;
        }
        // Stops the music
//        this.music.stop();
        
        //  Switch to game over state
        game.state.start('gameOver');
        
    },
};

var gameOverState = {
    
    preload: function() { 
        // Sets the stage background color
        game.stage.backgroundColor = '#71c5cf';
        
        // States the state title
        this.labelGameOver = game.add.text(278, 230, "Game Over!", 
            { font: "50px Times New Roman", fill: "#ed0a0a" });
        
        // Writes "Press SPACEBAR to try again"
        this.labelGameTryAgain = game.add.text(180, 370, "Press SPACEBAR to try again", { font: "36px Times New Roman", fill: "#ffffff"});
        
        // Displays High Score and Current Score
        this.labelHighScore = game.add.text(317, 325, "High Score: " + bestScore, { font: "30px Times New Roman", fill: "#000000" });
        this.labelCurrentScore = game.add.text(353, 290, "Score: " + score, { font: "30px Times New Roman", fill: "#000000" }); 
        
        // Starts the game if spacebar is pressed
        var spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceBar.onDown.add(this.start, this);
    },

    create: function() {     
        
        // Starts the game if spacebar is pressed
        var spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceBar.onDown.add(this.start, this);
    },
            
    start: function() {
        // Switches game state to main
        ballSpawnTimer = game.time.now + 3000;
        ballSpawnRefresh = game.time.now + 10000;
        ballVelocityRefresh = game.time.now + 5000;
        healthSpawnTimer = game.time.now + healthSpawnDelay;
        score = 0;
        game.state.start('main'); 
    },
    
};

var controlState = {
    
    preload: function() {
        // Sets the stage background color
        game.stage.backgroundColor = '#71c5cf';
        
        // Load the demo images
        game.load.image('ball', 'img/redBall.png');
        game.load.image('health', 'img/health.png');
            
    },
    create: function() {
        // States the state title
        this.labelGameOver = game.add.text(170, 50, "Controls and Directions", 
            { font: "50px Times New Roman", fill: "#ff0000" });
        
        // Variables for spacing
        var directionsSpacing = 510;
        
        var textBeginY = 140;
        var textGapY = 30;
        var textStart = textBeginY + textGapY;
        var textSpacingY = 30;
        
        // Writes the controls
        this.labelControl = game.add.text(120, textBeginY, "Controls:", { font: "30px Times New Roman", fill: "#000000"});
        
        this.label1 = game.add.text(20, textStart + textGapY + (1 * textSpacingY), "Press 1 to remove things from the first box", { font: "18px Times New Roman", fill: "#000000"});
        this.label2 = game.add.text(20, textStart + textGapY + (2 * textSpacingY), "Press 2 to remove things from the second box", { font: "18px Times New Roman", fill: "#000000"});
        this.label3 = game.add.text(20, textStart + textGapY + (3 * textSpacingY), "Press 3 to remove things from the third box", { font: "18px Times New Roman", fill: "#000000"});
        this.label4 = game.add.text(20, textStart + textGapY + (4 * textSpacingY), "Press 4 to remove things from the fourth box", { font: "18px Times New Roman", fill: "#000000"});
        
        // Writes the directions
        this.labelDirections = game.add.text(520, textBeginY, "Directions:", { font: "30px Times New Roman", fill: "#000000"});
        this.labelInstructionsBall = game.add.text(directionsSpacing, textStart + (1 * textSpacingY), "This is a ball.", { font: "18px Times New Roman", fill: "#000000"});
        this.labelInstructionsBall = game.add.text(directionsSpacing, textStart + (textSpacingY) + 20, "Press the corresponding key to", { font: "18px Times New Roman", fill: "#000000"});
        this.labelInstructionsBall = game.add.text(directionsSpacing, textStart + (textSpacingY) + 40, "remove it from the box and gain 10", { font: "18px Times New Roman", fill: "#000000"});
        this.labelInstructionsBall = game.add.text(directionsSpacing, textStart + (textSpacingY) + 60, "points. If you don't, you will lose", { font: "18px Times New Roman", fill: "#000000"});
        this.labelInstructionsBall = game.add.text(directionsSpacing - 1, textStart + (textSpacingY) + 80, "1 HP", { font: "18px Times New Roman", fill: "#000000"});
        
        this.labelInstructionsHealth = game.add.text(directionsSpacing, textStart + (textSpacingY) + 120, "This is a health pack.", { font: "18px Times New Roman", fill: "#000000"});
        this.labelInstructionsHealth = game.add.text(directionsSpacing, textStart + (textSpacingY) + 140, "Let these pass by and you will", { font: "18px Times New Roman", fill: "#000000"});
        this.labelInstructionsHealth = game.add.text(directionsSpacing, textStart + (textSpacingY) + 160, "regain 1 HP. Do not destory these", { font: "18px Times New Roman", fill: "#000000"});
        this.labelInstructionsHealth = game.add.text(directionsSpacing, textStart + (textSpacingY) + 180, "or else you will lose 50 points.", { font: "18px Times New Roman", fill: "#000000"});
        
        this.labelHPInstruction = game.add.text(205, 440, "You lose if your health becomes 0 or less", { font: "24px Times New Roman", fill: "#000000"});
        
        // Draw the ball and health
        ballSprite = game.add.sprite(directionsSpacing - 55, textStart + (textSpacingY) + 40, 'ball');
        healthSprite = game.add.sprite(directionsSpacing - 55, textStart + (textSpacingY) + 150, 'health');
        
        // Writes the return to splash text
        this.labelReturnSplash = game.add.text(70, 510, "Press SPACEBAR to return to the main menu", { font: "36px Times New Roman", fill: "#ffffff"});
        
        // Returns to the splash state when the spacebar is pressed
        var spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceBar.onDown.add(this.start, this);
    },
    start: function() {
        game.state.start('splash');
    },
    
}; 

// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.add('splash', splashState);
game.state.add('gameOver', gameOverState);
game.state.add('control', controlState);
game.state.start('splash'); 