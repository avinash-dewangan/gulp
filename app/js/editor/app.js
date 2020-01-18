var total_files_count = 0;
var proceesed_files_count = 0;
var failed_files_count = 0;
var success_files_count = 0;
var label;
var labelVal;
$(document).ready(function() {
	type= window.location.pathname.indexOf("edit-report") >0?'report':'site';
	noteText32MB();
	previewModalsite();
	contentPanelSapceBarMessages();
	//shiftTheContentPanelAccordingToPosition(type);
	$('#custom-select-button').click(function(){
		$('#file').click();
	});
	
	$('#addAndReplaceAssetBtn2').click(function(){
		$('#addAndReplaceAssetBtn2').css("display","none");
		$( '.box' ).submit();
	});
	
	$('#cancel-upload-before-after').click(function(){
		permission = "";
		resetFileForAssetsUpload();
	});
	
	var inputs = document.querySelectorAll( ".box__file" );
	Array.prototype.forEach.call( inputs, function( input )
	{
		    label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
//			var fileName = '';
//			validateAllowedFile(this.files);
//			if( this.files && this.files.length > 1 ){
//				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
//				total_files_count = this.files.length;
//			}else{
//				fileName = e.target.value.split( '\\' ).pop();
//				total_files_count = 1;
//			}
//			if( fileName ){
//				label.innerHTML = fileName;
//				$('#addAndReplaceAssetBtn2').removeClass('pwdon0');
//				$("#FileSelectedInfo").find(".fa-circle-thin").removeClass("fa-circle-thin").addClass("fa-check-circle");
//			}else{
//				label.innerHTML = labelVal;
//				total_files_count = 0;
//				$('#addAndReplaceAssetBtn2').addClass('pwdon0');
//				$("#FileSelectedInfo").find(".fa-check-circle").addClass("fa-circle-thin").removeClass("fa-check-circle");
//			}
		});
	});
	
	// feature detection for drag&drop upload sss

	var isAdvancedUpload = function()
		{
			var div = document.createElement( 'div' );
			return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
		}();


	// applying the effect for every form
		
	$( '.box' ).each( function()
	{
		var $form		 = $( this ),
			$input		 = $form.find( 'input[type="file"]' ),
			$label		 = $form.find( 'label' ),
			$errorMsg	 = $form.find( '.box__error span' ),
			$restart	 = $form.find( '.box__restart' ),
			droppedFiles = false,
			showFiles	 = function( files )
			{
				$label.text( files.length > 1 ? ( $input.attr( 'data-multiple-caption' ) || '' ).replace( '{count}', files.length ) : files[ 0 ].name );
				$("#addAndReplaceAssetBtn2").addClass("pwdon0");
				if((selectedNodeType == "fa fa-folder") || (selectedNodeType == "fa fa-folder-open" || selectedNodeType == "glyphicon glyphicon-user")){
					if(permission == "BA" && total_files_count > 0){
						$(".fa-circle-thin").removeClass("fa-circle-thin").addClass("fa-check-circle");
						$("#addAndReplaceAssetBtn2").removeClass("pwdon0");
					}
				}
			};

		// letting the server side to know we are going to make an Ajax request
		$form.append( '<input type="hidden" name="ajax" value="1" />' );

		// automatically submit the form on file select
		$input.on( 'change', function( e ){
			var fileName = '';
			validateAllowedFile(this.files);
			if( this.files && this.files.length > 1 ){
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
				total_files_count = this.files.length;
			}else{
				fileName = e.target.value.split( '\\' ).pop();
				total_files_count = 1;
			}
			if( fileName ){
				label.innerHTML = fileName;
				$('#addAndReplaceAssetBtn2').removeClass('pwdon0');
				$("#FileSelectedInfo").find(".fa-circle-thin").removeClass("fa-circle-thin").addClass("fa-check-circle");
			}else{
				label.innerHTML = labelVal;
				total_files_count = 0;
				$('#addAndReplaceAssetBtn2').addClass('pwdon0');
				$("#FileSelectedInfo").find(".fa-check-circle").addClass("fa-circle-thin").removeClass("fa-check-circle");
			}
			
			if(this.files.length > 0){
				showFiles( e.target.files );
			}
		});


		// drag&drop files if the feature is available
		if( isAdvancedUpload )
		{
			$form
			.addClass( 'has-advanced-upload' ) // letting the CSS part to know drag&drop is supported by the browser
			.on( 'drag dragstart dragend dragover dragenter dragleave drop', function( e )
			{
				// preventing the unwanted behaviours
				e.preventDefault();
				e.stopPropagation();
			})
			.on( 'dragover dragenter', function() //
			{
				$form.addClass( 'is-dragover' );
			})
			.on( 'dragleave dragend drop', function()
			{
				$form.removeClass( 'is-dragover' );
			})
			.on( 'drop', function( e )
			{	//Initial code
				//droppedFiles = e.originalEvent.dataTransfer.files; // the files that were dropped
				//showFiles( droppedFiles );
				
				//my code for same functionalities
				$('#file').val("");
				var inputs = document.querySelectorAll( ".box__file" );
				inputs[0].files = e.originalEvent.dataTransfer.files;
				total_files_count = e.originalEvent.dataTransfer.files.length;
				$(".box__file").trigger("change");
			});
		}


		// if the form was submitted

		$form.on( 'submit', function( e )
		{
			//disabling button on submitting form
			$('#addAndReplaceAssetBtn2').addClass('pwdon0');
			//disabling cancel button on modal while processing all files
			$('#cancel-upload-before-after').addClass('pwdon0');
			// preventing the duplicate submissions if the current one is in progress
			if( $form.hasClass( 'is-uploading' ) ) return false;
			
			$form.addClass( 'is-uploading' ).removeClass( 'is-error' );
			$('.box__uploading').addClass('valign-wrapper-important');
			if( isAdvancedUpload ) // ajax file upload for modern browsers
			{
				e.preventDefault();
				proceesed_files_count = 0;
				/*if( droppedFiles )
				{
					$.each( droppedFiles, function( i, file )
					{
						ajaxData.append( $input.attr( 'name' ), file );
					});
				}*/
				var files = $input[0].files;
				$('#file_name_progressbar').html("processing....");
				$('#file_count_progressbar').html("0 of "+total_files_count);
				$.each( files, function( i, file ){
					//ajaxData.delete('fileUpload');
					
					if(removedFileNamePosition.indexOf(i)>-1 || file.size == 0){
						console.log('before');
						proceesed_files_count = proceesed_files_count+1;
						var width=(((proceesed_files_count)/total_files_count)*100);
						$('#progress_bar').css('width',width + "%");
						$('#file_name_progressbar').html(file.name+" not supported");
						$('#file_count_progressbar').html(proceesed_files_count+" of "+total_files_count);
						failed_files_count = failed_files_count + 1;
						console.log('after');
						if(total_files_count == 1){
							$('.box__uploading').removeClass('valign-wrapper-important');
							$('#assetsUploadForm').removeClass( 'is-uploading uploaded_success').addClass('upload_failed');
							$('#failureResponseWrapper').html("<span class='col-faliure font-size-18'>UPLOAD FAILED</span>");
							$('#progress_bar').css("width","0%");
							$('.input-file-cus-label').html('Drag files here to upload');
							setTimeout(function(){
								proceesed_files_count = 0;
								total_files_count = 0;
								failed_files_count = 0;
								success_files_count = 0;
								$('#assetsUploadForm').removeClass('uploaded_success upload_failed');
								$('#file').val("");
								$('#file_name_progressbar').html("");
								$('#file_count_progressbar').html("");
								$('#cancel-upload-before-after').removeClass('pwdon0');
								//$('#upload-assets-in-que').removeClass('pwdon0');
							},3000);
							setTimeout(function(){
								resetFileForAssetsUpload();
							},3000);
						}
						return;
					}
					
					var ajaxData = new FormData();
					ajaxData.append("fileUpload", file );
					ajaxData.append("parentId", selectedNode);
					ajaxData.append("assetRootNodeId", 1);
					ajaxData.append("brandId", null);
					// ajax request
					$.ajax(
					{
						url: 			$form.attr( 'action' ),
						type:			$form.attr( 'method' ),
						data: 			ajaxData,
						dataType:		'json',
						contentType:	false,
						processData:	false,
						
					});
					
				});
				if(total_files_count == failed_files_count){
					$('.box__uploading').removeClass('valign-wrapper-important');
					$('#assetsUploadForm').removeClass( 'is-uploading uploaded_success').addClass('upload_failed');
					$('#failureResponseWrapper').html("<span class='col-faliure font-size-18'>UPLOAD FAILED</span>");
					$('#progress_bar').css("width","0%");
					$('.input-file-cus-label').html('Drag files here to upload');
					setTimeout(function(){
						proceesed_files_count = 0;
						total_files_count = 0;
						failed_files_count = 0;
						success_files_count = 0;
						$('#assetsUploadForm').removeClass('uploaded_success upload_failed');
						$('#file').val("");
						$('#file_name_progressbar').html("");
						$('#file_count_progressbar').html("");
						$('#cancel-upload-before-after').removeClass('pwdon0');
						//$('#upload-assets-in-que').removeClass('pwdon0');
					},3000);
					setTimeout(function(){
						resetFileForAssetsUpload();
					},3000);
				}
			}
			else // fallback Ajax solution upload for older browsers
			{
				var iframeName	= 'uploadiframe' + new Date().getTime(),
					$iframe		= $( '<iframe name="' + iframeName + '" style="display: none;"></iframe>' );

				$( 'body' ).append( $iframe );
				$form.attr( 'target', iframeName );

				$iframe.one( 'load', function()
				{
					var data = $.parseJSON( $iframe.contents().find( 'body' ).text() );
					$form.removeClass( 'is-uploading' ).addClass( data.success == true ? 'is-success' : 'is-error' ).removeAttr( 'target' );
					if( !data.success ) $errorMsg.text( data.error );
					$iframe.remove();
				});
			}
		});


		// restart the form if has a state of error/success

		$restart.on( 'click', function( e )
		{
			e.preventDefault();
			$form.removeClass( 'is-error is-success' );
			$input.trigger( 'click' );
		});

		// Firefox focus bug fix for file input
		$input
		.on( 'focus', function(){ $input.addClass( 'has-focus' ); })
		.on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
	});
	
	$(document).ajaxSuccess(function( event, xhr, settings ) {
		resetTimeout();
		if(settings.url == "/uploadassets/uploadResource"){
			var response = $.parseJSON(xhr.responseText);
			if(response.result) {	
				proceesed_files_count = proceesed_files_count+1;
				var width=(((proceesed_files_count)/total_files_count)*100);
				$('#progress_bar').css('width',width + "%");
				$('#file_name_progressbar').html("");
				$('#file_count_progressbar').html("");
			}
			if(response!= null && response.result != null && response.result.code ==  201){
				success_files_count = success_files_count + 1;
				$('#file_name_progressbar').html(response.result.message);
				$('#file_count_progressbar').html(proceesed_files_count+" of "+total_files_count);
				if(width == 100){
					setTimeout(function(){
						$('.box__uploading').removeClass('valign-wrapper-important');
						$('#assetsUploadForm').removeClass( 'is-uploading upload_failed').addClass('uploaded_success');
						if(success_files_count == 1){
							if(failed_files_count == 0 ){
								filesUploaded = " file uploaded.";
							}else{
								filesUploaded = " file uploaded";
							}
							
						}else{
							if(failed_files_count == 0 && total_files_count==success_files_count){
								filesUploaded = " files uploaded.";
							}else{
								filesUploaded = " files uploaded ";
							}
							
						}
						if(failed_files_count > 0){
							$('#successResponseWrapper').html("<span class='col-green font-size-18'>"+response.result.status+":</span> "+
									success_files_count+filesUploaded+" & "+ failed_files_count + " failed.");
						}else{
							$('#successResponseWrapper').html("<span class='col-green font-size-18'>"+response.result.status+":</span> "+success_files_count+filesUploaded);
						}
						$('#progress_bar').css("width","0%");
						$('.input-file-cus-label').html('or <font class=\"draft-file-lable\">drag and drop here</font>');
						setTimeout(function(){
							proceesed_files_count = 0;
							total_files_count = 0;
							failed_files_count = 0;
							success_files_count = 0;
							$('#assetsUploadForm').removeClass('uploaded_success');
							$('#file').val("");
							$('#file_name_progressbar').html("");
							$('#file_count_progressbar').html("");
							$("#assetlocationModal").jstree("load_node","#"+selectedNode);
							$('#cancel-upload-before-after').removeClass('pwdon0');
							resetFileForAssetsUpload();
							//$('#addAndReplaceAssetBtn2').removeClass('pwdon0');
						},3000);
					},2000);
				}
			} else if(response!= null && response.result != null && response.result.code ==  400) {
				$('#file_name_progressbar').html(response.result.message);
				$('#file_count_progressbar').html(proceesed_files_count+" of "+total_files_count);
				failed_files_count = failed_files_count + 1;
				if(width == 100 && total_files_count == 1){
					setTimeout(function(){
						$('.box__uploading').removeClass('valign-wrapper-important');
						$('#assetsUploadForm').removeClass( 'is-uploading uploaded_success').addClass('upload_failed');
						$('#failureResponseWrapper').html("<span class='col-faliure font-size-18'>UPLOAD FAILED</span>");
						$('#progress_bar').css("width","0%");
						$('.input-file-cus-label').html('or <font class=\"draft-file-lable\">drag and drop here</font>');
						setTimeout(function(){
							proceesed_files_count = 0;
							total_files_count = 0;
							failed_files_count = 0;
							success_files_count = 0;
							$('#assetsUploadForm').removeClass('uploaded_success upload_failed');
							$('#file').val("");
							$('#file_name_progressbar').html("");
							$('#file_count_progressbar').html("");
							$('#cancel-upload-before-after').removeClass('pwdon0');
							resetFileForAssetsUpload();
							//$('#addAndReplaceAssetBtn2').removeClass('pwdon0');
						},3000);
					},2000);
				}else{
					if(width == 100){
						setTimeout(function(){
							$('.box__uploading').removeClass('valign-wrapper-important');
							$('#assetsUploadForm').removeClass( 'is-uploading upload_failed').addClass('uploaded_success');
							if(success_files_count == 1){
								if(failed_files_count == 0 ){
									filesUploaded = " file uploaded.";
								}else{
									filesUploaded = " file uploaded";
								}
								
							}else{
								if(failed_files_count == 0 && total_files_count==success_files_count){
									filesUploaded = " files uploaded.";
								}else{
									filesUploaded = " files uploaded ";
								}
								
							}
							if(failed_files_count > 0){
								$('#successResponseWrapper').html("<span class='col-green font-size-18'>"+response.result.status+":</span> "+
										success_files_count+filesUploaded+" & "+ failed_files_count + " failed.");
							}else{
								$('#successResponseWrapper').html("<span class='col-green font-size-18'>"+response.result.status+":</span> "+success_files_count+filesUploaded);
							}
							$('#progress_bar').css("width","0%");
							$('.input-file-cus-label').html('or <font class=\"draft-file-lable\">drag and drop here</font>');
							setTimeout(function(){
								proceesed_files_count = 0;
								total_files_count = 0;
								failed_files_count = 0;
								success_files_count = 0;
								$('#assetsUploadForm').removeClass('uploaded_success');
								$('#file').val("");
								$('#file_name_progressbar').html("");
								$('#file_count_progressbar').html("");
								$("#assetlocationModal").jstree("load_node","#"+selectedNode);
								$('#cancel-upload-before-after').removeClass('pwdon0');
								//$('#addAndReplaceAssetBtn2').removeClass('pwdon0');
								resetFileForAssetsUpload();
							},3000);
						},2000);
					}
				}
			}
		}
	});
});

