PIXI.utils.sayHello();

var renderer = PIXI.autoDetectRenderer(567,586, {
	transparent:true,
	resolution: 1
});

document.getElementById('display').appendChild(renderer.view);

var stage = new PIXI.Container();
var backStage = new PIXI.Container();
//Loads the images
PIXI.loader
	.add('empty', 'Images/empty.png')
	.add('red', 'Images/red.png' )
	.add('yellow' , 'Images/yellow.png')
	.add('yellow_button' , 'Images/yellow_button.png')
	.add('red_button' , 'Images/red_button.png')
	.load(setup);

//array containers for empty box sprites and button sprites
var empties = [];
var buttons = [];
//turn variable, the game starts from yellow
var turn = "yellowPlayer";

// In the game matrix, 1 stands for yellow, 2 stands for red, 0 for empty, index 6 of every column shows the index for the next empty place
// index of the column
var gameMatrix = [];
for(var i=0; i < 7; i++){
	gameMatrix[i] = new Array(7);
	gameMatrix[i][6] = 0;
}
//the array container for the button sprites
var coins = [];
//index for coins[] array
var coinIndex = 0;
//destination pixel variable for falling coins.
var destinationPixelY;

//setting up the stage
function setup(){


	for(var i = 0; i < 7; i++){
		//Loading button sprites
		buttons[i] = new PIXI.Sprite(
				PIXI.loader.resources['yellow_button'].texture
			);


		//Positioning the buttons
		buttons[i].position.x = 81*i + 10;
		buttons[i].position.y = 30;
		//For event listener
		buttons[i].interactive = true;
		//For the hand symbol to appear
		buttons[i].buttonMode = true;
		

		let index = i;    //so every closure binds the block-scoped variable
		//Adding event listeners
		buttons[i].on('click', function(){
			insertDisk(index);
		});

		//Adding the buttons to the stage
		stage.addChild(buttons[i]);
	
	}

	// make stage interactive
	stage.interactive = true;

	//set the empty boxes to initialize game
	for(var i = 0; i < 7; i++){
		

		empties[i] = new Array(6);

		for (var j = 0; j<6; j++){

			empties[i][j] = new PIXI.Sprite(
				PIXI.loader.resources['empty'].texture
			);

			empties[i][j].position.x = 81*i;
			empties[i][j].position.y = 100 + 81*j;
			
			stage.addChild(empties[i][j]);

		}
	}
	// render everything
	renderer.render(stage);
}

function insertDisk(rowIndex){

	var nextEmptyIndex;
	//if the column is full, return
	if( gameMatrix[rowIndex][6] == 6){
		return;
	} else {
	//nextEmptyIndex is assigned
		nextEmptyIndex = gameMatrix[rowIndex][6];
		//the value of the nextEmptyIndex for that column is updated(incremented)
		gameMatrix[rowIndex][6] ++;
	}
	//if yellow turn, switch buttons and register the move to the main gameMatrix
	if(turn == "yellowPlayer"){
		coins[coinIndex] = new PIXI.Sprite(
				PIXI.loader.resources['yellow'].texture
		);
		gameMatrix[rowIndex][nextEmptyIndex] = 1;
	//if red turn, switch buttons and register the move to the main gameMatrix
	} else if(turn == "redPlayer"){
		coins[coinIndex] = new PIXI.Sprite(
				PIXI.loader.resources['red'].texture
		);
		gameMatrix[rowIndex][nextEmptyIndex] = 2;
	}

		//initial position of the new coin added
		coins[coinIndex].position.x =  rowIndex * 81;
		coins[coinIndex].position.y = 50;

		//adding to stage container
		backStage.addChild(coins[coinIndex]);
		backStage.addChild(stage);
		//the destination pixel of the coin
		destinationPixelY = 586 - ((nextEmptyIndex +1 )* 81 );
		//make the move
		move(rowIndex);


		switchTurn();

}
/*
*moves the coin to its new position
*/
function move(rowIndex){
	requestAnimationFrame(move);
	
	coins[coinIndex].position.y +=5;

	renderer.render(backStage);
	if(coins[coinIndex].position.y > destinationPixelY -1){
		coins[coinIndex].position.y = destinationPixelY +2;
		coinIndex++;
		return;
	}
	
}
//to switch the turn
function switchTurn(){
	if(turn == "yellowPlayer"){
		turn = "redPlayer";
		for(var i =0; i<7; i++){
			buttons[i].texture =PIXI.loader.resources['red_button'].texture;
		}
	}else if(turn == "redPlayer"){
		turn = "yellowPlayer";
		for(var i =0; i<7; i++){
			buttons[i].texture =PIXI.loader.resources['yellow_button'].texture;
		}
	}	
}