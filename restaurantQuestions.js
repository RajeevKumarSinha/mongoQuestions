"use strict";

const express = require("express");
const questionsRouter = express.Router();
const mongoose = require("mongoose");

module.exports = questionsRouter;

const restaurantSchema = new mongoose.Schema({
	address: {
		building: String,
		coord: [Number],
		street: String,
		zipcode: String,
	},
	borough: String,
	cuisine: String,
	grades: [
		{
			date: Date,
			grade: String,
			score: Number,
		},
	],
	name: String,
	restaurant_id: String,
});

const restaurant = mongoose.model("restaurant", restaurantSchema);
// 1. Write a MongoDB query to display all the documents in the collection restaurants.

questionsRouter.route("/1").get(async (req, res) => {
	const data = await restaurant.find({});
	res.json({ data });
});

////////////////////////////////////////////////////////////////////////

//2. Write a MongoDB query to display the fields restaurant_id, name,
// borough and cuisine for all the documents in the collection restaurant.

questionsRouter.route("/2").get(async (req, res) => {
	const data = await restaurant.find({}, { name: 1, restaurant_id: 1, borough: 1, cuisine: 1 });
	console.log(data);
	res.json({ data });
});

////////////////////////////////////////////////////////////////

// 3. Write a MongoDB query to display the fields restaurant_id, name, borough and cuisine, but
// exclude the field _id for all the documents in the collection restaurant.

questionsRouter.route("/3").get(async (req, res) => {
	const data = await restaurant.find({}, { restaurant_id: 1, name: 1, borough: 1, cuisine: 1, _id: 0 });
	console.log(data);
	res.send("data logged to console");
});
////////////////////////////////////////////////////////////////

// 4. Write a MongoDB query to display the fields restaurant_id, name, borough and zip code, but
// exclude the field _id for all the documents in the collection restaurant.

questionsRouter.route("/4").get(async (req, res) => {
	const data = await restaurant.find({}, { restaurant_id: 1, name: 1, borough: 1, "address.zipcode": 1, _id: 0 });
	console.log(data);
	res.send("data logged");
});

////////////////////////////////////////////////////////////////

// 5. Write a MongoDB query to display all the restaurant which is in the borough Bronx.

questionsRouter.route("/5").get(async (req, res) => {
	const data = await restaurant.find({ borough: "Bronx" });
	console.log(data);
	res.send("data logged");
});

////////////////////////////////////////////////////////////////

// 6. Write a MongoDB query to display the first 5 restaurant which is in the borough Bronx.

questionsRouter.route("/6").get(async (req, res) => {
	const data = await restaurant.find({ borough: "Bronx" }).limit(5);
	console.log(data);
	res.send("data logged");
});

// 7.Write a MongoDB query to display the next 5 restaurants after skipping first 5 which are in the borough Bronx❌

// db.restaurants.find().limit(5).skip(5);

////////////////////////////////////////////////////////////////
// 8. Write a MongoDB query to find the restaurants who achieved a score more than 90.

questionsRouter.route("/8").get(async (req, res) => {
	const data = await restaurant.find({ "grades.score": { $gt: 90 } });
	console.log(data);
	res.json({ data });
	// res.send("data logged 90");
});

// 9. Write a MongoDB query to find the restaurants that achieved a score, more than 80 but less than 100.☑️✅✔️
//notes: here $elemMatch compares every element with (elem>80 && elem<100)
// but if we use "grades.score" it compares every element with (elem<100 || elem>80)

questionsRouter.route("/9").get(async (req, res) => {
	const data = await restaurant.find({
		grades: { $elemMatch: { score: { $gt: 80, $lt: 100 } } },
	});
	res.json(data);
});

// 10. Write a MongoDB query to find the restaurants which locate in latitude value less than -95.754168.

questionsRouter.route("/10").get(async (req, res) => {
	const data = await restaurant.find({
		"address.coord": { $lt: -95.754168 },
	});
	res.json(data);
});

////////////////////////////////////////////////////////////////////////

// 11. Write a MongoDB query to find the restaurants that do not prepare any cuisine of 'American'
// and their grade score more than 70 and latitude less than -65.754168.

