var createSongRow = function(songNumber, songName, songLength) {
  var template = `
  <tr class="album-view-song-item">
    <td class="song-item-number" data-song-number="` + songNumber + `">` + songNumber + `</td>
    <td class="song-item-title">` + songName + `</td>
    <td class="song-item-duration">` + songLength + `</td>
  </tr>
  `;

  var $row = $(template);

  var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

    if(currentlyPlayingSongNumber !== songNumber) {
      setSong(songNumber);
    } else if (currentSoundFile.isPaused()) {
      $(this).html(pauseButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPauseButton);
      currentSoundFile.play();
    } else {
      $(this).html(playButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPlayButton);
      currentSoundFile.pause();
    }
  };

  var onHover = function(event) {
    var $songItemNumber = $(this).find('.song-item-number');

    if (parseInt($songItemNumber.attr('data-song-number')) !== currentlyPlayingSongNumber) {
      $songItemNumber.html(playButtonTemplate)
    }
  };

  var offHover = function(event) {
    var $songItemNumber = $(this).find('.song-item-number');
    var songNumber = parseInt($songItemNumber.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      $songItemNumber.html(songNumber);
    }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;

  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for(var i = 0; i < album.songs.length; i++){
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }

  getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);

  currentlyPlayingSongNumber = songNumber;

  getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
  currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
  updatePlayerBarSong();

  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });

  setVolume(currentVolume);
  currentSoundFile.play();
};

var setVolume = function(volume) {
  if(currentSoundFile) {
    currentSoundFile.setVolume(volume)
  }
};

var getSongNumberCell = function(songNumber) {
  return $('.song-item-number[data-song-number="' + songNumber + '"]');
};

// Unused, but part of the Checkpoint.
var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var nextSong = function() {
  if(currentlyPlayingSongNumber < currentAlbum.songs.length) {
    var newValue = currentlyPlayingSongNumber + 1;
  } else {
    var newValue = 1;
  }

  setSong(newValue);
};

var prevSong = function() {
  if(currentlyPlayingSongNumber === 1) {
    var newValue = currentAlbum.songs.length;
  } else {
    var newValue = currentlyPlayingSongNumber - 1;
  }

  setSong(newValue);
};

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist)
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

// Plays first song if no song has been played/paused yet. Otherwise, it will
// toggle
var togglePlayFromPlayerBar = function() {
  if (!currentlyPlayingSongNumber) {
    setSong(1);
  } else if (currentSoundFile.isPaused()) {
    currentSoundFile.play();
    $bigPlayPause.html(playerBarPauseButton);
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
  } else {
    currentSoundFile.pause();
    $bigPlayPause.html(playerBarPlayButton);
    getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
  }
};

// Templates
var playButtonTemplate = `<a class="album-song-button"><span class="ion-play"></span></a>`;
var pauseButtonTemplate = `<a class="album-song-button"><span class="ion-pause"></span></a>`;
var playerBarPlayButton = `<span class="ion-play"></span>`;
var playerBarPauseButton = `<span class="ion-pause"></span>`;

// State
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

// Elements
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $bigPlayPause = $('.main-controls .play-pause');

$(document).ready(function(){
  setCurrentAlbum(albumPicasso);
  $previousButton.click(prevSong);
  $nextButton.click(nextSong);
  $bigPlayPause.click(togglePlayFromPlayerBar);
});
