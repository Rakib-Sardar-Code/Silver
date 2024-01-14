var renderer = document.createElement('canvas');
document.body.appendChild(renderer)
var canvas = document.querySelector('canvas');
var centerX = innerWidth/2;
var centerY = innerHeight/2;
renderer.style.position = 'absolute';
// canvas.style.zIndex = '-4';
renderer.style.top = "0";
renderer.style.left = "0";
var SCREEN = {
  width : innerWidth,
  height : innerHeight,
  fit : ()=>{
    return [innerWidth,innerHeight];
  }
}
var WDG = 9.8;
function $help(){
  return `
  code of debug
  
  #main key's
  "_" => _ mean 'component'
  "$" => $ mean 'for'
  "%" => % mean 'not support'
  "." => . mean 'now'
  "-" => - mean 'of'
  "@" => @ mean 'feature'
  #some usefull keyword
  "_t" => _t mean 'component type'
  "_c" => _c mean 'component cube'
  "_i" => _i mean 'component image'
  "_is" => _is mean 'component imageSheet'
  "_cl" => _cy mean 'component cylinder'
  "_s" => _s mean 'component sphere'
  "_b" => _b mean 'component borderBox'
  "_l" => _l mean 'component line'
  "_lk" => _lk mean 'component linker'
  "_p" => _lk mean 'component partical'
  `;
}
var color = ['red','blue','white','black'];
var  c = canvas.getContext("2d");
var focusedComponent;
var INPUT = {
 mouse : {
  x : 0,
  y : 0
},
 keyboard : {
  code : "UNPRESSED",
  name : "UNPRESSED"
 }
}
let MainCamera = {
  x : 0,
  y : 0
}
let CameraX = 0;
let CameraY = 0;
let AllElementStorage = [];
function rgba(r,g,b,a){
  return `rgba(${r},${g},${b},${a})`;
}
function unPoint(number){
  return Math.floor(number);
}
function random(range){
  return Math.random()*range;
}
function uPRandom(range){
  return unPoint(random(range))
}
function rgb(r,g,b){
  return `rgba(${r,g,b})`;
}
function InbuildFrame(){
  requestAnimationFrame(InbuildFrame)
  clear()
addEventListener('mousemove',(e)=>{
  INPUT.mouse.x = e.x
  INPUT.mouse.y = e.y
})
addEventListener("keydown",e=>{
  INPUT.keyboard.code = e.keyCode; 
  INPUT.keyboard.name = e.key; 
})
}
InbuildFrame()
function Component(arr,func){
   arr.forEach((com)=>{
     func(com);
   })  
}
function Eye(){
  this.changeTransform = (x,y)=>{
  Component(AllElementStorage,(al)=>{
    if(al.eyeArea == true){
      al.x -= x;
      al.y -= y;
  }
    })
  }
}
function Camera(x,y){
  this.x = x;
  this.y = y;
  this.run = ()=>{
    MainCamera.x = -this.x;
    MainCamera.y = -this.y;
  }
  this.focus = (component)=>{
    focusedComponent = component;
  }
} 
function distance(x1, y1, x2, y2) {
  this.destx = x2 - x1;
  this.desty = y2 - y1;
  return Math.sqrt(Math.pow(this.destx, 2) + Math.pow(this.desty, 2));
}
function _d(com, com2) {
  this.destx = com2.x - com.x;
  this.desty = com2.y - com.y;
  return Math.sqrt(Math.pow(this.destx, 2) + Math.pow(this.desty, 2));
}
function _t(component){
  if(component.width && component.height && component.rotation){
    return "_CUBE";
  }else if(component.src){
    return "_IMAGE";    
  }else if(component.src && component.sx){
    return "_IMAGE_SHEET";
  }else if(component.radius){
    return "_SPHERE";
  }else if(component.radiusX){
    return "_CYLINDER";
  }else if(component.lineWidth && component.startX){
    return "_LINE";
  }else if(component.linker){
    return "_LINKER";
  }else if(component.borderWidth){
    return "_BORDER-BOX";
  }
}
function Scene(size){
  this.width = size[0];
  this.height = size[1];
  renderer.width = this.width;
  renderer.height = this.height;
  
 
  this.solidShader = function(color = 'black'){
   renderer.style.backgroundColor = color;
  }
  this.gradientShader = function(color = 'red,green,blue'){
    renderer.style.backgroundImage = `linear-gradient(`+color+`)`;  
  }
  this.MKflex = function(){
    document.body.style.margin = '0';
  }
  this.Scrolloff = function(){
    document.body.style.overflow = 'hidden';
  }
}
function Cube(x,y,w,h,rotate,col){
    this.rotation = rotate;
    this.x = x;
    this.y = y;
    this.xp = 0;
    this.yp = 0;
    this.tileType = "free";
    this.Rigidbody = false;
    this.Kinametic = false;
    this.Static = false;
    this.width = w;
    this.height = h;
    this.color = col;
    this.followCamera = true;
    this.blockX = 0;
    this.blockY = 0;
    this.sides = [];
    this.extraX = 0;
    this.extraY = 0;
    this.eyeArea = true;
    AllElementStorage.push(this);
    this.load = function(){
      this.sides = [
                    [{ x: this.x, y: this.y }, { x: this.x, y: this.y + this.height }],
                    [{ x: this.x + this.width, y: this.y }, { x: this.x + this.width, y: this.y + this.height }],
                    [{ x: this.x, y: this.y }, { x: this.x + this.width, y: this.y }],
                    [{ x: this.x, y: this.y + this.height }, { x: this.x + this.width, y: this.y + this.height }],
                    ];
      if(this.followCamera == false){
        this.blockX = MainCamera.x;
        this.blockY = MainCamera.y;
      }
      c.beginPath()
      c.translate(this.x + this.width/2, this.y + this.height/2);
      c.rotate((this.rotation * Math.PI) / 180);
      c.translate(-(this.x + this.width/2),-(this.y + this.height/2))
      c.fillStyle = this.color;
      c.fillRect(this.x,this.y,this.width,this.height);
      c.fill();
      c.setTransform(1,0,0,1,0,0);
    }
    this.moveY =function(rate){
      this.y += rate;
    }
    this.moveX = function(rate){
      this.x += rate;
    }
    this.touch = function(){
    return mouse.x >= this.x && mouse.x <= this.x + this.width && mouse.y >= this.y && mouse.y <= this.y + this.height;
    }
  }
function Cylinder(x,y,radiusX,radiusY,rotate,color){
    this.x = x;
    this.y = y;
    this.xp = 0;
    this.yp = 0;
    this.radiusX = radiusX;
    this.eyeArea = true;
    if (this.eyeArea) {
      AllElementStorage.push(this);
    }
    this.radiusY = radiusY;
    this.rotation = rotate;
    this.color = color;
    this.followCamera = true;
    this.blockX = 0;
    this.blockY = 0;
    this.load = function(){
      if (this.followCamera == false) {
        this.blockX = MainCamera.x;
        this.blockY = MainCamera.y;
      }
      // this.xp = (MainCamera.x - this.blockX)+this.x;
      // this.yp = (MainCamera.y - this.blockY)+this.y;
      c.beginPath()
      c.translate(this.x + this.radiusX/2, this.y + this.radiusY/2);
      c.rotate((this.rotation * Math.PI) / 180);
      c.translate(-(this.x + this.radiusX/2),-(this.y + this.radiusY/2))
      c.fillStyle = this.color
      c.ellipse(this.x - MainCamera.x,this.y - MainCamera.y,radiusX,radiusY,this.rotation,0,Math.PI*2,false)
      c.fill();
      c.setTransform(1,0,0,1,0,0);
    }
  }
