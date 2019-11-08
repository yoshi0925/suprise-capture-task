// Global variables
  // vars not defined from imported js
  var isTrain = 0;
  var isTest = 0;
  var moveLast = 0;
  function endTime(){
    return 160;
  }
  var currProbe = 1;

  const Lkey = 122;
  const Rkey = 109;
  const placeHolderKey = 45; // the `ins` key, use to hack the 3-sec constraint
  var timeToRespond = false; //this indicates whether or not the subject is allowed to respond with 'same' or 'different'
  var timeToMoveOn = true; //this indicates whether or not the subject is allowed to move on to the next trial

  const green_circle_hor = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/green_circle_hor.png";
  const green_circle_ver = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/green_circle_ver.png";
  const green_rec_hor = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/green_rec_hor.png";
  const green_rec_ver = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/green_rec_ver.png";
  const red_circle_hor = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/red_circle_hor.png";
  const red_circle_ver = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/red_circle_ver.png";
  const red_rec_hor = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/red_rec_hor.png";
  const red_rec_ver = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/red_rec_ver.png";
  const green_canvas = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/green_canvas.png";
  const red_canvas = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/red_canvas.png";
  const dot = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/dot.png";
  const color_blind_test = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/colorblind-test.jpg";

  const arr_g = [green_rec_hor, green_rec_ver];
  const arr_r = [red_rec_hor, red_rec_ver];
  const arr_c = [green_canvas, red_canvas];

  const sleep_time = 1000;

  const arr_loc = ['top', 'mid_left', 'mid_right', 'bot_left', 'bot_right'];

  const arr_g_remaining = [green_circle_ver, green_circle_hor];
  const arr_r_remaining = [red_circle_ver, red_circle_hor];

  // same color mode run 50 times
  const ctr_same_color = 2;
  var trial_num = 1;
  var system_idx = 4; 

  //display_list to save the generated answere, res_list is the human answer
  var res_list = [];
  var res_time = [];
  var display_list = [];
  var canvas_list = [];
  var surprise_list = [];
  var res = "";

  var index = 0;

  // flags for random cases organization
  var g_flag = false;
  var r_flag = false;
  var mix_flag = false;

  // preload the images
  const imgSrcArr = [
    green_circle_hor,
    green_circle_ver,
    green_rec_hor,
    green_rec_ver,
    red_circle_hor,
    red_circle_ver,
    red_rec_hor,
    red_rec_ver,
    red_canvas,
    green_canvas,
    dot,
    color_blind_test
  ];

  var createdTime = 0;
  var clickedTime = 0;

  var imgWrap = [];

  //timing controller
  var controller = false;
  var canvas_emit_controller = false;

  //survey vars
  var v1 = "";
  var v2 = "";
  var v3 = "";
  var v4 = "";
  var v5 = "";
  var if_fill = true;

  var dataToServer={}

  function preloadImg(arr) {
    for (var i = 0; i < arr.length; i++) {
      imgWrap[i] = new Image();
      imgWrap[i].src = arr[i];
    }
  }

  preloadImg(imgSrcArr);

  //ms: millie seconds you want to sleep
  //usage: await sleep(sleep_time) in an async function
  //const sleep_time is defined above at the global var section
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function show_image(src, width, height, direction) {
    var img = document.createElement("img");
    img.src = src;
    switch (direction){
      case "top":
        img.style = "position: absolute; top: 100px; left: 600px;";
        break;
      case "mid_right":
        img.style = "position: absolute; top: 300px; left: 300px;";
        break;
      case "mid_left":
        img.style = "position: absolute; top: 300px; left: 900px;";
        break;
      case "bot_left":
        img.style = "position: absolute; top: 550px; left: 450px;";
        break;
      case "bot_right":
        img.style = "position: absolute; top: 550px; left: 750px;";
        break;
      case "center":
        img.style = "position: absolute; top: 350px; left: 600px;";
        break;
      case "test_pic":
        img.style = "position: absolute; top: 600px; left: 20px;";
        break;
      case "canvas":
        img.style = "position: absolute; top: 250px; left: 325px;";
        break;
      default:
        var e = new Error('image location error, please check render codes');
        throw e;
    }
    img.width = width;
    img.height = height;

    // This next line will just add it to the <div id='pic'> tag
    var pic_div = document.getElementById('pic');
    pic_div.appendChild(img);

  }

  function clean_image() {
    var div = document.getElementById('pic');
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
  }

  function get_survey_value(str){
  	var radio = document.getElementsByName(str);
  	for (i=0; i<radio.length; i++) {
  		if (radio[i].checked) {
  			return(radio[i].value)
  		}
  	}
  }

  function rand_canvas(){
    let tar_canvas = arr_c[Math.floor(Math.random() * 2)];
    // if( !canvas_emit_controller ){
    //   canvas_emit_controller = true;
    //   return;
    // }
    show_image(tar_canvas, 800, 450, 'canvas');
    let canvas_data = tar_canvas.match(/green_canvas|red_canvas/g);
    canvas_list.push(canvas_data);
  }


  async function rand_red() {
    clean_image();
    controller = false;

    if(canvas_emit_controller){
      show_image(dot, 250, 250, 'center');
      await sleep(sleep_time);

      rand_canvas();
      await sleep(2 * sleep_time);
      clean_image();
    }else{
      canvas_emit_controller = true;
    }

    show_image(dot, 250, 250, 'center');
    await sleep(sleep_time);

    clean_image();
    show_image(dot, 250, 250, 'center');

    var tar_pic = arr_r[Math.floor(Math.random() * 2)];
    var tar_loc = arr_loc[Math.floor(Math.random() * 5)];
    var temp_list = [];

    var res_data = "rand_red@" + tar_loc + "@" + tar_pic.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
    temp_list.push(res_data);

    show_image(tar_pic, 250, 250, tar_loc);
    var arr_loc_remaining = arr_loc.filter(function(value, index, arr) {
      return value != tar_loc;
    });

    for (let i = 0; i < arr_loc_remaining.length; i++) {
      var p = arr_r_remaining[Math.floor(Math.random() * 2)];
      var l = arr_loc_remaining[i];

      var temp_data = "rand_red@" + l + "@" + p.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
      temp_list.push(temp_data);

      show_image(p, 250, 250, l);
    }
    display_list.push(temp_list.sort());

    controller = true;
    createdTime = Date.now();
  }

  async function rand_green() {
    clean_image();
    controller = false;

    if(canvas_emit_controller){
      show_image(dot, 250, 250, 'center');
      await sleep(sleep_time);

      rand_canvas();
      await sleep(2 * sleep_time);
      clean_image();
    }else{
      canvas_emit_controller = true;
    }

    show_image(dot, 250, 250, 'center');
    await sleep(sleep_time);

    clean_image();
    show_image(dot, 250, 250, 'center');

    var tar_pic = arr_g[Math.floor(Math.random() * 2)];
    var tar_loc = arr_loc[Math.floor(Math.random() * 5)];
    var temp_list = [];

    var res_data = "rand_green@" +  tar_loc + "@" + tar_pic.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
    temp_list.push(res_data);

    show_image(tar_pic, 250, 250, tar_loc);
    var arr_loc_remaining = arr_loc.filter(function(value, index, arr) {
      return value != tar_loc;
    });

    for (let i = 0; i < arr_loc_remaining.length; i++) {
      var p = arr_g_remaining[Math.floor(Math.random() * 2)];
      var l = arr_loc_remaining[i];

      var temp_data = "rand_green@" + l + "@" + p.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
      temp_list.push(temp_data);

      show_image(p, 250, 250, l);
    }
    display_list.push(temp_list.sort());

    controller = true;
    createdTime = Date.now();
  }

  async function rand_red_in_green() {
    clean_image();
    controller = false;

    show_image(dot, 250, 250, 'center');
    await sleep(sleep_time);
    clean_image();

    rand_canvas();
    await sleep(2 * sleep_time);
    clean_image();

    show_image(dot, 250, 250, 'center');
    await sleep(sleep_time);

    clean_image();
    show_image(dot, 250, 250, 'center');

    var tar_pic = arr_g[Math.floor(Math.random() * 2)];
    var tar_loc = arr_loc[Math.floor(Math.random() * 5)];
    var temp_list = [];

    var res_data = "rand_red_in_green@" + tar_loc + "@" + tar_pic.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
    temp_list.push(res_data);

    show_image(tar_pic, 250, 250, tar_loc);
    var arr_loc_remaining = arr_loc.filter(function(value, index, arr) {
      return value != tar_loc;
    });

    var fake_pic = arr_r_remaining[Math.floor(Math.random() * 2)];
    var tar_loc2 = arr_loc_remaining[Math.floor(Math.random() * 4)];

    var res_data2 = "rand_red_in_green@" + tar_loc2 + "@" + fake_pic.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
    temp_list.push(res_data2);

    show_image(fake_pic, 250, 250, tar_loc2);
    var arr_loc_remaining2 = arr_loc_remaining.filter(function(value, index, arr) {
      return value != tar_loc2;
    });

    for (let i = 0; i < arr_loc_remaining2.length; i++) {
      var p = arr_g_remaining[Math.floor(Math.random() * 2)]
      var l = arr_loc_remaining2[i];

      var temp_data = "rand_red_in_green@" + l + "@" + p.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
      temp_list.push(temp_data);

      show_image(p, 250, 250, l);
    }
    display_list.push(temp_list.sort());

    controller = true;
    createdTime = Date.now();
  }

  async function rand_green_in_red() {
    clean_image();
    controller = false;
    
    show_image(dot, 250, 250, 'center');
    await sleep(sleep_time);
    clean_image();

    rand_canvas();
    await sleep(2 * sleep_time);
    clean_image();

    show_image(dot, 250, 250, 'center');
    await sleep(sleep_time);

    clean_image();
    show_image(dot, 250, 250, 'center');

    var tar_pic = arr_r[Math.floor(Math.random() * 2)];
    var tar_loc = arr_loc[Math.floor(Math.random() * 5)];
    var temp_list = [];

    var res_data = "rand_green_in_red@" + tar_loc + "@" + tar_pic.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
    temp_list.push(res_data);

    show_image(tar_pic, 250, 250, tar_loc);
    var arr_loc_remaining = arr_loc.filter(function(value, index, arr) {
      return value != tar_loc;
    });

    var fake_pic = arr_g_remaining[Math.floor(Math.random() * 2)];
    var tar_loc2 = arr_loc_remaining[Math.floor(Math.random() * 4)];

    var res_data2 = "rand_green_in_red@" + tar_loc2 + "@" + fake_pic.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
    temp_list.push(res_data2);

    show_image(fake_pic, 250, 250, tar_loc2);

    var arr_loc_remaining2 = arr_loc_remaining.filter(function(value, index, arr) {
      return value != tar_loc2;
    });

    for (let i = 0; i < arr_loc_remaining2.length; i++) {
      var p = arr_r_remaining[Math.floor(Math.random() * 2)]
      var l = arr_loc_remaining2[i];

      var temp_data = "rand_green_in_red@" + l + "@" + p.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
      temp_list.push(temp_data);

      show_image(p, 250, 250, l);
    }
    display_list.push(temp_list.sort());

    controller = true;
    createdTime = Date.now();
  }

  function demoSeparateByCanvas(){
    if ($(window).width() >= 600 & screen.width * .8 < $(window).width()) {
      $('#instructions').hide();
      $('#frame6').show();
      // Begin
      $(document).on("keypress.trialWait", PressedKey0);

      function PressedKey0(evt) {
        evt.preventDefault();
        if (evt.which == 32) {
          trial_red_or_green();
        }
      }
    }
  }


  async function trial_red_or_green() {
    $(document).off("keypress.trialWait");
    $('#frame6').hide();
    $('#hor_ver').show();

    if (Math.floor(Math.random() * 2) == 0) {
      rand_red();
    } else {
      rand_green();
    }
    document.getElementById('trialNumber').innerHTML = trial_num++;
    $('#progressReport').show();

    $(document).on("keypress.trialWait", PressedKey7);

    function PressedKey7(evt) {
      evt.preventDefault();
      if (controller & (evt.which == Lkey | evt.which == Rkey)) {
        if (index < ctr_same_color-2) {
          res = evt.which == Rkey ? "vertical" : "horizontal";
          clickedTime = Date.now();
          time = clickedTime - createdTime;
          res_list.push(res);
          res_time.push(time);
          surprise_list.push(0);

          trial_red_or_green();
          index += 1;
        } 
        else if(system_idx - 1 > 0){
          res = evt.which == Rkey ? "vertical" : "horizontal";
          clickedTime = Date.now();
          time = clickedTime - createdTime;
          res_list.push(res);
          res_time.push(time);

          $(document).off("keypress.trialWait");
          $('#frame6').hide();
          $('#hor_ver').show();

          if (Math.floor(Math.random() * 2) == 0) {
            rand_green_in_red();
          } else {
            rand_red_in_green();
          }

          document.getElementById('trialNumber').innerHTML = trial_num++;
          $(document).on("keypress.trialWait", PressedKey7_0);

          function PressedKey7_0(evt) {
            evt.preventDefault();
            if (controller & (evt.which == Lkey | evt.which == Rkey)) {
              res = evt.which == Rkey ? "vertical" : "horizontal";
              clickedTime = Date.now();
              time = clickedTime - createdTime;
              res_list.push(res);
              res_time.push(time);
              surprise_list.push(1);

              index = 0//set index back to 0 to loop whole system
              system_idx -= 1;
              trial_red_or_green();
            } 
          }
        }
        else {
          res = evt.which == Rkey ? "vertical" : "horizontal";
          clickedTime = Date.now();
          time = clickedTime - createdTime;
          res_list.push(res);
          res_time.push(time);
          surprise_list.push(1);

          $(document).off("keypress.trialWait");
          $('#frame6').hide();
          $('#hor_ver').show();

          if (Math.floor(Math.random() * 2) == 0) {
            rand_green_in_red();
          } else {
            rand_red_in_green();
          }

          document.getElementById('trialNumber').innerHTML = trial_num++;
          //$('#progressReport').show();

          $(document).on("keypress.trialWait", PressedKey7_1);

          function PressedKey7_1(evt) {
            evt.preventDefault();
            if (controller & (evt.which == Lkey | evt.which == Rkey)) {
              res = evt.which == Rkey ? "vertical" : "horizontal";
              clickedTime = Date.now();
              time = clickedTime - createdTime;
              res_list.push(res);
              res_time.push(time);
              surprise_list.push(1);

              // clear index, for other loop cases uses
              index = 0;
              save();
            }
          }
        }
      }
    }
  }

  async function save() {
    $(document).off("keypress.trialWait");
    clean_image();
    $('#hor_ver').hide();
    $('#progressReport').hide();
    $('#Survey').show();

    show_image(color_blind_test, 250, 250, 'test_pic');
    }

    function checkValue(){
      var t1 = $("input:radio[name='Gender']").is(":checked");
      var t2 = $("input:radio[name='Ethnicity']").is(":checked");
      var t3 = $("input:radio[name='Race']").is(":checked");
      var t4 = !(isNaN(document.getElementById('testNumber').value) | (document.getElementById('testNumber').value == ""));
	    var t5 = !(isNaN(document.getElementById('ageNumber').value) | (document.getElementById('ageNumber').value == ""));
	  
      v1 = get_survey_value("Gender");
      v2 = get_survey_value("Ethnicity");
      v3 = get_survey_value("Race");
      v4 = document.getElementById('testNumber').value;
      v5 = document.getElementById('ageNumber').value;
      
      if(t1 & t2 & t3 & t4 & t5){
        Saved();
      }
      else{
        alert("Please fill all forms.");
      }
    }

  function Saved(){
    clean_image();
    $('#submitButton').hide();
    $('#Survey').hide();
    $('#done').show();
    SendToServer();
  }

  /* Send the data to the server as JSON: */
