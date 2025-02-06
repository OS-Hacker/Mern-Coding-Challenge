import { TransactionModel } from "../model/transactionModel.js";

const statisticsController = async (req, res) => {
  const { month } = req.query;

  const monthNum = parseInt(month);
  
  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return res.status(400).json({
      success: false,
      message: "Invalid month value. Month must be between 1 and 12.",
    });
  }

  try {
    // Fetch total sales using aggregation
    const totalSalesResult = await TransactionModel.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNum] },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
        },
      },
    ]);

    const totalSales = totalSalesResult[0]?.totalSales || 0;

    // Count sold and unsold items
    const soldItems = await TransactionModel.countDocuments({
      sold: true,
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNum] },
    });

    const unsoldItems = await TransactionModel.countDocuments({
      sold: false,
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNum] },
    });

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

    // Send response
    res.status(200).json({
      success: true,
      month: getMonth[monthNum - 1],
      totalSales,
      soldItems,
      unsoldItems,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default statisticsController;
