import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-black text-white">
      <nav>
        <div>
          <img src="" alt="" />
        </div>

        <div>
          <ul>
            <li>For You</li>
            <li>For You</li>
            <li>For You</li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default App;
