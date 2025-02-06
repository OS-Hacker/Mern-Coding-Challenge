import { TransactionModel } from "../model/transactionModel.js";

const combinedDataController = async (req, res) => {
  const { month } = req.query;

  // Validate month input (1-12)
  const monthIndex = parseInt(month, 10);
  if (isNaN(monthIndex) || monthIndex < 1 || monthIndex > 12) {
    return res.status(400).json({
      success: false,
      message: "Invalid month value. Month must be between 1 and 12.",
    });
  }

  const startDate = new Date(new Date().getFullYear(), monthIndex - 1, 1);
  const endDate = new Date(new Date().getFullYear(), monthIndex, 0);

  try {
    // Fetch total sales using aggregation
    const totalSalesResult = await TransactionModel.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
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
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
    });

    const unsoldItems = await TransactionModel.countDocuments({
      sold: false,
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
    });

    // Fetch bar chart data
    const priceRanges = await TransactionModel.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
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
          default: "901-above",
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

    // Fetch pie chart data
    const categoryCounts = await TransactionModel.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
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

    res.status(200).json({
      success: true,
      statistics: {
        totalSales,
        soldItems,
        unsoldItems,
      },
      barChart: priceRanges,
      pieChart: categoryCounts,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export default combinedDataController;