function resetFileForAssetsUpload() {
	total_files_count = 0;
	$('#file').val("");
	$('.uploaderNewFlow').remove();
	$('.input-file-cus-label').html('or <font class=\"draft-file-lable\">drag and drop here</font>');
	$(".box__input").append('<span id="FileSelectedInfo" class="FileSelectedInfoCSS uploaderNewFlow"><i class="fa fa-circle-thin" aria-hidden="true"></i>&nbsp;File selected</span>');
	$(".box__input").append('<span id="LocationSelectedInfo" class="LocationSelectedInfoCSS uploaderNewFlow"><i class="fa fa-circle-thin" aria-hidden="true"></i>&nbsp;Location selected</span>');
	$('#addAndReplaceAssetBtn2').addClass('pwdon0');
	$('#addAndReplaceAssetBtn').addClass('pwdon0');
	$('#addAndReplaceAssetBtn2').css("display","block");
}

//functions for checking allowed file types
var re = /(?:\.([^.]+))?$/;
var allowedExt = ["doc","docx","pdf","gif","txt","vcf","xls","key","ppt","pptx","jpeg","jpg","png","csv","3gp","avi","mov","mp4","flv","webm","xlsx",
                  "DOC","DOCX","PDF","GIF","TXT","VCF","XLS","KEY","PPT","PPTX","JPEG","JPG","PNG","CSV","3GP","AVI","MOV","MP4","FLV","WEBM","XLSX"];
