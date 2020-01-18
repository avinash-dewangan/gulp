/**
 * This JS class is defined for asset cloud tree functions within the platform.
 */
"use strict";
var ModalID = "locationModal";
var url, type, download, image, image_type_gif;

$(document).delegate(".platformAssetReplacer", "click", function(){
	/**
	 * We will use data set to define variables 
	 */
	image = false, download = false;
	type = this.dataset.type;
	switch(type) {
		case "1":
			url="/admin/getintialassetsforall";
			image = true;
	        break;
		case "2":
			url="/admin/getintialassetsforall";
			download = true;
			break;
	    default:
			break;
	}
//	role = $(".roleName input").val();
	jstreeAssetCloud(url, type);
	
});

function jstreeAssetCloud(url, type){
	/**
	 * checks if JStree is already initialized on the location then destroy to start fresh
	 */
	var tree = $("#"+ModalID).jstree(true);
    if (tree) {
        $("#"+ModalID).jstree("destroy");
    }
    /**
     * Loads JSTree and sets callback functions for activity level on the same. 
     */
    $("#"+ModalID).on("changed.jstree", function(e, data) {
        if (data.selected.length) {
        	buttonEnablernadDisablerforAssetsForCommonFunction(e, data);
        }
    }).jstree({
        'core': {
            'multiple': false,
            "check_callback": true,
            'data': {
                "url": url,
                "data": function(node) {
                    return {
                        "id": node.id,
                        "processId": 0
                    };
                },
                "dataType": 'JSON',
                "dataFilter": function(data) {
                    return data;
                }
            }
        },
        "plugins": ["selected", "wholerow", "unique", "types"]
    }).bind("open_node.jstree", function(event, data) {
    	//after node is opened
    	treeIconChangerOpen(event, data); //available on admin redux js
    	disableAllElements(); //available on admin redux js
    }).bind("close_node.jstree", function(event, data) {
    	//after node is closes
    	treeIconChangerClose(event, data); //available on admin redux js
    }).bind('loaded.jstree', function(e, data) {
    	$(".general-button-enclosure button").hide();
    	$(".replaceAssetBtn, .cancelBtn").removeClass("hide").show();
    	$('#selectGroupUsermodal').modal("show");
    });
}

var permission = null;
function buttonEnablernadDisablerforAssetsForCommonFunction(e, data) {
	$(".replaceAssetBtn").addClass("pwdon0");
    //Approaching based upon icons which node carries
    var icon = data.instance.get_node(data.selected[0]).icon;
    selectedNodeType = data.instance.get_node(data.selected[0]).icon;
    parentsArray = data.instance.get_node(data.selected[0]).parents;
    selectedNodeParentId = data.instance.get_node(data.selected[0]).parent;
    selectedNode = data.instance.get_node(data.selected[0]).id;
    selectedNodeName = data.instance.get_node(data.selected[0]).text
    permission = data.instance.get_node(data.selected[0]).li_attr.permissionBy;
    var rootNodeId = data.instance.get_node(data.selected[0]).original.asset_root_node_id;
    if (icon == "glyphicon glyphicon-cloud") {
        $(".replaceAssetBtn").addClass("pwdon0");
    }
	if ((icon == "fa fa-folder") || (icon == "fa fa-folder-open") || icon == "fa fa-folder-locked" || icon == "fa fa-folder-locked-open" 
		|| icon == "glyphicon glyphicon-user") {
		$(".replaceAssetBtn").addClass("pwdon0");
	}
	if(((selectedNodeType == "glyphicon glyphicon-doc-file" || selectedNodeType == "glyphicon glyphicon-pdf-file") && download) || 
			((selectedNodeType == "glyphicon glyphicon-image" || selectedNodeType == "glyphicon glyphicon-video") && image)){
		$(".replaceAssetBtn").removeClass("pwdon0");
	}
    $("#LocationSelectedInfo").find(".fa-check-circle").addClass("fa-circle-thin").removeClass("fa-check-circle");
}

