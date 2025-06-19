const tvPlayer = document.getElementById('tvPlayer');
const channelList = document.getElementById('channelList');
const currentChannelName = document.getElementById('currentChannelName');
const videoSpinner = document.getElementById('videoSpinner');
let peer = null;
let chatConn = null;

// Channel List
const channels = [
  { name: 'T Sports', url: 'http://www.google.com/178/201/live/TSports/tracks-v1a1/mono.m3u8', logo: 'https://raw.githubusercontent.com/subirkumarpaul/Logo/main/T%20Sports.png', type: 'application/x-mpegURL', category: 'sports' },
  { name: 'Deepto TV', url: 'https://www.byphdgllyk.gpcdn.net/hls/deeptotv/index.m3u8', logo: 'https://raw.githubusercontent.com/subirkumarpaul/Logo/main/Deepto%20TV.jpeg', type: 'application/x-mpegURL', category: 'movies' },
  { name: 'Bangla TV', url: 'https://www.byphdgllyk.gpcdn.net/hls/banglatveurope/index.m3u8', logo: 'https://raw.githubusercontent.com/subirkumarpaul/Logo/main/Bangla%20TV.png', type: 'application/x-mpegURL', category: 'news' },
];

// Utility Functions
function showSection(id) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  if (id === 'events') {
    displayEvents();
  }
  if (id === 'chat') {
    initializeChat();
  }
  if (id === 'live-tv') {
    if (channels.length > 0 && !tvPlayer.src) {
      filterChannels();
    }
  }
  if (id === 'call') {
    initializeCall();
  }
  if (id === 'profile') {
    displayProfile();
  }
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
    const jokeApiUrl = 'https://www.v2.jokeapi.dev/joke/Any?safe-mode';
    const jokeRes = await fetch(jokeApiUrl);
    const jokeData = await jokeRes.json();
    let englishJokeText = jokeData.type === 'single' ? jokeData.joke : `${jokeData.setup}\n\n${jokeData.delivery}`;
    const translatedText = await translateText(englishJokeText);
    jokeBox.innerText = translatedText;
  } catch (error) {
    jokeBox.innerText = 'Error: জোকস লোড করা যায়নি!';
  }
}

// Stories Section
async function loadStory() {
  const storyBox = document.getElementById('story');
  storyBox.innerText = 'গল্প লোড হচ্ছে...';
  try {
    const res = await fetch('/stories.json');
    const data = await res.json();
    const story = data[Math.floor(Math.random() * data.length)];
    storyBox.innerText = story.title + '\n\n' + story.story;
    } catch {
      storyBox.innerText = 'Error: গল্প লোড করা যায়নি!';
    }
  }

