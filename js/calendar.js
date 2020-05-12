$(function() {

	//页面加载初始化年月

	var mydate = new Date();

	$(".f-year").html(mydate.getFullYear());

	$(".f-month").html(mydate.getMonth() + 1);

	showDate(mydate.getFullYear(), mydate.getMonth() + 1);

	var curMonth = mydate.getMonth() + 1;
	var curYear = mydate.getFullYear();
    var curDay=mydate.getDate();
	//	var curYear = "2016";
    var dataNum=curYear+"-"+curMonth+"-"+curDay;
	//日历上一月

	$(".f-btn-jian ").hide();

	$(".f-btn-jian ").click(function() {
		var changeMon = $(".f-month").html();
		var changeYear = $(".f-year").html();
		changeMon = parseInt(changeMon);
		changeYear = parseInt(changeYear);
		$("#investDetail").hide();

		var mm = parseInt($(".f-month").html());

		var yy = parseInt($(".f-year").html());

		if(mm == 1) { //返回12月

			$(".f-year").html(yy - 1);

			$(".f-month").html(12);

			showDate(yy - 1, 12);

		} else { //上一月

			$(".f-month").html(mm - 1);

			showDate(yy, mm - 1);

		}

		getNextMouth();
		$(".f-normall").click(function() {

			var $this = $(this).parent();
			if($this.hasClass("f-number")) {

				$(this).addClass("active").removeClass("default").parent().siblings().children().removeClass("default active");

			} else {
				$(this).addClass("default").removeClass("active").parent().siblings().children().removeClass("default active");

			}
		});

	})

	//日历下一月

	$(".f-btn-jia").click(function() {

		$(".f-btn-jian ").show();

		$("#investDetail").hide();

		var mm = parseInt($(".f-month").html());

		var yy = parseInt($(".f-year").html());

		if(mm == 12) { //返回12月

			$(".f-year").html(yy + 1);

			$(".f-month").html(1);

			showDate(yy + 1, 1);

		} else { //上一月

			$(".f-month").html(mm + 1);

			showDate(yy, mm + 1);

		}
		getNextMouth();

		$(".f-normall").click(function() {

			var $this = $(this).parent();
			if($this.hasClass("f-number")) {

				$(this).addClass("active").removeClass("default").parent().siblings().children().removeClass("default active");

			} else {
				$(this).addClass("default").removeClass("active").parent().siblings().children().removeClass("default active");

			}
		});
	})

	//返回本月

	$(".f-btn-fhby").click(function() {

		$(".f-year").html(mydate.getFullYear());

		$(".f-month").html(mydate.getMonth() + 1);

		showDate(mydate.getFullYear(), mydate.getMonth() + 1);
		getNextMouth();
	})

	//读取年月写入日历  重点算法!!!!!!!!!!!

	function showDate(yyyy, mm) {

		var dd = new Date(parseInt(yyyy), parseInt(mm), 0); //Wed Mar 31 00:00:00 UTC+0800 2010  

		var daysCount = dd.getDate(); //本月天数  

		var mystr = ""; //写入代码

		var icon = ""; //图标代码

		var week = new Date(parseInt(yyyy) + "/" + parseInt(mm) + "/" + 1).getDay(); //今天周几

		var lastMonth; //上一月天数

		var nextMounth //下一月天数

		if(parseInt(mm) == 1) {

			lastMonth = new Date(parseInt(yyyy) - 1, parseInt(12), 0).getDate();

		} else {

			lastMonth = new Date(parseInt(yyyy), parseInt(mm) - 1, 0).getDate();

		}

		if(parseInt(mm) == 12) {

			nextMounth = new Date(parseInt(yyyy) + 1, parseInt(1), 0).getDate();

		} else {

			nextMounth = new Date(parseInt(yyyy), parseInt(mm) + 1, 0).getDate();

		}

		for(i = 0; i < daysCount; i++) {

			//计算上月空格数

			if(i % 7 == 0) {

				if(i < 7) { //只执行一次

					for(j = 0; j < week; j++) {

						mystr += "<div class='f-td f-null' >" + (lastMonth + j + 1 - week) + "</div>";

					}

				}

			}

			//这里为一个单元格，添加内容在此
			//
			//          mystr += "<div class='f-td f-number'><span class='f-day'>"+(i+1)+"</span>"
			//
			//                  +"<div class='f-yuan'></div>"
			//
			//                  +"</div>"; 

			mystr += "<div class='f-td f-li'><span class='f-day f-normall'>" + (i + 1) + "</span>"

				+
				"</div>";

		}
		//

		//计算下月空格数

		//         for(k=0; k<42-(daysCount+6-week);k++ ){//表格保持等高6行42个单元格

		//            mystr += "<div class='f-td f-null' style='color:#ccc;'>"+(k+1)+"</div>";

		//        }

		//表格不等高，只补充末行不足单元格

		if(7 - (daysCount + week) % 7 < 7) {

			for(k = 0; k < 7 - (daysCount + week) % 7; k++) { // week为今天周几 daysCount为本月天数  7-week为本行空格数 7-(daysCount+6-week)%7为最后一行有几个空格

				mystr += "<div class='f-td f-null' style='color:#bbb;'>" + (k + 1) + "</div>";

			}

		}

		//写入日历

		$(".f-rili-table .f-tbody").html(mystr);

		//给今日加class
		if(mydate.getFullYear() == yyyy) {

			if((mydate.getMonth() + 1) == mm) {

				var today = mydate.getDate();

				$(".f-li").eq(today - 1).children(".f-day").addClass("f-today").addClass("active");

			}

		}

		//绑定选择方法

		$(".f-rili-table .f-number").off("click");

		$(".f-rili-table .f-number").on("click", function() {

			$(".f-rili-table .f-number").removeClass("f-on");

			$(this).addClass("f-on");

		});

	}
	$(".f-normall").click(function() {

		var $this = $(this).parent();
		if($this.hasClass("f-number")) {

			$(this).addClass("active").removeClass("default").parent().siblings().children().removeClass("default active");

		} else {
			$(this).addClass("default").removeClass("active").parent().siblings().children().removeClass("default active");
			$("#investDetail").html("").hide();
			$(".payment_null").show();

		}

	});

});
$("body").click(function(e) {
	$(".f-td.cur").children(".f-table-msg").html("").hide();
	$(".f-td.cur").removeClass("cur");
});

