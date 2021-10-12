'use strict';


const app = {
    audio: null,
    tracks: [],
    currentUrl: null,
    coverImg: null,
    currentTime: null,
    duration: null,
    btnPlayPause: null
};

/** Plays a song 
 * @param {string} url - The url of the song 
 */
app.play = function (url) {
    const elements = document.querySelectorAll('#playlist li.active');
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('active');
    }


    const selectedElement = document.querySelector('#playlist li[data-url="' + url + '"]');
    selectedElement.classList.add('active');

    app.currentUrl = url;
    app.audio.src = app.currentUrl;
    app.audio.load();
    app.audio.volume = 0.5;
    app.audio.play();


    const imgsrc = selectedElement.getAttribute("cover_art_url");
    if (imgsrc != null)
        document.getElementById("coverImg").setAttribute("src", imgsrc);


}

/** Changes the current song */
app.next = function () {
    let index = app.tracks.indexOf(app.currentUrl) + 1;
    if (index >= app.tracks.length) {
        index = 0;
    }

    app.play(app.tracks[index]);
}

app.load = async function () {
    app.audio = document.getElementById('audio');
    app.currentTime = document.querySelector('#currentTime');
    app.duration = document.querySelector('#duration');
    app.btnPlayPause = document.getElementById('btnPlayPause');


    var playlist = document.getElementById("playlist");
    await fetch('songs.json')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            for (var i = 0; i < data.length; i++) {
                var lis = document.createElement("li");
                lis.setAttribute("data-url", data[i].url);
                lis.setAttribute("cover_art_url", data[i].cover_art_url);
                lis.setAttribute("class", "list-group-item");
                lis.innerHTML = data[i].name + " - " + data[i].artist;
                playlist.appendChild(lis);
            }
        })
        .catch((err) => {
            console.log("json err")
        })

    // Iterate over the playlist in order to associate events
    const elements = document.querySelectorAll('#playlist li');
    for (let i = 0; i < elements.length; i++) {

        const url = elements[i].dataset.url;
        app.tracks.push(url);

        elements[i].addEventListener('click', function () {
            app.play(this.dataset.url);
        });
    }
    // Handle the timeupdate event
    app.audio.addEventListener('durationchange', function () {
        app.duration.textContent = app.secondsToString(app.audio.duration);

    });

    let timeSlider = document.getElementById("timeRange");

    app.audio.src = localStorage.getItem("song");
    app.audio.currentTime = localStorage.getItem("time")
    app.audio.addEventListener('timeupdate', function () {
        const currentTime = app.audio.currentTime;


        if (app.audio.duration) {
            app.currentTime.textContent = app.secondsToString(currentTime);
            let t = app.audio.currentTime / app.audio.duration * 100;
            timeSlider.value = t;

            timeSlider.oninput = function () {
                document.getElementById("audio").currentTime = (app.audio.duration * this.value) / 100;
            }
            localStorage.setItem("song", app.audio.src);
            localStorage.setItem("time", app.audio.currentTime);

        }
        else {
            app.currentTime.textContent = '...';
        };
    });



    // Handle the play event
    app.audio.addEventListener('play', function () {
        app.btnPlayPause.children[0].classList.remove('fa-play');
        app.btnPlayPause.children[0].classList.add('fa-pause');
    });


    // Handle the pause event
    app.audio.addEventListener('pause', function () {
        app.btnPlayPause.children[0].classList.add('fa-play');
        app.btnPlayPause.children[0].classList.remove('fa-pause');


    });

    // Handle the ended event
    app.audio.addEventListener('ended', app.next);

    // Handle the click event btnPlayPause
    document.getElementById('btnPlayPause').addEventListener('click', function () {
        if (app.audio.src === "") {
            app.play(app.tracks[0]);
        } else {
            if (app.audio.paused) {
                app.audio.play();
            }
            else {
                app.audio.pause();
            }
        }



    });

    // Handle the click event on btnForward
    document.getElementById('btnForward').addEventListener('click', function () {
        app.audio.currentTime += 10;
    });

    // Handle the click event on btnNext
    document.getElementById('btnNext').addEventListener('click', app.next);
};

//Volume range
let volumeSlider = document.getElementById("volumeRange");
volumeSlider.oninput = function () {
    document.getElementById("audio").volume = this.value / 100;
}



/**
* A utility function for converting a time in miliseconds to a readable time of minutes and seconds.
* @param {number} seconds The time in seconds.
* @return {string} The time in minutes and/or seconds.
**/
app.secondsToString = function (seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);

    min = min >= 10 ? min : '0' + min;
    sec = sec >= 10 ? sec : '0' + sec;

    const time = min + ':' + sec;

    return time;
};

