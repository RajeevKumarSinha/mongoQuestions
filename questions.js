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
  const data = await restaurant.find(
    {},
    { name: 1, restaurant_id: 1, borough: 1, cuisine: 1 }
  );
  console.log(data);
  res.json({ data });
});

////////////////////////////////////////////////////////////////

// 3. Write a MongoDB query to display the fields restaurant_id, name, borough and cuisine, but
// exclude the field _id for all the documents in the collection restaurant.

questionsRouter.route("/3").get(async (req, res) => {
  const data = await restaurant.find(
    {},
    { restaurant_id: 1, name: 1, borough: 1, cuisine: 1, _id: 0 }
  );
  console.log(data);
  res.send("data logged to console");
});
////////////////////////////////////////////////////////////////

// 4. Write a MongoDB query to display the fields restaurant_id, name, borough and zip code, but
// exclude the field _id for all the documents in the collection restaurant.

questionsRouter.route("/4").get(async (req, res) => {
  const data = await restaurant.find(
    {},
    { restaurant_id: 1, name: 1, borough: 1, "address.zipcode": 1, _id: 0 }
  );
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
        $and: [
          { cuisine: { $ne: "American " } },
          { cuisine: { $ne: "Chinese" } },
        ],
      },
    ],
  },
  { restaurant_id: 1, name: 1, borough: 1, cuisine: 1 }
);

// 22. Write a MongoDB query to find the restaurant Id, name, and grades for those restaurants which achieved a grade of "A" and scored 11 on an ISODate "2014-08-11T00:00:00Z" among many of survey dates..
db.restaurants.find(
  {
    $and: [
      { "grades.grade": "A" },
      { "grades.date": ISODate("2014-08-11T00:00:00Z") },
      { "grades.score": 11 },
    ],
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
      $eq: [
        { $arrayElemAt: ["$grades.date", 1] },
        ISODate("2014-08-11T00:00:00Z"),
      ],
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

db.restaurants.find(
  { "grades.score": { $mod: [7, 0] } },
  { restaurant_id: 1, name: 1, grades: 1 }
);

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

db.restaurants.find(
  { name: /^Mad/ },
  { name: 1, borough: 1, "address.coord": 1, cuisine: 1 }
);

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
  $and: [
    { "grades.score": { $eq: 2 } },
    { "grades.score": { $eq: 6 } },
    { borough: "Manhattan" },
  ],
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
  $and: [
    { "grades.score": { $in: [2, 6] } },
    { borough: { $in: ["Manhattan", "Brooklyn"] } },
  ],
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

db.restaurants.find(
  { "grades.score": { $not: { $lte: 5 } } },
  { borough: { $in: ["Manhattan", "Brooklyn"] } }
);

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

// 61. Write a MongoDB query to find the average score for each cuisine.
