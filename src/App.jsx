import { useState } from "react";

// Icons
import { CiSearch } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import { IoVolumeMedium } from "react-icons/io5";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { BsThreeDots } from "react-icons/bs";
import "./App.css";

function App() {
  return (
    <div className="bg-black text-white vw-100 vh-100">
      <main className="p-4 d-flex">
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
            {/* Single Card */}
            <div className="d-flex justify-content-between align-items-center p-3 song-card">
              <div className="d-flex gap-2">
                <div>
                  <img src="/image 4.png" alt="" />
                </div>

                <div className="d-flex flex-column align-items-start">
                  <span className="">Starboy</span>
                  <span className="artist-title grey-color">The Weeknd</span>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <p className="mb-0 grey-color">4:16</p>
              </div>
            </div>

            {/* Second Card */}

            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
              return (
                <div
                  key={item}
                  className="d-flex justify-content-between align-items-center p-3 song-card"
                >
                  <div className="d-flex gap-2">
                    <div>
                      <img src="/image 4.png" alt="" />
                    </div>

                    <div className="d-flex flex-column align-items-start">
                      <span className="">Starboy</span>
                      <span className="artist-title grey-color">
                        The Weeknd
                      </span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <p className="mb-0 grey-color">4:16</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Songs Player */}
        <section className="w-50">
          <div className="mx-auto p-5" id="song-player">
            {/* Song Info */}
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column gap-1">
                <span className="fs-3">Viva La Vida</span>
                <span className="artist-title grey-color">Coldplay</span>
              </div>

              <div className="d-flex align-items-center">
                <FaRegHeart size={20} />
              </div>
            </div>

            <div>
              <img src="" alt="" />
            </div>

            <div>
              <div></div>
              <div>
                <div>
                  <TbPlayerTrackPrevFilled />
                </div>

                <div>
                  <FaPlay />
                </div>

                <div>
                  <TbPlayerTrackNextFilled />
                </div>
              </div>
              <div className="circle">
                <IoVolumeMedium />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