var allowedImageFileType = ["gif","GIF","jpeg","JPEG","png","PNG","jpg","JPG"];
var AllowedFileList = [];
var removedFileName = [];
var removedFileNamePosition = [];
var mb_32inKB = 32768;
function validateAllowedFile(selectedFileArray){
	AllowedFileList = [];
	removedFileName = [];
	removedFileNamePosition = [];
	for(i=0; i<selectedFileArray.length;i++){
		var file = selectedFileArray[i];
		var fileName = file.name;
		var fileSize = Math.round(selectedFileArray[i].size / 1024);
		var ext = re.exec(fileName)[1];
		var fileTypeBySize = true;
		if(fileSize > mb_32inKB && allowedImageFileType.indexOf(ext) > -1){
			fileTypeBySize = false;
		}
		if(allowedExt.indexOf(ext) > -1){
			AllowedFileList.push(selectedFileArray[i]);
		}else{
			removedFileName.push(fileName);
			removedFileNamePosition.push(i);
		}
	}
	return;
}
var ss = null;
function rejectedFileViwer(){
	ss = "";
	if(removedFileName.length){
		for(i=0;i<removedFileName.length;i++){
			ss = ss + " " + removedFileName[i];
		}
	}
}

function wait(ms) {
	var start = new Date().getTime();
	var end = start;
	while (end < start + ms) {
		end = new Date().getTime();
	}
}



