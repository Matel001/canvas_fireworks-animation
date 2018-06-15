const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height =  innerHeight;

addEventListener("resize", function(){
    canvas.width = innerWidth;
    canvas.height =  innerHeight;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    init();
})
let mouse = {
    x: canvas.width/2,
    y: canvas.height/2
}
let angle = 0;
let flag = 1;
let angle2 = 0;
addEventListener("mousemove", function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    angle = Math.atan2(mouse.y - canvas.height, mouse.x - canvas.width/2)*(180/Math.PI);
    angle = Math.round(( angle > 90 ? -angle : angle )+90);
    box((canvas.width-boxX)/2, canvas.height- boxY , boxX, boxY); 
    if (flag){
        angle2 = angle;
    }
})

let mousedownID = -1;  //Global ID of mouse down interval

function mousedown(event) {
  if(mousedownID==-1)  //Prevent multimple loops!
     mousedownID = setInterval(whilemousedown, 75);
}
function mouseup(event) {
   if(mousedownID!=-1) {  //Stop if exists
     clearInterval(mousedownID);
     mousedownID=-1;
   }
}
function whilemousedown() {

   createComet();

}
document.addEventListener("mousedown", mousedown);
document.addEventListener("mousedown", function(){
    flag = 0;
    createComet();
});
document.addEventListener("mouseup", mouseup);
//clear the interval when user leaves the window with mouse
document.addEventListener("mouseout", mouseup);

ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width, canvas.height);

function Pitagoras(sx, sy, ex, ey){
    let x;
    let y;
    
    x = sx - ex;
    y = sy - ey;
    
    return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
}
function box(OX, OY, x, y){
    //console.log(OX+x/2, OY+y);
    ctx.translate(OX+x/2, OY+y); //coordinates in center of firework box

    ctx.fillStyle = "rgba(0, 0, 0, 0.12)"; // refill background
    ctx.fillRect(-x/2+1, -y+1, x+1,y+1);
    ctx.rotate(angle*Math.PI/180);
    
   // ctx.arc(500,550,30,Math.PI/2, Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fillRect(-x/2, -y, x, y);
    ctx.stroke();
    shooterX = (canvas.width)/2; 
    shooterY = (canvas.height - boxY);
    ctx.rotate(-angle*Math.PI/180);
    ctx.translate(-OX-x/2, -OY-y);//coordinates in left upper corner of web window
}

function Comet(x, y, speedFactor, pozX, pozY, radius, color, range, angle, capacity){
    this.x = x;
    this.y = y;
    //this.dx = dx;
    this.speedFactor = speedFactor;
    this.pozX = pozX;
    this.pozY = pozY;
    this.radius = radius;
    this.color = color;
    this.range = range;
    this.angle = angle;
    this.capacity = capacity;
    
    
    let alpha = Math.atan2(this.pozY - this.y, this.pozX - this.x);
  
    
    //let z = this.range;
    let dx = (Math.cos(alpha));
    let dy = (Math.sin(alpha));
    
    //console.log ("dx" + dx);
    //console.log ("dy" + dy);
    //console.log (alpha);
    //console.log (Math.sin(alpha));

    this.update = function(){  
        if(this.range < 0){
            fireworksArray.pop();
            fireworkExplosion(this.x, this.y, this.capacity); 
            flag = 1;
        }
   // alpha += 0.015;
    //dy = (Math.sin(alpha));
    if(pozX<canvas.width/2){
        alpha -= 0.015;
        dy = (Math.sin(alpha));
        }
        else{
             alpha += 0.015;
            dy = (Math.sin(alpha));
        }
           

    
       /*
        if(this.x + this.radius >= canvas.width || this.x - this.radius <= 0){
            dx = -dx;
        }*/ 
        if(this.y > canvas.height + 5 || this.y - this.radius <= 0){
            dy = -dy;
            alpha = -alpha;
        }

        
        this.x += dx * this.speedFactor;
        this.y += dy * this.speedFactor;
       // console.log("dx" + dx * this.speedFactor)
        //console.log("dy" + dy * this.speedFactor)
        this.range -= 7;
       // alpha += 0.015;
       // console.log(alpha);
        //console.log(this.range);
        this.draw();
    }
    
    this.draw = function(){
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle*Math.PI/180);// rotare firework box
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.rotate(-this.angle*Math.PI/180);//rotate back
        ctx.translate(-this.x, -this.y);
    }

}

