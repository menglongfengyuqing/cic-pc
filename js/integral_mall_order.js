var userAvailableBouns;
var userAwardId;
var realNeedAmount;
var addressId;
var awardId;
var reg = /^1[34578]\d{9}$/;
$(function() {
	userAwardId = getArgumentsByName("userAwardId"); // 用户奖品id

	if(token != null && token != "") {
		detail(userAwardId);
	} else {
		logout();
	}

});

/**
 * 奖品详情
 * @param {Object} userAwardId
 */
function detail(userAwardId) {
	var exproNum;
	//奖品详情
	$.ajax({
		url: ctxpath + "/awardInfo/getUserAwardInfo",
		type: "post",
		dataType: "json",
		data: {
			from: '2',
			token: token,
			userAwardId: userAwardId
		},
		success: function(result) {
			if(result.state == "0") {
				var obj = result.data;
				var str = '<div class="fl">' +
					'<div class="img fl">' +
					'<img src="' + obj.awardImgWap + '" alt="" onerror="imgError(this);">' +
					'</div>' +
					'<div class="product_describe fl">' +
					'<dl>' +
					'<dt>' + obj.awardName + '</dt>' +
					'<dd><span>快递包邮</span><span>不支持退换</span></dd>' +
					'<dd>商品介绍:' + obj.awardDocs + '</dd>' +
					'</dl>' +
					'</div>';
				// 支付配送信息

				if(obj.expressNo != null && obj.expressName != null) {
					str += '<p class="fl" id="exproNum">快递单号：' + obj.expressNo + '<i></i>承运来源：' + obj.expressName + '</p>' +
						'</div>' +
						'<div class="fr">';
				} else {
					str += '<p class="fl" id="exproNum">快递单号：<i></i>承运来源:</p>' +
						'</div>' +
						'<div class="fr">';
				}
				var realNeedAmount = obj.realNeedAmount;
				if(realNeedAmount == 0) { //抽奖
					str += '<span>实消积分:10 &nbsp;&nbsp;&nbsp;&nbsp;X1</span>';
					$(".pay_way").html("<span>积分抽奖</span>");

				} else {
					str += '<span>实消积分:' + obj.realNeedAmount + ' &nbsp;&nbsp;&nbsp;&nbsp;X1</span>';
					$(".pay_way").html("<span>积分兑换</span>");
				}
				str += '<span>剩余积分：' + obj.userAvailableBouns + '</span>';
				if(obj.state == 0) { //待下单
					str += '<a href="javascript:;" class="cur" id="stateBtn" onclick="conversion(\'' + obj.realNeedAmount + '\',\'' + obj.userAvailableBouns + '\')">立即下单</a>' +
						'</div>';
					exproNum = true;

				} else if(obj.state == 1) {
					str += '<a href="javascript:;" >已下单</a>' +
						'</div>';
					$("#exproNum").val("hidden");
					exproNum = true;
				} else if(obj.state == 2) {
					str += '<a href="javascript:;">已发货</a>' +
						'</div>';
				} else if(obj.state == 3) {
					str += '<a href="javascript:;">已结束</a>' +
						'</div>';
				} else if(obj.state == 4) {
					str += '<a href="javascript:;">已兑现</a>' +
						'</div>';
				} else if(obj.state == 5) {
					str += '<a href="javascript:;">已失效</a>' +
						'</div>';
				}
				$(".product_details").html(str);
				$("#productId").attr("href", " integral_mall_product.html?id=" + obj.awardId);
				if(exproNum) {
					$("#exproNum").hide();
				}
				var addressDefaultId = obj.addressId;
				if(addressDefaultId == "" || addressDefaultId == null) {
					getUserAddress();
				} else {
					$("#selectAdressId").val("");
					$("#addAdress").hide();
					$("#orderTit").html("订单信息");
					getDefaultAddressById(addressDefaultId, 2);
				}

			} else {
				logout();
			}
		}
	});
}

/**
 * 奖品兑换
 * @param {Object} needAmount
 */
