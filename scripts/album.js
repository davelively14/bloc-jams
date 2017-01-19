var createSongRow = function(songNumber, songName, songLength) {
  var template = `
  <tr class="album-view-song-item">
    <td class="song-item-number" data-song-number="` + songNumber + `">` + songNumber + `</td>
    <td class="song-item-title">` + songName + `</td>
    <td class="song-item-duration">` + buzz.toTimer(songLength) + `</td>
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

var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event) {
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);
      setCurrentTimeInPlayerBar(buzz.toTimer(currentSoundFile.getTime()));
    });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;

  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar')

  $seekBars.click(function(event) {
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;
    updateSeekPercentage($(this), seekBarFillRatio);

    if ($(this).parent().attr('class') === "seek-control") {
      seek(currentSoundFile.getDuration() * seekBarFillRatio);
    } else {
      currentSoundFile.setVolume(Math.round(seekBarFillRatio * 100));
    }
  });

  $seekBars.find('.thumb').mousedown(function(event) {
    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      updateSeekPercentage($seekBar, seekBarFillRatio);

      if ($(this).parent().attr('class') === "seek-control") {
        seek(currentSoundFile.getDuration() * seekBarFillRatio);
      } else {
        currentSoundFile.setVolume(Math.round(seekBarFillRatio * 100));
      }
    });

    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};

var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }

  getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);

  currentlyPlayingSongNumber = songNumber;

  getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
  currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];

  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });

  updatePlayerBarSong();
  setVolume(currentVolume);
  currentSoundFile.play();
  updateSeekPercentage($('.volume .seek-bar'), currentVolume / 100);
  updateSeekBarWhileSongPlays();
};

var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
}

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
  $('.total-time').text(buzz.toTimer(currentSongFromAlbum.duration));
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

var setCurrentTimeInPlayerBar = function(currentTime) {
  $('.current-time').text(currentTime);
};

// This is an unnecessary function, as the buzz class comes with this function:
// buzz.toTimer();
var filterTimeCode = function(timeInSeconds) {
  var minutes = Math.floor(timeInSeconds / 60);
  var seconds = timeInSeconds % 60;
  return minutes + ":" + seconds;
}

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
  setupSeekBars();
  $previousButton.click(prevSong);
  $nextButton.click(nextSong);
  $bigPlayPause.click(togglePlayFromPlayerBar);
});
