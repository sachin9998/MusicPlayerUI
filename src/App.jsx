import { useState } from "react";
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

        <div>
          <h2>For You</h2>

          <input type="text" />
        </div>
      </main>
    </div>
  );
}

export default App;
