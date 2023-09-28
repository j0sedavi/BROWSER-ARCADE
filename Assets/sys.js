const pad_sys = Pads.get();
var Activate = false;
const fontdebug = new Font();
fontdebug.scale = 0.7f;
var bgj = Color.new(239,195,72);
var countt = 0;
var db = false;
var tmou_t = null;
export function GoBrowser() {
    pad_sys.update();
    if(pad_sys.pressed(Pads.L2) && pad_sys.pressed(Pads.R2) && pad_sys.pressed(Pads.START) && pad_sys.pressed(Pads.SELECT)) {
    System.loadELF(System.boot_path + "BROWSER_ARCADE.elf");
    }
}
export function GoBrowserPS2() {
    pad_sys.update();
    if(pad_sys.pressed(Pads.L1) && pad_sys.pressed(Pads.R1) && pad_sys.pressed(Pads.START) && pad_sys.pressed(Pads.SELECT)) {
    System.exitToBrowser();
    }
}
export function debug() {
pad_sys.update();
if(db == true) {
   countt++;
  if(countt >= 30) {
    countt = 0;
    db = false;
  }
}
if(pad_sys.pressed(Pads.L3) && pad_sys.pressed(Pads.R3) && db == false) {
  db = true;
  if(Activate){
  Activate = false;
  }else{
  Activate = true;
  }
}
if(Activate == true) {
  Screen.setFrameCounter(true);
  Draw.rect(0, 391, 640, 50, bgj);
  fontdebug.print(0,420,"DEBUG:")
  fontdebug.print(0 + 73,420,"FPS:" + Math.floor(Screen.getFPS(2)))
  fontdebug.print(100 + 65,420,"FREE_VRAM:" + Screen.getFreeVRAM())
  fontdebug.print(250 + 107,420,"FREE_MEMORY:" + System.getFreeMemory())
}
}