questionsRouter.route("/11").get(async (req, res) => {
	const data = await restaurant.find({
		$and: [
			{ cuisine: { $ne: "American " } },
			{ grades: { $elemMatch: { score: { $gt: 70 } } } },
			{ "address.coord": { $lt: -65.754168 } },
		],
	});
	res.json(data);
});

// 12. Write a MongoDB query to find the restaurants which do not prepare any cuisine of 'American'
//  and achieved a score more than 70 and located in the longitude less than -65.754168.
// Note : Do this query without using $and operator.

questionsRouter.route("/12").get(async (req, res) => {
	const data = await restaurant.find({
		cuisine: { $ne: "American " },
		"grades.score": { $gt: 70 },
		"address.coord": { $lt: -65.754168 },
	});
	res.json(data);
});

// 13. Write a MongoDB query to find the restaurants which do not prepare any cuisine of 'American'
//  and achieved a grade point 'A' not belongs to the borough Brooklyn. The document must be
// displayed according to the cuisine in descending order.

questionsRouter.route("/13").get(async (req, res) => {
	const data = await restaurant
		.find({
			cuisine: { $ne: "American " },
			borough: { $ne: "Brooklyn" },
			"grades.grade": "A",
		})
		.sort({ cuisine: -1 });
	res.json(data);
});

// 14. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for those
// restaurants which contain 'Wil' as first three letters for its name

questionsRouter.route("/14").get(async (req, res) => {
	const data = await restaurant.find(
		{
			name: { $regex: /^Wil/ },
		},
		{ restaurant_id: 1, name: 1, borough: 1, cuisine: 1 }
	);
	res.json(data);
});

// 15. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for
// those restaurants which contain 'ces' as last three letters for its name.

questionsRouter.route("/15").get(async (req, res) => {
	const data = await restaurant.find(
		{
			name: { $regex: /ces$/ },
		},
		{ restaurant_id: 1, name: 1, borough: 1, cuisine: 1 }
	);
	res.json(data);
});

// 16. Write a MongoDB query to find the restaurant Id, name, borough and cuisine
// for those restaurants which contain 'Reg' as three letters somewhere in its name.

questionsRouter.route("/16").get(async (req, res) => {
	const data = await restaurant.find(
		{
			name: { $regex: /Reg/ },
		},
		{ restaurant_id: 1, name: 1, borough: 1, cuisine: 1 }
	);
	res.json(data);
});

// 17. Write a MongoDB query to find the restaurants which belong to the borough Bronx
// and prepared either American or Chinese dish.

questionsRouter.route("/17").get(async (req, res) => {
	const data = await restaurant.find({
		borough: "Bronx",
		cuisine: { $in: ["American ", "Chinese"] },
	});
	res.json(data);
});

// 18. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for
// those restaurants which belong to the borough Staten Island or Queens or Bronx or Brooklyn.

questionsRouter.route("/18").get(async (req, res) => {
	const data = await restaurant.find(
		{
			borough: { $in: ["Staten Island", "Queens", "Bronx", "Brooklyn"] },
		},
		{ restaurant_id: 1, cuisine: 1, name: 1, borough: 1 }
	);
	res.json(data);
});

// 19. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for those
// restaurants which are not belonging to the borough Staten Island or Queens or Bronxor Brooklyn.

questionsRouter.route("/19").get(async (req, res) => {
	const data = await restaurant.find(
		{
			borough: { $nin: ["Staten Island", "Queens", "Bronxor Brooklyn"] },
		},
		{ restaurant_id: 1, name: 1, borough: 1, cuisine: 1 }
	);
	res.json(data);
});

// 20. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for
// those restaurants which achieved a score which is not more than 10.

questionsRouter.route("/20").get(async (req, res) => {
	const data = await restaurant.find(
		{
			"grades.score": { $lte: 10 },
		},
		{ restaurant_id: 1, name: 1, borough: 1, cuisine: 1 }
	);
	res.json(data);
});

// 21. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for those restaurants
// which prepared dish except 'American' and 'Chinees' or restaurant's name begins with letter 'Wil'.

db.restaurants.find(
	{
		$or: [
			{ name: /^Wil/ },
			{
				$and: [{ cuisine: { $ne: "American " } }, { cuisine: { $ne: "Chinese" } }],
			},
		],
	},
	{ restaurant_id: 1, name: 1, borough: 1, cuisine: 1 }
);

