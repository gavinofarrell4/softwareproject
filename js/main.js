// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
	
	//player parameters
	this.playerSpeed = 150;
	this.jumpSpeed = -600;
	
	//music
	var footsteps;
		
};

// load asset files for our game
gameScene.preload = function() {

  // load images#
  /*this.load.image('soundon', 'assets/images/soundon.png');
  this.load.image('soundoff', 'assets/images/soundoff.png');*/
  this.load.image('arrowRight', 'assets/images/arrowRight.png');
  this.load.image('arrowLeft', 'assets/images/arrowLeft.png');
  this.load.image('arrowUp', 'assets/images/arrowUp.png');
  this.load.image('background', 'assets/images/background.jpg')
  this.load.image('ground', 'assets/images/ground.png');
  this.load.image('platform', 'assets/images/platform.png');
  this.load.image('block', 'assets/images/block.png');
  this.load.image('goal', 'assets/images/Enemy.png');
  this.load.image('barrel', 'assets/images/obstacle.png');
  
  // load spritesheets
  this.load.spritesheet('player', 'assets/images/player_spritesheet.png', {
    frameWidth: 28,
    frameHeight: 30,
    margin: 1,
    spacing: 1
  });

  this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', {
    frameWidth: 20,
    frameHeight: 21,
    margin: 1,
    spacing: 1
  });
	
	this.load.json('levelData', 'assets/json/levelData.json');
	
	//loading audio
	this.load.audio('jump', ['assets/audio/jump.mp3']);
};

// executed once, after assets were loaded
gameScene.create = function() {
	
	this.bg = this.add.sprite(180, 300, 'background');
	
	/*this.soundOn = this.add.sprite(280, 20, 'soundon');
	
	this.soundOn.setScrollFactor(0);
	
	this.soundOn.setDepth(1);
	
	this.soundOff = this.add.sprite(335, 20, 'soundoff');
	
	this.soundOff.setScrollFactor(0);
	
	this.soundOff.setDepth(1);
	
	*/
	//add audio
	jump = this.sound.add('jump');
	
	
	
	
	this.arrowRight = this.add.sprite(300, 541, 'arrowRight');
	
	this.arrowRight.setScrollFactor(0);
	
	this.arrowRight.setDepth(1);
	
	this.arrowLeft = this.add.sprite(200, 541, 'arrowLeft');
	
	this.arrowLeft.setScrollFactor(0);
	
	this.arrowLeft.setDepth(1);
	
	this.arrowUp = this.add.sprite(250, 480, 'arrowUp');
	
	this.arrowUp.setScrollFactor(0);
	
	this.arrowUp.setDepth(1)
	
	
	this.arrowUp.setScrollFactor(0);
	
	//this.soundButton = this.game.add.button()
	
	//walking animation
	if(!this.anims.get('walking')){
	this.anims.create({
		key: 'walking',
		frames: this.anims.generateFrameNames('player', {	frames: [0, 1, 2]
			
		}),
		frameRate: 12,
		yoyo: true,
		repeat: -1
	});	
	}

		
	
	//fire animation
	if(!this.anims.get('burning')){
	this.anims.create({
		key: 'burning',
		frames: this.anims.generateFrameNames('fire', {	frames: [0, 1]
			
		}),
		frameRate: 4,
		repeat: -1	
	
	});
	}
	
	//add all level elements
	this.setupLevel1();
	
	//initiate barrel spawner
	this.setupSpawner();
	
	
	

	//background
	
	
	//collision detection
	this.physics.add.collider([this.player, this.goal, this.barrels], this.platforms);
	
	
	//overlap checks
	this.physics.add.overlap(this.player, [this.fires, this.goal, this.barrels], this.restartGame, null, this);
	
	//enable cursor keys
	this.cursors = this.input.keyboard.createCursorKeys();
	
	
	this.input.on('pointerdown', function(pointer){
		
	console.log(pointer.x, pointer.y);			  
	})

	
};

