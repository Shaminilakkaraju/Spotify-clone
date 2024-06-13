import React, { useEffect } from "react";
import { useStateValue } from "../utils/StateProvider";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import "./Footer.css";
import { Grid, Slider } from '@mui/material';

function Footer({ spotify }) {
  const [{ item, playing }, dispatch] = useStateValue();

  useEffect(() => {
    if (!spotify) return;

    const fetchPlaybackState = async () => {
      try {
        const r = await spotify.getMyCurrentPlaybackState();
        dispatch({
          type: "SET_PLAYING",
          playing: r.is_playing,
        });
        dispatch({
          type: "SET_ITEM",
          item: r.item,
        });
      } catch (error) {
        console.error("Error fetching playback state:", error);
      }
    };

    fetchPlaybackState();
  }, [spotify, dispatch]);

  const handlePlayPause = async () => {
    try {
      if (playing) {
        await spotify.pause();
        dispatch({
          type: "SET_PLAYING",
          playing: false,
        });
      } else {
        await spotify.play();
        dispatch({
          type: "SET_PLAYING",
          playing: true,
        });
      }
    } catch (error) {
      console.error("Error handling play/pause:", error);
    }
  };

  const skipNext = async () => {
    try {
      await spotify.skipToNext();
      const r = await spotify.getMyCurrentPlayingTrack();
      dispatch({
        type: "SET_ITEM",
        item: r.item,
      });
      dispatch({
        type: "SET_PLAYING",
        playing: true,
      });
    } catch (error) {
      console.error("Error skipping to next:", error);
    }
  };

  const skipPrevious = async () => {
    try {
      await spotify.skipToPrevious();
      const r = await spotify.getMyCurrentPlayingTrack();
      dispatch({
        type: "SET_ITEM",
        item: r.item,
      });
      dispatch({
        type: "SET_PLAYING",
        playing: true,
      });
    } catch (error) {
      console.error("Error skipping to previous:", error);
    }
  };

  return (
    <div className="footer">
      <div className="footer__left">
        {item && item.album && item.album.images && item.album.images[0] && (
          <img
            className="footer__albumLogo"
            src={item.album.images[0].url}
            alt={item.name}
          />
        )}
        {item ? (
          <div className="footer__songInfo">
            <h4>{item.name}</h4>
            <p>{item.artists.map((artist) => artist.name).join(", ")}</p>
          </div>
        ) : (
          <div className="footer__songInfo">
            <h4>No song is playing</h4>
            <p>...</p>
          </div>
        )}
      </div>

      <div className="footer__center">
        <ShuffleIcon className="footer__green" />
        <SkipPreviousIcon onClick={skipPrevious} className="footer__icon" />
        {playing ? (
          <PauseCircleOutlineIcon
            onClick={handlePlayPause}
            fontSize="large"
            className="footer__icon"
          />
        ) : (
          <PlayCircleOutlineIcon
            onClick={handlePlayPause}
            fontSize="large"
            className="footer__icon"
          />
        )}
        <SkipNextIcon onClick={skipNext} className="footer__icon" />
        <RepeatIcon className="footer__green" />
      </div>
      <div className="footer__right">
        <Grid container spacing={2}>
          <Grid item>
            <PlaylistPlayIcon />
          </Grid>
          <Grid item>
            <VolumeDownIcon />
          </Grid>
          <Grid item xs>
            <Slider aria-labelledby="continuous-slider" />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Footer;
