import { query } from "../../utils/db.js";
import catchAsync from "../../utils/catchAsync.js";
import { GET_DIFFICULTY_STATS } from "../../queries/user/statsQueries.js";

export const getDifficultyStats = catchAsync(async (req, res) => {

  const userId = req.user.user_id;

  const rows = await query(GET_DIFFICULTY_STATS, [userId]);

  let stats = {
    easy: 0,
    medium: 0,
    hard: 0
  };

  rows.forEach(r => {
    stats[r.difficulty] = r.solved_count;
  });

  res.status(200).json({
    status: "success",
    data: stats
  });

});