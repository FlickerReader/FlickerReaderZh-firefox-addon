// 初始化用户存储的速度
const DEFAULT_SPEED = 600;
browser.storage.local.get('speed').then((cacheSpeed) => {
    let speed = DEFAULT_SPEED;
    if (cacheSpeed['speed']) {
        speed = cacheSpeed['speed']
    }
    document.querySelector('#speed').value = speed;
});

document.querySelector('#submit').addEventListener('click', () => {
    let speed = document.querySelector('#speed').value;
    speed = Number.parseInt(speed);
    if (speed && speed < 1000 && speed > 100) {
        document.querySelector('#speed').style.backgroundColor = '#fff';
        browser.storage.local.set({speed: speed});
    } else {
        document.querySelector('#speed').style.backgroundColor = 'red';
    }
});