function conversion(realNeedAmount, userAvailableBouns) {
	_czc.push(['_trackEvent', '确认兑换-无收货地址', '点击', '立即下单']);
	// 校验token 是否存在，不存在去登录页面
	if(token == null || token.trim().length <= 0) {
		logout();
		return false;
	}
	var addrssVal = $("#addressLength").val();
	if(addrssVal == 0) {
		$(".mask_drop,.mask_address").show();
		$("#name").val("");
		$("#address").val("");
		$("#mobile").val("");
		$("#selProvince option").remove();
		$("#selCity option").remove();

		//-----------------------------省市二级联动-------------------------------------------------
		$.each(province, function(k, p) {
			var option = "<option value='" + p.code + "'>" + p.name + "</option>";
			$("#selProvince").append(option);
		});
		var selValue = $("#selProvince").val();
		$.each(city, function(k, p) {
			if(p.ProID == selValue) {
				var option = "<option value='" + p.code + "'>" + p.name + "</option>";
				$("#selCity").append(option);
			}
		});
		$("#selProvince").change(function() {
			var selValue = $(this).val();
			$("#selCity option").remove();
			$.each(city, function(k, p) {
				if(p.ProID == selValue) {
					var option = "<option value='" + p.code + "'>" + p.name + "</option>";
					$("#selCity").append(option);
				}
			});
		});
		return false;
	}
	var selectAdressId = $("#selectAdressId").val();
	if(selectAdressId == null || selectAdressId.trim() == "") {
		$(".mask_tip").show().html("您尚未选择地址，请选择地址！");
		setTimeout(function() {
			$(".mask_tip").hide();
		}, 2000);
		return false;
	}

	// 判断用户积分是否足够
	if(parseInt(userAvailableBouns) < parseInt(realNeedAmount)) {
		$(".mask_drop,.points_less").show();
		return false;
	}
	var Id = getArgumentsByName("userAwardId");
	$.ajax({
		url: ctxpath + "/awardInfo/myAwardInfo",
		type: "post",
		dataType: "json",
		data: {
			myAwardId: Id,
			from: '1',
			token: token,
			needAmount: parseInt(realNeedAmount),
			addressId: selectAdressId
		},
		success: function(result) {
			if(result.state == "0") {
				// console.log("奖品兑换成功");
				// window.location = "integral_mall_win.html";
				$(".points_success,.mask_drop").show();

			} else {
				$(".mask_tip").show().html(result.message);
				setTimeout(function() {
					$(".mask_tip").hide();
				}, 2000);
				return false;
			}
		}
	});
}