// 22. Write a MongoDB query to find the restaurant Id, name, and grades for those restaurants which achieved a grade of "A" and scored 11 on an ISODate "2014-08-11T00:00:00Z" among many of survey dates..
db.restaurants.find(
	{
		$and: [{ "grades.grade": "A" }, { "grades.date": ISODate("2014-08-11T00:00:00Z") }, { "grades.score": 11 }],
	},
	{ restaurant_id: 1, name: 1, grades: 1 }
);

// 23. Write a MongoDB query to find the restaurant Id, name and grades for those restaurants where the 2nd element of grades array contains a grade of "A" and score 9 on an ISODate "2014-08-11T00:00:00Z".
db.restaurants.find(
	{
		"grades.1.score": 9,
		"grades.1.date": ISODate("2014-08-11T00:00:00Z"),
		"grades.1.grade": "A",
	},
	{ restaurant_id: 1, name: 1, grades: 1 }
);

//Or

db.restaurants.find(
	{
		$expr: {
			$eq: [{ $arrayElemAt: ["$grades.grade", 1] }, "A"],
			$eq: [{ $arrayElemAt: ["$grades.score", 1] }, 9],
			$eq: [{ $arrayElemAt: ["$grades.date", 1] }, ISODate("2014-08-11T00:00:00Z")],
		},
	},
	{ restaurant_id: 1, name: 1, grades: 1 }
);

// 24. Write a MongoDB query to find the restaurant Id, name, address and geographical location for
// those restaurants where 2nd element of coord array contains a value which is more than 42 and upto 52..

db.restaurants.find(
	{
		"address.coord.1": { $gt: 42, $lte: 52 },
	},
	{ restaurant_id: 1, name: 1, address: 1, borough: 1 }
);

// 25. Write a MongoDB query to arrange the name of the restaurants in ascending order along with all the columns.

db.restaurants.find().sort({ name: 1 });

// 26. Write a MongoDB query to arrange the name of the restaurants in descending along with all the columns.

db.restaurants.find().sort({ name: -1 });

// 27. Write a MongoDB query to arranged the name of the cuisine in ascending order and for that
// same cuisine borough should be in descending order.

db.restaurants.find().sort({ cuisine: 1 }, { borough: -1 });

// 28. Write a MongoDB query to know whether all the addresses contains the street or not.

db.restaurants.find({ "address.street": { $exists: true } });

// 29. Write a MongoDB query which will select all documents in the restaurants collection where
// the coord field value is Double.

db.restaurants.find({ "address.coord": { $type: 1 } });

// 30. Write a MongoDB query which will select the restaurant Id, name and grades for those
// restaurants which returns 0 as a remainder after dividing the score by 7.

db.restaurants.find({ "grades.score": { $mod: [7, 0] } }, { restaurant_id: 1, name: 1, grades: 1 });

//
//
//
//

//////////////////////////////// check form here

// 31. Write a MongoDB query to find the restaurant name, borough, longitude and attitude
// and cuisine for those restaurants which contains 'mon' as three letters somewhere in its name.

db.restaurants.find(
	{
		name: /mon/,
	},
	{ name: 1, borough: 1, "address.coord": 1, cuisine: 1 }
);

// 32. Write a MongoDB query to find the restaurant name, borough, longitude and latitude
// and cuisine for those restaurants which contain 'Mad' as first three letters of its name.

db.restaurants.find({ name: /^Mad/ }, { name: 1, borough: 1, "address.coord": 1, cuisine: 1 });

// 33. Write a MongoDB query to find the restaurants that have at least one grade with a score of less than 5.

db.restaurants.find({ "grades.score": { $lt: 5 } });

// 34. Write a MongoDB query to find the restaurants that have at least one grade with a
// score of less than 5 and that are located in the borough of Manhattan.

db.restaurants.find({ "grades.score": { $lt: 5 }, borough: "Manhattan" });

// 35. Write a MongoDB query to find the restaurants that have at least one grade with a score
// of less than 5 and that are located in the borough of Manhattan or Brooklyn.

