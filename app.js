require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:  
app.get("/", async (req, res) => {
    res.render("home");
});

app.get("/artist-search", async (req, res) => {
const { theArtistName } = req.query;

const result = await spotifyApi.searchArtists(theArtistName);
let artists = result.body.artists.items;
res.render("artist-search-results", {artists, theArtistName});
});

app.get("/albums/:artistId", async (req, res) => {
let artistId = req.params.artistId;
const result = await spotifyApi.getArtistAlbums(artistId)
const artist = await spotifyApi.getArtist(artistId);
const artistName = artist.body.name;
let albums = result.body.items;


res.render("albums", {albums, artistName});
});

app.get("/tracks/:trackId", async (req, res) => {
  let trackId = req.params.trackId;

  const result = await spotifyApi.getAlbumTracks(trackId)
  let tracks = result.body.items;
 
  const album = await spotifyApi.getAlbum(trackId)
  const albumName = album.body.name;

  res.render("tracks", {tracks, albumName})
})






app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