// 获得用户地址列表信息
function getUserAddress() {
	var address_default = "";
	var address_other = "";
	$.ajax({
		url: ctxpath + "/userConsignee/addressList",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token,
			pageNo: 1,
			pageSize: 10
		},
		success: function(result) {
			if(result.state == '0') {

				if(result.data.length >= 8) {
					$("#addAdress").hide();
				} else {
					$("#addAdress").show();
				}
				$("#addressLength").val(result.data.length);
				if(result.data.length > 0) {

					$.each(result.data, function(index, item) {

						if(item.isDefault == "是") {
							var phone = item.mobile.substr(0, 3) + '****' + item.mobile.substr(7);

							address_default += '<div class="order_adress_wrap">' +
							  '<input type="hidden" value="' + item.isDefault + '" class="isDefault">' +
								'<span class="fl">' + item.name + '</span>' +
								'<ul class="fl">' +
								'<li class="fl">' + item.name + '</li>' +
								'<input type="hidden" value="' + item.name + '" class="name">' +
								'<li class="fl">' + phone + '</li>' +
								'<input type="hidden" value="' + item.mobile + '" class="phone">' +
								'<li class="fl limit_word cur">' + item.province + item.city + item.address + '</li>' +
								'<input type="hidden" value="' + item.provinceCode + '" class="province">' +
								'<input type="hidden" value="' + item.cityCode + '" class="city">' +
								'<input type="hidden" value="' + item.address + '" class="address">' +
								'<li class="fr">' +
								'<u class="exitDefault">取消设为默认地址</u>' +
								'<input type="hidden" value="' + item.id + '">' +
								'<a href="javascript:;" class="modify_btn">编辑</a>' +
								'<a href="javascript:;" class="del_btn">删除</a>' +
								'</li>' +
								'</ul>' +
								'</div>';
							addressId = item.id;

						} else {
							var phone = item.mobile.substr(0, 3) + '****' + item.mobile.substr(7);
							address_other += '<div class="order_adress_wrap">' +
								'<span class="fl">' + item.name + '</span>' +
								'<ul class="fl">' +
								'<li class="fl">' + item.name + '</li>' +
								'<input type="hidden" value="' + item.name + '" class="name">' +
								'<li class="fl">' + phone + '</li>' +
								'<input type="hidden" value="' + item.mobile + '" class="phone">' +
								'<li class="fl limit_word ">' + item.province + item.city + item.address + '</li>' +
								'<input type="hidden" value="' + item.provinceCode + '" class="province">' +
								'<input type="hidden" value="' + item.cityCode + '" class="city">' +
								'<input type="hidden" value="' + item.address + '" class="address">' +
								'<li class="fr">' +
								'<u class="setdefault">设为默认地址</u>' +
								'<input type="hidden" value="' + item.id + '">' +
								'<a href="javascript:;" class="modify_btn">编辑</a>' +
								'<a href="javascript:;" class="del_btn">删除</a>' +
								'</li>' +
								'</ul>' +
								'</div>';

						}
					});
					$(".order_address_con").html(address_default + address_other);
					//0 否 1是
					// 设置默认地址事件
					$(".order_adress_wrap li .setdefault").click(function() {
						var id = $(this).next().val();
						var name = $(this).parent().siblings(".name").val();
						var mobile = $(this).parent().siblings(".phone").val();
						var province = $(this).parent().siblings(".province").val();
						var city = $(this).parent().siblings(".city").val();
						var address = $(this).parent().siblings(".address").val();
						$("#setDefault").val(1);
						setAddressToDefault(id);
						addressId = id;
					});
					//取消设置
					$(".order_adress_wrap li .exitDefault").click(function() {

						var id = $(this).next().val();
						var name = $(this).parent().siblings(".name").val();
						var mobile = $(this).parent().siblings(".phone").val();
						var province = $(this).parent().siblings(".province").val();
						var city = $(this).parent().siblings(".city").val();
						var address = $(this).parent().siblings(".address").val();
						exitAddress(name, mobile, province, city, address, 0, id);
						addressId = id;
					});

					// 点击删除button
					$(".del_btn").click(function() {
						var flag_this = $(this);
						var id = flag_this.parent().find("input").val();
					
						$(".mask_drop,.mask_del").show();
						var delName = flag_this.parent().siblings().eq(0).text();
						var delMobile = flag_this.parent().siblings().eq(2).html();
						var delAdress = flag_this.parent().siblings().eq(4).html();
						var htm = '<li><span>收货人：</span>' + delName + '</li>' +
							'<li><span>联系方式：</span>' + delMobile + '</li>' +
							'<li><span>收货地址：</span>' + delAdress + '</li>';
						$(".mask_del ul").html(htm);
						$("#delId").val(id);
						_czc.push(['_trackEvent', '收货地址', '点击', '删除']);

					});
					//编辑
					$(".modify_btn").click(function() {
						var isYes=$(this).parent().parent().siblings().eq(0).val();
						$(".mask_address h4").html("编辑收货地址<span class='close'>X</span>");
						var flag_this = $(this);
						var id = flag_this.parent().find("input").val();
						$("#modifyId").val(id);
						$(".mask_drop,.mask_address").show();
						getOneAddressInfoByID(id);
						
						_czc.push(['_trackEvent', '收货地址', '点击', '修改']);

					});
					$(".order_adress_wrap").each(function() {
						$(this).children("span").click(function() {
							$(this).addClass("cur").parent().siblings().children("span").removeClass("cur");
							var addressId = $(this).siblings().children().children("input").val();
							$("#selectAdressId").val(addressId);
						});
					})

				} else {
					$(".order_address_con").html('<h6>还没有收货地址哦！</h6>');
				}

			}
		}
	});
}

// 设置默认地址
function setAddressToDefault(id) {
	_czc.push(['_trackEvent', '收货地址', '点击', '设为默认地址']);
	if(id != null && id != "") {
		$.ajax({
			url: ctxpath + "/userConsignee/setOneAddressDefault",
			type: 'post',
			dataType: 'json',
			data: {
				from: "1",
				token: token,
				id: id
			},
			success: function(result) {
				if(result.state == '0') {
					console.log(result.message);
					getUserAddress();
				}
			}
		});
	}
}

