//Create variables here
var dog, happyDog, deadDog;
var dogSprite
var database;
var localFoodCnt, foodStock;
var feedPet, addFood;
var fedTime, lastFed;
var food;
var gameState, readGameState;
var bedroom, garden, washroom;
var currentTime;

function preload(){
  //load images here
  dog = loadImage("virtualPetImages/dog.png");
  happyDog = loadImage("virtualPetImages/happyDog.png");
  deadDog = loadImage("virtualPetImages/deadDog.png");
  bedroom = loadImage("virtualPetImages/BedRoom.png");
  garden = loadImage("virtualPetImages/Garden.png");
  washroom = loadImage("virtualPetImages/WashRoom.png");
}

function setup() {

  var config = {
    apiKey: "AIzaSyA5LGtnkDLTJkFsNyjMHST_MtlU9pLROIU",
    authDomain: "virtual-pet-e63a7.firebaseapp.com",
    databaseURL: "https://virtual-pet-e63a7.firebaseio.com",
    projectId: "virtual-pet-e63a7",
    storageBucket: "virtual-pet-e63a7.appspot.com",
    messagingSenderId: "128263651741",
    appId: "1:128263651741:web:4b21ebf73cca942d10ef74"
  }

  food = new Food(50,250,10,10);
  firebase.initializeApp(config);
  database = firebase.database();
  
  
 

  readGameState = database.ref('gameState');
  readGameState.on("value", function(data){
    gameState = data.val();
  });

  feed = createButton("Feed the dog");
  feed.position(650,95);
  feed.mousePressed(feedDog);
 
  addFood = createButton("Add Food");
  addFood.position(750,95);
  addFood.mousePressed(addFoodDog);

  
  createCanvas(500, 500);

  dogSprite = createSprite(420,250);
  dogSprite.addImage(dog, "dog.png");
  dogSprite.scale = 0.2;
  foodStock = database.ref('food');
  foodStock.on("value", readStock);
}

function draw(){  
  background(46, 139, 87);

 fedTime = database.ref('FeedTime');
 fedTime.on("value", function(data){
    lastFed = data.val();
  });

  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dogSprite.remove();
  }else{
    feed.show(); 
    addFood.show();
    dogSprite.addImage(deadDog);
  }

  currentTime = hour();
  if(currentTime == (lastFed + 1)){
    update("Playing");
    food.garden();
  }else if (currentTime == (lastFed + 2)){
    update("Sleeping");
    food.bedroom();
  }else if (currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    update("Bathing");
    food.washroom();
  }else{
    update("Hungry")
    food.display();
  }

fill(255,255,254);
textSize(15);
if(lastFed >= 12){
  text("Last Feed :" + lastFed % 12 + "PM", 350,30);
}else if (lastFed == 0){
  text(" Last Feed : 12 AM")
}else{
  text(" Last Feed : " + lastFed + "AM", 350,30);
}

  food.display();
  drawSprites();
}

function feedDog(){
  dogSprite.addImage(happyDog, "happydog.png");

  food.updateFoodStock(food.getFoodStock() - 1);
  database.ref('/').update({
    foodS:food.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoodDog(){
  localFoodCnt = food.getFoodStock();
  localFoodCnt ++ ;
  database.ref('/').update({
    foodS:localFoodCnt
  })
  food.updateFoodStock(localFoodCnt);
}

function readStock(data) {
  foodS = data.val()
}

function writeStock(x) {
  database.ref('/').update({
    foodS:x
  })

  if(x<=0){
    x=0;
  } else {
    x=x-1;
  }
}

function update(state){
  database.ref('/').update({
    gameState:state
  });

}
