// Initialize the necessary elements
const audioPlayer = document.getElementById('player');
let currentPlaylist = [];
let currentTrackIndex = 0;
let currentGenre = window.location.pathname.split('/')[1] || 'main';
let username = localStorage.getItem('username') || null;

const socket = io({
    query: { genre: currentGenre }
});

// Function to load the playlist
function loadPlaylist() {
    fetch(`/playlists/${currentGenre}.json`)
        .then(response => response.json())
        .then(playlist => {
            currentPlaylist = shuffleArray(playlist);
            playTrack(0);
        })
        .catch(console.error);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function playTrack(index) {
    if (!currentPlaylist.length) return;
    currentTrackIndex = index % currentPlaylist.length;
    const track = currentPlaylist[currentTrackIndex];

    audioPlayer.src = `/songs/${currentGenre}/${track.file}`;
    document.getElementById('now-playing').innerHTML =
        `Now Playing: <span style="font-weight: bold; color: var(--button-color);">${track.title}</span> 
         <br> by 
         <span style="font-style: italic; color: var(--button-color);">${track.artist}</span>`;

    audioPlayer.play();
}

function setupSocket() {
    socket.on('connect', () => {
        console.log('Connected to server');
        // Send username if it's already set
        if (username) {
            socket.emit('set_username', { username });
        }
    });

    socket.on('new_comment', comment => {
        const container = document.getElementById('comments');
        const div = document.createElement('div');
        div.className = 'comment';
        div.innerHTML = `
            <span class="comment-time">${comment.time}</span>
            <span class="comment-user">${comment.user}:</span>
            <span class="comment-text">${comment.text}</span>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    });

    socket.on('comment_history', comments => {
        const container = document.getElementById('comments');
        container.innerHTML = comments.map(c => `
            <div class="comment">
                <span class="comment-time">${c.time}</span>
                <span class="comment-user">${c.user}:</span>
                <span class="comment-text">${c.text}</span>
            </div>
        `).join('');
        container.scrollTop = container.scrollHeight;
    });

    socket.on('user_count', data => {
        const countElement = document.getElementById('user-count');
        if (countElement) {
            countElement.textContent = `(${data.count} listener${data.count !== 1 ? 's' : ''})`;
        }
    });
}

function postComment() {
    const input = document.getElementById('comment-input');
    const comment = input.value.trim();

    if (!username) {
        alert('Please set a username first.');
        return;
    }

    if (comment) {
        socket.emit('new_comment', {
            genre: currentGenre,
            comment: comment
        });
        input.value = '';
    }
}

// Username setting logic
function setupUsername() {
    const usernameDisplay = document.getElementById('current-username');
    const setUsernameLink = document.getElementById('set-username-link');

    const updateUsernameDisplay = () => {
        usernameDisplay.textContent = username ? `👤 ${username}` : "👤 Guest";

        // Hide "Set Username" link if username is set
        if (username) {
            setUsernameLink.style.display = 'none';
        }
    };

    setUsernameLink.addEventListener('click', () => {
        const input = prompt("Enter your username (max 20 characters):", username || '');
        if (input) {
            username = input.trim().slice(0, 20);
            localStorage.setItem('username', username);
            updateUsernameDisplay();
            socket.emit('set_username', { username });
        }
    });

    updateUsernameDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
    loadPlaylist();
    setupSocket();
    setupPlayerEvents();
    setupUsername();

    const commentInput = document.getElementById('comment-input');
    if (commentInput) {
        commentInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                postComment();
            }
        });
    }
});

function setupPlayerEvents() {
    audioPlayer.addEventListener('ended', () => {
        playTrack(currentTrackIndex + 1);
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const current = formatTime(audioPlayer.currentTime);
        const duration = formatTime(audioPlayer.duration || 0);
        document.getElementById('track-progress').textContent =
            `${current} / ${duration}`;
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
