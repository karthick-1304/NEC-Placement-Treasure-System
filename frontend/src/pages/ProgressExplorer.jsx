import React, { useEffect, useState } from "react";

import axiosInstance from "../api/axiosInstance";

import TrendToggle from "../components/progress/TrendToggle";
import TrendChart from "../components/progress/TrendChart";
import ConsistencyCard from "../components/progress/ConsistencyCard";
import Milestones from "../components/progress/Milestones";

export default function ProgressExplorer() {

  const [analytics, setAnalytics] = useState(null);
  const [view, setView] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {

      const res = await axiosInstance.get("/progress/explorer");

      console.log("FULL API RESPONSE:", res.data);

      setAnalytics(res.data?.data || {});
      setLoading(false);

    } catch (err) {

      console.error("Analytics fetch error:", err);
      setError(err?.message || "Failed to load analytics");
      setLoading(false);

    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <p className="text-white text-center mt-10">
        Loading progress analytics...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-400 text-center mt-10">
        {error}
      </p>
    );
  }

  const chartData =
    view === "weekly"
      ? analytics?.weekly_trend || []
      : analytics?.monthly_trend || [];

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10 text-white">

      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-8 text-center">
        Progress Explorer
      </h1>

      {/* Toggle Weekly / Monthly */}
      <TrendToggle view={view} setView={setView} />

      {/* Chart */}
      <div className="mt-8">
        <TrendChart data={chartData} view={view} />
      </div>

      {/* Consistency Score */}
      <div className="mt-10">
        <ConsistencyCard score={analytics?.consistency_score || 0} />
      </div>

      {/* Milestones */}
      <div className="mt-10">
        <Milestones milestones={analytics?.milestones || {}} />
      </div>

    </div>
  );
}