function ImageSrc(src, x, y, w, h, rotate) {
    this.img = new Image(this.src);
    this.img.src = src;
    this.mainArea;
    this.x = x
    this.y = y
    this.xp = 0;
    this.yp = 0;
    this.rotation = rotate;
    this.eyeArea = true;
    this.force = 0;
    AllElementStorage.push(this);
    this.width = w
    this.height = h
    this.flipX = false;
    this.flipY = false;
    this.followCamera = true;
    this.blockX = 0;
    this.blockY = 0;
    this.sides = [];
    this.load = function() {
    this.sides = [
 [{ x: this.x, y: this.y }, { x: this.x, y: this.y + this.height }],
 [{ x: this.x + this.width, y: this.y }, { x: this.x + this.width, y: this.y + this.height }],
 [{ x: this.x, y: this.y }, { x: this.x + this.width, y: this.y }],
 [{ x: this.x, y: this.y + this.height }, { x: this.x + this.width, y: this.y + this.height }],
              ];
      if (this.followCamera == false) {
        this.blockX = MainCamera.x;
        this.blockY = MainCamera.y;
      }
      // this.xp = (MainCamera.x - this.blockX) + this.x;
      // this.yp = (MainCamera.y - this.blockY) + this.y;
      c.translate(this.x + this.width / 2, this.y + this.height / 2);
      c.rotate((this.rotation * Math.PI) / 180);
      if (this.flipX == true) {
        c.scale(-1, 1)
      }
      if (this.flipY == true) {
        c.scale(1, -1)
      }
      c.translate(-(this.x + this.width / 2), -(this.y + this.height / 2))
      c.beginPath()
      c.drawImage(this.img,this.x, this.y, this.width, this.height);
      c.setTransform(1, 0, 0, 1, 0, 0);
    }
    this.moveY = function(rate) {
      this.y += rate;
    }
    this.moveX = function(rate) {
      this.x += rate;
    }
    this.touch = function() {
      return mouse.x >= this.x && mouse.x <= this.x + this.width && mouse.y >= this.y && mouse.y <= this.y + this.height;
    }
    this.setCollisionArea = ()=>{
      this.mainArea = area;
    }
  }
  function Area(component,func){
    return func(component.x,component.y);
  }
function ImageSheetSrc(src,x,y,w,h,sx,sy,sw,sh,rotate){
    this.img = new Image(this.src);
    this.img.src = src;
    this.x = x
    this.y = y
    this.xp = 0;
    this.yp = 0;
    this.sx = sx;
    this.sy = sy;
    this.sw = sw;
    this.sh = sh;
    this.rotation = rotate;
    this.width = w
    this.eyeArea = true;
    AllElementStorage.push(this);
    this.height = h
    this.flipX = false;
    this.flipY = false;
    this.followCamera = true;
    this.blockX = 0;
    this.blockY = 0
    this.sides = [];
      this.load = function(){
         this.sides = [
         [{ x: this.x, y: this.y }, { x: this.x, y: this.y + this.height }],
         [{ x: this.x + this.width, y: this.y }, { x: this.x + this.width, y: this.y + this.height }],
         [{ x: this.x, y: this.y }, { x: this.x + this.width, y: this.y }],
         [{ x: this.x, y: this.y + this.height }, { x: this.x + this.width, y: this.y + this.height }],
                      ];
        if (this.followCamera == false) {
          this.blockX = MainCamera.x;
          this.blockY = MainCamera.y;
        }
        // this.xp = (MainCamera.x - this.blockX) + this.x;
        // this.yp = (MainCamera.y - this.blockY) + this.y;
      c.translate(this.x + this.width/2, this.y + this.height/2);
      c.rotate((this.rotation * Math.PI) / 180);
      if(this.flipX == true){
      c.scale(-1,1)
      }
      if(this.flipY == true){
      c.scale(1,-1)
      }
      c.translate(-(this.x + this.width/2),-(this.y + this.height/2))
      c.beginPath()
      c.drawImage(this.img,this.sx,this.sy,this.sw,this.sh,this.x,this.y,this.width,this.height);  
      c.setTransform(1,0,0,1,0,0);
    }
    this.moveY =function(rate){
      this.y += rate;
    }
    this.moveX =function(rate){
      this.x += rate;
    } 
    this.touch = function(){
    return mouse.x >= this.x && mouse.x <= this.x + this.width && mouse.y >= this.y && mouse.y <= this.y + this.height;
      }
  }  
function Sphere(x,y,r,col){
    this.x = x;
    this.y = y;
    this.xp = 0;
    this.yp = 0;
    this.radius = r;
    this.color = col;
    this.followCamera = true;
    this.blockX = 0;
    this.blockY = 0;
    this.load = function(){
      if (this.followCamera == false) {
        this.blockX = MainCamera.x;
        this.blockY = MainCamera.y;
      }
      this.xp = (MainCamera.x - this.blockX) + this.x;
      this.yp = (MainCamera.y - this.blockY) + this.y;
      c.beginPath()
      c.fillStyle = this.color;
      c.arc(this.xp,this.yp,this.radius,0,Math.PI *2,false);
      c.fill()
    }
    this.moveX = function(rate){
      this.x += rate;
    }
    this.moveY = function(rate){
      this.y += rate;
    }
    this.touch = ()=>{
      return distance(mouse.x,mouse.y,this.x,this.y) < this.radius;
    }
  }
  var CONTROLL = {
    car : (component,rate)=>{
      addEventListener("keydown",e=>{
        if(e.key == "ArrowLeft"){
          component.rotation-=rate;
        }else if(e.key == "ArrowRight"){
          component.rotation+=rate;
        }
      })
    }
  }
function SolidText(x,y,size,color,text){
    this.x = x;
    this.y = y;
    this.xp = 0;
    this.yp = 0;
    // this.font = "sans-serif"
    this.size = size;
    this.color = color;
    this.text = text;
    this.followCamera = true;
    this.blockX = 0;
    this.blockY = 0;
    this.load = ()=>{
      if (this.followCamera == false) {
        this.blockX = MainCamera.x;
        this.blockY = MainCamera.y;
      }
      this.xp = (MainCamera.x - this.blockX) + this.x;
      this.yp = (MainCamera.y - this.blockY) + this.y;
      c.fillStyle = this.color;
      c.font = this.size+"px Arial";
      c.fillText(this.text,this.xp,this.yp)
      c.fill()
    }
 }

