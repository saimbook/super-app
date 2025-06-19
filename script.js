const tvPlayer = document.getElementById('tvPlayer');
const channelList = document.getElementById('channelList');
const currentChannelName = document.getElementById('currentChannelName');
const videoSpinner = document.getElementById('videoSpinner');
let peer = null;
let chatConn = null;

// Channel List (Updated with new channels)
const channels = [
  { name: 'T Sports', url: 'http://38.96.178.201/live/TSports/tracks-v1a1/mono.m3u8', logo: 'https://raw.githubusercontent.com/subirkumarpaul/Logo/main/T%20Sports.png', type: 'application/x-mpegURL', category: 'sports' },
  { name: 'Deepto TV', url: 'https://byphdgllyk.gpcdn.net/hls/deeptotv/index.m3u8', logo: 'https://raw.githubusercontent.com/subirkumarpaul/Logo/main/Deepto%20TV.jpeg', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Bangla TV', url: 'https://byphdgllyk.gpcdn.net/hls/banglatveurope/index.m3u8', logo: 'https://raw.githubusercontent.com/subirkumarpaul/Logo/main/Bangla%20TV.png', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Peace TV English', url: 'https://dzkyvlfyge.erbvr.com/PeaceTvEnglish/index.m3u8', logo: 'https://i.ibb.co/598TYnC/20240827-092020.png', type: 'application/x-mpegURL', category: 'religious' },
  { name: 'ABP Ananda', url: 'https://amg01448-samsungin-abpananda-samsungin-ad-pw.amagi.tv/playlist/amg01448-samsungin-abpananda-samsungin/playlist.m3u8', logo: 'https://i.postimg.cc/t7Gn9VtZ/abpananda.png', type: 'application/x-mpegURL', category: 'news' },
  { name: 'Movie Bangla', url: 'http://alvetv.com/moviebanglatv/8080/index.m3u8', logo: 'https://raw.githubusercontent.com/subirkumarpaul/Logo/main/Movie%20Bangla.png', type: 'application/x-mpegURL', category: 'movies' },
  { name: 'News18 Bangla', url: 'https://amg01448-samsungin-news18bangla-samsungin-ad-qy.amagi.tv/playlist/amg01448-samsungin-news18bangla-samsungin/playlist.m3u8', logo: 'https://jio.dinesh29.com.np/smart/ardinesh/logos/news18-bangla-news.png', type: 'application/x-mpegURL', category: 'news' },
  { name: 'Boishaki TV', url: 'https://boishakhi.sonarbanglatv.com/boishakhi/boishakhitv/index.m3u8', logo: 'https://raw.githubusercontent.com/subirkumarpaul/Logo/main/Boishaki%20TV.png', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Discovery Bengali (Test)', url: 'https://varun-iptv.netlify.app/m3u/discoverybengali.m3u8', type: 'application/x-mpegURL', category: 'documentary' },
  { name: 'Bangladesh Generic (Test)', url: 'https://channel-swart.vercel.app/bd.m3u8', logo: 'https://i.ibb.co/PG7zf8xb/download.jpg', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Premium 741 (Test)', url: 'https://ddy6new.newkso.ru/ddy6/premium741/mono.m3u8', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Rex Stream (Test)', url: 'https://rex-streaming.vercel.app/api/x/109987.m3u8', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Sunnah (Test)', url: 'http://m.live.net.sa:1935/live/sunnah/chunklist.m3u8?v=1', type: 'application/x-mpegURL', category: 'religious' },
  { name: 'Sportitalia (Test)', url: 'https://di-kzbhv8pw.vo.lswcdn.net/sportitalia/sihd/playlist.m3u8', type: 'application/x-mpegURL', category: 'sports' },
  { name: 'Gazi TV (Test)', url: 'https://mohon-iptv.vercel.app/Live-Tv/Gazi-TV/tracks-v1a1/mono.m3u8', type: 'application/x-mpegURL', category: 'sports' },
  { name: 'Bpk-TV 1701', url: 'https://d1e7rcqq4o2ma.cloudfront.net/bpk-tv/1701/output/index.m3u8', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Bpk-TV 1715', url: 'https://d1e7rcqq4o2ma.cloudfront.net/bpk-tv/1715/output/master.m3u8', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Bpk-TV 1716', url: 'https://d1e7rcqq4o2ma.cloudfront.net/bpk-tv/1716/output/master.m3u8', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Bpk-TV 1702', url: 'https://d1e7rcqq4o2ma.cloudfront.net/bpk-tv/1702/output/master.m3u8', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Bpk-TV 1703', url: 'https://d1e7rcqq4o2ma.cloudfront.net/bpk-tv/1703/output/master.m3u8', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Deepto TV Variant', url: 'https://byphdgllyk.gpcdn.net/hls/deeptotv/0_1/index.m3u8', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Bpk-TV 1705', url: 'https://d1e7rcqq4o2ma.cloudfront.net/bpk-tv/1705/output/master.m3u8', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Bpk-TV 1704', url: 'https://d1e7rcqq4o2ma.cloudfront.net/bpk-tv/1704/output/master.m3u8', type: 'application/x-mpegURL', category: 'general' },
  { name: 'Al Jazeera (Global)', url: 'https://live-hls-web-aje.getaj.net/AJE/02.m3u8', logo: 'https://i.ibb.co/CzCnTHV/aljazeera-home-tv.png', type: 'application/x-mpegURL', category: 'news' },
  { name: 'LTN (Test)', url: 'https://d2vnbkvjbims7j.cloudfront.net/containerA/LTN/playlist.m3u8?v=1', logo: 'https://i.imgur.com/REuN9RR.png', type: 'application/x-mpegURL', category: 'general' }
];

// Utility Functions
function showSection(id) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));
  const activeSection = document.getElementById(id);
  if (activeSection) activeSection.classList.add('active');
  // Handle URL hash
  if (id) window.location.hash = id;
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

function printPage() {
  window.print();
}

function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Jokes Section
async function loadJoke() {
  const jokeBox = document.getElementById('joke');
  jokeBox.innerText = 'জোকস লোড হচ্ছে...';
  try {
    const response = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode');
    const data = await response.json();
    let jokeText = data.type === 'single' ? data.joke : `${data.setup}\n${data.delivery}`;
    const translated = await translateText(jokeText);
    jokeBox.innerText = translated;
  } catch {
    jokeBox.innerText = 'জোকস লোড করা যায়নি!';
  }
}

// Stories Section
async function loadStory() {
  const storyBox = document.getElementById('story');
  storyBox.innerText = 'গল্প লোড হচ্ছে...';
  try {
    const response = await fetch('/stories.json');
    const data = await response.json();
    const story = data[Math.floor(Math.random() * data.length)];
    storyBox.innerText = `${story.title}\n\n${story.story}`;
  } catch {
    storyBox.innerText = 'গল্প লোড করা যায়নি!';
  }
}

// Profile Section
function saveProfile() {
  const name = sanitizeInput(document.getElementById('username').value);
  const email = sanitizeInput(document.getElementById('email').value);
  const msg = document.getElementById('profileMessage');
  if (name && email) {
    localStorage.setItem('userProfile', JSON.stringify({ name, email }));
    msg.innerHTML = `<div class='card'>🎉 ${name}, প্রোফাইল সেভ হয়েছে!</div>`;
  } else {
    msg.innerHTML = `<div class='card'>⚠️ সকল তথ্য দাও!</div>`;
  }
}

function displayProfile() {
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  if (profile.name) {
    document.getElementById('username').value = profile.name;
    document.getElementById('email').value = profile.email;
  }
}

// Events Section
function addEvent() {
  const eventContent = sanitizeInput(document.getElementById('eventContent').value.trim());
  if (eventContent) {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push({ content: eventContent, timestamp: new Date().toISOString() });
    localStorage.setItem('events', JSON.stringify(events));
    document.getElementById('eventContent').value = '';
    displayEvents();
  }
}

function displayEvents() {
  const eventListDiv = document.getElementById('eventList');
  const events = JSON.parse(localStorage.getItem('events') || '[]');
  eventListDiv.innerHTML = events.length ? '' : '<div class="card">কোনো ইভেন্ট নেই!</div>';
  events.forEach(event => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `${event.content}<br><small>${new Date(event.timestamp).toLocaleString('bn-BD')}</small>`;
    eventListDiv.appendChild(card);
  });
}

// Chat Section
function initializeChat() {
  if (!peer) {
    peer = new Peer({ host: '0.peerjs.com', port: 443, path: '/peerjs' });
    peer.on('open', id => console.log('Peer ID:', id));
    peer.on('connection', conn => {
      chatConn = conn;
      chatConn.on('data', data => {
        const chatBox = document.getElementById('chatBox');
        const div = document.createElement('div');
        div.classList.add('chat-message');
        div.innerHTML = `<p>${data.content}</p><small>${new Date().toLocaleTimeString('bn-BD')}</small>`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
      });
    });
  }
}

function joinChatRoom() {
  const roomId = sanitizeInput(document.getElementById('chatRoomId').value.trim());
  if (roomId && peer) chatConn = peer.connect(roomId);
}

function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = sanitizeInput(chatInput.value.trim());
  if (message && chatConn) {
    chatConn.send({ content: message });
    const chatBox = document.getElementById('chatBox');
    const div = document.createElement('div');
    div.classList.add('chat-message');
    div.innerHTML = `<p>${message}</p><small>${new Date().toLocaleTimeString('bn-BD')}</small>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatInput.value = '';
  }
}

async function translateText(text) {
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      body: JSON.stringify({ q: text, source: 'en', target: 'bn' }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    return data.translatedText;
  } catch {
    return 'ট্রান্সলেশন ব্যর্থ!';
  }
}

// Live TV Section
function loadHlsJs(callback) {
  if (typeof Hls === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = callback;
    document.head.appendChild(script);
  } else callback();
}

function playChannel(streamUrl, channelName) {
  videoSpinner.style.display = 'block';
  if (Hls.isSupported() && streamUrl.endsWith('.m3u8')) {
    if (tvPlayer.hls) tvPlayer.hls.destroy();
    const hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(tvPlayer);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoSpinner.style.display = 'none';
      tvPlayer.play().catch(() => document.getElementById('streamError').style.display = 'block');
    });
  } else {
    tvPlayer.src = streamUrl;
    tvPlayer.play().then(() => videoSpinner.style.display = 'none').catch(() => document.getElementById('streamError').style.display = 'block');
  }
  currentChannelName.textContent = `Now Playing: ${channelName}`;
  const items = channelList.getElementsByTagName('li');
  for (let item of items) item.classList.remove('active-channel');
  channelList.querySelector(`[data-stream-url="${streamUrl}"]`)?.classList.add('active-channel');
}

function setupChannels() {
  loadHlsJs(() => {
    const search = document.getElementById('channelSearch').value.toLowerCase();
    const category = document.getElementById('channelCategory').value;
    let filtered = channels.filter(ch => (category === 'all' || ch.category === category) && ch.name.toLowerCase().includes(search));
    channelList.innerHTML = filtered.length ? '' : '<li class="list-group-item text-center">কোনো চ্যানেল নেই!</li>';
    filtered.forEach(ch => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.setAttribute('data-stream-url', ch.url);
      li.textContent = ch.name;
      li.onclick = () => playChannel(ch.url, ch.name);
      channelList.appendChild(li);
    });
    if (filtered.length) playChannel(filtered[0].url, filtered[0].name);
  });
}

function filterChannels() {
  setupChannels();
}

// Call Section
function initializeCall() {
  if (!peer) {
    peer = new Peer({ host: '0.peerjs.com', port: 443, path: '/peerjs' });
    peer.on('open', id => document.getElementById('yourPeerId').textContent = `Your Peer ID: ${id}`);
    peer.on('call', call => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        document.getElementById('localVideo').srcObject = stream;
        call.answer(stream);
        call.on('stream', remoteStream => document.getElementById('remoteVideo').srcObject = remoteStream);
      }).catch(err => console.error(err));
    });
  }
}

function startCall() {
  const peerId = sanitizeInput(document.getElementById('callPeerId').value.trim());
  if (peerId && peer) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      document.getElementById('localVideo').srcObject = stream;
      peer.call(peerId, stream).on('stream', remoteStream => document.getElementById('remoteVideo').srcObject = remoteStream);
    }).catch(err => console.error(err));
  }
}

// Question Section
function submitQuestion() {
  const question = sanitizeInput(document.getElementById('questionInput').value.trim());
  const responseDiv = document.getElementById('questionResponse');
  if (question) {
    responseDiv.innerHTML = `<div class='card'>🎉 প্রশ্ন "${question}" জমা হয়েছে! আমরা শীঘ্রই উত্তর দেবো।</div>`;
    document.getElementById('questionInput').value = '';
  } else {
    responseDiv.innerHTML = `<div class='card'>⚠️ প্রশ্ন লিখুন!</div>`;
  }
}

// PWA Service Worker
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').catch(err => console.error(err));
}

// Initial Load and Hash Handling
window.onload = () => {
  const hash = window.location.hash.substring(1);
  if (hash) showSection(hash);
  else showSection('jokes');
  loadJoke();
  loadStory();
  displayEvents();
  setupChannels();
  displayProfile();
};
