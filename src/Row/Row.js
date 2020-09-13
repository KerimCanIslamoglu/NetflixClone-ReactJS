import React, { useEffect, useState } from 'react'
import axios from '../axios'
import "./Row.css"

import YouTube from 'react-youtube'
import movieTrailer from 'movie-trailer'

const base_url = "https://image.tmdb.org/t/p/original/"

function Row(props) {

    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        async function fetchDate() {
            const request = await axios.get(props.fetchUrl)
            setMovies(request.data.results)
            return request;
        }

        fetchDate();
    }, [props.fetchUrl])

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1
        }
    }

    const handleClick = (movie) => {
        console.log('mv', movie)
        if (trailerUrl) {
            setTrailerUrl("")
        }
        else {
            movieTrailer(movie?.name || "")
                .then(url => {
                    console.log('url', url)
                    const urlParams = new URLSearchParams(new URL(url).search);

                    setTrailerUrl(urlParams.get("v"))

                    console.log('trailer', urlParams.get("v"))

                }).catch((error) => console.log(error))
        }
    }

    return (
        <div className="row">
            <h2>{props.title}</h2>

            <div className="row_posters">
                {movies.map(movie => (
                    <img
                        onClick={() => handleClick(movie)}
                        key={movie.id}
                        className={`row_poster ${props.isLargeRow && "row_posterLarge"}`}
                        src={`${base_url}${props.isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie.name} />
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row