function BorderBox(x, y, w, h,borderWidth, rotate, col) {
    this.rotation = rotate;
    this.x = x;
    this.y = y;
    this.xp = 0;
    this.yp = 0;
    this.Rigidbody = false;
    this.Kinametic = false;
    this.Static = false;
    this.width = w;
    this.height = h;
    this.borderWidth = borderWidth;
    this.color = col;
    this.followCamera = true;
    this.blockX = 0;
    this.blockY = 0;
    this.load = function() {
      if (this.followCamera == false) {
        this.blockX = MainCamera.x;
        this.blockY = MainCamera.y;
      }
      this.xp = (MainCamera.x - this.blockX) + this.x;
      this.yp = (MainCamera.y - this.blockY) + this.y;
      c.beginPath()
      c.translate(this.x + this.width / 2, this.y + this.height / 2);
      c.rotate((this.rotation * Math.PI) / 180);
      c.translate(-(this.x + this.width / 2), -(this.y + this.height / 2))
      c.strokeStyle = this.color;
      c.stroke()
      c.lineWidth = this.borderWidth;
      c.strokeRect(this.x, this.y, this.width, this.height);
      c.fill();
      c.stroke()
      c.setTransform(1, 0, 0, 1, 0, 0);
    }
    this.moveY = function(rate) {
      this.y += rate;
    }
    this.moveX = function(rate) {
      this.x += rate;
    }
    this.touch = function() {
      return mouse.x >= this.x && mouse.x <= this.x + this.width && mouse.y >= this.y && mouse.y <= this.y + this.height;
    }
  }
function Line(sx,sy,ex,ey,lw,color){
  this.startX = sx;
  this.startY = sy;
  this.endX = ex;
  this.endY = ey;
  this.type = "LINE";
  this.lineWidth = lw;
  this.color = color;
  this.sides = [];
  this.load = ()=>{
    this.sides = [
      [{x:this.startX,y:this.startY},{x:this.endX,y:this.endY}]
      ];
    c.save();
		c.strokeStyle = this.color;
		c.lineWidth = this.lineWidth;
		c.beginPath();		
		c.moveTo(this.startX,this.startY);
		c.lineTo(this.endX,this.endY);	
		c.closePath();		
		c.stroke();
  }
}
function Linker(color,lineWidth){
this.color = color;
this.linker = true;
this.lineWidth = lineWidth;
this.link = (target1,target2, customize = [0,0,0,0]) =>{
c.save();
c.strokeStyle = this.color;
c.lineWidth = this.lineWidth;
c.beginPath();
c.moveTo(target1.xp + customize[0], target1.yp + customize[1]);
c.lineTo(target2.xp + customize[2], target2.yp + + customize[3]);
c.closePath();
c.stroke();
}
}
function CircleRox(x1,y1,x2,y2){
    this.destx = x2-x1;
    this.desty =y2-y1;
    return Math.sqrt(Math.pow(this.destx,2)+Math.pow(this.desty,2));
  }
function Gradient(x1,y1,x2,y2,c1,c2){
    this.color = c.createLinearGradient(x1,y1,x2,y2);
    this.color.addColorStop(0,c1);
    this.color.addColorStop(1,c2);
  }
function frame(v){
    return requestAnimationFrame(v)
  }
function clear(){
    return c.clearRect(0,0,renderer.width,renderer.height);
  }
function Destroy(object , timer = 0){
    setTimeout(()=>{
      object.x = 99999999999;
      object.y = 99999999999;
    },timer*1000)
  }
function onCollisionEnter(object1,object2){
  if(object1.radiusX && object2.radiusX){
    if(
    _d(object1.xp,object1.yp,object2.xp,object2.yp) < object1.radiusX+object2.radiusX&&
    _d(object1.xp,object1.yp,object2.xp,object2.yp) < object1.radiusY+object2.radiusY
    ){
      return true;
    }
}
if(object1.width && object2.radiusX){
  if(
    object1.xp + object1.width >= object2.xp - object2.radiusX&&
    object1.xp <= object2.xp + object2.radiusX&&
    object1.yp + object1.height >= object2.yp - object2.radiusY &&
    object1.yp <= object2.yp + object2.radiusY
    ){
    return true;
  }
}
if(object1.radiusX && object2.width){
  if(
    object2.xp+ object2.width >= object1.xp - object1.radiusX&&
    object2.xp <= object1.xp + object1.radiusX&&
    object2.yp + object2.height >= object1.yp - object1.radiusY &&
    object2.yp <= object1.yp + object1.radiusY
    ){
    return true;
  }
}
if(object1.radius,object2.radiusX){
  if(
    _d(object1.xp, object1.yp, object2.xp, object2.yp) < object1.radius + object2.radiusX &&
    _d(object1.xp, object1.yp, object2.xp, object2.yp) < object1.radius + object2.radiusY
    ){
    return true;
  }
}else if (object1.radiusX, object2.radius) {
  if (
    _d(object1.xp, object1.yp, object2.xp, object2.yp) < object1.radiusX + object2.radius &&
    _d(object1.xp, object1.yp, object2.xp, object2.yp) < object1.radiusY + object2.radius
  ) {
    return true;
  }
}else if(object1.width && object2.width){
    if(
    object1.x + object1.width>= object2.x && object1.x <= object2.x + object2.width && object1.y <= object2.y + object2.height && object1.y + object1.height>= object2.y) {
      return true;
    }
  }
  if (object1.radius && object2.radius) {
    if (CircleRox(object1.xp,object1.yp,object2.xp,object2.yp) < object1.radius+object2.radius) {
      return true;
    }
  }else if(object1.radius && object2.width ){
    if(object1.xp + object1.radius >= object2.xp && object1.xp - object1.radius <= object2.xp + object2.width && object1.yp + object1.radius >= object2.yp && object1.yp - object1.radius <= object2.yp + object2.height){
      return true;
    }
    }
    else if(object1.width,object2.radius){
            if(object2.xp + object2.radius >= object1.xp && object2.xp- object2.radius <= object1.xp + object1.width && object2.yp + object2.radius >= object1.yp && object2.yp - object2.radius <= object1.yp + object1.height){
      return true;
    }
    }else{
      console.warn(`collision key of ${object1} and ${object2} is not found report bug in silver.bugfix.com`)
    }
  }
var Debug = {
   log : function(v){
     log(v)
   }
 }
class Emitter{
    constructor(){
      this.condition;
      this.func;
      this.pass;
      this.on = (condition = new String, callback = new Function)=>{
        this.condition = condition;
        this.func = callback;
      }
      this.pass = (callback = new Function)=>{
        this.pass = callback;
      }
      this.emit = (key = new String)=>{
        if(key == this.condition){
          this.func();
        }else{
          this.pass()
        }
      }
      
    }
}
function talk(talk){
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(talk));
    }