$(document).delegate(".replaceAssetBtn", "click", function(){
	image_type_gif = 0;
    $(this).addClass("pwdon0");
    var assetId = selectedNode;
    $.ajax({
        url: '/admin/downloadAsset',
        type: 'POST',
        data: {
            assetId: assetId
        },
        dataType: "json",
        beforeSend: function() {
            toggleProgressCircle(true);
        },
        success: function(response) {
            resetTimeout();
            if (response != null && response.result != null && response.result.status == 'success') {
                toggleProgressCircle(false);
                $(".modal-backdrop").remove();
                var assetPath = response.result.DEFECT_ID;
                if (selectedNodeType == "glyphicon glyphicon-doc-file" || selectedNodeType == "glyphicon glyphicon-pdf-file") {
                	$(".assetseditor").filter("[ineditmode='true']").parent().removeClass('gifOnlyBackgroundBlack');
                	assetReplacer(3, assetPath);
                	//TODO
                } else if (selectedNodeType == "glyphicon glyphicon-image") {
                	 if(assetPath.split(".").pop() == "GIF" || assetPath.split(".").pop() == "gif"){
                     	image_type_gif = 1;
                     	assetReplacer(1, assetPath);
                     	return;
                     }
                	imageEditorModalForCommonFunction(assetPath);
                } else if (selectedNodeType == "glyphicon glyphicon-video") {
                	$(".assetseditor").filter("[ineditmode='true']").parent().removeClass('gifOnlyBackgroundBlack');
                	assetReplacer(2, assetPath);
                }
            }
        }
    });
});

function imageEditorModalForCommonFunction(imageSRC) {
	if(cropper != undefined) cropper.destroy();
	$('#selectGroupUsermodal').modal("hide");
//	$($('#profileImageModal img')[1]).cropper('reset', true).cropper('clear').cropper('replace', blob);
	$($('#profileImageModal img')[1]).cropper("destroy");
    var divWidth = $(".impactDisplaySize").data().width;
    var divHeight = $(".impactDisplaySize").data().height;
    var tempRatio=divHeight/divWidth;
    if(window.innerWidth>1200){
		if(400<divHeight || 520 < divWidth){
			divWidth = divWidth*0.5;
			divHeight = divHeight*0.5;
		}
	}
    $($('#profileImageModal img')[1]).attr('src',imageSRC);
    $('#profileImageModal').css("opacity", "0");
    var image = $("#profileImageModal img")[1];
	var optionsImpact = {
			viewMode: 1,
			aspectRatio: divWidth/divHeight,
			dragMode: 'move',
			autoCropArea: 0,
			cropBoxMovable: false,
	        cropBoxResizable: false,
	        minContainerHeight: 450,
	        minContainerWidth: 520,
	        minCropBoxWidth: divWidth,
	        minCropBoxHeight: divHeight,
	        toggleDragModeOnDblclick: false,
	        guides: true,
	        highlight: false,
	        center: true
	      };
	cropper = new Cropper(image, optionsImpact);
	$("#profileImageModal").modal("show");
	setTimeout(function(){ $('#profileImageModal').css("opacity", "1"); }, 1000);
	
	
//    $($('#profileImageModal img')[1]).cropper({
//        viewMode: 1,
//        dragMode: 'move',
//        checkCrossOrigin: true,
//        checkImageOrigin: true,
//        autoCropArea: 0,
//        restore: false,
//        modal: true,
//        guides: true,
//        highlight: false,
//        center: true,
//        minContainerHeight: divHeight,
//        minContainerWidth: divWidth,
//        minCropBoxWidth: divWidth,
//        minCropBoxHeight: divHeight,
//        cropBoxMovable: false,
//        cropBoxResizable: false,
//        toggleDragModeOnDblclick: false,
//        built: function() {
//            $($('#profileImageModal img')[1]).cropper("setCropBoxData", {
//                width: divWidth,
//                height: divHeight
//            });
//            $('#profileImageModal').css("opacity", "1");
//        }
//    });
    
    
    
}


var imageTypeForDATAURL = 'image/jpeg';
var isSavedChanegs = 0;
var ivSectionImage = 0;
var blob;
$(document).delegate("#imageCropperH", "click", function(){
   // var imgCropped = $('#userImageEditor').cropper('getCroppedCanvas');
    //var dataurl = imgCropped.toDataURL(imageTypeForDATAURL);
	var croppedCanvas = cropper.getCroppedCanvas();
	var dataurl = croppedCanvas.toDataURL(uploadedImageType);
	var blob = dataURLtoBlob(dataurl);
    var formData = new FormData();
    var imgName = "imgCrop_" + (new Date).getTime();
    
    formData.append('myFile', blob);
    formData.append('myFileFileName', selectedNodeName);
    if($(".assetseditor").filter("[ineditmode='true']").parents('.fund-impact-elements').length > 0){
    	impactId = $(".assetseditor").filter("[ineditmode='true']").parents('.fund-impact-elements').attr("data-impactid");
    	formData.append('pk_fund_impact_id', impactId);
    	formData.append('assetFileName', selectedNodeName);
    }
    if($(".assetseditor").filter("[ineditmode='true']").parents('.fund-description-elements').length > 0){
    	fundId = $(".assetseditor").filter("[ineditmode='true']").parents('.fund-description-elements').attr("data-fundid");
    	formData.append('pk_fund_id', fundId);
    	formData.append('assetFileName', selectedNodeName);
    }
    $.ajax('/asset/uploadCroppedImage', {
        method: "POST",
        data: formData,
        processData: false,
        cache: false,
        contentType: false,
        enctype: 'multipart/form-data',
        dataType: "json",
        beforeSend: function() {
            $('#profileImageModal').css("opacity", "0");
        },
        success: function(response) {
            resetTimeout();
            if (response != null && response.result != null && response.result.status == 'success') {
            	assetReplacer(1, response.result.message);
            }
        },
        error: function(response) {
            
        }
    }).done(function() {
    	setTimeout(function() {
    		$('#profileImageModal').css("opacity", "1");
        }, 1000);
    });
});

