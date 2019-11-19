  function tutorial_1() {
    if ($(window).width() >= 600 & screen.width * .8 < $(window).width()) {
      $('#instructions').hide();
      $('#frame1').show();
      // Begin
      $(document).on("keypress.trialWait", PressedKey1);
      function PressedKey1(evt) {
        evt.preventDefault();
        if (evt.which == 32) {
          var redirect = Math.floor(Math.random() * 100);
          if (redirect >= 0 & redirect <= 24) { //pure green 25%
            g_flag = true;
            tutorial_2();
          } else if (redirect >= 25 & redirect <= 49) { //pure red 25%
            r_flag = true;
            tutorial_3();
          } else { //red_in_green + green_in_red 50%
            mix_flag = true;
            tutorial_4();
          }
        }
      }
    }
  }
  var index = 0;
  //pure green
  function tutorial_2() {
    $(document).off("keypress.trialWait");
    $('#frame1').hide();
    $('#frame2').show();
    rand_green();
    $(document).on("keypress.trialWait", PressedKey2);
    function PressedKey2(evt) {
      evt.preventDefault();
      if (controller & (evt.which == Lkey | evt.which == Rkey)) {
        tutorial_6();
      }
    }
  }
  //pure red
  function tutorial_3() {
    $(document).off("keypress.trialWait");
    $('#frame1').hide();
    $('#frame3').show();
    rand_red();
    $(document).on("keypress.trialWait", PressedKey3);
    function PressedKey3(evt) {
      evt.preventDefault();
      if (controller & (evt.which == Lkey | evt.which == Rkey)) {
        tutorial_6();
      }
    }
  }
  //one red
  function tutorial_4() {
    $(document).off("keypress.trialWait");
    $('#frame1').hide();
    $('#frame3').show();
    rand_red();
    $(document).on("keypress.trialWait", PressedKey4);
    function PressedKey4(evt) {
      evt.preventDefault();
      if (controller & (evt.which == Lkey | evt.which == Rkey)) {
        tutorial_5();
      }
    }
  }
  //one green
  function tutorial_5() {
    $(document).off("keypress.trialWait");
    $('#frame3').hide();
    $('#frame2').show();
    rand_green();
    $(document).on("keypress.trialWait", PressedKey5);
    function PressedKey5(evt) {
      evt.preventDefault();
      if (controller & (evt.which == Lkey | evt.which == Rkey)) {
        tutorial_6();
      }
    }
  }
  function tutorial_6() {
    $(document).off("keypress.trialWait");
    if (g_flag) {
      $('#frame2').hide();
    }
    if (r_flag) {
      $('#frame3').hide();
    }
    if (mix_flag) {
      $('#frame2').hide();
    }
    clean_image();
    $('#frame6').show();
    $(document).on("keypress.trialWait", PressedKey6);
    function PressedKey6(evt) {
      evt.preventDefault();
      display_list = []
      if (evt.which == 32) {
        if (g_flag) {
          trial_pure_green();
        } else if (r_flag) {
          trial_pure_red();
        } else {
          trial_red_or_green();
        }
      }
    }
  }