import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const WelcomeScreen = () => {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    // Fetch the updated count from backend with cookies
    fetch("https://short-talkies-frontend.onrender.com/api/visit", {
      method: "GET",
      credentials: "include", // important for sending cookies
    })
      .then((res) => res.json())
      .then((data) => {
        setVisitorCount(data.count);
        console.log("Visitor Count:", data.count); // log to console only
      })
      .catch((err) => {
        console.error("Error fetching visit count:", err);
        setVisitorCount("N/A");
      });
  }, []);

  return (
    <div
      style={{
        backgroundColor: "rgb(196, 196, 196)",
        height: "99vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
      }}
    >
      <motion.h1
        className="display-1 fw-bold text-dark mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          marginBlock: "30px",
          fontSize: "11rem",
          fontFamily: "sans-serif",
          color: "rgb(33, 37, 41)",
          textAlign: "center",
        }}
      >
        Welcome
      </motion.h1>

      <motion.h2
        className="h5 text-secondary"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{
          marginTop: "0px",
          fontSize: "25px",
          fontFamily: "sans-serif",
          fontWeight: "400",
          color: "rgb(108, 117, 125)",
          textAlign: "center",
        }}
      >
        Thanks for Scanning And Giving Your Vote, This Is Only For Youtube Video And Topic Is " I Became Chief Minister For a Day " Which Is Comming On This Channel - " Short talkies"
      </motion.h2>
          console.log(visitorCount)

      <motion.h3
        className="h5 text-secondary"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{
          position: "absolute",
          bottom: "20px",
          fontSize: "18px",
          margin: "20px",
          fontFamily: "sans-serif",
          fontWeight: "300",
          color: "rgb(7, 8, 9)",
          textAlign: "center",
        }}
      >
        powered by{" "}
        <a
          href="https://www.youtube.com/@ShortTalkies8055"
          target="_blank"
          rel="noopener noreferrer"
        >
          @short-talkies
        </a>
      </motion.h3>

      <style>
        {`
          @media (max-width: 768px) {
            h1 {
              font-size: 6rem !important;
            }
            h2 {
              font-size: 20px !important;
            }
            h3 {
              font-size: 16px !important;
            }
          }
          @media (max-width: 480px) {
            h1 {
              font-size: 4rem !important;
            }
            h2 {
              font-size: 18px !important;
            }
            h3 {
              font-size: 14px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default WelcomeScreen;
