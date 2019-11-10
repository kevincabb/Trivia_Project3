//Load JSON file
function loadJSON() {
    let xmlhttp = new XMLHttpRequest();
    let url = "";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let myArr = JSON.parse(this.responseText);
            questions(myArr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

let scoreText = document.getElementById('aBtn');
let backMoBtn = document.getElementById('backMoBtn').addEventListener('click', function(){
    scoreText.innerText = "Score: 10";
});
//Call JSON
loadJSON();