var express = require('express');
var router = express.Router();
var db = require('../models/index');

router.get('/', function (req, res) {
    db.Expense.findAll({
        order: db.Sequelize.literal('createdAt DESC')
    }).then(function (expenses) {
        let balance = 0;
        expenses = expenses.map(function (expense) {
            balance += expense.breakdown[req.user.email].paid - expense.breakdown[req.user.email].shouldPay;
            return processExpense(expense, req.user.email);
        });
        res.json({
            balance: balance,
            expenses: expenses,
        });
    });
});

router.post('/', function (req, res) {
    db.Expense.create(generateExpense(req.body)).then(function (expense) {
        return expense.reload();
    }).then(function (expense) {
        res.status(201).json(processExpense(expense, req.user.email));
    });
});

router.put('/:expenseId', function (req, res) {
    db.Expense.findByPk(req.params.expenseId).then(function (expense) {
        if (!expense) {
            res.status(404).json({ message: 'Expense not found' });
            throw Error('Expense not found');
        } else {
            var updated = generateExpense(req.body);
            Object.keys(updated).forEach(function (key) {
                expense[key] = updated[key];
            })
            return expense.save();
        }
    }).then(function (expense) {
        return expense.reload();
    }).then(function (expense) {
        res.json(processExpense(expense, req.user.email));
    }).catch(function (e) {
    });
});

router.delete('/:expenseId', function (req, res) {
    db.Expense.findByPk(req.params.expenseId).then(function (expense) {
        if (!expense) {
            res.status(404).json({ message: 'Expense not found' });
            return;
        }
        return expense.destroy();
    }).then(function () {
        res.json({ message: 'deleted' });
    });
});

var processExpense = function (expense, userEmail) {
    return {
        id: expense.id,
        createdAt: expense.createdAt,
        total: expense.total,
        paid: expense.breakdown[userEmail].paid,
        shouldPay: expense.breakdown[userEmail].shouldPay,
        title: expense.title,
        category: expense.category
    };
};

var generateExpense = function (body) {
    var title = body.title;
    var data = body.data;
    var coupleId = body.coupleId;
    var createdAt = body.date;
    var category = body.category;
    var emails = Object.keys(data);
    var total = data[emails[0]].paid + data[emails[1]].paid;
    return {
        title: title,
        coupleId: coupleId,
        total: total,
        createdAt: createdAt,
        category: category,
        breakdown: JSON.stringify({
            [emails[0]]: {
                paid: Number(data[emails[0]].paid),
                shouldPay: Number(data[emails[0]].shouldPay)
            },
            [emails[1]]: {
                paid: Number(data[emails[1]].paid),
                shouldPay: Number(data[emails[1]].shouldPay)
            }
        })
    }
}

module.exports = router;