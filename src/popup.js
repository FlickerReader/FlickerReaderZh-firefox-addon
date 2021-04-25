const DEFAULT_SPEED = 600;
var speed = DEFAULT_SPEED

window.onload = () => {
  browser.storage.local.get('speed').then((cacheSpeed) => {
    if (cacheSpeed['speed']) {
      speed = cacheSpeed['speed'];
    }
    document.querySelector('#speed').innerText = ('当前阅读速度为：' + speed);
  });
}


browser.runtime.onMessage.addListener((message) => {
  if (message.type == 'start') {
    show_text(message.words).then(() => {
      console.log('finish');
    });
  }
})

function show_text(wordsArr, current = 0) {
  let time = 60*1000/Number(speed)
  
  // 再次遍历字符串，如果其中字符串是中文的话，就按字拆分，后续准备调用分词工具，按词拆分
  let skip = false;
  let steps = 0
  let dotinterval = 2
  let p = new Promise((resolve, reject) => {
    interval = setInterval(() => {
      if (current === wordsArr.length){
        clearInterval(interval);
        setTimeout(resolve, time*2)
        return;
      }
      if (skip){
        if(steps > dotinterval){
          skip = false;
          steps = 0;
        }else{
          steps += 1;
          return;
        }
      }
      if (wordsArr[current].match(/.*[.\?!,:].*/g)){
        skip = true;
      }
      while (true){
        if (current-1 < wordsArr.length){
          if (wordsArr[current] === " " || wordsArr[current] === ""){
            current += 1;
          }else{
            break;
          }
        }else{
          return;
        }
      }
      document.querySelector('#note').innerText = wordsArr[current]
      current += 1
    }, time)
  })
  return p
}