function FlamePartical(x,y,radius,dtime,ftime,amount,color,gravityX,gravityY,spread){
  this.x = x;
  this.y = y;
  this.xp = 0;
  this.yp = 0;
  this.radius = radius;
  this.dtime = dtime;
  this.ftime = ftime;
  this.amount = amount;
  this.color = color;
  this.eyeArea = true;
  AllElementStorage.push(this)
  this.gravityX = gravityX;
  this.gravityY = gravityY;
  this.spread = spread;
  this.followCamera = true;
  this.blockX = 0;
  this.blockY = 0;
  this.array = [];
  this.vStop = new Sphere(this.x,this.y,this.radius,this.color);
  this.load = ()=>{
    if (this.followCamera == false) {
      this.blockX = MainCamera.x;
      this.blockY = MainCamera.y;
    }
    // this.xp = x - (MainCamera.x - this.blockX) + this.x;
    // this.yp = y - (MainCamera.y - this.blockY) + this.y;
    this.vStop.load()
    if (this.amout < 1) {
      Destroy(this.vStop);
    }
    this.array.forEach(partical =>{
      partical.load()
      partical.x += this.gravityX - Math.random()*this.spread + Math.random()*this.spread;
      partical.y += this.gravityY;
      partical.radius -= this.dtime;
      if(partical.radius < 1){
        this.array.shift()
      }
    })
  }
  this.run = ()=>{
    setInterval(()=>{
      if(this.amount > 0){
        this.array.push(new Sphere(this.x,this.y,this.radius,this.color))
        this.amount -= 1;
        this.vStop.x = this.x;
        this.vStop.y = this.y;    
      }else {
        Destroy(this.vStop);
      }
    },this.ftime)
  }
}
function $border(component,color,width){
  let a = new BorderBox(component.x, component.y, component.width, component.height, width, component.rotation, color);
  a.x = component.x;
  a.y = component.y;
  a.load()
}
function AngleToAxis(angle){
  return {
    x : Math.cos(angle * Math.PI/180),
    y : Math.sin(angle * Math.PI/180)
  }
}
function AxisToAngle(lx,ly,fx,fy){
  return Math.atan2(fy-ly,fx-lx)*(180/Math.PI)
}
function _(components = []){
  components.forEach(component=>{
    component.load()
  })
}
var Animation = {
  Add : (animator,animations = [])=>{
   animations.forEach(animation =>{
     animator.add(animation);
   })
  }
}
function _c(x,y,w,h,r,col){
  return new Cube(x,y,w,h,r,col);
}
function _i(src,x,y,w,h,r){
  return new ImageSrc(src,x,y,w,h,r);
}
function _is(src,x,y,w,h,sx,sy,sw,sh,r){
  return new ImageSheetSrc(src,x,y,w,h,sx,sy,sw,sh,r);
}
function _cl(x,y,rx,ry,r,col){
  return new Cylinder(x,y,rx,ry,r,col)
}
function _s(x,y,r,col){
  return new Sphere(x,y,r,col);
}
function _b(x,y,w,h,lw,r,col){
  return new BorderBox(x,y,w,h,lw,r,col);
}
function _l(sx,sy,ex,ey,lw,col){
  return new Line(sx,sy,ex,ey,lw,col)
}
function _lk(col,lw){
  return new Linker(col,lw)
}
function _p(x,y,r,dt,ft,am,co,gx,gy,sp){
  return new Partical(x,y,r,dt,ft,am,co,gx,gy,sp);
}
function $convert(text){
  let txt = text;
  let rtxt = [];
  let main = "";
  for(var i=0;i<txt.length+i;i++){
    if(txt[0] == "$"){
      rtxt.push("for");
    }else if (txt[0] == "-") {
      rtxt.push("of");
    }else if (txt[0] == ".") {
      rtxt.push("now");
    }else if (txt[0] == "%") {
      rtxt.push("not support");
    }else if (txt[0] == "_c" || txt[0] == "_CUBE") {
      rtxt.push("cube component");
    }else if (txt[0] == "_i"|| txt[0] == "_IMAGE") {
      rtxt.push("image component");
    }else if (txt[0] == "_is"|| txt[0] == "_IMAGE_SHEET") {
      rtxt.push("imageSheet component");
    }else if (txt[0] == "_cl"|| txt[0] == "_CYLINDER") {
      rtxt.push("Cylinder component");
    }else if (txt[0] == "_") {
      rtxt.push("component");
    }else if (txt[0] == "@") {
      rtxt.push("feature");
    }else if (txt[0] == "_t") {
      rtxt.push("type");
    }else if (txt[0] == "_b"|| txt[0] == "_BORDER-BOX") {
      rtxt.push("border-box component");
    }else if (txt[0] == "_s"|| txt[0] == "_SPHERE") {
      rtxt.push("sphere component");
    }else if (txt[0] == "$b") {
      rtxt.push("border feature");
    }else if (txt[0] == "/ok"|| txt[0] == "/.") {
      rtxt.push(".");
    }else if (txt[0] == "@b") {
      rtxt.push("border feature");
    }else{
      rtxt.push(txt[0]);
    }
    txt.shift()
  }
  rtxt.forEach(val =>{
    main += val+" ";
  })
    return main;
}
function $b(component, color, w) {
  let a = new BorderBox(component.x, component.y, component.width, component.height, w, component.rotation, color);
  a.x = component.x;
  a.y = component.y;
  a.load()
}
function $array(components = new Array,callback = new Function){
  let list = components;
  let rt = callback;
  list.forEach((component)=>{
    rt(component)
  })
}
function $KeyBoard(down = new Function,up = new Function){
  let d = down;
  let u = up;
  addEventListener("keydown",(event)=>{
    d(event)
  })
  addEventListener("keyup",(event)=>{
    u(event)
  })
}
function $Mouse(output){
  addEventListener("mousemove", event =>{
    output(event);
  })
}
function _CubeMap(width,height,color,output,map){
  map.forEach(m =>{
    output.push(_c(m[0]*width,m[1]*height,width,height,0,color));
  })
}
function CubeClass(width,height,rotation,color){
  this.width = width;
  this.height = height;
  this.color = color;
  this.rotation = rotation;
  this.copy = (x,y,type)=>{
    let comp =  _c(x,y,this.width,this.height,this.rotation,this.color);
    comp.tileType = type;
    return comp;
    
  }
}
function SphereClass(radius, color) {
  this.radius = radius;
  this.color = color;
  this.copy = (x, y) => {
    return _s(x, y, this.radius, this.color);
  }
}
function ImageClass(src,width, height, rotation) {
  this.src = src;
  this.width = width;
  this.height = height;
  this.rotation = rotation;
  this.copy = (x, y) => {
    return _i(src,x, y, this.width, this.height, this.rotation);
  }
}
function ImageSheetClass(src,sx,sy,sw,sh,width,height,rotation) {
  this.src = src;
  this.width = width;
  this.height = height;
  this.sx = sx;
  this.sy = sy;
  this.sw = sw;
  this.sh = sh;
  this.rotation = rotation;
  this.copy = (x, y) => {
    return new ImageSheetSrc(src, x, y, this.width, this.height,this.sx,this.sy,this.sw,this.sh, this.rotation);
  }
}
function CylinderClass(radiusX, radiusY, rotation, color) {
  this.radiusX = radiusX;
  this.radiusY = radiusY;
  this.color = color;
  this.rotation = rotation;
  this.copy = (x, y) => {
    return _cl(x, y, this.radiusX, this.radiusY, this.rotation, this.color);
  }
}
function Animator(){
  this.animationList = [];
  this.playingId = "#EMPTY";
  this.animating = [];
  this.add = (animation)=>{
    this.animationList.push(animation);
  }
  this.play = (name)=>{
    this.animationList.forEach(animation =>{
      if(animation.name == name){
        animation.playing = true;
      }else{
        animation.playing = false;
      }
      if(animation.name == name && animation.tag == "ICA" && animation.playing == true){
        let index = 0;
        animation.component.img.src = animation.spriteArray[animation.index];
        if(animation.type == "#ONE-TIME"){
          if(animation.index < animation.spriteArray.length){
            animation.index++
          }
        }else if(animation.type == "#LOOP"){
          animation.index++
          if(animation.index >= animation.spriteArray.length){
            animation.index = 0;
          }
        }
      }
      if(animation.name == name && animation.tag == "SSA" && animation.playing == true){
        animation.component.img.src = animation.image;
          animation.component.sx = animation.frameX * animation.component.sw;
          animation.component.sy = animation.frameY * animation.component.sh;
          animation.frameX = animation.frame % animation.row;
          animation.frameY = Math.floor(animation.frame / animation.col);
          if(animation.type == "#ONE-TIME"){
          if(animation.frame < animation.maxframe){
            animation.frame++
          }
          }else if(animation.type == "#LOOP"){
            animation.frame++
            if(animation.frame >= animation.maxframe){
              animation.frame = animation.minframe;
            }
          }
      }
      if(animation.name == name && animation.tag == "SLA"){
        animation.component.sy = animation.spriteY;
        animation.component.img.src = animation.image;
          animation.component.sx = animation.frameX*animation.component.sw;
          if(animation.type == "#ONE-TIME"){
            if(animation.frameX < animation.max){
              animation.frameX++;
            }
          }else if(animation.type == "#LOOP"){
            animation.frameX++
            if(animation.frameX >= animation.max){
              animation.frameX = 0;
            }
          }
      }
    })
  }
  this.changeAnimation = (name)=>{
    this.animating.push(name);
  }
  this.start = ()=>{
  this.play(this.animating[this.animating.length-1]);
  };
}
function ImageChangingAnimation(component,type,name,spriteArray){
  this.playing = false;
  this.component = component;
  this.spriteArray = spriteArray;
  this.type = "#LOOP";
  this.name = name;
  this.index = 0;
  this.tag = "ICA";
  this.alphabet = ["-","A","B","C","D","E","F","G","H","re","I","J","K","L","M","N","O","P","de","Q","R","_","S","T","U","V","su","X","Y","Z","_"]
  this.id = this.alphabet[Math.floor(Math.random()*25)]+this.alphabet[Math.floor(Math.random()*25)]+this.alphabet[Math.floor(Math.random()*25)]+this.alphabet[Math.floor(Math.random()*25)]+this.alphabet[Math.floor(Math.random()*25)]+this.alphabet[Math.floor(Math.random()*25)]+""+Math.floor(Math.random()*9999);
  // this.frame = frame;
}
function SpriteSheetAnimation(component,image,name,type,minframe,maxframe,row,col){
  this.playing = true;
  this.image = image;
  this.component = component;
  this.type = type;
  this.name = name;
  this.frame = minframe;
  this.row = row;
  this.col = col;
  this.frameX = 0;
  this.frameY = 0;
  this.minframe = minframe;
  this.maxframe = maxframe;
  this.tag = "SSA";
  this.alphabet = ["-", "A", "B", "C", "D", "E", "F", "G", "H", "re", "I", "J", "K", "L", "M", "N", "O", "P", "de", "Q", "R", "_", "S", "T", "U", "V", "su", "X", "Y", "Z", "_"]
  this.id = this.alphabet[Math.floor(Math.random() * 25)] + this.alphabet[Math.floor(Math.random() * 25)] + this.alphabet[Math.floor(Math.random() * 25)] + this.alphabet[Math.floor(Math.random() * 25)] + this.alphabet[Math.floor(Math.random() * 25)] + this.alphabet[Math.floor(Math.random() * 25)] + "" + Math.floor(Math.random() * 9999);
}
function SpriteLineAnimation(component,image,name,type,spriteY,min,max){
  this.component = component;
  this.image = image;
  this.type = type;
  this.spriteY = spriteY;
  this.frameX = 0;
  this.min = min;
  this.max = max;
  this.name = name;
  this.tag = "SLA";
}
function $Collision(object1,object2,callback = new Function,Ecallback = new Function){
  if(onCollisionEnter(object1,object2)){
    callback(object1,object2)
  }else{
    Ecallback(object1,object2)
  }
}
function ClassMap(classname, output, map) {
  map.forEach(m => {
    output.push(classname.copy(m[0] * classname.width, m[1] * classname.height));
  })
}
function Key(Eventkey,tag,action){
switch(tag){
  case "left" :
      if(Eventkey.keyCode == 37){
        action()
      }
    break;
  case "right":
    if (Eventkey.keyCode == 39) {
      action()
    }
    break;
  case "up":
    if (Eventkey.keyCode == 38) {
      action()
    }
    break;
  case "down":
    if (Eventkey.keyCode == 40) {
      action()
    }
    break;
  default:
    if(Eventkey.key == tag){
      action()
    }
  break;
}
}
function CustomVerticesComponent(x,y,color,vertices){
  this.sides = [];
  this.x = x;
  this.y = y;
  this.color = color;
  this.vertices = vertices;
  this.load = ()=>{
    this.sides = this.vertices(this.x,this.y);
    c.beginPath()
    c.moveTo(this.sides[0][0].x,this.sides[0][0].y)
    for (var i = 1; i < this.sides.length; i++) {
      c.lineTo(this.sides[i][0].x,this.sides[i][0].y);
      c.lineTo(this.sides[i][1].x,this.sides[i][1].y)
    }
    c.fillStyle = this.color;
    c.fill()
    c.closePath()
  }
}
function Time(time,func){
  setInterval(()=>{
    func()
  },time);
}
function lookAt(looker,focus){
  looker.rotation = AxisToAngle(looker.x,looker.y,focus.x,focus.y);
}
function TileMap2C(x,y,class1,class0,gridRows,gridCols,output,map){
  for (var eachRow = 0; eachRow < gridRows; eachRow++) {
    for (var eachCol = 0; eachCol < gridCols; eachCol++) {
      var arrayIndex = eachRow * gridRows + eachCol;
      if (map[arrayIndex] === 1) {
        output.push(class1.copy(class1.width * eachCol + x, class1.height * eachRow + y,"obst"))
      }else if(map[arrayIndex] === 0){
        output.push(class0.copy(class0.width * eachCol + x, class0.height * eachRow + y,"free"))
      }
    }
  }
}
function TileMap3C(x, y, class1, class2, class0, gridRows, gridCols, output, map) {
  for (var eachRow = 0; eachRow < gridRows; eachRow++) {
    for (var eachCol = 0; eachCol < gridCols; eachCol++) {
      var arrayIndex = eachRow * gridRows + eachCol;
      if (map[arrayIndex] === 1) {
        output.push(class1.copy(class1.width * eachCol + x, class1.height * eachRow + y))
      }else if(map[arrayIndex] === 2){
        output.push(class2.copy(class2.width * eachCol + x, class2.height * eachRow + y))
      }else if(map[arrayIndex] === 0){
        output.push(class0.copy(class0.width * eachCol + x, class0.height * eachRow + y))
      }
    }
  }
}
function TileMap5C(x, y, class1, class2,class3,class4,class5, class0, gridRows, gridCols, output, map) {
  for (var eachRow = 0; eachRow < gridRows; eachRow++) {
    for (var eachCol = 0; eachCol < gridCols; eachCol++) {
      var arrayIndex = eachRow * gridRows + eachCol;
      if (map[arrayIndex] === 1) {
        output.push(class1.copy(class1.width * eachCol + x, class1.height * eachRow + y))
      }else if(map[arrayIndex] === 2){
        output.push(class2.copy(class2.width * eachCol + x, class2.height * eachRow + y))
      }else if (map[arrayIndex] === 3) {
        output.push(class3.copy(class3.width * eachCol + x, class3.height * eachRow + y))
      }else if (map[arrayIndex] === 4) {
        output.push(class4.copy(class4.width * eachCol + x, class4.height * eachRow + y))
      }else if (map[arrayIndex] === 5) {
        output.push(class5.copy(class5.width * eachCol + x, class5.height * eachRow + y))
      }else if(map[arrayIndex] === 0){
        output.push(class0.copy(class0.width * eachCol + x, class0.height * eachRow + y))
      }
    }
  }
}
// function 
function Triangle(x,y,radius,r,color){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.rotation = r;
  this.color = color;
  this.sides = [];
  this.load = ()=>{
    this.sides = [
     [{x:this.x-radius,y:this.y-this.radius},{x:this.x+radius,y:this.y-this.radius}],
     [{x:this.x+this.radius,y:this.y-radius},{x:this.x,y:this.y+this.radius}],
     [{x:this.x,y:this.y+this.radius},{x:this.x-this.radius,y:this.y-this.radius}],
      ];
     c.beginPath()
     c.moveTo(this.sides[0][0].x,this.sides[0][0].y);
     c.lineTo(this.sides[0][1].x,this.sides[0][1].y);
     c.lineTo(this.sides[1][0].x,this.sides[1][0].y);
     c.lineTo(this.sides[1][1].x,this.sides[1][1].y);
     c.lineTo(this.sides[2][0].x,this.sides[2][0].y);
     c.lineTo(this.sides[2][1].x,this.sides[2][1].y);
     c.fillStyle = this.color;
    // c.strokeStyle = this.color;
    // c.stroke()
     c.fill()
     c.closePath()
   }
} 
function CubeX(x, y, w, h, r, color) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.type = "CUBE";
  this.color = color;
  this.rotation = 0;
  this.extraX = 0;
  this.extraY = 0;
  this.sides;
  this.load = () => {
    this.extraX = Math.cos(this.rotation);
    this.extraY = Math.sin(this.rotation);
    this.sides = [
      [{ x: this.x, y: this.y}, { x: this.x, y: this.y + this.height},'left'],[
      { x: this.x + this.width, y: this.y}, { x: this.x + this.width, y: this.y + this.height},'right'],
      [{ x: this.x, y: this.y}, { x: this.x + this.width, y: this.y},'top'],
      [{ x: this.x, y: this.y + this.height}, { x: this.x + this.width, y: this.y + this.height},'bottom'],
      ];
    c.beginPath()
    c.fillStyle = this.color;
    c.moveTo(this.sides[0][0].x,this.sides[0][0].y);
    c.lineTo(this.sides[0][1].x,this.sides[0][1].y)
    c.lineTo(this.sides[1][0].x,this.sides[1][0].y);
    c.lineTo(this.sides[1][1].x,this.sides[1][1].y)
    c.lineTo(this.sides[2][0].x,this.sides[2][0].y);
    c.lineTo(this.sides[2][1].x,this.sides[2][1].y)
    c.lineTo(this.sides[3][0].x,this.sides[3][0].y);
    c.lineTo(this.sides[3][1].x,this.sides[3][1].y)
    c.fill()
    c.closePath()
  }
}
function Polygon(x,y,side,radius,color){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.side = side;
  this.color = color;
  this.angle = Math.PI/2;
  this.sides = [];
  this.points = [];
  this.load = ()=>{
    c.beginPath()
  for (var i = 0; i <= this.side; i++) {
    let px = this.x + this.radius * Math.cos(this.angle);
    let py = this.y + this.radius * Math.sin(this.angle);
    if(i == 0){
      c.moveTo(px,py)
      // this.sides.push([{px},{py}])
    }else{
      c.lineTo(px,py);
      // this.sides.push([{x:this.points[i-1].x,y:this.points[i-1]},{x:px,y:py}])
    }
    this.points.push({x:px,y:py});
    c.fillStyle = this.color;
    c.fill()
    this.angle += Math.PI*2/this.side;
  } 
  }
}
function PolygonLine(x, y, side, radius,lineWidth, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.side = side;
  this.color = color;
  this.points = [];
  this.sides = [];
  this.lineWidth = lineWidth;
  this.angle = Math.PI / 2;
  this.load = () => {
    c.beginPath()
    for (var i = 0; i <= this.side; i++) {
      let px = this.x + this.radius * Math.cos(this.angle);
      let py = this.y + this.radius * Math.sin(this.angle);
      if (i == 0) {
        c.moveTo(px, py)
      } else {
        c.lineTo(px, py);
        this.sides.push([{x:this.points[i-1].x,y:this.points[i-1].y},{x:px,y:py}])
      }
      this.points.push({x:px,y:py})
      c.strokeStyle = this.color;
      c.lineWidth = this.lineWidth;
      c.stroke()
      this.angle += Math.PI * 2 / this.side;
    }
  }

}
function polygonC(x, y, r, s,color) {
  var a = Math.PI * 3 / 2;
  var points = [];
  var sides = []; // [[{x,y},{x,y}], ...] 
  var max = { x: 0, y: 0 };
  var min = { x: Infinity, y: Infinity };
  c.beginPath();
  for (var i = 0; i <= s; i++){
    var px = x + r * Math.cos(a),py = y + r * Math.sin(a);
    if (i === 0) { 
      c.moveTo(px, py); 
    } else {
      c.lineTo(px, py);
      sides.push([{ x: points[i - 1].x, y: points[i - 1].y }, { x: px, y: py }]) 
    }
    if(px > max.x) {
      max.x = px; 
    }if (py > max.y){
      max.y = py; 
    }
    if (px < min.x) {
      min.x = px;
     }
    if (py < min.y) {
      min.y = py; 
    }
    points.push({ x: px, y: py });
    a += Math.PI * 2 / s; }
    points.pop();
  c.strokeStyle = color;
  c.lineWidth = 2;
  c.stroke();
  return { p: points, sides: sides, max, min };
}
function lerp(A,B,t){
  return A+(B-A)*t;
}
function SegmentIntersectionPoint(a,b,c,d){
  var tTop = (d.x-c.x)*(a.y-c.y)-(d.y-c.y)*(a.x-c.x)
  var uTop = (c.y-a.y)*(a.x-b.x)-(c.x-a.x)*(a.y-b.y);
  var bottom = (d.y-c.y)*(b.x-a.x)-(d.x-c.x)*(b.y-a.y);
  if(bottom != 0){
    let t = tTop/bottom;
    let u = uTop/bottom;
    if(t >= 0 && t <= 1 && u >= 0 && u <= 1){
      return {
        x : lerp(a.x,b.x,t),
        y : lerp(a.y,b.y,t),
        offset : t
      }
    }
  }
  return null;
}
function lineCollision(c1,c2){
  let con = SegmentIntersectionPoint({ x: c1.startX, y: c1.startY }, { x: c1.endX, y: c1.endY }, { x: c2.startX, y: c2.startY }, { x: c2.endX, y: c2.endY });
  return con;
}
function intersect(s1, s2) {
  if (
    ((s2[1].x - s2[0].x) * (s1[0].y - s1[1].y) - (s1[0].x - s1[1].x) * (s2[1].y - s2[0].y)) === 0
  ) {
    return 'collinear';
  }
  var tA = ((s2[0].y - s2[1].y) * (s1[0].x - s2[0].x) + (s2[1].x - s2[0].x) * (s1[0].y - s2[0].y)) / ((s2[1].x - s2[0].x) * (s1[0].y - s1[1].y) - (s1[0].x - s1[1].x) * (s2[1].y - s2[0].y)),
    tB = ((s1[0].y - s1[1].y) * (s1[0].x - s2[0].x) + (s1[1].x - s1[0].x) * (s1[0].y - s2[0].y)) / ((s2[1].x - s2[0].x) * (s1[0].y - s1[1].y) - (s1[0].x - s1[1].x) * (s2[1].y - s2[0].y));
  return [tA, tB];
}
function onCollisionDetect(p1, p2) {
  for (var i in p1.sides) {
    for (var j in p2.sides){
      var t = intersect(p1.sides[i], p2.sides[j]);
      if (t === 'collinear'){continue;}
      if(t[0] <= 1 && t[0] >= 0 && t[1] <= 1 && t[1] >= 0){
        return {
          object1:{
            direction : p1.sides[i][2],
            line : p1.sides[i]
          },
          object2:{
            direction : p2.sides[j][2],
            line : p2.sides[j]
          }
        }
    }
    }
  }
  return false; 
}
function $(id){
  let a = document.getElementById(id);
  return a;
}
var COLOR = {
  none : "transparent"
}
function Direction(x,y,length){
  this.x = x;
  this.y = y;
  this.length = length;
  this.sides = [];
  this.load = ()=>{
    this.sides =  [
      [{x:this.x,y:this.y},{x:this.x+this.length,y:this.y},'right'],
      [{x:this.x,y:this.y},{x:this.x-this.length,y:this.y},'left'],
      [{x:this.x,y:this.y},{x:this.x,y:this.y-this.length},'top'],
      [{x:this.x,y:this.y},{x:this.x,y:this.y+this.length},'down'],
      ]
    // left
    c.moveTo(this.x,this.y)
    c.lineTo(this.x+this.length,this.y)
    // right
    c.moveTo(this.x,this.y)
    c.lineTo(this.x-this.length,this.y)
    //top
    c.moveTo(this.x,this.y)
    c.lineTo(this.x,this.y-this.length)
    //down
    c.moveTo(this.x, this.y)
    c.lineTo(this.x, this.y + this.length)
    c.strokeStyle = "red";
    c.lineWidth = 3;
    c.stroke()
  }
}
function position(x,y){
  return {
    x : x,
    y : y,
  }
}

