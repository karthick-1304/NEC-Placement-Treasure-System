import { query } from "../../utils/db.js";
import catchAsync from "../../utils/catchAsync.js";

import {
  GET_SOLVED_PROGRAMS,
  COUNT_SOLVED_PROGRAMS
} from "../../queries/user/solvedQueries.js";


export const getSolvedPrograms = catchAsync(async (req, res) => {

  const userId = req.user.user_id;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  const programs = await query(
    GET_SOLVED_PROGRAMS,
    [userId, limit, offset]
  );

  const countResult = await query(
    COUNT_SOLVED_PROGRAMS,
    [userId]
  );

  const total = countResult[0].total;
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: "success",
    data: {
      programs,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    }
  });

});