const express = require("express");
const router = express.Router();
const inventory = require('../mockData/items'); //remove later

router.get("/recommendations", (req, res) => {
    const daysAhead = parseInt(req.query.daysAhead || 7);
    const today = new Date();

    const mustBuy = [];
    const replenish = [];

    inventory.forEach(item => {
        const daysLeft = Math.ceil((new Date(item.expirationDate) - today) / (1000 * 60 * 60 * 24));

        if (daysLeft >= 0 && daysLeft <= daysAhead) {
            mustBuy.push({
                name: item.name,
                daysUntilExpiration: daysLeft
            });
        } else if (daysLeft > daysAhead && daysLeft <= daysAhead + 7) {
            replenish.push({
                name: item.name,
                daysUntilExpiration: daysLeft
            });
        }
    });

    res.json({ mustBuy, replenish });
});

module.exports = router;

// const Item = require("../models/Item"); // Use teammate's Item model
//
// router.get("/", async (req, res) => {
//     try {
//         const daysAhead = parseInt(req.query.daysAhead || 7);
//         const today = new Date();
//         const nextWindow = new Date();
//         nextWindow.setDate(today.getDate() + daysAhead);
//
//         const secondWindow = new Date();
//         secondWindow.setDate(nextWindow.getDate() + 7); // 7 days after daysAhead
//
//         const items = await Item.find({ expirationDate: { $gte: today } });
//
//         const mustBuy = [];
//         const replenish = [];
//
//         items.forEach(item => {
//             const daysLeft = Math.ceil((new Date(item.expirationDate) - today) / (1000 * 60 * 60 * 24));
//
//             if (daysLeft >= 0 && daysLeft <= daysAhead) {
//                 mustBuy.push({
//                     name: item.name,
//                     daysUntilExpiration: daysLeft
//                 });
//             } else if (daysLeft > daysAhead && daysLeft <= daysAhead + 7) {
//                 replenish.push({
//                     name: item.name,
//                     daysUntilExpiration: daysLeft
//                 });
//             }
//         });
//
//         res.json({ mustBuy, replenish });
//     } catch (err) {
//         console.error("Recommendations error:", err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });
//
// module.exports = router;