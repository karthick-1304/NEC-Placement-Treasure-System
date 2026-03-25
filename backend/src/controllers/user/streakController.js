import { query } from "../../utils/db.js";
import catchAsync from "../../utils/catchAsync.js";
import { GET_SOLVE_DATES } from "../../queries/user/streakQueries.js";

export const getUserStreak = catchAsync(async (req, res) => {

  const userId = req.user.user_id;

  const rows = await query(GET_SOLVE_DATES, [userId]);

  const dates = rows.map(r => new Date(r.solve_date));

  if (dates.length === 0) {
    return res.json({
      status: "success",
      data: {
        current: 0,
        longest: 0
      }
    });
  }

  let current = 1;
  let longest = 1;
  let temp = 1;

  for (let i = 1; i < dates.length; i++) {

    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);

    prev.setHours(0,0,0,0);
    curr.setHours(0,0,0,0);

    const diff = (prev - curr) / (1000 * 60 * 60 * 24);

   if (diff === 1) {
  temp++;
  current++;
} else {
  longest = Math.max(longest, temp);
  temp = 1;
}

  }

  longest = Math.max(longest, temp);

  res.json({
    status: "success",
    data: {
      current,
      longest
    }
  });

});