db.restaurants.find({
	"grades.score": { $lt: 5 },
	borough: { $in: ["Manhattan", "Brooklyn"] },
});

// 36. Write a MongoDB query to find the restaurants that have at least one grade with a score of
// less than 5 and that are located in the borough of Manhattan or Brooklyn, and their cuisine is not American.

db.restaurants.find({
	"grades.score": { $lt: 5 },
	borough: { $in: ["Manhattan", "Brooklyn"] },
	cuisine: { $ne: "American " },
});

// 37. Write a MongoDB query to find the restaurants that have at least one grade with a score of less
// than 5 and that are located in the borough of Manhattan or Brooklyn, and their cuisine is not American or Chinese.

db.restaurants.find({
	"grades.score": { $lt: 5 },
	borough: { $in: ["Manhattan", "Brooklyn"] },
	cuisine: { $nin: ["American ", "Chinese"] },
});

// 38. Write a MongoDB query to find the restaurants that have a grade with a score of 2 and a grade with a score of 6.
db.restaurants.find({
	$and: [{ "grades.score": { $eq: 2 } }, { "grades.score": { $eq: 6 } }],
});

// 39. Write a MongoDB query to find the restaurants that have a grade with a score of 2 and a grade
// with a score of 6 and are located in the borough of Manhattan.
db.restaurants.find({
	$and: [{ "grades.score": { $eq: 2 } }, { "grades.score": { $eq: 6 } }, { borough: "Manhattan" }],
});

// 40. Write a MongoDB query to find the restaurants that have a grade with a score of 2 and a grade with a score of 6 and are located in the borough of Manhattan or Brooklyn.

db.restaurants.find({
	$and: [
		{ "grades.score": { $eq: 2 } },
		{ "grades.score": { $eq: 6 } },
		{ borough: { $in: ["Manhattan", "Brooklyn"] } },
	],
});

// 41.Write a MongoDB query to find the restaurants that have a grade with a score of 2 and
// a grade with a score of 6 and are located in the borough of Manhattan or Brooklyn, and
// their cuisine is not American.

db.restaurants.find({
	$and: [
		{ "grades.score": { $eq: 2 } },
		{ "grades.score": { $eq: 6 } },
		{ borough: { $in: ["Manhattan", "Brooklyn"] } },
		{ cuisine: { $ne: "American " } },
	],
});

// 42. Write a MongoDB query to find the restaurants that have a grade with a score of 2
// and a grade with a score of 6 and are located in the borough of Manhattan or Brooklyn,
// and their cuisine is not American or Chinese.

db.restaurants.find({
	$and: [
		{ "grades.score": { $eq: 2 } },
		{ "grades.score": { $eq: 6 } },
		{ borough: { $in: ["Manhattan", "Brooklyn"] } },
		{ cuisine: { $nin: ["American ", "Chinese"] } },
	],
});

// 43. Write a MongoDB query to find the restaurants that have a grade with a score of
// 2 or a grade with a score of 6.

db.restaurants.find({ "grades.score": { $in: [2, 6] } });

// 44. Write a MongoDB query to find the restaurants that have a grade with a score
// of 2 or a grade with a score of 6 and are located in the borough of Manhattan.

db.restaurants.find({
	$and: [{ "grades.score": { $in: [2, 6] } }, { borough: "Manhattan" }],
});

// 45. Write a MongoDB query to find the restaurants that have a grade with a score
// of 2 or a grade with a score of 6 and are located in the borough of Manhattan or Brooklyn.

db.restaurants.find({
	$and: [{ "grades.score": { $in: [2, 6] } }, { borough: { $in: ["Manhattan", "Brooklyn"] } }],
});

// 46. Write a MongoDB query to find the restaurants that have a grade with a score
// of 2 or a grade with a score of 6 and are located in the borough of Manhattan
// or Brooklyn, and their cuisine is not American.

db.restaurants.find({
	$and: [
		{ "grade.score": { $in: [2, 6] } },
		{ Borough: { $in: ["Manhattan", "Brooklyn"] } },
		{ Cuisine: { $ne: "American " } },
	],
});

// 47. Write a MongoDB query to find the restaurants that have a grade with a
// score of 2 or a grade with a score of 6 and are located in the borough of
// Manhattan or Brooklyn, and their cuisine is not American or Chinese.

