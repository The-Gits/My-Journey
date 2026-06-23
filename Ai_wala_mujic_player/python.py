from flask import Flask, render_template, request
import playsound
app = Flask(__name__)

@app.route('/home/soham/Music/nyancat/NyanCatOriginals/'Nyan Cat [original].mp3'', methods=['POST'])
def play():
    filename = '/home/soham/Music/nyancat/NyanCatOriginals/Nyan Cat [original].mp3' # replace this with the actual path to your audio file
    if request.method == 'POST':
        playsound.playsound(filename)
        return render_template('playback.html', played=True)
