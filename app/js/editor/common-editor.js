//modal body load for bringing list of cover images
$(document).delegate(".changeCoverPicture", "click", function(){
	var url="/asset/select-cover-image"+"?type="+type+"&brand-id="+$('#tempId').val();
	var siteId=$("#siteIdForCoverImage").val();
	var reportId=$("#reportIdForCoverImage").val();
	if(siteId != undefined)
		url=url+"&siteId="+siteId;
	else if(reportId != undefined)
		url=url+"&reportId="+reportId;
	   	Editor(url,"COVER IMAGES", null, "SELECT COVER IMAGE");
	   	$(".changeCoverPicture").addClass("pwdon0");
});

var selectedNodeMoveTo = "";
var parentsArray = [];
function buttonEnablerandDisablerforMove(e, data){
	//this function optimized for CP - 27/08/2019
	var icon = data.instance.get_node(data.selected[0]).icon;
	selectedNodeMoveTo = data.instance.get_node(data.selected[0]).id;
	parentsArray = data.instance.get_node(data.selected[0]).parents;
	localStorage.setItem('selectedNodeId',selectedNodeMoveTo);
	localStorage.setItem('rootNodeId', parentsArray[parentsArray.length - 2]);
	//asset changes
	var rootNodeId = parentsArray[parentsArray.length - 2];
	if(selectedNodeMoveTo == 1 || selectedNodeMoveTo == 2 || selectedNodeMoveTo == 6){
		$('#moveToPermission').addClass("pwdon0")
		$('#moveToPermissionForAsset').addClass("pwdon0")
	}else{
		$('#moveToPermission').removeClass("pwdon0");
		$('#moveToPermissionForAsset').removeClass("pwdon0")
	}
	if(icon == "glyphicon glyphicon-text-background-cp"){
		$('#moveToPermission').addClass("pwdon0")
		$('#moveToPermissionForAsset').addClass("pwdon0")
	}
	if(icon == "fa-fa-folder-system-template" || icon == "fa fa-folder-locked" || icon == "fa fa-folder-locked-open"){
		//asset changes
		if(rootNodeId == 2 && (icon == "fa-fa-folder-brand-open" || icon == "fa-fa-folder-brand-closed")) {
			$('#moveToPermission').removeClass("pwdon0");
			$('#moveToPermissionForAsset').removeClass("pwdon0")
		} else {
			$('#moveToPermission').addClass("pwdon0")
			$('#moveToPermissionForAsset').addClass("pwdon0")
		}
	}
	if(icon == "glyphicon glyphicon-cloud"){
		$('#moveToPermission').addClass("pwdon0")
		$('#moveToPermissionForAsset').addClass("pwdon0")
	}
}