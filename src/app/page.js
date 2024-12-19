"use client"

import React, { useState, useEffect, memo } from 'react';
import {TrendingUp, GitBranch, DollarSign, Users, Award, MessageCircle, Heart, Repeat2, Rotate3dIcon } from 'lucide-react';
import GlobeWithArcs from './Prathvi'

  
const HOUSE_COLORS = {
  "Pioneer House": "text-blue-400",
  "Innovator House": "text-purple-400",
  "Creator House": "text-pink-400",
  "Builder House": "text-orange-400",
  "Maker House": "text-green-400",
  "Founder House": "text-indigo-400",
  "Visionary House": "text-red-400"
};
const SAMPLE_TWEETS = [
  "Just launched a new project! 🚀",
"Collaborating on an exciting initiative 🤝",
"Made significant progress today 📈",
"Working on something special ✨",
"Great team meeting today! 💡",
"Exploring new ideas for innovation 🌟",
"Wrapping up a productive week! 🙌",
];

const STATIC_APPLICATIONS = [
  { house: "Pioneer House", value: 523, detail: "Active Applications", change: 12 },
  { house: "Innovator House", value: 1331, detail: "Active Applications", change: -5 },
  { house: "Creator House", value: 481, detail: "Active Applications", change: 8 },
  { house: "Builder House", value: 311, detail: "Active Applications", change: 3 },
  { house: "Maker House", value: 704, detail: "Active Applications", change: -2 },
  { house: "Founder House", value: 831, detail: "Active Applications", change: 6 },
  { house: "Visionary House", value: 1391, detail: "Active Applications", change: 15 }
];





