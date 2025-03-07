import { useRef, useState } from "react";

// Icons
import { BsThreeDots } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";
import { IoVolumeMedium, IoVolumeMute } from "react-icons/io5";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import "./App.css";
import ProgressBar from "./components/ProgressBar";

import { dummyData } from "./dummyData";

function App() {
  // Importing all songs data
  const allSongs = dummyData;

  // Current Data
  const [currentAlbum, setCurrentAlbum] = useState(allSongs);
  const [songIndex, setSongIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState(currentAlbum[songIndex]);

  // Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // console.log(allSongs.length);

  const audioRef = useRef(new Audio(currentSong.musicUrl));

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const playNext = () => {
    setSongIndex((prev) => (prev = (prev + 1) % currentAlbum.length));
    setCurrentSong(currentAlbum[songIndex]);

    // Update audio source and play
    audioRef.current.src = currentSong.musicUrl;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const playPrev = () => {};

  return (
    <div className="bg-black text-white vw-100 vh-100">
      <main className="p-4 d-flex gap-5">
        <nav className="nav-bar">
          <div>
            <img src="/Logo.svg" alt="" />
          </div>

          <div>
            <ul className="d-flex flex-column gap-3 list-unstyled nav-links mt-4">
              <li>For You</li>
              <li>Top Tracks</li>
              <li>Favourites</li>
              <li>Recently Played</li>
            </ul>
          </div>
        </nav>

        <div className="d-flex flex-column gap-2 w-25">
          <h2 className="fs-2 fw-bold">For You</h2>

          {/* Search Input */}
          <div className="d-flex align-items-center bg-dark border-0 px-2 py-1 rounded-1">
            <input
              // value={value}
              // onChange={onChange}
              type="text"
              className="border-0 bg-dark w-100 input-search"
              placeholder="Search Song, Artist"
              // className="form-control border-0 bg-transparent me-2"
            />

            <CiSearch className="grey-color" size={18} />
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

            {allSongs.map((item, index) => {
              return (
                <div
                  key={item.title}
                  className="d-flex justify-content-between align-items-center p-3 song-card"
                >
                  <div className="d-flex gap-2">
                    <div className="artist-logo">
                      <img
                        className="artist-logo-img"
                        src={item.artistImage || "/public/image 4.png"}
                        alt=""
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
              );
            })}
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
                  <FaRegHeart size={20} />
                </div>
              </div>

              <div className="w-100 d-flex flex-column gap-4">
                <img
                  className="song-cover"
                  src={currentSong.thumbnail}
                  alt=""
                />

                {/* Progress Bar */}
                <ProgressBar value={50} />
              </div>

              {/* Player Controls */}
              <div className="d-flex justify-content-between align-items-center">
                <div className="circle">
                  <BsThreeDots />
                </div>

                {/* Prev, Stop, Next */}
                <div className="d-flex gap-5">
                  <div>
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
                <div className="circle" onClick={toggleMute}>
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
    </div>
  );
}

export default App;
