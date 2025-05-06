from flask import Flask, render_template, request, send_from_directory
from flask_socketio import SocketIO, join_room
import bleach
from datetime import datetime

app = Flask(__name__, static_folder='static', template_folder='templates')
app.config['SECRET_KEY'] = '123456'
socketio = SocketIO(app, cors_allowed_origins="*")

# Store comments and listeners
usernames = {}
comments = {
    'main': [],
    'rock': [],
    'classical': [],
    'electronic': []
}

listeners = {
    'main': set(),
    'rock': set(),
    'classical': set(),
    'electronic': set()
}

@app.route('/')
def home():
    return render_template('main.html', genre='main')

@app.route('/<genre>')
def genre_page(genre):
    if genre not in comments:
        return render_template('404.html'), 404
    return render_template('player.html', genre=genre)

@app.route('/playlists/<genre>.json')
def get_playlist(genre):
    return send_from_directory('playlists', f'{genre}.json')

@app.route('/songs/<path:path>')
def serve_song(path):
    return send_from_directory('static/songs', path)

# Socket.IO handlers
@socketio.on('connect')
def handle_connect():
    genre = request.args.get('genre', 'main')
    join_room(genre)
    listeners[genre].add(request.sid)
    default_username = f"user{hash(request.sid) % 1000:03d}"
    usernames[request.sid] = default_username
    print(f"{default_username} connected to {genre}.")
    socketio.emit('user_count', {'count': len(listeners[genre])}, room=genre)
    socketio.emit('comment_history', comments[genre], room=request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    for genre in listeners:
        if request.sid in listeners[genre]:
            listeners[genre].remove(request.sid)
            socketio.emit('user_count', {'count': len(listeners[genre])}, room=genre)
    user = usernames.pop(request.sid, "unknown_user")
    print(f"{user} disconnected.")

@socketio.on('set_username')
def handle_set_username(data):
    username = bleach.clean(
        text=data.get('username', ''),
        tags=[],
        attributes={},
        strip=True
    )[:20]

    if username:
        usernames[request.sid] = username
        print(f"User {request.sid} set username to {username}")

@socketio.on('new_comment')
def handle_new_comment(data):
    genre = data.get('genre', 'main')
    raw_comment = data.get('comment', '')[:200]
    user = usernames.get(request.sid, f"guest{hash(request.sid) % 1000:03d}")

    clean_comment = bleach.clean(
        text=raw_comment,
        tags=[],
        attributes={},
        strip=True
    )

    if clean_comment:
        timestamp = datetime.now().strftime("%H:%M")
        comment_data = {
            'text': clean_comment,
            'time': timestamp,
            'user': user
        }
        comments[genre].append(comment_data)
        print(f"New comment from {user} in {genre}: {clean_comment}")
        socketio.emit('new_comment', comment_data, room=genre)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