// image - 1
// video - 2
var dynamicElement;
var text;
function assetReplacer(type, path){
	dynamicElement = null;
	switch (type) {
	  case 1:
		 if($('img.dynamic-inherit-class').length > 0)
			 $('#imgTag').attr('src', path);
     	 else
     		 dynamicElement = "<img title=\"\" id= \"" + "imgTag" + "\"  align=\"middle\" class= \"" + "dynamic-inherit-class imgTag" + " " + "new-imagediv" + "\" src= \"" + path + "\" alt= \"\" />";
		 		$("#per-img").val(selectedNodeName);
		 		$("#old-img-src").val(path);
		 		$("#assetCloud-r").css("display","none");
		 		$("#bio-i-p-r").css("display","block");
		break; 
	  case 2:
		  if($('iframe.dynamic-inherit-class').length > 0)
			  $('iframe.dynamic-inherit-class').attr('src', path);
		  else
			  dynamicElement = "<iframe title=\"video\" id= \"" + "videoTag" + "\" name=\"movie\" class= \"" + "dynamic-inherit-class" + "\" src= \"" + path + "\"  ineditmode=\"false\"  frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen> </iframe>";
		  	$("#assetCloud-r").css("display","none");
		  	$("#bio-i-p-r").css("display","block");
		  if(selectedNodeName=="" && $("#per-img").val() != ""){
				$("#per-img").val($("#per-img").val());
		  		$("#old-img-src").val($("#old-img-src").val());
		  }
		  else{
			  $("#per-img").val(selectedNodeName);
			$("#old-img-src").val(path);
		  }
		  break;
	  case 3:
		  $("#download-url").val(path);
		  $("#csvfilename").val(selectedNodeName);
		  break;
	  default: 
	    text = "Invalid";
	}
	if(dynamicElement !== null){
		var removableEle = $(".dynamic-inherit-class").addClass("removableElement");
	    $(".dynamic-inherit-class").parent().prepend(dynamicElement);
	    $(".removableElement").remove();
	    $("#assetCloud-r").css("display","none");
	      $("#bio-i-p-r").css("display","block");
	   
	}
	if(image_type_gif === 1){
		$('#imgTag').addClass("impact-gif-only");
	}
	
	$('#selectGroupUsermodal').modal('hide');
	$("#profileImageModal").modal("hide");
}

