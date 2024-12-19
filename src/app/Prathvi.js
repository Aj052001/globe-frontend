import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
// import Globe from "react-globe.gl";
import { MessageCircle, Repeat2, Heart } from 'lucide-react'; // For icons in tweet buttons
import './style.css'
import Globe from "./ajay.jsx";
// Function to generate arcs data for the globe
const generateArcsData = (N) => {
  return [...Array(N).keys()].map(() => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    color: [
      ["#B43632", "#EEB649", "#CCD556"][Math.round(Math.random() * 2)],
      ["#B43632", "#EEB649", "#CCD556"][Math.round(Math.random() * 2)],
    ],
  }));
};




const TwitterFeed = ({tweets}) => {
    // const tweets = [
    //   {
    //     id: 1,
    //     author: "Ash",
    //     handle: "@0xAbilash",
    //     content: "Meet PixelPal AI",
    //     likes: 11,
    //     retweets: 2,
    //     replies: 6,
    //     timestamp: "2023-10-01",
    //   },
    //   {
    //     id: 2,
    //     author: "Gleb Razgar",
    //     handle: "@project_gleb",
    //     content: "Hats off to @_TheResidency for helping bring the hacker house together.",
    //     likes: 47,
    //     retweets: 5,
    //     replies: 6,
    //     timestamp: "2023-10-02",
    //   },
    //   {
    //     id: 3,
    //     author: "Vikrant Patankar",
    //     handle: "@vikr13nt",
    //     content: "Playing with hundreds of millions of dollars",
    //     likes: 1,
    //     retweets: 0,
    //     replies: 0,
    //     timestamp: "2023-10-03",
    //   },
    //   {
    //     id: 4,
    //     author: "Ash",
    //     handle: "@0xAbilash",
    //     content: "Meet PixelPal AI",
    //     likes: 11,
    //     retweets: 2,
    //     replies: 6,
    //     timestamp: "2023-10-01",
    //   },
    //   {
    //     id: 5,
    //     author: "Gleb Razgar",
    //     handle: "@project_gleb",
    //     content: "Hats off to @_TheResidency for helping bring the hacker house together.",
    //     likes: 47,
    //     retweets: 5,
    //     replies: 6,
    //     timestamp: "2023-10-02",
    //   },
    //   {
    //     id: 6,
    //     author: "Ash",
    //     handle: "@0xAbilash",
    //     content: "Meet PixelPal AI",
    //     likes: 11,
    //     retweets: 2,
    //     replies: 6,
    //     timestamp: "2023-10-01",
    //   },
    //   {
    //     id: 7,
    //     author: "Gleb Razgar",
    //     handle: "@project_gleb",
    //     content: "Hats off to @_TheResidency for helping bring the hacker house together.",
    //     likes: 47,
    //     retweets: 5,
    //     replies: 6,
    //     timestamp: "2023-10-02",
    //   },
    //   {
    //     id: 8,
    //     author: "Vikrant Patankar",
    //     handle: "@vikr13nt",
    //     content: "Playing with hundreds of millions of dollars",
    //     likes: 1,
    //     retweets: 0,
    //     replies: 0,
    //     timestamp: "2023-10-03",
    //   },
    //   {
    //     id: 9,
    //     author: "Ash",
    //     handle: "@0xAbilash",
    //     content: "Meet PixelPal AI",
    //     likes: 11,
    //     retweets: 2,
    //     replies: 6,
    //     timestamp: "2023-10-01",
    //   },
    //   {
    //     id: 10,
    //     author: "Gleb Razgar",
    //     handle: "@project_gleb",
    //     content: "Hats off to @_TheResidency for helping bring the hacker house together.",
    //     likes: 47,
    //     retweets: 5,
    //     replies: 6,
    //     timestamp: "2023-10-02",
    //   },{
    //     id: 11,
    //     author: "Ash",
    //     handle: "@0xAbilash",
    //     content: "Meet PixelPal AI",
    //     likes: 11,
    //     retweets: 2,
    //     replies: 6,
    //     timestamp: "2023-10-01",
    //   },
    //   {
    //     id: 12,
    //     author: "Gleb Razgar",
    //     handle: "@project_gleb",
    //     content: "Hats off to @_TheResidency for helping bring the hacker house together.",
    //     likes: 47,
    //     retweets: 5,
    //     replies: 6,
    //     timestamp: "2023-10-02",
    //   },
    //   {
    //     id: 13,
    //     author: "Vikrant Patankar",
    //     handle: "@vikr13nt",
    //     content: "Playing with hundreds of millions of dollars",
    //     likes: 1,
    //     retweets: 0,
    //     replies: 0,
    //     timestamp: "2023-10-03",
    //   },
    //   {
    //     id: 14,
    //     author: "Ash",
    //     handle: "@0xAbilash",
    //     content: "Meet PixelPal AI",
    //     likes: 11,
    //     retweets: 2,
    //     replies: 6,
    //     timestamp: "2023-10-01",
    //   },
    //   {
    //     id: 15,
    //     author: "Gleb Razgar",
    //     handle: "@project_gleb",
    //     content: "Hats off to @_TheResidency for helping bring the hacker house together.",
    //     likes: 47,
    //     retweets: 5,
    //     replies: 6,
    //     timestamp: "2023-10-02",
    //   },
    //   // Add more tweet objects here...
    // ];
  
    const tweetContainerRef = useRef(null); // Reference to the tweet container
  
    useEffect(() => {
      const interval = setInterval(() => {
        const container = tweetContainerRef.current;
        
        if (container) {
          const maxScrollTop = container.scrollHeight - container.clientHeight;
  
          // If the scroll reaches the top (end of tweets), reset to the bottom
          if (container.scrollTop >= maxScrollTop) {
            container.scrollTop = 0;
          } else {
            // Scroll up by a small amount (to simulate scroll effect)
            container.scrollTop += 1;
          }
        }
      }, 10); // Scroll speed control (100ms interval)
  
      return () => clearInterval(interval); // Clear interval on component unmount
    }, []);
  
    return (
      <div
        className="bg-transparent backdrop-blur-md rounded-xl p-8 h-full overflow-x-hidden overflow-y-hidden"
        style={{ backgroundColor: "#00001", scrollbarColor: "#000011" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-medium text-gray-100">Latest Updates</h2>
        </div>
  
        {/* Scrollable Container for Tweets */}
        <div
          ref={tweetContainerRef}
          className="space-y-6 overflow-y-scroll"
          style={{
            overflowY:"hidden",
            maxHeight: "calc(100vh - 250px)",
            scrollbarColor: "#000011", // Hide scrollbar if needed
            WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
          }}
        >
          {tweets.map((tweet) => (
            <div
              key={tweet.id}
              className="border-b border-gray-800 pb-6 last:border-0 last:pb-0 bg-transparent"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-sm font-bold">{tweet.author[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tweet.author}</span>
                    <span className="text-gray-500 text-sm">{tweet.handle}</span>
                    <span className="text-gray-500 text-sm">·</span>
                    {/* <span className="text-gray-500 text-sm">{tweet.timestamp}</span> */}
                  </div>
                  <p className="mt-2 text-gray-100">{tweet.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

const GlobeWithArcs = ({ dataA, dataB, dataC, gitData,processedData }) => {

  const transformToTweets = (data, category) => {
    if (!Array.isArray(data)) {
      console.error(`Expected an array but received:`, data);
      return []; // Return an empty array if data is not valid
    }
    return data
      .slice(0, 5) // Take only the first 5 items as they appear
      .map((item, index) => {
        let additionalField = "";
        if (category === "Revenue") {
          additionalField = `Revenue: $${item.mrr || 0}`;
        } else if (category === "Grants") {
          additionalField = `Grant: $${item.grant || 0}`;
        } else if (category === "Investments") {
          additionalField = `Investment: $${item.investment_size || 0}`;
        } 
        return {
          id: index + 1, // Temporary ID
          author: item.resident || item.name || "Unknown Author",
          content: `Category: ${category}, House: ${item.house || item.home || "Unknown"}, Detail: ${item.detail || item.details || "No details available"}, ${additionalField}`,
        };
      });
  };
  
  const ensureArray = (data) => {
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object") {
      return Object.values(data); // Convert object to array if necessary
    } else {
      return []; // Default to empty array
    }
  };
  
  // Transform datasets into tweets
  const revenueTweets = transformToTweets(ensureArray(dataA), "Revenue");
  const grantTweets = transformToTweets(ensureArray(dataB), "Grants");
  const investmentTweets = transformToTweets(ensureArray(dataC), "Investments");
  const githubTweets = transformToTweets(ensureArray(gitData), "GitHub Activity");
  
  // Combine all tweets and assign unique IDs
  const tweets = [...revenueTweets, ...grantTweets, ...investmentTweets, ...githubTweets].map((tweet, index) => ({
    ...tweet,
    id: index + 1, // Assign a unique sequential ID
  }));
  
 
  

  return (
    <div style={{ display: "flex", height: "75vh" }}>
      {/* Left Section for Globe */}
      <div style={{ flex: 5, height: "555px", width: "700px", backgroundColor: "#000" }}>
      
      
 <Globe dataA={dataA}
        dataB={dataB}
        dataC={dataC}
        gitData={gitData}
        processedData={processedData}
        />
      </div>

      {/* Right Section for Tweet Feed */}
      <div style={{ flex: 5, height: "605px", overflowY: "auto", backgroundColor: "rgb(3 7 18 / var(--tw-bg-opacity, 1))" }}>
        <TwitterFeed tweets={tweets} /> {/* Display the Twitter feed */}
      </div>
    </div>
  );
};
  

export default GlobeWithArcs;
