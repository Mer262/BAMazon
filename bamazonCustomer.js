var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    // username
    user: "root",
    // password
    password: "root",
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
});


function selectStatement() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;

        var table = new Table({
            head: ["Product ID".magenta, "Product Name".magenta, "Department Name".magenta, "Price".magenta, "Quantity".magenta],
            colWidths: [13, 33, 25, 13, 10],
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        }

        console.log(table.toString());

        inquirer.prompt([{
                type: "number",
                message: "Please enter the Item ID of the product you would like to buy.",
                name: "itemNumber"
            },
            {
                type: "number",
                message: "How many would you like to buy?",
                name: "howMany"
            },
        ]).then(function(answer) {

            console.log("You picked Item ID " + answer.itemNumber + ", and you would like to buy " + answer.howMany + " of them.");

            if (res[answer.itemNumber - 1].stock_quantity > answer.howMany) {
                console.log("Ok, that's in stock.");
                var updatedQuantity = parseInt(res[answer.itemNumber - 1].stock_quantity) - parseInt(answer.howMany);
                var total = parseFloat(answer.howMany) * parseFloat(res[answer.itemNumber - 1].price);
                total = total.toFixed(2);

                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: updatedQuantity
                }, {
                    item_id: answer.itemNumber
                }], function(error, results) {
                    if (error) throw error;

                    console.log("Your order for " + answer.howMany + " " + res[answer.itemNumber - 1].product_name +
                        "(s) has been placed.");
                    console.log("Your total is $" + total);
                    additionalOrder();
                });


            } else if (res[answer.itemNumber - 1].stock_quantity < answer.howMany) {
                console.log("Sorry we only have " + res[answer.itemNumber - 1].stock_quantity + " items remaining.");
                additionalOrder();

            };
        });
    });
};

function additionalOrder() {
    inquirer.prompt([{
        type: "confirm",
        message: "Would you like to order another item?",
        name: "confirmation"

    }, ]).then(function(answer2) {
        if (answer2.confirmation) {
            selectStatement();
        } else {
            console.log("Thank you for shopping with us!");
            connection.end();
        };
    });
};
selectStatement();