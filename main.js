

var cols = 40
var rows = 20

var w = 0
var h = 0

var width = 1600
var height = 800

var grid = new Array(cols)

// edit here to generate another wall on map on 
var wallIdx = 12
var midWallIdx = Math.floor(wallIdx / 2)

var openSet = []
var closedSet = []

var start = undefined
var end = undefined
var tryClicked = 0
var path

function Spot(i,j){
    this.i = i
    this.j = j

    this.x = i * w
    this.y = j * h

    this.f = 0
    this.g = 0
    this.h = 0
    
    this.wall = false

    this.neighbors = []
    this.previous = undefined

    this.col = (255)

    this.show = function(color){
        if(color !== null)
        this.col = color
        fill(this.col)
        noStroke(0)
        rect(this.i * w, this.j*h, w-1, h-1)
    }

    this.addNeighbors = function(grid){
        var i = this.i
        var j = this.j

        if (i < cols-1) this.neighbors.push(grid[i+1][j])
        if (i > 0) this.neighbors.push(grid[i-1][j])
        if(j < rows - 1) this.neighbors.push(grid[i][j+1])
        if(j > 0) this.neighbors.push(grid[i][j-1])
        if(i > 0 && j > 0) this.neighbors.push(grid[i-1][j-1])
        if(i < cols -1 && j > 0) this.neighbors.push(grid[i+1][j-1])
        if(i > 0 && j < rows - 1) this.neighbors.push(grid[i-1][j+1])
        if(i < cols -1 && j < rows - 1) this.neighbors.push(grid[i+1][j+1])
    }
}

function heuristic(x,y){
    var z = dist(x.i, x.j, y.i, y.j)
    return z
}

function removeFromArray(arr, del){
    for(let i = arr.length - 1; i >= 0; i--){
        if(arr[i] == del)
            arr.splice(i, 1)
    }
}

function mousePressed(){
    if(tryClicked < 2){

        console.log(Math.floor(mouseX/h) + "   " + Math.floor(mouseY/w))
        let tempI = Math.floor(mouseX/h)
        let tempJ = Math.floor(mouseY/w)
        
        if(tryClicked === 0){
            start = grid[tempI][tempJ]
            openSet.push(start)
            grid[tempI][tempJ].show(color(0, 255, 0))
            tryClicked++
        }else if(tryClicked === 1){
            end = grid[tempI][tempJ]
            grid[tempI][tempJ].show(color(255, 0, 0))
            tryClicked++
        }
    }
}

function setup(){
    createCanvas(1600,800)
    w = width / cols
    h = height / rows

    for(let i = 0; i < cols; i++){
        grid[i] = new Array(rows)
    }

    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j] = new Spot(i,j)
        }
    }

    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j].addNeighbors(grid)
        }
    }
    console.log(grid)
}


function astar(){
    if(openSet.length > 0){
        var lowestIndex = 0
        for (let i = 0;i < openSet.length; i++){
            if(openSet[i].f < openSet[lowestIndex].f)
                lowestIndex = i
        }
        var current = openSet[lowestIndex]

        path = []
        var temp = current
        path.push(temp)
        while(temp.previous){
            path.push(temp.previous)
            temp = temp.previous
        }
        if(current === end){
            noLoop()
            console.log("Done!")
        }
        removeFromArray(openSet, current)
        closedSet.push(current)
        var neighbors = current.neighbors
        for(let i=0; i < neighbors.length; i++){
            let neighbor = neighbors[i]
            if(!closedSet.includes(neighbor) && !neighbor.wall){
                var tempG = current.g + heuristic(neighbor,current);
                
                var newPath = false
                if(openSet.includes(neighbor)){
                    if(tempG < neighbor.g){
                        neighbor.g = tempG
                        newPath = true
                    }
                }else{
                    neighbor.g =  tempG
                    newPath = true
                    openSet.push(neighbor)
                }
                if(newPath){
                    neighbor.h = heuristic(neighbor,end)
                    neighbor.f = neighbor.g + neighbor.h
                    neighbor.previous = current
                }
            }
        }
    }
}

function draw(){
    background(0)
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            if((i+1) % wallIdx == 0 && j > 5){
                grid[i][j].wall = true 
                grid[i][j].show(0)
            }
            else if((i+1) % wallIdx == midWallIdx && j < 15){
                grid[i][j].wall = true 
                grid[i][j].show(0)
            }
            else{
                grid[i][j].show(null)
            }
        }
    }

    if(tryClicked > 1){
        astar()
        for(let i = 0; i < closedSet.length;i++){
            closedSet[i].show(color(255, 0, 0))
        }
        for(let i = 0; i < openSet.length;i++){
            openSet[i].show(color(0, 255, 0))
        }
        for(let i = 0; i < path.length;i++){
            path[i].show(color(0, 0, 255))
        }
    }

    
}