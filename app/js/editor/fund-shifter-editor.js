var rowCnt;
$(window).load(function() {
	var dEles = $("#fundsorted").children("tr");
	for (var i = 0; i < dEles.length; i++) {
		$("#" + dEles[i].id).addClass("disabled");
	}
});

var tmpEl = [];
var direction = "L";
function pushStackFund(ele) {
	$(".dd-handle").removeClass("ddSel");
	tmpEl = [];
	if ($(ele).hasClass("dd-handle")) {
		direction = "R";
		if ($("#fundsorted").children("tr").length < 30) { $(".move-r").removeClass("pwdon0"); }
	} 
	if($(ele).hasClass("dd-selected")){
		direction = "L";
		$(".move-l").removeClass("pwdon0");
		if ($("#fundsorted").children("tr").length > 1) {
			$(".move-u").removeClass("pwdon0");
			$(".move-d").removeClass("pwdon0");
		}
	}
	tmpEl.push(ele);
	for (var i = 0; i < tmpEl.length; i++) {
		$(tmpEl[i]).addClass("ddSel");
	}
}
function mLeft() {
	//direction="L";
	if (direction == "R") {
		return false;
	}
	for (var i = 0; i < tmpEl.length; i++) {
		if ($("#fundsorted").children("tr").length > 0) {
			$("#fund"+tmpEl[0].dataset.id).removeClass("disabled");
			tmpEl[0].remove();
		}
	}
	reOrderfundAreaJS();
	$(".dd-handle").removeClass("ddSel");
	tmpEl = [];
	countRow();
}

function mClearRight(){
	if ($("#fundsorted").children("tr").length > 0) {
		for (var i = $("#fundsorted").children("tr").length; i > 0; i--) {
			$("#fund"+$("#fundsorted").children()[i-1].dataset.id).removeClass("disabled");
			$("#fundsorted").children()[i-1].remove();
		}
	}
	$(".dd-handle").removeClass("ddSel");
	tmpEl = [];
	countRow();
}
function mRight() {
	if($("#fundsorted").children("tr").length>29 || tmpEl.length == 0){
		return;
	}
	for(var i = 0; i< $("#fundsorted")[0].children.length;i++){
	    if ($("#fundsorted")[0].children[i].getAttribute('id') == tmpEl[0].id){ // any attribute could be used here
	    	return;
	    }
	}
	var length = $("#fundsorted").children("tr").length + 1;
	var selectedElonLeft = $("#linkFundTable").find(".ddSel")[0];
	if(selectedElonLeft == undefined){
		return;
	}
	var formatedInput = '<tr onclick="pushStackFund(this)" id="selectedfund'+selectedElonLeft.dataset.id+'" data-id="'+selectedElonLeft.dataset.id+'" data-name="rtretret" class="dd-selected '+selectedElonLeft.className+'" role="row">'
							+ '<td class="padding-left-in-data table-header-data1 text-holder left-align width-50 p-l-15" title="'+selectedElonLeft.children[0].title+'">'+selectedElonLeft.children[0].innerHTML+'</td>'
							+ '<td class="padding-left-in-data table-header-data1 text-holder left-align width-10">'
								+ '<div class="'+selectedElonLeft.children[1].children[0].className+'"  title="'+selectedElonLeft.children[1].children[0].title+'"></div>'
							+ '</td>'
							+ '<td class="padding-left-in-data table-header-data1 text-holder left-align width-25 p-l-20" title="'+selectedElonLeft.children[2].title+'">'+ selectedElonLeft.children[2].innerHTML +'</td>'
							+ '<input type="hidden" id="fundArea'+length+'" name="fundArea'+length+'" value="'+selectedElonLeft.dataset.id+'"/>'
						+ '</tr>';
	
	
	$("#fundsorted").append(formatedInput);
	$("#linkFundTable #" + tmpEl[0].id).addClass("disabled");
	$(".dd-handle").removeClass("ddSel");
	reOrderfundAreaJS();
	$(".move-udrlr").addClass("pwdon0");
	tmpEl = [];
	countRow();
}

