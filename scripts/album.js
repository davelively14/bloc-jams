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
    var songNumber = $(this).attr('data-song-number');

    if(currentlyPlayingSongNumber != songNumber) {
      setSong(songNumber);
    } else {
      $(this).html(playButtonTemplate);
      currentlyPlayingSongNumber = null;
      currentSongFromAlbum = null;
      $('.main-controls .play-pause').html(playerBarPlayButton);
    }
  };

  var onHover = function(event) {
    var $songItemNumber = $(this).find('.song-item-number');

    if ($songItemNumber.attr('data-song-number') != currentlyPlayingSongNumber) {
      $songItemNumber.html(playButtonTemplate)
    }
  };

  var offHover = function(event) {
    var $songItemNumber = $(this).find('.song-item-number');
    var songNumber = $songItemNumber.attr('data-song-number');

    if (songNumber != currentlyPlayingSongNumber) {
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
  getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);

  currentlyPlayingSongNumber = songNumber;

  getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
  currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
  updatePlayerBarSong();
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
    var newValue = parseInt(currentlyPlayingSongNumber) + 1;
  } else {
    var newValue = 1;
  }

  setSong(newValue);
};

var prevSong = function() {
  if(currentlyPlayingSongNumber == 1) {
    var newValue = currentAlbum.songs.length;
  } else {
    var newValue = parseInt(currentlyPlayingSongNumber) - 1;
  }

  setSong(newValue);
};

var skipSong = function(value) {
  var test = (parseInt(currentlyPlayingSongNumber) + value) % currentAlbum.songs.length;

  if(test <= 0 ) {
    var newValue = currentAlbum.songs.length;
  } else {
    var newValue = test;
  }

  setSong(newValue);
}

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist)
  $('.main-controls .play-pause').html(playerBarPauseButton);
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

// Elements
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function(){
  setCurrentAlbum(albumPicasso);
  $previousButton.click(function() { skipSong(-1) });
  $nextButton.click(function() { skipSong(1) });
});