/**Start New**/
function noteText32MB(){
/*for Note 32MB**/
if($('#assetUploadSiteEditorModal').length){
	if ($('.note-worring-text')[0]){
		$('.note-worring-text').remove();
	}
	$("#assetUploadSiteEditorModal .margintop-tree-body-modal" ).after(
		"<div id='noteText32MB' class='note-worring-text col-xs-12'>"+
		"<font class='font-color-ovrture-red not-warriing-font-family'>NOTE:</font>&nbsp;Images greater than 32 megabytes can not be uploaded."+
		"</div>");
}
/*for Note 32MB**/
}

/*for site content panel message**/
function contentPanelSapceBarMessages(){
	if($('#addContentPanelsSiteModal').length){
		if ($('#addContentPanelsSiteModal .cp-preview-msg')[0]){
			$('#addContentPanelsSiteModal .cp-preview-msg').remove();
		}
		$("#addContentPanelsSiteModal .margintop-tree-body-modal" ).after(
				"<div class='col-lg-12 col-md-12 col-xs-12 no-padding cp-preview-msg'>"+ 
		           "<lable class='press-space-massage'>"+
		             "select content panel and press spacebar for preview"+ 
		           "</lable>"+ 
		          "</div>"
		);
	}
}

/*for site content panel message**/


