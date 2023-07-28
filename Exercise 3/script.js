const dialog = document.querySelector('.chat__dialog');
const input = document.querySelector('.chat__input');
const sendBtn = document.querySelector('.chat__btn-send');
const geoBtn = document.querySelector('.chat__btn-geo');
let isGeo = false;

const websocket = new WebSocket('wss://echo-ws-service.herokuapp.com/');

function successGeo(position) {
  isGeo = true;
  console.log(isGeo)
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let link = `<a href="https://www.openstreetmap.org/#map=15/${latitude}/${longitude}" target="_blank">Геолокация</a>`;

  writeToScreen(link, true)

  websocket.send([latitude, longitude])
}

function errorGeo() {
  alert('Невозможно получить гео')
}

function writeToScreen(message, isClient) {
  if (message !== '') {
    let elem = document.createElement('div');
    elem.innerHTML = message;
    elem.classList.add('chat__message');
  
    if (isClient) {
      elem.style.alignSelf = 'end';
    }
  
    dialog.append(elem)
  
    dialog.scrollTop = dialog.scrollHeight;
  }
}

websocket.onmessage = (e) => {
  if (!isGeo) {
    writeToScreen(e.data, false)
  } else {
    isGeo = false;
  }
}

sendBtn.onclick = () => {
  writeToScreen(input.value, true)
  websocket.send(input.value)
  input.value = ''
}

geoBtn.onclick = () => {
  if (!navigator.geolocation) {
    alert('Геолокация не поддерживается вашим браузером')
  } else {
    navigator.geolocation.getCurrentPosition(successGeo, errorGeo)
  }
}