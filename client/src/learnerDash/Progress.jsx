import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useAppContext } from "../context/AppContext.jsx"
export default function Progress() {
    const {  learner} = useAppContext()
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get(`/api/learner/stats/${learner}`);
      const data = res.data;

      // Prepare chart data
      const yesterday = { name: "Yesterday", hours: data.progressStats.yesterdayHours };
      const week = { name: "This Week", hours: data.progressStats.weekHours };
      const month = { name: "This Month", hours: data.progressStats.monthHours };
      console.log(yesterday , week , month)

      setChartData([yesterday, week, month]);
    };

    fetchStats();
  }, [learner]);
  return (
    <div>
    
    </div>
  )
}
