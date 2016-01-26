window.onload = startFun;

function startFun () {
    var doc = document;
    var thumbs = doc.querySelectorAll(".thumb");

    for (var i=0; i< thumbs.length; i++) {
        thumbs[i].addEventListener("click", bindClick(i));
    }

    function bindClick(i) {
        return function () { console.log("you clicked "); thumbs[i].classList.toggle('wide'); };
    };
};