function pathTo(node) {
  var curr = node;
  var path = [];
  while (curr.parent) {
    path.unshift(curr);
    curr = curr.parent;
  }
  return path;
}
function getHeap() {
  return new BinaryHeap(function(node) {
    return node.f;
  });
}
var pathfinding = {
  search: function(graph, start, end, options) {
    graph.cleanDirty();
    options = options || {};
    var heuristic = options.heuristic || pathfinding.heuristics.manhattan;
    var closest = options.closest || false;
    var openHeap = getHeap();
    var closestNode = start;
    start.h = heuristic(start, end);
    graph.markDirty(start);
    openHeap.push(start);
    while (openHeap.size() > 0) {
      var currentNode = openHeap.pop();
      if (currentNode === end) {
        return pathTo(currentNode);
      }
      currentNode.closed = true;
      var neighbors = graph.neighbors(currentNode);
      for (var i = 0, il = neighbors.length; i < il; ++i) {
        var neighbor = neighbors[i];
        if (neighbor.closed || neighbor.isWall()) {
          continue;
        }
        var gScore = currentNode.g + neighbor.getCost(currentNode);
        var beenVisited = neighbor.visited;
        if (!beenVisited || gScore < neighbor.g) {
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || heuristic(neighbor, end);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
          graph.markDirty(neighbor);
          if (closest) {
            if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
              closestNode = neighbor;
            }
          }
          if (!beenVisited) {
            openHeap.push(neighbor);
          } else {
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }
    if (closest) {
      return pathTo(closestNode);
    }
    return [];
  },
  heuristics: {
    manhattan: function(pos0, pos1) {
      var d1 = Math.abs(pos1.x - pos0.x);
      var d2 = Math.abs(pos1.y - pos0.y);
      return d1 + d2;
    },
    diagonal: function(pos0, pos1) {
      var D = 1;
      var D2 = Math.sqrt(2);
      var d1 = Math.abs(pos1.x - pos0.x);
      var d2 = Math.abs(pos1.y - pos0.y);
      return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
    }
  },
  cleanNode: function(node) {
    node.f = 0;
    node.g = 0;
    node.h = 0;
    node.visited = false;
    node.closed = false;
    node.parent = null;
  }
};
function Graph(gridIn, options) {
  options = options || {};
  this.nodes = [];
  this.diagonal = !!options.diagonal;
  this.grid = [];
  for (var x = 0; x < gridIn.length; x++) {
    this.grid[x] = [];

    for (var y = 0, row = gridIn[x]; y < row.length; y++) {
      var node = new GridNode(x, y, row[y]);
      this.grid[x][y] = node;
      this.nodes.push(node);
    }
  }
  this.init();
}
Graph.prototype.init = function() {
  this.dirtyNodes = [];
  for (var i = 0; i < this.nodes.length; i++) {
    pathfinding.cleanNode(this.nodes[i]);
  }
};
Graph.prototype.cleanDirty = function() {
  for (var i = 0; i < this.dirtyNodes.length; i++) {
    pathfinding.cleanNode(this.dirtyNodes[i]);
  }
  this.dirtyNodes = [];
};
Graph.prototype.markDirty = function(node) {
  this.dirtyNodes.push(node);
};
Graph.prototype.neighbors = function(node) {
  var ret = [];
  var x = node.x;
  var y = node.y;
  var grid = this.grid;
  if (grid[x - 1] && grid[x - 1][y]) {
    ret.push(grid[x - 1][y]);
  }
  if (grid[x + 1] && grid[x + 1][y]) {
    ret.push(grid[x + 1][y]);
  }
  if (grid[x] && grid[x][y - 1]) {
    ret.push(grid[x][y - 1]);
  }
  if (grid[x] && grid[x][y + 1]) {
    ret.push(grid[x][y + 1]);
  }
  if (this.diagonal) {
    if (grid[x - 1] && grid[x - 1][y - 1]) {
      ret.push(grid[x - 1][y - 1]);
    }
    if (grid[x + 1] && grid[x + 1][y - 1]) {
      ret.push(grid[x + 1][y - 1]);
    }
    if (grid[x - 1] && grid[x - 1][y + 1]) {
      ret.push(grid[x - 1][y + 1]);
    }
    if (grid[x + 1] && grid[x + 1][y + 1]) {
      ret.push(grid[x + 1][y + 1]);
    }
  }
  return ret;
};

Graph.prototype.toString = function() {
  var graphString = [];
  var nodes = this.grid;
  for (var x = 0; x < nodes.length; x++) {
    var rowDebug = [];
    var row = nodes[x];
    for (var y = 0; y < row.length; y++) {
      rowDebug.push(row[y].weight);
    }
    graphString.push(rowDebug.join(" "));
  }
  return graphString.join("\n");
};
function GridNode(x, y, weight) {
  this.x = x;
  this.y = y;
  this.weight = weight;
}
GridNode.prototype.toString = function() {
  return "[" + this.x + " " + this.y + "]";
};
GridNode.prototype.getCost = function(fromNeighbor) {
  if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
    return this.weight * 1.41421;
  }
  return this.weight;
};
GridNode.prototype.isWall = function() {
  return this.weight === 0;
};
function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}
BinaryHeap.prototype = {
  push: function(element){
    this.content.push(element);
    this.sinkDown(this.content.length - 1);
  },
  pop: function() {
    var result = this.content[0];
    var end = this.content.pop();
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  },
  remove: function(node) {
    var i = this.content.indexOf(node);
    var end = this.content.pop();
    if (i !== this.content.length - 1) {
      this.content[i] = end;

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  },
  size: function() {
    return this.content.length;
  },
  rescoreElement: function(node) {
    this.sinkDown(this.content.indexOf(node));
  },
  sinkDown: function(n) {
    var element = this.content[n];
    while (n > 0) {
      var parentN = ((n + 1) >> 1) - 1;
      var parent = this.content[parentN];
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
      }
      else {
        break;
      }
    }
  },
  bubbleUp: function(n) {
    var length = this.content.length;
    var element = this.content[n];
    var elemScore = this.scoreFunction(element);
    while (true) {
      var child2N = (n + 1) << 1;
      var child1N = child2N - 1;
      var swap = null;
      var child1Score;
      if (child1N < length) {
        var child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);
        if (child1Score < elemScore) {
          swap = child1N;
        }
      }
      if (child2N < length) {
        var child2 = this.content[child2N];
        var child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      else {
        break;
      }
    }
  }
};
function FollowCoordinate(component,location,speed){
 if(component.x == location.x && component.y == location.y){
 return true;
 }else{
  if(component.x < location.x){
   component.x+=speed;
  }else if(component.x > location.x){
    component.x-=speed;
  }
  if(component.y < location.y){
    component.y+=speed;
  }else if(component.y > location.y){
    component.y-=speed;
  }
 }
}
function AI(){
  this.graph;
  this.path = [];
  this.setMap = (map)=>{
    this.graph = new Graph(map);
  }
  this.find = (start,end,area = 1)=>{
    let startM = this.graph.grid[start.y][start.x];
    let endM = this.graph.grid[end.y][end.x];
    let result = pathfinding.search(this.graph,startM,endM);
    result.forEach(g=>{
      this.path.push([g.parent.y*area,g.parent.x*area]);
    })
    return result;
  }
}
var index = 0;
function MoveByArray(player,path,speed){
  if(path.length > 0){
  if(player.x === path[index][0] && player.y === path[index][1]){
    if(index < path.length-1){
    index++
  }
  }else{
    FollowCoordinate(player,position(path[index][0],path[index][1]),speed)
  }
}
}
function angleObject(x,y,Srad,Erad,color,angle,speed,min,vx,vy){
 this.speed = speed;
 this.angle = angle;
 this.Erad = Erad;
 this.x = x;
 this.y = y;
//  AllElementStorage.push(this)
 this.color = color;
 this.Srad = Srad;
 this.gravity = 0;
 this.min = min;
 this.body = new Sphere(this.x,this.y,this.Srad,this.color);
 this.vx = vx;
 this.vy = vy; 
 this.load = ()=>{
  this.body.load()
  this.body.x+= this.speed*AngleToAxis(this.angle+Math.random()*this.vx).x;
  this.body.y+= this.gravity + this.speed*AngleToAxis(this.angle+Math.random()*this.vy).y;
  if(this.body.radius > this.Erad+0.1){
    this.body.radius-=this.min;
  }else if(this.body.radius < this.Erad){
    this.body.radius+=this.min;
  }
 }
}
function AngleParticle(x,y,startRadius,endRadius,color,angle,speed,min,amount,vx,vy){
  this.x = x;
  this.y = y;
  this.min = min;
  this.startRadius = startRadius;
  this.endRadius = endRadius;
  this.color = color;
  this.angle = angle;
  // AllElementStorage.push(this)
  this.speed = speed;
  this.length;
  this.amount = amount;
  this.maxAngle = 25;
  this.store = [];
  this.centerPoint = new Sphere(centerX,centerY,10,"red");
  this.load = ()=>{
    this.centerPoint.x = this.x;
    this.centerPoint.y = this.y;
    this.centerPoint.color = this.color;
    this.centerPoint.radius = this.startRadius;
    this.length = {
      value : this.store.length,
      log : ()=>{
        console.log(this.store.length);
      }
    }
    _(this.store);
    // this.centerPoint.load()
    if(this.amount > 0){
    for (let i = 0; i < this.maxAngle; i++) {
      this.store.push(new angleObject(this.x,this.y,this.startRadius,this.endRadius,this.color,i*(this.angle/this.maxAngle),this.speed,this.min,vx,vy)); 
      if(this.store[0].body.radius < this.min){
      this.store.splice(0,1);
      }
    }
    this.amount--;
  }else{
    Destroy(this.centerPoint);
  }
  }
}
function MouseDown(func){
  addEventListener("mousedown",e=>{
    func(e)
  })
}
function __(list = [],func = ()=>{}){
 list.forEach(val=>{
  func(val)
 })
}
function dragable(component){
  let cdn = false;
  let vx = 0;
  let vy = 0;
  addEventListener("mousedown",(e)=>{
    cdn = true;
    vx = mouse.x + component.radius;
    vy = mouse.y + component.radius;
  });
  addEventListener("mousemove",e=>{
    if(cdn == true && component.touch()){
      component.x = mouse.x;
      component.y = mouse.y;
    }
  })
  addEventListener("mouseup",()=>{cdn = false});
}
function pointCal(component){
 return Math.floor(Math.abs(((component.x-component.y)+(component.x+component.y)/(component.x+component.y/4))))
}
function middle(a,b){
  return (a+b)/2;
}
function InlinePhysics(){
  this.gravity = 0;
  this.gSpeed = 0.1;
  this.elements = [];
  this.start = ()=>{
    this.gravity = this.gravity+this.gSpeed;
    __(this.elements,e=>{
      e.force = e.force + this.gSpeed;
      e.y += e.force;
      e.x+=3;
      e.rotation+=e.force;
    })
  }
  this.setGravity = (element)=>{
    this.elements.push(element);
  }
}
function Ray(start,cust = [0,0,0,0]){
  this.body = new Line(0,0,0,0,2,COLOR.none);
  this.visiblity = false;
  this.load = ()=>{
    this.body.startX = start.x+cust[0];
    this.body.startY = start.y+cust[1];
    this.body.endX = start.x+cust[2];
    this.body.endY = start.y+cust[3];
    _([this.body])
  }
  this.show = (color)=>{
    this.body.color = color;
  }
}
function Cast(){
  this.check = (ray,obstacle = [],action = ()=>{},preAction = ()=>{})=>{
    obstacle.forEach(obs=>{
      if(onCollisionDetect(ray.body,obs)){
        action(obs)
      }else{
        preAction(obs)
      }
    })
  }
}