// 删除地址
function deleteOneAddressInfo(id) {
	if(id != null && id != "") {
		$.ajax({
			url: ctxpath + "/userConsignee/deleteOneAddress",
			type: 'post',
			dataType: 'json',
			data: {
				from: "1",
				token: token,
				id: id
			},
			success: function(result) {
				if(result.state == '0') {
					$("#selectAdressId").val("");
					getUserAddress();
				}
			}
		});
	}
}

function imgError(image) {
	image.src = "images/integral_mall/white.png";
}
// 删除方法
$("#delSure").click(function() {
	$(".mask_drop,.mask_del").hide();
	var id = $("#delId").val();
	deleteOneAddressInfo(id);
	_czc.push(['_trackEvent', '删除收货地址', '点击', '确认']);
});
$(".del_close").click(function() {
	$(".mask_drop,.mask_del").hide();	
	_czc.push(['_trackEvent', '删除收货地址', '点击', '取消']);
});
//新增

$("#addAdress").click(function() {
	_czc.push(['_trackEvent', '确认兑换-无收货地址', '点击', '新增收货地址']);
	$(".mask_drop,.mask_address").show();
	$(".mask_address h4").html('新增收货地址<span class="close">X</span>');
	$("#name").val("");
	$("#address").val("");
	$("#mobile").val("");
	$("#selProvince option").remove();
	$("#selCity option").remove();
	$(".mask_address .close").click(function() {
	$(".mask_drop,.mask_address").hide();
    $("#modifyId").val("");
	
	_czc.push(['_trackEvent', '收货地址弹框', '点击', '关闭']);
});

	//-----------------------------省市二级联动-------------------------------------------------
	$.each(province, function(k, p) {
		var option = "<option value='" + p.code + "'>" + p.name + "</option>";
		$("#selProvince").append(option);
	});
	var selValue = $("#selProvince").val();
	$.each(city, function(k, p) {
		if(p.ProID == selValue) {
			var option = "<option value='" + p.code + "'>" + p.name + "</option>";
			$("#selCity").append(option);
		}
	});
	$("#selProvince").change(function() {
		var selValue = $(this).val();
		$("#selCity option").remove();
		$.each(city, function(k, p) {
			if(p.ProID == selValue) {
				var option = "<option value='" + p.code + "'>" + p.name + "</option>";
				$("#selCity").append(option);
			}
		});
	});
	//-----------------------------省市二级联动结束------------------------------------------------
});
$(".mask_address .close").click(function() {
	$(".mask_drop,.mask_address").hide();
    $("#modifyId").val("");
	
	_czc.push(['_trackEvent', '收货地址弹框', '点击', '关闭']);
});

// 修改或者添加地址信息
var click = false;
//保存
$("#saveAddress").click(function() {
	_czc.push(['_trackEvent', '收货地址弹框', '点击', '保存收货人信息按钮']);
	var id = $("#modifyId").val();

	if(id == null ||id==""){
		isDefault=0;
	}
	else{
		isDefault=$("#setDefault").val();
	}
	saveUserAddressInfo(id, isDefault);
});

function saveUserAddressInfo(id, isDefault) {
	$(".error_msg").hide();

	var name = $("#name").val();
	var province = $("#selProvince").val();
	var city = $("#selCity").val();
	var address = $("#address").val();
	var mobile = $("#phoneNum").val();

	if(name == null || name == "") {
		$(".error_name").show().html("请输入收货人姓名");
		return false;
	}
	if(address == null || address == "") {
		$(".error_txt").show().html("请输入收货详细地址");
		return false;
	} else if(address.length > 40) {
		$(".error_txt").show().html("详细地址做多不超过40字符");
		return false;
	}
	if(mobile == null || mobile == "") {
		$(".error_phone").show().html("请输入收货人手机号");
		return false;
	}
	if(!reg.test(mobile)) {
		$(".error_phone").show().html("手机号码有误,请重新输入");
		return false;
	}

	$.ajax({
		url: ctxpath + "/userConsignee/addNewAddress",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token,
			name: name,
			mobile: mobile,
			provinceCode: province,
			cityCode: city,
			address: address,
			isDefault: isDefault,
			id: id
		},
		success: function(result) {
			if(result.state == '0') {
				getUserAddress();
				$(".mask_drop,.mask_address").hide();
			}
		}
	});
}
//取消默认地址
function exitAddress(name, mobile, province, city, address, isDefault, id) {

	$.ajax({
		url: ctxpath + "/userConsignee/addNewAddress",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token,
			name: name,
			mobile: mobile,
			provinceCode: province,
			cityCode: city,
			address: address,
			isDefault: isDefault,
			id: id
		},
		success: function(result) {
			if(result.state == '0') {
				getUserAddress();
				$(".mask_drop,.mask_address").hide();

			}
		}
	});
}

