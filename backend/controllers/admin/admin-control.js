const { StatusCodes } = require("http-status-codes");
const Bill = require("../../models/Bill");
const Ingredient = require("../../models/Ingredient");

const getDataTotalRevenue = async (req, res) => {
    const { month } = req.body;
    try {
        let totalMoney = 0;
        const allBillMonth = await Bill.find({
            $expr: {
                $eq: [{ $month: "$created_time" }, month],
            },
        });

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
    const { month } = req.body;
    try {
        let totalMoneyProfit = 0;
        const allDataProfit = await Bill.find({
            $expr: {
                $eq: [{ $month: "$created_time" }, month],
            },
        })
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

const getDataTotalExpense = async (req, res) => {
    const { month } = req.body;
    console.log(month);
    try {
        let totalExpense = 0;
        let totalQuantity = 0;

        const allDataProfit = await Ingredient.aggregate([
            {
                $unwind: "$purchase_history",
            },
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$purchase_history.date" }, month],
                    },
                },
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

        if (allDataProfit.length === 0) {
            return res.json({
                success: false,
                message: "Không có dữ liệu chi phí cho tháng này.",
            });
        }
        totalExpense = allDataProfit[0].totalExpense;
        totalQuantity = allDataProfit[0].totalQuantity;

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

const adminController = {
    getDataTotalRevenue,
    getDataTotalProfit,
    getDataTotalExpense,
};

module.exports = adminController;
