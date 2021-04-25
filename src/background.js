

browser.runtime.onMessage.addListener((message) => {
  if (message.type == 'startSplite') {
    browser.runtime.sendMessage({
      type: 'start',
      words: splitString(message.string)
    });
  }
});
/**
 * 拆分词汇
 * @param string 准备被拆分的字符串
 * @param []string 拆分后的单词数组
 */
function splitString(str){
  let cutResult = jiebaCut(str);
  return JSON.parse(cutResult);
}
/**
 * 开启监听
 */
function startCommandListenner() {
  console.log('start listening');
  browser.commands.onCommand.addListener(function (command) {
    if (command === "toggle-feature") {
      browser.browserAction.openPopup().then(() => {
        // 等 popup 加载完成再发送消息
        setTimeout(() => {
          browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, 'Play')
          })
        }, 100);
        
      });
    }
  });
}

// 加载 分词脚本
let go = new window.Go();
// 加载词典
let dict = '';


WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject)
  .then((result) => {
    // 加载分词脚本
    go.run(result.instance)
    // 记载
    fetch('dict.txt').then((response) => {
      response.text().then((text) => {
        dict = text;
        jiebaLoadDictionary(dict);
        startCommandListenner();
      })
    })
  });

