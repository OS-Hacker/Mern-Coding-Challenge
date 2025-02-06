import { TransactionModel } from "../model/transactionModel.js";

const pieChartController = async (req, res) => {
  const { month } = req.query;

  const monthNum = parseInt(month);

  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return res.status(400).json({
      success: false,
      message: "Invalid month value. Month must be between 1 and 12.",
    });
  }

  try {
    const categoryCounts = await TransactionModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthNum],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);

    // getMonth
    const getMonth = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentMonth = getMonth[monthNum - 1];

    res.status(200).json({
      success: true,
      categoryCounts,
      currentMonth,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export default pieChartController;
