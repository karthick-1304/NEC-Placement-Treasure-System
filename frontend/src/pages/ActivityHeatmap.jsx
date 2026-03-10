import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function ActivityHeatmap() {

  const [data, setData] = useState([]);

  useEffect(() => {

    const fetchHeatmap = async () => {

      try {

        const end = new Date();
        const start = new Date();

        start.setDate(end.getDate() - 90);

        const startDate = start.toISOString().split("T")[0];
        const endDate = end.toISOString().split("T")[0];

        const res = await axiosInstance.get(
          `/stats/heatmap?start=${startDate}&end=${endDate}`
        );

        setData(res.data.data);

      } catch (err) {
        console.error("Heatmap error:", err.response?.data || err);
      }

    };

    fetchHeatmap();

  }, []);

  return (
    <div className="grid grid-cols-12 gap-1">
      {data.map((day, index) => (
        <div
          key={index}
          title={`${day.date} - ${day.count} solves`}
          className="w-4 h-4 rounded-sm"
          style={{
            backgroundColor:
              day.count === 0
                ? "#1f2937"
                : day.count < 2
                ? "#4ade80"
                : day.count < 4
                ? "#22c55e"
                : "#166534"
          }}
        />
      ))}
    </div>
  );

}