#!/usr/bin/node
var mongoose = require('mongoose');
var db = mongoose.connection;
var products;

var GROUPSIZE = 100;
var GROUPNUMBER = 100;
var MAX = GROUPSIZE*GROUPNUMBER;

mongoose.connect('mongodb://localhost/test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("DB: connected\nSTART");
	loadModel();
	insertBySave();
});

function loadModel() {
	// 1. Create Schema
	// 1.1 Attributes
	var productSchema = mongoose.Schema({
		id: String,
		name: String,
		price: String
	})
	// 1.2 Functions
	productSchema.methods.speak = function () {
		var greeting = this.name
			? "Product name is " + this.name
			: "I don't have a name";
		console.log(greeting);
	}
	// 2. Create model
	products = mongoose.model('products', productSchema);
}

function insertBySave() {
  // 3. Insert by save
	// 3.1 Insert using save
	var tasksCompleted = 0;
	var timeStart = (new Date).getTime();
	console.log("Start inserting by model.save " + MAX + " documents");
  for (i = 0; i < MAX; i++) {
		var item = new products({ name: 'name_'+i });
		item.price=i;

		item.save(function (err, obj) {
			tasksCompleted++;
			if (tasksCompleted == MAX) {
				var timeStop = (new Date).getTime();
				console.log("Stop inserting. Performance: " +
					Math.round(
							parseInt(GROUPSIZE*GROUPNUMBER)/
							(
								(parseInt(timeStop) - parseInt(timeStart))/1000
							)
					)	+ " obj/s"
				);
				insertByCreate();
			};
		});
	}
}

function insertByCreate() {
	// 3.2 Insert using collection.create
	var tasksCompleted = 0;
	var timeStart = (new Date).getTime();
	console.log("\nStart inserting by model.create " + MAX + " documents");
  for (j = 0; j < GROUPNUMBER; j++) {
		var arrObj = [];
		for (i = 0; i < GROUPSIZE; i++)
			arrObj.push({ name: 'name'+i });
		products.create(arrObj, function(err,data) {
			tasksCompleted++;
			if (tasksCompleted == GROUPNUMBER) {
				var timeStop = (new Date).getTime();
				console.log("Stop inserting. Performance: " +
					Math.round(
							parseInt(GROUPSIZE*GROUPNUMBER)/
							(
								(parseInt(timeStop) - parseInt(timeStart))/1000
							)
					)	+ " obj/s"
				);
				insertByCollectionInsert();
			};
		});
	}
}

function insertByCollectionInsert() {
	// 3.3 Insert using collection.insert (fastest)
	var tasksCompleted = 0;
	var timeStart = (new Date).getTime();
	console.log("\nStart inserting by model.collection.insert " + MAX + " documents");
  for (j = 0; j < GROUPNUMBER; j++) {
		var arrObj = [];
		for (i = 0; i < GROUPSIZE; i++)
			arrObj.push({ name: 'name'+i });
		products.collection.insert(arrObj, function(err,data) {
			tasksCompleted++;
			if (tasksCompleted == GROUPNUMBER) {
				var timeStop = (new Date).getTime();
				console.log("Stop inserting. Performance: " +
					Math.round(
							parseInt(GROUPSIZE*GROUPNUMBER)/
							(
								(parseInt(timeStop) - parseInt(timeStart))/1000
							)
					)	+ " obj/s"
				);
				console.log("END");
			};
		});
	}

	var timeStop = (new Date).getTime();
};
