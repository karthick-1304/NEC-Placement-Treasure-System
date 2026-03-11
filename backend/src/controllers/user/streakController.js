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
        currentStreak: 0,
        longestStreak: 0
      }
    });
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date();
  today.setHours(0,0,0,0);

  const firstDate = new Date(dates[0]);
  firstDate.setHours(0,0,0,0);

  const diff = (today - firstDate) / (1000 * 60 * 60 * 24);

  if (diff === 0 || diff === 1) currentStreak = 1;

  for (let i = 1; i < dates.length; i++) {

    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);

    prev.setHours(0,0,0,0);
    curr.setHours(0,0,0,0);

    const dayDiff = (prev - curr) / (1000 * 60 * 60 * 24);

    if (dayDiff === 1) {
      tempStreak++;
      if (i === currentStreak) currentStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }

  }

  longestStreak = Math.max(longestStreak, tempStreak);

  res.json({
    status: "success",
    data: {
      currentStreak,
      longestStreak
    }
  });

});