// Profile Section
function saveProfile() {
  const name = sanitizeInput(document.getElementById('username').value);
  const email = sanitizeInput(document.getElementById('email').value);
  const msg = document.getElementById('profileMessage');

  if (name && email) {
    localStorage.setItem('userProfile', JSON.stringify({ name, email, favorites: JSON.parse(localStorage.getItem('favorites') || '[]' }));
     msg.innerHTML = `<div class='card'>🎉 ধন্যবাদ, ${name}! প্রোফাইল সেভ হয়েছে।</div>`;
    displayProfile();
    alert(`প্রোফাইল সেভ হয়েছে: ${name}`);
  } else {
    msg.innerHTML = `<div class='card'>⚠️‍‍️ সকল তথ্য পূরণ করুন!</div>`;
    alert('সকল তথ্য পূরণ করুন!');
  }
}

function displayProfile() {
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  if (profile.name) {
    document.getElementById('username').value = profile.name;
    document.getElementById('email').value = profile.email;
  }
  const favoriteChannels = JSON.parse(localStorage.getItem('favorites') || '[]');
  const favoriteList = document.getElementById('favoriteChannels');
  favoriteList.innerHTML = '';
  favoriteChannels.forEach(channel => {
    const channelName = channels.find(ch => ch.name === channelName);
    if (channel) {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      li.innerHTML = `
        <span>${channel.name}</span>
        <button class="btn btn-sm btn-danger" onclick="removeFavorite('${channel.name}')" aria-label="Remove from favorites ${channel.name}">Remove</button>
      `;
      favoriteList.appendChild(li);
    }
  });
}

function addFavorite(channelName) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (!favorites.includes(channelName)) {
    favorites.push(channelName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayProfile();
    alert(`${channelName} ফেভারিট লিস্টে যোগ করা হয়েছে।`);
  }
}

function removeFavorite(channelName) {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  favorites = favorites.filter(f => f !== channelName);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayProfile();
  alert(`${channelName} ফেভারিট থেকে সরানো হয়েছে।`);
}

// Events Section
function addEvent() {
  const eventContent = document.getElementById('eventContent');
  const content = sanitizeInput(eventContentInput.value.trim());
  if (content) {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const now = new Date();
    events.push({ content, timestamp: now.toISOString() });
    localStorage.setItem('events', JSON.stringify(events));
    eventContentInput.value = '';
    displayEvents();
    alert('নতুন ইভেন্ট পোস্ট করা হয়েছে।');
  } else {
    alert('কিছু লিখুন!');
  }
}

function displayEvents() {
  const eventListDiv = document.getElementById('eventList');
  const events = JSON.parse(localStorage.getItem('events') || '[]');
  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  eventListDiv.innerHTML = events.length === 0 ? '<div class="card">কোনো ইভেন্ট নেই।</div>' : '';
  events.forEach(event => {
    const eventCard = document.createElement('div');
    eventCard.classList.add('card');
    const date = new Date(event.timestamp);
    const dateString = date.toLocaleDateString('bn-BD') + ' ' + date.toLocaleTimeString('bn-BD');
    eventCard.innerHTML = `<p>${event.content}</p><small style="color: #888;">${dateString}</small>`;
    eventListDiv.appendChild(eventCard);
  });
}

// Chat Section
function initializeChat() {
  if (!window.location.protocol.includes('https') && window.location.hostname !== 'localhost') {
    alert('চ্যাট ফিচারের জন্য HTTPS বা localhost প্রয়োজন।');
    return;
  }
  if (!peer) {
    peer = new Peer();
    peer.on('open', id => {
      console.log('Peer ID:', id);
    });
    peer.on('connection', conn => {
      chatConn = conn;
      setupChatConnection();
    });
  }
}

function joinChatRoom() {
  const roomId = sanitizeInput(document.getElementById('chatRoomId').value.trim());
  if (!roomId) {
    alert('রুম আইডি লিখুন!');
    return;
  }
  if (peer) {
    chatConn = peer.connect(roomId);
    setupChatConnection();
  } else {
    alert('চ্যাট সিস্টেম ইনিশিয়ালাইজ করা যায়নি। HTTPS বা localhost ব্যবহার করুন।');
  }
}

function setupChatConnection() {
  chatConn.on('data', data => {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    const now = new Date();
    const timeString = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    messageElement.innerHTML = `
      <p style="margin: 0;">${data.content}</p>
      <small>${timeString}</small>
      <button onclick="translateMessage('${data.content}')" aria-label="ট্রান্সলেট মেসেজ">ট্রান্সলেট</button>
    `;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    alert(`নতুন মেসেজ: ${data.content}`);
  });
}

function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = sanitizeInput(chatInput.value.trim());
  if (message && chatConn) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    chatConn.send({ content: message });
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.innerHTML = `
      <p style="margin: 0;">${message}</p>
      <small>${timeString}</small>
      <button onclick="translateMessage('${message}')" aria-label="ট্রান্সলেট মেসেজ">ট্রান্সলেট</button>
    `;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatInput.value = '';
    alert(`মেসেজ পাঠানো হয়েছে: ${message}`);
  } else {
    alert('মেসেজ লিখুন বা রুমে জয়েন করুন!');
  }
}

async function translateMessage(text) {
  const translated = await translateText(text);
  alert(`ট্রান্সলেটেড মেসেজ: ${translated}`);
}

async function translateText(text) {
  try {
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'bn'
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    return data.translatedText;
  } catch {
    return 'ট্রানস্লেশন ব্যর্থ হয়েছে!';
  }
}

// Live TV Section
function loadHlsJs(callback) {
  if (typeof Hls === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = callback;
    document.head.appendChild(script);
  } else {
    callback();
  }
}

function playChannel(streamUrl, channelName) {
  const errorMessage = document.getElementById('streamError');
  errorMessageDiv.style.display = 'none';
  videoSpinner.style.display = 'block';

  if (typeof Hls !== 'undefined' && Hls.isSupported() && streamUrl.endsWith('.m3u8')) {
    if (tvPlayer.hls) {
      tvPlayer.hls.destroy();
    }
    const hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(tvPlayer);
    tvPlayer.hls = hls;
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoSpinner.style.display = 'none';
    });
  } else {
    tvPlayer.src = streamUrl;
    tvPlayer.load();
    videoSpinner.style.display = 'none';
  }

  tvPlayer.play().catch(error => {
    console.error("Error playing video:", error);
    errorMessageDiv.innerText = 'চ্যানেল লোড করা যায়নি। অন্য চ্যানেল নির্বাচন করুন।';
    errorMessageDiv.style.display = 'block';
    videoSpinner.style.display = 'none';
    setTimeout(() => errorMessageDiv.style.display = 'none', 5000);
  });

  tvPlayer.onerror = () => {
    errorMessageDiv.innerText = 'স্ট্রিম লোড ব্যর্থ।';
    errorMessageDiv.style.display = 'block';
    videoSpinner.style.display = 'none';
    setTimeout(() => errorMessageDiv.style.display = 'none', 5000);
  };

  currentChannelName.innerText = `Now Playing: ${channelName}`;
  const listItems = channelList.querySelectorAll('.list-group-item');
  listItems.forEach(item => item.classList.remove('active-channel'));
  const activeItem = channelList.querySelector(`[data-stream-url="${streamUrl}"]`);
  if (activeItem) {
    activeItem.classList.add('active-channel');
  }
}

