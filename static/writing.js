// const { response } = require("express");

// const { buffer } = require("stream/consumers");

let canvas;
let ctx;
var color = null;



$(window).on('load', () => {
    console.log("[window onload] : [start]");

    //초기 전역변수 객체 등록
    canvas = $("#w1_canvas");
    ctx = canvas[0].getContext("2d");
    
    console.log(canvas);
    console.log(ctx);

    //이미지 부여 
    // var img = new Image();
    // img.src = 'week01.png';
    // img.onload = function () {
    //     ctx.drawImage(img, 0, 0, 1102, 702);
    // };


    ctx.strokeStyle = '#2c2c2c';
    ctx.fillStyle = '#f2f2ea';
    ctx.lineWidth = 2.5;

    $('#palette').on('input', () => {
        console.log($('#palette'));
        color = $('#palette').value;
        ctx.strokeStyle = color;
        console.log('the color is ' + color);
        console.log('ctx.strokeStyle is ' + ctx.strokeStyle);
    }) 

    canvas.on('contextmenu', (e) => e.preventDefault());
    
    console.log("done");

})



// 기본 초기화
// ctx.fillStyle = "#2c2c2c"; // 펜 색
// ctx.lineWidth = 2.5; // 펜 두께






//드로잉용 마우스, 터치 
function drawingPen(isDraw = true) {
    console.log("done3");
    if(canvas) {
        console.log('done4');
        canvas.on("touchstart", touchstart);
        canvas.on('touchmove', touchmove);
        canvas.on('touchend', touchend);        
      
        canvas.on('mousedown', drawStart);
        canvas.on('mousemove', drawMove);
        canvas.on('mouseup', drawEnd);
    }

    //터치용 함수 정의: 마우스 버전
    function drawStart(e) {
        ctx.beginPath();
        ctx.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
        isDraw = false;
        console.log('drawStart');
    }
    function drawMove(e) {
        if (isDraw) return;
        console.log("drawMove is " + isDraw);
        ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
        ctx.stroke();
    }
    function drawEnd(e) {
        if (isDraw) return;
        isDraw = true;
        console.log('drawEnd');
    }

    // 그리기 함수 정의 : 터치 버전
    function touchstart(e) { drawStart(e.touches[0]); }
    function touchmove(e) { drawMove(e.touches[0]); e.preventDefault(); }
    function touchend(e) { drawEnd(e.changedTouches[0]); }

}


//편집툴


// 색 조절
// function selectColor() {
//     color = $('#palette').value;
//     ctx.strokeStyle = color;
//     console.log('the color is ' + color);
//     console.log('ctx.strokeStyle is ' + ctx.strokeStyle);
// }

// 펜 굵기 조절
function selectLine() {
    const brushWidth = $('#range').value;
    ctx.lineWidth = brushWidth;
}

// 지우기
function deleteCanvas() {
    console.log("지우기 start");
    ctx.drawImage(img, 0, 0, 1102, 702);
    console.log("지우기 finish");
}

// 그리기
function drawingCanvas() {
    // ctx.strokeStyle = color;
    console.log('the ctx.style is ' + ctx.strokeStyle + '\n color is '+color);
    drawingPen(true);
}


// 업로드 0: url 업로드(임시)
// function uploadImage() {
//     console.log("saveUrl : start");
//     console.log('saveUrl : url : ' + canvas[0].toDataURL());
// }

// 업로드 1: canvas png로 변경 후 서버 업로드
// function uploadImage() {
//     canvas.toBlob(function(blob) {
//         fetch('/api/image_upload', {
//             method: 'POST',
//             headers: {
//                 'enctype': 'multipart/form-data',
//                 'processData' : false,
//             },
//             body: blob //Blob 객체는 내장타입을 가져서 특별히 Content-Type 지정 필요 x
//             // toBlob에 의해 image/png가 자동으로 설정되어있음. 
//             // Blob 객체의 경우 해당 객체의 타입이 Content-Type 헤더의 값이 됨.
//         })
//         .then(response => response.json())
//         .then(result => alert(JSON.stringify(result, null, 2))) // 전송이 잘 되었는지 응답, 이미지 사이즈 출력
//     }, 'image/png');
// }

// 업로드 2: 1의 다른 방법.
// function uploadImage() {
//     let drawingImage = canvas[0].toDataURL('image/png')
//     console.log("data URL: "+drawingImage)
//     let formData = new FormData($('uploadForm')[0]); // 폼 객체
//     formData.append('image', drawingImage );
//     console.log('formData is ' + formData.keys().next());
//     console.log('formData is ' + formData.values());

//     fetch('/api/image_upload', {
//         method: 'POST',
//         headers: {
//             'enctype': 'multipart/form-data', //필수 파라미터
//             'Content-Type': false, // 필수 파라미터
//             'processData': false, // 필수 파라미터. string으로 자동 변환 방지
//         }, body : JSON.stringify(formData)
//     })
//     .then(res => res.json())
//     .then(result => alert(JSON.stringify(result, null, 2)))
// }

function uploadImage() {
    // 이미지 파일 인코딩
    const imgBase64 = canvas[0].toDataURL('image/png')
    console.log("data URL: "+ imgBase64)
    // const decodImg = Buffer.from(imgBase64.split(','));

    // const file = new Blob([decodImg], {type:'image/png'});
    // const fileName = 'week_img' + new Date().getMilliseconds() + '.png';
    
    let formData = new FormData();
    formData.append('w_image', imgBase64.split(',')[1]);
    console.log('formData is '+formData.getAll('w_image'));

    fetch('/api/image_upload', {
        method: 'POST',
        headers: {
            'enctype': 'multipart/form-data', //필수 파라미터
            'Content-Type': false, // 필수 파라미터
            'processData': false, // 필수 파라미터. string으로 자동 변환 방지
            'data' : formData
        }
    })
    .then(res => res.json())
    .then(result => console.log(result))
}




