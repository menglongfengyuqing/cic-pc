// 每次抽奖消耗积分
var drawLotteryBouns = 10;

var endnum = 4;

var userBouns; //用户积分

var lottery = {

	index: -1, //当前转动到哪个位置，起点位置

	count: 0, //总共有多少个位置

	timer: 0, //setTimeout的ID，用clearTimeout清除

	speed: 100, //初始转动速度

	times: 0, //转动次数

	cycle: 30, //转动基本次数：即至少需要转动多少次再进入抽奖环节

	prize: -1, //中奖位置

	init: function(id) {

		if($("#" + id).find(".lottery-unit").length > 0) {

			$lottery = $("#" + id);

			$units = $lottery.find(".lottery-unit");

			this.obj = $lottery;

			this.count = $units.length;

			$lottery.find(".lottery-unit-" + this.index).addClass("cur");

		};

	},

	roll: function() {

		var index = this.index;

		var count = this.count;

		var lottery = this.obj;

		$(lottery).find(".lottery-unit-" + index).removeClass("cur");

		index += 1;

		if(index > count - 1) {

			index = 0;

		};

		$(lottery).find(".lottery-unit-" + index).addClass("cur");

		this.index = index;

		return false;

	},

	stop: function(index) {

		this.prize = index;

		return false;

	}

};

var click = false;
var clickTimer = null;
window.onload = function() {

	if(token != null && token.trim().length > 0) {
		$("#score_game").attr("href", "integral_mall_game.html");
		$("#score_change").attr("href", "integral_mall_win.html");
		$("#myPoints").show();
	} else {
		$("#score_game").attr("href", "login.html");
		$("#score_change").attr("href", "login.html");
		$("#myPoints").hide();
	}
	// $("#lottery li").height($(".lottery-unit-0").height());

	if(token != null && token.trim().length > 0) {
		// 获得用户积分值
		getUserBouns();

		// 奖品列表
		getAwardList();

		//获奖名单
		getAwardUserList();
		//抽奖剩余次数
		userDrawLotteryNum();

	} else {
		logout();
	}

	lottery.init('lottery');

	$("#start").click(function() {
		_czc.push(['_trackEvent', '积分抽奖', '点击', '立即抽奖按钮']);
		if(click) {
			
			return false;
		}
		else{
			
		
		

			var userBouns = $("#userbouns").val();
			if(parseInt(userBouns) < drawLotteryBouns) {
				/*alert("积分不足");*/
				$(".mask_drop,.points_less").show();
				return false;
			}

			// 抽奖方法
			$.ajax({
				url: ctxpath + "/userDrawLottery/drawLottery",
				type: 'post',
				dataType: 'json',
				data: {
					from: "2",
					token: token
				},
				success: function(result) {

					if(result.state == '0') {

						var classId = $("#" + result.data.awardId).attr("class").trim().substr(-1, 1);
						var src = $("#" + result.data.awardId).children("img").attr("src");
						var isDrawnPrize = result.data.isDrawnPrize;
						var awardName = result.data.awardName;
						var drawLotteryNum = result.data.drawLotteryNum;
						$("#drawLotteryNum").html(drawLotteryNum);
						// $("#myscore").html(result.data.score);
						// 判断是否是谢谢惠顾
						if(isDrawnPrize == 0) { //中奖
							$("#prizePic").children("img").attr("src", src);
							$("#prizePic").children("p").eq(0).html("恭喜您抽中" + awardName);
							var isTrue = result.data.isTrue;
							var deadline = result.data.deadline;
							deadline = deadline * 24;
							if(isTrue == 0) { //实物奖品失效时间
								var strP = '请在' + deadline + '小时之内' +
									'"我的奖品"进行下单，否则奖品将会失效';
								$("#deadline").html(strP);
							} else {
								var strP = '可在我的奖品中查看';
								$("#deadline").html(strP);
							}
						} else {
							//谢谢惠顾
							// $(".points_no,.mask_drop").show();

						}
						$("#isDrawnPrize").val(isDrawnPrize);
						endnum = parseInt(classId);
						lottery.speed = 100;
						roll();
						click = true;
						return false;
					} else if(result.state == '3') { //抽奖次数用完

						$(".mask_tip").show().html(result.message);
						setTimeout(function() {
							$(".mask_tip").hide().html("");
						}, 1000);
						return false;
					}

				}

			});
click=true;

			return false;
		}
	});

};