function setupChannels() {
  if (!navigator.onLine) {
    channelList.innerHTML = '<li class="list-group-item text-center">অফলাইনে লাইভ টিভি উপলব্ধ নয়।</li>';
    currentChannelName.innerText = 'ইন্টারনেট সংযোগ প্রয়োজন';
    return;
  }

  loadHlsJs(() => {
    filterChannels();
  });
}

function filterChannels() {
  const searchQuery = document.getElementById('channelSearch').value.toLowerCase();
  const selectedCategory = document.getElementById('channelCategory').value;
  let filteredChannels = channels;

  if (selectedCategory !== 'all') {
    filteredChannels = filteredChannels.filter(ch => ch.category === selectedCategory);
  }

  if (searchQuery) {
    filteredChannels = filteredChannels.filter(ch => ch.name.toLowerCase().includes(searchQuery));
  }

  channelList.innerHTML = '';

  if (filteredChannels.length === 0) {
    channelList.innerHTML = '<li class="list-group-item text-center">কোনো চ্যানেল পাওয়া যায়নি।</li>';
    return;
  }

  filteredChannels.forEach(channel => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'align-items-center');
    listItem.setAttribute('role', 'button');
    listItem.setAttribute('aria-label', `Play ${channel.name} channel`);

    if (channel.logo) {
      const img = document.createElement('img');
      img.src = channel.logo;
      img.alt = channel.name + ' logo';
      img.setAttribute('loading', 'lazy');
      img.style.width = '30px';
      img.style.height = '30px';
      img.style.marginRight = '10px';
      img.style.borderRadius = '5px';
      img.onerror = function() { this.src = '/icons/default-logo.png'; };
      listItem.appendChild(img);
    }

    const channelNameSpan = document.createElement('span');
    channelNameSpan.innerText = channel.name;
    listItem.appendChild(channelNameSpan);

    const favoriteButton = document.createElement('button');
    favoriteButton.classList.add('btn', 'btn-sm', 'btn-success', 'ms-auto');
    favoriteButton.innerText = 'Favorite';
    favoriteButton.onclick = (e) => {
      e.stopPropagation();
      addFavorite(channel.name);
    };
    listItem.appendChild(favoriteButton);

    listItem.setAttribute('data-stream-url', channel.url);
    listItem.setAttribute('data-channel-name', channel.name);
    listItem.onclick = () => playChannel(channel.url, channel.name);
    channelList.appendChild(listItem);
  });

  if (filteredChannels.length > 0 && document.getElementById('live-tv').classList.contains('active')) {
    playChannel(filteredChannels[0].url, filteredChannels[0].name);
  }
}

// Call Section
function initializeCall() {
  if (!window.location.protocol.includes('https') && window.location.hostname !== 'localhost') {
    alert('কল ফিচারের জন্য HTTPS বা localhost প্রয়োজন।');
    document.getElementById('callPeerId').disabled = true;
    document.querySelector('#call button').disabled = true;
    return;
  }
  if (!peer) {
    peer = new Peer();
    peer.on('open', id => {
      document.getElementById('yourPeerId').innerText = `Your Peer ID: ${id}`;
    });
    peer.on('call', call => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          document.getElementById('localVideo').srcObject = stream;
          call.answer(stream);
          call.on('stream', remoteStream => {
            document.getElementById('remoteVideo').srcObject = remoteStream;
          });
        })
        .catch(err => {
          console.error('Media access error:', err);
          alert('ক্যামেরা বা মাইক্রোফোন অ্যাক্সেস করা যায়নি।');
        });
    });
  }
}

function startCall() {
  const peerId = sanitizeInput(document.getElementById('callPeerId').value.trim());
  if (!peerId) {
    alert('পিয়ার আইডি লিখুন!');
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      document.getElementById('localVideo').srcObject = stream;
      const call = peer.call(peerId, stream);
      call.on('stream', remoteStream => {
        document.getElementById('remoteVideo').srcObject = remoteStream;
      });
    })
    .catch(err => {
      console.error('Media access error:', err);
      alert('ক্যামেরা বা মাইক্রোফোন অ্যাক্সেস করা যায়নি।');
    });
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => console.log('Service Worker registered:', registration))
      .catch(error => console.log('Service Worker registration failed:', error));
  });
}

// Initial Load
window.onload = () => {
  loadJoke();
  loadStory();
  alert('সুপার অ্যাপে স্বাগতম!');
  displayEvents();
  setupChannels();
  displayProfile();
};