function Glimmer(x, y, dx, dy, radius, color, colorStroke, lifeTime){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.lifeTime = lifeTime;
    this.colorStroke = colorStroke;//this.color.replace('rgb', 'rgba').replace(')', ', 0.12)');
    
    this.update = function(){
        if(this.lifeTime < 0){
            explosionArray.pop();           
        }
        if(this.x + this.radius >= canvas.width || this.x - this.radius <= 0){
            this.dx = -this.dx;
        }
        if(this.y + this.radius >= canvas.height || this.y - this.radius <= 0){
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.lifeTime--;
        this.draw();
    }
    
    this.draw = function(){
        ctx.beginPath();        
        ctx.strokeStyle = this.colorStroke;
        ctx.lineWidth = 4;
        ctx.fillStyle = this.color;        
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
        ctx.stroke();
           
        ctx.closePath();
    }
    
}
const fireworksColors = [
    "rgb(232, 232, 232)",
    "rgb(61, 238, 255)",
    "rgb(113, 255, 76)",
    "rgb(232, 19, 0)",
    "rgb(255, 216, 76)", 
]
const fireworksStrokeColors = [
    "rgba(232, 232, 232, 0.12)",
    "rgba(61, 238, 255, 0.12)",
    "rgba(113, 255, 76, 0.12)",
    "rgba(232, 19, 0, 0.12)",
    "rgba(255, 216, 76, 0.12)", 
]
function randomInt(min, max){
    return Math.round(Math.random()*(max-min)+min);
}
let explosionArray = [];
function fireworkExplosion(x,y, capacity){
        //explosionArray = [];     
    
    let radius = 2;
    let lifeTime = 100;

    for(let i = 0; i < capacity; i++){
        
        let dx = Math.random()*5-2;
        let dy = Math.random()*5-2;
        let int = randomInt(0,5);
        let color = fireworksColors[int];
        let colorStroke = fireworksStrokeColors[int];
        explosionArray.unshift(new Glimmer(x, y, dx, dy, radius, color, colorStroke, lifeTime));
    }
   
}

const boxX = 10;
const boxY = 20;
let shooterX = (canvas.width)/2; 
let shooterY = (canvas.height);
let fireworksArray = [];
let timer = 150;
let capacity = 10;
let iterator = 0;

function createComet(){   
    let x = shooterX;
    let y = shooterY+boxY;
    //let dx = 0;
    let speedFactor = 10;
    let radius = 3;
    let color = "white";
    let range = 350;
    let pozX = mouse.x;
    let pozY = mouse.y;
    let angle = angle2;

    if (iterator == 3){
        capacity = 20;
        iterator = 0;
    }
    else{
        capacity = 10; 
        iterator++;
    }
    console.log(capacity);
    console.log(iterator);  
    fireworksArray.unshift(new Comet(x, y, speedFactor, pozX, pozY, radius, color, range, angle, capacity));
}

function init(){
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    box((canvas.width-boxX)/2, canvas.height- boxY , boxX, boxY); 
    shooterX = (canvas.width)/2; 
    shooterY = (canvas.height - boxY);
    for(let i =0; i<5; i++){
        setTimeout(createComet,timer);
        timer+=150;
        if(timer > 1000){
            clearTimeout();
        }
    }
}

function animate(){
    requestAnimationFrame(animate);
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    box((canvas.width-boxX)/2, canvas.height- boxY , boxX, boxY);
    for(let i = 0; i< fireworksArray.length; i++){
        fireworksArray[i].update(); 
    }
    for(let i = 0; i < explosionArray.length; i++){
        explosionArray[i].update();
    }
    ctx.closePath();
}

init();
animate(); 

