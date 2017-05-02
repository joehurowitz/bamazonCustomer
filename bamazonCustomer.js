 var mysql = require("mysql");
 var inquirer = require("inquirer");

 var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password:"",
	database: "Bamazon"
 });

 connection.connect(function(err){
 	if (err) throw err;
 	
 displayAll();


 });



 var displayAll = function(){

 	var query = "SELECT * FROM products";
 // Timeout       statement timeout : 40000;
 	connection.query(query,function(err, res){

 		console.log(res);
 	});
 
productSearch();

 };







 var productSearch = function(){

inquirer.prompt([{

	name: "product_id",
	type: "input",
	message: "What is the product_id you would like to search for ?",
	validate: function(value){
		if (isNaN(value)=== false){
			return true;
		}
		return false;
	}
},

{
name: "stock_quantity",
type: "input",
message: "How many units would you like to purchase? :",
validate: function(value){
		if (isNaN(value)=== false){
			return true;
		}
		return false;
	}


	}]).then(function(answer){
		console.log(answer.product_id);

		connection.query("SELECT * FROM products WHERE ?",
		 {item_id: answer.product_id},function(err,res){
		 	console.log(res[0].product_name);

		 	if(answer.stock_quantity > res[0].stock_quantity){

		 		console.log("Insufficient stock to meet your order");
		 	}
		 	else{

		 		console.log("We will place your order now ");

		 		var total = answer.stock_quantity * res[0].price;
		 		console.log("Your total for " + answer.stock_quantity + " " + res[0].product_name + " will be : $ " + total);

		 		var newStock_quantity = res[0].stock_quantity - answer.stock_quantity;
		 		connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newStock_quantity},
		 			{item_id : answer.product_id}]


		 			)


		 		console.log("New stock quantity : " + newStock_quantity);
		 	}

		 });               
	});

 };

  //productSearch();




