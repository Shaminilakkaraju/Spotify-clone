import React, { useEffect } from "react";
import "./Header.css";
import { useStateValue } from "../utils/StateProvider";
import { Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function Header({ spotify }) {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const fetchUser = async () => {
      if (!spotify) return;
      try {
        const userData = await spotify.getMe();
        dispatch({
          type: "SET_USER",
          user: userData,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [spotify, dispatch]);

  return (
    <div className="header">
      <div className="header__left">
        <SearchIcon />
        <input
          placeholder="Search for Artists, Songs, or Podcasts"
          type="text"
        />
      </div>
      <div className="header__right">
        {user && (
          <>
            <Avatar alt={user.display_name} src={user.images[0]?.url} />
            <h4>{user.display_name}</h4>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