db.restaurants.find({
	$and: [
		{ "grade.score": { $in: [2, 6] } },
		{ Borough: { $in: ["Manhattan", "Brooklyn"] } },
		{ Cuisine: { $ne: "American ", $ne: "Chinese" } },
	],
});

// 48. Write a MongoDB query to find the restaurants that have all grades with a score greater than 5.

db.restaurants.find({
	grades: { $not: { $elemMatch: { score: { $lte: 5 } } } },
});
// &&
db.restaurants.find({ "grades.score": { $not: { $lte: 5 } } });

// 49. Write a MongoDB query to find the restaurants that have all grades with a
// score greater than 5 and are located in the borough of Manhattan

db.restaurants.find({
	"grades.score": { $not: { $lte: 5 } },
	borough: "Manhattan",
});

// 50. Write a MongoDB query to find the restaurants that have all grades
// with a score greater than 5 and are located in the borough of Manhattan or Brooklyn.

db.restaurants.find({ "grades.score": { $not: { $lte: 5 } } }, { borough: { $in: ["Manhattan", "Brooklyn"] } });

// 51. Write a MongoDB query to find the average score for each restaurant.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{ $group: { _id: "$name", avgScore: { $avg: "$grades.score" } } },
]);

// 52. Write a MongoDB query to find the highest score for each restaurant.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{ $group: { _id: "$name", maxScore: { $max: "$grades.score" } } },
]);

// 53. Write a MongoDB query to find the lowest score for each restaurant.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{ $group: { _id: "$name", minScore: { $min: "$grades.score" } } },
]);

// 54. Write a MongoDB query to find the count of restaurants in each borough.

db.restaurants.aggregate([
	{
		$group: { _id: "$borough", count: { $sum: 1 } },
	},
]);

// 55. Write a MongoDB query to find the count of restaurants for each cuisine.

db.restaurants.aggregate([
	{
		$group: { _id: "$cuisine", count: { $sum: 1 } },
	},
]);

// 56. Write a MongoDB query to find the count of restaurants for each cuisine and borough.

db.restaurants.aggregate([
	{
		$group: {
			_id: { cuisine: "$cuisine", borough: "$borough" },
			count: { $sum: 1 },
		},
	},
]);

// 57. Write a MongoDB query to find the count of restaurants that received a grade of 'A' for each cuisine.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$match: { "grades.grade": "A" },
	},
	{
		$group: {
			_id: "$cuisine",
			count: { $sum: 1 },
		},
	},
]);

// 58. Write a MongoDB query to find the count of restaurants that received a grade of 'A' for each borough.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$match: { "grades.grade": "A" },
	},
	{
		$group: {
			_id: "$borough",
			count: { $sum: 1 },
		},
	},
]);

// 59. Write a MongoDB query to find the count of restaurants that received a grade of 'A' for each cuisine and borough.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$match: { "grades.grade": "A" },
	},
	{
		$group: {
			_id: { cuisine: "$cuisine", borough: "$borough" },
			count: { $sum: 1 },
		},
	},
]);

// 60. Write a MongoDB query to find the number of restaurants that have been graded in each month of the year.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$project: {
			year: {
				$year: "$grades.date",
			},
			month: {
				$month: "$grades.date",
			},
		},
	},
	{
		$group: {
			_id: {
				year: "$year",
				month: "$month",
			},
			count: {
				$sum: 1,
			},
		},
	},
	{
		$sort: {
			"_id.year": 1,
			"_id.month": 1,
		},
	},
]);

// 61. Write a MongoDB query to find the average score for each cuisine.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$group: {
			_id: "$cuisine",
			avgScore: {
				$avg: "$grades.score",
			},
		},
	},
]);

// 62. Write a MongoDB query to find the highest score for each cuisine.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$group: {
			_id: "$cuisine",
			highestScore: {
				$max: "$grades.score",
			},
		},
	},
	{
		$sort: { highestScore: -1 },
	},
]);

// 63. Write a MongoDB query to find the lowest score for each cuisine.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$group: { _id: "$cuisine", minimumScore: { $min: "$grades.score" } },
	},
]);