//抽奖剩余次数
function userDrawLotteryNum() {
	$.ajax({
		url: ctxpath + "/userDrawLottery/userDrawLotteryNum",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token
		},
		success: function(result) {
			if(result.state == 0) {
				if(result.num < 0) {
					$("#drawLotteryNum").html("0");
				} else {
					$("#drawLotteryNum").html(result.num);

				}

			} else {
				window.location.href = "login.html";
				return false;
			}
		}
	});
}

function getAwardUserList() {
	var str = "";
	$.ajax({
		url: ctxpath + "/awardInfo/userBounsList",
		type: 'post',
		dataType: 'json',
		data: {
			from: "2",
			pageNo: 1,
			pageSize: 10
		},
		success: function(result) {
			console.log(result.state);
			console.log(result.message);
			if(result.state == '0') {
				if(result.data.awardlist.length > 0) {
					$.each(result.data.awardlist, function(index, item) {
						str += '<div class="swiper-slide">' +
							'<div class="displayIB">' +
							'<span class="font_size28 fl">' + item.userPhone + '<b></b>获得' + item.awardName + '</span>' +
							'</div>' +
							'</div>';

					});
					$("#awardsUserList").html(str);
				}

			}

			/*中奖列表*/

			var mySwiper = new Swiper('.swiper-container', {
				mode: 'vertical',
				loop: true,
				slidesPerView: 5,
				autoplay: 700
			})
		}
	});
}

function roll() {

	lottery.times += 1;
	lottery.roll();
	if(lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
		clearTimeout(lottery.timer);

		lottery.prize = -1;
		lottery.times = 0;
		click = false;
		var isDrawnPrize = $("#isDrawnPrize").val();
		console.log(isDrawnPrize);

		if(isDrawnPrize == 1) {
			$(".mask_drop").show();
			$(".points_no").show();
		} else {
			/*抽中奖品*/
			$(".mask_drop").show();
			$(".points_get").show();
			getAwardUserList();
		}

	} else {
		if(lottery.times < lottery.cycle) {
			lottery.speed -= 10;
		} else if(lottery.times == lottery.cycle) {
			lottery.prize = endnum;
		} else {
			if(lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
				lottery.speed += 110;
			} else {
				lottery.speed += 20;
			}
		}
		if(lottery.speed < 40) {
			lottery.speed = 40;
		};
		lottery.timer = setTimeout(roll, lottery.speed);

	}
	return false;
}

// 获得用户积分值
function getUserBouns() {
	$.ajax({
		url: ctxpath + "/bouns/userBouns",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token
		},
		success: function(result) {
			if(result.state == '0') {
				userBouns = result.data.score;
				$("#myPoints").html("我的积分："+ result.data.score+'<i></i>').click(function () {
					window.location.href="integral_mall_points.html";
				});
			} else {
				//去登录
				logout();
			}
		}
	});
}

// 获得抽奖商品列表
function getAwardList() {
	var str = "";
	var first = "";
	var awards = new Array();
	$.ajax({
		url: ctxpath + "/awardInfo/getAwardInfoList",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			pageNo: 1,
			pageSize: 8,
			isLottery: '1'
		},
		success: function(result) {
			if(result.state == '0') {
				var i = 0;

				$.each(result.data.awardlist, function(index, item) {

					str = "<img src='" + item.imgWap + "' onerror='imgError(this);'/>" +
						"<p><span>" + item.name + "</span></p>";

					$(".lottery-unit-" + index).attr('id', item.awardId);
					$(".lottery-unit-" + index).html(str);

					if(item.name != "谢谢惠顾" && i < 3) {
						awards[i] = item;
						i++;
					} else {
						var htm = '<img src="images/integral_mall/img_no.png">' +
							'<p><span>未中奖</span></p>';
						$(".lottery-unit-0").html(htm);
					}
				});
			}
		}
	});
}

function imgError(image) {
	image.src = "images/integral_mall/white.png";
}
$(".points_no a,.points_no span,.points_get span").click(function() {
	$(this).parent().hide();
	$(".mask_drop").hide();
	$("#lottery li").removeClass("cur");
});
