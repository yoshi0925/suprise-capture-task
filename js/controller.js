// Global variables
  // vars not defined from imported js
  var isTrain = 0;
  var isTest = 0;
  var moveLast = 0;
  function endTime(){
    return 160;
  }
  var currProbe = 1;

  const L_KEY = 122;
  const R_KEY = 109;
  const placeHolderKey = 45; // the `ins` key, use to hack the 3-sec constraint
  var timeToRespond = false; //this indicates whether or not the subject is allowed to respond with 'same' or 'different'
  var timeToMoveOn = true; //this indicates whether or not the subject is allowed to move on to the next trial

  const GREEN_CIRCLE_HOR = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/green_circle_hor.png";
  const GREEN_CIRCLE_VER = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/green_circle_ver.png";
  const GREEN_REC_HOR = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/green_rec_hor.png";
  const GREEN_REC_VER = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/green_rec_ver.png";
  const RED_CIRCLE_HOR = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/red_circle_hor.png";
  const RED_CIRCLE_VER = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/red_circle_ver.png";
  const RED_REC_HOR = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/red_rec_hor.png";
  const RED_REC_VER = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/red_rec_ver.png";
  const GREEN_CANVAS = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/green_canvas.png";
  const RED_CANVAS = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/red_canvas.png";
  const DOT = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/dot.png";
  const COLOR_BLIND_TEST = "https://raw.githubusercontent.com/yoshi0925/suprise-capture-task/master/image/colorblind-test.jpg";

  const GREEN_ARRAY = [GREEN_REC_HOR, GREEN_REC_VER];
  const RED_ARRAY = [RED_REC_HOR, RED_REC_VER];
  const CANVAS_ARRAY = [GREEN_CANVAS, RED_CANVAS];

  const SLEEP_TIME = 1000;

  const LOCATION_ARRAY = ['top', 'mid_left', 'mid_right', 'bot_left', 'bot_right'];

  const GREEN_ARRAY_REMAINING = [GREEN_CIRCLE_VER, GREEN_CIRCLE_HOR];
  const RED_ARRAY_REMAINING = [RED_CIRCLE_VER, RED_CIRCLE_HOR];

  // same color mode run 50 times
  const SAME_COLOR_CTR = 2;
  var trialNumber = 1;
  var systemIndex = 4; 

  //display_list to save the generated answere, res_list is the human answer
  var resultResponse = [];
  var resultTime = [];
  var displayInfo = [];
  var canvasInfo = [];
  var surpriseInfo = [];
  var res = "";

  var index = 0;

  // flags for random cases organization
  var greenFlag = false;
  var redFlag = false;
  var mixFlag = false;

  // preload the images
  const IMAGE_ARR = [
    GREEN_CIRCLE_HOR,
    GREEN_CIRCLE_VER,
    GREEN_REC_HOR,
    GREEN_REC_VER,
    RED_CIRCLE_HOR,
    RED_CIRCLE_VER,
    RED_REC_HOR,
    RED_REC_VER,
    RED_CANVAS,
    GREEN_CANVAS,
    DOT,
    COLOR_BLIND_TEST
  ];

  var createdTime = 0;
  var clickedTime = 0;

  var imgWrap = [];

  //timing controller
  var controller = false;
  var canvasIgnore = -2;

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

  preloadImg(IMAGE_ARR);

  //ms: millie seconds you want to sleep
  //usage: await sleep(sleep_time) in an async function
  //const sleep_time is defined above at the global var section
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function showImage(src, width, height, direction) {
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

  function cleanImage() {
    var div = document.getElementById('pic');
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
  }

  function getValueFromSurvey(str){
  	var radio = document.getElementsByName(str);
  	for (i=0; i<radio.length; i++) {
  		if (radio[i].checked) {
  			return(radio[i].value)
  		}
  	}
  }

  function generateCanvas(){
    let tar_canvas = CANVAS_ARRAY[Math.floor(Math.random() * 2)];
    // if( !canvas_emit_controller ){
    //   canvas_emit_controller = true;
    //   return;
    // }
    showImage(tar_canvas, 800, 450, 'canvas');
    let canvas_data = tar_canvas.match(/green_canvas|red_canvas/g);
    canvasInfo.push(canvas_data[0]);
  }

  async function showCanvas(){
    if(canvasIgnore>=0){
        showImage(DOT, 250, 250, 'center');
        await sleep(SLEEP_TIME);
  
        generateCanvas();
        await sleep(2 * SLEEP_TIME);
        cleanImage();
      }else{
        canvasIgnore++;
      }
  
      showImage(DOT, 250, 250, 'center');
      await sleep(SLEEP_TIME);
  
      showImage(DOT, 250, 250, 'center');
  }
  async function generateRed() {
    cleanImage();
    controller = false;

    await showCanvas();

    var tar_pic = RED_ARRAY[Math.floor(Math.random() * 2)];
    var tar_loc = LOCATION_ARRAY[Math.floor(Math.random() * 5)];
    var temp_list = [];

    var res_data = "rand_red@" + tar_loc + "@" + tar_pic.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
    temp_list.push(res_data);

    showImage(tar_pic, 250, 250, tar_loc);
    var arr_loc_remaining = LOCATION_ARRAY.filter(function(value, index, arr) {
      return value != tar_loc;
    });

    for (let i = 0; i < arr_loc_remaining.length; i++) {
      var p = RED_ARRAY_REMAINING[Math.floor(Math.random() * 2)];
      var l = arr_loc_remaining[i];

      var temp_data = "rand_red@" + l + "@" + p.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
      temp_list.push(temp_data);

      showImage(p, 250, 250, l);
    }
    displayInfo.push(temp_list.sort());

    controller = true;
    createdTime = Date.now();
  }

  async function generateGreen() {
    cleanImage();
    controller = false;

    await showCanvas();

    var tar_pic = GREEN_ARRAY[Math.floor(Math.random() * 2)];
    var tar_loc = LOCATION_ARRAY[Math.floor(Math.random() * 5)];
    var temp_list = [];

    var res_data = "rand_green@" +  tar_loc + "@" + tar_pic.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
    temp_list.push(res_data);

    showImage(tar_pic, 250, 250, tar_loc);
    var arr_loc_remaining = LOCATION_ARRAY.filter(function(value, index, arr) {
      return value != tar_loc;
    });

    for (let i = 0; i < arr_loc_remaining.length; i++) {
      var p = GREEN_ARRAY_REMAINING[Math.floor(Math.random() * 2)];
      var l = arr_loc_remaining[i];

      var temp_data = "rand_green@" + l + "@" + p.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
      temp_list.push(temp_data);

      showImage(p, 250, 250, l);
    }
    displayInfo.push(temp_list.sort());

    controller = true;
    createdTime = Date.now();
  }

  async function generateRedInGreen() {
    cleanImage();
    controller = false;

    await showCanvas();

    var tar_pic = GREEN_ARRAY[Math.floor(Math.random() * 2)];
    var tar_loc = LOCATION_ARRAY[Math.floor(Math.random() * 5)];
    var temp_list = [];

    var res_data = "rand_red_in_green@" + tar_loc + "@" + tar_pic.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
    temp_list.push(res_data);

    showImage(tar_pic, 250, 250, tar_loc);
    var arr_loc_remaining = LOCATION_ARRAY.filter(function(value, index, arr) {
      return value != tar_loc;
    });

    var fake_pic = RED_ARRAY_REMAINING[Math.floor(Math.random() * 2)];
    var tar_loc2 = arr_loc_remaining[Math.floor(Math.random() * 4)];

    var res_data2 = "rand_red_in_green@" + tar_loc2 + "@" + fake_pic.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
    temp_list.push(res_data2);

    showImage(fake_pic, 250, 250, tar_loc2);
    var arr_loc_remaining2 = arr_loc_remaining.filter(function(value, index, arr) {
      return value != tar_loc2;
    });

    for (let i = 0; i < arr_loc_remaining2.length; i++) {
      var p = GREEN_ARRAY_REMAINING[Math.floor(Math.random() * 2)]
      var l = arr_loc_remaining2[i];

      var temp_data = "rand_red_in_green@" + l + "@" + p.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
      temp_list.push(temp_data);

      showImage(p, 250, 250, l);
    }
    displayInfo.push(temp_list.sort());

    controller = true;
    createdTime = Date.now();
  }

  async function generateGreenInRed() {
    cleanImage();
    controller = false;
    
    await showCanvas();

    var tar_pic = RED_ARRAY[Math.floor(Math.random() * 2)];
    var tar_loc = LOCATION_ARRAY[Math.floor(Math.random() * 5)];
    var temp_list = [];

    var res_data = "rand_green_in_red@" + tar_loc + "@" + tar_pic.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
    temp_list.push(res_data);

    showImage(tar_pic, 250, 250, tar_loc);
    var arr_loc_remaining = LOCATION_ARRAY.filter(function(value, index, arr) {
      return value != tar_loc;
    });

    var fake_pic = GREEN_ARRAY_REMAINING[Math.floor(Math.random() * 2)];
    var tar_loc2 = arr_loc_remaining[Math.floor(Math.random() * 4)];

    var res_data2 = "rand_green_in_red@" + tar_loc2 + "@" + fake_pic.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
    temp_list.push(res_data2);

    showImage(fake_pic, 250, 250, tar_loc2);

    var arr_loc_remaining2 = arr_loc_remaining.filter(function(value, index, arr) {
      return value != tar_loc2;
    });

    for (let i = 0; i < arr_loc_remaining2.length; i++) {
      var p = RED_ARRAY_REMAINING[Math.floor(Math.random() * 2)]
      var l = arr_loc_remaining2[i];

      var temp_data = "rand_green_in_red@" + l + "@" + p.match(/green_circle_hor|green_circle_ver|green_rec_hor|green_rec_ver|red_circle_hor|red_circle_ver|red_rec_hor|red_rec_ver/g);
      temp_list.push(temp_data);

      showImage(p, 250, 250, l);
    }
    displayInfo.push(temp_list.sort());

    controller = true;
    createdTime = Date.now();
  }
  function tutorialStart() {
    if ($(window).width() >= 600 & screen.width * .8 < $(window).width()) {
      $('#instructions').hide();
      $('#frame1').show();
      // Begin
      $(document).on("keypress.trialWait", PressedKey1);
      function PressedKey1(evt) {
        evt.preventDefault();
        if (evt.which == 32) {
          tutorialRemainder();
        }
      }
    }
  }
  var index = 0;

  function tutorialRemainder(){
    $('#frame1').hide();
    $('#remainder').show();
      // Begin
    $(document).on("keypress.trialWait", PressedKey1);
    function PressedKey1(evt) {
      evt.preventDefault();
      if (evt.which == 32) {
        tutorialRed();
      }
    }
  }

  //one red
  function tutorialRed() {
    $(document).off("keypress.trialWait");
    $('#remainder').hide();
    $('#frame2').show();
    generateRed();
    $(document).on("keypress.trialWait", PressedKey4);
    function PressedKey4(evt) {
      evt.preventDefault();
      if (controller & (evt.which == L_KEY | evt.which == R_KEY)) {
        tutorialGreen();
      }
    }
  }
  //one green
  function tutorialGreen() {
    $(document).off("keypress.trialWait");
    $('#frame2').hide();
    $('#frame3').show();
    generateGreen();
    $(document).on("keypress.trialWait", PressedKey5);
    function PressedKey5(evt) {
      evt.preventDefault();
      if (controller & (evt.which == L_KEY | evt.which == R_KEY)) {
        demoSeparateByCanvas();
      }
    }
  }

  function demoSeparateByCanvas(){
    $('#instructions').hide();
    $('#frame6').show();
    $('#frame2').hide();
    $('#frame3').hide();
    cleanImage();
    // Begin
    $(document).on("keypress.trialWait", PressedKey0);

    function PressedKey0(evt) {
      evt.preventDefault();
      if (evt.which == 32) {
        startTrailRedOrGreen();
      }
    }
  }


  async function startTrailRedOrGreen() {
    $(document).off("keypress.trialWait");
    $('#frame6').hide();
    $('#hor_ver').show();

    if (Math.floor(Math.random() * 2) == 0) {
      generateRed();
    } else {
      generateGreen();
    }
    document.getElementById('trialNumber').innerHTML = trialNumber++;
    $('#progressReport').show();

    $(document).on("keypress.trialWait", PressedKey7);

    function PressedKey7(evt) {
      evt.preventDefault();
      if (controller & (evt.which == L_KEY | evt.which == R_KEY)) {
        if (index < SAME_COLOR_CTR-2) {
          saveData(evt, 0);

          startTrailRedOrGreen();
          index += 1;
        } 
        else if(systemIndex - 1 > 0){
          saveData(evt, 0)

          $(document).off("keypress.trialWait");
          $('#frame6').hide();
          $('#hor_ver').show();

          if (Math.floor(Math.random() * 2) == 0) {
            generateGreenInRed();
          } else {
            generateRedInGreen();
          }

          document.getElementById('trialNumber').innerHTML = trialNumber++;
          $(document).on("keypress.trialWait", PressedKey7_0);

          function PressedKey7_0(evt) {
            evt.preventDefault();
            if (controller & (evt.which == L_KEY | evt.which == R_KEY)) {
              saveData(evt, 1)

              index = 0//set index back to 0 to loop whole system
              systemIndex -= 1;
              startTrailRedOrGreen();
            } 
          }
        }
        else {
          saveData(evt, 1);

          $(document).off("keypress.trialWait");
          $('#frame6').hide();
          $('#hor_ver').show();

          if (Math.floor(Math.random() * 2) == 0) {
            generateGreenInRed();
          } else {
            generateRedInGreen();
          }

          document.getElementById('trialNumber').innerHTML = trialNumber++;
          //$('#progressReport').show();

          $(document).on("keypress.trialWait", PressedKey7_1);

          function PressedKey7_1(evt) {
            evt.preventDefault();
            if (controller & (evt.which == L_KEY | evt.which == R_KEY)) {
              saveData(evt, 1);

              // clear index, for other loop cases uses
              index = 0;
              showSurvey();
            }
          }
        }
      }
    }

      function saveData(evt, surprise) {
          res = evt.which == R_KEY ? "vertical" : "horizontal";
          clickedTime = Date.now();
          time = clickedTime - createdTime;
          resultResponse.push(res);
          resultTime.push(time);
          surpriseInfo.push(surprise);
      }
  }

  async function showSurvey() {
    $(document).off("keypress.trialWait");
    cleanImage();
    $('#hor_ver').hide();
    $('#progressReport').hide();
    $('#Survey').show();

    showImage(COLOR_BLIND_TEST, 250, 250, 'test_pic');
    }

    function checkSurveyValue(){
      var t1 = $("input:radio[name='Gender']").is(":checked");
      var t2 = $("input:radio[name='Ethnicity']").is(":checked");
      var t3 = $("input:radio[name='Race']").is(":checked");
      var t4 = !(isNaN(document.getElementById('testNumber').value) | (document.getElementById('testNumber').value == ""));
	    var t5 = !(isNaN(document.getElementById('ageNumber').value) | (document.getElementById('ageNumber').value == ""));
	  
      v1 = getValueFromSurvey("Gender");
      v2 = getValueFromSurvey("Ethnicity");
      v3 = getValueFromSurvey("Race");
      v4 = document.getElementById('testNumber').value;
      v5 = document.getElementById('ageNumber').value;
      
      if(t1 & t2 & t3 & t4 & t5){
        endAndSend();
      }
      else{
        alert("Please fill all forms.");
      }
    }

  function endAndSend(){
    cleanImage();
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
	  'result_list': JSON.stringify(resultResponse),
	  'result_time': JSON.stringify(resultTime),
	  'display_info': JSON.stringify(displayInfo),
      'canvas_info': JSON.stringify(canvasInfo.unshift("no_canvas_at_beginning").unshift("no_canvas_at_beginning")),
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