function previewModalsite(){
	if ($('#CpPreviewModal')[0]){
		$('#CpPreviewModal').remove();
	}
	$("#printBridgePreviewModal").after(
	"<div class='modal fade bs2-example-modal-lg notification-modal-with-worring center-align vertical-center-new' data-backdrop='static' id='CpPreviewModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>"+ 
    "<div class='modal-dialog modal-md vertical-align-modal-window fixed-modal-width'>"+ 
     "<div class='modal-content Rename-body-contect-modal worring-modal-body-content'>"+ 
      "<div class='row-fluid'>"+ 
       "<div class='modal-header padding0'>"+ 
        "<div class='col-xs-12 no-padding'>"+ 
         "<h1 class='lead green bold modal-title create-new-group groupNameForUserList noti-header-font modal-left-padding20 modal-header-font-color'>CONTENT PANEL PREVIEW</h1>"+ 
        "</div>"+ 
       "</div>"+ 
       "<div class='row modal-body'>"+ 
        "<!--<h1 class='lead green bold noti-header-font'></h1>-->"+ 
        "<div class='controls controls-row'>"+ 
         "<div class='controls controls-row'>"+ 
          "<div class='control-group '>"+ 
           "<div class='col-xs-12 no-padding0'>"+ 
            "<div class=''>"+ 
             "<iframe id='cp-preview-container' srcdoc=''> </iframe>"+ 
            "</div>"+ 
           "</div>"+ 
           "<div class='col-xs-12 no-padding delet-modal-button-make-canter brand-asses-margin-top '>"+ 
            "<input type='hidden' name='fname' id='folderName'>"+ 
            "<button id='cancelPreviewBtn' class='btn noti-button cp-preview-exit red-button create-folder-cancel-button scroll-toggle-cancel-delete btn-distance ui-btn ui-shadow ui-corner-all' data-dismiss='modal'> BACK </button>"+ 
           "</div>"+ 
          "</div>"+ 
         "</div>"+ 
        "</div>"+ 
       "</div>"+ 
      "</div>"+ 
     "</div>"+ 
    "</div>"+ 
   "</div>"
	)
}



