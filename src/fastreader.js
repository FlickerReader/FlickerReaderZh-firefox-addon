
var speed = 400

var interval = null

browser.runtime.onMessage.addListener((message) => {
  let selected_text = window.getSelection().toString()
  
  if (message == "Play") {
    start_text(selected_text, 0)
    return
  }
})

function start_text(selected_text, current = 0) {
  browser.runtime.sendMessage({
    type: 'startSplite',
    string: selected_text
  });
}
