var yourCharChosen = false;
var fightRound = 0;
var urHP = 0;
var urBaseAttackPwr = 0;
var urAttackPwr = 0;
var enemyCntrAttackPwr = 0;
var enemyHP = 0;

// TO DO

// 1. Modularize the code
// 2. Add to Portfolio

function resetPoints() {
  urHP = $("#urCharacter").children().children("h5").data("health-points");
  urBaseAttackPwr = $("#urCharacter").children().children("h5").data("base-attack-power");
  urAttackPwr = $("#urCharacter").children().children("h5").data("attack-power");
  enemyCntrAttackPwr = $("#enemyCharacter").children().children("h5").data("counter-attack-power");
  enemyHP = $("#enemyCharacter").children().children("h5").data("health-points");
}

function displayHealthPoints() {
  $("#textResultCtnr").html("<div id=\"textResult\">"+"Your health is "+urHP+
  "</div><div id=\"textResult\">"+"Enemy health is "+enemyHP+"</div>"+ "<br>"+
  "<div id=\"textResult\">"+"Your attack power is "+urBaseAttackPwr+"</div>" +
  "<div id=\"textResult\">"+"Enemy counter attack power is "+enemyCntrAttackPwr+"</div>");

  $("#urCharacter").children().children("div.card-body").children(".card-text").text(urHP + " Health Points");
  $("#enemyCharacter").children().children("div.card-body").children(".card-text").text(enemyHP + " Health Points");


}

function logEveryonesHealth() {
  console.log("Your health is " + urHP);
  console.log("Your Base Attack Power is " + urBaseAttackPwr);
  console.log("Enemy Attack Power is " + enemyCntrAttackPwr);
  console.log("Enemy Health Power is " + enemyHP);
}

function toggleFightBtn(isOn) {
  if(isOn) {
    $("#fytBtn").attr("disabled", "disabled");
    $("#fytBtn").toggleClass("disabled", true);
  } else {
    $("#fytBtn").removeAttr("disabled");
    $("#fytBtn").toggleClass("disabled");
  }
}

function updateScoreBoard(result,lastEnemyName){
  if(result==="won") {
    $("#textResultCtnr").html("<div id=\"textResult\">You have defeated "+ lastEnemyName +"</div>"+
      "</div><div id=\"textResult\">Game Over!! You have Won!!</div><br>"+
      "<button id=\"newGameBtn\" class=\"btn btn-primary\">"+"New Game</button>");
  } else if(result==="lost") {
    $("#textResultCtnr").html("<div id=\"textResult\">You have lost</div>"+
    "<button id=\"newGameBtn\" class=\"btn btn-primary\">"+"New Game</button>");
  } else {
    $("#textResultCtnr").html("<div id=\"textResult\">You have defeated "+ lastEnemyName +"</div>"+
      "</div><div id=\"textResult\">Choose your next enemy</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div>");
  }
}

function addNewGameEvent() {
  $("#newGameBtn").on("click", function(){
    window.location.reload();
  });
}

function isGameOver() {
  if (enemyHP <= 0) {
    //Enemy has lost

    var lastEnemyName = $("#enemyCharacter").children().children("h5").text();
    $("#enemyCharacter").children().remove();

      if(fightRound<2) {
        updateScoreBoard("inprogress",lastEnemyName);
      }
      else {
       updateScoreBoard("won",lastEnemyName);
       addNewGameEvent();
      }
      $(".backstage a").toggleClass("disabled", false);
      toggleFightBtn(true);
      fightRound++;
  }
  else if (urHP <= 0) {
    //You have lost
    updateScoreBoard("lost",lastEnemyName);
    addNewGameEvent();
    toggleFightBtn(true);
  }
}

function resizeContainers(elem, from, to) {
  return elem.removeClass(from).addClass(to);
}

function fight() {

  console.log("************ Before deduction ***************");
  logEveryonesHealth();

  $("#urCharacter").children().children("h5").data("health-points", urHP - enemyCntrAttackPwr);
  $("#enemyCharacter").children().children("h5").data("health-points", enemyHP - urBaseAttackPwr);
  $("#urCharacter").children().children("h5").data("base-attack-power", urBaseAttackPwr + urAttackPwr);

  resetPoints();

  console.log("************ After deduction ***************");

  logEveryonesHealth();
  displayHealthPoints(urHP,enemyHP);

  isGameOver();
}

$("a").on("click", function(event) {

  var currentContainer = $(this).parent().parent();
  if (!yourCharChosen) {
    //choosing your character
    $(this).toggleClass("disabled", true);
    currentContainer.removeClass("backstage");
    resizeContainers(currentContainer,"col-xs-3","col-xs-4")
    $("#urCharacter").append(currentContainer);
    $("#titleLetter").text("Choose enemy character");
    resizeContainers($(".backstage"),"col-xs-3","col-xs-4");
    $(this).replaceWith('<div id="urCharacterLabel">Your Character<div>');
    yourCharChosen = true;
  } else {
    //choosing enemy character
    $(this).toggleClass("disabled", true);
    currentContainer.removeClass("backstage");
    if (fightRound == 0) {
      $("#enemyCharacter").append(currentContainer);
      resizeContainers($(".backstage"),"col-xs-4", "col-xs-6");
      $("#fytBtnCtnr").append(
        '<button id="fytBtn" class="btn btn-danger">Fight</button>'
      );
      $("button#fytBtn").on("click", function() {
        fight();
      });
      $("#titleLetter").text("Fight!");
      resetPoints();
      displayHealthPoints();
    } else if (fightRound == 1) {
      toggleFightBtn(false);
      resizeContainers($(".backstage"),"col-xs-6","col-xs-12");
      resizeContainers(currentContainer,"col-xs-6","col-xs-4")
      $("#enemyCharacter").append(currentContainer);
      resetPoints();
      displayHealthPoints();
    } else if (fightRound == 2) {
      toggleFightBtn(false);
      resizeContainers(currentContainer,"col-xs-12","col-xs-4")
      $("#enemyCharacter").append(currentContainer);
      resetPoints();
      displayHealthPoints();
    }
    $(this).replaceWith('<div id="enemyCharacterLabel">Your Enemy<div>');
    $(".backstage a").toggleClass("disabled", true);
  }
});