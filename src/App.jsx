import { useEffect, useRef, useState } from "react";
// Icons
import ColorThief from "colorthief";
import { FiMenu } from "react-icons/fi";
import "./App.css";
import ProgressBar from "./components/ProgressBar";
import { dummyData } from "./dummyData";
import {
  BiPhotoAlbum,
  BsThreeDots,
  CiSearch,
  FaCirclePause,
  FaCirclePlay,
  FaHeart,
  FaRegHeart,
  IoVolumeMedium,
  IoVolumeMute,
  MdClose,
  MdOutlineBugReport,
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "./icons";

function App() {
  const allSongs = dummyData;
  const [currentAlbum, setCurrentAlbum] = useState(allSongs);
  const [songIndex, setSongIndex] = useState(0);

  // Current Playing Songs ===>
  const [currentSong, setCurrentSong] = useState(currentAlbum[songIndex]);

  // song playing status
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Progress tracker ==>
  const [progress, setProgress] = useState(0);

  // Favourite Songs List ===>
  const [favouriteSongs, setFavouriteSongs] = useState([]);

  // Recently Played songs list ===>
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  // AUDIO PLAYER REF
  const audioRef = useRef(new Audio(currentSong.musicUrl));

  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    // Create new audio element
    const newAudio = new Audio(currentSong.musicUrl);
    newAudio.muted = isMuted;

    const updateProgress = () => {
      const duration = newAudio.duration || currentSong.durationInSeconds;
      const currentTime = newAudio.currentTime;
      const progressPercent = (currentTime / duration) * 100;
      setProgress(progressPercent);
    };

    const handleEnded = playNext;

    // Setup event listeners
    newAudio.addEventListener("timeupdate", updateProgress);
    newAudio.addEventListener("ended", handleEnded);

    // Play/pause management
    if (isPlaying) {
      newAudio.play().catch(() => setIsPlaying(false));
    }

    // Save reference
    audioRef.current = newAudio;
    setAudioElement(newAudio);

    // Cleanup function
    return () => {
      newAudio.pause();
      newAudio.removeEventListener("timeupdate", updateProgress);
      newAudio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]); // Only recreate when song changes

  // PLay/ PAuse button setting ===>
  const togglePlayPause = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(() => setIsPlaying(false));
    }
    setIsPlaying(!isPlaying);
  };

  // Mute button setting ===>
  const toggleMute = () => {
    if (!audioElement) return;
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioElement.muted = newMutedState;
  };

  const changeSong = (newIndex) => {
    if (newIndex >= 0 && newIndex < currentAlbum.length) {
      setSongIndex(newIndex);
      setCurrentSong(currentAlbum[newIndex]);
    }
  };

  // ===> Play next song from list
  const playNext = () => {
    const newIndex = (songIndex + 1) % currentAlbum.length;
    changeSong(newIndex);
  };

  // ===> Play previous song from list
  const playPrev = () => {
    const newIndex =
      (songIndex - 1 + currentAlbum.length) % currentAlbum.length;
    changeSong(newIndex);
  };

  // song selection from list
  const handleSongSelect = (index) => {
    changeSong(index);
    if (!isPlaying) togglePlayPause();
  };

  const [activeMenu, setActiveMenu] = useState("all-songs");

  // PLay song from Menu Card or Songs Card List
  const handleMenuClicks = (e) => {
    const menuId = e.target.id;
    setActiveMenu(menuId);

    if (menuId === "all-songs") {
      setCurrentAlbum(allSongs);
    } else if (menuId === "top") {
      const newAlbum = allSongs.filter((song) => song.playCount > 5000);
      setCurrentAlbum(newAlbum);
    } else if (menuId === "favourites") {
      setCurrentAlbum(favouriteSongs);
    } else if (menuId === "recents") {
      setCurrentAlbum(recentlyPlayed);
    }
  };

  // Handle Favourite Clicks
  const handleFavouriteClick = (song) => {
    setFavouriteSongs((prevFavourites) => {
      const isAlreadyFavourite = prevFavourites.some(
        (fav) => fav.title === song.title
      );

      let updatedFavourites;

      if (isAlreadyFavourite) {
        // Remove from favourites if already there
        updatedFavourites = prevFavourites.filter(
          (fav) => fav.title !== song.title
        );
      } else {
        // Add to favourites
        updatedFavourites = [...prevFavourites, song];
      }

      // Save updated favourites to localStorage
      localStorage.setItem("favouriteSongs", JSON.stringify(updatedFavourites));

      return updatedFavourites;
    });
  };

  // Load favourites from localStorage on app start
  useEffect(() => {
    const storedFavourites = localStorage.getItem("favouriteSongs");
    if (storedFavourites) {
      setFavouriteSongs(JSON.parse(storedFavourites));
    }
  }, []);

  // Context Menu ---->
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Three Dots context Menu Handler ===>
  const handleThreeDotsClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.top - 140,
      left: rect.left,
    });
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".context-menu")) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ===>> load recentlyPlayed from sessionStorage
  useEffect(() => {
    const storedRecents = sessionStorage.getItem("recentlyPlayed");
    if (storedRecents) {
      setRecentlyPlayed(JSON.parse(storedRecents));
    }
  }, []);

  // Update recetly played
  useEffect(() => {
    const updateRecentlyPlayed = () => {
      setRecentlyPlayed((prev) => {
        // Remove the song if it already exists
        const filtered = prev.filter((song) => song.id !== currentSong.id);

        // Add current song to beginning of array
        const updated = [currentSong, ...filtered];

        // Keep only first 10 items
        const limited = updated.slice(0, 10);

        // Save to sessionStorage
        sessionStorage.setItem("recentlyPlayed", JSON.stringify(limited));

        return limited;
      });
    };

    // Only update if currentSong exists and is playing
    if (currentSong && isPlaying) {
      updateRecentlyPlayed();
    }
  }, [currentSong, isPlaying]);

  // Set Recently Played songs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "recentlyPlayed") {
        setRecentlyPlayed(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ADDING SEARCH FUNCTIONALITY
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Search Handler Function
  const handleSearch = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    if (input.trim()) {
      setIsSearching(true);
      const filteredSongs = allSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(input.toLowerCase()) ||
          song.artistName.toLowerCase().includes(input.toLowerCase())
      );
      setCurrentAlbum(filteredSongs);
    } else {
      handleClose();
    }
  };

  // ===> Closing Search Input
  const handleClose = () => {
    setSearchInput("");
    setIsSearching(false);

    // Reset to current active menu's list
    switch (activeMenu) {
      case "all-songs":
        setCurrentAlbum(allSongs);
        break;
      case "top":
        setCurrentAlbum(allSongs.filter((song) => song.playCount > 5000));
        break;
      case "favourites":
        setCurrentAlbum(favouriteSongs);
        break;
      case "recents":
        setCurrentAlbum(recentlyPlayed);
        break;
      default:
        setCurrentAlbum(allSongs);
    }

    // setCurrentAlbum(allSongs);
    // setIsSearching(false);
  };

  // Background color state
  const [backgroundGradient, setBackgroundGradient] = useState(
    "linear-gradient(45deg, #121212 0%, #000000 100%)"
  );

  // Update Background Color
  useEffect(() => {
    const updateBackground = async () => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = currentSong.thumbnail;

      img.onload = () => {
        const colorThief = new ColorThief();
        try {
          const [color1, color2] = colorThief.getPalette(img, 2);
          const gradient = `linear-gradient(45deg, rgb(${color1.join(
            ","
          )}) 0%, rgb(${color2.join(",")}) 100%)`;
          setBackgroundGradient(gradient);
        } catch (error) {
          console.error("Error extracting colors:", error);
          setBackgroundGradient(
            "linear-gradient(45deg, #121212 0%, #000000 100%)"
          );
        }
      };

      img.onerror = () => {
        setBackgroundGradient(
          "linear-gradient(45deg, #121212 0%, #000000 100%)"
        );
      };
    };

    updateBackground();
  }, [currentSong]);

  return (
    <div
      className="bg-black text-white vw-100 vh-100"
      style={{
        background: backgroundGradient,
        transition: "background 1s ease",
        minHeight: "100vh",
      }}
    >
      <main className="p-4 d-flex gap-5 d-none d-md-flex">
        <nav className="nav-bar">
          <div>
            <img src="/Logo.svg" alt="" />
          </div>

          <div>
            <ul className="d-flex flex-column gap-3 list-unstyled nav-links mt-4 cursor-pointer">
              <li
                id="all-songs"
                onClick={handleMenuClicks}
                className={
                  activeMenu === "all-songs" ? "text-white" : "inactive-link"
                }
              >
                For You
              </li>
              <li
                id="top"
                onClick={handleMenuClicks}
                className={
                  activeMenu === "top" ? "text-white" : "inactive-link"
                }
              >
                Top Tracks
              </li>
              <li
                id="favourites"
                onClick={handleMenuClicks}
                className={
                  activeMenu === "favourites" ? "text-white" : "inactive-link"
                }
              >
                Favourites
              </li>
              <li
                id="recents"
                onClick={handleMenuClicks}
                className={
                  activeMenu === "recents" ? "text-white" : "inactive-link"
                }
              >
                Recently Played
              </li>
            </ul>
          </div>
        </nav>

        <div className="d-flex flex-column gap-2 w-25">
          <h2 className="fs-2 fw-bold">For You</h2>

          {/* Search Input */}
          <div className="d-flex align-items-center bg-dark border-0 px-2 py-1 rounded-1 search-input">
            <input
              value={searchInput}
              onChange={handleSearch}
              type="text"
              className="border-0 bg-dark w-100 input-search"
              placeholder="Search Song, Artist"
            />

            {isSearching ? (
              <MdClose className="grey-color" size={18} onClick={handleClose} />
            ) : (
              <CiSearch className="grey-color" size={18} />
            )}
          </div>

          {/* Songs section */}
          <div
            id="songs-list"
            className="mt-3 overflow-auto "
            style={{
              height: "calc(100vh - 2 * 1.5rem - 2rem - 2.5rem - 3rem)",
            }}
          >
            {/* Song Cards */}

            {currentAlbum.length === 0 ? (
              <div className="text-center text-white mt-5">
                <p>No Songs Found</p>
              </div>
            ) : (
              currentAlbum.map((item, index) => (
                <div
                  key={item.id}
                  className={`d-flex justify-content-between align-items-center p-3 song-card ${
                    item.id === currentSong.id ? "active-song" : ""
                  }`}
                  onClick={() => handleSongSelect(index)}
                >
                  <div className="d-flex gap-2">
                    <div className="artist-logo">
                      <img
                        className="artist-logo-img"
                        src={item.artistImage || "/public/image 4.png"}
                        alt=""
                        crossOrigin="anonymous"
                      />
                    </div>

                    <div className="d-flex flex-column align-items-start">
                      <span className="">{item.title}</span>
                      <span className="artist-title grey-color">
                        {item.artistName}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <p className="mb-0 grey-color">{item.duration}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Songs Player */}
        <section className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div id="songPlayer">
            <div className="h-100 d-flex flex-column gap-5" id="song-player">
              {/* Song Info */}
              <div className="d-flex justify-content-between">
                <div className="d-flex flex-column gap-1">
                  <span className="fs-3 fw-bold">{currentSong.title}</span>
                  <span className="artist-title grey-color">
                    {currentSong.artistName}
                  </span>
                </div>

                <div className="d-flex align-items-center">
                  {favouriteSongs.some(
                    (song) => song.title === currentSong.title
                  ) ? (
                    <FaHeart
                      className="cursor-pointer text-danger"
                      size={20}
                      onClick={() => handleFavouriteClick(currentSong)}
                      style={{ color: "#dc3545" }} // Dark red color
                    />
                  ) : (
                    <FaRegHeart
                      className="cursor-pointer"
                      size={20}
                      onClick={() => handleFavouriteClick(currentSong)}
                    />
                  )}
                </div>
              </div>

              <div className="w-100 d-flex flex-column gap-4">
                <img
                  className="song-cover"
                  src={currentSong.thumbnail}
                  alt=""
                />
                {/* Progress Bar */}
                <ProgressBar value={progress} />
              </div>

              {/* Player Controls */}
              <div className="d-flex justify-content-between align-items-center">
                {/* Three dot context menu */}
                <div
                  className="circle position-relative"
                  onClick={handleThreeDotsClick}
                >
                  <BsThreeDots />
                </div>

                {isMenuOpen && (
                  <div
                    className="context-menu bg-dark p-2 rounded-2 shadow"
                    style={{
                      position: "fixed",
                      top: menuPosition.top,
                      left: menuPosition.left,
                      minWidth: "160px",
                      zIndex: 1000,
                    }}
                  >
                    <ul className="list-unstyled d-flex flex-column gap-2 m-0">
                      <li
                        className="px-3 py-2 hover-bg-grey rounded-1 cursor-pointer d-flex align-items-center gap-2"
                        onClick={() => {
                          handleFavouriteClick(currentSong);
                          setIsMenuOpen(false);
                        }}
                      >
                        {favouriteSongs.some(
                          (song) => song.title === currentSong.title
                        ) ? (
                          <>
                            <FaHeart className="text-danger" size={16} />
                            <span>Remove from Favorites</span>
                          </>
                        ) : (
                          <>
                            <FaRegHeart size={16} />
                            <span>Add to Favorites</span>
                          </>
                        )}
                      </li>
                      <li
                        className="px-3 py-2 hover-bg-grey rounded-1 cursor-pointer d-flex align-items-center gap-2"
                        onClick={() => {
                          // Handle Report Error
                          setIsMenuOpen(false);
                        }}
                      >
                        <BiPhotoAlbum size={16} />
                        <span>Go to Album</span>
                      </li>
                      <li
                        className="px-3 py-2 hover-bg-grey rounded-1 cursor-pointer d-flex align-items-center gap-2"
                        onClick={() => {
                          // Handle Go to Album
                          setIsMenuOpen(false);
                        }}
                      >
                        <MdOutlineBugReport size={16} />
                        <span>Report Error</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Prev, Stop, Next */}
                <div className="d-flex gap-5">
                  <div className="cursor-pointer" onClick={playPrev}>
                    <TbPlayerTrackPrevFilled size={20} className="grey-color" />
                  </div>

                  <div
                    onClick={togglePlayPause}
                    className=""
                    style={{ cursor: "pointer" }}
                  >
                    {isPlaying ? (
                      <FaCirclePause className="" size={36} />
                    ) : (
                      <FaCirclePlay size={36} className="" />
                    )}
                  </div>

                  <div className="cursor-pointer" onClick={playNext}>
                    <TbPlayerTrackNextFilled size={20} className="grey-color" />
                  </div>
                </div>
                {/* Volume */}
                <div className="circle cursor-pointer" onClick={toggleMute}>
                  {isMuted ? (
                    <IoVolumeMute size={20} />
                  ) : (
                    <IoVolumeMedium size={20} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Version starts heree.... */}
      <div className="d-block d-md-none">
        <nav className="w-100 d-flex justify-content-between align-items-center p-4">
          <div>
            <img src="/Logo.svg" alt="" />
          </div>

          <div>
            <FiMenu className="cursor-pointer" />
            {/* <MdClose className="grey-color" size={18} /> */}
          </div>

          {/* <div>
            <ul className="d-flex flex-column gap-3 list-unstyled nav-links mt-4 cursor-pointer">
              <li
                id="all-songs"
                onClick={handleMenuClicks}
                className={
                  activeMenu === "all-songs" ? "text-white" : "inactive-link"
                }
              >
                For You
              </li>
              <li
                id="top"
                onClick={handleMenuClicks}
                className={
                  activeMenu === "top" ? "text-white" : "inactive-link"
                }
              >
                Top Tracks
              </li>
              <li
                id="favourites"
                onClick={handleMenuClicks}
                className={
                  activeMenu === "favourites" ? "text-white" : "inactive-link"
                }
              >
                Favourites
              </li>
              <li
                id="recents"
                onClick={handleMenuClicks}
                className={
                  activeMenu === "recents" ? "text-white" : "inactive-link"
                }
              >
                Recently Played
              </li>
            </ul>
          </div> */}
        </nav>

        {/* Music Player */}
        {/* Song title and fav button */}
        <div className="d-flex justify-content-between px-4 py-0">
          <div className="d-flex flex-column gap-1">
            <span className="fs-3 fw-bold">{currentSong.title}</span>
            <span className="artist-title grey-color">
              {currentSong.artistName}
            </span>
          </div>

          <div className="d-flex align-items-center">
            {favouriteSongs.some((song) => song.title === currentSong.title) ? (
              <FaHeart
                className="cursor-pointer text-danger"
                size={20}
                onClick={() => handleFavouriteClick(currentSong)}
                style={{ color: "#dc3545" }} // Dark red color
              />
            ) : (
              <FaRegHeart
                className="cursor-pointer"
                size={20}
                onClick={() => handleFavouriteClick(currentSong)}
              />
            )}
          </div>
        </div>

        {/* Song thumbnail and progress bar */}
        <div className="d-flex align-items-center flex-column gap-4 p-4">
          <img className="mobile-cover" src={currentSong.thumbnail} alt="" />
          {/* Progress Bar */}
          <ProgressBar value={progress} />
        </div>

        {/* Player controls */}
        <div className="d-flex justify-content-between align-items-center px-4">
          {/* Three dot context menu */}
          <div
            className="circle position-relative"
            onClick={handleThreeDotsClick}
          >
            <BsThreeDots />
          </div>

          {isMenuOpen && (
            <div
              className="context-menu bg-dark p-2 rounded-2 shadow"
              style={{
                position: "fixed",
                top: menuPosition.top,
                left: menuPosition.left,
                minWidth: "160px",
                zIndex: 1000,
              }}
            >
              <ul className="list-unstyled d-flex flex-column gap-2 m-0">
                <li
                  className="px-3 py-2 hover-bg-grey rounded-1 cursor-pointer d-flex align-items-center gap-2"
                  onClick={() => {
                    handleFavouriteClick(currentSong);
                    setIsMenuOpen(false);
                  }}
                >
                  {favouriteSongs.some(
                    (song) => song.title === currentSong.title
                  ) ? (
                    <>
                      <FaHeart className="text-danger" size={16} />
                      <span>Remove from Favorites</span>
                    </>
                  ) : (
                    <>
                      <FaRegHeart size={16} />
                      <span>Add to Favorites</span>
                    </>
                  )}
                </li>
                <li
                  className="px-3 py-2 hover-bg-grey rounded-1 cursor-pointer d-flex align-items-center gap-2"
                  onClick={() => {
                    // Handle Report Error
                    setIsMenuOpen(false);
                  }}
                >
                  <BiPhotoAlbum size={16} />
                  <span>Go to Album</span>
                </li>
                <li
                  className="px-3 py-2 hover-bg-grey rounded-1 cursor-pointer d-flex align-items-center gap-2"
                  onClick={() => {
                    // Handle Go to Album
                    setIsMenuOpen(false);
                  }}
                >
                  <MdOutlineBugReport size={16} />
                  <span>Report Error</span>
                </li>
              </ul>
            </div>
          )}

          {/* Prev, Stop, Next */}
          <div className="d-flex gap-5">
            <div className="cursor-pointer" onClick={playPrev}>
              <TbPlayerTrackPrevFilled size={20} className="grey-color" />
            </div>

            <div
              onClick={togglePlayPause}
              className=""
              style={{ cursor: "pointer" }}
            >
              {isPlaying ? (
                <FaCirclePause className="" size={36} />
              ) : (
                <FaCirclePlay size={36} className="" />
              )}
            </div>

            <div className="cursor-pointer" onClick={playNext}>
              <TbPlayerTrackNextFilled size={20} className="grey-color" />
            </div>
          </div>
          {/* Volume */}
          <div className="circle cursor-pointer" onClick={toggleMute}>
            {isMuted ? (
              <IoVolumeMute size={20} />
            ) : (
              <IoVolumeMedium size={20} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
