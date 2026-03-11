import { query } from "../../utils/db.js";
import catchAsync from "../../utils/catchAsync.js";
import { GET_HEATMAP_WINDOW } from "../../queries/user/heatmapQueries.js";

export const getHeatmapActivity = catchAsync(async (req, res) => {

  const userId = req.user.user_id;

  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({
      status: "fail",
      message: "Start and End date required"
    });
  }

  const activity = await query(
    GET_HEATMAP_WINDOW,
    [userId, start, end]
  );

  res.status(200).json({
    status: "success",
    data: activity
  });

});