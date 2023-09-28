export function removeAccents(palavra) {
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
export function center(fontp,text) {
  let sc = Screen.getMode();
  let ft = fontp.getTextSize(removeAccents(text));
  let list = {
    x: sc.width / 2 - ft.width / 2,
    y: sc.height / 2 - ft.height / 2
  }
  return list;
}
export function centerObject(x1,y1,width1,height1,fontp,text) {
  let objX = x1;
  let objY = y1;
  let sz = fontp.getTextSize(removeAccents(text));
  let h = (width1 - sz.width) / 2;
  let v = (height1 - sz.height) / 2;
  let newX = x1 + h;
  let newY = y1 + v;
  let list = {
    x: newX,
    y:newY
  }
  return list;
}
export function shadow(xS,yS,fontS,colorS,textS,fontC) {
  let fonp = null;
  if(fontC !== null) {
    fonp = new Font();
  }else{
    fonp = new Font(fontC);
  }
  fonp.scale = fontS.scale;
  fonp.color = colorS;
  fonp.print(xS + 3,yS,textS);
}
export function outline(xO,yO,fontO,colorO,textO,font2O) {
  let fonp = null;
  if(font2O !== null) {
    fonp = new Font();
  }else{
    fonp = new Font(font2O);
  }
  fonp.scale = fontO.scale + 0.03;
  fonp.color = colorO;
  fonp.print(xO - 3,yO,textO);
}