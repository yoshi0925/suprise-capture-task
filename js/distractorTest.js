const GREEN_ARRAY = ['green_rec_hor', 'green_rec_ver'];
const RED_ARRAY = ['red_rec_hor', 'red_rec_ver'];
const LOCATION_ARRAY = ["top", "mid_left", "mid_right", "bot_left", "bot_right",];
const GREEN_ARRAY_REMAINING = ['green_circle_ver', 'green_circle_hor'];
const RED_ARRAY_REMAINING = ['red_circle_ver', 'red_circle_hor'];
var displayInfo = [];

/* simplified version of functions from controller.js */
async function generateRedInGreen() {
  var tar_pic = GREEN_ARRAY[Math.floor(Math.random() * 2)];
  var tar_loc = LOCATION_ARRAY[Math.floor(Math.random() * 5)];
  var temp_list = [];

  var res_data =
    tar_loc +
    "@" +
    tar_pic.match(
      /green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g
    );
  temp_list.push(res_data);

  var arr_loc_remaining = LOCATION_ARRAY.filter(function (value, index, arr) {
    return value != tar_loc;
  });

  var fake_pic = RED_ARRAY_REMAINING[Math.floor(Math.random() * 2)];
  var tar_loc2 = arr_loc_remaining[Math.floor(Math.random() * 4)];

  var res_data2 =
    tar_loc2 +
    "@" +
    fake_pic.match(
      /green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g
    );
  temp_list.push(res_data2);

  var arr_loc_remaining2 = arr_loc_remaining.filter(function (
    value,
    index,
    arr
  ) {
    return value != tar_loc2;
  });

  for (let i = 0; i < arr_loc_remaining2.length; i++) {
    var p = GREEN_ARRAY_REMAINING[Math.floor(Math.random() * 2)]
    var l = arr_loc_remaining2[i];

    var temp_data =
      l +
      "@" +
      p.match(
        /green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g
      );
    temp_list.push(temp_data);

  }
  displayInfo.push(temp_list.sort());
}

/* helper function for the test */
function countLocation(data) {
  var counts = {};

  data.forEach((arr) => {
    arr.forEach((s) => {
      var [location, color] = s.split('@');

      if (color.includes('red')) {
        counts[location] = counts[location] ? counts[location] + 1 : 1;
      }
    });
  });

  return counts;
}

// define the test function
async function testGenerateRedInGreen() {
  // generate 10000 choices
  for (let i = 0; i < 10000; i++) {
    await generateRedInGreen();
  }

  // count the number of times each location is chosen
  var locationCounts = countLocation(displayInfo);


  displayInfo = [];

  // print the results
  console.log(locationCounts);
}

// run the test
testGenerateRedInGreen();

/* some example outputs
testGenerateRedInGreen();
VM187:14 {top: 1988, mid_right: 1974, bot_right: 1974, bot_left: 2044, mid_left: 2020}

testGenerateRedInGreen();
VM187:14 {mid_right: 1994, bot_left: 1971, bot_right: 2023, top: 2029, mid_left: 1983}

testGenerateRedInGreen();
VM187:14 {bot_left: 2017, mid_right: 1969, mid_left: 2009, bot_right: 1992, top: 2013}

testGenerateRedInGreen();
VM187:14 {mid_right: 2051, top: 1995, bot_left: 2042, mid_left: 1965, bot_right: 1947}

testGenerateRedInGreen();
VM187:14 {top: 2002, bot_left: 2005, mid_left: 1977, bot_right: 2023, mid_right: 1993}
 */

