import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const body = document.body;

    const createStar = () => {
      let right = Math.random() * 500;
      const top = Math.random() * window.innerHeight;
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.top = `${top}px`;
      body.appendChild(star);

      const interval = setInterval(() => {
        if (right >= window.innerWidth) {
          clearInterval(interval);
          star.remove();
        }
        right += 3;
        star.style.right = `${right}px`;
      }, 10);
    };

    const intervalId = setInterval(createStar, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="error-page">
        <div className="text">
          <div>ERROR</div>
          <h1>404</h1>
          <hr />
          <div>Page Not Found</div>
          <button onClick={() => navigate("/")} className="home-button">
            ⬅ Back to Home
          </button>
        </div>

        <div className="astronaut">
          <img
            src="https://images.vexels.com/media/users/3/152639/isolated/preview/506b575739e90613428cdb399175e2c8-space-astronaut-cartoon-by-vexels.png"
            alt="astronaut"
          />
        </div>
      </div>

      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          height: 100vh;
          overflow: hidden;
          font-family: 'Tomorrow', sans-serif;
        }

        .error-page {
          height: 100vh;
          background-image: linear-gradient(to top, #2e1753, #1f1746, #131537, #0d1028, #050819);
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .text {
          position: absolute;
          top: 10%;
          color: #fff;
          text-align: center;
        }

        h1 {
          font-size: 60px;
        }

        hr {
          width: 50%;
          margin: 10px auto;
          border: 1px solid #fff;
        }

        .home-button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #ffffff10;
          border: 1px solid #fff;
          border-radius: 25px;
          color: white;
          cursor: pointer;
          transition: 0.3s ease;
          font-size: 16px;
        }

        .home-button:hover {
          background-color: #ffffff30;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #fff;
          right: 0;
          animation: starTwinkle 3s infinite linear;
        }

        .astronaut img {
          width: 100px;
          position: absolute;
          top: 55%;
          animation: astronautFly 6s infinite linear;
        }

        @keyframes astronautFly {
          0% { left: -100px; }
          25% { top: 50%; transform: rotate(30deg); }
          50% { top: 55%; transform: rotate(45deg); }
          75% { top: 60%; transform: rotate(30deg); }
          100% { left: 110%; transform: rotate(45deg); }
        }

        @keyframes starTwinkle {
          0%   { background: rgba(255,255,255,0.4); }
          25%  { background: rgba(255,255,255,0.8); }
          50%  { background: rgba(255,255,255,1); }
          75%  { background: rgba(255,255,255,0.8); }
          100% { background: rgba(255,255,255,0.4); }
        }
      `}</style>
    </>
  );
};

export default NotFound;
