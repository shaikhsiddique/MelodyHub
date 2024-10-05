
const cards = document.querySelectorAll('.card');
const audioPlayer = document.getElementById('audioPlayer');
const playSongBtn = document.getElementById('play');
const nextSongBtn = document.getElementById('next');
const prevSongBtn = document.getElementById('previous');
const myProgressBar = document.getElementById('myProgressBar');
const progressBar = document.getElementById('progressBar');
const songname = document.getElementById('songname');
const volumeControl = document.getElementById('volumeControl');

let folder = '';
let songs = [];
let songIndex = 0;
let songInfo;
let playlistSongs;
let audio = new Audio('songs/Aashiqui 2');
audio.volume = 0.5;


cards.forEach(card => {
    card.addEventListener('click', async function () {
        songs.length = 0;
        audio.pause();
        audio.currentTime = 0;
        myProgressBar.style.left = "0%";
        playSongBtn.src = "img/play.svg";

        const folder = card.getAttribute('data-playlist');
        
        try {
            const response = await fetch(`songs/${folder}/info.json`);
            const songInfo = await response.json();
            playlistSongs = songInfo.songs;
            const songCount = playlistSongs.length;

            for (let i = 1; i <= songCount; i++) {
                songs.push(`songs/${folder}/song${i}.mp3`);
            }
            document.getElementById("playlistname").innerHTML = folder;
            songname.innerHTML = playlistSongs[0];
        
        } catch (error) {
            console.error('Error fetching song info:', error);
        }
    });
});


const playSong = (song) => {

    if(!audio.paused){
        playSongBtn.src = "img/play.svg";
        audio.pause();
    }else{
        
    
     audio = new Audio(song);
     audio.play();
     playSongBtn.src = "img/pause.svg";
     audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        myProgressBar.style.left = `${progress}%`;
    });
    
    progressBar.addEventListener('click', (event) => {
        const rect = progressBar.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const width = rect.width;
        const progressPercent = (offsetX / width) * 100;
        audio.currentTime = (progressPercent / 100) * audio.duration; 
    });
}
}


playSongBtn.addEventListener('click',()=>{
    
    playSong(songs[songIndex]);
    songname.textContent = playlistSongs[songIndex];
})
prevSongBtn.addEventListener('click',()=>{
    audio.pause();
    songIndex--;
    if(songIndex <0){
        songIndex = playlistSongs.length-1;
    }
    playSong(songs[songIndex]);
    songname.textContent = playlistSongs[songIndex];
})
nextSongBtn.addEventListener('click',()=>{
    audio.pause();
    songIndex++;
    if(songIndex > playlistSongs.length-1){
        songIndex= 0
    }
    playSong(songs[songIndex]);
    songname.textContent = playlistSongs[songIndex];
})

volumeControl.addEventListener('input', () => {
    const volumeValue = volumeControl.value / 100;  
    audio.volume = volumeValue;
});







