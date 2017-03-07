var mysql = require("mysql");
var inquirer = require("inquirer");

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
    console.log("connected as id " + connection.threadId);
});


connection.query("SELECT * FROM products", function(err, res) {
    console.log("Item ID | Product Name | Department Name | Price | Quantity Available")
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
});

function ItemToBuy(itemPick, quantity) {
    this.itemPick = itemPick;
    this.quanity = quantity;

    this.printInfo = function() {
        console.log("You picked Item ID " + this.itemPick + "\n, and you would like to buy " + this.quantity +
            " of them.");
    };
};

inquirer.prompt({
    name: "itemPick",
    // type: "input",
    message: "Please enter the Item ID of the product you would like to buy."
        // validate: function(value) {
        //     if (isNaN(value) === false) {
        //         return true;
        //     }
        //     return false;
        // }
}, {
    name: "quantity",
    // type: "input",
    message: "How many would you like to buy?"
        // validate: function(value) {
        //     if (isNaN(value) === false) {
        //         return true;
        //     }
        //     return false;
        // }
}).then(function(answers) {
    var newItemsToBuy = new ItemToBuy(answers.itemPick, answers.quantity);
    // printInfo method is run to show that the newguy object was successfully created and filled
    newItemsToBuy.printInfo();
    console.log("ran without errors")
});