function SendToServer() {
	var curr_date = new Date();
	var curID = getParameterByName("id");
	dataToServer = {
	  'date': curr_date,
	  'result_list': JSON.stringify(res_list),
	  'result_time': JSON.stringify(res_time),
	  'display_info': JSON.stringify(display_list),
    'canvas_info': JSON.stringify(canvas_list),
	  'gender': v1,
	  'ethnicity': v2,
	  'race': v3,
	  'result_color_blind_test': (v4==8),
	  'number_color_blind_test': v4,
	  'age': v5,
	  'curID': curID,
	};
	var d = {
	  'id': getParameterByName("id"),
	  'experimenter': 'Kirsten',
	  'experimentName': 'ReactionTimeSepByCanvas',
	  'curData': JSON.stringify(dataToServer)
	};
	// $.post("http://serenceslab.ucsd.edu/experiments/RT_Exp/save.php",
	//   d,
	//   function(data) {
	// 	/* Get this from SONA by looking for the Completion URL (client-side) on SONA after creating an online SONA study: */
	// 	window.location = "https://ucsd.sona-systems.com/webstudy_credit.aspx?experiment_id=1661&credit_token=ab4560d23b684ec89438a7ec6fcee9b5&survey_code=" + getParameterByName("id");
	// 	console.log("Saved!");
	//   }
	// ).fail(function(data) {
	// 	/* Get this from SONA by looking for the Completion URL (client-side) on SONA after creating an online SONA study: */
	// 	window.location = "https://ucsd.sona-systems.com/webstudy_credit.aspx?experiment_id=1661&credit_token=ab4560d23b684ec89438a7ec6fcee9b5&survey_code=" + getParameterByName("id");
	// 	console.log("not saved!");
	// });

  //test logging
  console.log(d);
}
  
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
       name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2]);
}