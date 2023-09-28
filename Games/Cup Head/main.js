// {"name": "Cup Head", "author": "Eclipse Blade", "version": "0.1", "icon": "icon.png", "file": "main.js", "description": "Challenging retro platformer, Cuphead."}
import { GoBrowser, debug ,GoBrowserPS2 } from  "../../Assets/sys.js";
const font = new Font(System.boot_path + "Assets/Fonts/pixel.ttf";
os.setInterval(() => {
  Screen.clear(); 
  
  debug();
  GoBrowser();
  GoBrowserPS2();
  Screen.flip(); 
}, 0);