import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function ActivityHeatmap() {

  const [data, setData] = useState([]);

  useEffect(() => {

    const fetchHeatmap = async () => {

      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 90);

      const startDate = start.toISOString().split("T")[0];
      const endDate = end.toISOString().split("T")[0];

      try {

        const res = await axiosInstance.get(
          `/stats/heatmap?start=${startDate}&end=${endDate}`
        );

        setData(res.data.data || []);

      } catch (err) {
        console.error(err);
      }

    };

    fetchHeatmap();

  }, []);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 90);

  return (

    <div className="bg-gray-800 p-4 rounded-xl">

      <h2 className="text-white mb-4 font-semibold">
        Coding Activity
      </h2>

      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={data}

        classForValue={(value) => {

          if (!value) return "color-empty";
          if (value.count === 0) return "color-empty";
          if (value.count < 2) return "color-scale-1";
          if (value.count < 4) return "color-scale-2";
          return "color-scale-3";

        }}
      />

      <style>
        {`
          .color-empty { fill: #2d333b; }
          .color-scale-1 { fill: #0e4429; }
          .color-scale-2 { fill: #006d32; }
          .color-scale-3 { fill: #26a641; }
        `}
      </style>

    </div>

  );
}