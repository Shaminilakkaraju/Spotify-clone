import React, { Suspense } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { useStateValue } from "./utils/StateProvider";
import { getTokenFromResponse } from "./utils/spotify";
import "./App.css";
import Login from "./components/Login";

const s = new SpotifyWebApi();

const Player = React.lazy(() => import("./components/Player"));

function App() {
  const [{ token }, dispatch] = useStateValue();

  React.useEffect(() => {
    const hash = getTokenFromResponse();
    window.location.hash = "";
    let _token = hash.access_token;

    if (_token) {
      s.setAccessToken(_token);

      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });

      s.getPlaylist("37i9dQZEVXcJZyENOWUFo7").then((response) =>
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: response,
        })
      );

      s.getMyTopArtists().then((response) =>
        dispatch({
          type: "SET_TOP_ARTISTS",
          top_artists: response,
        })
      );

      dispatch({
        type: "SET_SPOTIFY",
        spotify: s,
      });

      s.getMe().then((user) => {
        dispatch({
          type: "SET_USER",
          user,
        });
      });

      s.getUserPlaylists().then((playlists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists,
        });
      });
    }
  }, [token, dispatch]);

  return (
    <div className="app">
      {!token && <Login />}
      {token && (
        <Suspense fallback={<div>Loading...</div>}>
          <Player spotify={s} />
        </Suspense>
      )}
    </div>
  );
}

export default App;