$(document).ready(function(){
	function isSelectGroupModalForContentPanel(){
		if($('.modal.in#selectGroupUsermodal').length > 0){
			return $('.modal.in#CpPreviewModal').length > 0 ? false : true ;
		}
	}
	function isAddContentPanelsSiteModal(){
		if($('.modal.in#addContentPanelsSiteModal').length > 0){
			return $('.modal.in#CpPreviewModal').length > 0 ? false : true ;
		}
	}
	$(document).keydown(function(event){
		if (event.which === 32 && isSelectGroupModalForContentPanel() == true) {
			requestCpPreview(1, selectedNode, selectedNodeName);
			return !(event.keyCode == 32);
		}else if (event.which === 32 && isAddContentPanelsSiteModal() == true) {
			requestCpPreview(1, selectedNode, selectedNodeName);
			return !(event.keyCode == 32);
		}else if (event.which === 32 && $('.modal.in#CpPreviewModal').length > 0) {
			event.preventDefault();
			$("#CpPreviewModal").modal("hide");
		}
		return;
	});
	
});




//For Content Panel Preview
function requestCpPreview(processId, selectedNode, selectedNodeName) {
    $.ajax({
        type: "POST",
        url: "/cprendering/content-panel-preview",
        data: {
        	'process-id' : processId,
            'content-panel-id' : selectedNode,
            'content-panel-name' : selectedNodeName
        },
        dataType: "json",
        success: function(data) {
            toggleProgressCircle(false);
            $("#CpPreviewModal").find('h1').text('');
			$("#CpPreviewModal").find('h1').text(selectedNodeName);
            $('#cp-preview-container').attr('srcdoc', data.result.html);            
            $('#CpPreviewModal').modal('show');
        }
    });
}



/*function deleteRGCP(eleId){
	if($('#'+eleId).length > 0){
    	sectionId = $('#'+eleId).parent()[0].id;
    	$("#" + sectionId).children().remove();
        destroySlickCarousel('photoGalleryCarousel');
        activeContentPanels();
        reorderStack();
        $(".addContentpanelAfter").removeClass("pwdon0");
        $(".addCarouselPanelOuter").prop('title', 'Add content panel');
        panelbuttonDisabler();
        imageCarouselInitializer();
    }
}*/


/**for builder default table and greeting message**/


