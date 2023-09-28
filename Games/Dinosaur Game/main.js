// {"name": "Dinossaur Game", "author": "Daviz7", "version": "0.1", "icon": "icon.png", "file": "main.js", "description": "Jogo do dinossauro do chrome "}
import { debug, GoBrowser } from  "../../Assets/sys.js";
const canvas = Screen.getMode();
canvas.width = 640;
canvas.height = 448;
Screen.setMode(canvas);
var path = System.boot_path + "Games/Dinosaur_Game/";
var font = new Font();
var colors = {
  White: Color.new(255,255,255),
  Black: Color.new(0,0,0)
}
font.color = colors.Black;
var fl = 0;
var fl2 = 1;
var floors = [
  new Image(path + "assets/floor_0.png"),
  new Image(path + "assets/floor_1.png")
  ];
var dino = new Image(path + "assets/dino.png");
var gamestarted = false;
var floorx = 0;
var floor2x = 0;
var dino_info = {x:100,y:375};
var pad = Pads.get();
function animation(anim) {
  if(anim == 0) {
    dino.startx =  0;
    dino.starty =  0;
    dino.width = 45;
    dino.height = 48;
  }
}
animation(0);
class game {
  play() {
    if(pad.justPressed(Pads.START) && !gamestarted) {
      gamestarted = true;
    }
    if(!gamestarted) {
      let size = font.getTextSize("PRESS START");
      font.print(canvas.width/2-size.width/2,canvas.height/2-size.height/2,"PRESS START");
    }
    floorx++;
    floor2x++;
    if(floorx >= -645) {
      floorx = 0;
    }
    if(floor2x >= -645) {
      floor2x = 0;
    }
    dino.draw(dino_info.x,dino_info.y);
    floors[fl].draw(floorx,328);
    floors[fl2].draw(floor2x,328);
  }
}
const gameInstance = new game();
os.setInterval(() => {
  Screen.clear(colors.White);
  GoBrowser();
  gameInstance.play();
  debug();
  Screen.flip();
},0);