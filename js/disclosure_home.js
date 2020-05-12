jQuery.support.cors = true;

$(document).ready(function() {

	$('.fancybox').fancybox();
	
	/*营业执照*/
	$("#module_01").click(function() {
	
		$.fancybox.open({
			"href": "images/disclosure/pic_01.jpg",
			"title": "营业执照"
		});
	
	});
	/*从业机构平台信息*/
	$("#module_02").click(function() {
	
		$.fancybox.open({
			"href": "images/disclosure/pic_01.jpg",
			"title": "从业机构平台信息"
		});
	
	});
//	/*资金存管*/
//	$("#module_03").click(function() {
//	
//		$.fancybox.open({
//	
//		
//	
//				"href": 'images/disclosure/pic_02.jpg',
//	
//				"title": '银行存管'
//	
//			
//	
//		
//		});
//	
//	});
	/*等保三级*/
	$("#module_04").click(function() {
	
		$.fancybox.open({
			"href": "images/disclosure/pic_04.jpg",
			"title": "等保三级备案证明"
		});
	
	});
	/*网站备案图标及编号*/
	$("#module_05").click(function() {
	
		$.fancybox.open({
			"href": "images/disclosure/pic_05.jpg",
			"title": "等保三级备案证明"
		});
	
	});
	/*企业荣誉证书*/
	$("#module_06").click(function() {
	
		$.fancybox.open([
	
			{
	
				href: 'images/about/pic_hd_01.jpg',
	
				title: '推动民间金融市场发展十大领先品牌'
	
			}, {
	
				href: 'images/about/pic_hd_02.jpg',
	
				title: '互联网金融信息服务平台优秀成员单位'
	
			}, {
	
				href: 'images/about/pic_hd_03.jpg',
	
				title: '中国互联网金融AAA级信用企业'
	
			}, {
	
				href: 'images/about/pic_hd_04.jpg',
	
				title: '中国供应链金融产业生态联盟副理事长单位'
	
			}, {
	
				href: 'images/about/pic_hd_05.jpg',
	
				title: '诚信网站'
	
			}
	
		], {
	
			helpers: {
	
				thumbs: {
	
					width: 75,
	
					height: 50
	
				}
	
			}
	
		});
	
	
	});
	/*网站备案图标及编号*/
	$("#module_07").click(function() {
		$.fancybox.open({
			"href": "images/disclosure/pic_06.jpg",
			"title": "组织架构部门架构及职责"
		});
	
	});	
	/*网站备案图标及编号*/
	$("#module_08").click(function() {
		$.fancybox.open({
			"href": "images/disclosure/img_03.png",
			"title": "从业人员概况"
		});
	
	});	
	/*网站备案图标及编号*/
	$("#module_09").click(function() {
		$.fancybox.open({
			"href": "images/disclosure/img_02.png",
			"title": "实际控股人与持股5%以上的股东"
		});
	
	});
		/*重大事项*/
//	$("#module_10").click(function() {
//	
//		$.fancybox.open({
//			
//			"title": "重大事项"
//		});
//	
//	});
});