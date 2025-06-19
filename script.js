const tvPlayer = document.getElementById('tvPlayer');
const channelList = document.getElementById('channelList');
const currentChannelName = document.getElementById('currentChannelName');
const videoSpinner = document.getElementById('videoSpinner');
const streamError = document.getElementById('streamError'); // Added this
let peer = null;
let chatConn = null;

// Channel List - COMPLETE LIST WITH CATEGORIES
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
  { name: 'Bangladesh Generic (Test)', url: 'https://channel-swart.vercel.app/bd.m3u8', logo: 'https://i.ibb.co.com/PG7zf8xb/download.jpg', type: 'application/x-mpegURL', category: 'general' },
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
  sections.forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  if (id === 'events') {
    displayEvents();
  }
  if (id === 'chat') {
    initializeChat();
  }
  if (id === 'live-tv') {
    // Call filterChannels directly as Hls.js is pre-loaded now
    filterChannels();
    // Play first channel if not already playing or no source
    if (channels.length > 0 && !tvPlayer.src) {
        playChannel(channels[0].url, channels[0].name);
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
    const jokeApiUrl = 'https://v2.jokeapi.dev/joke/Any?safe-mode';
    const jokeRes = await fetch(jokeApiUrl);
    const jokeData = await jokeRes.json();
    let englishJokeText = jokeData.type === 'single' ? jokeData.joke : `${jokeData.setup}\n\n${jokeData.delivery}`;
    const translatedText = await translateText(englishJokeText);
    jokeBox.innerText = translatedText;
  } catch (error) {
    console.error("Joke loading error:", error);
    jokeBox.innerText = 'জোকস লোড করা যায়নি!';
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
  } catch(error) {
    console.error("Story loading error:", error);
    storyBox.innerText = 'গল্প লোড করা যায়নি! (stories.json ফাইলটি চেক করুন)';
  }
}

// Profile Section
function saveProfile() {
  const name = sanitizeInput(document.getElementById('username').value);
  const email = sanitizeInput(document.getElementById('email').value);
  const msg = document.getElementById('profileMessage');

  if (name && email) {
    localStorage.setItem('userProfile', JSON.stringify({ name, email, favorites: JSON.parse(localStorage.getItem('favorites') || '[]') }));
    msg.innerHTML = `<div class='card'>🎉 ধন্যবাদ, ${name}! প্রোফাইল সেভ হয়েছে।</div>`;
    displayProfile();
    // alert(`প্রোফাইল সেভ হয়েছে: ${name}`); // Avoid too many alerts
  } else {
    msg.innerHTML = `<div class='card'>⚠️ সকল তথ্য পূরণ করুন!</div>`;
    // alert('সকল তথ্য পূরণ করুন!'); // Avoid too many alerts
  }
}

