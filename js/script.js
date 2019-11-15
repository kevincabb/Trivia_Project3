
//-----Global variables----//
let mode = "easy";
let scoreCount = 0;
let correctAns = 0;
let totalQuestions = 20;

//-----Grab start button and set event listener----//
let startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', function (e) {
    loadHTML('../pages/menu.html');
});

//-----Function to load and inject different HTML pages----//
function loadHTML(url) {
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //when Injecting HTML, you do't need a JSON.parse
            let myArr = this.responseText;
            //conditional statement to load the proper page items

            if (url == '../pages/menu.html') {
                loadMenuPage(myArr);
            }
            else if (url == '../pages/options.html') {
                loadOptionPage(myArr);
            }
            else if (url == '../pages/game.html') {
                loadGamePage(myArr);
            }
            else if (url == '../pages/results.html') {
                loadResultsPage(myArr);
            }
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//-----Function to load Menu page----//
function loadMenuPage(info) {
    inject.innerHTML = info;

    let optionBtn = document.getElementById('optionBtn');
    let playBtn = document.getElementById('playBtn');


    optionBtn.addEventListener('click', function (e) {
        loadHTML('../pages/options.html');
    });

    playBtn.addEventListener('click', function (e) {
        loadHTML('../pages/game.html');
        scoreCount = 0;
        correctAns = 0;
    });

}

//-----Function to load Option page----//
function loadOptionPage(info) {
    inject.innerHTML = info;
    let backToMenu = document.getElementById('backOpBtn');
    backToMenu.addEventListener('click', function(e){
        loadHTML("../pages/menu.html");
    });
    
    let easy = document.getElementById('easy');
    let medium = document.getElementById('medium');
    let hard = document.getElementById('hard');

    //event listeners to change game difficulty
    easy.addEventListener('click', function (e) {
        mode = "easy";
    });

    medium.addEventListener('click', function (e) {
        mode = "medium";
    }); 

    hard.addEventListener('click', function (e) {
        mode = "hard";
    });    

    
}

//-----Function to load Result page----//
function loadResultsPage(info) {
    inject.innerHTML = info;

    //Set local variables
    let result = document.getElementById('result')
    let result2 = document.getElementById('result2');
    let playABtn = document.getElementById('playABtn');
    let menuBtn = document.getElementById('menuBtn');

    //Change results inner text
    result.innerText = `Score: ${scoreCount}`;
    result2.innerText = "Percent Correct: " + (correctAns / totalQuestions) * 100 + " %";

    //Event listener to restart game
    playABtn.addEventListener('click', function (e) {
        loadHTML('../pages/game.html');
        scoreCount = 0;
        correctAns = 0;
    });

    //Event listener to go back to Menu page
    menuBtn.addEventListener('click', function (e) {
        loadHTML('../pages/menu.html');
    });
}

//-----Function to load Game page----//
function loadGamePage(info) {
    inject.innerHTML = info;

    //set running timer
    let time = setInterval(checkTime, 1000);

    //Declare local varibles
    let questionObj = [];
    console.log(questionObj);
    let count = 0;
    let qNum = 0;
    let triviaTimer = 15;

    //Grab DOM elements
    let questionText = document.getElementById('question');
    let aText = document.getElementById('aBtn');
    let bText = document.getElementById('bBtn');
    let cText = document.getElementById('cBtn');
    let dText = document.getElementById('dBtn');
    let btns = document.getElementsByClassName('answerBtn');
    let bonus = document.getElementById('bonus');
    let score = document.getElementById('score');
    let next = document.getElementById('nextBtn');
    let timer = document.getElementById('timer');
    let backMoBtn = document.getElementById('backMoBtn').addEventListener('click', function(e){
        loadHTML('../pages/menu.html');
    });

    //Load JSON file
    function loadJSON() {
        let xmlhttp = new XMLHttpRequest();
        url = "../data/data.json";

        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let myArr = JSON.parse(this.responseText);
                questions(myArr);
                displayQuestions();
                setTriviaTimer();
                next.disabled = true;

            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    //Grab the questions and push to new questions array
    function questions(info) {
        let arrayLength = 50;
        for (let i = 0; i < totalQuestions; i++) {
            randomNum(arrayLength);
            questionObj.push(info.questions[ranNum]);
            info.questions.splice(ranNum, 1);
            arrayLength--;
        }
    }

    //function for a random position
    function randomNum(arrLength) {
        ranNum = Math.floor(Math.random() * arrLength);
    }

    //function to handle displaying questions and answers to the screen
    function displayQuestions() {
        questionText.innerText = questionObj[qNum].q;
        aText.innerText = questionObj[qNum].a1;
        bText.innerText = questionObj[qNum].a2;
        cText.innerText = questionObj[qNum].a3;
        dText.innerText = questionObj[qNum].a4;
    }

    //function to set timer
    function checkTime() {
        if (triviaTimer >= 0) {
            timer.innerText = `Timer: ${triviaTimer--}`;
        } else {
            aText.disabled = true;
            bText.disabled = true;
            cText.disabled = true;
            dText.disabled = true;
            next.disabled = false;
        }
    }

    //function to stop stimer
    function stop() {
        clearInterval(time);
    }

    //function to 
    function setTriviaTimer() {
        if (mode == "easy") {
            triviaTimer = 15;
        }
        else if (mode == "medium") {
            triviaTimer = 10;
        }
        else {
            triviaTimer = 5;
        }
    }


    //event listener to display next set of questions
    next.addEventListener('click', function (e) {
        stop(time);

        //If cycled through all questions, load the results page
        if (qNum >= 19) {
            loadHTML('../pages/results.html');
        }

        //If timer seconds is LESS/EQUAL to 0, then add -3 or -1 to score
        if (triviaTimer <= 0) {

            //If bonus is currently active, score accordingly
            if (count > 2) {
                scoreCount -= 3;
                score.innerText = `Score: ${scoreCount}`;
                bonus.innerText = "Bonus: Off";
            }
            else {
                scoreCount -= 1
                score.innerText = `Score: ${scoreCount}`;
            }

            //Re-set bonus counter after Incorrect answer is given
            count = 0;
        }

        //Enable Answer buttons for next set, also Disable Next button for next set
        aText.disabled = false;
        bText.disabled = false;
        cText.disabled = false;
        dText.disabled = false;
        next.disabled = true;

        //If there is another set of question/answers, display them
        if (qNum < 20) {
            qNum++;
            displayQuestions();
        }

        //Re-set time for the timer, AND re-set setInterval so timer will count down on next set
        setTriviaTimer();
        time = setInterval(checkTime, 1000);
    });

    //Event listener that grabs all the answer buttons and checks the for correct answer
    for (let i = 0; i < btns.length; i++) {
        //This will cycle through all the buttons
        btns[i].addEventListener('click', function (e) {

            //Stops timer and deletes setInterval
            stop(time);

            //Checks if button clicked is the correct answer
            if (btns[i].innerText == questionObj[qNum].correct) {
                btns[i].innerText = "correct";
                correctAns += 1;
                aText.disabled = true;
                bText.disabled = true;
                cText.disabled = true;
                dText.disabled = true;
                next.disabled = false;

                //If bonus is active add +3 to score ELSE add +1 to score
                if (count > 2) {
                    scoreCount += 3;
                    score.innerText = `Score: ${scoreCount}`;
                    count = 0;
                }
                else {
                    scoreCount += 1
                    score.innerText = `Score: ${scoreCount}`;
                    count += 1;
                }

                //If count EQUALS 3, turn bonus notification to ON; ELSE turn to OFF
                if (count == 3) {
                    bonus.innerText = "Bonus: ON";
                }
                else {
                    bonus.innerText = "Bonus: Off";
                }
            }

            //Checks if button clicked is the incorrect answer
            else {
                btns[i].innerText = "incorrect";
                aText.disabled = true;
                bText.disabled = true;
                cText.disabled = true;
                dText.disabled = true;
                next.disabled = false;

                //If bonus is active add -3 to score ELSE add -1 to score
                if (count > 2) {
                    scoreCount -= 3;
                    score.innerText = `Score: ${scoreCount}`;
                    bonus.innerText = "Bonus: Off";
                }
                else {
                    scoreCount -= 1
                    score.innerText = `Score: ${scoreCount}`;
                }

                //If given the wrong answer re-set bonus count to 0
                count = 0;
            }
        });
    }

    //Call JSON
    loadJSON();
}


