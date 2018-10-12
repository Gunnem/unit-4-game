var chosenChar = false;
var fightRound = 0;
var hp = 0;
var baseAttack = 0;
var attackPwr = 0;
var counterPwr = 0;
var oppHp = 0;


function resetPoints() {
  hp = $("#yourChar").children().children("h5").data("health-points");
  baseAttack = $("#yourChar").children().children("h5").data("base-attack-power");
  attackPwr = $("#yourChar").children().children("h5").data("attack-power");
  counterPwr = $("#oppChar").children().children("h5").data("counter-attack-power");
  oppHp = $("#oppChar").children().children("h5").data("health-points");
}

function displayHealthPoints() {
  $("#textResultCtnr").html("<div id=\"textResult\">"+"Your health is "+hp+
  "</div><div id=\"textResult\">"+"Enemy health is "+oppHp+"</div>"+ "<br>"+
  "<div id=\"textResult\">"+"Your attack power is "+baseAttack+"</div>" +
  "<div id=\"textResult\">"+"Enemy counter attack power is "+counterPwr+"</div>");

  $("#yourChar").children().children("div.card-body").children(".card-text").text(hp + " Health Points");
  $("#oppChar").children().children("div.card-body").children(".card-text").text(oppHp + " Health Points");
}

function logEveryonesHealth() {
  console.log("Your health is " + hp);
  console.log("Your Base Attack Power is " + baseAttack);
  console.log("Enemy Attack Power is " + counterPwr);
  console.log("Enemy Health Power is " + oppHp);
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
  if (oppHp <= 0) {
    //Enemy has lost

    var lastEnemyName = $("#oppChar").children().children("h5").text();
    $("#oppChar").children().remove();

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
  else if (hp <= 0) {
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

  $("#yourChar").children().children("h5").data("health-points", hp - counterPwr);
  $("#oppChar").children().children("h5").data("health-points", oppHp - baseAttack);
  $("#yourChar").children().children("h5").data("base-attack-power", baseAttack + attackPwr);

  resetPoints();

  console.log("************ After deduction ***************");

  logEveryonesHealth();
  displayHealthPoints(hp,oppHp);

  isGameOver();
}

$("a").on("click", function(event) {

  var currentContainer = $(this).parent().parent();
  if (!chosenChar) {
    //choosing your character
    $(this).toggleClass("disabled", true);
    currentContainer.removeClass("backstage");
    resizeContainers(currentContainer,"col-xs-3","col-xs-4")
    $("#yourChar").append(currentContainer);
    $("#titleLetter").text("Choose enemy character");
    resizeContainers($(".backstage"),"col-xs-3","col-xs-4");
    $(this).replaceWith('<div id="yourCharLabel">Your Character<div>');
    chosenChar = true;
  } else {
    //choosing enemy character
    $(this).toggleClass("disabled", true);
    currentContainer.removeClass("backstage");
    if (fightRound == 0) {
      $("#oppChar").append(currentContainer);
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
      $("#oppChar").append(currentContainer);
      resetPoints();
      displayHealthPoints();
    } else if (fightRound == 2) {
      toggleFightBtn(false);
      resizeContainers(currentContainer,"col-xs-12","col-xs-4")
      $("#oppChar").append(currentContainer);
      resetPoints();
      displayHealthPoints();
    }
    $(this).replaceWith('<div id="oppCharLabel">Your Enemy<div>');
    $(".backstage a").toggleClass("disabled", true);
  }
});