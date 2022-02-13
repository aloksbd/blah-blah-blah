var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var scale = 3;
var width = 120 * scale;
var height = 160 * scale;

canvas.width = width;
canvas.height = height;

var points = 0;
var gameOver = true;
var showStart = false;

function initialSetup() {
    ctx.fillStyle = "#bde03e";
    ctx.fillRect(0,0,width,height);
    ctx.font = 25 + "px Arial";
    ctx.fillStyle = "#ff61b2";
    ctx.textAlign = "center";
    ctx.fillText("Press Enter to Play",width/2,
    height/2);
    time = 30 * 24;
    points = 0;
    c = 0;
}

function showGameOver() {
    let msg;
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    if (points < 4) {
        msg = "Best Tea Time Ever!!"
    } else if (points < 8){
        msg = "What a good afternoon"
    } else if (points < 12){
        msg = "Cant I ever have a peace"
    } else if (points < 8){
        msg = "Leave Me Alone!"
    } else {
        msg = "I WANT DIVORCE WOMAN!!!"
    }
    ctx.fillText(msg,width/2,height/2);
}

initialSetup();

class Sprite {
    constructor(imageSources, x = 0, y = 0) {
        this.images = [];
        imageSources.forEach(src => {
            let image = new Image();
            image.src = src;
            this.images.push(image);
        });
        this.index = 0;
        this.x = x;
        this.y = y;
        this.velocity = [0,0];
    }

    width() {
        return this.images[0].width;
    }

    height() {
        return this.images[0].height;
    }

    draw() {
        let image = this.images[Math.floor(this.index/8)];
        ctx.drawImage(image, this.x, this.y, image.width, image.height);
        this.index = this.index == (this.images.length)*8 - 1 ? 0 : this.index + 1
    }

    drawMood(point) {
        let image = this.images[0];
        let x = point/4*24;
        ctx.drawImage(image, x, 0, image.width, image.height, this.x+x, this.y, image.width, image.height);
    }

    update() {
        this.x += this.velocity[0];
        if(this.x < 40) {
            this.x = 40
        }
        if(this.x > width - this.images[0].width - 40) {
            this.x = width - this.images[0].width - 40
        }
        this.y += this.velocity[1];
        if(this.y > height) {
            return false
        }
        return true
    }
}

class Blahs {
    constructor(){
        this.items = [];
    }
    
    add(blah) {
        this.items.push(blah);
        blah.velocity = [0,5];
    }

    draw() {
        this.items.forEach(blah => {
            blah.draw()
        });
    }

    update() {
        let remove = false;
        this.items.forEach(blah => {
            if(!blah.update()) {
                remove = true
            }
        });
        if (remove) {
            this.items.shift();
        }
    }

    checkCollision(man) {
        let remove = false;
        this.items.forEach(blah => {
            if (blah.x < man.x - 6 + man.width() 
            && blah.x + blah.width() > man.x + 6 
            && blah.y < man.y + 64 
            && blah.y + blah.height() > man.y) {
                remove = true;
                points += 1;
            }
        });
        if (remove) {
            this.items.shift();
        }
    }
}

var time = 30 * 24;
function updateTime() {
    time--;
    ctx.textAlign = "start";
    ctx.fillText("Tea Time: "+Math.floor(time/24),20,height - 20);   
    if (time == 0) {
        gameOver = true;
    } 
}

let bg = new Sprite(['img/bg.png']),
    man = new Sprite(['img/man1.png','img/man2.png','img/man1.png','img/man3.png'], width/2-48, height - 180), 
    wife = new Sprite(['img/wife1.png','img/wife2.png']),
    moods = new Sprite(['img/mood.png'], width - 120, height - 40);

let blahs = new Blahs();

function random(min, max) { // min and max included 
return Math.floor(Math.random() * (max - min + 1) + min)
}

var audio = new Audio('sound/centys-music-happy-7-4707.mp3');
function startMusic() {
    audio.loop = true;
    audio.play();
}

var c = 0
function createBlah() {
    c++;
    if (c % 30 == 5) {
        let blahClone = new Sprite(['img/blah.png']);
        let x = random(5,10) * 24;
        blahClone.x = x; blahClone.y = 45;
        blahs.add(blahClone)
    }
}

function draw() {
    ctx.clearRect(0,0,width,height);
    bg.draw();
    wife.draw();
    man.draw();
    moods.drawMood(points);
    if (points >= 16){
        gameOver = true
    }
    blahs.draw();
}

function update() {
    man.update();
    blahs.update();
    blahs.checkCollision(man);
    createBlah();
    updateTime();
}

function gameloop() {
    if (gameOver) {
        showStart = true;
        audio.pause();
        audio.currentTime = 0;
        showGameOver()
    } else {
        draw();
        update();
        setTimeout(gameloop, 1000/24);
    }
}

document.onkeydown = function(keyEvent){
    if  (keyEvent.key == 'ArrowLeft'){
        man.velocity = [-8,0]
    }
    if  (keyEvent.key == 'ArrowRight'){
        man.velocity = [8,0]
    }
    if (keyEvent.key == 'Enter'){
        if (showStart) {
            showStart = false;
            initialSetup();
        } else if (gameOver) {
            gameOver = false;
            startMusic();
            gameloop();
        }
    }
}

document.onkeyup= function(keyEvent){
    if  (keyEvent.key == 'ArrowLeft'){
        man.velocity = [0,0]
    }
    if  (keyEvent.key == 'ArrowRight'){
        man.velocity = [0,0]
    }
}