// 64. Write a MongoDB query to find the average score for each borough.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$group: { _id: "$borough", avgScore: { $avg: "$grades.score" } },
	},
]);

// 65. Write a MongoDB query to find the highest score for each borough.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$group: { _id: "$borough", highestScore: { $max: "$grades.score" } },
	},
]);

// 66. Write a MongoDB query to find the lowest score for each borough.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$group: { _id: "$borough", lowestScore: { $min: "$grades.score" } },
	},
]);

// 67. Write a MongoDB query to find the name and address of the restaurants that received a grade of 'A' on a specific date.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$match: {
			"grades.grade": "A",
			"grades.date": ISODate("2013-07-22T00:00:00Z"),
		},
	},
	{
		$project: {
			address: 1,
			name: 1,
		},
	},
]);

// 68. Write a MongoDB query to find the name and address of the restaurants that received a grade of 'B' or 'C' on a specific date.

db.restaurants.find(
	{
		grades: {
			$elemMatch: {
				grade: {
					$in: ["C", "B"],
				},
				date: ISODate("2013-07-22T00:00:00Z"),
			},
		},
	},
	{
		address: 1,
		name: 1,
	}
);

// 69. Write a MongoDB query to find the name and address of the restaurants that have at least one 'A' grade and one 'B' grade.

db.restaurants.find(
	{
		grades: {
			$elemMatch: { grade: "A" },
			$elemMatch: { grade: "B" },
		},
	},
	{
		address: 1,
		name: 1,
	}
);

// 70. Write a MongoDB query to find the name and address of the restaurants that have at least one 'A' grade and no 'B' grades.

db.restaurants.find(
	{
		"grades.grade": "A",
		"grades.grade": { $ne: "C" },
	},
	{
		name: 1,
		address: 1,
		_id: 0,
	}
);

// 71. Write a MongoDB query to find the name ,address and grades of the restaurants that have at least one 'A' grade and no 'C' grades.

db.restaurants.find(
	{
		"grades.grade": "A",
		"grades.grade": { $ne: "C" },
	},
	{
		name: 1,
		address: 1,
		_id: 0,
	}
);

// 72. Write a MongoDB query to find the name, address, and grades of the restaurants that have at least one 'A' grade, no 'B' grades, and no 'C' grades.

db.restaurants.find(
	{
		"grades.grade": "A",
		"grades.grade": { $nin: ["B", "C"] },
	},
	{ name: 1, address: 1, grades: 1 }
);

// 73. Write a MongoDB query to find the name and address of the restaurants that have the word 'coffee' in their name.

db.restaurants.find({ name: { $regex: /coffee/i } }, { name: 1, address: 1 });

// 74. Write a MongoDB query to find the name and address of the restaurants that have a zipcode that starts with '10'.

db.restaurants.find(
	{
		"address.zipcode": /^10/,
	},
	{ name: 1, address: 1 }
);

// 75. Write a MongoDB query to find the name and address of the restaurants that have a cuisine that starts with the letter 'B'.

db.restaurants.find(
	{
		cuisine: /^B/,
	},
	{ name: 1, address: 1, cuisine: 1 }
);

// 76. Write a MongoDB query to find the name, address, and cuisine of the restaurants that have a cuisine that ends with the letter 'y'.

db.restaurants.find(
	{
		cuisine: /y$/,
	},
	{ name: 1, address: 1, cuisine: 1 }
);

// 77. Write a MongoDB query to find the name, address, and cuisine of the restaurants that have a cuisine that contains the word 'Pizza'.

db.restaurants.find(
	{
		cuisine: { $regex: /pizza/i },
	},
	{ name: 1, address: 1, cuisine: 1 }
);

// 78. Write a MongoDB query to find the restaurants achieved highest average score.

db.restaurants.aggregate([
	{
		$addFields: {
			avgScore: {
				$avg: "$grades.score",
			},
		},
	},
	{
		$sort: {
			avgScore: -1,
		},
	},
	{
		$limit: 1,
	},
]);

