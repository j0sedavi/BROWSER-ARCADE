//------BROWSER ARCADE-----
//Criador:Davi
//Designer: Raf
//Tester: YgorSan
//programador 2: NGM MODS
//themes: Saymon
//importando sistemas
import { games } from "./Games/GameList.js";
import { GoBrowser, debug ,GoBrowserPS2 } from "./Assets/sys.js";
import { ptbr, eng, spanish } from "./Assets/Languages.js";
import { config } from "./Assets/config.js"
import * as textAthena from './modules/text.js';
var idioma = ptbr;
const canvas = Screen.getMode();
canvas.width = 640; //largura da Tela
canvas.height  = 448; //altura da Tela
Screen.setMode(canvas);
var fontsPath = []
var file_th = std.open("Themes/" + config.theme + "/config.json","r")
var Theme = std.parseExtJSON(file_th.readAsString());
const version = "0.5 DEMO (10/09/2023)"
const font = new Font(); 
const pixel = new Font("Assets/Fonts/pixel.ttf");
const fontf = new Font("Assets/Fonts/pixel.ttf");
const fontf2 = new Font("Assets/Fonts/pixel.ttf");
const atl = new Font("Assets/Fonts/pixel.ttf");
const code_bold = new Font("Assets/Fonts/code_bold.otf");
const colors = { //colors
  Black:Color.new(0,0,0),
  White:Color.new(255,255,255),
  Gray:Color.new(81, 79, 87),
  BlueLight:Color.new(74, 112, 218)
};
var imagesList_current = new ImageList();
var current_Images = null;
// var imgList = {
//   config: {
//     interface:new Image(gImage(Theme.config_int),RAM,imagesList_current),
//   },
//   info: {
//     interface: new Image(gImage(Theme.information_interface),RAM,imagesList_current),
//   },
//   others: {
//     interface:new Image(gImage(Theme.alternative_interface),RAM,imagesList_current),
//   }
// }
var Images = {
  bg:new Image(gImage(Theme.Background_Image)), //Background 
  interface:new Image(gImage(Theme.main_interface)), //interface 
  conf:new Image(gImage(Theme.config_int)),
  interface2:new Image(gImage(Theme.alternative_interface)),
  ld: new Image(gImage(Theme.background_loading)),
  logo: new Image("Assets/Image/Logo.png"),
  inf: new Image(gImage(Theme.information_interface)),
  noic: new Image("Assets/Image/noicon.png")
}
var pad = Pads.get();
var Alert_Info = {
  title: null,
  description: null,
  scr: null
}
var arquiv = 0;
var th_name = null;
var info_v = {
  loc: null,
  author: null,
  version: null,
  description: null,
  name: null,
  bg: null
};
var paths = {
  games: "Games/",
  temas: "Themes/"
};
var file = {
  game: System.listDir(System.boot_path + paths.games),
  tema: System.listDir(System.boot_path + paths.temas)
};
var tm = {
  img1: null,
  img2: null,
  s1: false,
  s2: false
}
var screen = 7; 
var options = {
  1: {
    c: colors.White
  },
  2: {
    c: colors.White
  },
  3: {
    c: colors.White
  },
  4: {
    c: colors.White
  },
  5: {
    c: colors.White
  },
  6: {
    c: colors.White
  }
}
var option = 1;
var optionsIdioma = [];
var optionIdioma = 1;
var progress = 0;  
//iniciando variáveis
var slot1 = null
var slot2 = null
//funções
function gImage(img) {
  return "Themes/" + config.theme + "/" + img;
}
function createSlot(x,y,item,img) {
  return {
    x,
    y,
    s: false,
    item,
    img: null,
  };
}
function removerAcentos(palavra) {
  const mapaAcentos = {
    'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
    'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
    'ç': 'c',
  };

  return palavra.replace(/[áàâãäéèêëíìîïóòôõöúùûüç]/g, function (letra) {
    return mapaAcentos[letra];
  });
}
function splitStringByLine(inputString, charsPerLine) {
  let result = "";
  
  for (let i = 0; i < inputString.length; i += charsPerLine) {
    result += inputString.slice(i, i + charsPerLine) + "\n";
  }
  
  return result;
}
function drawLoadingBalls(progress) {
  const numBalls = 8;
  const radius = 20;
  const xPos = (Theme.loading_ball.y === true) ? canvas.width - 40 : Theme.loading_ball.y;

  const yPos = (Theme.loading_ball.y === true) ? canvas.height - 40 : Theme.loading_ball.y;
  const angleIncrement = (Math.PI * 2) / numBalls;
  const rotationSpeed = 0.5; 
  for (let i = 0; i < numBalls; i++) {
    const angle = angleIncrement * i + progress * rotationSpeed;
    const x = xPos - Math.cos(angle) * radius; 
    const y = yPos - Math.sin(angle) * radius;

    Draw.circle(x, y, 4, colors.White);
  }
}
function Acalert(screenc,tc,dc) {
      Alert_Info.scr = screenc;
      screen = 99;
      Alert_Info.title = tc;
      Alert_Info.description = dc;
}
function getInfoGame(str,gameid) {
  let local = games[gameid].location;
  let app_d = std.open(local, "r");
  let mdata_str = app_d.getline().replace("// ", "");
  app_d.close();
  let mdata = JSON.parse(mdata_str);
  let result_get = null;
  result_get = {
  "name": mdata.name,
  "icon": local.replace(mdata.file, "") + mdata.icon,
  "file": mdata.file,
  "description": mdata.description,
  "author": mdata.author,
  "version": mdata.version
  }[str];
  return result_get;
}
function setSlot(slot,s,image,item) {
  let slot_F = null
  if(slot === null) {
    return;
  }else{
  let slots = {
  1: slot1,
  2: slot2
  };
  slot_F = slots[slot];
  if (!slot_F) return;
  }
   slot_F.img = image === null ? null : new Image(image);
   slot_F.s = s === null ? null : s;
   slot_F.item = item === null? null : item;
}
function initialize() {
  slot1 = createSlot(Theme.slot1.x,Theme.slot1.y,0);
  slot2 = createSlot(Theme.slot2.x,Theme.slot2.y,1);
  for(let i = 0; i < 4; i++){
  optionsIdioma.push(colors.White);
  }
  switch (games.length) {
    case 0:
      setSlot(1,false);
      setSlot(2,false);
      break;
    case 1:
      setSlot(1,true,getInfoGame("icon" ,0))
      setSlot(2,false)
      break;
    default:
      setSlot(1,true,getInfoGame("icon" ,0))  
      setSlot(2,true,getInfoGame("icon" ,1))
      break;
  }
  slot2.img.width = 172;
  slot2.img.height = 107;
  pixel.scale = 1.2;
  atl.scale = 0.7;
  slot1.img.width = 243;
  slot1.img.height = 151;
  slot2.img.width = 172;
  slot2.img.height = 107;
  fontf2.scale = 0.6;
  code_bold.scale = 0.7;
  font.scale = 0.7;
}
function setCurrentImagesScreen(screen_value) {
  if(screen_value !== null) {
    imagesList_current = new ImageList();
  }
  switch(screen_value) {
    case 0: 
      current_Images = {
        bg:new Image(gImage(Theme.Background_Image),RAM,imagesList_current),
        interface: new Image(gImage(Theme.main_interface),RAM,imagesList_current),
      noicon: new Image("Assets/Image/noicon.png",RAM,imagesList_current)
      }
      break;
    case 7: 
      current_Images = {
        bgloading: new Image(gImage(Theme.background_loading),RAM,imagesList_current),
        logo: new Image("Assets/Image/Logo.png",RAM,imagesList_current)
      }
      break;
  }
}
function drawImageScreen(image,x,y) {
  if(image.ready()) {
    image.draw(x,y);
  }
}
class UI {
  setScreen(screen_value) {
    switch (screen_value) {
      case 0:
        setCurrentImagesScreen(0);
        imagesList_current.process();
        screen = 0;
        break;
      
      case 7:
        setCurrentImagesScreen(7);
        imagesList_current.process();
        screen = 7;
        break;
      
      default:
        screen = 0;
    }
  }
  LoadScreen() {
  switch (screen) {
    case 0:
      this.main();
      break;
    case 1:
      this.config();
      break;
    case 2:
      this.atalhos()
      break;
    case 3:
      this.informs();
      break;
    case 4:
      this.addGame();
      break;
    case 5:
      this.temas();
      break;
    case 6:
      this.idiomas();
      break;
    case 7:
      this.loading();
      break;
    case 8:
      this.info();
      break;
    case 9:
      this.viewTema();
      break;
    case 10:
      this.Gamesoption();
      break;
    case 11:
      this.removegame();
      break;
    
    case 99:
      this.alert();
      break;
   
  }
  }
  Move() {
    //DOWN
    
    pad.update();
    if(pad.justPressed(Pads.DOWN) && slot2.s == true) {
      slot1.img = new Image(getInfoGame("icon" ,slot2.item))
      slot1.item = slot2.item;
      let prox = slot2.item + 1;
      if(games.hasOwnProperty(prox.toString())){
      slot2.img = new Image(getInfoGame("icon" ,prox))
      slot2.item = prox;
      }else{
      slot2.item = prox;
      setSlot(2,false,"Assets/Image/noicon.png")
    }
  }
  //UP
  if(pad.justPressed(Pads.UP) && slot1.item !== 0) {
      setSlot(2,true,getInfoGame("icon" ,slot1.item))
      slot2.item = slot1.item;
      let prox = slot1.item - 1;
      if(games.hasOwnProperty(prox.toString())){
      slot1.img = new Image(getInfoGame("icon" ,prox))
      setSlot(1,true,getInfoGame("icon" ,prox))
      slot1.item = prox;
      }else{
      setSlot(1,false,"Assets/Image/noicon.png")
      slot1.item = prox;
    }
  }
  }
  loadSlots() {
    if(slot1.s == true) {
    slot1.img.draw(slot1.x,slot1.y); 
    }
    if(slot2.s == true) {
    slot2.img.draw(slot2.x,slot2.y); 
    }
  }
  main() {
    drawImageScreen(current_Images.bg,0,0)
    drawImageScreen(current_Images.interface,0,0)
    this.Move();
    this.loadSlots();
    if(Theme.Select_Text.enable) {
    font.print(Theme.Select_Text.x,Theme.Select_Text.y,idioma[0])
    }
    if(Theme.game_name.enable) {
      font.print(Theme.game_name.x,Theme.game_name.y,getInfoGame("name",slot1.item))
    }
    if(pad.justPressed(Pads.START)) {
      slot1.img = new Image(getInfoGame("icon",slot1.item));
      slot2.img = new Image(getInfoGame("icon",slot2.item));
    }
    if(games.length == 0) {
      slot1.s = false;
      slot1.item = 0;
      slot2.item = 0;
      slot2.s = false;
    }
    if(pad.justPressed(Pads.CROSS) && slot1.s == true) {
      screen = 8;
      slot1.img.width = 670;
      slot1.img.height = 448;
      info_v.name = getInfoGame("name",slot1.item);
      info_v.author = getInfoGame("author",slot1.item);
      info_v.description = getInfoGame("description",slot1.item);
      info_v.version = getInfoGame("version",slot1.item);
    }
    if(pad.justPressed(Pads.L1)) {
      screen = 1;
    }
  }
  config() {
    pad.update();
    if(pad.justPressed(Pads.DOWN) && option !== 6) {
      option++;
      for (let i = 1; i <= 7; i++) {
      options[i].c = colors.White;
      }
    }
    if(pad.justPressed(Pads.UP) && option !== 1) {
      option--;
     for (let i = 1; i <= 7; i++) {
      options[i].c = colors.White;
      }
    }
   for (let i = 1; i <= 7; i++) {
    if (option === i) {
      options[i].c = colors.BlueLight;
      break; 
    }
  }
    Images.bg.draw(0,0);
    Images.conf.draw(0,0);
    pixel.color = options[1].c;
    pixel.print(textAthena.center(font2,idioma[2]).x,106,idioma[2])
    pixel.color = options[2].c;
    pixel.print(textAthena.center(font2,idioma[3]).x,147,idioma[7])
    pixel.color = options[3].c;
    pixel.print(textAthena.center(font2,idioma[4]).x,192,idioma[4])
    pixel.color = options[4].c;
    pixel.print(textAthena.center(font2,idioma[5]).x,237,idioma[5]);
    pixel.color = options[5].c;
    pixel.print(textAthena.center(font2,idioma[6]).x,282,idioma[6]);
    pixel.color = options[6].c;
    pixel.print(textAthena.center(font2,idioma[6]).x,327,idioma[9]);
    if(pad.justPressed(Pads.CROSS)) {
      switch (option) {
        case 1:
          option = 1;
          screen = 10;
          break;
        case 2:
          screen = 5;
          break;
        case 3:
          screen = 2;
          break;
        case 4:
          screen = 3;
          break;
        case 5:
          screen = 6;
          break;
        case 6:
          System.exitToBrowser();
          break;
      }
    }
    
    
    if(pad.justPressed(Pads.R1)) {
      screen = 0;
    }
  }
  atalhos() {
    atl.scale = 0.7;
    pad.update();
    Images.bg.draw(0,0)
    Images.interface2.draw(0,0);
    if(Theme.Back_Text.enable) {
    fontf2.print(Theme.Back_Text.x,Theme.Back_Text.y,idioma[1]);
    }
    if(pad.justPressed(Pads.TRIANGLE)) {
      screen = 1;
    }
  }
  informs() {
    atl.scale = 0.7;
    pad.update();
    Images.bg.draw(0,0)
    Images.interface2.draw(0,0);
    if(Theme.Back_Text.enable) {
    fontf2.print(Theme.Back_Text.x,Theme.Back_Text.y,idioma[1]);
    }
    atl.print(0,106,idioma[26]);
    atl.print(0,131,idioma[27]);
    atl.print(0,157,idioma[28]);
    atl.print(0,181,idioma[29]);
    atl.print(0,206,idioma[30]);
    atl.print(0,231,idioma[31]);
    atl.print(0,256,idioma[32]);
    atl.print(0,281,idioma[33] + version);
    atl.print(0,306, idioma[34]);
    
    if(pad.justPressed(Pads.TRIANGLE)) {
      screen = 1;
    }
  }
  idiomas() {
    
    pad.update();
    Images.bg.draw(0,0)
    if(pad.justPressed(Pads.DOWN) && optionIdioma !== 3) {
      optionIdioma++;
    }
    if(pad.justPressed(Pads.UP) && optionIdioma !== 1) {
      optionIdioma--;
    }
    optionsIdioma[0] = colors.White;
    optionsIdioma[1] = colors.White;
    optionsIdioma[2] = colors.White;
    switch (optionIdioma) {
      case 1:
        optionsIdioma[0] = colors.BlueLight;
        break;
      case 2:
        optionsIdioma[1] = colors.BlueLight;
        break;
      case 3:
        optionsIdioma[2] = colors.BlueLight;
        break;
    }
    Images.interface2.draw(0,0); 
    if(Theme.Back_Text.enable) {
    fontf2.print(Theme.Back_Text.x,Theme.Back_Text.y,idioma[1]);
    }
    let size = pixel.getTextSize("PT-BR").width;
    pixel.color = optionsIdioma[0];
    pixel.print(canvas.width/2-size/2,106,"PT-BR")
    size = pixel.getTextSize("ENGLISH").width;
    pixel.color = optionsIdioma[1];
    pixel.print(canvas.width/2-size/2,106+45,"ENGLISH")
    size = pixel.getTextSize("SPANISH").width;
    pixel.color = optionsIdioma[2];
    pixel.print(canvas.width/2-size/2,106+45+45,"SPANISH")
    
    
    if(pad.justPressed(Pads.CROSS)) {
      let file_f = std.open(System.boot_path + "Assets/config.js", "w");
      config[0] = optionIdioma;
      let json0 = JSON.stringify(config, null, 2);
      let dt = `export var config = ${json0};`
      file_f.write(Uint8Array.from(Array.from(dt).map(letter => letter.charCodeAt(0))).buffer, 0, dt.length);
      file_f.close();      
      Acalert(screen,idioma[12],idioma[14]);
    }
    if(pad.justPressed(Pads.TRIANGLE)) {
      screen = 1;
    }
}
  temas() {
    atl.scale = 0.8;
    
    pad.update();
    Images.bg.draw(0,0)
    let file_tema2 = null;
    Images.interface2.draw(0,0);
    let margin = 85;
    Draw.rect(0, margin+(1+21*(arquiv+1)), 640, 25, colors.BlueLight);
    for (var i = 0; i < file.tema.length; i++) {
      atl.print(0,margin+(1+21*(i+1)),file.tema[i].name)
      file_tema2 = System.listDir(System.boot_path + paths.temas + file.tema[i].name);
      for(var j = 0; j < file_tema2.length; j++) {
        if(file_tema2[j].name == "config.json") {
        let lc2 = "Themes/" + file.tema[i].name + "/config.json";
        let flh = std.open(lc2,"r")
        let thm = std.parseExtJSON(flh.readAsString());
        atl.print(0+200,margin+(1+21*(i+1)),`( ${idioma[40]}, ${idioma[39]}: ${thm.theme.author})`)
        
        } 
      }
    }
    if(pad.justPressed(Pads.CROSS)) {
      th_name = file.tema[arquiv].name;
      let vif = false;
      file_tema2 = System.listDir(System.boot_path + paths.temas + file.tema[arquiv].name);
      for(var z = 0; z < file_tema2.length; z++) {
        if(file_tema2[z].name == "config.json") {
            vif = true;
            tm.img1 = new Image(System.boot_path + paths.temas + file.tema[arquiv].name + "/sample.png")
        } 
      }
    if(vif == true) {
    screen = 9;
    }else{
      Acalert(screen,idioma[11],idioma[36])
    }
    }
    let limit = file.tema.length - 1;
    if(pad.justPressed(Pads.DOWN) && arquiv !== limit) {
      arquiv++;
    }
    if(pad.justPressed(Pads.UP) && arquiv !== 0) {
      arquiv--;
    }
    if(Theme.Back_Text.enable) {
    fontf2.print(Theme.Back_Text.x,Theme.Back_Text.y,idioma[1]);
    }
    if(pad.justPressed(Pads.TRIANGLE)) {
      screen = 1;
    }
  }
  viewTema() {
    pad.update();
    atl.scale = 0.8;
    Images.bg.draw(0,0)
    Images.interface2.draw(0,0);
    tm.img1.width = 436;
    tm.img1.height = 305;
    tm.img1.draw(102,98);
    let margin = 85;
    atl.print(canvas.width/2-atl.getTextSize(idioma[37]).width/2,tm.img1.height+atl.getTextSize(idioma[37]).height+80,idioma[37]);
    if(Theme.Back_Text.enable) {
    fontf2.print(Theme.Back_Text.x,Theme.Back_Text.y,idioma[1]);
    }
    if(pad.justPressed(Pads.TRIANGLE)) {
      screen = 5;
    }
  if(pad.justPressed(Pads.START)) {
    if(th_name == config.theme) {
      Acalert(screen,idioma[12],idioma[41]);
    }else{
    let file = std.open(System.boot_path + "Assets/config.js", "w");
      config.theme = th_name;
      let configJSON = JSON.stringify(config, null, 2);
      let dt = `export var config = ${configJSON};`
      file.write(Uint8Array.from(Array.from(dt).map(letter => letter.charCodeAt(0))).buffer, 0, dt.length);
        file.close();      
        System.loadELF(System.boot_path + "BROWSER_ARCADE.elf");
    }
  }
  }
  addGame() {
    atl.scale = 0.8;
    
    pad.update();
    let margin = 85;
    Images.bg.draw(0,0)
    Images.interface2.draw(0,0); 
    if(Theme.Back_Text.enable) {
    fontf2.print(Theme.Back_Text.x,Theme.Back_Text.y,idioma[1]);
    }
    if(pad.justPressed(Pads.CROSS)) {
    if(file.game[arquiv].name == "main.js") {
      let fif = false;
      let pp = paths.games + file.game[arquiv].name;
      for(var i = 0; i < games.length; i++) {
        if(games[i].location == pp) {
          fif = true;
          Acalert(screen,idioma[11],idioma[38]);
        }
      }
      if(fif == false) {
      let file = std.open(System.boot_path + "Games/GameList.js", "w");
      let old = games.length;
      let add = games.push({
      location: pp
      });
      let gamesJSON = JSON.stringify(games, null, 2);
      let dt = `export var games = ${gamesJSON};`
      file.write(Uint8Array.from(Array.from(dt).map(letter => letter.charCodeAt(0))).buffer, 0, dt.length);
      file.close();      
      if(add > old){
        Acalert(screen,idioma[12],idioma[15])
      }else{
        Acalert(screen,idioma[11],idioma[13])
      }
    }
    }else{
    if(file.game[arquiv].dir) {
      paths.games = paths.games + file.game[arquiv].name + "/";
      file.game = System.listDir(System.boot_path + paths.games);
    }else{
      Acalert(screen,idioma[11],idioma[35])
    }
    }
    
    arquiv = file.game.length - 1;
    }
    
    Draw.rect(0, margin+(1+21*(arquiv+1)), 640, 25, colors.BlueLight);
    for (var i = 0; i < file.game.length; i++) {
      atl.print(0,margin+(1+21*(i+1)),file.game[i].name)
      if(file.game[i].name == "main.js") {
      atl.print(0+200,margin+(1+21*(i+1)),`( ${idioma[16]} )`)
      }
      if(file.game[i].dir) {
      atl.print(0+200,margin+(1+21*(i+1)),`( ${idioma[17]} )`)
      }
    }
    
    
    let limit = file.game.length - 1;
    if(pad.justPressed(Pads.DOWN) && arquiv !== limit) {
      arquiv++;
    }
    if(pad.justPressed(Pads.UP) && arquiv !== 0) {
      arquiv--;
    }
  if(pad.justPressed(Pads.TRIANGLE)) {
      arquiv = 0;
      if(paths.games == "Games/") {
      screen = 10;
      }else{
        var idx = path.lastIndexOf("/")
        paths.games = path.slice(0, idx);
        idx = path.lastIndexOf("/");
        paths.games = path.slice(0, idx+1);
        file.game = System.listDir(System.boot_path + paths.games);
      }
    }
  }
  alert() {
    pad.update();
    Images.bg.draw(0,0)
    Images.interface2.draw(0,0);
    if(Theme.Back_Text.enable) {
    fontf2.print(Theme.Back_Text.x,Theme.Back_Text.y,idioma[1]);
    }
    atl.scale = 0.8;
    let sv = atl.getTextSize(Alert_Info.title).width;
    atl.print(640/2-sv/2,106,Alert_Info.title)
    atl.print(0,106+75,Alert_Info.description)
    
    if(pad.justPressed(Pads.TRIANGLE)) {
    screen = Alert_Info.scr;
    }
  }
  loading() {
  font.print(0,0,"loading");
  drawImageScreen(current_Images.bgloading,0,0)
  if(Theme.loading_logo.enable) {
  drawImageScreen(current_Images.logo,Theme.loading_logo.x, Theme.loading_logo.y);
  }
  if(Theme.loading_ball.enable) {
  if (progress < 1.1) {
    drawLoadingBalls(progress);
    progress += 0.1;
  } else {
    progress = 0;
  }
  }
  }
  info() {
  fontf2.scale = 0.6;
  
  pad.update();  
  slot1.img.draw(0,0);
  Images.inf.draw(0,0);
  fontf.print(138,288,info_v.name);
  fontf2.print(210-fontf2.getTextSize(removerAcentos(idioma[21])).width - 7,322,idioma[21]);
  fontf2.print(210,322,games[slot1.item].location);
  fontf2.print(164-fontf2.getTextSize(removerAcentos(idioma[22])).width - 7,344,idioma[22]);
  fontf2.print(164,344,info_v.author);
  fontf2.print(159-fontf2.getTextSize(removerAcentos(idioma[23])).width - 7,371,idioma[23]);
  fontf2.print(159,371,info_v.version);
  fontf2.print(188-fontf2.getTextSize(removerAcentos(idioma[25])).width - 7,396,idioma[25]);
  fontf2.print(188,396,info_v.description);
  fontf2.print(528,328 - 7,idioma[24]);
  if(Theme.Back_Text_info.enable) {
  fontf2.print(Theme.Back_Text_info.x,Theme.Back_Text_info.y,idioma[1]);
  }
  if(pad.justPressed(Pads.TRIANGLE)) {
    slot1.img.width = 243;
    slot1.img.height = 151;
    screen = 0;
  }
  if(pad.justPressed(Pads.START)) {
    let loc = games[slot1.item].location;
    System.loadELF(System.boot_path + "BROWSER_ARCADE.elf", [games[slot1.item].location]);
  }
 }
  Gamesoption() {
    pad.update();
    if(pad.justPressed(Pads.DOWN) && option !== 6) {
      option++;
    }
    if(pad.justPressed(Pads.UP) && option !== 1) {
      option--;
    }
    options[1].c = colors.White;
    options[2].c = colors.White;
    options[3].c = colors.White;
    options[4].c = colors.White;
    options[5].c = colors.White;
    options[6].c = colors.White;
    switch (option) {
      case 1:
        options[1].c = colors.BlueLight;
        break;
      case 2:
        options[2].c = colors.BlueLight;
        break;
      case 3:
        options[3].c = colors.BlueLight;
        break;
      case 4:
        options[4].c = colors.BlueLight;
        break;
      case 5:
        options[5].c = colors.BlueLight;
        break;
      case 6:
        options[6].c = colors.BlueLight;
        break;
    }
    Images.bg.draw(0,0);
    Images.interface2.draw(0,0);
    if(Theme.Back_Text.enable) {
   fontf2.print(Theme.Back_Text.x,Theme.Back_Text.y,idioma[1]);
    }
    let size = pixel.getTextSize(removerAcentos(idioma[3])).width;
    pixel.color = options[1].c;
    pixel.print(canvas.width/2-size/2,106,idioma[3])
    size = pixel.getTextSize(removerAcentos(idioma[42])).width;
    pixel.color = options[2].c;
    pixel.print(canvas.width/2-size/2,106+45,idioma[42])
    if(pad.justPressed(Pads.CROSS)) {
      switch (option) {
        case 1:
          screen = 4;
          break;
        case 2:
          screen = 11;
          break;
      }
    }
    
    
    if(pad.justPressed(Pads.TRIANGLE)) {
      option = 1;
      screen = 1;
    }
 }
  removegame() {
   pad.update();
   Images.bg.draw(0,0);
   Images.interface2.draw(0,0);
   if(Theme.Back_Text.enable) {
   fontf2.print(Theme.Back_Text.x,Theme.Back_Text.y,idioma[1]);
    }
   let margin = 85;
   Draw.rect(0, margin+(1+21*(arquiv+1)), 640, 25, colors.BlueLight);
   for(var i = 0; i < games.length; i++) {
     let nm = getInfoGame("name" ,i);
     atl.print(0,margin+(1+21*(i+1)),nm)
   }
    if(pad.justPressed(Pads.CROSS)) {
      arquiv = 0;
      let file = std.open(System.boot_path + "Games/GameList.js", "w");
      games.splice(arquiv,1)
      let gamesJSON = JSON.stringify(games, null, 2);
      let dt = `export var games = ${gamesJSON};`
      file.write(Uint8Array.from(Array.from(dt).map(letter => letter.charCodeAt(0))).buffer, 0, dt.length);
      file.close();      
      Acalert(screen,idioma[12],idioma[43]);
    } 
    let limit = games.length - 1;
    if(pad.justPressed(Pads.DOWN) && arquiv !== limit) {
      arquiv++;
    }
    if(pad.justPressed(Pads.UP) && arquiv !== 0) {
      arquiv--;
    }
   if(pad.justPressed(Pads.TRIANGLE)) {
     arquiv = 0;
     screen = 10;
   }
 }
}
const play = new UI();
play.setScreen(7);
const tmout = os.setTimeout(() => {   
    play.setScreen(0);
    os.clearTimeout(tmout);
}, 4000);
initialize(); //iniciando sistema e variáveis browser arcade 
const main = () => {
  // idioma = {
//   1: ptbr,
//   2: eng,
//   3: spanish
//   }[config[0]] || ptbr;
  GoBrowser();
  GoBrowserPS2();
  play.LoadScreen();
  debug();
}
Screen.displayFunc(main);
os.setInterval(() => {
  Screen.display();
},0);