import React, { Component } from 'react';
import axios from 'axios';
import Spinner from '../layouts/Spinner';
import {Link} from 'react-router-dom';
import Track from './Track';

class Lyrics extends Component {
    state={
        track: {},
        lyrics: {},
        album: {},
    }
    

    componentDidMount(){
        axios
        .get(`https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${this.props.match.params.id}&apikey=${
            process.env.REACT_APP_MM_KEY}`)
        .then(res => {
            // console.log(res.data);
            this.setState({lyrics: res.data.message.body.lyrics});
            return axios.get(`https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.get?track_id=${this.props.match.params.id}&apikey=${
                process.env.REACT_APP_MM_KEY}`)
        })
        .then(res => {
            console.log(res.data)
            this.setState({track: res.data.message.body.track});
            let album_id = res.data.message.body.track.album_id;
            return axios.get(`https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/album.get?album_id=${album_id}&apikey=${
                process.env.REACT_APP_MM_KEY}`)
        })
        .then(res => {
            console.log(res.data)
            this.setState({album: res.data.message.body.album});
            let album_id = res.data.message.body.album.album_id;
            return axios.get(`https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/album.tracks.get?album_id=${album_id}&apikey=${
                process.env.REACT_APP_MM_KEY}`)
        })
        .then(res => {
            console.log(res.data)
            // this.setState({track: res.data.message.body.track});
        })
        .catch(err => console.log(err));

    }
    render() {
        const {track, lyrics, album} = this.state;
        console.log(track)
        console.log(album)


        if(track === undefined || lyrics === undefined || Object.keys(track).length === 0 || Object.keys(lyrics).length === 0){

            return <Spinner/>

        }else{
            return(
                <React.Fragment>
                    <Link to= "/" className="btn btn-dark btn-sm mb-4">Go back</Link>
                    <div className="card">
                        <h5 className="card-header">
                            {track.track_name} by {' '}
                            <span className="text-secondary">{track.artist_name}</span>
                        </h5>
                        <div className="card-body">
                            <p className="card-text">{lyrics.lyrics_body}</p>
                        </div>
                    </div>
                    <ul className="list-group mt-3">
                        <li className="list-group-item">
                            <strong>Album Name</strong>: {' ' + album.album_name}
                        </li>
                        <li className="list-group-item">
                            <strong>Song Genre</strong>: {' ' + track.primary_genres.music_genre_list[0].music_genre.music_genre_name}
                        </li>
                        <li className="list-group-item">
                        <strong>Explicit Words</strong>:{' ' + track.explicit === 0 ? ' ' +'No' :' ' + 'Yes'}
                        </li>
                        <li className="list-group-item">
                        <strong>Num. Favourite</strong>:{' ' + track.num_favourite}
                        </li>
                        <li className="list-group-item">
                        <strong>Release Date</strong>:{' ' + album.album_release_date}
                        </li>
                        <li className="list-group-item">
                        <strong>Album Rating</strong>:{' ' + album.album_rating}
                        </li>
                    </ul>



                </React.Fragment>
            )

        }
    }
}
export default Lyrics