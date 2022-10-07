const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playing = $('.playing');
const songName = $('.songName');
const playlist = $('.playlist');
const cd = $('.cd');
const thumbnail = $('.thumbnail');
const image = $('.image');
const playBtn = $('.btn-toggle-play');
const audio = $('#audio');
const right = $('.right');
const left = $('.left');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const progress = $('#progress');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            id: 01,
            name: 'How you like that',
            singer: 'BlackPink',
            time: '03:01',
            path: './assests/music/song1.mp3',
            img: './assests/image/img1.jpg'
        },
        {
            id: 02,
            name: 'Boombayah',
            singer: 'BlackPink',
            time: '04:00',
            path: './assests/music/song2.mp3',
            img: './assests/image/img2.jpg'
        },
        {
            id: 03,
            name: 'Playing with fire',
            singer: 'BlackPink',
            time: '03:17',
            path: './assests/music/song3.mp3',
            img: './assests/image/img3.jpg'
        },
        {
            id: 04,
            name: 'Stay',
            singer: 'BlackPink',
            time: '03:50',
            path: './assests/music/song4.mp3',
            img: './assests/image/img4.jpg'
        },
        {
            id: 05,
            name: 'Pretty Savage',
            singer: 'BlackPink',
            time: '03:19',
            path: './assests/music/song5.mp3',
            img: './assests/image/img5.jpg'
        },
        {
            id: 06,
            name: 'Lovesick Girls',
            singer: 'BlackPink',
            time: '03:12',
            path: './assests/music/song6.mp3',
            img: './assests/image/img6.jpg'
        },
        {
            id: 07,
            name: 'Forever Young',
            singer: 'BlackPink',
            time: '03:57',
            path: './assests/music/song7.mp3',
            img: './assests/image/img7.jpg'
        },
        {
            id: 08,
            name: 'Kill This Love',
            singer: 'BlackPink',
            time: '03:09',
            path: './assests/music/song8.mp3',
            img: './assests/image/img8.jpg'
        },
        {
            id: 09,
            name: 'As if its your last',
            singer: 'BlackPink',
            time: '03:33',
            path: './assests/music/song9.mp3',
            img: './assests/image/img9.jpg'
        },
        {
            id: 10,
            name: 'Duu-du Duu-du',
            singer: 'BlackPink',
            time: '03:29',
            path: './assests/music/song10.mp3',
            img: './assests/image/img10.jpg'
        },
        {
            id: 11,
            name: 'Pink Venom',
            singer: 'BlackPink',
            time: '03:29',
            path: './assests/music/song11.mp3',
            img: './assests/image/img11.jpg'
        },
        {
            id: 10,
            name: 'Shut Down',
            singer: 'BlackPink',
            time: '02:55',
            path: './assests/music/song12.mp3',
            img: './assests/image/img12.jpg'
        },
        
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="item ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                    <div class="item__number">${song.id}</div>
                    <img src="${song.img}">
                    <i class="item-icon fa-solid fa-caret-right"></i>
                    <div class="body">
                        <p class="item-name__song">${song.name}</p>
                        <p class="item-name__singer">${song.singer}</p>
                    </div>
                    <span class="item__time">${song.time}</span>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function () {

        const cdThumbAnimate = thumbnail.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            interations: Infinity
        })
        cdThumbAnimate.pause();

        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        };

        audio.onplay = function () {
            app.isPlaying = true;
            playing.classList.add('play');
            cdThumbAnimate.play();
        }

        audio.onpause = function () {
            app.isPlaying = false;
            playing.classList.remove('play');
            cdThumbAnimate.pause();
        }

        audio.ontimeupdate = function (e) {
            const currentTime = e.target.currentTime;
            const duration = e.target.duration;
            if (duration) {
                const progressPercent = Math.floor(currentTime / duration * 100);
                progress.value = progressPercent;
            }
        }

        progress.onchange = function (e) {
            const seekTime = Math.floor(audio.duration / 100 * e.target.value);
            audio.currentTime = seekTime;
        }

        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            }
            else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        prevBtn.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            }
            else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active', app.isRandom);
        }

        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active', app.isRepeat);
        }

        audio.onended = function () {
            if(app.isRepeat) {
                audio.play();
            }
            else {
                app.nextSong();
                audio.play();
            }
        }

        playlist.onclick = function (e) {
            const songNode = e.target.closest('.item:not(.active)');
            if(songNode){
                app.currentIndex = Number(songNode.dataset.index);
                app.loadCurrentSong();
                app.render();
                audio.play();
            }
        }
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.item.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 100);
    },

    loadCurrentSong: function () {
        songName.textContent = this.currentSong.name;
        image.src = this.currentSong.img;
        audio.src = this.currentSong.path;
        right.textContent = this.currentSong.time;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        app.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        app.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {

        this.handleEvents();

        this.defineProperties();

        this.render();

        this.loadCurrentSong();
    }
}

app.start();