function displayProfile() {
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  if (profile.name) {
    document.getElementById('username').value = profile.name;
    document.getElementById('email').value = profile.email;
  } else {
      document.getElementById('username').value = '';
      document.getElementById('email').value = '';
  }
  const favoriteChannels = JSON.parse(localStorage.getItem('favorites') || '[]');
  const favoriteList = document.getElementById('favoriteChannels');
  favoriteList.innerHTML = '';
  if (favoriteChannels.length === 0) {
      favoriteList.innerHTML = '<li class="list-group-item text-center">কোনো ফেভারিট চ্যানেল নেই।</li>';
  }
  favoriteChannels.forEach(channelName => {
    const channel = channels.find(ch => ch.name === channelName);
    if (channel) {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      li.innerHTML = `
        <span>${channel.name}</span>
        <button class="btn btn-sm btn-danger" onclick="removeFavorite('${channel.name}')" aria-label="${channel.name} ফেভারিট থেকে সরান">সরান</button>
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
    // alert(`${channelName} ফেভারিট লিস্টে যোগ হয়েছে।`); // Avoid too many alerts
  } else {
      // alert(`${channelName} ইতিমধ্যেই ফেভারিট লিস্টে আছে।`);
  }
}

function removeFavorite(channelName) {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  favorites = favorites.filter(name => name !== channelName);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayProfile();
  // alert(`${channelName} ফেভারিট থেকে সরানো হয়েছে।`); // Avoid too many alerts
}

// Events Section
function addEvent() {
  const eventContentInput = document.getElementById('eventContent');
  const content = sanitizeInput(eventContentInput.value.trim());
  if (content) {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const now = new Date();
    events.push({ content, timestamp: now.toISOString() });
    localStorage.setItem('events', JSON.stringify(events));
    eventContentInput.value = '';
    displayEvents();
    // alert('নতুন ইভেন্ট পোস্ট করা হয়েছে।'); // Avoid too many alerts
  } else {
    alert('কিছু লিখুন!');
  }
}

function displayEvents() {
  const eventListDiv = document.getElementById('eventList');
  const events = JSON.parse(localStorage.getItem('events') || '[]');
  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  eventListDiv.innerHTML = events.length === 0 ? '<div class="card text-center text-muted">কোনো ইভেন্ট নেই।</div>' : '';
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
    document.getElementById('chatBox').innerHTML = '<div class="alert alert-warning">চ্যাট ফিচারের জন্য HTTPS বা localhost প্রয়োজন।</div>';
    document.getElementById('chatRoomId').disabled = true;
    document.querySelector('#chat button').disabled = true;
    return;
  }
  if (!peer) {
    peer = new Peer({ debug: 2 }); // Add debug for easier troubleshooting
    peer.on('open', id => {
      console.log('Peer ID:', id);
    });
    peer.on('connection', conn => {
      chatConn = conn;
      setupChatConnection();
    });
    peer.on('error', err => {
        console.error('PeerJS error (Chat):', err);
        document.getElementById('chatBox').innerHTML = '<div class="alert alert-danger">চ্যাট ইনিশিয়ালাইজেশন ত্রুটি।</div>';
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
  chatConn.on('open', () => {
    console.log('Chat connection opened.');
    document.getElementById('chatBox').innerHTML = '<div class="alert alert-success">চ্যাট রুমে সংযুক্ত!</div>';
    document.getElementById('chatRoomId').disabled = true;
    document.querySelector('#chat button').disabled = false; // Enable send button
  });

  chatConn.on('data', data => {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    const now = new Date();
    const timeString = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    messageElement.innerHTML = `
      <p style="margin: 0;">${data.content}</p>
      <small>${timeString}</small>
      <button class="btn btn-sm btn-info ms-2" onclick="translateMessage('${data.content}')" aria-label="মেসেজ ট্রান্সলেট করুন">ট্রান্সলেট</button>
    `;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    // alert(`নতুন মেসেজ: ${data.content}`); // Avoid too many alerts
  });

  chatConn.on('close', () => {
    console.log('Chat connection closed.');
    document.getElementById('chatBox').innerHTML = '<div class="alert alert-warning">চ্যাট সংযোগ বিচ্ছিন্ন হয়েছে।</div>';
    document.getElementById('chatRoomId').disabled = false;
    document.querySelector('#chat button').disabled = true; // Disable send button
  });

  chatConn.on('error', err => {
    console.error('Chat connection error:', err);
    document.getElementById('chatBox').innerHTML = '<div class="alert alert-danger">চ্যাট সংযোগে ত্রুটি।</div>';
  });
}

function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = sanitizeInput(chatInput.value.trim());
  if (message && chatConn && chatConn.open) { // Check if connection is open
    const now = new Date();
    const timeString = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    chatConn.send({ content: message });
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.style.textAlign = 'right'; // For sent messages
    messageElement.style.marginLeft = 'auto'; // Align to right
    messageElement.innerHTML = `
      <p style="margin: 0;">${message}</p>
      <small>${timeString}</small>
      <button class="btn btn-sm btn-info ms-2" onclick="translateMessage('${message}')" aria-label="মেসেজ ট্রান্সলেট করুন">ট্রান্সলেট</button>
    `;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatInput.value = '';
    // alert(`মেসেজ পাঠানো হয়েছে: ${message}`); // Avoid too many alerts
  } else {
    alert('মেসেজ লিখুন বা রুমে জয়েন করুন! (সংযোগ বিচ্ছিন্ন হতে পারে)');
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
        source: 'en', // Assuming jokes are mostly English, adjust as needed
        target: 'bn'
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data && data.translatedText) {
        return data.translatedText;
    } else {
        console.error("Translation API returned unexpected data:", data);
        return 'ট্রান্সলেশন ব্যর্থ হয়েছে।';
    }
  } catch (error) {
    console.error("Translation API error:", error);
    return 'ট্রান্সলেশন ব্যর্থ হয়েছে। (নেটওয়ার্ক সমস্যা?)';
  }
}

// Live TV Section
function playChannel(streamUrl, channelName) {
  streamError.style.display = 'none';
  videoSpinner.style.display = 'block';

  if (tvPlayer.hls) { // Clean up previous HLS instance if any
    tvPlayer.hls.destroy();
    tvPlayer.hls = null;
  }

  if (Hls.isSupported() && streamUrl.endsWith('.m3u8')) {
    const hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(tvPlayer);
    tvPlayer.hls = hls; // Store hls instance on player for later cleanup

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoSpinner.style.display = 'none';
      tvPlayer.play().catch(error => {
        console.error("ভিডিও প্লে করতে সমস্যা হয়েছে (HLS):", error);
        streamError.innerText = 'চ্যানেল লোড করা যায়নি। প্লেব্যাক ত্রুটি।';
        streamError.style.display = 'block';
        videoSpinner.style.display = 'none';
        setTimeout(() => streamError.style.display = 'none', 5000);
      });
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS.js error:', data);
        videoSpinner.style.display = 'none';
        streamError.innerText = `স্ট্রিম লোড ব্যর্থ: ${data.details || 'Unknown error'}`;
        streamError.style.display = 'block';
        setTimeout(() => streamError.style.display = 'none', 7000); // Longer timeout for HLS errors
        if (data.fatal) {
            switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
                hls.recoverMediaError();
                break;
            case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
            default:
                hls.destroy();
                break;
            }
        }
    });

  } else {
    // For other video types (like MP4) or if HLS.js is not supported/needed
    tvPlayer.src = streamUrl;
    tvPlayer.load(); // Reload the video element to pick up new source
    videoSpinner.style.display = 'none';
    tvPlayer.play().catch(error => {
      console.error("ভিডিও প্লে করতে সমস্যা হয়েছে:", error);
      streamError.innerText = 'চ্যানেল লোড করা যায়নি। প্লেব্যাক ত্রুটি।';
      streamError.style.display = 'block';
      setTimeout(() => streamError.style.display = 'none', 5000);
    });
  }

  tvPlayer.onerror = (event) => {
    console.error("Video element error:", event);
    streamError.innerText = 'ভিডিও লোড করতে সমস্যা হয়েছে। স্ট্রিম URL সঠিক নয় অথবা ফরম্যাট সমর্থিত নয়।';
    streamError.style.display = 'block';
    videoSpinner.style.display = 'none';
    setTimeout(() => streamError.style.display = 'none', 5000);
  };

  currentChannelName.innerText = `এখন চলছে: ${channelName}`;
  const listItems = channelList.querySelectorAll('.list-group-item');
  listItems.forEach(item => item.classList.remove('active-channel'));
  const activeItem = channelList.querySelector(`[data-stream-url="${streamUrl}"]`);
  if (activeItem) {
    activeItem.classList.add('active-channel');
  }
}

function setupChannels() {
  if (!navigator.onLine) {
    channelList.innerHTML = '<li class="list-group-item text-center text-muted">অফলাইনে লাইভ টিভি উপলব্ধ নয়।</li>';
    currentChannelName.innerText = 'ইন্টারনেট সংযোগ প্রয়োজন';
    return;
  }
  filterChannels(); // Directly call filterChannels now that Hls.js is pre-loaded
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
    channelList.innerHTML = '<li class="list-group-item text-center text-muted">কোনো চ্যানেল পাওয়া যায়নি।</li>';
    return;
  }

  filteredChannels.forEach(channel => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'align-items-center');
    listItem.setAttribute('role', 'button');
    listItem.setAttribute('aria-label', `${channel.name} চ্যানেল প্লে করুন`);

    if (channel.logo) {
      const img = document.createElement('img');
      img.src = channel.logo;
      img.alt = channel.name + ' লোগো';
      img.setAttribute('loading', 'lazy'); // Optimize image loading
      img.style.width = '30px';
      img.style.height = '30px';
      img.style.marginRight = '10px';
      img.style.borderRadius = '5px';
      img.onerror = function() { this.src = './icons/default-logo.png'; }; // Fallback to default logo
      listItem.appendChild(img);
    } else {
        // If no logo, create a placeholder div for consistent spacing
        const placeholderDiv = document.createElement('div');
        placeholderDiv.style.width = '30px';
        placeholderDiv.style.height = '30px';
        placeholderDiv.style.marginRight = '10px';
        placeholderDiv.style.display = 'inline-block';
        listItem.appendChild(placeholderDiv);
    }

    const channelNameSpan = document.createElement('span');
    channelNameSpan.innerText = channel.name;
    listItem.appendChild(channelNameSpan);

    const favoriteButton = document.createElement('button');
    favoriteButton.classList.add('btn', 'btn-sm', 'btn-success', 'ms-auto');
    favoriteButton.innerText = 'ফেভারিট';
    favoriteButton.onclick = (e) => {
      e.stopPropagation(); // Prevent playChannel from firing
      addFavorite(channel.name);
    };
    listItem.appendChild(favoriteButton);

    listItem.setAttribute('data-stream-url', channel.url);
    listItem.setAttribute('data-channel-name', channel.name);
    listItem.onclick = () => playChannel(channel.url, channel.name);
    channelList.appendChild(listItem);
  });

  // Automatically play the first channel after filtering if live-tv is active
  if (filteredChannels.length > 0 && document.getElementById('live-tv').classList.contains('active')) {
    playChannel(filteredChannels[0].url, filteredChannels[0].name);
  }
}

// Call Section
function initializeCall() {
  if (!window.location.protocol.includes('https') && window.location.hostname !== 'localhost') {
    document.getElementById('yourPeerId').innerText = 'কল ফিচারের জন্য HTTPS বা localhost প্রয়োজন।';
    document.getElementById('callPeerId').disabled = true;
    document.querySelector('#call button').disabled = true;
    return;
  }
  if (!peer) {
    peer = new Peer({ debug: 2 }); // Add debug for easier troubleshooting
    peer.on('open', id => {
      document.getElementById('peerIdDisplay').innerText = id; // Update the span
    });
    peer.on('call', call => {
      if (confirm(`আপনি ${call.peer} থেকে কল গ্রহণ করবেন?`)) {
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
      } else {
        call.close();
      }
    });
    peer.on('error', err => {
        console.error('PeerJS error (Call):', err);
        document.getElementById('yourPeerId').innerText = `পিয়ার ইনিশিয়ালাইজেশন ত্রুটি: ${err.message}`;
    });
  }
}

function startCall() {
  const peerId = sanitizeInput(document.getElementById('callPeerId').value.trim());
  if (!peerId) {
    alert('পিয়ার আইডি লিখুন!');
    return;
  }
  if (!peer || !peer.open) {
      alert('পিয়ার সংযোগ প্রস্তুত নয়। একটু অপেক্ষা করুন বা ব্রাউজার রিফ্রেশ করুন।');
      return;
  }

  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      document.getElementById('localVideo').srcObject = stream;
      const call = peer.call(peerId, stream);
      call.on('stream', remoteStream => {
        document.getElementById('remoteVideo').srcObject = remoteStream;
      });
      call.on('close', () => {
          alert('কল শেষ হয়েছে।');
          document.getElementById('localVideo').srcObject = null;
          document.getElementById('remoteVideo').srcObject = null;
      });
      call.on('error', err => {
          console.error('Call error:', err);
          alert(`কল করতে সমস্যা হয়েছে: ${err.message}`);
      });
    })
    .catch(err => {
      console.error('Media access error:', err);
      alert('ক্যামেরা বা মাইক্রোফোন অ্যাক্সেস করা যায়নি। অনুগ্রহ করে অনুমতি দিন।');
    });
}

// PWA Service Worker Registration - (Keep this in script.js or separate file as is)
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
  // alert('সুপার অ্যাপে স্বাগতম!'); // Welcome alert can be annoying, removed
  displayEvents();
  setupChannels(); // This will call filterChannels internally
  displayProfile();
  showSection('jokes'); // Set initial active section to jokes
};
