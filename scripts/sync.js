var AWS = require('aws-sdk');
var async = require('async');
var db = require('../models/index');

AWS.config.update({ region: 'us-east-1' });
AWS.config.apiVersions = {
    dynamodb: '2012-08-10',
};

var dynamodb = new AWS.DynamoDB();
var date = new Date().getTime().toString();
var coupleId = '2da2e082-9bf4-4e4a-89db-3757d24ee076';

var params = {
    TableName: 'accounting',
    IndexName: "expense-index",
    KeyConditionExpression: `couple = :v_couple and #d < :v_date`,
    ExpressionAttributeNames: {
        "#d": 'date'
    },
    ExpressionAttributeValues: {
        ":v_couple": {
            S: coupleId
        },
        ":v_date": {
            "N": date
        }
    }
};

dynamodb.query(params, function (err, result) {
    if (err) {
        console.log(err);
        return;
    }
    var expenses = result.Items;
    var parallelFunctions = [];
    for (var i = 0; i < expenses.length; i++) {
        var expense = expenses[i];
        var detail = expense.detail.M;
        var emails = Object.keys(detail);
        var breakdown = {};
        emails.forEach(function (email) {
            breakdown[email] = {
                paid: Number(detail[email].M.paid.N),
                shouldPay: Number(detail[email].M.shouldPay.N)
            };
        });
        db.Expense.create({
            createdAt: Number(expense.date.N),
            breakdown: JSON.stringify(breakdown),
            coupleId: 1,
            title: expense.title.S,
            total: Number(expense.total.N),
            category: expense.category ? expense.category.S : 'others'
        }).then(function (result) {
            console.log(i);
        });
    }
});