function getOneAddressInfoByID(id) {
	$("#modifyId").val(id);
	$("#selCity option,#selProvince option").remove();
	$.ajax({
		url: ctxpath + "/userConsignee/getOneAddress",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token,
			id: id
		},
		success: function(result) {
			if(result.state == '0') {
				var name = $("#name").val(result.data.name);
				var address = $("#address").val(result.data.address);
				var phone = result.data.mobile.substr(0, 3) + '****' + result.data.mobile.substr(7);
				var mobile = $("#mobile").val(phone);
                var phoneNum=$("#phoneNum").val(result.data.mobile);
				if(result.data.isDefault == '是') {
				      $("#setDefault").val("1");
				} else {
					
						$("#setDefault").val("0");
				}

				$("#selProvince").val(result.data.provinceCode);
				$("#selCity option").remove();
				$.each(city, function(k, p) {
					if(p.ProID == result.data.provinceCode) {
						if(result.data.cityCode == p.code) {
							var option = "<option value='" + p.code + "' selected='selected'>" + p.name + "</option>";
						} else {
							var option = "<option value='" + p.code + "'>" + p.name + "</option>";
						}
						$("#selCity").append(option);
					}
				});

				$("#mobile").focus(function() {
					$(this).val("");
					$("#phoneNum").val("");
				});
				$("#mobile").keyup(function(){
					$("#phoneNum").val($(this).val());
				});
				$(".mask_address .close").click(function() {
					$(".mask_drop,.mask_address").hide();
					$("#setDefault").val("");
					    $("#modifyId").val("");
					_czc.push(['_trackEvent', '收货地址弹框', '点击', '关闭']);
				});
			}
		}
	});
	//-----------------------------省市二级联动-------------------------------------------------
	$.each(province, function(k, p) {
		var option = "<option value='" + p.code + "'>" + p.name + "</option>";
		$("#selProvince").append(option);
	});
	var selValue = $("#selProvince").val();
	$.each(city, function(k, p) {
		if(p.ProID == selValue) {
			var option = "<option value='" + p.code + "'>" + p.name + "</option>";
			$("#selCity").append(option);
		}
	});
	$("#selProvince").change(function() {
		var selValue = $(this).val();
		$("#selCity option").remove();
		$.each(city, function(k, p) {
			if(p.ProID == selValue) {
				var option = "<option value='" + p.code + "'>" + p.name + "</option>";
				$("#selCity").append(option);
			}
		});
	});
	//-----------------------------省市二级联动结束------------------------------------------------

}
// 获取默认地址
function getDefaultAddressById(addressId, state) {

	$.ajax({
		url: ctxpath + "/userConsignee/getOneAddress",
		type: 'post',
		dataType: 'json',
		data: {
			from: "1",
			token: token,
			id: addressId
		},
		success: function(result) {
			console.log(result.data);
			if(result.state == '0') {
				item = result.data;
				var address_default = "";
				var userAwardId = getArgumentsByName("userAwardId"); // 用户奖品id
				var phone = item.mobile.substr(0, 3) + '****' + item.mobile.substr(7);
				address_default += '<div class="order_adress_wrap">' +
					'<span class="fl">' + item.name + '</span>' +
					'<ul class="fl">' +
					'<li class="fl">' + item.name + '</li>' +
					'<li class="fl">' + phone + '</li>' +
					'<li class="fl limit_word">' + item.province + item.city + item.address + '</li>' +
					'</ul>' +
					'</div>';
				$('.order_address_con').html(address_default);

			}
		}
	});
}

/*积分不足按钮*/
$(".points_less span,.points_less a").click(function() {
	$(".mask_drop,.points_less").hide();
});
//积分
$(".points_success span").click(function() {
	$(".mask_drop,.points_success").hide();
	_czc.push(['_trackEvent', '兑换成功弹窗', '点击', '关闭按钮']);
	window.location.reload();

});
$("#mobile").keyup(function(){
					$("#phoneNum").val($(this).val());
				});