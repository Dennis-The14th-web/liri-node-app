require("dotenv").config();

var keys = require("./keys")

var moment = require("moment")
moment().format()

var Spotify = require('node-spotify-api');

var axios = require("axios")

// var omdb = require("omdb");

var fs = require("fs");

// bandsintown
var getMeBands = function(artist){
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function(response){
      var concertDate = response.data[0].datetime;
      
      var concertInfo =
      `======================================
      Venue: ${response.data[0].venue.name}
      Venue Location: ${response.data[0].venue.city}, ${response.data[0].venue.country}
      date of the Event: ${moment(concertDate).format('dddd, MMMM Do YYYY, h:mm:ss a')}`

    //   datalog("Concert Searched", artist , concertInfo)
      console.log(concertInfo);
    })
}

// spotify

var getArtistNames = function(artist) {
    return artist.name;
}

var getMeSpotify = function(songName) {
    
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: songName }, function(err, data){
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songs = data.tracks.items
        for(var i=0; i<songs.length; i++){

                    var songInfo = 
            `${i}
            Artist(s): ${songs[i].artists.map(getArtistNames)}
            Song Name: ${songs[i].name}
            Preview Song: ${songs[i].preview_url}
            Album: ${songs[i].album.name}
            ==================================================
            ==================================================`
            // datalog("Song Searched", songName , songInfo)
            console.log(songInfo);
            
        }
    })
}


// movie omdb
var getMeMovie = function(movieName) {

    if (!movieName){
        movieName = "Mr.Nobody"
    }

    axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy").then(function(response){
    var movieInfo =
   `    ===================================================
    Title: ${response.data.Title}
    ===================================================
    Year: ${response.data.Year}
    ===================================================
    Rated: ${response.data.Rated}
    ===================================================
    IMDB Rating: ${response.data.imdbRating}
    ===================================================
    Rotten Tomatoes Rating: ${response.data.Ratings[0].Value}
    ===================================================
    Country: ${response.data.Country}
    ===================================================
    Language: ${response.data.Language}
    ===================================================
    Plot: ${response.data.Plot}
    ===================================================
    Actors: ${response.data.Actors}
    ===================================================`
        // datalog("Movie Searched", movieName, movieInfo)
        console.log(movieInfo)
    })
};

var doWhatItSays = function(){

    fs.readFile("random.txt", "utf8", function (err, data) {
        if(err){
            return console.log(err)
        }
        
        var dataArr = data.split(",")

        runAction(dataArr[0], dataArr[1])
    });
}



var runAction = function(func, parm) {
    switch (func) {
        case "concert-this":
            getMeBands(parm)
            break
        case "spotify-this-song":
            getMeSpotify(parm)
            break
        case "movie-this":
            getMeMovie(parm)
            break
        case "do-what-it-says":
            doWhatItSays()
            break
        default:
            outputData("That is not a command that I recognize, please try again.") 
    }
}


var outputData = function(data) {
    console.log(data)

    fs.appendFile("log.txt", "\r\n" + data, function (err){
        if(err){
            return console.log(err)
        } 
    })
}

runAction(process.argv[2], process.argv[3]);
