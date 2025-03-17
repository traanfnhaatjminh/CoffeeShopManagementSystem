const { StatusCodes } = require("http-status-codes");
const Bill = require("../../models/Bill");
const Ingredient = require("../../models/Ingredient");

const getDataTotalRevenue = async (req, res) => {
    const { month, year } = req.body;
    try {
        let totalMoney = 0;
        const query = month
            ? {
                  $expr: {
                      $and: [
                          { $eq: [{ $month: "$created_time" }, month] },
                          { $eq: [{ $year: "$created_time" }, year] },
                      ],
                  },
              }
            : {};
        const allBillMonth = await Bill.find(query);

        if (allBillMonth.length == 0) {
            return res.json({
                success: false,
                message: "Không tìm được hóa đơn cho tháng này",
            });
        }
        totalMoney = allBillMonth.reduce(
            (total, item) => (total += item.total_cost),
            0
        );
        res.status(StatusCodes.OK).json({
            success: true,
            data: {
                allBillMonth,
                totalMoney,
            },
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Đã có lỗi xảy ra trong quá trình xử lý yêu cầu",
        });
    }
};

const getDataTotalProfit = async (req, res) => {
    const { month, year } = req.body;
    try {
        let totalMoneyProfit = 0;

        const query = month
            ? {
                  $expr: {
                      $and: [
                          { $eq: [{ $month: "$created_time" }, month] },
                          { $eq: [{ $year: "$created_time" }, year] },
                      ],
                  },
              }
            : {};

        const allDataProfit = await Bill.find(query)
            .populate({
                path: "product_list.productId",
            })
            .exec();
        if (allDataProfit.length == 0) {
            return res.json({
                success: false,
                message: "Không tìm được hóa đơn cho tháng này",
            });
        }
        allDataProfit.forEach((item) => {
            totalMoneyProfit += item.product_list.reduce((total, produce) => {
                return (
                    total +
                    produce.quantityP *
                        (produce.productId.sale_price -
                            produce.productId.cost_price)
                );
            }, 0);
        });
        res.status(StatusCodes.OK).json({
            success: true,
            data: {
                totalMoneyProfit,
            },
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Đã có lỗi xảy ra trong quá trình xử lý yêu cầu",
        });
    }
};
const listTopProductsOrder = async (req, res) => {
    const { month, year } = req.body;
    try {
        const query = month
            ? {
                  $expr: {
                      $and: [
                          { $eq: [{ $month: "$created_time" }, month] },
                          { $eq: [{ $year: "$created_time" }, year] },
                      ],
                  },
              }
            : {};

        const allTopOrder = await Bill.aggregate([
            { $unwind: "$product_list" },
            { $match: query },
            {
                $lookup: {
                    from: "products",
                    localField: "product_list.productId",
                    foreignField: "_id",
                    as: "product_info",
                },
            },
            { $unwind: "$product_info" },
            {
                $group: {
                    _id: "$product_list.nameP",
                    total_quantity: { $sum: "$product_list.quantityP" },
                    total_revenue: {
                        $sum: {
                            $multiply: [
                                "$product_list.priceP",
                                "$product_list.quantityP",
                            ],
                        },
                    },
                    total_cost: {
                        $sum: {
                            $multiply: [
                                "$product_info.cost_price",
                                "$product_list.quantityP",
                            ],
                        },
                    },
                },
            },
            {
                $addFields: {
                    total_profit: {
                        $subtract: ["$total_revenue", "$total_cost"],
                    },
                },
            },
            { $sort: { total_quantity: -1 } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                listDataTopProduct: allTopOrder,
                month,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra trong quá trình xử lý yêu cầu",
        });
    }
};

const listDataExpense = async (req, res) => {
    const { month, year } = req.body;
    try {
        const query = month
            ? {
                  $expr: {
                      $and: [
                          {
                              $eq: [
                                  { $month: "$purchase_history.date" },
                                  month,
                              ],
                          },
                          { $eq: [{ $year: "$purchase_history.date" }, year] },
                      ],
                  },
              }
            : {};

        const listAllDataExpense = await Ingredient.aggregate([
            {
                $unwind: "$purchase_history",
            },
            {
                $match: query,
            },
            {
                $group: {
                    _id: "$name",
                    totalExpense: {
                        $sum: {
                            $multiply: [
                                "$purchase_history.quantity",
                                "$purchase_history.cost_price",
                            ],
                        },
                    },
                    totalQuantity: { $sum: "$purchase_history.quantity" },
                },
            },
            { $sort: { totalExpense: -1 } },
        ]);

        if (listAllDataExpense.length === 0) {
            return res.json({
                success: false,
                message: "Không có dữ liệu chi phí cho tháng này.",
            });
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: listAllDataExpense,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra trong quá trình xử lý yêu cầu",
        });
    }
};
const getDataTotalExpense = async (req, res) => {
    const { month, year } = req.body;
    try {
        let totalExpense = 0;
        let totalQuantity = 0;

        const query = month
            ? {
                  $expr: {
                      $and: [
                          {
                              $eq: [
                                  { $month: "$purchase_history.date" },
                                  month,
                              ],
                          },
                          { $eq: [{ $year: "$purchase_history.date" }, year] },
                      ],
                  },
              }
            : {};

        const allDataExpense = await Ingredient.aggregate([
            {
                $unwind: "$purchase_history",
            },
            {
                $match: query,
            },
            {
                $group: {
                    _id: null,
                    totalExpense: {
                        $sum: {
                            $multiply: [
                                "$purchase_history.quantity",
                                "$purchase_history.cost_price",
                            ],
                        },
                    },
                    totalQuantity: { $sum: "$purchase_history.quantity" },
                },
            },
        ]);

        if (allDataExpense.length === 0) {
            return res.json({
                success: false,
                message: "Không có dữ liệu chi phí cho tháng này.",
            });
        }
        totalExpense = allDataExpense[0].totalExpense;
        totalQuantity = allDataExpense[0].totalQuantity;

        res.status(200).json({
            success: true,
            data: {
                totalExpense,
                totalQuantity,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra khi truy xuất dữ liệu.",
        });
    }
};

const getDataLatestMonths = async (req, res) => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const minMonth = month > 2 ? month - 2 : 1;

    try {
        const getAllBill = await Bill.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: [{ $month: "$created_time" }, minMonth] },
                            { $lte: [{ $month: "$created_time" }, month] },
                            { $eq: [{ $year: "$created_time" }, year] },
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$created_time" },
                    },
                    totalAmountInMonth: { $sum: "$total_cost" },
                    countBill: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    totalAmountInMonth: 1,
                    countBill: 1,
                },
            },
            {
                $sort: { month: 1 },
            },
        ]);
        res.status(StatusCodes.OK).json({
            success: true,
            data: getAllBill,
        });
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Đã có lỗi xảy ra khi truy xuất dữ liệu.",
        });
    }
};

const adminController = {
    getDataTotalRevenue,
    getDataTotalProfit,
    getDataTotalExpense,
    getDataLatestMonths,
    listTopProductsOrder,
    listDataExpense,
};

module.exports = adminController;