// 79. Write a MongoDB query to find all the restaurants with the highest number of "A" grades.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$match: {
			"grades.grade": "A",
		},
	},
	{
		$group: {
			_id: "$restaurant_id",
			name: { $first: "$name" },
			address: { $first: "$address" },
			aCount: { $sum: 1 },
		},
	},
	{
		$group: {
			_id: "$aCount",
			aCount: { $first: "$aCount" },
			restaurants: { $push: { name: "$name", address: "$address", aCount: "$aCount" } },
		},
	},
	{
		$sort: { aCount: -1 },
	},
	{
		$limit: 1,
	},
]);

// 80. Write a MongoDB query to find the cuisine type that is most likely to receive a "C" grade.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$match: {
			"grades.grade": "C",
		},
	},
	{
		$group: {
			_id: "$cuisine",
			count: { $sum: 1 },
		},
	},
	{
		$sort: { count: -1 },
	},
]);

// 81. Write a MongoDB query to find the restaurant that has the highest average score for thecuisine "Turkish".

db.restaurants.aggregate([
	{
		$match: { cuisine: "Turkish" },
	},
	{
		$unwind: "$grades",
	},
	{
		$group: {
			_id: "$name",
			avgScore: { $avg: "$grades.score" },
		},
	},
	{
		$sort: { avgScore: -1 },
	},
]);

// 82. Write a MongoDB query to find the restaurants that achieved the highest total score.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$group: {
			_id: "$name",
			name: { $first: "$name" },
			totalScore: { $sum: "$grades.score" },
		},
	},
	{
		$group: {
			_id: "$totalScore",
			restaurants: { $push: "$name" },
		},
	},
	{
		$sort: { _id: -1 },
	},
	{
		$limit: 1,
	},
]);

// 83. Write a MongoDB query to find all the Chinese restaurants in Brooklyn.

db.restaurants.find({
	borough: "Brooklyn",
	cuisine: "Chinese",
});

// 84. Write a MongoDB query to find the restaurant with the most recent grade date.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$group: { _id: "$name", grades: { $first: "$grades" } },
	},
	{
		$group: { _id: "$grades.date", name: { $push: "$_id" } },
	},
	{
		$sort: { _id: -1 },
	},
	{
		$limit: 1,
	},
]);

// 85. Write a MongoDB query to find the top 5 restaurants with the highest average score for each cuisine type, along with their average scores.

db.restaurants.aggregate([
	{
		$unwind: "$grades",
	},
	{
		$group: { _id: { restaurant_id: "$restaurant_id", cuisine: "$cuisine" }, avgScore: { $avg: "$grades.score" } },
	},
	{
		$sort: { avgScore: -1, "_id.cuisine": 1 },
	},
	{
		$group: {
			_id: "$_id.cuisine",
			topRestaurants: { $push: { restaurant_id: "$_id.restaurant_id", avgScore: "$avgScore" } },
		},
	},
	{
		$project: { _id: 0, cuisine: "$_id", topRestaurants: { $slice: ["$topRestaurants", 5] } },
	},
]);

// 86. Write a MongoDB query to find the top 5 restaurants in each borough with the highest number of "A" grades.

db.restaurants.aggregate([
	// Unwind the grades array
	{ $unwind: "$grades" },

	// Match documents with grade 'A'
	{ $match: { "grades.grade": "A" } },

	// Group by borough and restaurant_id, calculate countA for each restaurant
	{
		$group: {
			_id: { borough: "$borough", restaurantId: "$restaurant_id" },
			name: { $first: "$name" },
			countA: { $sum: 1 },
			address: { $first: "$address" },
			cuisine: { $first: "$cuisine" },
			grades: { $first: "$grades" },
		},
	},

	// Sort by countA in descending order
	{ $sort: { countA: -1 } },

	// Group by borough, push the top 5 restaurants into an array
	{
		$group: {
			_id: "$_id.borough",
			restaurants: { $push: "$$ROOT" },
		},
	},

	// Project to show only the top 5 restaurants for each borough
	{
		$project: {
			_id: 1,
			restaurants: { $slice: ["$restaurants", 5] },
		},
	},
]);

// 87. Write a MongoDB query to find the borough with the highest number of restaurants that have a grade of "A" and a score greater than or equal to 90.

db.restaurants.aggregate([
	{
		$match: { "grades.score": { $gte: 90 }, "grades.grade": "A" },
	},
	{
		$group: { _id: "$borough", count: { $sum: 1 } },
	},
]);