function moveUp(){
	var movEle = $("#fundsorted")[0].getElementsByClassName("ddSel")[0];
	if (movEle == undefined) {
		return;
	}
	if ($(movEle).prev().length > 0) {
		movEle.after(movEle.previousElementSibling);
	}else{
		return;
	}
	reOrderfundAreaJS();
	if($("#fundsorted").children("tr").length > 1) {
		$(".move-u").removeClass("pwdon0");
		$(".move-d").removeClass("pwdon0");
	}
}

function moveDown(){
	var movEle = $("#fundsorted")[0].getElementsByClassName("ddSel")[0];
	if (movEle == undefined) {
		return;
	}
	if ($(movEle).next().length > 0) {
		movEle.before(movEle.nextElementSibling);
	}
	reOrderfundAreaJS();
	if ($("#fundsorted").children("tr").length > 1) {
		$(".move-u").removeClass("pwdon0");
		$(".move-d").removeClass("pwdon0");
	}
}

function reOrderfundAreaJS() {
	var elms = $("#fundsorted").children("tr");
	for (var i = 0; i < elms.length; i++) {
		$(elms[i]).children("input").attr("id", "fundArea" + (i + 1));
		$(elms[i]).children("input").attr("name", "fundArea" + (i + 1));
		$(elms[i]).children("input").removeAttr("disabled");
	}
}
$(window).load(function() {
	$(function() {
		var reOrderfundArea = function() {
			var elms = $("#fundsorted").children("tr");
			$(".dummy-gray-bg").removeClass("trWhite");
			for (var i = 0; i < elms.length; i++) {
				$(elms[i]).children("input").attr("id", "fundArea" + (i + 1));
				$(elms[i]).children("input").attr("name", "fundArea" + (i + 1));
				$(elms[i]).children("input").removeAttr("disabled");
				$("#tr" + i).addClass("trWhite");
			}
			tmpEl = [];
			$(".dd-handle").removeClass("ddSel");
		}
	});
});
//for count display on top of right side table
function countRow(){
	$('span.first-no').removeClass('color-red-20');
	rowCnt=$('#fundsorted tr').length;
	if(rowCnt == 30){
		$('span.first-no').addClass('color-red-20');
		$('span.first-no').css("color","#e35954");
	}
	else{
	$('span.first-no').removeAttr( "style" );
	}
	$('span.first-no').html(rowCnt);
}
$('#linkFundBtn').click(function(event){
	event.preventDefault();
	var recId= $("input[name='recordId']").val();
	var actionURL = "/admin/link-fund-modal-body-load?record-id="+recId;
	var myModal = $("#linkFundsCommonModal");
	var myModalBody = myModal.find('.modal-body');
	myModal.find('.modal-body');
	myModal.removeData('bs.modal');
	myModalBody.load(actionURL,function(responseTxt, statusTxt, xhr) {
		if (statusTxt == "success") {
			$('#linkFundsCommonModal #linkFundTable').dataTable({
				"scrollY": false,
				"searching": true,
				"sScrollX": false,
			    "scrollCollapse": true,
			    "bScrollCollapse": true,
			    "jQueryUI": true,
				"ordering": false,
				"bPaginate": false,
				"bFilter": false,
				"bInfo": false,
				"destroy":true,
				columnDefs: [{
					orderable: true,
					targets: "sort"
				}],
				aoColumnDefs: [{
					bSortable : false,
				    aTargets : [ 'action', 'text-holder' ]},
				    { "bSearchable": true, "bVisible": false, "aTargets": [ 3 ] },
				],
				"oLanguage": {"sEmptyTable": "<div class=\"empty-table\"><img src=\"../ui/images/admin/images/no-fund-data.png\" class=\"no-site-approval-iocn\"> <br> <font class=\"sites-awaiting-text\">No fund data available</font></div>",
					"sZeroRecords":"<div class=\"zero-record\">NO RESULTS FOUND FOR <span>SEARCH/FILTER</span></div>",
				    "sSearch": "<div class=\"col-lg-12 col-md-12 no-padding filter-wrapper\"><div class=\"inner-addon left-addon\"><i class=\"glyphicon filter-svg\"></i><input type=\"text\" class=\"form-control padding-top-7\" name=\"filter\" placeholder=\"Filter Funds...\" id=\"filter\" ></div></div>"
				    	}
			});
			$("#filter").attr('placeholder','Filter Funds...');
//		    $(".dataTables_scrollBody").niceScroll({touchbehavior:true});
			$('[data-toggle="tooltip"]').tooltip({html: true});
			$('[data-toggle="tooltip"]').tooltip({container: 'body', html: true});
			countRow();
			myModal.find('#type').val(type);
			myModal.find('#url').val(url);
			myModal.modal('show');
			toggleProgressCircle(false);
		}
		
	});
	
});
$(document).delegate("#userViewEditLinkFundBtn", "click", function(event){
	event.preventDefault();
	var recId= $("#BuildNewReportModal input[name='record-id']").val();
	var actionURL = "/admin/link-fund-modal-body-load?record-id="+recId;
	var myModal = $("#linkFundsCommonModal");
	var myModalBody = myModal.find('.modal-body');
	myModal.find('.modal-body');
	myModal.removeData('bs.modal');
	myModalBody.load(actionURL,function(responseTxt, statusTxt, xhr) {
		if (statusTxt == "success") {
			$('#linkFundsCommonModal #linkFundTable').dataTable({
				"scrollY": false,
				"searching": true,
				"sScrollX": false,
			    "scrollCollapse": true,
			    "bScrollCollapse": true,
			    "jQueryUI": true,
				"ordering": false,
				"bPaginate": false,
				"bFilter": false,
				"bInfo": false,
				"destroy":true,
				columnDefs: [{
					orderable: true,
					targets: "sort"
				}],
				aoColumnDefs: [{
					bSortable : false,
				    aTargets : [ 'action', 'text-holder' ]},
				    { "bSearchable": true, "bVisible": false, "aTargets": [ 3 ] },
				    ],
				 "oLanguage": {"sEmptyTable": "<div class=\"empty-table\"><img src=\"../ui/images/admin/images/no-fund-data.png\" class=\"no-site-approval-iocn\"> <br> <font class=\"sites-awaiting-text\">No fund data available</font></div>",
						"sZeroRecords":"<div class=\"zero-record\">NO RESULTS FOUND FOR <span>SEARCH/FILTER</span></div>",
					    "sSearch": "<div class=\"col-lg-12 col-md-12 no-padding filter-wrapper\"><div class=\"inner-addon left-addon\"><i class=\"glyphicon filter-svg\"></i><input type=\"text\" class=\"form-control padding-top-7\" name=\"filter\" placeholder=\"Filter Funds...\" id=\"filter\" ></div></div>"
					    	}
			});
			myModal.find("#filter").attr('placeholder','Filter Funds...');
			myModal.find('#linkFundTable_wrapper').addClass('user-side-link-fund');
			$('[data-toggle="tooltip"]').tooltip({html: true});
			$('[data-toggle="tooltip"]').tooltip({container: 'body', html: true});
			countRow();
			myModal.find('#recordId').val(recId);
//			myModal.find('#isFromPortfolio').val("yes");
			myModal.find('.ADD-NEW-FUND-BTN').addClass('hide');
			myModal.modal('show');
			toggleProgressCircle(false);
		}
		
	});
	
});
$(document).delegate("#userViewEditLinkFundBtnManual", "click", function(event){
	event.preventDefault();
	var recId= $("input[name='recordId']").val();
	var actionURL = "/admin/link-fund-modal-body-load?record-id="+recId;
	var myModal = $("#linkFundsCommonModal");
	var myModalBody = myModal.find('.modal-body');
	myModal.find('.modal-body');
	myModal.removeData('bs.modal');
	myModalBody.load(actionURL,function(responseTxt, statusTxt, xhr) {
		if (statusTxt == "success") {
			$('#linkFundsCommonModal #linkFundTable').dataTable({
				"scrollY": false,
				"searching": true,
				"sScrollX": false,
			    "scrollCollapse": true,
			    "bScrollCollapse": true,
			    "jQueryUI": true,
				"ordering": false,
				"bPaginate": false,
				"bFilter": false,
				"bInfo": false,
				"destroy":true,
				columnDefs: [{
					orderable: true,
					targets: "sort"
				}],
				aoColumnDefs: [{
					bSortable : false,
				    aTargets : [ 'action', 'text-holder' ]},
				    { "bSearchable": true, "bVisible": false, "aTargets": [ 3 ] },
				    ],
				    "oLanguage": {"sEmptyTable": "<div class=\"empty-table\"><img src=\"../ui/images/admin/images/no-fund-data.png\" class=\"no-site-approval-iocn\"> <br> <font class=\"sites-awaiting-text\">No fund data available</font></div>",
						"sZeroRecords":"<div class=\"zero-record\">NO RESULTS FOUND FOR <span>SEARCH/FILTER</span></div>",
					    "sSearch": "<div class=\"col-lg-12 col-md-12 no-padding filter-wrapper\"><div class=\"inner-addon left-addon\"><i class=\"glyphicon filter-svg\"></i><input type=\"text\" class=\"form-control padding-top-7\" name=\"filter\" placeholder=\"Filter Funds...\" id=\"filter\" ></div></div>"
					    	}
			});
			myModal.find("#filter").attr('placeholder','Filter Funds...');
			$('[data-toggle="tooltip"]').tooltip({html: true});
			$('[data-toggle="tooltip"]').tooltip({container: 'body', html: true});
			countRow();
			myModal.find('#recordId').val(recId);
			myModal.find('.ADD-NEW-FUND-BTN').addClass('hide');
			myModal.modal('show');
			toggleProgressCircle(false);
		}
		
	});
	
});
$(document).delegate("#userViewEditLinkFundBtnManualEditor", "click", function(event){
	event.preventDefault();
	toggleProgressCircle(true);
	var url = $("#url").val();
	var type= window.location.pathname.indexOf("edit-report") >0?'report':'site';
	var reportYear = getAllUrlParams(window.location.href).year;
	var recId= $("input[name='recordId']").val();
	var inputType = type;
	$('#type').val(inputType);
	var inputUrl = url;
	$('#url').val(inputUrl);
	var inputYear = reportYear;
	$('#reportYear').val(inputYear);
	if(recId==undefined || recId == "") recId=null;
	else recId=recId;
	var actionURL = "/admin/link-fund-modal-body-load-editor?record-id="+recId+"&url="+url+"&type="+type+"&reportYear="+reportYear;
	var myModal = $("#linkFundsCommonModal");
	var myModalBody = myModal.find('.modal-body');
	myModal.find('.modal-body');
	myModal.removeData('bs.modal');
	myModalBody.load(actionURL,function(responseTxt, statusTxt, xhr) {
		if (statusTxt == "success") {
			toggleProgressCircle(false);
			$('#linkFundsCommonModal #linkFundTable').dataTable({
				"scrollY": false,
				"searching": true,
				"sScrollX": false,
			    "scrollCollapse": true,
			    "bScrollCollapse": true,
			    "jQueryUI": true,
				"ordering": false,
				"bPaginate": false,
				"bFilter": false,
				"bInfo": false,
				"destroy":true,
				columnDefs: [{
					orderable: true,
					targets: "sort"
				}],
				aoColumnDefs: [{
					bSortable : false,
				    aTargets : [ 'action', 'text-holder' ]},
				    { "bSearchable": true, "bVisible": false, "aTargets": [ 3 ] },
				    ],
				    "oLanguage": {"sEmptyTable": "<div class=\"empty-table\"><img src=\"../ui/images/admin/images/no-fund-data.png\" class=\"no-site-approval-iocn\"> <br> <font class=\"sites-awaiting-text\">No fund data available</font></div>",
						"sZeroRecords":"<div class=\"zero-record\">NO RESULTS FOUND FOR <span>SEARCH/FILTER</span></div>",
					    "sSearch": "<div class=\"col-lg-12 col-md-12 no-padding filter-wrapper\"><div class=\"inner-addon left-addon\"><i class=\"glyphicon filter-svg\"></i><input type=\"text\" class=\"form-control padding-top-7\" name=\"filter\" placeholder=\"Filter Funds...\" id=\"filter\" ></div></div>"
					    	}
			});
			myModal.find("#filter").attr('placeholder','Filter Funds...');
			$('[data-toggle="tooltip"]').tooltip({html: true});
			$('[data-toggle="tooltip"]').tooltip({container: 'body', html: true});
			countRow();
			myModal.find('#recordId').val(recId);
			myModal.find('.ADD-NEW-FUND-BTN').addClass('hide');
			myModal.modal('show');
			toggleProgressCircle(false);
		}
		
	});
	
});