const LeaderboardCard = ({ title, data, showRank = true }) => {
  const [sortedData, setSortedData] = useState([]);
  
  useEffect(() => {
    if (!Array.isArray(data)) {
      console.error('Data is not iterable:', data);
      setSortedData([]); // Fallback to an empty array
      return;
    }
  
    const sortData = () => {
      const newData = [...data].sort((a, b) => {
        const valueA = typeof a.mrr === 'string'
          ? Number(a.mrr.replace(/[^0-9.-]+/g, ""))
          : Number(a.mrr);
        const valueB = typeof b.mrr === 'string'
          ? Number(b.mrr.replace(/[^0-9.-]+/g, ""))
          : Number(b.mrr);
        return valueB - valueA;
      });
      setSortedData(newData);
    };
  
    sortData();
  }, [data]);

  return (
    <div className="bg-gray-900/50 backdrop-blur-md border overflow-x-hidden overflow-y-hidden border-gray-800 rounded-xl p-8 relative" style={{ scrollbarColor: "#000011" }}>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-medium text-gray-100">{title}</h2>
        </div>
      </div>
      <div
        className="grid gap-4 max-h-[470px] pr-2"
        style={{
          overflowX: 'hidden', // Hide horizontal scrollbar
          overflowY: 'scroll', // Allow vertical scrolling
          scrollbarColor: "#000011", // Hide scrollbar color if needed
           // For smooth scrolling on iOS
        }}
      >
        {sortedData.map((item, index) => (
          <div
          key={`${item.name}-${index}`} 
            className="group flex items-start justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
            style={{ minHeight: '80px', scrollbarColor: "#000011"}}
          >
            <div className="flex items-start gap-4">
              {showRank && (
                <div className="text-gray-500 font-mono w-6 pt-1">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-100 mb-1">
                  {showRank ? item.name : item.house}
                </div>
                <div className={`text-sm ${HOUSE_COLORS[item.home]}`}>
                  {showRank ? item.home : item.details}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-mono font-semibold text-gray-100 mb-1">
                {typeof item.mrr === 'number' ? `$${item.mrr.toLocaleString()}` : item.mrr}
                {typeof item.change !== 'undefined' && (
                  <span
                    className={`ml-2 text-sm ${item.change > 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {item.change > 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                  </span>
                )}
              </div>
              {showRank && <div className="text-sm text-gray-400">{item.details}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

LeaderboardCard.displayName = 'LeaderboardCard';



// for top investment leaderboard
const LeaderboardCardI = ({ title, data, showRank = true }) => {
  const [sortedData, setSortedData] = useState([]);
  
  useEffect(() => {
    if (!Array.isArray(data)) {
      console.error('Data is not iterable:', data);
      setSortedData([]); // Fallback to an empty array
      return;
    }
  
    const sortData = () => {
      const newData = [...data].sort((a, b) => {
        const valueA = typeof a.revenue === 'string'
          ? Number(a.revenue.replace(/[^0-9.-]+/g, ""))
          : Number(a.revenue);
        const valueB = typeof b.revenue === 'string'
          ? Number(b.revenue.replace(/[^0-9.-]+/g, ""))
          : Number(b.revenue);
        return valueB - valueA;
      });
      setSortedData(newData);
    };
  
    sortData();
  }, [data]);

  return (
    <div className="bg-gray-900/50 backdrop-blur-md border overflow-x-hidden overflow-y-hidden border-gray-800 rounded-xl p-8 relative" style={{ scrollbarColor: "#000011" }}>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-medium text-gray-100">{title}</h2>
        </div>
      </div>
      <div
        className="grid gap-4 max-h-[470px] pr-2"
        style={{
          overflowX: 'hidden', // Hide horizontal scrollbar
          overflowY: 'scroll', // Allow vertical scrolling
          scrollbarColor: "#000011", // Hide scrollbar color if needed
           // For smooth scrolling on iOS
        }}
      >
        {sortedData.map((item, index) => (
          <div
          key={`${item.name}-${index}`} 
            className="group flex items-start justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
            style={{ minHeight: '80px', scrollbarColor: "#000011"}}
          >
            <div className="flex items-start gap-4">
              {showRank && (
                <div className="text-gray-500 font-mono w-6 pt-1">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-100 mb-1">
                  {showRank ? item.name : item.home}
                </div>
                <div className={`text-sm ${HOUSE_COLORS[item.home]}`}>
                  {showRank ? item.home : item.details}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-mono font-semibold text-gray-100 mb-1">
                {typeof item.investment_size === 'number' ? `$${item.investment_size.toLocaleString()}` : item.investment_size}
                {typeof item.change !== 'undefined' && (
                  <span
                    className={`ml-2 text-sm ${item.change > 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {item.change > 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                  </span>
                )}
              </div>
              {showRank && <div className="text-sm text-gray-400">{item.details}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

LeaderboardCardI.displayName = 'LeaderboardCardI';



// for hackthon
const LeaderboardCardH = ({ title, data, showRank = true }) => {
  const [sortedData, setSortedData] = useState([]);
  
  useEffect(() => {
    if (!Array.isArray(data)) {
      console.error('Data is not iterable:', data);
      setSortedData([]); // Fallback to an empty array
      return;
    }
  
    const sortData = () => {
      const newData = [...data].sort((a, b) => {
        const valueA = typeof a.revenue === 'string'
          ? Number(a.revenue.replace(/[^0-9.-]+/g, ""))
          : Number(a.revenue);
        const valueB = typeof b.revenue === 'string'
          ? Number(b.revenue.replace(/[^0-9.-]+/g, ""))
          : Number(b.revenue);
        return valueB - valueA;
      });
      setSortedData(newData);
    };
  
    sortData();
  }, [data]);

  return (
    <div className="bg-gray-900/50 backdrop-blur-md border overflow-x-hidden overflow-y-hidden border-gray-800 rounded-xl p-8 relative" style={{ scrollbarColor: "#000011" }}>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-medium text-gray-100">{title}</h2>
        </div>
      </div>
      <div
        className="grid gap-4 max-h-[470px] pr-2"
        style={{
          overflowX: 'hidden', // Hide horizontal scrollbar
          overflowY: 'scroll', // Allow vertical scrolling
          scrollbarColor: "#000011", // Hide scrollbar color if needed
           // For smooth scrolling on iOS
        }}
      >
        {sortedData.map((item, index) => (
          <div
          key={`${item.name}-${index}`} 
            className="group flex items-start justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
            style={{ minHeight: '80px', scrollbarColor: "#000011"}}
          >
            <div className="flex items-start gap-4">
              {showRank && (
                <div className="text-gray-500 font-mono w-6 pt-1">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-100 mb-1">
                  {showRank ? item.name : item.house}
                </div>
                <div className={`text-sm ${HOUSE_COLORS[item.house]}`}>
                  {showRank ? item.house : item.details}/get_saved_data
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
            {showRank && <div className="text-sm text-gray-400">{item.place}</div>}
              {showRank && <div className="text-sm text-gray-400">{item.hackathon}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

LeaderboardCardH.displayName = 'LeaderboardCardH';

const LeaderboardCard1 = ({ title, data, showRank = true }) => {
  const [sortedData, setSortedData] = useState([]);
  
  useEffect(() => {
    if (!Array.isArray(data)) {
      console.error('Data is not iterable:', data);
      setSortedData([]); // Fallback to an empty array
      return;
    }
  
    const sortData = () => {
      const newData = [...data].sort((a, b) => {
        const valueA = typeof a.revenue === 'string'
          ? Number(a.revenue.replace(/[^0-9.-]+/g, ""))
          : Number(a.revenue);
        const valueB = typeof b.revenue === 'string'
          ? Number(b.revenue.replace(/[^0-9.-]+/g, ""))
          : Number(b.revenue);
        return valueB - valueA;
      });
      setSortedData(newData);
    };
  
    sortData();
  }, [data]);
  return (
    <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-8 relative">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-medium text-gray-100">{title}</h2>
        </div>
      </div>
      <div className="grid gap-4 max-h-[470px] overflow-y-auto pr-2" style={{  scrollbarColor: "#000011" }}>
        {sortedData.map((item, index) => (
          
          <div 
          
          key={`${item.name}-${index}`} 
            className="group flex items-start justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
            style={{ minHeight: '80px' }}
          >
            <div className="flex items-start gap-4">
              {showRank && (
                <div className="text-gray-500 font-mono w-6 pt-1">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-100 mb-1">
                  {showRank ? item.resident : item.house}
                </div>
                <div className={`text-sm ${HOUSE_COLORS[item.house]}`}>
                  {showRank ? item.house : item.detail}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-mono font-semibold text-gray-100 mb-1">
                {typeof item.revenue === 'number' ? `${item.revenue.toLocaleString()}` : item.revenue}
                {typeof item.change !== 'undefined' && (
                  <span
                    className={`ml-2 text-sm ${item.change > 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {item.change > 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                  </span>
                )}
              </div>
              {showRank && <div className="text-sm text-gray-400">{item.detail}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
LeaderboardCard1.displayName = 'LeaderboardCard1';



  const LeaderboardCard2 = ({ title, data, showRank = true }) => {
    return (
      <div className="bg-gray-900/50 backdrop-blur-md border overflow-x-hidden overflow-y-hidden border-gray-800 rounded-xl p-8 relative" style={{ scrollbarColor: "#000011" }}>
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-medium text-gray-100">{title}</h2>
          </div>
        </div>
        <div
          className="grid gap-4 max-h-[470px] pr-2"
          style={{
            overflowX: 'hidden', // Hide horizontal scrollbar
            overflowY: 'scroll', // Allow vertical scrolling
            scrollbarColor: "#000011", // Set scrollbar color
          }}
        >
          {data.map((item, index) => (
            <div
            key={`${item.name}-${index}`} 
              className="group flex items-start justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
              style={{ minHeight: '80px', scrollbarColor: "#000011"}}
            >
              <div className="flex items-start gap-4">
                {showRank && (
                  <div className="text-gray-500 font-mono w-6 pt-1">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-100 mb-1">
                    {showRank ? item.resident : item.house}
                  </div>
                  <div className={`text-sm ${HOUSE_COLORS[item.house]}`}>
                    {showRank ? item.house : item.applications}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-mono font-semibold text-gray-100 mb-1">
                  {typeof item.revenue === 'number' ? `$${item.revenue.toLocaleString()}` : item.revenue}
                  {typeof item.change !== 'undefined' && (
                    <span
                      className={`ml-2 text-sm ${item.change > 0 ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {item.change > 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                    </span>
                  )}
                </div>
                {showRank && <div className="text-sm text-gray-400">{item.applications}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  


LeaderboardCard2.displayName = 'LeaderboardCard2';


import { Loader2 } from 'lucide-react';

const CoolLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 
          className="h-16 w-16 text-blue-500 animate-spin" 
          strokeWidth={2} 
        />
        <div className="text-white text-xl font-semibold tracking-wide">
          Loading...
        </div>
        <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-progress-pulse"></div>
        </div>
      </div>
    </div>
  );
};



export default function DashboardDemo() {

  const [residences, setResidences] = useState([]);
  const [grants, setGrants] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [house, setHouse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gitData, setGitData] = useState(true);
  const [hackathonData,setHackthonData] = useState(true)
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_BASE_URL
  console.log(API_URL)

  useEffect(() => {
    const links = {
      // residents: 'https://script.googleusercontent.com/macros/echo?user_content_key=_Hn7XQ1Tz05t8KFXVgC0XcOv9qqR82x5fPeJhorGztcnQFSeMkm0x3JMUjBAfXDvAd6SGSSdHo8j6g9a5chj0BneMvC-6aSYm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnCRfytznPhufLoQ0A_qwCpAWuu2yCiWw02b8C_JplW3M-BaFmpSV9dMvgTYx5Jpj8xtXuny5gyM0ohIgDacCEvpsCbtnK4XfiQ&lib=MHFQDdH3kqbOE-evStmhhjMMngc_g7vfE',
      // grants: 'https://script.google.com/macros/s/AKfycbxO6pSArxbJy9hh1lXDqcTQCcoaGr3Xa53UGuUYUWSQQBh-WlI8K2gbHvto5oL0L0yY/exec',
      residents:"https://script.googleusercontent.com/macros/echo?user_content_key=xslxWIex10ZSpfBNHcRldC8dB070JywZhDbVHQDEJ9mL0XDwqqtWAMFpTLWpGbGsO3NwAzT9TurCNjlC_b8i1wDnN3gMcF7Wm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnAoCU8ikEgw3rDk24wkLd2wl7pj3sEUOFLrxrQhR4EBcqOXaVwjnZzfy7Ih9WYvl7-V8MHgAXtY8ZPd36_CxsxyAzFPhTURzyNz9Jw9Md8uu&lib=MsnYF3QYcxVdNa8rtsHEII37dSxyY7qhE",
      grants: 'https://script.google.com/macros/s/AKfycbwAqODJ3NiFHauESgiMW65R2ZQMxJSWWtATrDPsl0YFW9H1zfEUxO704LaJ5m1ls7ea/exec',
      investments: 'https://script.google.com/macros/s/AKfycbyhrfgCioo_nVlG4rG7NcQ2oBKfV5ZCAiyg4v0BHOAsSemwKDBLoY2IPfnaxPWJh5GlkA/exec',
      houses:"https://script.googleusercontent.com/macros/echo?user_content_key=yawgMUS-uaIkd004IryvhN9GHffMhci-DKAf6R-5_f6lEDiA8y9WtSuJMeyWIHuAvyIX7B14w6gRcIadzZtDL302RlAfwQlpm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnNPEugizz5HSeF_ttZuLgpWwLpxgsEw7rR4meR5_67XptVCgKPgonMioIYdmfER9kIhC2x9LEUuyC_FnVo9zHNE2yrPrPF3qgtz9Jw9Md8uu&lib=MpWCmBbv8BIEZ-C71fGN3YX7dSxyY7qhE",
     git:`${API_URL}/get_saved_data`,
     hackathon:"https://script.google.com/macros/s/AKfycbwfWGuG897p8G4wtEbSNRZypFrL5cK-Y5JA9ggHFsm2aUmQWSmrepc86Tb1rwhl0-_DXQ/exec"

    };


    
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch(links.residents),
          fetch(links.grants),
          fetch(links.investments),
          fetch(links.houses),
          fetch(links.git),
          fetch(links.hackathon)
        ]);

        // Check if all responses are ok
        responses.forEach((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch data from one or more links');
          }
        });

        // Parse JSON for all responses
        const data = await Promise.all(responses.map((response) => response.json()));
        
           

           const allRevenue= [...data[0].data["2024-12"], ...data[0].data["2024-11"]];
          //  console.log(allRevenue)
        // Assign the data
        setResidences(allRevenue); // Residents data
        setGrants(data[1]);     // Grants data
        setInvestments(data[2]); // Investments data
        setHouse(data[3]); // Revenue data
        setGitData(data[4].data); // Revenue data
        setHackthonData(data[5].data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const dataA = Array.isArray(residences.allResidents) ? residences.allResidents : [];
  const dataB = Array.isArray(grants.allGrantees) ? grants.allGrantees : [];
  const dataC = Array.isArray(investments.allInvestors) ? investments.allInvestors : [];
  const dataD = Array.isArray(house.data) ? house.data: [];
  
 

  function getTopUniqueData(data) {
    const uniqueData = [];
    const seenHouses = new Set();
  
    for (const item of data) {
      if (!seenHouses.has(item.house)) {
        uniqueData.push(item);
        seenHouses.add(item.house);
      }
    }
  
    // Return the top 7 unique entries
    return uniqueData.slice(0, 7);
  }

  const processedData = getTopUniqueData(dataD);

  // console.log(hackathonData)


  // console.log(processedData)
  if (loading) return <CoolLoading/>;
  if (error) return <div>Error: {error}</div>;


 
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <main className="p-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-medium text-gray-100 mb-2">Global House Activity</h1>
          <p className="text-lg text-gray-400">Real-time performance metrics</p>
        </div>

        {/* <Globe /> */}
        <GlobeWithArcs
        dataA={residences}
        dataB={dataB}
        dataC={dataC}
        gitData={gitData}
        processedData={processedData}
      />


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <LeaderboardCard
            title="Top Revenue"
            icon={<TrendingUp />}
            data={residences}
          />
          <LeaderboardCardI
            title="Top Grants"
            icon={<Award />}
            data={dataB}
          />
          <LeaderboardCardI
            title="Top Investments"
            icon={<DollarSign />}
            data={dataC}
          />
          <LeaderboardCard1
                title="Top GitHub Activity"
            icon={<GitBranch />}
            data={gitData}
          />
           <LeaderboardCard2
              title="Applications by House"
              icon={<Users />}
              data={processedData}
              showRank={false}
            />
             <LeaderboardCardH
                title="Hackathon"
            icon={<GitBranch />}
            data={hackathonData}
          />
          
          
        </div>
      </main>
    </div>
  );
}























