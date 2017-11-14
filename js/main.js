
/*设置lazyloading开始*/
        $(document).ajaxStart(function(){
                loadingImgStart();
        });
         $(document).ajaxComplete(function(){
                loadingImgEnd();
        });
/*设置lazyloading结束*/
$(function(){
/*测试ajax开始*/
    		$(".buttonTest").click(function(){
    			$.ajax({
    				type:'post',
    				url:'./php/data.php',
    				data:{
                        operationCode:"test",
                        operation:"firstPage",
                        pageNow:1,
                        pageNum:$(".pageNum").val()
                    },
    				async:'true',
    				dataType:'json',
    				success:function(data,textStatus){
    					console.log("ajax测试成功");
    					console.log(data);
                        console.log(textStatus);
    				},error:function(data,textStatus){
    					console.log("ajax测试失败");
    					console.log(data);
                        console.log(textStatus);
    				}
    			});
    		});
/*测试ajax结束*/
    /*渲染页面的DOM操作开始*/
        /*参数传进来的是一个用户数组*/
        function renderTable(dataList,fieldNameObj,pageNum,pageNow){
            /*首先渲染Thead*/
            // 这里需要额外添加3列：首行为多选,第二行为序号。尾行为操作
            var myTheadHtml="<tr>";
            myTheadHtml=myTheadHtml+"<td><input type='checkbox' class='myTableSelectAll'>全选/反选</td>"
            +"<td>序号</td>";
            for(var fieldObj in fieldNameObj){
                myTheadHtml=myTheadHtml+"<td>"+fieldNameObj[fieldObj]+"</td>";
            }
            myTheadHtml=myTheadHtml+"<td>操作</td></tr>";
            $(".myThead").append(myTheadHtml);

            /*下面开始渲染表单Tbody*/

            var myTbodyHtml;
            /*根据第一个元素进行删除，前后台都要判断主键唯一的约束*/
            /*对象的元素默认为主键,根据主键来进行删除*/
            if(dataList.length==0){
                alert("未加载到数据,先添加数据！");
                return false;
            }
            var dataObj= dataList[0];
            var arrKey=[];
            for(var key in dataObj){
                arrKey.push(key);
            }
            var primaryKey=arrKey[0];
            for(var i=0;i<dataList.length;i++){
               myTbodyHtml=myTbodyHtml+"<tr><td><input type='checkbox' class='myTableSelectOne'></td>"
               +"<td>"+((pageNow-1)*pageNum+i+1)+"</td>";

               var dataObj= dataList[i];
               for(var key in dataObj){
                    myTbodyHtml=myTbodyHtml+"<td>"+dataObj[key]+"</td>";
               }

               /*若想使用update函数和delete，请务必将该函数定义在jQuery函数体外面。*/
/*              myTbodyHtml=myTbodyHtml+"<td><a href=js:; onclick='updateData("+dataObj[primaryKey]+");'>修改</a>&nbsp;|&nbsp;"
               +"<a href=js:; onclick='deleteData("+dataObj[primaryKey]+");'>删除</a>"
               +"</td></tr>";*/

               myTbodyHtml=myTbodyHtml+"<td><a class='updateData' primaryKey='"+dataObj[primaryKey]+"' href=js:;>修改</a>&nbsp;|&nbsp;"
               +"<a  class='deleteData' primaryKey='"+dataObj[primaryKey]+"' href=js:; >删除</a>"
               +"</td></tr>";
            }
            $(".myTbody").append(myTbodyHtml);
            /*给修改绑定事件*/
            $(".myTbody a.updateData").click(function(){
                /*获取主键*/
                var primaryKey=this.getAttribute("primaryKey");
                $.ajax({
                    type:'post',
                    url:'./php/data.php',
                    data:{
                        operationCode:"Update",
                        operation:primaryKey,
                        pageNow:1,
                        pageNum:$(".pageNum").val()
                    },
                    async:'true',
                    dataType:'json',
                    success:function(data,textStatus){
                        alertModel("数据加载成功！");
                        $(".update").click();
                        $(".myTheadUpdate").empty();
                        $(".myTbodyUpdate").empty();
                        var fieldNameObj=(data.name.fieldNameList)[0];
                        fieldNameObjS=(data.name.fieldNameList)[0];
                        /*渲染表头和前面一样*/
                        renderTablePopThead(fieldNameObj,"update");


                        /*下面开始渲染表数据body*/
                        var arrDataKey=[];
                        var arrDataHead=$(".myTheadUpdate td");
                        for(var i=0;i<arrDataHead.length;i++){
                            var key=arrDataHead[i].getAttribute("datakey");
                            if(key){
                                arrDataKey.push(key);
                            }
                        }
                        var myTbodyHtml="";
                        myTbodyHtml=myTbodyHtml+"<tr addDataIndex=1><td><input type='checkbox' class='myTableSelectOneAdd'></td>"
                        +"<td>1</td>";

                       for(var key in arrDataKey){
                            myTbodyHtml=myTbodyHtml+"<td><input type='text' class='popInputData "+arrDataKey[key]+"' placeholder='"+arrDataKey[key]+"'></td>";
                       }
                       myTbodyHtml=myTbodyHtml+"<td style='width:6rem'><a href=js:; >修改</a>&nbsp;|&nbsp;"
                       +"<a href=js:; >删除</a>"
                       +"</td></tr>";
                       $(".myTbodyUpdate").append(myTbodyHtml);
                       /*修改节点的值*/
                       var inputLists=$(".myTbodyUpdate input.popInputData");
                       var obj=data.name.list[0];
                       /*取出对象的值放到数组里面去*/
                       var arrObj=[];
                       for(var key in obj){
                            arrObj.push(key);
                       }
                       for(var i=0;i<inputLists.length;i++){
                            inputLists[i].value=obj[arrObj[i]];
                       }
                       /*将第一列的input主键设置为disabled*/
                       $(".myTbodyUpdate input."+arrDataKey[0]+"").prop("disabled",true);
                    },error:function(data,textStatus){
                        alert("加载数据失败！请重试");

                    }
                });
            });
            /*给修改删除绑定事件*/
            $(".myTbody a.deleteData").click(function(){
                var flag=confirm("确定要删除吗？该操作不可撤销");
                if(flag){
                    /*获取主键*/
                    var primaryKey=this.getAttribute("primaryKey");
                    $.ajax({
                        type:'post',
                        url:'./php/data.php',
                        data:{
                            operationCode:"Delete",
                            operation:primaryKey,
                            pageNow:1,
                            pageNum:$(".pageNum").val()
                        },
                        async:'true',
                        dataType:'json',
                        success:function(data,textStatus){
                            init({
                                operationCode:"refresh",
                                operation:"firstPage",
                                pageNow:1,
                                pageNum:$(".pageNum").val()
                            });
                            alert("删除成功！");
                        },error:function(data,textStatus){
                            alert("加载数据失败！请重试");
                        }
                    });
                }else{
                    return false;
                }
            });
    }
    /*渲染弹出页面的DOM操作开始:分为两块，渲染表头和渲染body(点击才会创建)*/
        /*参数传进来的是一个用户数组*/
        function renderTablePopThead(fieldNameObj,action){
            /*首先渲染Thead*/
            // 这里需要额外添加3列：首行为多选,第二行为序号。尾行为操作
            var myTheadHtml="<tr>";
            myTheadHtml=myTheadHtml+"<td><input type='checkbox' class='myTableSelectAllAdd'>全选</td>"
            +"<td>序号</td>";
            for(var fieldObj in fieldNameObj){
                myTheadHtml=myTheadHtml+"<td datakey="+fieldObj+">"+fieldNameObj[fieldObj]+"</td>";
            }
            myTheadHtml=myTheadHtml+"<td>操作</td></tr>";
            if(action=="add"){
                $(".myTheadAdd").append(myTheadHtml);
            }
            if(action=="update"){
                $(".myTheadUpdate").append(myTheadHtml);
            }
            
        }

        /*删除Add行操作*/

        /*初始化数据索引值为0*/
        var addDataIndex=0;
        /*所有的索引数组存放数组索引*/
        var arrDataIndex=[];
        function renderTablePopBody(){
            /*下面开始渲染表单Tbody*/
            /*首先获取-存放在表头里面的属性key数组*/
            var arrDataKey=[];
            var arrDataHead=$(".myTheadAdd td");
            for(var i=0;i<arrDataHead.length;i++){
                var key=arrDataHead[i].getAttribute("datakey");
                if(key){
                    arrDataKey.push(key);
                }
            }
            var myTbodyHtml;
            function addTrDom(addDataIndex){
                myTbodyHtml=myTbodyHtml+"<tr addDataIndex="+addDataIndex+"><td><input type='checkbox' class='myTableSelectOneAdd'></td>"
               +"<td>"+addDataIndex+"</td>";

               for(var key in arrDataKey){
                    myTbodyHtml=myTbodyHtml+"<td><input type='text' class='popInputData "+arrDataKey[key]+"' placeholder='"+arrDataKey[key]+"'></td>";
               }
               myTbodyHtml=myTbodyHtml+"<td style='width:6rem'><a href=js:; >修改</a>&nbsp;|&nbsp;"
               +"<a href=js:; >删除</a>"
               +"</td></tr>";
            }

           /*在这里判断数组要插入的位置*/
           /*如果不存在undefined*/
           var noUndefined=0;
           /*标记第一个出现undefined的位置*/
           var undefinedFlag;
           if(arrDataIndex!=[]){
                for(var i=0;i<arrDataIndex.length;i++){
                    if(arrDataIndex[i]!=undefined){
                        noUndefined++;
                    }else{
                        undefinedFlag=i;
                        break;
                    }
                }
            }
                /*空数组·*/
               if(arrDataIndex==[]){
                     addDataIndex=2;
                     addTrDom(addDataIndex);
                     $(".myTbodyAdd").append(myTbodyHtml);
                     arrDataIndex.push(addDataIndex);
               }else if(noUndefined==arrDataIndex.length){
                    addDataIndex=noUndefined+1;
                    addTrDom(addDataIndex);
                    $(".myTbodyAdd").append(myTbodyHtml);
                    arrDataIndex.push(addDataIndex);
               }else{
                    addDataIndex=undefinedFlag+1;
                    addTrDom(addDataIndex);
                    var insertLoaction=$(".myTbodyAdd>tr")[undefinedFlag];
                    $(insertLoaction).before(myTbodyHtml);
                    arrDataIndex[undefinedFlag]=undefinedFlag+1;
               }  
               /*将第一列的input主键设置为disabled*/
               $(".myTbodyAdd input."+arrDataKey[0]+"").prop("disabled",true).val("自增主键ID");

                /*给所有的删除按钮添加删除事件*/
                /*需要先解绑,后绑定*/
                $(".myTbodyAdd a").unbind('click');
                $(".myTbodyAdd a").click(function(){
                    var indexTr=$(this).parents("tr").attr("addDataIndex");
                    /*如果只有一个Tr DOM节点则清空数组*/
                    if($(".myTbodyAdd tr").length==1){
                        arrDataIndex=[];
                    }else if(indexTr==arrDataIndex[arrDataIndex.length-1]){
                        arrDataIndex.pop();
                    }else{
                        arrDataIndex[indexTr-1]=undefined;
                    }
                    $(this).parents("tr").remove();
                });
                
                /*添加全选反选事件开始:绑定事件一定要放在ajax返回数据并渲染之后*/
                $(".myTableSelectAllAdd").click(function(){

                    if($(this).prop("checked")==false){
                         $(".myTableSelectOneAdd").prop("checked",false);
                    }else{

                         $(".myTableSelectOneAdd").prop({
                            checked: true,
                        });
                    }
                });
                /*添加全选反选事件结束*/
        }


    /*渲染弹出页面的DOM操作结束*/    

/*业务代码开始*/
     /*将获取的字段名列表保存到全局对象中*/
    var fieldNameObjS;
    /*刚进来默认初始化表格开始*/
    function init(data){
        /*先清空DOM树*/
        $(".myThead").empty();
        $(".myTbody").empty();
                $.ajax({
                type:'post',
                url:'./php/data.php',
                data:data,
                async:'true',
                dataType:'json',
                success:function(data,textStatus){
                    console.log("ajax成功-页面初始化");
                    // console.log(data);
                    // console.log(textStatus);

                    /*当前每页数目*/
                    var pageNum=$(".pageNum").val();
                    /*默认当前页为第一页*/
                    var pageNow=data.name.pageNow;
                    /*获取字段名的中文列表：需要后台提供*/
                    var fieldNameObj=(data.name.fieldNameList)[0];

                    /*显示当前页数和总页数*/ 
                    $(".pageNow").html(data.name.pageNow);
                    $(".rowsSum").html(data.name.rowsSum);
                    var pagesSum=data.name.rowsSum<=pageNum?1:(Math.ceil(data.name.rowsSum/pageNum));
                    $(".pagesSum").html(pagesSum);

                    /*下面是调用方法渲染页面*/
                    renderTable(data.name.list,fieldNameObj,pageNum,pageNow);
                    /*根据当前页和总页数判断某些按钮是否可以使用*/
                    if(data.name.pageNow==1){
                        $(".firstPage").prop("disabled",true).css({
                            border: 'none'
                        });
                        $(".prev").prop("disabled",true).css({
                            border: 'none'
                        });
                       
                    }else{
                        $(".firstPage").prop("disabled",false).css({
                            border: '1px solid black'
                        });
                        $(".prev").prop("disabled",false).css({
                            border: '1px solid black'
                        });
                    }
                    if(data.name.pageNow==pagesSum){
                        $(".lastPage").prop("disabled",true).css({
                            border: 'none'
                        });
                        $(".next").prop("disabled",true).css({
                            border: 'none'
                        });                    
                    }else{
                        $(".lastPage").prop("disabled",false).css({
                            border: '1px solid black'
                        });
                        $(".next").prop("disabled",false).css({
                            border: '1px solid black'
                        });                               
                    }

                    /*添加全选反选事件开始:绑定事件一定要放在ajax返回数据并渲染之后*/
                    $(".myTableSelectAll").click(function(){

                        if($(this).prop("checked")==false){
                             $(".myTableSelectOne").prop("checked",false);
                        }else{

                             $(".myTableSelectOne").prop({
                                checked: true,
                            });
                        }
                    });
                    /*添加全选反选事件结束*/

                },error:function(data,textStatus){
                    console.log("ajax失败");
                    console.log(data);
                    console.log(textStatus);
                }
        });
    }
    /*刚进来默认初始化表格结束*/


    /*弹出框初始化表格开始*/
    function initPop(data){
        /*先清空DOM树*/
        $(".myTheadAdd").empty();
        $(".myTbodyAdd").empty();
        $.ajax({
                type:'post',
                url:'./php/data.php',
                data:data,
                async:'true',
                dataType:'json',
                success:function(data,textStatus){
                    console.log("ajax成功");

                    /*获取字段名的中文列表：需要后台提供*/
                    var fieldNameObj=(data.name.fieldNameList)[0];
                    fieldNameObjS=(data.name.fieldNameList)[0]
                    /*下面是调用方法渲染页面*/
                    renderTablePopThead(fieldNameObj,"add");

                },error:function(data,textStatus){
                    console.log("ajax失败");
                    console.log(data);
                    console.log(textStatus);
                }
        });
    }
    /*弹出框初始化表格结束*/

    /*默认初始化执行*/
    init({
        operationCode:"refresh",
        operation:"firstPage",
        pageNow:1,
        pageNum:$(".pageNum").val()
        });
    


    /*选择每页数目重构DOM开始*/
    $(".pageNum").change(function(){
        init({
            operationCode:"refresh",
            operation:"firstPage",
            pageNow:1,
            pageNum:$(".pageNum").val()
        });
    });
    /*选择每页数目重构DOM结束*/

    /*给所有的按钮添加翻页按钮添加事件开始*/
    /*点击首页*/
    $(".firstPage").click(function(){
        init({
            operationCode:"refresh",
            operation:"firstPage",
            pageNow:1,
            pageNum:$(".pageNum").val()
        });
    });
    /*点击尾页*/
    $(".lastPage").click(function(){
        init({
            operationCode:"refresh",
            operation:"lastPage",
            pageNow:$(".pagesSum").html(),
            pageNum:$(".pageNum").val()
        });
    });
    /*点击上一页*/
    $(".prev").click(function(){
        init({
            operationCode:"refresh",
            operation:"prev",
            pageNow:$(".pageNow").html()-1,
            pageNum:$(".pageNum").val()
        });
    });
    /*点击下一页*/
    $(".next").click(function(){
        init({
            operationCode:"refresh",
            operation:"next",
            pageNow:Number($(".pageNow").html())+1,
            pageNum:$(".pageNum").val()
        });
    });
    /*点击Go*/
    $(".goPageButton").click(function(){
        var goPage=parseInt($(".goPage").val());
        if(goPage>=1 && goPage<=$(".pagesSum").html()){
            init({
                operationCode:"refresh",
                operation:"goPage",
                pageNow:goPage,
                pageNum:$(".pageNum").val()
            });
        }else{
            init({
                operationCode:"refresh",
                operation:"goPage",
                pageNow:1,
                pageNum:$(".pageNum").val()
            });
        }
        
    });
    /*给所有的按钮添加翻页按钮添加事件结束*/


    /*增加用户开始*/
    $(".add").click(function(){
        $(".addAndUpdateBgDiv").css({
            display: "block"
        });
        $(".addDiv").css({
            display: "block"
        });
        $(".updateDiv").css({
            display: "none"
        });
        /*去后台加载数据*/       
        /*初始化表格头部*/
        initPop({
            operationCode:"refresh",
            operation:"firstPage",
            pageNow:1,
            pageNum:$(".pageNum").val()
        });
    });
        /*给关闭按钮添加事件*/
    $(".addAndUpdateBgDivClose").click(function(){
        $(".addAndUpdateBgDiv").css({
            display: "none"
        });
        $(".addDiv").css({
            display: "none"
        });
        $(".updateDiv").css({
            display: "none"
        });
        /*关闭表需要重置表数据*/
        addDataIndex=0;
        arrDataIndex=[] ;
        /*清空表单数据*/
        $(".addMoreValue").val("");
    }); 

    /*单条数据添加事件*/
    $(".addOneButton").click(function(){
        /*根据表头拿对应属性的值*/
        renderTablePopBody();
    });
    /*批量添加数据*/
    $(".addOneButtonMore").click(function(){
        var value=$(".addMoreValue").val();
        var reg=/^[1-9]\d*$/;
        if(!(reg.test(value))){
            alert("请输入大于0的整数");
            return;   
        }else{
             for(var i=0;i<value;i++){
                renderTablePopBody();
             }
        }
    });

    /*增加用户结束*/

    /*删除用户开始*/
    /*批量删除用户*/
    $(".delete").click(function(){
        var flag=confirm("确定要批量删除么,该操作不可撤销！");
        if(flag){
            /*首先获取所有的主键放到数组里*/
            var arrPK=[];
            var arrTr=$(".myTbody input:checkbox:checked");
            if(arrTr.length==0){
                alert("至少选中一条数据");
                return  false;
            }
            for(var i=0;i<arrTr.length;i++){
                var primaryKey=$(arrTr[i]).parents("tr").find(".deleteData").attr("primaryKey");   
                arrPK.push(Number(primaryKey));
            }

            $.ajax({
                type:'post',
                url:'./php/data.php',
                data:{
                    operationCode:"DeleteAll",
                    operation:"firstPage",
                    pageNow:1,
                    pageNum:$(".pageNum").val(),
                    arrPK:JSON.stringify(arrPK)
                },
                async:'true',
                dataType:'json',
                success:function(data,textStatus){
                    alertModel("批量删除成功");
                    /*重新渲染页面*/
                    init({
                        operationCode:"refresh",
                        operation:"firstPage",
                        pageNow:1,
                        pageNum:$(".pageNum").val()
                    });
                },error:function(data,textStatus){
                    console.log("ajax失败");
                    console.log(textStatus);
                    alertModel("批量删除失败,请重试！");
                }
            });  
        }
    });

    /*删除用户结束*/

    /*修改用户开始*/

    $(".update").click(function(){
        $(".addAndUpdateBgDiv").css({
            display: "block"
        });
        $(".addDiv").css({
            display: "none"
        });
        $(".updateDiv .myTbodyUpdate").empty();
        $(".updateDiv").css({
            display: "block"
        });        
    });    

    /*修改用户结束*/

    /*刷新用户开始*/
    $(".refresh").click(function(){
        initPop({
            operationCode:"refresh",
            operation:"firstPage",
            pageNow:1,
            pageNum:$(".pageNum").val()
        });
    });
    /*刷新用户结束*/

    /*查询用户开始*/
    $(".select").click(function(){
        var selectValue=$(".selectValue").val();
        if(!selectValue){
            alert("请输入有效内容");
            return false;
        }
        if(selectValue.trim()==""){
            alert("不允许全部为空格");
            return false;
        }
        selectValue=selectValue.trim();
        alert("功能未完善:");
        return false;
        $.ajax({
                type:'post',
                url:'./php/data.php',
                data:{
                    operationCode:"Select",
                    operation:"firstPage",
                    pageNow:1,
                    pageNum:$(".pageNum").val(),
                    usersData:{
                        keyWord:selectValue
                    }
                },
                async:'true',
                dataType:'json',
                success:function(data,textStatus){
                    alertModel("用户查询成功！");
                    /*关闭窗体*/
                    $(".addAndUpdateBgDivClose").click(); 
                    /*重新渲染页面*/
                    init({
                        operationCode:"refresh",
                        operation:"firstPage",
                        pageNow:1,
                        pageNum:$(".pageNum").val()
                    });

                },error:function(data,textStatus){
                    console.log("ajax失败");
                    console.log(textStatus);
                    alertModel("数据请求失败,请重试！");
                }
        });  
    });
    /*查询用户结束*/   

    /*给弹出框添加事件开始*/
        /*取消按钮*/
    $(".addAndUpdateBgDivCancel").click(function(){
       $(".addAndUpdateBgDivClose").click(); 
    });


    /*新增保存按钮*/
    $(".addAndUpdateBgDivSave").click(function(){
        /*如果是新增执行如下操作*/
        if($(".addDiv").css("display")=="block"){
            /*如果数据为空，不允许提交*/
            if( $(".myTbodyAdd tr").length==0){
                alert("请添加数据");
                return false;
            }
            var usersData=[];
            var usersList=$(".myTbodyAdd tr");
            for(var i=0;i<usersList.length;i++){
                var obj={};
                for(var key in fieldNameObjS){
                    /*找到对应className的值*/
                    var value = $(usersList[i]).find("."+key).val();
                    obj[key]=value;
                }
                usersData.push(obj);
            }
            $.ajax({
                type:'post',
                url:'./php/data.php',
                data:{
                    operationCode:"Add",
                    operation:"firstPage",
                    pageNow:1,
                    pageNum:$(".pageNum").val(),
                    usersData:JSON.stringify(usersData)
                },
                async:'true',
                dataType:'json',
                success:function(data,textStatus){
                    alertModel("用户添加成功！");
                    /*关闭窗体*/
                    $(".addAndUpdateBgDivClose").click(); 
                    /*重新渲染页面*/
                    init({
                        operationCode:"refresh",
                        operation:"firstPage",
                        pageNow:1,
                        pageNum:$(".pageNum").val()
                    });

                },error:function(data,textStatus){
                    console.log("ajax失败");
                    console.log(textStatus);
                    alertModel("数据请求失败,请重试！");
                }
            });  
        }
        /*点击修改*/
        if($(".updateDiv").css("display")=="block"){
            if( $(".myTbodyUpdate tr").length==0){
                alert("未加载数据！无法修改！");
                return false;
            }

            var usersData=[];
            var usersList=$(".myTbodyUpdate tr");
            for(var i=0;i<usersList.length;i++){
                var obj={};
                for(var key in fieldNameObjS){
                    /*找到对应className的值*/
                    var value = $(usersList[i]).find("."+key).val();
                    obj[key]=value;
                }
                usersData.push(obj);
            }
            $.ajax({
                type:'post',
                url:'./php/data.php',
                data:{
                    operationCode:"UpdateSave",
                    operation:"firstPage",
                    pageNow:1,
                    pageNum:$(".pageNum").val(),
                    usersData:JSON.stringify(usersData)
                },
                async:'true',
                dataType:'json',
                success:function(data,textStatus){
                    alertModel("用户修改成功！");
                    /*关闭窗体*/
                    $(".addAndUpdateBgDivClose").click(); 
                    /*重新渲染页面*/
                    init({
                        operationCode:"refresh",
                        operation:"firstPage",
                        pageNow:1,
                        pageNum:$(".pageNum").val()
                    });
                },error:function(data,textStatus){
                    console.log("ajax失败");
                    console.log(textStatus);
                    alertModel("数据请求失败,请重试！");
                }
            });  
        }

    });
        /*新增按钮*/
    /*给弹出框添加事件结束*/


/*业务代码结束*/

});