//AUTHOR : NIKITA 
//version 1.0
function commonJsTree(uniqueModalId,urlForJsTree,jsFunction,checkValue){
	var tree = $(uniqueModalId).jstree(true);
	if(tree){
		//check if js tree exist than destroy and re-initialize it.
		$(uniqueModalId).jstree("destroy");
	}
	$(uniqueModalId).on("changed.jstree", function(e, data) {
//		switch case based function accordingly
		if (data.selected.length){
		switch (checkValue) {
	    //which mean if String equals to
	    case "forMove":      // for move folder in System Admin
	    case "forMoveCP":     // For move CP in System Admin
	    case "forMoveCPinRA": // for move cp in report admin
	    case "forMoveCPiconInRA": 
	    case "forMoveCPiconInBA":
	    case "forMoveFolderInUser":
	    	buttonEnablerandDisablerforMove(e, data);
	    	break;
	    case "CPForSelectionBuilderDefault":   // or CP selection in builder default in System Admin
	    case "addContentPanelAfterInEditor": 
	    	buttonEnablernadDisablerforAddCP(e, data);
	        break;
	    case "contentPanelAddNew": //add new content panel
	    	buttonEnablernadDisablerforPreview(e, data,"15");
	    	break;
	    case "forContentPanel":   // For CP in System Admin
	    case "forCPinRA": // For CP in Report Admin
	    case "forCPinBA":// For CP in Brand Admin
	    	buttonEnablerandDisabler(e, data);
	        break;
	    case "forAssetsinSA":// For Assets in System Admin main page
	    case "forAssetPageInReportAdmin"://main page for asset in Report admin
	    	buttonEnablerandDisablerForAsset(e, data);
	    	break;
	    case "moveFolderAssetForSA":// For Assets in System Admin move folder 
	    case "addAssetMove":
	    	AssetbuttonEnablerandDisablerforMove(e, data);
	    	break;
	    case "moveFolderAssetForUser"://move folder in asset
	    case "addAssetMoveForUser"://add asset in particular folder
	    	buttonEnablerandDisablerForAssetMoveBrandAdmin(e, data); 
	    	break;
	    case "forAssetPageInUser"://main page for asset in user
	    	buttonEnablerandDisablerForAssetForUser(e, data);
	    	break;
	    case "forAssetPageInBrandAdmin"://main page for asset in brand admin
	    	buttonEnablerandDisablerForAssetForBA(e, data);
	    	break;
	    case "forSingleBuildSiteInRAandBA"://for single site build in Report Admin Page
	    case "forSingleBuildSiteInUser"://for single site build in User and Report Admin Page
	    	buttonEnablerandDisablerforRenderingonBNS(e, data);
	    	break;
	        
			}
		}
		/*common js Tree function */
	}).jstree({
		'core' : {
			'multiple' : false,
			"check_callback" : true,
			'data' : {
				"url" : urlForJsTree,
				"data" : jsFunction,
				"dataType" : 'JSON',
				"dataFilter" : function(data) {
					return data;
				}
			}
		},
		"plugins" : [ "selected", "wholerow", "unique","types" ]
	}).bind("open_node.jstree", function(event, data) {
		treeIconChangerOpen(event, data);
		switch (checkValue) {
	    //which mean if String equals to
	    case "forMove":      // for move folder in System Admin
	    case "forMoveCP":     // For move CP in System Admin
	    case "addContentPanelAfterInEditor": //from editor add new content panel
	    case "forMoveCPinRA":  
	    case "forMoveCPiconInRA":
	    case "forMoveCPiconInBA":
	    case "moveFolderAssetForSA":
	    case "moveFolderAssetForUser":
	    case "addAssetMove":
	    case "addAssetMoveForUser":
	    case "forMoveFolderInUser":
	    	 disabletreeIconChangerOpen(event,data);
	    	break;
			}
	}).bind("close_node.jstree", function(event, data) {
		treeIconChangerClose(event, data);
	}).bind('loaded.jstree', function(e, data) {
    	switch (checkValue) {
	    //which mean if String equals to
	    case "forMoveCPiconInBA":
	    case "forMoveFolderInUser":
	    	//Loaded JStree to remove other clouds
	    	disableOtherCloudsForBA();
	    	break;
	    default:
	    	//Loaded JStree to remove other clouds
	    	disableOtherClouds();
			}
    });
}

//AUTHOR : NIKITA 
//version : 1.0
/*this has been copied from admin_function.js */
function commonAssetFunctionForPublish(){
	if(parentId=='3' || parentId=='4' || parentId=='7'){
	var tree = $("#locationModal").jstree(true);
	if(tree){
		$("#locationModal").jstree("destroy");
	}
	$('#selectGroupUsermodal').modal('show');
	$("#locationModal").on("changed.jstree", function (e, data) {
		if(data.selected.length) {
			buttonEnablerandDisablerforMove(e, data);
		}
	}).jstree({
 		'core' : {
 			'multiple' : false,
 			"check_callback": true,
 			'data' : {
				"url" : "/admin/GetInitial",
				"data" : function (node) {
					return { "id" : node.id, "processId" : 16  };
				},
				"dataType": 'JSON',
				"dataFilter": function (data) {
					return data; 
				}
			}
 		},
		"plugins" : ["selected","wholerow","unique","types"]
	}).bind("open_node.jstree",function(event,data){
		treeIconChangerOpen(event,data);
        disabletreeIconChangerOpen(event,data);
    }).bind("close_node.jstree",function(event,data){
    	treeIconChangerClose(event,data);
    }).bind('loaded.jstree', function(e, data) {
        //Loaded JStree to remove other clouds
    	if(parentId=='3'||parentId=='7')
    		disableOtherClouds();
    	else if(parentId=='4')
        	disableOtherCloudsForBA();
    });
}
	else{
		//set active cp id from URL  from getAllUrlParams(url)
		var activecpId = getAllUrlParams(window.location.href).selectedcpid;
		//if active cp id is not present in url it means CP is not created and display the message according to it.
		if(activecpId == undefined || activecpId == null || activecpId == "" || activecpId == "null"){
			$('#setHeaderMessageForContentPanelPublish').html("Are you sure you want to publish this created content panel?");
		}else if(activecpId != null){
			$('#setHeaderMessageForContentPanelPublish').html("Are you sure you want to publish this edited content panel?");
		}
		$("#PublishCPModal").modal("show");
	}
}