// const { response } = require("express");

let canvas;
let ctx;

$(window).load(() => {
    console.log("[window onload] : [start]");

    //초기 전역변수 객체 등록
    canvas = $("#w1_canvas");
    ctx = canvas[0].getContext("2d");
})


const range = document.getElementById("range");
const palette = document.getElementById("palette");
const drawing = document.getElementById("drawing");
const erase = document.getElementById("erase");
const save = document.getElementById("dSave");

// 기본 초기화
ctx.fillStyle = "black"; // 배경 색
ctx.strokeStyle = "#2c2c2c"; // 펜 색
ctx.lineWidth = 2.5; // 펜 두께
background = "white";

let isDraw = true;

//이미지 부여 

// var img = new Image();
// img.src = 'week01.png';
// img.onload = function() {
//     ctx.drawImage(img, 0, 0, 1102, 702);
// };


//드로잉용 마우스, 터치 
function drawingPen(isDraw) {
    if(canvas) {
        function touchstart(e) { drawStart(e.touches[0]); }
        function touchmove(e) { drawMove(e.touches[0]); e.preventDefault(); }
        function touchend(e) { drawEnd(e.changedTouches[0]); }

        canvas.addEventListener("touchstart", touchstart, false);
        canvas.addEventListener('touchmove', touchmove, false);
        canvas.addEventListener('touchend', touchend, false);        
      
        canvas.addEventListener('mousedown', drawStart, false);
        canvas.addEventListener('mousemove', drawMove, false);
        canvas.addEventListener('mouseup', drawEnd, false);
    }

    //터치용 함수 정의: 마우스 버전
    function drawStart(e) {
        ctx.beginPath();
        ctx.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
        isDraw = false;
    }
    function drawMove(e) {
        if(isDraw) { console.log("drawMove is "); console.log(isDraw); return; }
        ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
        ctx.stroke();
    }
    function drawEnd(e) {
        if(isDraw) { console.log(isDraw); return; }
        drawMove(e);
        isDraw = true;
    }
}
canvas.addEventListener("contextmenu", (e) => e.preventDefault() );

//편집툴
let color = null;

// 색 조절
palette.addEventListener("input", () => {
    color = palette.value;
    ctx.strokeStyle = color;
});

// 펜 굵기 조절
range.addEventListener("input", () => {
    const brushWidth = range.value;
    ctx.lineWidth = brushWidth;
});

// 지우기
erase.addEventListener("click", () => {
    // ctx.strokeStyle = background;
    // drawingPen(true);
    // ctx.clearRect(0, 0, 1202, 702);
    ctx.drawImage(img, 0, 0, 1102, 702);
    console.log("지우기");
});

// 그리기
drawing.addEventListener("click", () => {
    ctx.strokeStyle = color;
    drawingPen(true);
    console.log("그리기");

});


// 업로드 1
function uploadImage() {
    canvas.toBlob(function(blob) {
        fetch('/api/image_upload', {
            method: 'POST',
            headers: {
                'entype': 'multipart/form-data'
            },
            body: blob //Blob 객체는 내장타입을 가져서 특별히 Content-Type 지정 필요 x
            // toBlob에 의해 image/png가 자동으로 설정되어있음. 
            // Blob 객체의 경우 해당 객체의 타입이 Content-Type 헤더의 값이 됨.
        })
        .then(response => response.json())
        .then(result => alert(JSON.stringify(result, null, 2))) // 전송이 잘 되었는지 응답, 이미지 사이즈 출력
    }, 'image/png');
}

// 업로드 2
// save.addEventListener('click', function() {
//     let drawingImage = canvas.toDataURL('image/png')
//     let formData = new FormData(document.getElementById("uploadForm")[0]); // 폼 객체
//     formData.append('image', drawingImage );

//     fetch('/image_upload', {
//         method: 'POST',
//         headers: {
//             'enctype': 'multipart/form-data', //필수 파라미터
//             'Content-Type': false, // 필수 파라미터
//             'processData': false, // 필수 파라미터. string으로 자동 변환 방지
//         }, body : formData
//     })
//     .then(response => response.json())
//     .then(result => alert(JSON.stringify(result, null, 2)))
// })




