import { TransactionModel } from "../model/transactionModel.js";

const transactionController = async (req, res) => {
  const { search, page, per_page, month } = req.query;

  const query = {};

  // Validate and process pagination values
  const pageNumber = parseInt(page, 10) || 1;
  const perPageNumber = parseInt(per_page, 10) || 10;

  if (pageNumber <= 0 || perPageNumber <= 0) {
    return res
      .status(400)
      .send({ success: false, msg: "Invalid page or per_page values" });
  }

  // Apply Month Filter if provided (month is sent as an index: 0-11)
  if (month !== undefined) {
    const monthNum = parseInt(month);

    // Validate month index (0-11)
    if (isNaN(monthNum) || monthNum < 0 || monthNum > 12) {
      return res
        .status(400)
        .send({ success: false, msg: "Invalid month index" });
    }

    // Filter by month using MongoDB's $expr and $month operator
    query.$expr = { $eq: [{ $month: "$dateOfSale" }, monthNum] };
  }

  // Apply Search Filter
  if (search) {
    query.$or = [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
    ];

    // Check if search is a number (for price)
    if (!isNaN(search)) {
      query.$or.push({ price: parseFloat(search) });
    }
  }

  try {
    // Get total count for pagination
    const totalTransactions = await TransactionModel.countDocuments(query);

    console.log("totalTransactions", totalTransactions);

    const transactions = await TransactionModel.find(query)
      .skip((pageNumber - 1) * perPageNumber)
      .limit(perPageNumber);

    return res.status(200).send({
      success: true,
      msg: transactions.length
        ? "Transactions fetched successfully"
        : "No transactions found",
      transactions,
      totalTransactions,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalTransactions / perPageNumber),
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export default transactionController;
