        /*该文件依赖于jQuery，请优先引入*/
function loadingImgStart(){
    $(document.body).append("<div class='loadingDiv'>"
    +"<img class='loadingImg' src='./images/loading.gif'>"
    +"</div>");
}

function loadingImgEnd(){
    try{
        $(".loadingDiv").remove();
    }catch(e){

    }
}