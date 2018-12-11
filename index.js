class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.startTime;
        this.moveCount = 0;
        this.victory = false;

        let newGame = document.querySelector("button[name = 'newGame']");
        let cellCount = document.querySelector("input[name = 'cellCount']")

        newGame.addEventListener('click', (event) => {
            this.run(parseInt(cellCount.value))
        })

        cellCount.addEventListener('input', (event) => {
            setTimeout(cellCount => { 
                if(cellCount.value < 2) {
                    cellCount.value = 2;
                }
                if(cellCount.value != parseInt(cellCount.value)){
                    cellCount.value = parseInt(cellCount.value);
                }
            },1000);
        })

        /**
         *  DO NOT TOUCH THIS FUNCTION IF YOU DON'T KNOW WHAT YOU ARE DOING!
         * 
         *  The Game class creates a new board every time you click New Game. This allows
         *  us to reset the size of the game board without instancing a new Game object. However, it 
         *  creates a problem when you have to handle mouse input. If the event listener is added each time
         *  the board is set, there will be a multiple of event listeners attached to the Canvas DOM Node. 
         *  So if you press New Game for the second time, and there are two listeners attached they will
         *  undo each other's work.
         * 
         *  The hack-y solution I have used here is to attach the event listener in the constructor of the
         *  Game object. Hence, there is only ever one event listener. However, the attached handler function 
         *  does not yet make sense because it has no notion of a this.board yet. That will happen only 
         *  when this.run() is called. To ensure that this code doesn't break, DO NOT CREATE A SITUATION WHERE 
         *  NEW GAME BUTTON CAN BE CLICKED OUTSIDE OF THE CONTEXT OF A RUN() CALL.   
         * 
         */
        let canvas = document.querySelector(".board")
        canvas.addEventListener('click', (event) => {
            let {success, i, j} = this.board.getIndex(this.canvas, event);
            if(success && !this.victory) {
                // Update Board
                this.board.updateAt(i, j);
                this.board.draw(this.context);
                
                // Update HUD
                this.moveCount++
                let moveNode = document.querySelector("#Moves")
                moveNode.innerHTML = "Moves: " + this.moveCount

                // Win Condition
                if(this.board.win()) {
                    this.victory = true;
                    let winNode = document.querySelector("#win");
                    winNode.innerHTML = "You have won!";
                }
            }
        })
    }

    run(cellCount){
        // Cell Count is passed as an argument to run rather than the constructor so that the same game object can run multiple games.
        this.board = new Board(cellCount, this.width, this.height);
        this.canvas = document.querySelector(".board");
        this.context = this.canvas.getContext("2d");
        this.victory = false;

        let winNode = document.querySelector("#win");
        winNode.innerHTML = "";

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.board.draw(this.context);
        
        // Initialize HUD
        this.startTime = new Date();
        let timeNode = document.querySelector("#Time")
        let moveNode = document.querySelector("#Moves")
        timeNode.innerHTML = formatTime(0)
        moveNode.innerHTML = "Moves: 0"
        setInterval(() => {
            if(!this.victory) {
                this.secCount++
                let date = new Date()
                let timeDiff = parseInt((date - this.startTime)/1000)
                timeNode.innerHTML = formatTime(timeDiff)
            }
        }, 1000)
    }
}

class Board {
    constructor(cellCount, width, height){
        this.cellCount = cellCount;
        this.width = width
        this.height = height
        let totalBoardLength = (cellCount * 3 - 1)/2; // Total number of cells needed in both directions. It treats each gap as a half cell.
        this.cellWidth = width / totalBoardLength;
        this.cellHeight = height / totalBoardLength;

        this.emptyColor = "#000000";
        this.fillColor = "#FF0000";

        this.board = new Array(cellCount)
        for(let i=0;i<cellCount;i++){
            this.board[i] = new Array(cellCount);
            this.board[i].fill(0);
        }
        this.winCount = 0
    }

    update(i, j) {
        this.board[i][j] = 1 - this.board[i][j];
        if(this.board[i][j] == 1){
            this.winCount += 1
        }
        else {
            this.winCount -= 1
        }
    }

    updateAt(i, j){
        let updateList = [[i, j]]
        if(i > 0) {
            updateList.push([i-1, j]);
        }
        if(i < (this.cellCount-1)) {
            updateList.push([i+1, j]);
        }
        if(j > 0) {
            updateList.push([i, j-1]);
        }
        if(j < (this.cellCount-1)) {
            updateList.push([i, j+1]);
        }
        updateList.forEach( pair => {
            this.update(pair[0], pair[1]);
        })
    }

    draw(context){
        // The increment is done by 1.5 so that it leaves space for the negative space between the lights.
        for(let i=0; i< this.cellCount*1.5; i += 1.5){
            for(let j=0; j<this.cellCount*1.5; j += 1.5){
                if(this.board[i/1.5][j/1.5] == 0){
                    context.fillStyle = "#000000";
                }
                else {
                    context.fillStyle = "#FF0000";
                }
                context.fillRect(j*this.cellWidth, i*this.cellHeight, this.cellWidth, this.cellHeight);
            }
        }
    }

    getIndex(canvas, event){
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let shiftWidth = (3*this.cellWidth)/2;
        let shiftHeight = (3*this.cellHeight)/2;

        let j = parseInt(x/shiftWidth);
        let i = parseInt(y/shiftHeight);

        if(parseInt(x/shiftWidth + 1/3) > j){
            return {success: false, i: 0, j: 0}
        }
        if(parseInt(y/shiftWidth + 1/3) > i){
            return {success: false, i: 0, j: 0}
        }
        return {success: true, i: i, j: j}
    }

    win(){
        return this.winCount == this.cellCount * this.cellCount
    }
} 

// Helper Functions
function formatTime(secCount){
    let secs = secCount % 60
    let mins = parseInt(secCount / 60)
    if(secs < 10) { secs = "0" + secs}
    return "Time: " + mins + ":" + secs
}


let game = new Game(400, 400);
