import { TransactionModel } from "../model/transactionModel.js";

const barCharController = async (req, res) => {
  const { month } = req.query;

  const monthNum = parseInt(month);

  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return res.status(400).json({
      success: false,
      message: "Invalid month value. Month must be between 1 and 12.",
    });
  }

  try {
    const priceRanges = await TransactionModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthNum],
          },
        },
      },

      {
        $bucket: {
          groupBy: "$price",
          boundaries: [
            0,
            101,
            201,
            301,
            401,
            501,
            601,
            701,
            801,
            901,
            Infinity,
          ],
          default: "Other",
          output: {
            count: { $sum: 1 },
          },
        },
      },

      {
        $project: {
          _id: 0,
          priceRange: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 0] }, then: "0-100" },
                { case: { $eq: ["$_id", 101] }, then: "101-200" },
                { case: { $eq: ["$_id", 201] }, then: "201-300" },
                { case: { $eq: ["$_id", 301] }, then: "301-400" },
                { case: { $eq: ["$_id", 401] }, then: "401-500" },
                { case: { $eq: ["$_id", 501] }, then: "501-600" },
                { case: { $eq: ["$_id", 601] }, then: "601-700" },
                { case: { $eq: ["$_id", 701] }, then: "701-800" },
                { case: { $eq: ["$_id", 801] }, then: "801-900" },
                { case: { $eq: ["$_id", 901] }, then: "901-above" },
              ],
              default: "Other",
            },
          },
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
      priceRanges,
      currentMonth,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export default barCharController;