//execute on every frame
gameScene.update = function(){
	
	//are we on the ground?
	let onGround =  this.player.body.blocked.down ||
	this.player.body.touching.down;
	
	//console.log(this.input.activePointer);
	
	//moving to left
	if(this.input.activePointer.isDown && this.input.activePointer.downX >= 161 && this.input.activePointer.downX <= 236 && this.input.activePointer.downY >= 522  && this.input.activePointer.downY <= 556 ){
	this.player.body.setVelocityX(-this.playerSpeed );
	
		
	this.player.flipX = false;	
		
	if(onGround && !this.player.anims.isPlaying)	
	this.player.anims.play('walking');
		
		
	}
	
	//moving to right
	else if (this.input.activePointer.isDown && this.input.activePointer.downX >= 264 && this.input.activePointer.downX <= 335 && this.input.activePointer.downY >= 522  && this.input.activePointer.downY <= 556){
	this.player.body.setVelocityX(this.playerSpeed );
	
	
		
		
	this.player.flipX = true;
	
	if(onGround && !this.player.anims.isPlaying)
	this.player.anims.play('walking');
		
	
		
	}
	else{
		
		
		//make the player stop
		this.player.body.setVelocityX(0);
		
		//stop walking animation
		this.player.anims.stop('walking');
		
		//set default frame
		if(onGround)
		this.player.setFrame(3);
		
	}
	//handle jumping
	if(onGround && (this.input.activePointer.isDown && this.input.activePointer.downX >= 231 && this.input.activePointer.downX <= 270 && this.input.activePointer.downY >= 441  && this.input.activePointer.downY <= 516)){
		//give the player a valocity in Y
		this.player.body.setVelocityY(this.jumpSpeed);
		
		//stop the walking animation
		this.player.anims.stop('walking');
		
		
		//change frame
		this.player.setFrame(2);
	
	    jump.play();
	}
	
	//sound on
	/*if(this.input.activePointer.isDown && this.input.activePointer.downX >= 250 && this.input.activePointer.downX <= 302 && this.input.activePointer.downY >= 1  && this.input.activePointer.downY <= 35 ){
		
		jump.resume();
		
	}
	
	if(this.input.activePointer.isDown && this.input.activePointer.downX >= 314 && this.input.activePointer.downX <= 356 && this.input.activePointer.downY >= 1  && this.input.activePointer.downY <= 35 ){
		jump.stop();
	}
	*/
};

//setup up all the elements in the level
gameScene.setupLevel1 = function(){
	this.platforms = this.add.group();
	
	//load json data
	this.levelData = this.cache.json.get('levelData');
	
	//world bounds
	this.physics.world.bounds.width = this.levelData.world.width;
	this.physics.world.bounds.height = this.levelData.world.height;
	
	
	
	
	
	//create all the platforms
	this.platforms = this.physics.add.staticGroup();
	
	for(let i = 0; i < this.levelData.platforms.length; i++){
		let curr = this.levelData.platforms[i];
		
		let newObj;
		
	    //create object
		if(curr.numTiles == 1) {
			//create sprite
			newObj = this.add.sprite(curr.x, curr.y, curr.key).setOrigin(0);
		}
		else{
			//create tilesprite
			let width = this.textures.get(curr.key).get(0).width;
			let height = this.textures.get(curr.key).get(0).width;
			newObj = this.add.tileSprite(curr.x, curr.y, curr.numTiles * width, height , curr.key).setOrigin(0);
		}
		
		//enable physics
		this.physics.add.existing(newObj, true);
		
		//add to the group
		this.platforms.add(newObj);
	}
	
	//create all the fire
	this.fires = this.physics.add.group({
		allowGravity: false,
		immovable: true
	});
	
	for(let i = 0; i < this.levelData.fires.length; i++){
		let curr = this.levelData.fires[i];
		
		let newObj = this.add.sprite(curr.x, curr.y, 'fire').setOrigin(0);
		
		
		
		
		//play fire animation
		newObj.anims.play('burning');
		
		//add to the group
		this.fires.add(newObj);
		
	;
	}
	
	//for level creation
	this.input.on('drag', function(pointer, gameObject, dragX, dragY){
		gameObject.x= dragX;
		gameObject.y = dragY;
		
		console.log(dragX, dragY);
	});
	
	//player
	this.player = this.add.sprite(this.levelData.player.x, this.levelData.player.y, 'player', 3);
	
	this.physics.add.existing(this.player);
	
	//constraint player to the game bounds
	this.player.body.setCollideWorldBounds(true);
	
	//camera bounds
	this.cameras.main.setBounds(0, 0, this.levelData.world.width, this.levelData.world.height);
	this.cameras.main.startFollow(this.player);
	
	//goal
	this.goal = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal');
	
	this.physics.add.existing(this.goal);
	
	
};

//restart game (gameover + you win!)
gameScene.restartGame = function(){
	//fade out
	this.cameras.main.fade(500);
	
	//when fade out completes, restart scene
	this.cameras.main.on('camerafadeoutcomplete', function(){
		this.scene.restart();
		
	}, this);
};

//generation of barrels
gameScene.setupSpawner = function(){
	//barrel group
	this.barrels = this.physics.add.group({
		bounceY: 0.1,
		bounceX: 1,
		collideWorldBounds: true
	});
	
	//spawn barrels
	let spawningEvent = this.time.addEvent({
		delay: this.levelData.spawner.interval,
		loop: true,
		callbackScope: this,
		callback: function(){
			//create a barrel
			let barrel = this.barrels.create(this.goal.x, this.goal.y, 'barrel');
			
			//set properties
			barrel.setVelocityX(this.levelData.spawner.speed);
			
			//duration
			this.time.addEvent({
				delay: this.levelData.spawner.lifespan,
				repeat: 0,
				callbackScope: this,
				callback: function(){
					barrel.destroy();
				}
			})
		
	}
	});
};

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: gameScene,
  title: 'King of Darkness',
  pixelArt: false,
  physics: {
	  default: 'arcade',
	  arcade: {
		  gravity: {y: 1000},
		  debug: false
	  }
  }
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
