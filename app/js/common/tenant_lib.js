/**
 * ************************************
 * editor-lib
 * editor-output-lib
 * output-lib
 * ************************************
 */


/**************************************
 * editor-lib 
 * - site and report Editor library
 * - content panel creation library
 * - brodcast creation library
 * - this library through out all tenant      
 *************************************/
if (window.location.pathname.indexOf("edit") > 0 || 
    window.location.pathname.indexOf("BroadcastTemplate") > 0 || 
    window.location.pathname.indexOf("content-panels") > 0 ||
    window.location.pathname.indexOf("srcdoc")==0) {

/******************************************************************************
 * Created By : Avinash Dewangan & Priti Agrawal
 * Variable :  To setup general functionality as core functions.
 * Description : Global variable description section and functions.
 ******************************************************************************/
    var progressBar = "";
    var noOfMaxCPAllowed = 11;
    var successIcon = "<i class=\"fa fa-check-circle\"></i>";
    var errorIcon = "<i class=\"fa fa-exclamation-circle\"></i>";
    var type;
    var isSavedChanegs = 0;
    var redirectLocation = null;
    var pageRequested = null;
    var pageName = $("#IdPage").val();
    var tempId = $("#tempId").val();
    var url = $("#url").val();
    var sectionId;
    var element;
    var sliderViewsHTML = []; // unused
    var sliderViewsHTML2 = []; // unused
    var sliderViewsHTML3 = []; // unused
    var sliderViewsHTML4 = []; // unused
    var ivSectionVideo = 0; // unused
    var ivSectionImage = 0;
    var ivSectionVideoClass = null; // unused
    var ivSectionImageClass = null; // unused
    var modalfooter;
    var iswebImg = null;
    var sldrSection = null;
    var carouselId = null;
    var imageConvertClasses = null;
    var videoConvertClasses = null;
    var documentConvertClasses = null;
    var duplicateSectionId = null;
    var brandId = null;
    var selectedTemp = null;
    var prevBrandId = null; // unused
    var noOfSlidesPerCP = null;
    // Variables for Cropper.js functions
    var divHeight;
    var divWidth;
    var imgCrop = 0; // unused
    var imageTypeForDATAURL = 'image/jpeg';
    // Variable for assets replacer
    var document_only = 0;
    var image_only = 0;
    var video_only = 0;
    var doc_not_allowed = 0;
    // variable for assets upload
    var selectedNodeType = null;
    var assetEditorFilterTrue = $(".assetseditor").filter("[ineditmode='true']");

    //document var
    var documentEditorInline = false;
    var impactId = null;
    var myCarousel = null;
    var contentPanelId = null;
    var addORChangeLayout = null;
    var isSpecialsContentPanel = false;
    //un-used variable
    var saveImageData = "";
    // un-used variable
    var saveData = "";
    var list = [];
    // this variable used many times
    var listOfDeletedSection = [];
    var view;
    // Unused variable
    var greetingPanelAdd = 0;
    var appendAfter = null;
    var pb_carouselId = null;
    var pb_carousel = null;
    var heading_cp_input = undefined;

    /***********************************************************************************
     * Created By : Avinash Dewangan
     * Description : remove grammarly mutation
     **********************************************************************************/
    function init() {
        try {
            $('.inline-textEditor').removeAttr('data-gramm_id');
            $('.inline-textEditor').removeAttr('data-gramm_editor');
            $("grammarly-btn").remove();
            $('.inline-textEditor').attr("data-gramm", "false");
            init_grammerly_not_supported();

            EditorDragAndDropDisabled();
           

        } catch (err) {
            console.log(err.message)
        }

    }

    $('.slideDiv').css("display", "none");
    $('.panelDiv').css("display", "none");
    $('.addCarouselPanelOuter').css("display", "block");
    $('#undoButton').css("display", "none");

    /************************************************************************************
     * Created By : Avinash Dewangan
     * Description : Method includes functions to be 
     * executed after dom is ready
     ***********************************************************************************/
    function init_after_ready() {
        try {
        	editor_copyURL_readyJs();
            init();
            noOfMaxCPAllowed = 7 + $("#FUND_SOA").length + $("#FUND_DESCRIPTION").length + $("#FUND_IMPACT").length + $("#FUND_PERFORMANCE").length;
            type = window.location.pathname.indexOf("edit-report") > 0 ? 'report' : 'site';
            pageRequested = null;

            //shiftTheContentPanelAccordingToPosition(type);
            changeCoverImageOnPageLoad(type);

            /* MMC set sidebar top in site editor (top right corner) */
            notification_on_page_load();

            /* for removing delay while editor is initialized */
            initializeInlineEditor();

            try {
                imageCarouselInitializer();
            } catch (err) {
                console.log(err.message);
            }

            if ($("#chartsDetails").length > 0) {
                chartgraphs();
            }
            $(".carousel").off('keydown.bs.carousel');
            $('.changeSliderButton, #setTextBlocksButton').css({
                "display": "block"
            });

            $('.go-to-fund-wrapper').css({
                "display": "none"
            });
            url = $("#url").val();
            pageName = $("#IdPage").val();
            tempId = $("#tempId").val();
            if (pageName === "index") {
                $('.modal-backdrop').css({
                    "display": "None"
                });
                redirectLocation = "/site/edit?u=" + url + "&Pag=index";
            }
            if (pageName === "A") {
                redirectLocation = "/site/edit?u=" + url + "&Pag=A";
            }
            if (pageName === "C") {
                redirectLocation = "/site/edit?u=" + url + "&Pag=C";
            }

            brandListing();

            // show vdoEditor and imgEditor button ....
            $(".imgEditor, .vdoEditor").css("display", "block");

            //site button disabler
            SlideButtonsDisabler();

            if (localStorage.getItem('saveFunctionCalled') == "1") {
                siteSaveSuccessfulNotifier();
            }

            $("#addAndReplaceAssetBtn2, .has-advanced-upload").mouseover(function () {
                $('.has-advanced-upload').css("border", "2px solid #00afaa");
            });

            $("#addAndReplaceAssetBtn2, .has-advanced-upload").mouseout(function () {
                $('.has-advanced-upload').css("border", "2px solid #cddadd");
            });

        } catch (err) {
            console.log(err.message)
        }
    }


    function brandListing() {
        try {
            //brand listing show
            if ($(".brand-listing").length > 0) {
                $.ajax({
                    url: '/admin/brandlistforsiteeditor?type=' + type,
                    type: 'POST',
                    dataType: "json",
                    success: function (response) {
                        $(".brand-listing").children().remove();
                        if (response != null) {
                            $(".brand-listing").append("<li onmouseout=\"hideDropdownView('dropdown','selectedBrand')\" onmouseover=\"showDropdownView('dropdown','selectedBrand')\" onchange=\"changeBrand()\" onclick=\"activeBrandFiler(this,'selectBrandDD" + 0 + "','selectedBrand','dropdown','')\" id=\"selectBrandDD" + 0 + "\" value=\"0\"> PRIMARY </li>");
                            if ((response.length) > 0) {
                                var resLength = response.length;
                                for (var i = 0; i < resLength; i++) {
                                    $(".brand-listing").append("<li onmouseout=\"hideDropdownView('dropdown','selectedBrand')\" onmouseover=\"showDropdownView('dropdown','selectedBrand')\" onchange=\"changeBrand()\" onclick=\"activeBrandFiler(this,'selectBrandDD" + response[i].id + "','selectedBrand','dropdown','')\" id=\"selectBrandDD" + response[i].id + "\"  value=\"" + response[i].id + "\">" + response[i].name + "</li>");
                                }
                            }
                            selectedTemp = $("#tempId")[0].value;
                            localStorage.setItem('selectedTemp', selectedTemp);
                            if ($('ul.brand-listing').find('li[value=' + selectedTemp + ']').length != 0) {
                                $('#selectedBrand').val($('ul.brand-listing').find('li[value=' + selectedTemp + ']')[0].textContent);
                            } else {
                                $('#selectedBrand').val("EXPIRED");
                            }

                        } else {
                            $(".brand-listing").append("<li onmouseout=\"hideDropdownView('dropdown','selectedBrand')\" onmouseover=\"showDropdownView('dropdown','selectedBrand')\" onchange=\"changeBrand()\" onclick=\"activeBrandFiler(this,'selectBrandDD" + 0 + "','selectedBrand','dropdown','')\" id=\"selectBrandDD" + 0 + "\" value=\"0\"> PRIMARY </li>");
                        }
                    }
                });
            }
        } catch (err) {
            console.log(err.message)
        }
    }





    /************************************************************************************
     * Created By : 
     * Description : NA
     ************************************************************************************/
    $(function () {
        //document-ready start

        /* *********************************************(function())********************** */
        $(".assetseditor").filter("[ineditmode='true']").attr('ineditmode', 'false');
        var svg = 1;
        var sliderImg = $("#getAssetsEditorModal").find('.modal-body');
        sliderImg.delegate(".sliderViewPopUP", "click", function () {
            isSavedChanegs = 1;
            $(this).addClass('pwdon0');
            var dataItem = $(this).find(".viewData").html();
            var dataNo = $(this).attr('sectionview');
            // var dataItem = sliderViewsHTML[dataNo];
            // console.log(dataNo);
            // console.log(dataItem);
            if (addORChangeLayout > 0) {
                $("#" + contentPanelId).find(".carousel-inner").find(".active").children().remove();
                $("#" + contentPanelId).find(".carousel-inner").find(".active").attr("childItemId", dataNo)
                $("#" + contentPanelId).find(".carousel-inner").find(".active").append(dataItem);
                success_generic_notification("SLIDE LAYOUT CHANGED");
            } else {
                // var noOfSlidesPerCP =
                // $("#"+myCarousel).children('.carousel-inner').children().length;
                var noOfSlidesPerCP = $("#" + contentPanelId).find('.carousel-inner').children().length;
                if (svg > 0) {
                    svg = 0;
                    noOfSlidesPerCP = noOfSlidesPerCP + 1;
                    if (noOfSlidesPerCP <= 6) {
                        console.log("clicked");
                        $("#" + contentPanelId).find(".carousel-inner").find(".active").clone().insertAfter($("#" + contentPanelId).find(".carousel-inner").find(".active"));
                        $("#" + contentPanelId).find(".carousel-inner").find(".active").first().removeClass("active");
                        $("#" + contentPanelId).find(".carousel-inner").find(".active").children().remove();
                        $("#" + contentPanelId).find(".carousel-inner").find(".active").attr("childItemId", dataNo);
                        $("#" + contentPanelId).find(".carousel-inner").find(".active").append(dataItem);
                        $("#" + contentPanelId).find('.carousel-indicators-common').children("li").last().clone().insertAfter($("#" + contentPanelId).find('.carousel-indicators-common').children("li").last());
                        // var newSlideNo = $("#" +
                        // myCarousel).children('.carousel-indicators-common').children("li").last();
                        var newSlideNo = $("#" + contentPanelId).find('.carousel-indicators-common').children("li").last();
                        var newSlideNoChange = newSlideNo[0];
                        dataNo = $("#" + contentPanelId).find(".carousel-inner").children().length;
                        newSlideNoChange.setAttribute("data-slide-to", dataNo - 1);
                        $(newSlideNoChange).css("margin-left", "5px");
                        // newSlideNoChange.innerHTML = $("#" +
                        // myCarousel).children('.carousel-indicators-common').children("li").length;
                        $("#" + contentPanelId).find('.carousel-indicators-common').children(".active").next().addClass('active');
                        $("#" + contentPanelId).find('.carousel-indicators-common').children(".active").first().removeClass('active');
                        noOfSlidesPerCP = $("#" + contentPanelId).children('.carousel-inner').children().length;
                    }
                    svg = 1;
                    success_generic_notification("SLIDE ADDED");
                }
            }
            initializeInlineEditor();
            $("#getAssetsEditorModal").modal('hide');
            slideindibuttonDisabler(contentPanelId, myCarousel);

        });

        $(".slideSecClass").delegate(".textEditor", "click", function () {
            var edt = $(this).attr("class");
            // alert(edt);
            console.log(edt);
            if (edt.indexOf("non-editable") == -1) {
                if (edt.indexOf("gal-span-color") > -1) {
                    resorcesPanel = 1;
                } else {
                    resorcesPanel = 0;
                }
                showEditor($(this), 'false');
            }
        });

        $(".slideSecClass").delegate(".textBlock", "click", function () {
            var edt = $(this).attr("class");
            sectionId = $(this).attr('sectionId');
            if (edt.indexOf("non-editable") == -1) {
                if (edt.indexOf("editable-TextBlocks") == -1) {
                    console.log("call texteditor in false");
                    showEditor($(this), 'false');
                } else {
                    element = $(this);
                    console.log("call texteditor in true");
                    showEditor($(this), 'true');
                    $(this).attr('ineditmode', 'true');
                }
            }

        });

        $(".slideSecClass").delegate(".imageEditor", "click", function () {
            console.log("carousel-inner");
            var edt = $(this).attr("class");
            if (edt.indexOf("non-editable") == -1) {
                var ineditmode = $(this).attr("ineditmode");
                console.log(ineditmode);
                var href = $(this).children('img').attr('href');
                if (ineditmode == "false") {
                    $(this).attr("ineditmode", "true");
                    $(".image-hyperlink").css({
                        "display": "block"
                    });
                    if (href != undefined) {
                        $("#hyperlinkVal").val(href);
                    } else {
                        $("#hyperlinkVal").val("http://");
                    }
                    Editor($(this).attr("actionUrl"), "image", null, "SELECT AN IMAGE");

                }
            }
        });

        $(".slideSecClass").delegate(".videoEditor", "click", function () {

            var edt = $(this).attr("class");
            if (edt.indexOf("non-editable") == -1) {
                $(this).attr("ineditmode", "true");

                Editor($(this).attr("actionUrl"), "video", null, "SELECT A VIDEO");
            }
        });

        $(document).delegate(".non-editable", "click", function (e) {
            if (((e.offsetX > (this.offsetWidth - 15)) && e.offsetY < 15) || ((e.offsetX > (this.offsetWidth - 15)) && e.offsetY > 15)) {
                return;
            }
            $("#editable-non-editable-msg").html("LOCKED: NOT EDITABLE").stop().fadeIn(200).delay(2000).fadeOut(200);
        });

        $(".replace-buttonDiv").hover(function () {
            $(this).css("display", "block");
        }, function () {
            $(this).css("display", "none");
        });

        $(".slideSecClass").on('mouseenter', '.show-replace-btn', function () {
            $(this.nextElementSibling).css("display", "block");
        });
        $(".slideSecClass").on('mouseleave', '.show-replace-btn', function () {
            $(this.nextElementSibling).css("display", "none");
        });
        $(".slideSecClass").on('mouseenter', '.replace-buttonDiv', function () {
            $(this).css("display", "block");
        });

        $("#photoGallery").on('mouseenter', '.show-replace-btn', function () {
            $(this.nextElementSibling).css("display", "block");
        });
        $("#photoGallery").on('mouseleave', '.show-replace-btn', function () {
            $(this.nextElementSibling).css("display", "none");
        });
        $("#photoGallery").on('mouseenter', '.replace-buttonDiv', function () {
            $(this).css("display", "block");
        });
        $("#mainStackGrettingPnael").on('mouseenter', '.show-replace-btn', function () {
            $(this.nextElementSibling).css("display", "block");
        });
        $("#mainStackGrettingPnael").on('mouseleave', '.show-replace-btn', function () {
            $(this.nextElementSibling).css("display", "none");
        });
        $("#mainStackGrettingPnael").on('mouseenter', '.replace-buttonDiv', function () {
            $(this).css("display", "block");
        });

        /* *********************************************(function())********************** */

        $("a").click(function (event) {
            event.preventDefault();
        });
        $("a.assetseditor.documentEditor").click(function (event) {
            event.preventDefault();
        });
        $(document).delegate("a.assetseditor.documentEditor", "click", function () {
            event.preventDefault();
        });
        $(".assetseditor").delegate("a", "click", function () {
            event.preventDefault();
        });
        $(document).delegate("a.hyperLinkEditor", "click", function () {
            event.preventDefault();
        });
        $(document).delegate(".inline-textEditor", "contextmenu", function (event) {
            var ele = $(this)
            onClickTinyMCE(ele);
        });

        $(document).delegate(".inline-textEditor", "click", function () {
            var ele = $(this);
            onClickTinyMCE(ele);
        });

        /************************************************************************************
         * Created By : Saurabh
         * Description : doc gallery doc replace fun 
         ************************************************************************************/

        $(".slideSecClass").delegate(".documentEditor:not(div.inline-textEditor)", "click", function (event) {
            if ($(event.target).is('div.inline-textEditor p')) {
                event.preventDefault();
                var ele = $(this).children().find(".inline-textEditor");
                documentEditorInline = true;
                onClickTinyMCE($(ele));
                return false;
            } else if ($(event.target).is('div.inline-textEditor')) {
                event.preventDefault();
                return;
            } else if ($(event.target).is('p')) {
                event.preventDefault();
                return false;
            }
            event.preventDefault();
            $(this).addClass('pwdon0');
            document_only = 0;
            isSavedChanegs = 1;
            image_only = 0;
            $(".assetseditor").filter("[ineditmode='true']").attr('ineditmode', 'false');
            $(".documentEditor").filter("[ineditmode='true']").attr('ineditmode', 'false');
            document_only = 2;
            $(this).closest('a').attr("ineditmode", "true");
            var tree = $("#assetlocationModal").jstree(true);
            var edt = $(this).attr("class");
            if (tree) {
                $("#assetlocationModal").jstree("destroy");
            }
            if (edt.indexOf("non-editable") == -1) {
                $("#assetlocationModal").on("changed.jstree", function (e, data) {
                    if (data.selected.length) {
                        buttonEnablernadDisablerforAssets(e, data);
                    }
                }).jstree({
                    'core': {
                        'multiple': false,
                        "check_callback": true,
                        'data': {
                            "url": "/admin/getintialassetsforall",
                            "data": function (node) {
                                return {
                                    "id": node.id,
                                    "processId": 0
                                };
                            },
                            "dataType": 'JSON',
                            "dataFilter": function (data) {
                                console.log(data);
                                return data;
                            }
                        }
                    },
                    "plugins": ["selected", "wholerow", "unique", "types"]
                }).bind("open_node.jstree", function (event, data) {
                    treeIconChangerOpen(event, data);
                    disableAllElements();
                }).bind("close_node.jstree", function (event, data) {
                    treeIconChangerClose(event, data);
                }).bind('loaded.jstree', function (e, data) {
                    resetFileForAssetsUpload();
                    $("#assetUploadSiteEditorModal").css("display", "block");
                    $('#assetUploadSiteEditorModal').modal('show');
                });
            } else {
                $(this).removeClass('pwdon0');
                $("#editable-non-editable-msg").html("LOCKED: NOT EDITABLE").stop().fadeIn(200).delay(2000).fadeOut(200);
                $(".modal-backdrop").remove();
                return;
            }
            $(this).removeClass('pwdon0');
        });
        /************************************************************************************
         * Created By : Saurabh
         * Description : replace assets on editor
         ***********************************************************************************/

        $(".slideSecClass , #photoGalleryCarousel , #mainStackGrettingPnael, #greetingsPanel").delegate(".replace-button", "click", function () {
            $('.replace-buttonDiv').css('display', 'none');
            $('#home-page').append("<div class=\"modal-backdrop fade in\"></div>");
            $(this).addClass('pwdon0');
            document_only = 0;
            image_only = 0;
            $(".assetseditor").filter("[ineditmode='true']").attr('ineditmode', 'false');
            var edt = $(this).closest('div').siblings().attr("class");
            if (edt.indexOf("non-editable") == -1) {
                imageConvertClasses = $(this).attr('imagedivclass');
                videoConvertClasses = $(this).attr('videodivclass');
                documentConvertClasses = $(this).attr('documentdivclass');
                duplicateSectionId = $(this).closest('div').siblings().attr('sectionId');
                undofunctionId = "undo_" + (new Date).getTime();
                undoLastState = $(this).closest('div').siblings();
                var ineditmode = $(this).closest('div').siblings().attr("ineditmode");
                console.log(ineditmode);
                var href = $(this).closest('div').siblings().attr('href');
                if (ineditmode == "false") {
                    $(this).closest('div').siblings().attr("ineditmode", "true");
                    $(".image-hyperlink").css({
                        "display": "block"
                    });
                    if (href != undefined) {
                        $("#hyperlinkVal").val(href);
                    } else {
                        $("#hyperlinkVal").val("http://");
                    }
                    ivSectionImage = 1;
                }
            } else {
                $(this).removeClass('pwdon0');
                $("#editable-non-editable-msg").html("LOCKED: NOT EDITABLE").stop().fadeIn(200).delay(2000).fadeOut(200);
                $(".modal-backdrop").remove();
                return;
            }
            // Remove modal backdrop in escape key press
            $(document).keydown(function (e) {
                if (e.keyCode == 27) {
                    setTimeout(function () {
                        $(".modal-backdrop").remove();
                    }, 200);
                }
            });
            var getActionUrl = $(this).attr("actionUrl");
            if (getActionUrl === "/asset/libraryDocument") {
                document_only = 1;
                doc_not_allowed = 0;
            } else if (getActionUrl === "/asset/libraryImage") {
                image_only = 1;
                doc_not_allowed = 0;
            } else if (getActionUrl === "/asset/impactMediaLibrary" || getActionUrl === "/asset/descriptionMediaLibrary") {
                doc_not_allowed = 1;
            } else if (getActionUrl === "/asset/mediaLibrary") {
                doc_not_allowed = 0;
            }
            var tree = $("#assetlocationModal").jstree(true);
            if (tree) {
                $("#assetlocationModal").jstree("destroy");
            }
            $("#assetlocationModal").on("changed.jstree", function (e, data) {
                if (data.selected.length) {
                    buttonEnablernadDisablerforAssets(e, data);
                }
            }).jstree({
                'core': {
                    'multiple': false,
                    "check_callback": true,
                    'data': {
                        "url": "/admin/getintialassetsforall",
                        "data": function (node) {
                            return {
                                "id": node.id,
                                "processId": 0
                            };
                        },
                        "dataType": 'JSON',
                        "dataFilter": function (data) {
                            console.log(data);
                            return data;
                        }
                    }
                },
                "plugins": ["selected", "wholerow", "unique", "types"]
            }).bind("open_node.jstree", function (event, data) {
                treeIconChangerOpen(event, data);
                disableAllElements();
            }).bind("close_node.jstree", function (event, data) {
                treeIconChangerClose(event, data);
            }).bind('loaded.jstree', function (e, data) {
                resetFileForAssetsUpload();
                $("#assetUploadSiteEditorModal").css("display", "block");
                $('#assetUploadSiteEditorModal').modal('show');
                $('#addAndReplaceAssetBtn2').css("display", "block");
            });
            $(this).removeClass('pwdon0');
        });
        /************************************************************************************
         * Created By : Saurabh
         * Description : slider-collapsing-icon
         ************************************************************************************/
        $('.slider-collapsing-icon').click(function () {
            if ($(document.getElementById('page-container')).find("iframe").length) {
                var count = $(document.getElementById('page-container')).find("section").find("iframe").length;
                for (var i = 0; i < count; i++) {
                    var sectionId = $(document.getElementsByClassName('main-body-container')).find("section").find("iframe")[i].getAttribute('sectionId');
                    $('.' + sectionId).each(function () {
                        var el_src = $(this).attr("src");
                        $(this).attr("src", el_src);
                    });
                }
            }
        });
        /************************************************************************************
         * Created By : Saurabh 
         * Description : assets replace click function on editor
         ************************************************************************************/
        $("#addAndReplaceAssetBtn").click(function () {
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
                beforeSend: function () {
                    toggleProgressCircle(true);
                },
                success: function (response) {
                    resetTimeout();
                    isSavedChanegs = 1;
                    if (response != null && response.result != null && response.result.status == 'success') {
                        toggleProgressCircle(false);
                        $(".modal-backdrop").remove();
                        var assetPath = response.result.DEFECT_ID;
                        if (selectedNodeType == "glyphicon glyphicon-doc-file" || selectedNodeType == "glyphicon glyphicon-pdf-file") {
                            $(".assetseditor").filter("[ineditmode='true']").parent().removeClass('gifOnlyBackgroundBlack iframBlackColor');
                            if (document_only == 1) {
                                documentReplaceOnly(assetPath);
                            } else if (document_only == 2) {
                                documentReplaceOnlyForDocumentGallery(assetPath);
                            } else {
                                documentAssetReplace(assetPath);
                            }
                        } else if (selectedNodeType == "glyphicon glyphicon-image") {
                            if (assetPath.split(".").pop() == "GIF" || assetPath.split(".").pop() == "gif") {
                                image_type_gif = 1;
                                gifOnlyImageReplacer(assetPath);
                                $(".assetseditor").filter("[ineditmode='true']").parent().removeClass('iframBlackColor');
                                return;
                            }
                            imageEditorModal(assetPath);
                        } else if (selectedNodeType == "glyphicon glyphicon-video") {
                            $(".assetseditor").filter("[ineditmode='true']").parent().removeClass('gifOnlyBackgroundBlack');
                            videoAssetReplace(assetPath);
                        }
                    }
                }
            });
        });

        /************************************************************************************
         * Created By : Saurabh 
         * function : changeSlider Description : change slider functionality
         ***********************************************************************************/

        $(".slideSecClass").delegate(".changeSlider", "click", function () {
            $(this).addClass('pwdon0');
            contentPanelId = this.parentElement.parentNode.parentElement.parentElement.id;
            myCarousel = this.parentElement.parentNode.parentElement.children[2].id;
            isSpecialsContentPanel = $(this).closest("section.slideSecClass").find(".carousel").hasClass("isSpecials");
            var cpId = $(this.parentElement.parentNode.parentElement).attr("cpid");
            var classList = this.parentElement.className;
            if (classList.indexOf("slide-glyphicon-file") > -1) {
                addORChangeLayout = 1;
            } else {
                addORChangeLayout = 0;
            }
            Editor("/asset/librarySliderView?DefaultCPId=" + cpId, "addLayout", contentPanelId, "SLIDE LAYOUT");
            modalFooter = $("#getAssetsEditorModal").find('.modal-footer').css('display', 'none');
        });
        /************************************************************************************
         * Created By : Saurabh 
         * Description : NA
         ************************************************************************************/
        $("#setTextBlocksButton").click(function () {
            $("#textEditorModal").modal('hide');
            getTextBlocks();
        });


        /************************************************************************************
         * Created By : Saurabh
         * Description :
         ************************************************************************************/
        $('body').on('hidden.bs.modal', '.modal', function (e) {
            if (e.currentTarget.id == "AssetPreviewModal") {
                console.log("AssetPreview");
                $('#assetlocationModal').focus();
            } else {
                $(".assetseditor").filter("[ineditmode='true']").attr('ineditmode', 'false');
            }
        });
        /***********************************************************************************
         * Created By : Saurabh
         * Description : NA
         ***********************************************************************************/
        // TODO
        $("#assetlocationModal").keydown(function (event) {
            if (event.which === 32) {
                if (selectedNodeType == "glyphicon glyphicon-image" || selectedNodeType == "glyphicon glyphicon-pdf-file" || selectedNodeType == "glyphicon glyphicon-video") {
                    var id = selectedNode;
                    $.ajax({
                        url: '/admin/PreviewAsset',
                        type: 'get',
                        data: {
                            id: id
                        },
                        async: false,
                        dataType: "json",
                        beforeSend: function () {
                            toggleProgressCircle(true);
                            $(".asset-preview-colse-btn").css('display', 'none');
                        },
                        success: function (response) {
                            if (response != null && response.result != null) {
                                var assetUrl = response.result.message;
                                if (selectedNodeType == "glyphicon glyphicon-pdf-file") {
                                    window.open(assetUrl);
                                    toggleProgressCircle(false);
                                } else if (selectedNodeType == "glyphicon glyphicon-image") {
                                    $('#assetId').empty();
                                    $("#assetId").append("<img src='' name='movie' class='col-xs-12 preview-modal-image-video' ineditmode='false' frameborder='0'/>");
                                    $("#AssetPreviewModal").find('span').text('');
                                    $("#AssetPreviewModal").find('span').text(selectedNodeName);
                                    // assetUrl =
                                    // assetUrl.replace("_compressed","");
                                    $("#AssetPreviewModal").find('img').attr('src', assetUrl);
                                    $("#AssetPreviewModal").find('img')[0].onload = function () {
                                        toggleProgressCircle(false);
                                        $(".asset-preview-colse-btn").css('display', 'block');
                                    };
                                    $("#AssetPreviewModal").modal("show");
                                    return !(event.keyCode == 32);
                                } else if (selectedNodeType == "glyphicon glyphicon-video") {
                                    $('#assetId').empty();
                                    $("#assetId").append("<iframe src='' name='movie' class='col-xs-12 preview-modal-image-video' ineditmode='false' frameborder='0'></iframe>");
                                    $("#AssetPreviewModal").find('span').text('');
                                    $("#AssetPreviewModal").find('span').text(selectedNodeName);
                                    $("#AssetPreviewModal").find('iframe').attr('src', assetUrl);
                                    $("#AssetPreviewModal").find('iframe')[0].onload = function () {
                                        toggleProgressCircle(false);
                                        $(".asset-preview-colse-btn").css('display', 'block');
                                    };
                                    $("#AssetPreviewModal").modal("show");
                                    return !(event.keyCode == 32);
                                }
                                return !(event.keyCode == 32);
                            } else if (response != null && response.result != null && response.result.status == 'failure') { }
                        }
                    });
                }
                return !(event.keyCode == 32);
            }
            return;
        });


        /************************************************************************************
         * Created By : Saurabh
         * Description : pause if AssetPreviewModal have video
         ************************************************************************************/
        $('#AssetPreviewModal').on('hide.bs.modal', function () {
            $('#AssetPreviewModal .preview-modal-image-video').remove();
            $('#assetId').empty();
        });



        /**********************************************************************************
         * created By : Saurabh
         * Description : NA
         *********************************************************************************/
        $(document).delegate(".image-cropper-cancel-button", "click", function () {
            $("#getAssetsEditorModal").modal("hide");
            $(".modal-backdrop").remove();
        });
        /**********************************************************************************
         * created By : Saurabh
         * Description : NA
         *********************************************************************************/
        $(document).delegate("#cancel-upload-before-after", "click", function () {
            $(".modal-backdrop").remove();
            doc_not_allowed = 0;
        });
        /**********************************************************************************
         * created By : Saurabh
         * Description : NA
         *********************************************************************************/
        $("#saveBiohref").click(function () {
            isSavedChanegs = 1;
            var myModalLink = $('#boiHrefText').val();
            if (myModalLink.indexOf("mailto:") > -1) {
                $(".hyperLinkEditor").filter("[ineditmode='true']")[0].href = myModalLink;
            } else {
                $(".hyperLinkEditor").filter("[ineditmode='true']")[0].href = myModalLink;
            }
            $("#bioHrefModal").modal('hide');
        });
        /**********************************************************************************
         * created By : Saurabh
         * Description : NA
         *********************************************************************************/
        $(".galleryEditor").click(function () {
            var edt = $(this).attr("class");
            if (edt.indexOf("non-editable") == -1) {
                // Editor($(this).attr("actionUrl"),"Images",true);
                Editor($(this).attr("actionUrl"), "image", true, "SELECT AN IMAGE");
                $("input#saveListButton").attr('disabled', 'disabled');
            }
        });
        /**********************************************************************************
         * created By : Saurabh
         * Description : NA
         *********************************************************************************/
        $(document).on('click', 'img#selectLibraryImage', function () {
            try {
                $(this).addClass('pwdon0');
                divWidth = $(".assetseditor").filter("[ineditmode='true']").width();
                divHeight = $(".assetseditor").filter("[ineditmode='true']").height();
                $('#getAssetsEditorModal').css("opacity", "0");
                Editor("/asset/imageCropperModal", "Image Cropper", $(this).attr('compressedImagesrc'), "EDIT IMAGE");
                $(this).removeClass('pwdon0');
            } catch (err) {
                console.log(err.message);
            }
        });

        /************************************************************************************
         * Created By : Saurabh
         * Description : NA
         ***********************************************************************************/
        $(document).keydown(function (event) {
            if (event.which === 32 && isABootstrapModalOpen() == true && $('#AssetPreviewModal.modal.in')[0].id === "AssetPreviewModal") {
                event.preventDefault();
                $("#AssetPreviewModal").modal("hide");
            }
            return;
        });





        /**********************************************************************************
         * created By : Saurabh
         * Description : NA
         *********************************************************************************/
        $("body").on("click", "#imageCropperH", function () {
            impactId = impactId;
            var imgCropped = $('#CropperImageSet').cropper('getCroppedCanvas');
            var dataurl = imgCropped.toDataURL(imageTypeForDATAURL);
            var blob = dataURLtoBlob(dataurl);
            var formData = new FormData();
            var imgName = "imgCrop_" + (new Date).getTime();
            formData.append('myFile', blob);
            formData.append('myFileFileName', selectedNodeName);
            if ($(".assetseditor").filter("[ineditmode='true']").parents('.fund-impact-elements').length > 0) {
                impactId = $(".assetseditor").filter("[ineditmode='true']").parents('.fund-impact-elements').attr("data-impactid");
                formData.append('pk_fund_impact_id', impactId);
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
                beforeSend: function () {
                    $('#getAssetsEditorModal').css("opacity", "0");
                    modalBody.children().remove();
                    modalBody.append("<div class=\"image-upload-s3-progress-tackle no-padding col-md-offset-1 col-md-10\"><h3>Saving Data Please Wait...</h3></div>");
                },
                success: function (response) {
                    resetTimeout();
                    if (response != null && response.result != null && response.result.status == 'success') {
                        var imgpath = response.result.message;
                        isSavedChanegs = 1;
                        var ss = $(".assetseditor").filter("[ineditmode='true']");
                        ss.parent().removeClass('gifOnlyBackgroundBlack');
                        if (ivSectionImage == 1) {
                            var imgElement = "<img alt=\"image\" class= \"" + imageConvertClasses + " " + undofunctionId + "\" sectionId= \"" + duplicateSectionId + "\" src= \"" + imgpath + "\"ineditmode=\"false\" frameborder=\"0\">";
                            ss.addClass("removableElement");
                            ss.parent().prepend(imgElement);
                            ss.remove();
                            ss.attr('ineditmode', 'false');
                            ivSectionImage = 0;
                        } else {
                            ss.children('img').attr('src', imgpath);
                            ss.attr('ineditmode', 'false');
                        }
                        activateUNDO();
                        $('#getAssetsEditorModal').modal('hide');
                        $('#assetUploadSiteEditorModal').modal('hide');
                        $('#assetUploadSiteEditorModal').css("display", "block");
                        $('.modal-backdrop').remove();
                        success_generic_notification("ASSET REPLACED");
                    }
                    $("#imageCropperH").cropper('reset', true).cropper('clear').cropper('replace', blob);
                },
                error: function (response) {
                    validation.removeClass().addClass('alert alert-danger').html(response.result.message);
                    $("#fullpwd").val("");
                }
            }).done(function () {
                setTimeout(function () {
                    $('#getAssetsEditorModal').css("opacity", "1");
                }, 1000);
            });
            $(".assetseditor").filter("[ineditmode='true']").parent().removeClass('iframBlackColor');
        });


        /**********************************************************************************
         * created By : Saurabh
         * Description : NA
         *********************************************************************************/

        $("#editor-save-button").click(function () {
            isSavedChanegs = 1;
            assetEditorFilterTrue = $(".assetseditor").filter("[ineditmode='true']");
            assetEditorFilterTrue.html(editor.i.contentWindow.document.body.innerHTML);
            if (resorcesPanel == 1) {
                var galleryChangeVar = $(".assetseditor").filter("[ineditmode='true']");
                var anchor = galleryChangeVar.find('a');
                if (anchor.length > 0) {
                    var anchortext = anchor[0].text;
                    var anchorhref = anchor[0].href;
                    anchor.after(anchortext);
                    anchor.remove();
                    if (anchorhref == "http:") {
                        galleryChangeVar.parent()[0].removeAttribute("href");
                    } else {
                        galleryChangeVar.parent()[0].setAttribute("href", anchorhref);
                    }
                }
            }
            assetEditorFilterTrue.attr('ineditmode', 'false');
            $("#textEditorModal").modal('hide');
        });
        /**********************************************************************************
         * created By : Saurabh
         * Description : NA
         *********************************************************************************/
        $("#uploadResource").click(function () {
            $('#myFile').attr("accept", $(this).attr('accept'));
            $("#uploadResourceModal").modal('show');
        });


        /**********************************************************************************
         * created By : Saurabh
         * Description : Preview 
         *********************************************************************************/
        $("#previewButton").click(function () {
            $('#mySidenav').css('top', '');
            tinymce.remove();
            setActiveSliders();
            $(".assetseditor,.slider-mobile-view-hearder").filter("[contenteditable='true']").removeClass("mce-content-body mce-edit-focus").removeAttr("contenteditable");
            $(".assetseditor,.slider-mobile-view-hearder").filter("[id^='mce_']").removeAttr("id");
            setShiftedPanelIndex(type);
            destroySlickCarousel('photoGalleryCarousel');

            localStorage.setItem('saveFunctionCalled', "0");
            $('#home-page').append("<div class=\"modal-backdrop fade in\"></div>");
            setTimeout(function () {
                saveMicrosite();
            }, 500);
        });


        /**********************************************************************************
         * created By : Saurabh
         * Description : NA
         *********************************************************************************/
        $("input#saveMicrosite").click(function () {
            $("#saveSitePrompt").modal('hide');
            setTimeout(function () {
                saveMicrosite();
            }, 500);
        });



        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/
        $("#backButton").click(function () {
            if (isSavedChanegs == 0) {
                removeredirectLinksonExit();
                document.location.href = redirectLocation;
            } else {
                showConfirmationBox("EXIT EDITOR", "Any unsaved changes will be lost. Do you want to continue?", "redirectButton");
            }
        });
        /**********************************************************************************
         * created By : Saurabh
         * Description : Print Button
         *********************************************************************************/
        $("#printButton").click(function () {
            $("#backButton").hide();
            $("#printButton").hide();
            $("#previewButton").hide();
            window.print();
            $("#backButton").show();
            $("#printButton").show();
            $("#previewButton").show();
        });
        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/

        $(document).on('change', 'input[type="checkbox"]', function () {
            if ($(this).is(":checked")) {
                list.push($(this).attr('name'));
            } else {
                list.splice(list.indexOf($(this).attr('name')), 1);
            }
            console.log("asdf" + list.length);
            if (list.length >= 3 && list.length < 10) {
                console.log(list.length);
                $("button#saveListButton").removeAttr("disabled");
            } else {
                $("button#saveListButton").attr('disabled', 'disabled');
                $("p.galleryMsg").css({
                    "display": "block"
                });
            }
        });
        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/
        $(document).on('click', '#saveListButton', function () {
            var element = "";
            var imageContainer = [8];
            var b = 0;
            var c = 0;
            var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            if (list.length > 2 && list.length < 10) {
                isSavedChanegs = 1;
                for (var i = 0; imageContainer.length <= 8; i++) {
                    if (c == list.length) {
                        c = 0;
                    }
                    imageContainer[i] = list[c];
                    c++;
                    console.log(imageContainer.length + " " + i + imageContainer[i]);
                }
                $("#slides_container").find('.slides_control').children().remove();
                jQuery.each(imageContainer, function (i, val) {
                    b++;
                    element += "<li><a href='#'><img src='" + val + "' alt='' height='298px' width='298px'/></a></li>";
                    if (b == 3) {
                        var ul = document.createElement('ul');
                        $(ul).append(element);
                        var photo_container = document.createElement('div');
                        $(photo_container).attr('class', 'photo_container').attr("id", "photo_container");
                        $(photo_container).append(ul);
                        var slide_details = document.createElement('div');
                        if (width < 1100 && width > 760) {
                            $(slide_details).attr("class", "slide_details").attr("id", "slide_details").attr("style", "position: absolute; top: 0px; left: 760px; z-index: 0; display: block;");
                        } else {
                            $(slide_details).attr("class", "slide_details").attr("id", "slide_details").attr("style", "position: absolute; top: 0px; left: 1100px; z-index: 0; display: block;");
                        }
                        $(slide_details).append(photo_container);
                        $("#slides_container").find('.slides_control').append(slide_details);
                        element = "";
                    }
                    if (b == 6) {
                        var ul1 = document.createElement('ul');
                        $(ul1).append(element);
                        var photo_container1 = document.createElement('div');
                        $(photo_container1).attr('class', 'photo_container').attr("id", "photo_container");
                        $(photo_container1).append(ul1);
                        var slide_details1 = document.createElement('div');
                        $(slide_details1).attr("class", "slide_details").attr("id", "slide_details").attr("style", "position: absolute; top: 0px; left: 1100px; z-index: 0; display: none;");
                        $(slide_details1).append(photo_container1);
                        $("#slides_container").find('.slides_control').append(slide_details1);
                        element = "";
                    }
                    if (b == 9) {
                        var ul2 = document.createElement('ul');
                        $(ul2).append(element);
                        var photo_container2 = document.createElement('div');
                        $(photo_container2).attr('class', 'photo_container').attr("id", "photo_container");
                        $(photo_container2).append(ul2);
                        var slide_details2 = document.createElement('div');
                        $(slide_details2).attr("class", "slide_details").attr("id", "slide_details").attr("style", "position: absolute; top: 0px; left: 1100px; z-index: 0; display: none;");
                        $(slide_details2).append(photo_container2);
                        $("#slides_container").find('.slides_control').append(slide_details2);
                        element = "";
                    }
                });
            } else {
                $("#sliderContentPrompt").modal('show');
                alert("not more than 9");
            }
            $("#getAssetsEditorModal").modal('hide');
            list = [];
            imageContainer = [];
        });
        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/
        $(".headerLink").click(function () {
            redirectLocation = "/site/edit?url=" + url + "&page=" + $(this).attr('name') + "&exitredirect=" + getAllUrlParams(window.location.href).exitredirect;
            if ($(this).attr('name') == 'contact') {
                pageRequested = 2;
                var type = window.location.pathname.indexOf("edit-report") > 0 ? 'report' : 'site';
                if (type == 'report') {
                    pageRequested = 12;
                    redirectLocation = window.location.pathname + '?url=' + url + "&year=" + getAllUrlParams(window.location.href).year + "&page=contact" + "&exitredirect=" + getAllUrlParams(window.location.href).exitredirect;
                }
            }
            if ($(this).attr('name') == 'index') {
                pageRequested = 1;
                var type = window.location.pathname.indexOf("edit-report") > 0 ? 'report' : 'site';
                if (type == 'report') {
                    pageRequested = 11;
                    redirectLocation = window.location.pathname + '?url=' + url + "&year=" + getAllUrlParams(window.location.href).year + "&page=index" + "&exitredirect=" + getAllUrlParams(window.location.href).exitredirect;
                }
            }
            if (isSavedChanegs == 0) {
                document.location.href = redirectLocation;
            } else {
                showConfirmationBox("Microsite", "Any unsaved changes will be lost. Do you want to continue?", "redirectButton");
            }
        });

        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/
        $(".closeDiv").click(function () {
            alert($(this).attr('pName'));
            sectionId = $(this).attr('pName');
            showConfirmationBox("MICROSITE", "Are you sure, you want to delete this section?", "deleteSection");
        });
        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/
        $(".slideSecClass").delegate(".carouseldelete", "click", function () {
            var carouselId = this.parentElement.parentElement.parentElement.parentElement.id;
            sectionId = carouselId;
            showDeleteConfirmationBox(null, "DELETE THIS PANEL?", "deleteSection");
            panelbuttonDisabler();
            $("#DeleteconfirmationBoxModal .confirmButton.delete-button").removeClass("pwdon0");
        });



        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/
        $("#setTextBlockToDiv").click(function () {
            $('input[name="textBlocksCheck"]:checked').each(function () {
                element.html(this.value);
            });
            $("#getsetTextBlockModal").modal('hide');
        });
        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/

        $("#changeSCView").click(function () {
            var s = $('input[name="viewType"]:checked').val();
            var itemDiv = $(".sliderItem" + view + "[class='sliderItem" + view + " item active']");
            var section = itemDiv.attr('sectionId');
            itemDiv.children().remove();
            $("#sliderContent_" + s).find(".assetseditor").each(function (e) {
                $(this).attr('sectionId', 'slider_' + view + '_' + section + '_' + e);
            });
            var itemData = $("#sliderContent_" + s).html();
            itemDiv.append(itemData);
            var myModal = $('#changeSliderContentModal');
            myModal.modal('hide');
        });
        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/
        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/
        // TODO
        $(".slideSecClass").delegate(".sliderLeft, .sliderRight", "click", function (event) {
            tinymce.remove();
            isSavedChanegs = 1;
            $(this).addClass('pwdon0');
            var carouselId = this.parentElement.parentNode.parentElement.children[2].id;
            var contentPanelId = this.parentElement.parentNode.parentElement.parentElement.id;
            var activeSlide = $("#" + contentPanelId).find('.carousel-inner').find(".active");
            // TODO
            var prevSlide;
            var sliderMsg = "SLIDE MOVED TO THE LEFT";
            if (event.currentTarget.classList.contains("sliderLeft")) {
                prevSlide = activeSlide.prev();
            } else {
                prevSlide = activeSlide.next();
                sliderMsg = "SLIDE MOVED TO THE RIGHT"
            }
            var activeHTML = activeSlide.html();
            var prevHTML = prevSlide.html();
            activeSlide.children().remove();
            activeSlide.append(prevHTML);
            prevSlide.children().remove();
            prevSlide.append(activeHTML);
            slideindibuttonDisabler(contentPanelId, carouselId);
            initializeInlineEditor();
            success_generic_notification(sliderMsg);
        });

        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/
        $(document).delegate(".addContentpanelAfter", "click", function () {
            appendAfter = this.parentElement.parentElement.parentElement.parentElement.id;
            // asset changes
            callJSFunction = function (node) {
                return {
                    "id": node.id,
                    "processId": 17
                };
            }
            urlForJsTree = "/cprendering/getinitial";
            commonJsTree('#locationModal', urlForJsTree, callJSFunction, "addContentPanelAfterInEditor");
            $('#addContentPanelsSiteModal').modal('show');
            $('#addContentPanel').addClass("pwdon0");
        });
        $(".scroll-toggle-cancel-delete").click(function () {
            $('.replace-buttonDiv').css('display', 'none');
            initializeInlineEditor();
            pageRequested = null;
        });
        /* ifram video reset player */
        $('#photoGalleryCarousel').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            var currentSlickDOM = $("#photoGalleryCarousel").find("[data-slick-index='" + currentSlide + "']");
            if (currentSlickDOM.find('iframe').length) {
                var sectionId = currentSlickDOM.find('iframe')[0].getAttribute('sectionId');
                document.getElementsByClassName(sectionId)[0].src = document.getElementsByClassName(sectionId)[0].src;
            }
        });

        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/
        $('.slideSecClass').on('slid.bs.carousel', function (ev) {
            var contentPanelId = ev.target.parentElement.parentElement.id;
            var contentPanelCarouselId = ev.target.id;
            slideindibuttonDisabler(contentPanelId, contentPanelCarouselId);
            // for graph Y axis lable dispaly on slide
            var panel_id = ev.target.parentElement.id;
            if (panel_id == "FUND_PERFORMANCE") {
                chartgraphs();
            }
            for (var fundcount = 1; fundcount <= 4; fundcount++) {
                if ($('#' + contentPanelId).html() != "") {
                    if ($('#' + contentPanelId).find('.carousel-list-funds').length > 0) {
                        $('#' + contentPanelId).find('.total-fund').html($('#' + contentPanelId + ' .carousel-list-funds .list-fund-options').find('li').size());
                        $('#' + contentPanelId + ' .carousel-list-funds').addClass('hide');
                        $('#' + contentPanelId + ' .fund-list-button').removeClass('open');
                        $('#' + contentPanelId).find('.current-fund').html(parseInt($('#' + contentPanelId).find('ol.report').find('.active').attr('data-slide-to')) + 1)
                    }
                }
            }
        });
        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/
        $(".slideSecClass").delegate(".carusoalup, .carusoaldown", "click", function (event) {
            tinymce.remove();
            isSavedChanegs = 1;
            destroySlickCarousel("DUMMYPASS");
            $(this).addClass('pwdon0');
            var carouselId = this.parentElement.parentNode.parentElement.parentElement.id;
            var activeCarousel = $("#" + carouselId);
            // TODO
            var msgPanel = "PANEL MOVED UP";
            var prevCarousel;
            if (event.currentTarget.classList.contains("carusoalup")) {
                prevCarousel = activeCarousel.prev();
            } else {
                prevCarousel = activeCarousel.next();
                msgPanel = "PANEL MOVED DOWN";
            }
            //
            var activeHTML = activeCarousel.html();
            var prevHTML = prevCarousel.html();
            activeCarousel.children().remove();
            activeCarousel.append(prevHTML);
            prevCarousel.children().remove();
            prevCarousel.append(activeHTML);
            panelbuttonDisabler();
            imageCarouselInitializer();
            initializeInlineEditor();
            success_generic_notification(msgPanel);
        });


        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/
        $("#addContentPanel").click(function () {
            tinymce.remove();
            contentPanelArr = [];
            $("#addContentPanel").addClass("pwdon0");
            var url = getAllUrlParams(window.location.href).url;
            var actionUrl = "/asset/selectedCP?selectedCP=" + selectedNode + "&url=" + url;
            if ((selectedNode != "") || (selectedNode == undefined)) {
                $.ajax({
                    url: actionUrl,
                    type: 'POST',
                    data: {
                        'selectedCP': '' + selectedNode + ''
                    },
                    dataType: "json",
                    beforeSend: function () {
                        toggleProgressCircle(true);
                    },
                    success: function (response) {
                        toggleProgressCircle(false);
                        resetTimeout();
                        destroySlickCarousel("DUMMYPASS");
                        if (response != null && response.result != null && response.result.status == 'success') {
                            contentPanelHaveChildArr = [];
                            contentPanelArr = [];
                            var cpSectionInnerHTML = [];
                            contentPanelArr = document.getElementsByClassName('slideSecClass');
                            if (appendAfter == "greetingsPanel") {
                                cpSectionInnerHTML.push(response.result.message);
                            }
                            activeContentPanels();
                            var contentPanelHaveChildArrLength = contentPanelHaveChildArr.length;
                            for (var i = 0; i < contentPanelHaveChildArrLength; i++) {
                                cpSectionInnerHTML.push(contentPanelArr[i].innerHTML);
                                var currentCP = $(contentPanelHaveChildArr[i])[0].id;
                                if (appendAfter == currentCP) {
                                    cpSectionInnerHTML.push(response.result.message);
                                }
                            }
                            var cpSectionInnerHTMLLength = cpSectionInnerHTML.length;
                            for (var j = 0; j < cpSectionInnerHTMLLength; j++) {
                                var slide = contentPanelArr[j];
                                if (slide.childElementCount) {
                                    contentPanelArr[j].children[0].remove();
                                }
                                contentPanelArr[j].innerHTML = cpSectionInnerHTML[j];
                            }
                            if (cpSectionInnerHTML.length > noOfMaxCPAllowed) {
                                $(".addContentpanelAfter").addClass("pwdon0");
                                $(".addCarouselPanelOuter").prop('title', 'Cannot exceed Eight panels');
                            }
                            SlideButtonsDisabler();
                            $('#addContentPanelsSiteModal').modal('hide');
                            $('.carousel').carousel({
                                interval: false
                            });
                            sliderSection();
                            imageCarouselInitializer();
                            initializeInlineEditor();
                            success_generic_notification("PANEL ADDED");
                            // TODO
                            // extra initilization after add
                            // panel through javascript function
                            // call
                            if (typeof addContentPanelJSInitilization == 'function') {
                                addContentPanelJSInitilization();
                            } else {
                                console.log('addContentPanelJSInitilization does not exist!');
                            }
                        } else if (response != null && response.result != null && response.result.status == 'failure') {
                            validatio.removeClass().addClass('alert alert-danger col-lg-5 col-md-6 url-alert').html("<i class=\"fa fa-times-circle\"></i>  " + response.result.message);
                            $("#URL-pre").empty();
                        }
                        $("#addContentPanel").removeClass("pwdon0");
                        contentPanelArr = [];
                        $('.addCarouselPanelOuter').css("display", "block");
                    }
                });
            } else {
                $("#addContentPanel").removeClass("pwdon0");
            }
        });

        

        $(".undoBtn").click(function () {
            var undoId = UNDOarray[0];
            var state = UNDOarray[1];
            state.removeClass("removableElement");
            var preElement = state;
            var removableEle = $("." + undoId).attr('ineditmode', 'true');
            removableEle.addClass("removableElement");
            $(".assetseditor").filter("[ineditmode='true']").parent().prepend(preElement);
            $(".removableElement").remove();
            $(".assetseditor").filter("[ineditmode='true']").attr('ineditmode', 'false');
            $(".undoBtn").addClass("pwdon0");
            success_generic_notification("PREVIOUS EDIT UNDONE");
        });


        /**********************************************************************************
         * created By : Saurabh
         * Description : 
         *********************************************************************************/

        $(".slideSecClass").delegate(".carusoalprint", "click", function () {
            tinymce.remove();
            pb_carouselId = this.parentElement.parentNode.parentElement.parentElement.id;
            pb_carousel = this.parentElement.parentNode.parentElement.parentElement.innerHTML;
            var headerContent = this.parentElement.parentNode.parentElement.getElementsByClassName('contentpanelname')[0].getElementsByClassName('panelHeader')[0].children[0].children[0].innerText;
            if (headerContent.length < 4) {
                headerContent = "MORE INFORMATION";
            }
            $('#headingCpInput').val(headerContent);
            $('#printBridgeModal').modal('show');
            initializeInlineEditor();
            return;
        });
        $('#printCP').click(function () {
            tinymce.remove();
            $('#printBridgeModal').modal('hide');
            heading_cp_input = $('#headingCpInput').val();
            var alliframe = $('#' + pb_carouselId).find('iframe');
            var allDocumentFrame = $('#' + pb_carouselId).find('img.documentImg');
            if (alliframe != undefined && alliframe.length > 0) {
                // Show modal
                $('#printBridgeWarningModal').modal('show');
                return;
            } else if (allDocumentFrame != undefined && allDocumentFrame.length > 0) {
                // Show modal
                $('#printBridgeWarningModal').modal('show');
                return;
            } else {
                toggleProgressCircle(true);
                requestPrintBridgePreview(pb_carousel, heading_cp_input);
            }
            initializeInlineEditor();
            requestPrintBridgePreview(pb_carousel, heading_cp_input);
        });
        $('#printCPWarning').click(function () {
            $('#printBridgeWarningModal').modal('hide');
            toggleProgressCircle(true);
            initializeInlineEditor();
            requestPrintBridgePreview(pb_carousel, heading_cp_input);
        });
        var printPreviewData = null;
        $('#createPDF').click(function () {
            generatePDF(printPreviewData);
        });

        /**********************************************************************************
         * created By : Saurabh
         * Description : To select print fund modal body load
         *********************************************************************************/
        // select and print fund modal body load
        $(".slideSecClass").delegate(".carusoalprintreport", "click", function (event) {
            toggleProgressCircle(true);
            var recordId = $("#recordId").val();
            var actionURL = "/printbridge/get-fund-for-print-bridge-modal-body-load-for-report?record-id=" + recordId;
            var myModal = $("#printBridgeSelectionReportModal");
            var myModalBody = myModal.find('.modal-body');
            pb_recordId = $("#recordId").val();
            pb_templateId = $("#tempId").val();
            pb_reportYear = $("#fiscalYear").val();
            myModal.removeData('bs.modal');
            myModalBody.load(actionURL, function () {
                $("#printReportCP").attr("href", "/printbridge/generate-pdf-for-report?type-id=1&record-id=" + pb_recordId + "&fund-id=0&template-id=" + pb_templateId + "&report-year=" + pb_reportYear + "");
                toggleProgressCircle(false);
                myModal.modal('show');
            });
        });
        $("#printBridgeSelectionReportModal").delegate('#printReportCP', "click", function () {
            toggleProgressCircle(true);
            $('.newFooterLayout, .newFooterLayoutAdmin').css("z-index", "1050");
            $("#printBridgeSelectionReportModal").modal('hide');
            //$("#printReportCP").addClass("pwdon0");
            var sendUrl = $("#printReportCP").attr("href");
            var urlToSend = sendUrl;
            var req = new XMLHttpRequest();
            req.open("GET", urlToSend, true);
            req.responseType = "blob";
            req.onload = function (event) {
                toggleProgressCircle(false);
                $('.newFooterLayout, .newFooterLayoutAdmin').css("z-index", "65536");
                var blob = req.response;
                var fileName = req.getResponseHeader("Content-Disposition");
                //if you have the fileName header available directly use that  
                //var fileName = req.getResponseHeader("filename")
                fileName = fileName.substring(21, fileName.length - 1);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                success_generic_notification("FILE DOWNLOADED");
            };
            req.send();
        });

        /*
        * **********************************************************************************
        * $(document).delegate(".cover-img-cancel-btn", "click", function()
        * Description : remove pwdon0 class from change cover picture button in site editor
        * **********************************************************************************
        */
        //remove pwdon0 class from change cover picture button in site editor
        $(document).delegate(".cover-img-cancel-btn", "click", function () {
            $(".changeCoverPicture").removeClass("pwdon0");
        });

        //ready-end
    });

    /************************************************************************************
     * Created By : Avinash 
     * Description : destroy slick on gallery, caption gallery or use any panel slick func
     ************************************************************************************/
    function destroySlickCarousel(id) {
        try {
            var galleryArray = $("#photoGalleryCarousel.pos-rel");
            var galleryArrayLength = galleryArray.length;
            for (var position = 0; position < galleryArrayLength; position++) {
                $(galleryArray[position]).slick('unslick');
                var photoGalleryChilds = $(galleryArray[position]).children();
                $.each(photoGalleryChilds, function (i, items) {
                    var attributes = $.map(this.attributes, function (item) {
                        return item.name;
                    });
                    $.each(attributes, function (i, item) {
                        items.removeAttribute(item);
                    });
                });
            }
        } catch (err) {
            console.log(err.message);
        }
        try {
            destroySlickCarouselTwo(id)
        } catch (err) {
            console.log(err.message);
        }

    }

    /************************************************************************************
     * Created By : Saurabh 
     * Description : To replace only with gif Image
     ***********************************************************************************/
    function gifOnlyImageReplacer(imgpath) {
        try {
            if ($(".assetseditor").filter("[ineditmode='true']").parents('.fund-impact-elements').length > 0) {
                var formData = new FormData();
                impactId = $(".assetseditor").filter("[ineditmode='true']").parents('.fund-impact-elements').attr("data-impactid");
                formData.append('pk_fund_impact_id', impactId);
                formData.append('image_src', imgpath);
                $.ajax('/asset/gifSupportImpact', {
                    method: "POST",
                    data: formData,
                    processData: false,
                    cache: false,
                    contentType: false,
                    dataType: "json",
                    success: function (response) {
                        resetTimeout();
                    },
                    error: function (response) { }
                });
            }
            var ss = $(".assetseditor").filter("[ineditmode='true']");
            var imgElement = "<img alt=\"image\" class= \"gifOnly " + imageConvertClasses + " " + undofunctionId + "\" sectionId= \"" + duplicateSectionId + "\" src= \"" + imgpath + "\"ineditmode=\"false\" frameborder=\"0\">";
            ss.addClass("removableElement");
            $(".assetseditor").filter("[ineditmode='true']").parent().addClass('gifOnlyBackgroundBlack');
            $(".assetseditor").filter("[ineditmode='true']").parent().prepend(imgElement);
            $(".removableElement").remove();
            $(".assetseditor").filter("[ineditmode='true']").attr('ineditmode', 'false');
            activateUNDO();
            $('#getAssetsEditorModal').modal('hide');
            $('#assetUploadSiteEditorModal').modal('hide');
            $('#assetUploadSiteEditorModal').css("display", "block");
            $('.modal-backdrop').remove();
            success_generic_notification("ASSET REPLACED");
        } catch (e) {
            console.log(e);
        }
    }

    /************************************************************************************
     * Created By : Saurabh 
     * Description : NA
     ***********************************************************************************/
    function getTextBlocks() {
        try {
            var myModal = $('#getsetTextBlockModal');
            modalBody = myModal.find('.modal-body');
            var modalSetText = myModal.find('.modal-setText');
            modalSetText.hide();
            myModal.modal('hide');
            myModal.removeData('bs.modal');
            var actionUrl = "/asset/libraryTextBlocks?tempId=" + tempId + "&sectionId=" + sectionId;
            modalBody.load(actionUrl);
            myModal.modal('show');
        } catch (err) {
            console.log(err.message);
        }

    }

    /***********************************************************************************
     * Created By : Saurabh
     * Description : NA
     ***********************************************************************************/
    function isABootstrapModalOpen() {
        try {
            return $('#AssetPreviewModal.modal.in').length > 0;
        } catch (err) {
            console.log(err.message)
        }
    }



    /************************************************************************************
     * Created By : Saurabh
     * Description: To assets replace modal 
     ************************************************************************************/
    function afterselectedCoverImage() {
        try {
            afterselectedCoverImageInit();

            var arr_list_items = $("#getAssetsEditorModal li img").toArray();
            var arr_list_items_length = arr_list_items.length;
            for (index = 0; index < arr_list_items_length; index++) {
                if (introPanelGreetingPanelParent.replace(/^url\(['"](.+)['"]\)/, '$1') == arr_list_items[index].src) {
                    arr_list_items[index].classList.add("selectedCoverPic");
                }
            }
        } catch (err) {
            console.log(err.message);

        }
    }
    // TODO
    function cropperImageLibrary(actionUrl) {
        try {
            var assetLibraryPath = ["/asset/mediaLibrary", "/asset/libraryDocument", "/asset/libraryImage"];
            var assetsLibraryName = ["SELECT MEDIA", "SELECT DOCUMENT", "SELECT IMAGE"];
            if (actionUrl == assetLibraryPath[0]) {
                modalHeader.text(assetsLibraryName[0]);
                modalBody.css({
                    "padding": "0px",
                    "max-height": "437px",
                    "height": "auto",
                    "overflow-y": "hidden"
                });
                modalfooter.css({
                    "display": "none"
                });
                $(".image-hyperlink").css("display", "none");
            }
            if (actionUrl == assetLibraryPath[1]) {
                modalHeader.text(assetsLibraryName[1]);
                modalBody.css({
                    "padding": "0px",
                    "max-height": "437px",
                    "height": "auto",
                    "overflow-y": "hidden"
                });
                modalfooter.css({
                    "display": "none"
                });
            }
            if (actionUrl == assetLibraryPath[2]) {
                modalHeader.text(assetsLibraryName[2]);
                modalBody.css({
                    "padding": "0px",
                    "max-height": "437px",
                    "height": "auto",
                    "overflow-y": "hidden"
                });
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    function Editor(actionUrl, type, footer, title) {
        try {
            var getOrg = getOrgIdF();
            var myModal = $('#getAssetsEditorModal');
            modalBody = myModal.find('.modal-body');
            modalHeader = myModal.find('.modal-header').find('.modal-title');
            modalHeader.text("Getting Data...");
            modalBody.children().remove();
            myModal.children().removeClass("ImageEditorCustomWidth");
            modalBody.append(progressBar);
            modalBody.css({
                "padding": "10px 15px",
                "overflow-y": "auto"
            });
            modalfooter = myModal.find('.modal-footer');
            myModal.children().css('width', '600px');
            modalfooter.css("display", "block");
            modalfooter.find(".cover-img-cancel-btn").remove();
            modalBody.css("max-height", "437px");
            myModal.removeData('bs.modal');
            modalBody.load(actionUrl, function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "success") {
                    resetTimeout();
                    modalHeader.text(title);
                    if (actionUrl == "/asset/imageCropperModal") {
                        $('#getAssetsEditorModal').modal("show");
                        $('#getAssetsEditorModal').css("opacity", "0");
                        modalHeader.append("\<a data-placement=\"bottom\" title=\"This tool allows you to fit images into the aspect ratio required by the site design. Click and drag to move the window. Use either the slider or pinch in/out to zoom.\"\>\<img src=\"../ui/images/info.png\" class=\"info-bioupdate-page\"\>\<\/a>");
                        myModal.children().css({
                            "max-width": "1200px",
                            "width": "80% !important"
                        });
                        footer = footer + "?" + (new Date).getTime();
                        modalBody.find('img').attr('src', footer);
                        modalBody.css("max-height", "1000px");
                        myModal.children().addClass("ImageEditorCustomWidth");
                        modalfooter.css("display", "none");
                        cropperFunction();
                        $('.photoResizerBtn').css("display", "block");
                    }
                    if (isSpecialsContentPanel == true) {
                        var special_id = $("#" + contentPanelId + " #" + myCarousel).data("special-id");
                        $("#getAssetsEditorModal img[src^='/ui/images/" + getOrg + "/slider-view/']").each(function () {
                            this.src = this.src.replace("slider-view", "slider-view-" + special_id);
                        });
                        isSpecialsContentPanel = false;
                    }
                    myModal.modal('show');
                }
                cropperImageLibrary();
                if (actionUrl.substring(0, 25) == "/asset/select-cover-image") {
                    modalBody.css({ "overflow-y": "auto", "max-height": "400px", "padding": "10px 15px", "margin": "auto -35px" });
                    modalfooter.append("<button class=\"btn cover-img-cancel-btn noti-button " +
                        "red-button no-ovrture-red modal-no-btn-margin-left22 scroll-toggle-cancel-delete " +
                        "scroll-toggle-cancel-delete ui-btn ui-shadow ui-corner-all\" data-dismiss=\"modal\">CANCEL</button>");
                    /***************After modal creation for Cover Image Selected Images****************/
                    afterselectedCoverImage();
                    /***************After modal creation for Cover Image Selected Images****************/
                }
                if (type == "addLayout") {
                    $("#" + footer + ' .changeSlider').removeClass('pwdon0');
                }
                if (statusTxt == "error") {
                    modalBody.children().remove();
                    modalBody.append("<h3>Data not found " + errorIcon + "</h3>").css("color", "#d14836");
                }
            });
            if (footer == true) {
                $("#saveListButton").css("display", "block");
            } else {
                $("#saveListButton").css("display", "none");
            }
            if (type != "image") {
                $(".image-hyperlink").css({
                    "display": "none"
                });
            } else {
                modalfooter.css({
                    "display": "none"
                });
                $(".image-hyperlink").css({
                    "display": "none"
                });
                $(".image-hyperlink").find("p").css({
                    "display": "none"
                });
            }
        } catch (err) {
            console.log(err.message);
        }
    }
    /***********************************************************************************
     * created By : Avinash
     * Description : get organization id
     ***********************************************************************************/
    function getOrgIdF() {
        try {
            var favicon = undefined;
            var nodeList = document.getElementsByTagName("link");
            var nodeListLength = nodeList.length;
            for (var i = 0; i < nodeListLength; i++) {
                if ((nodeList[i].getAttribute("rel") == "icon") || (nodeList[i].getAttribute("rel") == "shortcut icon")) {
                    favicon = nodeList[i].getAttribute("href");
                }
            }
            var url = favicon.substr(favicon.lastIndexOf("Org"));
            var OrgId = url.slice(0, url.lastIndexOf("/"));
            console.log(OrgId);
            return OrgId;
        } catch (err) {
            console.log(err.message);
        }
    }
    /*******************************************************************************
     * Created By : Saurabh 
     * Description : image crop modal Tenant wise special vcu
     ******************************************************************************/
    function imageEditorModal(imageSRC) {
        try {
            assetEditorFilterTrue = $(".assetseditor").filter("[ineditmode='true']");
            divWidth = assetEditorFilterTrue.parent().width();
            divHeight = assetEditorFilterTrue.parent().height();
            if (assetEditorFilterTrue[0].src != undefined) {
                if (assetEditorFilterTrue[0].src.split('.').pop() == "GIF" || assetEditorFilterTrue[0].src.split('.').pop() == "gif") {
                    divHeight = assetEditorFilterTrue.parent().height();
                    divWidth = assetEditorFilterTrue.parent().width();
                }
                var getOrgIEM = getOrgIdF();
                if (getOrgIEM === "Org_17") {
                    if ($("iframe")) {
                        divHeight = assetEditorFilterTrue.parent().outerHeight();
                        divWidth = assetEditorFilterTrue.parent().outerWidth();
                    }
                }
            }
            var tempRatio = divHeight / divWidth;
            if (window.innerWidth > 1200) {
                if (700 < divWidth) {
                    divWidth = 700;
                    divHeight = 700 * tempRatio;
                }
            } else if (1201 > window.innerWidth) {
                if (550 < divWidth) {
                    divWidth = 550;
                    divHeight = 550 * tempRatio;
                }
            }
            $('#assetUploadSiteEditorModal').css("display", "none");
            Editor("/asset/imageCropperModal", "Image Cropper", imageSRC, "EDIT IMAGE");
        } catch (err) {
            console.log(err.message)
        }
    }

    /**********************************************************************************
     * created By : Saurabh
     * Description : NA
     *********************************************************************************/
    function dataURLtoBlob(dataurl) {
        try {
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {
                type: mime
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    /**********************************************************************************
     * created By : Saurabh
     * Description : NA
     *********************************************************************************/
    function setBoxThenImage(zoomfactor) {
        try {
            $('#CropperImageSet').cropper("setCropBoxData", {
                width: divWidth,
                height: divHeight
            });
            $('#CropperImageSet').cropper("zoomTo", zoomfactor);
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : NA
     *********************************************************************************/
    function setImageThenBox(zoomfactor) {
        try {
            $('#CropperImageSet').cropper("zoomTo", zoomfactor);
            $('#CropperImageSet').cropper("setCropBoxData", {
                width: divWidth,
                height: divHeight
            });
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : NA
     *********************************************************************************/
    function cropperFunction() {
        try {
            $(function () {
                $('#CropperImageSet').cropper({
                    viewMode: 1,
                    dragMode: 'move',
                    checkCrossOrigin: true,
                    checkImageOrigin: true,
                    autoCropArea: 0,
                    restore: true,
                    modal: true,
                    guides: true,
                    highlight: false,
                    center: true,
                    minContainerHeight: divHeight + 50,
                    minContainerWidth: divWidth + 50,
                    cropBoxMovable: false,
                    cropBoxResizable: false,
                    toggleDragModeOnDblclick: false,
                    built: function () {
                        var canvas = $('.cropper-canvas').children()[0];
                        var zoomfactorW = divWidth / canvas.naturalWidth;
                        var zoomfactorH = divHeight / canvas.naturalHeight;
                        if (zoomfactorW > zoomfactorH) {
                            if (canvas.width > divWidth) {
                                setBoxThenImage(zoomfactorW);
                            } else {
                                setImageThenBox(zoomfactorW);
                            }
                        } else {
                            if (canvas.height > divHeight) {
                                setBoxThenImage(zoomfactorH);
                            } else {
                                setImageThenBox(zoomfactorH);
                            }
                        }
                        var ratio = (canvas.width) / (canvas.naturalWidth);
                        $('.input-range-bar').val(ratio);
                        $('.input-range-bar').slider({
                            highlight: true
                        });
                        if (ratio > 1) {
                            $('.ui-slider-track').addClass("pwdon0");
                        }
                        $('#getAssetsEditorModal').css("opacity", "1");
                    }
                });
            });
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : NA
     *********************************************************************************/
    function documentReplaceOnly(assetPath) {
        try {
            $(this).addClass('pwdon0');
            isSavedChanegs = 1;
            $(".documentEditor").filter("[ineditmode='true']").attr('href', (assetPath));
            $(".imageEditor").filter("[ineditmode='true']").attr('ineditmode', 'false');
            $('#assetUploadSiteEditorModal').modal('hide');
            $(this).removeClass('pwdon0');
            success_generic_notification("ASSET REPLACED");
        } catch (err) {
            console.log(err.message);
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : NA
     *********************************************************************************/
    function documentReplaceOnlyForDocumentGallery(assetPath) {
        try {
            $(this).addClass('pwdon0');
            isSavedChanegs = 1;
            $(".documentEditor").filter("[ineditmode='true']").attr('href', (assetPath));
            $(".assetseditor").filter("[ineditmode='true']").attr('ineditmode', 'false');
            $('#assetUploadSiteEditorModal').modal('hide');
            $(this).removeClass('pwdon0');
            success_generic_notification("ASSET REPLACED");
        } catch (err) {
            console.log(err.message);
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : NA
     *********************************************************************************/
    function videoAssetReplace(assetPath) {
        try {
            ivSectionImage = 1;
            assetEditorFilterTrue = $(".assetseditor").filter("[ineditmode='true']");
            if (assetEditorFilterTrue.parents('.fund-impact-elements').length > 0) {
                var formData = new FormData();
                impactId = assetEditorFilterTrue.parents('.fund-impact-elements').attr("data-impactid");
                formData.append('pk_fund_impact_id', impactId);
                formData.append('assetFileName', selectedNodeName);
                formData.append('assetURL', assetPath);
                $.ajax('/asset/uploadVideoForImpact', {
                    method: "POST",
                    data: formData,
                    processData: false,
                    cache: false,
                    contentType: false,
                    dataType: "json",
                    success: function (response) {
                        resetTimeout();
                        if (response != null && response.result != null && response.result.status == 'success') {
                            // console.log("Done");
                        }
                    },
                    error: function (response) {
                        return;
                    }
                });
            }
            if (ivSectionImage == 1) {
                var vdoElemnt = "<iframe title=\"video\" sectionId= \"" + duplicateSectionId + "\"  name=\"movie\" class= \"" + videoConvertClasses + " " + undofunctionId + "\" src= \"" + assetPath + "\"  ineditmode=\"false\"  frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen> </iframe>";
                assetEditorFilterTrue.addClass("removableElement");
                assetEditorFilterTrue.parent().prepend(vdoElemnt);
                assetEditorFilterTrue.parent().addClass('iframBlackColor');
                $(".removableElement").remove();
                assetEditorFilterTrue.attr('ineditmode', 'false');
                ivSectionImage = 0;
            } else {
                assetEditorFilterTrue.closest('div').find('a').find("[name='movie']").attr('src', $(this).attr('urlPath'));
                assetEditorFilterTrue.attr('ineditmode', 'false');
            }
            activateUNDO();
            $('#assetUploadSiteEditorModal').modal('hide');
            success_generic_notification("ASSET REPLACED");
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : NA
     *********************************************************************************/
    function imageFlipper() {
        try {
            var imageFlipperVal = $("#btnFlipHorizontal").val();
            if (imageFlipperVal == 1) {
                $("#btnFlipHorizontal").val(-1);
                $('#CropperImageSet').cropper('scaleX', 1);
            } else {
                $("#btnFlipHorizontal").val(1);
                $('#CropperImageSet').cropper('scaleX', -1);
            }
        } catch (err) {
            console.log(err.message);
        }
    }



    /**********************************************************************************
     * created By : Saurabh
     * Description : NA
     *********************************************************************************/
    function redirectButton() {
        try {
            removeredirectLinksonExit();
            if (pageRequested == 2) {
                redirectLocation = "/site/edit?url=" + url + "&page=contact" + "&exitredirect=" + getAllUrlParams(window.location.href).exitredirect;
            }
            if (pageRequested == 1) {
                redirectLocation = "/site/edit?url=" + url + "&page=index" + "&exitredirect=" + getAllUrlParams(window.location.href).exitredirect;
            }
            // Report-Contact Page Redirection Flag Setting(11-Index,12-Contact)
            if (pageRequested == 11) {
                redirectLocation = window.location.pathname + '?url=' + url + "&year=" + getAllUrlParams(window.location.href).year + "&page=index" + "&exitredirect=" + getAllUrlParams(window.location.href).exitredirect;
            }
            if (pageRequested == 12) {
                redirectLocation = window.location.pathname + '?url=' + url + "&year=" + getAllUrlParams(window.location.href).year + "&page=contact" + "&exitredirect=" + getAllUrlParams(window.location.href).exitredirect;
            }
            document.location.href = redirectLocation;
        } catch (err) {
            console.log(err.message)
        }
    }

    /**********************************************************************************
     * created By : Priti 
     * Description :  To Save Report and Site Microsite
     *********************************************************************************/
    // TODO
    function saveMicrosite() {
        try {
            // get site or report
            var saveSite = window.location.pathname.indexOf("edit-report") > 0 ? 'report' : 'site';
            // Set header on position.
            $(document).find(".other_tabs").removeClass().addClass('other_tabs');
            // msg var
            var siteSavedMsg = "SITE SAVED";
            var siteNotSavedMsg = "SITE NOT SAVED. DUE TO SOME ERROR.";
            var html = $('html').clone();
            var htmlString = html.html();
            var url = $("#url").val();
            var pageName = $("#IdPage").val();
            var year = getAllUrlParams(window.location.href).year;
            var urlString = "/site/saveSitePage";
            var data = {
                'url': url,
                'page': pageName,
                'htmlString': htmlString,
                'listOfDeletedSection': listOfDeletedSection.toString()
            }
            if (type === 'report') {
                var id = $('.inline-textEditor').attr('data-gramm_id');
                if (id != undefined) {
                    window.location.assign('/site/grammerly-not-supported' + "?exitredirect=" + getAllUrlParams(window.location.href).exitredirect);
                }
                // Counter fixes by Saurabh
                $(".slideSecClass").find('.current-fund').html("1");
                data = {
                    'url': url,
                    'page': pageName,
                    'htmlString': htmlString,
                    'listOfDeletedSection': listOfDeletedSection.toString(),
                    'year': year
                }
                siteSavedMsg = "REPORT SAVED";
                siteNotSavedMsg = "REPORT NOT SAVED. DUE TO SOME ERROR.";
                urlString = "/site/saveReportPage";
            }
            jQuery.ajax({
                type: "POST",
                async: true,
                cache: true,
                url: urlString,
                dataType: "html",
                data: data,
                beforeSend: function () {
                    toggleProgressCircle(true);
                },
                success: function (response) {
                    var response = $.parseJSON(response);
                    console.log(response.result);
                    if (response != null && response.result != null && response.result.status == 'success') {
                        localStorage.setItem('saveFunctionCalled', "1");
                        location.reload();
                        localStorage.setItem('notificationPopUp', "1");
                        localStorage.setItem('confirmationFollowingProcedure', "1");
                        localStorage.setItem('confirmationFollowingProcedureMessage', siteSavedMsg);
                    } else if (response != null && response.result != null && response.result.status == 'failure') {
                        localStorage.setItem('saveFunctionCalled', "0");
                        $(".modal-backdrop").remove();
                        localStorage.setItem('notificationPopUp', "1");
                        localStorage.setItem('confirmationFollowingProcedure', "1");
                        localStorage.setItem('confirmationFollowingProcedureMessage', siteNotSavedMsg);
                    }
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : Site/Report save notifications
     *********************************************************************************/
    function siteSaveSuccessfulNotifier() {
        try {
            setTimeout(function () {
                if ($('#page-container').css('display') == "none") {
                    siteSaveSuccessfulNotifier();
                } else {
                    $("#siteSaveSuccess").stop().fadeIn(200).delay(5000).fadeOut(200);
                    localStorage.setItem('saveFunctionCalled', "0");
                }
            }, 500);
        } catch (err) {
            console.log(err.message)
        }
    }

    /**********************************************************************************
     * created By : Saurabh
     * Description : to change brand
     *********************************************************************************/
    function changeBrand() {
        try {
            if (brandId != selectedTemp) {
                showBrandConfirmationBox("null", "Change to this brand", "redirectButton");
                $('#showBrandConfirmationBoxModal').css("display", "block");
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : to apply brand
     *********************************************************************************/
    function applyBrand() {
        try {
            var type = window.location.pathname.indexOf("edit-report") > 0 ? 'report' : 'site';
            setShiftedPanelIndex(type);
            var url = $("#url").val();
            var tempId = brandId;
            var page = $("#IdPage").val();
            $(".assetseditor,.slider-mobile-view-hearder").filter("[contenteditable='true']").removeClass("mce-content-body mce-edit-focus").removeAttr("contenteditable");
            $(".assetseditor,.slider-mobile-view-hearder").filter("[id^='mce_']").removeAttr("id");
            destroySlickCarousel('photoGalleryCarousel');
            var html = $('html').clone();
            var htmlString = html.html();
            var reportYear = getAllUrlParams(window.location.href).year;
            $.ajax({
                url: '/site/changeBrand',
                type: 'POST',
                data: {
                    'url': '' + url + '',
                    'tempId': '' + tempId + '',
                    'page': '' + page + '',
                    'htmlString': '' + htmlString + '',
                    'type': '' + type + '',
                    'reportYear': '' + reportYear + ''
                },
                dataType: "json",
                beforeSend: function () {
                    toggleProgressCircle(true);
                },
                success: function (response) {
                    if (response != null && response.result != null && response.result.status == 'success') {
                        toggleProgressCircle(false);
                        $('#showBrandConfirmationBoxModal').modal('hide');
                        localStorage.setItem('saveFunctionCalled', "1");
                        location.reload();
                        localStorage.setItem('notificationPopUp', "1");
                        localStorage.setItem('confirmationFollowingProcedure', "1");
                        localStorage.setItem('confirmationFollowingProcedureMessage', "THEME APPLIED AND SAVED");
                    } else if (response != null && response.result != null && response.result.status == 'failure') {
                        toggleProgressCircle(false);
                        localStorage.setItem('saveFunctionCalled', "0");
                        success_generic_notification("SORRY , NOT ABLE TO UPDATE THE THEME");
                        $('#showBrandConfirmationBoxModal').modal('hide');
                    }
                }
            });
        } catch (err) {
            console.log(err.message);
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : to Cancel Brand
     *********************************************************************************/
    function cancelBrand() {
        try {
            $('#showBrandConfirmationBoxModal').modal('hide');
            iterateBrandList();
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : to iteate Brand
     *********************************************************************************/
    function iterateBrandList() {
        try {
            if ($('ul.brand-listing').find('li[value=' + selectedTemp + ']').length > 0) {
                $('#selectedBrand').val($('ul.brand-listing').find('li[value=' + localStorage.getItem('selectedTemp') + ']')[0].textContent);
            } else {
                $('#selectedBrand').val("EXPIRED");
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    /**********************************************************************************
     * created By : Saurabh
     * Description : to iteate Brand
     *********************************************************************************/
    function notification_on_page_load() {
        try {
            var notificationPopUpBit = localStorage.getItem('notificationPopUp');
            if (notificationPopUpBit == 1) {
                var procedureNo = localStorage.getItem('confirmationFollowingProcedure');
                var procedureMessage = localStorage.getItem('confirmationFollowingProcedureMessage');
                $("#success_notification_inner_text").html(procedureMessage);
                $("#success_notification_div").stop().fadeIn(200).delay(2000).fadeOut(1000); /* 200 */
                $("#GenericMsgPopUp").find(".comm-msg-detail").html(procedureMessage);
                switch (procedureNo) {
                    case "0":
                        break;
                    case "1":
                        localStorage.setItem('notificationPopUp', "0");
                        break;
                    default:
                        break;
                }
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    /**********************************************************************************
     * created By : Saurabh
     * Description : unused function
     *********************************************************************************/
    function showPrompt(title, message, contentData) {
        try {
            var myModal = $('#showPromptModal');
            var isModalOpen = myModal.attr('isModalOpen', 'true');
            modalBody = myModal.find('.modal-body');
            modalHeader = myModal.find('.modal-header').find('.modal-title');
            modalHeader.text(title);
            modalMessage = modalBody.find('.modal-message');
            if (contentData == "showProgress") {
                modalMessage.text(message).append(progressBar);
            } else if (contentData == "success") {
                modalMessage.text(message).append(successIcon).css("color", "#3a706a");
            } else if (contentData == "error") { } else if (contentData == "worning") { }
            if (isModalOpen) {
                myModal.modal('show');
            }
        } catch (err) {
            console.log(err.message);
        }

    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : to Show Brand confirmation Box
     *********************************************************************************/
    function showBrandConfirmationBox(title, message, contentData) {
        try {
            var myModal = $('#showBrandConfirmationBoxModal');
            modalBody = myModal.find('.modal-body');
            modalHeader = myModal.find('.modal-header').find('.modal-title');
            modalMessage = modalBody.find('.message');
            if (contentData == "redirectButton") {
                myModal.find('.modal-body').find('.confirmButton').attr('value', "YES, BACK");
            } else if (contentData == "deleteSection") {
                myModal.find('.modal-body').find('.confirmButton').attr('value', "YES, DELETE");
            }
            modalHeader.text(title);
            modalMessage.text(message);
            myModal.modal('show');
        } catch (err) {
            console.log(err.message);
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : to Show confirmation Box
     *********************************************************************************/
    function showConfirmationBox(title, message, contentData) {
        try {
            var myModal = $('#confirmationBoxModal');
            modalBody = myModal.find('.modal-body');
            modalHeader = myModal.find('.modal-header').find('.modal-title');
            modalMessage = modalBody.find('.message');
            if (contentData == "redirectButton") {
                myModal.find('.modal-body').find('.confirmButton').attr('value', "YES, BACK");
            } else if (contentData == "deleteSection") {
                myModal.find('.modal-body').find('.confirmButton').attr('value', "YES, DELETE");
            }
            myModal.find('.modal-body').find('.confirmButton').attr('onClick', contentData + '()');
            modalHeader.text(title);
            modalMessage.text(message);
            myModal.modal('show');
        } catch (err) {
            console.log(err.message);
        }
    }


    /**********************************************************************************
     * created By : Saurabh
     * Description : To Set Active Sliders
     *********************************************************************************/
    function setActiveSliders() {
        try {
            tinymce.remove();
            var edt = $('.dropdown').removeClass().addClass('dropdown menu');
            edt.find('.dropdown-menu').css({
                "display": "none"
            });
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : To Remove redirect link on exists element
     *********************************************************************************/
    function removeredirectLinksonExit() {
        try {
            var path = decodeURIComponent(getAllUrlParams(window.location.href).exitredirect);
            if (path != undefined || path != null) {
                if (path.indexOf('user/build-new-site-page') > 0) {
                    redirectLocation = '/user/user-sites';
                } else {
                    redirectLocation = path;
                }
            } else {
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function deleteSection() {
        try {
            tinymce.remove();
            isSavedChanegs = 1;
            $("#" + sectionId).children().remove();
            console.log(sectionId);
            listOfDeletedSection.push(sectionId);
            destroySlickCarousel('photoGalleryCarousel');
            activeContentPanels();
            reorderStack();
            $(".addContentpanelAfter").removeClass("pwdon0");
            $(".addCarouselPanelOuter").prop('title', 'Add content panel');
            $("#DeleteconfirmationBoxModal").modal('hide');
            panelbuttonDisabler();
            imageCarouselInitializer();

            initializeInlineEditor();
            success_generic_notification("PANEL DELETED");
            $("#DeleteconfirmationBoxModal .confirmButton.delete-button").addClass("pwdon0");
        } catch (err) {
            console.log(err.message)
        }
    }

    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function textBlocksVal(elmt) {
        try {
            element.html(elmt.innerHTML);
            $("#getsetTextBlockModal").modal('hide');
            sectionId = null;
            element = null;
        } catch (err) {
            console.log(err.message)
        }
    }


    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    var timeoutId;
    var d;
    var d1;
    var d2;
    var d3;
    var d4;
    function setSessionTimeout() {
        try {
            d = new Date();
            d1 = d.getTime();
            if (typeof (Storage) !== "undefined") {
                localStorage.setItem('lastCall', d1);
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    function checkstatus() {
        try {
            d2 = localStorage.getItem('lastCall');
            d4 = new Date();
            d3 = (parseInt(d2) + (60 * 60 * 1000)) - d4.getTime();
            timeoutId = setTimeout(function () {
                d2 = localStorage.getItem('lastCall');
                d4 = new Date();
                d3 = d4.getTime() - (parseInt(d2));
                if (d3 > 1799999) {
                    $("#logout").modal('show');
                    // alert("I m session Expired modal!!");
                } else {
                    clearTimeout(timeoutId);
                    checkstatus();
                }
            }, d3);
        } catch (err) {
            console.log(err.message)
        }
    }
    setTimeout(setSessionTimeout, 0);
    setTimeout(checkstatus, 0);

    function resetTimeout() {
        try {
            clearTimeout(timeoutId);
            setSessionTimeout();
            checkstatus();
        } catch (err) {
            console.log(err.message)
        }
    }



    $(window).resize(function () {
        try {
            var width = $(window).width();
            if (width < 1024) {
                $('#page-container').css("display", "none");
                $('#mobileResponsiveMessage').css("display", "block");
                var aModal = $('body').find('.modal.fade.in');
                if (aModal != null) {
                    var oModal = aModal.attr('id');
                    $('#' + oModal + 'ModalClose').trigger("click");
                }
            } else {
                $('#mobileResponsiveMessage').css("display", "none");
                $('#page-container').css("display", "block");
            }
        } catch (err) {
            console.log(err.message)
        }
    });


    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    var objectStringArray = [];
    var elementAddAfterThis = "";
    var elementCPId = "";
    function addContentPFunc() {
        try {
            tinymce.remove();
            elementAddAfterThis = this.parentElement.parentNode.parentElement.parentElement.id;
            elementCPId = this.parentElement.parentNode.parentElement.children[2].id;
            var tempId = $('#tempId').val();
            var backUrl = "/asset/cpList?tempId=" + tempId;
            if (tempId != "") {
                $.ajax({
                    url: backUrl,
                    type: 'POST',
                    data: {
                        'tempId': '' + tempId + ''
                    },
                    dataType: "json",
                    beforeSend: function () {
                        toggleProgressCircle(true);
                    },
                    success: function (response) {
                        toggleProgressCircle(false);
                        resetTimeout();
                        console.log(response.result);
                        if (response != null && response.result != null && response.result.status == 'success') {
                            objectStringArray = (new Function("return [" + response.result.message + "];")
                                ());
                            addPanelListing(objectStringArray);
                        } else if (response != null && response.result != null && response.result.status == 'failure') {
                            validation.removeClass().addClass('alert alert-danger col-lg-5 col-md-6 url-alert').html("<i class=\"fa fa-times-circle\"></i>   " + response.result.message);
                            $("#URL-pre").empty();
                        }
                    }
                });
            }
        } catch (err) {
            console.log(err.message)
        }
    }


    function disabletreeIconChangerOpen(e, data) {
        changeStatus(selectedNode, 'disable');
    }
    function changeStatus(selectedNode, changeTo) {
        try {
            var node = $("#locationModal").jstree().get_node(selectedNode);
            if (node == false) {
                return;
            }
            if (changeTo === 'enable') {
                $("#locationModal").jstree().enable_node(node);
                if (selectedNodeType == "glyphicon glyphicon-text-background-cp") {
                    return;
                }
                node.children.forEach(function (child_id) {
                    changeStatus(child_id, changeTo);
                })
            } else {
                $("#locationModal").jstree().disable_node(node);
                if (selectedNodeType == "glyphicon glyphicon-text-background-cp") {
                    return;
                }
                node.children.forEach(function (child_id) {
                    changeStatus(child_id, changeTo);
                })
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : unused function
     *********************************************************************************/
    function buttonEnablernadDisablerforAddCP(e, data) {
        try {
            // Approaching based upon icons which node carries
            var icon = data.instance.get_node(data.selected[0]).icon;
            selectedNodeType = data.instance.get_node(data.selected[0]).icon;
            parentsArray = data.instance.get_node(data.selected[0]).parents;
            selectedNodeParentId = data.instance.get_node(data.selected[0]).parent;
            selectedNode = data.instance.get_node(data.selected[0]).id;
            selectedNodeName = data.instance.get_node(data.selected[0]).text
            if (icon == "glyphicon glyphicon-text-background-cp") {
                $("#addContentPanel").removeClass("pwdon0");
            } else {
                $("#addContentPanel").addClass("pwdon0");
            }
        } catch (err) {
            console.log(err.message);

        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function treeIconChangerOpen(e, data) {
        try {
            var canBeDeleted = data.node.original.can_be_deleted;
            var selectedNodeParentId = data.node.parent;
            var iconConditional = data.instance.get_icon(data.node);
            if (canBeDeleted == false || (canBeDeleted == true && selectedNodeParentId == 2)) {
                if (iconConditional == "fa-fa-folder-palette-closed") {
                    data.instance.set_icon(data.node, 'fa-fa-folder-palette-open');
                } else if (iconConditional == "fa-fa-folder-brand-closed") {
                    data.instance.set_icon(data.node, 'fa-fa-folder-brand-open');
                } else if (iconConditional == "fa-fa-folder-system-template") {
                    data.instance.set_icon(data.node, 'fa-fa-folder-system-template');
                } else if (iconConditional != "glyphicon glyphicon-cloud" && iconConditional != "glyphicon glyphicon-user" && iconConditional != "glyphicon glyphicon-check-pencil" && iconConditional != "glyphicon glyphicon-system-template") {
                    data.instance.set_icon(data.node, 'fa fa-folder-locked-open');
                }
            } else {
                if (iconConditional != "glyphicon glyphicon-cloud" && iconConditional != "glyphicon glyphicon-user" && iconConditional != "glyphicon glyphicon-check-pencil" && iconConditional != "glyphicon glyphicon-system-template") {
                    data.instance.set_icon(data.node, 'fa fa-folder-open');
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function treeIconChangerClose(e, data) {
        try {
            var canBeDeleted = data.node.original.can_be_deleted;
            var selectedNodeParentId = data.node.parent;
            var iconConditional = data.instance.get_icon(data.node);
            if (canBeDeleted == false || (canBeDeleted == true && selectedNodeParentId == 2)) {
                if (iconConditional == "fa-fa-folder-palette-open") {
                    data.instance.set_icon(data.node, 'fa-fa-folder-palette-closed');
                } else if (iconConditional == "fa-fa-folder-brand-open") {
                    data.instance.set_icon(data.node, 'fa-fa-folder-brand-closed');
                } else if (iconConditional == "fa-fa-folder-system-template") {
                    data.instance.set_icon(data.node, 'fa-fa-folder-system-template');
                } else if (iconConditional != "glyphicon glyphicon-cloud" && iconConditional != "glyphicon glyphicon-user" && iconConditional != "glyphicon glyphicon-check-pencil" && iconConditional != "glyphicon glyphicon-system-template") {
                    data.instance.set_icon(data.node, 'fa fa-folder-locked');
                }
            } else {
                if (iconConditional != "glyphicon glyphicon-cloud" && iconConditional != "glyphicon glyphicon-user" && iconConditional != "glyphicon glyphicon-check-pencil" && iconConditional != "glyphicon glyphicon-system-template") {
                    data.instance.set_icon(data.node, 'fa fa-folder');
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function disableAllElements() {
        try {
            var Tree = $("#assetlocationModal").jstree(true).get_json('#', {
                'flat': true
            });
            var treeLength = Tree.length;
            for (i = 0; i < treeLength; i++) {
                var z = Tree[i];
                var icon = Tree[i].icon;
                if ((document_only == 1 && icon == "glyphicon glyphicon-video") || (document_only == 1 && icon == "glyphicon glyphicon-image") || (document_only == 2 && icon == "glyphicon glyphicon-video") || (document_only == 2 && icon == "glyphicon glyphicon-image")) {
                    $("#assetlocationModal").jstree().disable_node(z["id"]);
                } else if ((image_only == 1 && icon == "glyphicon glyphicon-doc-file") || (image_only == 1 && icon == "glyphicon glyphicon-video") || (image_only == 1 && icon == "glyphicon glyphicon-video") || (image_only == 1 && icon == "glyphicon glyphicon-pdf-file")) {
                    $("#assetlocationModal").jstree().disable_node(z["id"]);
                }
                if (doc_not_allowed == 1 && (icon == "glyphicon glyphicon-doc-file" || icon == "glyphicon glyphicon-pdf-file")) {
                    $("#assetlocationModal").jstree().disable_node(z["id"]);
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function disabletreeIconChangerOpen(e, data) {
        disableAlreadyPresentCPJStree();
    }

    function disableAlreadyPresentCPJStree() {
        try {
            activeContentPanels();
            var activeCP = [];
            var contentPanelHaveChildArrLength = contentPanelHaveChildArr.length;
            for (var i = 0; i < contentPanelHaveChildArrLength; i++) {
                activeCP.push(contentPanelHaveChildArr[i].children[0].getAttribute("folder_view_id"));
            }
            var activeCPLength = activeCP.length;
            for (var i = 0; i < activeCPLength; i++) {
                if (activeCP[i] != undefined) {
                    if ($("#locationModal").jstree("get_node", "#" + activeCP[i])) {
                        var node = $("#locationModal").jstree("get_node", "#" + activeCP[i]);
                        if (node.parent != 5) {
                            $("#locationModal").jstree().disable_node(node);
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function disableOtherClouds() {
        try {
            $("#locationModal").jstree("delete_node", "#" + 3);
            $("#locationModal").jstree("delete_node", "#" + 4);
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    var currentIndex = null;
    var activeSlide = null;
    $(".slideSecClass").delegate(".deleteSlider", "click", function () {
        try {
            $(this).addClass('pwdon0');
            carouselId = this.parentElement.parentNode.parentElement.children[2].id;
            contentPanelId = this.parentElement.parentNode.parentElement.parentElement.id;
            activeSlide = $("#" + carouselId).children('.carousel-inner').find(".active");
            currentIndex = $('div.active').index();
            initializeInlineEditor();
            showDeleteConfirmationBox(null, "DELETE THIS SLIDE?", "deleteSlide");
            $("#DeleteconfirmationBoxModal .confirmButton.delete-button").removeClass("pwdon0");
        } catch (err) {
            console.log(err.message)
        }
    });
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function deleteSlide() {
        try {
            isSavedChanegs = 1;
            var ActiveElement = $("#" + contentPanelId).find('.item.active');
            ActiveElement.remove();
            var NextElement = $("#" + contentPanelId).find('.item').first();
            NextElement.addClass('active');
            var ActiveSlideNo = $("#" + contentPanelId).find('.carousel-indicators-common').find(".active");
            ActiveSlideNo.removeAttr('class');
            var firstSlideNo = $("#" + contentPanelId).find('.carousel-indicators-common').children().first();
            firstSlideNo.addClass('active');
            // var lastSlideNo = $("#" +
            // carouselId).children('.carousel-indicators-common').children("li").last();
            var lastSlideNo = $("#" + contentPanelId).find('.carousel-indicators-common').children("li").last();
            lastSlideNo.remove();
            slideindibuttonDisabler(contentPanelId, carouselId);
            $("#DeleteconfirmationBoxModal").modal('hide');
            initializeInlineEditor();
            success_generic_notification("SLIDE DELETED");
            $("#DeleteconfirmationBoxModal .confirmButton.delete-button").addClass("pwdon0");
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     ******************************************`***************************************/
    function SlideButtonsDisabler() {
        try {
            var contentPanelArr = document.getElementsByClassName('slideSecClass');
            var contentPanelHaveChildArr = [];
            var contentPanelArrLength = contentPanelArr.length;
            for (var i = 0; i < contentPanelArrLength; i++) {
                var slide = contentPanelArr[i];
                if (slide.childElementCount) {
                    contentPanelHaveChildArr.push(contentPanelArr[i]);
                    var contentPanelId = contentPanelArr[i].id;
                    $("#" + contentPanelId + ' .left-arrow').attr('style', 'display:none');
                    if (contentPanelArr[i].children[0].getElementsByClassName('carousel').length > 0) {
                        var contentPanelCarouselId = contentPanelArr[i].children[0].getElementsByClassName('carousel')[0].id;
                        if ($("#" + contentPanelId + ' .slideDiv').length > 0) {
                            slideindibuttonDisabler(contentPanelId, contentPanelCarouselId);
                        }
                    }
                }
            }
            if (contentPanelHaveChildArr.length > noOfMaxCPAllowed) $(".addContentpanelAfter").addClass("pwdon0");
            panelindibuttonDisabler(contentPanelHaveChildArr);
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    // TODO
    function slideindibuttonDisabler(contentPanelId, contentPanelCarouselId) {
        try {
            $(".carousel").off('keydown.bs.carousel');
            /* no. of slides in a content panel */

            if ($("#" + contentPanelId + ' .slideDiv').length > 0) {
                noOfSlidesPerCP = $("#" + contentPanelId).find('.carousel-inner').children().length;
                /* all buttons intialized */
                var addPanelButton = $("#" + contentPanelId + " .slide-glyphicon-plus .changeSlider");
                var mleftPanelButton = $("#" + contentPanelId)[0].getElementsByClassName("sliderLeft");
                var mrightPanelButton = $("#" + contentPanelId)[0].getElementsByClassName("sliderRight");
                var deletePanelButton = $("#" + contentPanelId)[0].getElementsByClassName("deleteSlider");
                var printPanelButton = $("#" + contentPanelId)[0].getElementsByClassName("carusoalprint");
                $("#" + contentPanelId + ' .slide-glyphicon-plus').removeClass("disabledBackground");
                $("#" + contentPanelId + ' .slide-glyphicon-delete').removeClass("disabledBackground");
                /* firstaddbutton disabler/enabler */
                var classlist1 = addPanelButton[0].className;
                var classlist4 = deletePanelButton[0].className;
                // Disable print button for single slid only
                if (noOfSlidesPerCP > 1) {
                    $(printPanelButton).removeClass('pwdon0');
                    $(printPanelButton).children('svg').attr('style', 'fill:#f6f6f6');
                    $(printPanelButton).parent().attr('title', 'Get Print Version');
                    $("#" + contentPanelId + ' .panel-glyphicon-print').removeClass("disabledBackground");
                } else {
                    $(printPanelButton).addClass('pwdon0');
                    $(printPanelButton).children('svg').attr('style', 'fill:#777777');
                    $(printPanelButton).parent().attr('title', 'Print Version unavailable');
                    $("#" + contentPanelId + ' .panel-glyphicon-print').addClass("disabledBackground");
                }
                if (noOfSlidesPerCP >= 6) {
                    if (classlist1.indexOf("pwdon0") == -1) {
                        var e = $("#" + contentPanelId + ' .slide-glyphicon-plus .changeSlider');
                        e.children('svg').attr('style', 'fill:#777777');
                        $("#" + contentPanelId + ' .slide-glyphicon-plus').attr('title', 'Can not exceeds six slides');
                        $("#" + contentPanelId + ' .slide-glyphicon-plus').addClass("disabledBackground");
                        addPanelButton[0].setAttribute("class", classlist1 + " pwdon0");
                    } else {
                        $("#" + contentPanelId + ' .slide-glyphicon-plus').attr('title', 'Can not exceeds six slides');
                        $("#" + contentPanelId + ' .slide-glyphicon-plus').addClass("disabledBackground");
                    }
                } else {
                    if (classlist4.indexOf("pwdon0") > 0) {
                        var e1 = $("#" + contentPanelId + '  .deleteSlider');
                        e1.children('svg').attr('style', 'fill:#ababab');
                        if (noOfSlidesPerCP == 1) {
                            $("#" + contentPanelId + ' .slide-glyphicon-delete').attr('title', 'Can not delete; must have at least one slide');
                            $("#" + contentPanelId + ' .slide-glyphicon-delete').addClass("disabledBackground");
                        }
                    }
                    if (classlist1.indexOf("pwdon0") > 0) {
                        var e = $("#" + contentPanelId + ' .changeSlider');
                        e.children('svg').attr('style', 'fill:#f6f6f6');
                        $("#" + contentPanelId + ' .slide-glyphicon-plus').attr('title', 'Add slides to the right');
                        $("#" + contentPanelId + ' .slide-glyphicon-plus').removeClass("disabledBackground");
                        var addButton = addPanelButton[0];
                        addButton.classList.remove("pwdon0");
                    }
                }
                /* moveLeft or right disabler/enabler */
                var classlist2 = mleftPanelButton[0].className;
                var classlist3 = mrightPanelButton[0].className;
                if (noOfSlidesPerCP == 1) {
                    $("#" + contentPanelId + ' .left-arrow').attr('style', 'display:none');
                    $("#" + contentPanelId + ' .right-arrow').attr('style', 'display:none');
                    if (classlist2.indexOf("pwdon0") == -1) {
                        var e = $("#" + contentPanelId + ' .sliderLeft');
                        e.children('svg').attr('style', 'fill:#777777');
                        $("#" + contentPanelId + ' .slide-glyphicon-left').attr('title', 'First slide in panel');
                        $("#" + contentPanelId + ' .slide-glyphicon-left').addClass("disabledBackground");
                        mleftPanelButton[0].setAttribute("class", classlist2 + " pwdon0");
                    } else {
                        $("#" + contentPanelId + ' .slide-glyphicon-left').attr('title', 'First slide in panel');
                        $("#" + contentPanelId + ' .slide-glyphicon-left').addClass("disabledBackground");
                    }
                    if (classlist3.indexOf("pwdon0") == -1) {
                        var e = $("#" + contentPanelId + ' .sliderRight');
                        e.children('svg').attr('style', 'fill:#777777');
                        $("#" + contentPanelId + ' .slide-glyphicon-right').attr('title', 'Last slide in panel');
                        $("#" + contentPanelId + ' .slide-glyphicon-right').addClass("disabledBackground");
                        mrightPanelButton[0].setAttribute("class", classlist3 + " pwdon0");
                        var e = $("#" + contentPanelId + '  .deleteSlider');
                        e.children('svg').attr('style', 'fill:#777777');
                        if (noOfSlidesPerCP == 1) {
                            $("#" + contentPanelId + ' .slide-glyphicon-delete').attr('title', 'Can not delete; must have at least one slide');
                            $("#" + contentPanelId + ' .slide-glyphicon-delete').addClass("disabledBackground");
                        }
                    } else {
                        $("#" + contentPanelId + ' .slide-glyphicon-right').attr('title', 'Last slide in panel');
                        $("#" + contentPanelId + ' .slide-glyphicon-right').addClass("disabledBackground");
                        if (noOfSlidesPerCP == 1) {
                            $("#" + contentPanelId + ' .slide-glyphicon-delete').attr('title', 'Can not delete; must have at least one slide');
                        }
                    }
                    if (classlist4.indexOf("pwdon0") == -1) {
                        var e = $("#" + contentPanelId + '  .deleteSlider');
                        e.children('svg').attr('style', 'fill:#777777');
                        if (noOfSlidesPerCP == 1) {
                            $("#" + contentPanelId + ' .slide-glyphicon-delete').attr('title', 'Can not delete; must have at least one slide');
                            $("#" + contentPanelId + ' .slide-glyphicon-delete').addClass("disabledBackground");
                        }
                        deletePanelButton[0].setAttribute("class", classlist4 + " pwdon0");
                    }
                } else {
                    $("#" + contentPanelId + ' .left-arrow').attr('style', 'display:block');
                    $("#" + contentPanelId + ' .right-arrow').attr('style', 'display:block');
                    var firstElement = $("#" + contentPanelId).find('.item').first();
                    var lastElement = $("#" + contentPanelId).find('.item').last();
                    var activeElement = $("#" + carouselId).find('.item.active');
                    if (firstElement.hasClass('active')) {
                        $("#" + contentPanelId + ' .left-arrow').attr('style', 'display:none');
                        if (classlist2.indexOf("pwdon0") == -1) {
                            var e = $("#" + contentPanelId + ' .sliderLeft');
                            e.children('svg').attr('style', 'fill:#777777');
                            $("#" + contentPanelId + ' .slide-glyphicon-left').attr('title', 'First slide in panel');
                            $("#" + contentPanelId + ' .slide-glyphicon-left').addClass("disabledBackground");
                            mleftPanelButton[0].setAttribute("class", classlist2 + " pwdon0");
                        } else {
                            $("#" + contentPanelId + ' .slide-glyphicon-left').attr('title', 'Last slide in panel');
                            $("#" + contentPanelId + ' .slide-glyphicon-left').addClass("disabledBackground");
                            if (noOfSlidesPerCP == 1) {
                                $("#" + contentPanelId + ' .slide-glyphicon-delete').attr('title', 'Can not delete; must have at least one slide');
                            }
                        }
                    } else {
                        if (classlist2.indexOf("pwdon0") > 0) {
                            var e = $("#" + contentPanelId + ' .sliderLeft');
                            e.children('svg').attr('style', 'fill:#f6f6f6');
                            $("#" + contentPanelId + ' .slide-glyphicon-left').attr('title', 'Move slide left');
                            $("#" + contentPanelId + ' .slide-glyphicon-left').removeClass("disabledBackground");
                            var mLeftButton = mleftPanelButton[0];
                            mLeftButton.classList.remove("pwdon0");
                        }
                    }
                    if (lastElement.hasClass('active')) {
                        $("#" + contentPanelId + ' .right-arrow').attr('style', 'display:none');
                        if (classlist3.indexOf("pwdon0") == -1) {
                            var e = $("#" + contentPanelId + ' .sliderRight');
                            e.children('svg').attr('style', 'fill:#777777');
                            $("#" + contentPanelId + ' .slide-glyphicon-right').attr('title', 'Last slide in panel');
                            $("#" + contentPanelId + ' .slide-glyphicon-right').addClass("disabledBackground");
                            mrightPanelButton[0].setAttribute("class", classlist3 + " pwdon0");
                            var e1 = $("#" + contentPanelId + ' .deleteSlider');
                            e.children('svg').attr('style', 'fill:#777777');
                            if (noOfSlidesPerCP == 1) {
                                $("#" + contentPanelId + ' .slide-glyphicon-delete').attr('title', 'Can not delete; must have at least one slide');
                                $("#" + contentPanelId + ' .slide-glyphicon-delete').addClass("disabledBackground");
                            }
                        } else {
                            $("#" + contentPanelId + ' .slide-glyphicon-right').attr('title', 'Last slide in panel');
                            $("#" + contentPanelId + ' .slide-glyphicon-right').addClass("disabledBackground");
                            if (noOfSlidesPerCP == 1) {
                                $("#" + contentPanelId + ' .slide-glyphicon-delete').attr('title', 'Can not delete; must have at least one slide');
                            }
                        }
                    } else {
                        if (classlist3.indexOf("pwdon0") > 0) {
                            var e = $("#" + contentPanelId + ' .sliderRight');
                            e.children('svg').attr('style', 'fill:#f6f6f6');
                            $("#" + contentPanelId + ' .slide-glyphicon-right').attr('title', 'Move slide right');
                            $("#" + contentPanelId + ' .slide-glyphicon-right').removeClass("disabledBackground");
                            var e1 = $("#" + contentPanelId + ' .deleteSlider');
                            e.children('svg').attr('style', 'fill:#f6f6f6');
                            $("#" + contentPanelId + ' .slide-glyphicon-delete').attr('title', 'Delete slide');
                            $("#" + contentPanelId + ' .slide-glyphicon-delete').removeClass("disabledBackground");
                            var mRightButton = mrightPanelButton[0];
                            mRightButton.classList.remove("pwdon0");
                        }
                    }
                    if (activeElement.hasClass('mandatorySlide')) {
                        if (classlist4.indexOf("pwdon0") == -1) {
                            deletePanelButton[0].setAttribute("class", classlist4 + " pwdon0");
                        }
                    } else {
                        if (classlist4.indexOf("pwdon0") > 0) {
                            var e = $("#" + contentPanelId + ' .deleteSlider');
                            e.children('svg').attr('style', 'fill:#f6f6f6');
                            $("#" + contentPanelId + ' .slide-glyphicon-delete').attr('title', 'Delete slide');
                            // $("#" + contentPanelId + '
                            // .slide-glyphicon-left').removeClass("disabledBackground");
                            $("#" + contentPanelId + ' .slide-glyphicon-left').removeClass("disabledBackground");
                            var mDeleteButton = deletePanelButton[0];
                            mDeleteButton.classList.remove("pwdon0");
                        }
                    }
                }
                var nonMovable = $("#" + contentPanelId + ' .item.active').children().children().hasClass('nonMovable');
                var prevNonMovable = $("#" + contentPanelId + ' .item.active').prev().children().children().hasClass('nonMovable');
                var nextNonMovable = $("#" + contentPanelId + ' .item.active').next().children().children().hasClass('nonMovable');
                if (nonMovable) {
                    var e = $("#" + contentPanelId + ' .sliderLeft');
                    e.children('svg').attr('style', 'fill:#777777');
                    $("#" + contentPanelId + ' .slide-glyphicon-left').attr('title', 'Slide not Movable');
                    $("#" + contentPanelId + ' .slide-glyphicon-left').addClass("disabledBackground");
                    mleftPanelButton[0].setAttribute("class", classlist2 + " pwdon0");
                    var e = $("#" + contentPanelId + ' .sliderRight');
                    e.children('svg').attr('style', 'fill:#777777');
                    $("#" + contentPanelId + ' .slide-glyphicon-right').attr('title', 'Slide not Movable');
                    $("#" + contentPanelId + ' .slide-glyphicon-right').addClass("disabledBackground");
                    mrightPanelButton[0].setAttribute("class", classlist3 + " pwdon0");
                }
                if (prevNonMovable) {
                    var e = $("#" + contentPanelId + ' .sliderLeft');
                    e.children('svg').attr('style', 'fill:#777777');
                    $("#" + contentPanelId + ' .slide-glyphicon-left').attr('title', 'Slide not Movable');
                    $("#" + contentPanelId + ' .slide-glyphicon-left').addClass("disabledBackground");
                    mleftPanelButton[0].setAttribute("class", classlist2 + " pwdon0");
                }
                if (nextNonMovable) {
                    var e = $("#" + contentPanelId + ' .sliderRight');
                    e.children('svg').attr('style', 'fill:#777777');
                    $("#" + contentPanelId + ' .slide-glyphicon-right').attr('title', 'Slide not Movable');
                    $("#" + contentPanelId + ' .slide-glyphicon-right').addClass("disabledBackground");
                    mrightPanelButton[0].setAttribute("class", classlist3 + " pwdon0");
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    // TODO Unused function
    function closeModal() {
        try {
            if (noOfSlidesPerCP != 1) {
                $(".deleteSlider ").removeClass('pwdon0');
            }
            $("#getAssetsEditorModal").modal('hide');
            slideindibuttonDisabler(contentPanelId, myCarousel);
        } catch (err) {
            console.log(err.message)
        }
    }

    function closeDelSlideModal() {
        try {
            if (noOfSlidesPerCP != 1) {
                $(".deleteSlider ").removeClass('pwdon0');
            }
            $("#DeleteconfirmationBoxModal").modal('hide');
            slideindibuttonDisabler(contentPanelId, myCarousel);
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    var contentPanelHaveChildArr = [];
    var contentPanelArr = [];

    function activeContentPanels() {
        try {
            contentPanelHaveChildArr = [];
            contentPanelArr = document.getElementsByClassName('slideSecClass');
            var contentPanelArrLength = contentPanelArr.length;
            for (var i = 0; i < contentPanelArrLength; i++) {
                var slide = contentPanelArr[i];
                if (slide.childElementCount) {
                    contentPanelHaveChildArr.push(contentPanelArr[i]);
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    function panelbuttonDisabler() {
        activeContentPanels();
        panelindibuttonDisabler(contentPanelHaveChildArr);
    }

    function panelindibuttonDisabler(contentPanelHaveChildArr) {
        try {
            /* this gives the length of array */
            var panelArrLength = contentPanelHaveChildArr.length;
            if (panelArrLength > 0) {
                /* first panel and last panel id */
                var firstPanel = contentPanelHaveChildArr[0].id;
                var lastPanel = contentPanelHaveChildArr[panelArrLength - 1].id;
                /* buttons according to panel id */
                var panelUpButtonClass = $('#' + firstPanel + ' .carusoalup')[0];
                var panelDownButtonClass = $('#' + lastPanel + ' .carusoaldown')[0];
                $(".panel-glyphicon-up , .panel-glyphicon-down").removeClass("disabledBackground");
                /* disable panel UP button for first Panel */
                $('.panel-glyphicon-up').attr('title', 'Move panel up');
                $('.carusoalup').removeClass("pwdon0");
                $('.carusoalup').children('svg').attr('style', 'fill:#f6f6f6');
                $('#' + firstPanel + ' .carusoalup').addClass("pwdon0");
                $('#' + firstPanel).find('.carusoalup').children('svg').attr('style', 'fill:#777777');
                $('#' + firstPanel).find('.panel-glyphicon-up').attr('title', 'Panel in highest slot')
                $('#' + firstPanel).find('.panel-glyphicon-up').addClass("disabledBackground");
                /* disable panel DOWN button for last Panel */
                $('.panel-glyphicon-down').attr('title', 'Move panel down');
                $('.carusoaldown').removeClass("pwdon0");
                $('.carusoaldown').children('svg').attr('style', 'fill:#f6f6f6');
                $('#' + lastPanel + ' .carusoaldown').addClass("pwdon0");
                $('#' + lastPanel).find('.carusoaldown').children('svg').attr('style', 'fill:#777777');
                $('#' + lastPanel).find('.panel-glyphicon-down').attr('title', 'Panel in lowest slot')
                $('#' + lastPanel).find('.panel-glyphicon-down').addClass("disabledBackground");
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    var tmpEl = null;
    var direction = "L";

    function disableAlreadyPresentCP() {
        try {
            tinymce.remove();
            activeContentPanels();
            var activeCP = [];
            var contentPanelHaveChildArrLength = contentPanelHaveChildArr.length;
            for (var i = 0; i < contentPanelHaveChildArrLength; i++) {
                activeCP.push($(contentPanelHaveChildArr[i]).find('.contentpanelname').attr('contentpanelname'));
            }
            var activeCPLength = activeCP.length;
            for (var i = 0; i < activeCPLength; i++) {
                var sortable1ChildernLength = $("#sortable1").children().length;
                for (var j = 0; j < sortable1ChildernLength; j++) {
                    var ss = $("#sortable1").children()[j];
                    var auxPanels = [{
                        "Name": "INVITATION",
                        "count": "3"
                    }, {
                        "Name": "FOR DOWNLOAD",
                        "count": "3"
                    }, {
                        "Name": "BLANK CONTENT PANEL",
                        "count": "3"
                    }];
                    var hasMatch = false;
                    var count = 0;
                    if (ss.textContent == activeCP[i]) {
                        var auxPanelsLength = auxPanels.length;
                        for (var index = 0; index < auxPanelsLength; ++index) {
                            var auxName = auxPanels[index];
                            if (auxName.Name == activeCP[i]) {
                                hasMatch = true;
                                count = auxName.count;
                                break;
                            }
                        }
                        if (hasMatch == true) {
                            var counter = countElement(activeCP[i], activeCP);
                            if (auxName.count <= counter) {
                                $(ss).addClass('disabled');
                            }
                        } else {
                            $(ss).addClass('disabled');
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function countElement(item, array) {
        try {
            var count = 0;
            $.each(array, function (i, v) {
                if (v === item) count++;
            });
            return count;
        } catch (err) {
            console.log(err.message)
        }
    }


    /**********************************************************************************
     * created By : Avinash
     * Description : Disabler text content for drag and drop in Editor
     *********************************************************************************/
    function EditorDragAndDropDisabled() {
        try {
            $(".assetseditor").attr("ondragstart", "return false;");
            $(".assetseditor").attr("ondrop", "return false;");
        } catch (err) {
            console.log(err.message)
        }
    }


    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    var cpId = "";
    $(".slideSecClass").hover(function () {
        cpId = this.id;
        $("#" + cpId + " .slideDiv").css("display", "block");
        $("#" + cpId + " .panelDiv").css("display", "block");
        /* $("#" + cpId + " .carousel-inner").css("outline", "none"); */
    }, function () {
        /* $("#" + cpId + " .carousel-inner").css("outline", "none"); */
        $("#" + cpId + " .slideDiv").css("display", "none");
        $("#" + cpId + " .panelDiv").css("display", "none");
    });


    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    $(".imageEditor").click(function () {
        try {
            console.log("imageEditor Clicked");
            // $(this).attr("ineditmode","true");
            var edt = $(this).attr("class");
            var href = $(this).children('img').attr('href');
            // alert(href);
            if (edt.indexOf("non-editable") == -1) {
                $(this).attr("ineditmode", "true");
                // $(".image-hyperlink").css({"display":"block"});
                if (href != undefined) {
                    $("#hyperlinkVal").val(href);
                } else {
                    $("#hyperlinkVal").val("http://");
                }
                Editor($(this).attr("actionUrl"), "image", null, "SELECT AN IMAGE");
            }
        } catch (err) {
            console.log(err.message)
        }
    });
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function showDeleteConfirmationBox(title, message, contentData) {
        try {
            var myModal = $('#DeleteconfirmationBoxModal');
            modalBody = myModal.find('.modal-body');
            modalHeader = myModal.find('.modal-header').find('.modal-title');
            modalMessage = modalBody.find('.message').css('dispaly', 'block');
            if (contentData == "redirectButton") {
                myModal.find('.modal-body').find('.confirmButton').attr('value', "YES, BACK");
            } else if (contentData == "deleteSection") {
                myModal.find('.modal-body').find('.confirmButton').attr('value', "YES, DELETE");
            } else if (contentData == "deleteSlide") {
                myModal.find('.modal-body').find('.confirmButton').attr('value', "YES, DELETE");
                myModal.find('.modal-body').find('.scroll-toggle-cancel-delete').attr('onClick', 'closeDelSlideModal()');
            }
            myModal.find('.modal-body').find('.confirmButton').attr('onClick', contentData + '()');
            modalHeader.text(title);
            modalMessage.text(message);
            myModal.modal('show');
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    var char_max;
    var char_actual;
    var allowed_keys = [8, 13, 16, 17, 18,
        20, 33, 34, 35, 36, 37, 38, 39,
        40, 46
    ];
    var setHardReturn;
    var ctrlDown = false;
    // tinymce
    var ctrlKey = 17;
    var cmdKey = 91;
    var vKey = 86;
    var cKey = 67;

    function onClickTinyMCE(ele) {
        try {
            $(".carousel").off('keydown.bs.carousel');
            var edt = jQuery.inArray("non-editable", ele[0].classList);
            char_max = $(ele).attr("maxlength");
            if (edt == -1) {
                setHardReturn = checkforHardReturn($(ele).context.classList);
                if (documentEditorInline == true) {
                    setHardReturn = true;
                }
                var secId = $(ele).attr("sectionid");
                tinymce.init({
                    selector: "." + secId,
                    inline: true,
                    plugins: ["advlist lists", "autolink", "link", "paste", "autoresize"],
                    toolbar1: "textHeading bold italic underline | bullist numlist | link unlink | charcount",
                    toolbar_items_size: 'small',
                    menubar: false,
                    browser_spellcheck: true,
                    default_link_target: "_blank",
                    link_assume_external_targets: 'false',
                    paste_webkit_styles: "none",
                    paste_data_images: false,
                    paste_as_text: true,
                    setup: function (ed) {
                        ed.addButton('textHeading', {
                            text: "Text:",
                            icon: false
                        });
                        ed.addButton('charcount', {
                            text: char_max,
                            icon: false
                        });
                        ed.on("KeyDown", function (ed, evt) {
                            var selectedlength = 0;
                            isSavedChanegs = 1;
                            if (window.getSelection()) {
                                selectedlength = tinyMCE.activeEditor.selection.getContent({
                                    format: 'text'
                                }).toString().replace(/\n|\r/g, "").length;
                            }
                            char_actual = $(".mce-edit-focus").text().length;
                            chars_without_html = $(".mce-edit-focus").text().length;
                            if (ed.keyCode == ctrlKey || ed.keyCode == cmdKey) {
                                ctrlDown = true;
                            }
                            var key = ed.keyCode;
                            if (setHardReturn && (key == 13)) {
                                ed.stopPropagation();
                                ed.preventDefault();
                                return;
                            }
                            if (allowed_keys.indexOf(key) != -1) {
                                alarmChars();
                                return;
                            }
                            if ((chars_without_html - selectedlength) > char_max) {
                                $(".mce-tinymce:visible button:last span").css('color', 'red');
                                ed.stopPropagation();
                                ed.preventDefault();
                            } else if (
                                (chars_without_html - selectedlength) > char_max - 1 && key != 8 && key != 46) {
                                if (key == 67 && ctrlDown == true) {
                                    return;
                                }
                                if (key == vKey && ctrlDown == true) {
                                    return;
                                }
                                ed.stopPropagation();
                                ed.preventDefault();
                            }
                            alarmChars();
                        });
                        ed.on('KeyUp', function (e) {
                            if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
                                ctrlDown = false;
                            }
                            char_actual = $(".mce-edit-focus").text().length;
                            chars_without_html = $(".mce-edit-focus").text().length;
                            tinymce_updateCharCounter(this, chars_without_html);
                            alarmChars();
                        });
                    },
                    paste_preprocess: function (plugin, args) {
                        var editor = tinymce.get(tinymce.activeEditor.id);
                        var len = tinymce.activeEditor.bodyElement.textContent.length;
                        var text = null;
                        var argsWorkingContent = 1;
                        var noOfHardReturns = null;
                        try {
                            if ($($(args.content)[$(args.content).length - 1]).text() === "") {
                                text = args.content.replace(/<p[^>]*>/g, "").replace(/<\/p[^>]*>/g, "").replace(/[<]br[^>]*[>]/gi, "");
                            } else {
                                text = $(args.content).text();
                                noOfHardReturns = $(args.content).text().split(/\r\n|\r|\n/).length;
                                if (text == "") {
                                    text = $(args).attr("content").replace(/[<]*[^>]*[>]/gi, "");
                                }
                            }
                        } catch (e) {
                            argsWorkingContent = 0;
                        }
                        if (argsWorkingContent == 0) {
                            try {
                                text = args.content.replace(/[<]br[^>]*[>]/gi, "");
                            } catch (e) {
                                argsWorkingContent = 0;
                            }
                        }
                        var selectedlength = 0;
                        if (window.getSelection()) {
                            selectedlength = tinyMCE.activeEditor.selection.getContent({
                                format: 'text'
                            }).toString().replace(/\n|\r/g, "").length;
                        }
                        if ((len + text.length - selectedlength - (noOfHardReturns / 2)) > parseInt(char_max)) {
                            args.stopPropagation();
                            args.preventDefault();
                        } else {
                            tinymce_updateCharCounter(editor, len + text.length);
                        }
                    }
                });
            } else {
                tinymce.EditorManager.execCommand('mceRemoveEditor', true, ele[0].id);
                $(ele).removeClass("mce-edit-focus mce-content-body");
                $(ele).addClass("lock non-editable");
                document.activeElement.blur();
                return;
            }
            char_actual = $(".mce-edit-focus").text().length;
            $(".mce-tinymce:visible button:last span").text(char_max - char_actual);
            alarmChars();
            documentEditorInline = false;
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    var bExists = false;

    function hasCommonElement(arr1, arr2) {
        try {
            bExists = false;
            $.each(arr2, function (index, value) {
                if ($.inArray(value, arr1) != -1) {
                    bExists = true;
                }
                if (bExists) {
                    return false; // break
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    var obstructedManually = [];
    // return boolean
    function checkforHardReturn(edClassList) {
        try {
            checkforHardReturnVarInit();
            hasCommonElement(edClassList, obstructedManually);
            return bExists;
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function checkIfLinkFunctionalityAvailable(edClassList) {
        checkIfLinkFunctionalityAvailableVarInit();
        hasCommonElement(edClassList, obstructedManually);
        return bExists;
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function alarmChars() {
        try {
            if (char_actual > char_max) {
                $(".mce-tinymce:visible button:last span").css('color', 'red');
            } else {
                $(".mce-tinymce:visible button:last span").css('color', '#00afaa');
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    function tinymce_updateCharCounter(el, len) {
        try {
            $(".mce-tinymce:visible button:last span").html(char_max - len);
        } catch (err) {
            console.log(err.message)
        }
    }

    var maxLenghtEditor;
    $(document).delegate(".inline-textEditor", "click", function () {
        try {
            var ele = $(this);
            onClickTinyMCE(ele);
        } catch (err) {
            console.log(err.message)
        }
    });


    var undofunctionId;
    var undoLastState;
    var UNDOarray = [];

    function activateUNDO() {
        try {
            UNDOarray = [];
            UNDOarray.push(undofunctionId);
            UNDOarray.push(undoLastState);
            $(".undoBtn").removeClass("pwdon0");
        } catch (err) {
            console.log(err.message)
        }
    }

    function success_generic_notification(text) {
        try {
            var t = "SORRY , NOT ABLE TO UPDATE THE THEME";
            if (text == t) {
                $("#failure_notification_inner_text").html(text);
                $("#failure_notification_div").stop().fadeIn(200).delay(2000).fadeOut(200);
            } else {
                $("#success_notification_inner_text").html(text);
                $("#success_notification_div").stop().fadeIn(200).delay(2000).fadeOut(200);
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    /**********************************************************************************
     * created By : Saurabh
     * Description : To changes soe tanents
     *********************************************************************************/
    function copytext(ele) {
        try {
            var contentPanelID = $(ele).closest("section")[0].id;
            var commonclass = $(ele).attr("sectionid");
            // $("#" + contentPanelID + " ." + commonclass).html($(ele).html());
            if ($(ele).text().length < 2) {
                if ($(ele.parentElement).hasClass('inner-positioner-header-panel-heading')) {
                    $("#" + contentPanelID + " .slider-mobile-view-hearder.").html("<p>MORE INFORMATION</p>");
                }
            } else {
                $("#" + contentPanelID + " .slider-mobile-view-hearder").html($(ele).html());
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    // TODO
    $(".slideSecClass").delegate(".glyphicon-sign-switch", "click", function () {
        try {
            var controllerClasses = $(this).attr('class');
            var charaElement = this.parentElement.parentElement.previousElementSibling.children[1];
            var imgElement = this.parentNode.firstElementChild;
            if (controllerClasses.indexOf("sign-collapsed") == -1) {
                $(this.children[0].children[0].children[0]).attr("class", "");
                $(this).attr("class", "slideFunctionalIcons glyphicon-sign-switch sign-collapsed");
                $(charaElement).attr("maxlength", "550");
                $(imgElement).hide();
            } else {
                $(this.children[0].children[0].children[0]).attr("class", "sign-icon");
                $(this).attr("class", "slideFunctionalIcons glyphicon-sign-switch");
                $(charaElement).attr("maxlength", "400");
                $(imgElement).show();
                $(charaElement).html(charaElement.textContent.substring(0, 400));
            }
        } catch (err) {
            console.log(err.message)
        }
    });
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    // TODO
    var permission = null;

    function buttonEnablernadDisablerforAssets(e, data) {
        try {
            // Approaching based upon icons which node carries
            var icon = data.instance.get_node(data.selected[0]).icon;
            selectedNodeType = data.instance.get_node(data.selected[0]).icon;
            parentsArray = data.instance.get_node(data.selected[0]).parents;
            selectedNodeParentId = data.instance.get_node(data.selected[0]).parent;
            selectedNode = data.instance.get_node(data.selected[0]).id;
            selectedNodeName = data.instance.get_node(data.selected[0]).text
            permission = data.instance.get_node(data.selected[0]).li_attr.permissionBy;
            var rootNodeId = data.instance.get_node(data.selected[0]).original.asset_root_node_id;
            if (icon == "glyphicon glyphicon-cloud") {
                $("#addAndReplaceAssetBtn").addClass("pwdon0");
                $("#addAndReplaceAssetBtn2").addClass("pwdon0");
                $("#LocationSelectedInfo").find(".fa-check-circle").addClass("fa-circle-thin").removeClass("fa-check-circle");
            }
            if (total_files_count > 0) {
                // New Changes
                if ((icon == "fa fa-folder") || (icon == "fa fa-folder-open" || icon == "glyphicon glyphicon-user" || icon == "fa fa-folder-locked" || icon == "fa fa-folder-locked-open" || icon == "fa-fa-folder-brand-closed" || icon == "fa-fa-folder-brand-open" || icon == "fa-fa-folder-palette-closed" || icon == "fa-fa-folder-palette-open")) {
                    $("#addAndReplaceAssetBtn").addClass("pwdon0");
                    $("#addAndReplaceAssetBtn2").addClass("pwdon0");
                    $("#LocationSelectedInfo").find(".fa-check-circle").addClass("fa-circle-thin").removeClass("fa-check-circle");
                    var permissionby = null;
                    if (parentsArray.length > 2) {
                        permissionby = data.instance.get_node(parentsArray[parentsArray.length - 3]).a_attr.permissionBy;
                    } else if (parentsArray.length > 1) {
                        permissionby = data.instance.get_node(parentsArray[parentsArray.length - 2]).a_attr.permissionBy;
                    }
                    if (permission == "BA" || permissionby == "BA") {
                        $("#addAndReplaceAssetBtn2").removeClass("pwdon0");
                        $("#LocationSelectedInfo").find(".fa-circle-thin").removeClass("fa-circle-thin").addClass("fa-check-circle");
                    }
                    if (permissionby == "BA") {
                        if (permission == "AP" || permission == undefined) {
                            $("#addAndReplaceAssetBtn2").removeClass("pwdon0");
                            $("#LocationSelectedInfo").find(".fa-circle-thin").removeClass("fa-circle-thin").addClass("fa-check-circle");
                        }
                    }
                    if (permission == "BA") {
                        if (permissionby == "AP" || permissionby == undefined) {
                            $("#addAndReplaceAssetBtn2").removeClass("pwdon0");
                            $("#LocationSelectedInfo").find(".fa-circle-thin").removeClass("fa-circle-thin").addClass("fa-check-circle");
                        }
                    }
                    if (permission == undefined) {
                        if (permissionby == "BA") {
                            $("#addAndReplaceAssetBtn2").removeClass("pwdon0");
                            $("#LocationSelectedInfo").find(".fa-circle-thin").removeClass("fa-circle-thin").addClass("fa-check-circle");
                        } else {
                            $("#addAndReplaceAssetBtn2").addClass("pwdon0");
                            $("#LocationSelectedInfo").find(".fa-check-circle").addClass("fa-circle-thin").removeClass("fa-check-circle");
                        }
                    }
                    if ((selectedNodeName == "PRIMARY - COVER IMAGES" || selectedNodeName == "COVER IMAGES") && (icon == "fa fa-folder-locked" || icon == "fa fa-folder-locked-open")) {
                        $("#addAndReplaceAssetBtn").addClass("pwdon0");
                        $("#addAndReplaceAssetBtn2").addClass("pwdon0");
                        $("#LocationSelectedInfo").find(".fa-check-circle").addClass("fa-circle-thin").removeClass("fa-check-circle");
                    }
                    // New Changes
                    if (selectedNodeName == "PRIMARY" && (icon == "fa-fa-folder-brand-closed" || icon == "fa-fa-folder-brand-open") && rootNodeId == 1) {
                        $("#addAndReplaceAssetBtn").addClass("pwdon0");
                        $("#addAndReplaceAssetBtn2").addClass("pwdon0");
                        $("#LocationSelectedInfo").find(".fa-check-circle").addClass("fa-circle-thin").removeClass("fa-check-circle");
                    }
                    if (rootNodeId == 2 && permission == "BA" && (icon == "fa-fa-folder-palette-closed" || icon == "fa-fa-folder-palette-open")) {
                        $("#addAndReplaceAssetBtn2").removeClass("pwdon0");
                    }
                }
            } else {
                // New Changes
                if ((icon == "fa fa-folder") || (icon == "fa fa-folder-open") || icon == "fa fa-folder-locked" || icon == "fa fa-folder-locked-open" || icon == "glyphicon glyphicon-user" || icon == "fa-fa-folder-brand-closed" || icon == "fa-fa-folder-brand-open" || icon == "fa-fa-folder-palette-closed" || icon == "fa-fa-folder-palette-open") {
                    $("#addAndReplaceAssetBtn").addClass("pwdon0");
                    $("#addAndReplaceAssetBtn2").addClass("pwdon0");
                    $("#LocationSelectedInfo").find(".fa-check-circle").addClass("fa-circle-thin").removeClass("fa-check-circle");
                    if (rootNodeId == 2 && permission == "BA" && (icon == "fa-fa-folder-palette-closed" || icon == "fa-fa-folder-palette-open")) {
                        $("#addAndReplaceAssetBtn2").addClass("pwdon0");
                    }
                }
            }
            if (selectedNodeType == "glyphicon glyphicon-text-background-cp" || selectedNodeType == "glyphicon glyphicon-doc-file" || selectedNodeType == "glyphicon glyphicon-image" || selectedNodeType == "glyphicon glyphicon-pdf-file" || selectedNodeType == "glyphicon glyphicon-video") {
                $("#addAndReplaceAssetBtn2").addClass("pwdon0");
                $("#LocationSelectedInfo").find(".fa-check-circle").addClass("fa-circle-thin").removeClass("fa-check-circle");
                $("#addAndReplaceAssetBtn").removeClass("pwdon0");
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : Image croppper Modal
     *********************************************************************************/
    function hideDropdownView(ulId, inputId) {
        try {
            $('#' + ulId).addClass('hide');
            $('#' + inputId).removeClass('inputforSelectActive');
        } catch (err) {
            console.log(err.message)
        }
    }

    function showDropdownView(ulId, inputId) {
        try {
            $('#' + ulId).removeClass('hide');
            $('#' + inputId).addClass('inputforSelectActive');
            $("#dropdown").addClass('brand-listing');
        } catch (err) {
            console.log(err.message)
        }
    }

    function toggleDropdownView(ulId, inputId) {
        try {
            if ($('#' + ulId).hasClass('hide')) {
                $('#' + ulId).removeClass('hide');
                $('#' + inputId).addClass('inputforSelectActive');
            } else {
                $('#' + inputId).removeClass('inputforSelectActive');
                $('#' + ulId).addClass('hide');
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    function activeBrandFiler(ele, id, inputId, ulId, hiddenIp) {
        try {
            var value = $("#" + inputId).val();
            $("#" + ulId).addClass('hide');
            var value = $("#" + id).html().trim();
            brandId = $("#" + id).attr("value");
            /* broadcastTempId = value; */
            $("#tempId").val($("#" + id)[0].value);
            $("#" + inputId).val(value);
            $('#' + inputId).removeClass('inputforSelectActive');
            $('#' + inputId).val($('#' + id).html());
            $('#' + hiddenIp).val($('#' + id).html());
            changeBrand();
        } catch (err) {
            console.log(err.message)
        }
    }


    function requestPrintBridgePreview(carousel, heading_cp_input) {
        try {
            var siteOrReport = window.location.pathname.indexOf("edit-report") > 0 ? 'report' : 'site';
            var tempId = selectedTemp;
            var fiscalYear = $('#fiscalYear').val();
            var data = {
                'type': siteOrReport,
                'template_id': tempId,
                'carousel_data': carousel,
                'heading_cp_input': heading_cp_input != undefined ? heading_cp_input : '',
                'site_container': url,
                'fiscal_year': fiscalYear
            };
            /**
             * Call from warning modal API for get previwe
             */
            $.ajax({
                type: "POST",
                url: "/printbridge/getpreview",
                data: data,
                // serializes the form's elements.
                dataType: "json",
                success: function (data) {
                    printPreviewData = data;
                    // Show Preview
                    // As of now bypass the preview and generate the pdf
                    /* generatePDF(data); */
                    console.log(data.result.html);
                    toggleProgressCircle(false);
                    initializeInlineEditor();
                    $('#pb-preview-container').attr('srcdoc', data.result.html);
                    $('#printBridgePreviewModal').modal('show');
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : Generate PDF for printbridge
     *********************************************************************************/
    function generatePDF(data) {
        try {
            console.log(data.result.html);
            var form = document.createElement('form');
            form.setAttribute('action', '/printbridge/generatepdf');
            form.setAttribute('method', 'POST');
            var input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', 'print_bridge_html');
            var input2 = document.createElement('input');
            input2.setAttribute('type', 'hidden');
            input2.setAttribute('name', 'site_url');
            input.value = data.result.html;
            input2.value = url;
            form.appendChild(input);
            form.appendChild(input2);
            document.body.appendChild(form);
            form.submit();
            $('#printBridgePreviewModal').modal('hide');
            toggleProgressCircle(true);
            initializeInlineEditor();
            setTimeout(function () {
                toggleProgressCircle(false);
            }, 5000);
        } catch (err) {
            console.log(err.message)
        }
    }

    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function reorderStack() {
        try {
            var mainStackArray = $("#" + sectionId).nextAll('.slideSecClass');
            var nextArrayHavingData = [];
            var mainStackArrayLength = mainStackArray.length;
            for (var j = 0; j < mainStackArrayLength; j++) {
                var slide = mainStackArray[j];
                if (slide.childElementCount) {
                    nextArrayHavingData.push(mainStackArray[j].innerHTML);
                }
            }
            var nextArrayHavingDataLength = nextArrayHavingData.length;
            for (var j = 0; j < nextArrayHavingDataLength; j++) {
                var slide = mainStackArray[j];
                if (slide.childElementCount) {
                    mainStackArray[j].children[0].remove();
                }
                if (j == 0) {
                    $("#" + sectionId)[0].innerHTML = nextArrayHavingData[j];
                } else {
                    mainStackArray[j - 1].innerHTML = nextArrayHavingData[j];
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    // TODO
    function documentAssetReplace(assetPath) {
        try {
            isSavedChanegs = 1;
            documentAssetReplaceDocumentIconPath();
            // img tag creationg
            var img = document.createElement('img');
            img.setAttribute('class', 'documentImg');
            img.setAttribute('alt', 'download document icon');
            img.setAttribute('src', docIconAssetPath);
            // creating div element with attributes
            var div = document.createElement('div');
            div.setAttribute('sectionId', duplicateSectionId);
            div.setAttribute('class', documentConvertClasses + " " + 'align-center-wrapper');
            div.setAttribute('sectionId', undofunctionId);
            div.setAttribute('ineditmode', false);
            div.setAttribute('return', false);
            var wOpenUrl = "window.open('" + assetPath + "', '_blank', 'fullscreen=yes' );"
            div.setAttribute('onClick', wOpenUrl);
            div.appendChild(img);
            var docElement = div;
            var removableEle = $(".assetseditor").filter("[ineditmode='true']");
            removableEle.addClass("removableElement");
            $(".assetseditor").filter("[ineditmode='true']").parent().prepend(docElement);
            $(".removableElement").remove();
            $(".assetseditor").filter("[ineditmode='true']").attr('ineditmode', 'false');
            activateUNDO();
            $('#assetUploadSiteEditorModal').modal('hide');
            success_generic_notification("ASSET REPLACED");
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : To get the url parameters
     *********************************************************************************/
    function getAllUrlParams(url) {
        try {
            // get query string from url (optional) or window
            var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
            // we'll store the parameters here
            var obj = {};
            // if query string exists
            if (queryString) {
                // stuff after # is not part of query string, so get rid of it
                queryString = queryString.split('#')[0];
                // split our query string into its component parts
                var arr = queryString.split('&');
                var arrLength = arr.length;
                for (var i = 0; i < arrLength; i++) {
                    // separate the keys and the values
                    var a = arr[i].split('=');
                    // in case params look like: list[]=thing1&list[]=thing2
                    var paramNum = undefined;
                    var paramName = a[0].replace(/\[\d*\]/, function (v) {
                        paramNum = v.slice(1, -1);
                        return '';
                    });
                    // set parameter value (use 'true' if empty)
                    var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
                    // (optional) keep case consistent
                    paramName = paramName.toLowerCase();
                    paramValue = paramValue.toLowerCase();
                    // if parameter name already exists
                    if (obj[paramName]) {
                        // convert value to array (if still string)
                        if (typeof obj[paramName] === 'string') {
                            obj[paramName] = [
                                obj[paramName]
                            ];
                        }
                        // if no array index number specified...
                        if (typeof paramNum === 'undefined') {
                            // put the value on the end of the array
                            obj[paramName].push(paramValue);
                        }
                        // if array index number specified...
                        else {
                            // put the value at that index number
                            obj[paramName][
                                paramNum
                            ] = paramValue;
                        }
                    }
                    // if param name doesn't exist yet, set it
                    else {
                        obj[paramName] = paramValue;
                    }
                }
            }
            // console.log(obj.year);
            return obj;
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : grammerly not supported
     *********************************************************************************/
    function init_grammerly_not_supported() {
        try {
            MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
            var observer = new MutationObserver(function (mutations, observer) {
                for (mutation in mutations) {
                    var m = mutations[mutation].target.hasAttribute("data-gramm_id");
                    var id = $('.inline-textEditor').attr('data-gramm_id');
                    if (m || id != undefined) {
                        // IE identified
                        window.location.assign('/site/grammerly-not-supported' + "?exitredirect=" + getAllUrlParams(window.location.href).exitredirect);
                    } else {
                        return;
                    }
                }
            });
            observer.observe(document, {
                subtree: true,
                attributes: true
            });
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function initializeInlineEditor() {
        try {
            update_repeated_section_id();
            // add class for lock icon
            $(".assetseditor.inline-textEditor").addClass("common-right-lock");
            var editorBoxArray = $(".inline-textEditor:not(.non-editable.lock.mce-content-body)");
            var editorBoxArrayLength = editorBoxArray.length;
            for (var i = 0; i < editorBoxArrayLength; i++) {
                inlineEditorDivInitializer(editorBoxArray[i]);
                $(editorBoxArray[i]).attr("data-gramm", "false");
            }
        } catch (e) {
            console.log(e);
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function inlineEditorDivInitializer(ele) {
        try {
            onClickTinyMCE($(ele));
        } catch (e) {
            console.log(e);
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    // submitForm Called
    $(document).delegate('#linkFundForm', 'submit', function (e) {
        submitForm(e, $(this));
    });

    function submitForm(e, $form) {
        try {
            if (e != null) e.preventDefault();
            // check if the input is valid
            if (!$form.valid()) return false;
            var contentType = "application/x-www-form-urlencoded"; // doubt
            var data = $form.serialize();
            data = data + "&type=" + type + "&url=" + url + "&reportYear=" + getAllUrlParams(window.location.href).year;
            $.ajax({
                url: $form.attr('action'),
                type: $form.attr('method'),
                data: data,
                dataType: 'json',
                contentType: contentType,
                processData: false,
                beforeSend: function () {
                    $form.find(':input[name="submitButton"]').attr('disabled', 'disabled');
                    toggleProgressCircle(true);
                },
                success: function (response) {
                    if ($form.attr('id') == 'linkFundForm') {
                        if (response != null && response.result != null && response.result.status == 'success' && response.result.code == 200) {
                            toggleProgressCircle(false);
                            localStorage.setItem('notificationPopUp', "1");
                            localStorage.setItem('confirmationFollowingProcedure', "1");
                            localStorage.setItem('confirmationFollowingProcedureMessage', response.result.message);
                            location.reload();
                        } else if (response != null && response.result != null && response.result.status == 'success' && response.result.code == 409) {
                            $('#linkFundsCommonModal').modal('hide');
                        } else {
                            notification_without_page_load(response.result.message);
                        }
                    }
                    $form.find(':input[name="submitButton"]').removeAttr('disabled');
                },
                error: function () {
                    // make button active
                    $form.find(':input[name="submitButton"]').removeAttr('disabled');
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function requestCpPreview(processId, selectedNode, selectedNodeName) {
        try {
            $.ajax({
                type: "POST",
                url: "/cprendering/content-panel-preview",
                data: {
                    'process-id': processId,
                    'content-panel-id': selectedNode,
                    'content-panel-name': selectedNodeName
                },
                dataType: "json",
                success: function (data) {
                    toggleProgressCircle(false);
                    $("#CpPreviewModal").find('h1').text('');
                    $("#CpPreviewModal").find('h1').text(selectedNodeName);
                    $('#cp-preview-container').attr('srcdoc', data.result.html);
                    $('#CpPreviewModal').modal('show');
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : Shift the report panel according to sequence
     *********************************************************************************/
    function setShiftedPanelIndex(type) {
        try {
            if (type == "report") {
                var posObj = {};
                if ($('#FUND_DESCRIPTION').length > 0) {
                    posObj["fund_description"] = $('#FUND_DESCRIPTION').parent()[0].id.substring(7) - 1;
                }
                if ($('#FUND_SOA').length > 0) {
                    posObj["fund_soa"] = $('#FUND_SOA').parent()[0].id.substring(7) - 1;
                }
                if ($('#FUND_PERFORMANCE').length > 0) {
                    posObj["fund_performance"] = $('#FUND_PERFORMANCE').parent()[0].id.substring(7) - 1;
                }
                if ($('#FUND_IMPACT').length > 0) {
                    posObj["fund_impact"] = $('#FUND_IMPACT').parent()[0].id.substring(7) - 1;
                }
                $('#fundPanelSequenceDetail').text(JSON.stringify(posObj));
                // remove RGCP from editor
                // panel by panel
                deleteRGCP('FUND_DESCRIPTION');
                deleteRGCP('FUND_SOA');
                deleteRGCP('FUND_PERFORMANCE');
                deleteRGCP('FUND_IMPACT');
            }
        } catch (e) {
            console.log(e);
        }
    }
    /**********************************************************************************
     * created By : Saurabh
     * Description : 
     *********************************************************************************/
    function deleteRGCP(eleId) {
        try {
            if ($('#' + eleId).length > 0) {
                sectionId = $('#' + eleId).parent()[0].id;
                $("#" + sectionId).children().remove();
                destroySlickCarousel('photoGalleryCarousel');
                activeContentPanels();
                reorderStack();
                $(".addContentpanelAfter").removeClass("pwdon0");
                $(".addCarouselPanelOuter").prop('title', 'Add content panel');
                panelbuttonDisabler();
                imageCarouselInitializer();

            }
        } catch (err) {
            console.log(err.message)
        }
    }




    /* select Fund name DropDown click function */
    function activeFundname(ele, id, inputId, ulId, hiddenIp) {
        initialConfDDFund(ele, id, inputId, ulId, hiddenIp);
    }
    /* Basic setup for all dropdown box */
    function initialConfDD(ele, id, inputId, ulId, hiddenIp) {
        try {
            var value = $("#" + inputId).val();
            $("#" + ulId).addClass('hide');
            var value = $("#" + id).html().trim();
            $("#" + inputId).val(value);
            $('#' + inputId).removeClass('inputforSelectActive');
            $('#' + inputId).val($('#' + id).html());
            $('#' + hiddenIp).val($("#" + id)[0].value);
        } catch (err) {
            console.log(err.message)
        }
    }

    function initialConfDDFund(ele, id, inputId, ulId, hiddenIp) {
        try {
            var value = $("#" + inputId).val();
            $("#" + ulId).addClass('hide');
            var value = $("#" + id).html().trim();
            $("#" + inputId).val(value);
            $('#' + inputId).removeClass('inputforSelectActive');
            $('#' + inputId).val($('#' + id).html());
            $('#' + hiddenIp).val($("#" + id)[0].value);
            pb_recordId = $("#recordId").val();
            pb_fundId = $("#fund-name").val();
            pb_templateId = $("#tempId").val();
            pb_reportYear = $("#fiscalYear").val();
            $("#printReportCP").attr("href", "/printbridge/generate-pdf-for-report?type-id=3&record-id=" + pb_recordId + "&fund-id=" + pb_fundId + "&template-id=" + pb_templateId + "&report-year=" + pb_reportYear + "");
        } catch (err) {
            console.log(err.message)
        }
    }
    var printFundType = 1;
    var pb_typeId = 0;
    var pb_recordId = 0;
    var pb_fundId = 0;
    var pb_templateId = 0;
    var pb_reportYear = 0;

    function printFunds(PFtype) {
        try {
            printFundType = PFtype;
            pb_typeId = printFundType;
            pb_recordId = $("#recordId").val();
            pb_fundId = $("#fund-name").val();
            pb_templateId = $("#tempId").val();
            pb_reportYear = $("#fiscalYear").val();
            if (printFundType == 1 || printFundType == 2) {
                pb_fundId = 0;
                $(".fund-selection-dropdown").addClass("disabled");
                $("#fund-name").val("");
                $("#selectedUserRecord").val("Select Fund:");
            } else {
                $(".fund-selection-dropdown").removeClass("disabled");
                pb_fundId = $("#fund-name").val();
            }
            $("#printReportCP").attr("href", "/printbridge/generate-pdf-for-report?type-id=" + pb_typeId + "&record-id=" + pb_recordId + "&fund-id=" + pb_fundId + "&template-id=" + pb_templateId + "&report-year=" + pb_reportYear + "");
        } catch (err) {
            console.log(err.message)
        }
    }
    $(document).delegate("#printReportCP", "click", function (event) {
        try {
            if (pb_typeId == 3 && pb_fundId == "") {
                event.preventDefault();
                $("#editable-non-editable-msg").html("PLEASE SELECT FUND").stop().fadeIn(200).delay(2000).fadeOut(200);
            }
        } catch (err) {
            console.log(err.message)
        }
    });

    function downloadReportPrintBridge(typeId, recordId, fundId, templateId, reportYear) {
        try {
            var url = "/printbridge/generate-pdf-for-report?type-id=" + typeId + "&record-id=" + recordId + "&fund-id=" + fundId + "&template-id=" + templateId + "&report-year=" + reportYear + "";
            var name = "sample";
            var link = document.createElement('a');
            document.body.appendChild(link);
            link.style.display = 'none';
            link.setAttribute('href', url);
            link.setAttribute('download', name);
            link.click();
            document.body.removeChild(link);
            $('#printBridgeSelectionReportModal').modal('hide');
        } catch (err) {
            console.log(err.message)
        }
    }

    /**********************************************************************************
     * created By : Saurabh
     * Description : Greeting message for report and site
     *********************************************************************************/
    function greetingMsgReportAndSite(greetingMsgVar) {
        try {
            var tempId = $('#tempId').val();
            if (tempId == "RequestParameters.tempId") return;
            var actionURL = "";
            type = window.location.pathname.indexOf("edit-report") > 0 ? 'report' : 'site';
            if (type == "report") {
                actionURL = "/admin/edit-greeting-message-modal-body-load-for-report?brand-id=" + tempId;
            } else {
                actionURL = "/admin/edit-greeting-message-modal-body-load-for-site?brand-id=" + tempId
            }
            $.get(actionURL, function (data, status) {
                if (status == "success") {
                    if ($('#printBridgePreviewModal')[0]) {
                        $("#printBridgePreviewModal").after(data);
                        var maxLenghtReportAndSite = $("#greeting-message").attr("maxlength");
                        $(greetingMsgVar).removeAttr("maxlength");
                        $(greetingMsgVar).attr("maxlength", maxLenghtReportAndSite);
                        $("#sendDirectURL").css({
                            display: 'none'
                        });
                    }
                }
            });
        } catch (err) {
            console.log(err.message);
        }
    }

}

/*
 *********************************************************************************************************
 * content panel creation function module
 *********************************************************************************************************
*/
if (window.location.pathname.indexOf("edit-content-panel-template") > 0 || window.location.pathname.indexOf("edit-cp-template") > 0) {
    var parentId = getAllUrlParams(window.location.href).selectednodeid;
    var rootNodeIdOfCP = getAllUrlParams(window.location.href).rootnodeid;
    //localStorage.getItem('rootNodeIdForButtonActivation');
    localStorage.setItem('oldUrlLocation', window.location.href);
    var activecpId = getAllUrlParams(window.location.href).selectedcpid;
    if (activecpId != "") {
        if (rootNodeIdOfCP == 1 || rootNodeIdOfCP == 2 || rootNodeIdOfCP == 6) {
            $("#saveDraftButton").hide();
        }
    }

    $(document).ready(function () {
        $(".newFooterLayoutAdmin").css("display", "block");
        $('.addCarouselPanelOuter').hide();
        $('.slideDiv').css("display", "none");
        $('.panelDiv').css("display", "none");
        $("#cancelButton").click(function () {
            try {
                var activecpId = getAllUrlParams(window.location.href).selectedcpid;
                if (activecpId == undefined || activecpId == null || activecpId == "" || activecpId == "null") {
                    $("#CancelCreatingContentPanelModal").modal("show");
                } else {
                    $("#editCantentPanelModal").modal("show");
                }
            } catch (err) {
                console.log(err.message)
            }
        });


        $("#CancelCreatingContentPanelYesButton").click(function () {
            try {
                $("#CancelCreatingContentPanelModal").modal("hide");
                var roleId = getAllUrlParams(window.location.href).roleid;
                if (roleId == 2 || roleId == 5 || roleId == 6) {
                    window.location.assign('/user/content-panel');
                } else {
                    window.location.assign('/admin/content-panels');
                }
            } catch (err) {
                console.log(err.message)
            }
        })

        $("#EditContentPanelYesButton").click(function () {
            try {
                $("#editCantentPanelModal").modal("hide");
                var roleId = getAllUrlParams(window.location.href).roleid;
                if (roleId == 2 || roleId == 5 || roleId == 6) {
                    window.location.assign('/user/content-panel');
                } else {
                    window.location.assign('/admin/content-panels');
                }
            } catch (err) {
                console.log(err.message)
            }
        })

        $("#saveDraftButton").click(function () {
            try {
                var roleId = getAllUrlParams(window.location.href).roleid;
                $(".cp-draft-header-msg").html("Once saved as a draft, this content panel will be accessible via the Drafts folder.");
                $("#SaveDraftCPModal").modal("show");
            } catch (err) {
                console.log(err.message)
            }
        });

        $("#BoradCastButton").css("display", "none");
        $("#BoradCastCancelButton").css("display", "none");

        $("#cancelPublishButton").click(function () {
            try {
                var oldUrl = localStorage.getItem('oldUrlLocation');
                window.history.pushState({ path: oldUrl }, '', oldUrl);
                initializeInlineEditor();
                var activecpId = getAllUrlParams(window.location.href).selectedcpid;
                localStorage.setItem('selectedCPId', activecpId);
                var parentId = getAllUrlParams(window.location.href).selectednodeid;
                localStorage.setItem('selectedNodeId', parentId);
                $("#moveToPermission").addClass('pwdon0');
            } catch (err) {
                console.log(err.message)
            }
        });

        $('#SaveDraftConfirmationButton').click(function () {
            try {
                tinymce.remove();
                var CPanelName = getAllUrlParams(window.location.href).contentpanelname;
                CPanelName = decodeURIComponent((CPanelName + '').replace(/\+/g, '%20'));
                var contentId = getAllUrlParams(window.location.href).selectedcpid;
                var roleId = getAllUrlParams(window.location.href).roleid;
                destroySlickCarousel('photoGalleryCarousel');
                var icon = "glyphicon glyphicon-text-background-cp-draft";
                var htmlString = $('#slides_1').clone().html();
                var parentId = 3;
                var rootNodeId = 3;
                var url_path = '/admin/createContent';
                if (roleId == 2) {
                    parentId = 4;
                    rootNodeId = 4;
                    url_path = '/user/createcontent';
                }
                if (roleId == 5 || roleId == 6) {
                    parentId = 7;
                    rootNodeId = 7;
                    url_path = '/user/createcontent';
                }
                $.ajax({
                    url: url_path,
                    type: 'POST',
                    data: { name: CPanelName, icon: icon, parentId: parentId, rootNodeId: rootNodeId, htmlString: htmlString, id: contentId },
                    dataType: "json",
                    beforeSend: function () {
                        $("#SaveDraftConfirmationButton").addClass("pwdon0");
                    },
                    success: function (response) {
                        resetTimeout();
                        if (response.result != null && response.result.code == 200) {
                            $("#SaveDraftCPModal").modal("hide");
                            localStorage.setItem('notificationPopUp', 1);
                            localStorage.setItem('confirmationFollowingProcedure', 1);
                            localStorage.setItem('confirmationFollowingProcedureMessage', 'CONTENT PANEL SAVED TO DRAFTS FOLDER');
                            if (roleId == 2) {
                                window.location.assign('/user/content-panel');
                            } else if (roleId == 5 || roleId == 6) {
                                window.location.assign('/user/content-panel');
                            }
                            else {
                                window.location.assign('/admin/content-panels');
                            }
                        } else {

                        }
                    }
                });
            } catch (err) {
                console.log(err.message)
            }
        });

        $("#publishButton").click(function () {
            try {
                $(".assetseditor").filter("[contenteditable='true']").removeClass("mce-content-body mce-edit-focus").removeAttr("contenteditable");
                $(".assetseditor").filter("[id^='mce_']").removeAttr("id");
                tinymce.remove();
                //asset changes
                commonAssetFunctionForPublish();
                //$("#PublishCPModal").modal("show");
            } catch (err) {
                console.log(err.message)
            }
        });

        $("#moveToPermission").click(function () {
            try {
                var activecpId = getAllUrlParams(window.location.href).selectedcpid;
                localStorage.setItem('selectedCPId', activecpId);
                var parentId = localStorage.getItem('selectedNodeId');
                localStorage.setItem('selectedNodeId', parentId);
                var rootNodeId = localStorage.getItem('rootNodeId');
                localStorage.setItem('rootNodeId', rootNodeId);
                localStorage.setItem('oldUrlLocation', window.location.href);
                var newurl = replaceQueryString(window.location.href, "selectednodeid", parentId);
                newurl = replaceQueryString(newurl, "rootnodeid", rootNodeId);
                window.history.pushState({ path: newurl }, '', newurl);
                $('#selectGroupUsermodal').modal('hide');
                $("#PublishCPModal").modal("show");
            } catch (err) {
                console.log(err.message)
            }
        });

        $(".modal-no-btn-margin-left22").click(function () {
            try {
                $("#moveToPermission").addClass('pwdon0');
            } catch (err) {
                console.log(err.message)
            }
        });

        $('#selectGroupUsermodal .btn.noti-button.no-ovrture-red.modal-no-btn-margin-left22').click(function () {
            try {
                localStorage.setItem('selectedNodeId', "3");
                localStorage.setItem('rootNodeId', "3");
            } catch (err) {
                console.log(err.message)
            }
        });

        //NEW JS Function for Draft Content Panel
        $("#SaveDraftContinueConfirmationButton").click(function () {
            try {
                tinymce.remove();
                var icon = "glyphicon glyphicon-text-background-cp-draft";
                var CPanelName = getAllUrlParams(window.location.href).contentpanelname;
                CPanelName = decodeURIComponent((CPanelName + '').replace(/\+/g, '%20'));
                var contentId = getAllUrlParams(window.location.href).selectedcpid;
                destroySlickCarousel('photoGalleryCarousel');
                var roleId = getAllUrlParams(window.location.href).roleid;
                var htmlString = $('#slides_1').clone().html();
                var parentId = 3;
                var rootNodeId = 3;
                var url_path = '/admin/save-cp-draft-and-continue';
                if (roleId == 2) {
                    parentId = 4;
                    rootNodeId = 4;
                    url_path = '/user/save-cp-draft-and-continue';
                }
                if (roleId == 5 || roleId == 6) {
                    parentId = 7;
                    rootNodeId = 7;
                    url_path = '/user/save-cp-draft-and-continue';
                }

                $.ajax({
                    url: url_path,
                    type: 'POST',
                    data: { name: CPanelName, icon: icon, parentId: parentId, rootNodeId: rootNodeId, htmlString: htmlString, id: contentId },
                    dataType: "json",
                    beforeSend: function () {
                        toggleProgressCircle(true);
                        $("#SaveDraftContinueConfirmationButton").addClass("pwdon0");
                    },
                    success: function (response) {
                        /* for removing delay while editor is initialized */
                        initializeInlineEditor();
                        resetTimeout();
                        if (response.result != null && response.result.code == 200) {
                            $("#SaveDraftCPModal").modal("hide");
                            toggleProgressCircle(false);
                            localStorage.setItem('notificationPopUp', 1);
                            localStorage.setItem('confirmationFollowingProcedure', 1);
                            if (roleId == 2 || roleId == 5 || roleId == 6) {
                                success_generic_notification("CONTENT PANEL SAVED");
                            } else {
                                success_generic_notification("CONTENT PANEL SAVED");
                            }
                            $("#SaveDraftContinueConfirmationButton").removeClass("pwdon0");
                            localStorage.setItem('selectedCPId', response.result.message);
                        } else {

                        }
                        var newurl = replaceQueryString(window.location.href, "selectedcpid", response.result.message);
                        if (roleId == 2) {
                            parentId = 4;
                            rootNodeId = 4;
                        }
                        else if (roleId == 5 || roleId == 6) {
                            parentId = 7;
                            rootNodeId = 7;
                        }
                        else {
                            parentId = 3;
                            rootNodeId = 3;
                        }
                        newurl = replaceQueryString(newurl, "rootnodeid", rootNodeId);
                        newurl = replaceQueryString(newurl, "previousrootnodeid", parentId);
                        window.history.pushState({ path: newurl }, '', newurl);
                        imageCarouselInitializer();
                    }
                });
                
            } catch (err) {
                console.log(err.message)
            }
        });

        $("#CPPublishButton").click(function () {
            try {
                tinymce.remove();
                $("#slides_1").find('.item.active').removeClass('active');
                $("#slides_1").find('.item').first().addClass('active');
                slideindibuttonDisabler("slides_1", $("#slides_1")[0].children[0].children[2].id);
                destroySlickCarousel('photoGalleryCarousel');

                var icon = "glyphicon glyphicon-text-background-cp";
                var CPanelName = getAllUrlParams(window.location.href).contentpanelname;
                CPanelName = decodeURIComponent((CPanelName + '').replace(/\+/g, '%20'));
                var contentId = getAllUrlParams(window.location.href).selectedcpid;
                var roleId = getAllUrlParams(window.location.href).roleid;
                var parentId = getAllUrlParams(window.location.href).selectednodeid;
                var rootNodeId = getAllUrlParams(window.location.href).rootnodeid;
                var previousRootNodeId = getAllUrlParams(window.location.href).previousrootnodeid;
                $('.modal').modal('hide');
                var htmlString = $('#slides_1').clone().html();
                var canBeDeleted = 1;
                var url_path = '/admin/createContent';
                if (roleId == 2 || roleId == 5 || roleId == 6) {
                    url_path = '/user/createcontent';
                }
                $.ajax({
                    url: url_path,
                    type: 'POST',
                    data: {
                        name: CPanelName, icon: icon, parentId: parentId, rootNodeId: rootNodeId, htmlString: htmlString,
                        id: contentId, canBeDeleted: canBeDeleted
                    },
                    dataType: "json",
                    beforeSend: function () {
                        toggleProgressCircle(true);
                        $("#CPPublishButton").addClass("pwdon0");
                    },
                    success: function (response) {
                        toggleProgressCircle(false);
                        resetTimeout();
                        if (response.result != null && response.result.code == 200) {
                            if (response.result.message == undefined) {
                                $("#PublishCPModal").modal("hide");
                                if (previousRootNodeId == 3 || previousRootNodeId == 4 || previousRootNodeId == 7) {
                                    $("#SendPublishNotificationModal").modal("show");
                                    return;
                                }
                                localStorage.setItem('notificationPopUp', 1);
                                localStorage.setItem('confirmationFollowingProcedure', 1);
                                localStorage.setItem('confirmationFollowingProcedureMessage', 'EDITED CONTENT PANEL PUBLISHED');
                                if (roleId == 2 || roleId == 5 || roleId == 6) {
                                    window.location.assign('/user/content-panel');
                                } else {
                                    window.location.assign('/admin/content-panels');
                                }
                                return;
                            }
                            $("#PublishCPModal").modal("hide");
                            $("#SendPublishNotificationModal").modal("show");
                        } else {

                        }
                    }
                });
            } catch (err) {
                console.log(err.message)
            }
        });


        $("#PublishDoNotSendNotificationButton").click(function () {
            try {
                $("#SendPublishNotificationModal").modal("hide");
                var previousRootNodeId = getAllUrlParams(window.location.href).previousrootnodeid;
                localStorage.setItem('notificationPopUp', 1);
                localStorage.setItem('confirmationFollowingProcedure', 1);
                if (previousRootNodeId == 3 || previousRootNodeId == 4 || previousRootNodeId == 7) {
                    localStorage.setItem('confirmationFollowingProcedureMessage', 'EDITED CONTENT PANEL PUBLISHED');
                } else {
                    localStorage.setItem('confirmationFollowingProcedureMessage', 'CONTENT PANEL PUBLISHED');
                }
                var roleId = getAllUrlParams(window.location.href).roleid;
                if (roleId == 2 || roleId == 5 || roleId == 6) {
                    window.location.assign('/user/content-panel');
                } else {
                    window.location.assign('/admin/content-panels');
                }
            } catch (err) {
                console.log(err.message)
            }
        });

        window.onbeforeunload = function (e) {
            try {
                localStorage.removeItem('selectedCPId');
            } catch (err) {
                console.log(err.message)
            }
        };


        ////////////////Send notification when publishing the Content Panel.

        $('#PublishSendNotificationButton').click(function () {
            try {
                var rootNodeId = getAllUrlParams(window.location.href).rootnodeid;
                var CPanelName = getAllUrlParams(window.location.href).contentpanelname;
                CPanelName = decodeURIComponent((CPanelName + '').replace(/\+/g, '%20'));
                var cloudId = localStorage.getItem('selectedbrandId');
                var roleId = getAllUrlParams(window.location.href).roleid;
                var parentId = getAllUrlParams(window.location.href).selectednodeid;
                var previousRootNodeId = getAllUrlParams(window.location.href).previousrootnodeid;
                var url_path = '/admin/newcpnotification';
                if (roleId == 2 || roleId == 5 || roleId == 6) {
                    url_path = '/user/newcpnotification';
                }
                $.ajax({
                    url: url_path,
                    type: 'POST',
                    data: { rootNodeId: rootNodeId, contentPanelName: CPanelName, selectedbrandId: cloudId, parentId: parentId },
                    dataType: "json",
                    beforeSend: function () {
                        $("#PublishSendNotificationButton").addClass("pwdon0");
                    },
                    success: function (response) {
                        resetTimeout();
                        if (response.result != null && response.result.code == 200) {
                            if (response.result.status == "success") {
                                localStorage.setItem('notificationPopUp', 1);
                                localStorage.setItem('confirmationFollowingProcedure', 1);
                                if (previousRootNodeId == 3 || previousRootNodeId == 4 || previousRootNodeId == 7) {
                                    localStorage.setItem('confirmationFollowingProcedureMessage', 'EDITED CONTENT PANEL PUBLISHED; NOTIFICATION SENT');
                                } else {
                                    localStorage.setItem('confirmationFollowingProcedureMessage', 'CONTENT PANEL PUBLISHED; NOTIFICATION SENT');
                                }
                            }
                            $("#SendPublishNotificationModal").modal("hide");
                            if (roleId == 2 || roleId == 5 || roleId == 6) {
                                window.location.assign('/user/content-panel');
                            } else {
                                window.location.assign('/admin/content-panels');
                            }
                        } else {

                        }
                    }
                });
            } catch (err) {
                console.log(err.message)
            }
        });



        //tinymce
        //$(".assetseditor").bind("click",function(e){
        $(document).delegate(".assetseditor", "click", function (e) {
            try {
                if (this.localName == "img")
                    return;
                if (((e.offsetX > (this.offsetWidth - 0)) && e.offsetY < 0) || ((e.offsetX > (this.offsetWidth - 0)) && e.offsetY > 0)) {
                    var elementLocked = jQuery.inArray("lock", this.classList) > 1;
                    var msgVar = "";
                    if (elementLocked) {
                        msgVar = "UNLOCKED: EDITABLE";
                        $(this).removeClass("lock non-editable");
                        tinymce.EditorManager.execCommand('mceAddEditor', true, this.id);
                        var ele = $(this)
                        onClickTinyMCE(ele);
                        document.activeElement.blur();
                    } else {
                        msgVar = "LOCKED: NOT EDITABLE";
                        tinymce.EditorManager.execCommand('mceRemoveEditor', true, this.id);
                        $(this).removeClass("mce-edit-focus mce-content-body");
                        $(this).addClass("lock non-editable");
                    }
                    $("#editable-non-editable-msg").html(msgVar).stop().fadeIn(200).delay(2000).fadeOut(200);
                }
                return false;
            } catch (err) {
                console.log(err.message)
            }
        });

        $(document).delegate(".assetAccessPermission", "click", function () {
            try {
                var edt = $(this).closest('div').siblings().attr("class");
                var msgVar = "";
                if (edt.indexOf("non-editable") == -1) {
                    msgVar = "LOCKED: NOT EDITABLE";
                    this.parentElement.title = "Cant replace this asset";
                    $(this).closest('div').siblings().addClass('non-editable');
                    $(this.previousElementSibling).css("display", "block");
                    $(this).css("display", "none");

                } else {
                    msgVar = "UNLOCKED: EDITABLE";
                    this.parentElement.title = "Replace this asset";
                    $(this).closest('div').siblings().removeClass('non-editable');
                    $(this).css("display", "none");
                    $(this.nextElementSibling).css("display", "block");
                }
                $("#editable-non-editable-msg").html(msgVar).stop().fadeIn(200).delay(2000).fadeOut(200);
            } catch (err) {
                console.log(err.message)
            }
        });

        $('body').on('hidden.bs.modal', '.modal', function (e) {
            try {
                if (e.currentTarget.id == "AssetPreviewModal") {
                    $('#assetlocationModal').focus();
                } else {
                    $(".assetseditor").filter("[ineditmode='true']").attr('ineditmode', 'false');
                }
            } catch (err) {
                console.log(err.message)
            }
        });
        
        var cpId = "";
        $(".slideSecClass").hover(function() {
            cpId = this.id;
            $("#" + cpId + " .slideDiv").css("display", "block");
            $("#" + cpId + " .panelDiv").css("display", "none");
            $("#" + cpId + " .carousel-inner").css("outline", "none");
        }, function() {
            $("#" + cpId + " .carousel-inner").css("outline", "none");
            $("#" + cpId + " .slideDiv").css("display", "none");
            $("#" + cpId + " .panelDiv").css("display", "none");
        });

    });

    //not call this page
    function treeIconChangerOpen(e, data) {
        try {
            var iconConditional = data.instance.get_icon(data.node);
            if (iconConditional == "fa-fa-folder-palette-closed") {
                data.instance.set_icon(data.node, 'fa-fa-folder-palette-open');
            } else if (iconConditional == "fa-fa-folder-brand-closed") {
                data.instance.set_icon(data.node, 'fa-fa-folder-brand-open');
            } else if (iconConditional == "fa fa-folder-locked") {
                data.instance.set_icon(data.node, 'fa fa-folder-locked-open');
            } else if (iconConditional == "fa-fa-folder-system-template") {
                data.instance.set_icon(data.node, 'fa-fa-folder-system-template');
            } else if (iconConditional != "glyphicon glyphicon-cloud" && iconConditional != "glyphicon glyphicon-check-pencil"
                && iconConditional != "glyphicon glyphicon-user") {
                data.instance.set_icon(data.node, 'fa fa-folder-open');
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    //not call this page
    function treeIconChangerClose(e, data) {
        try {
            var iconConditional = data.instance.get_icon(data.node);
            if (iconConditional == "fa-fa-folder-palette-open") {
                data.instance.set_icon(data.node, 'fa-fa-folder-palette-closed');
            } else if (iconConditional == "fa-fa-folder-brand-open") {
                data.instance.set_icon(data.node, 'fa-fa-folder-brand-closed');
            } else if (iconConditional == "fa fa-folder-locked-open") {
                data.instance.set_icon(data.node, 'fa fa-folder-locked');
            } else if (iconConditional == "fa-fa-folder-system-template") {
                data.instance.set_icon(data.node, 'fa-fa-folder-system-template');
            } else if (iconConditional != "glyphicon glyphicon-cloud" && iconConditional != "glyphicon glyphicon-check-pencil"
                && iconConditional != "glyphicon glyphicon-user") {
                data.instance.set_icon(data.node, 'fa fa-folder');
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    //not call this page
    function disabletreeIconChangerOpen(e, data) {
        //$("#locationModal").jstree("disable_node", selectedNode);
        changeStatus("#0", 'disable');
        //changeStatus( nodeId, 'enable' ); //used for enabling
        disableAllElementsForCP();
    }
    //not call this page
    function disableOtherClouds() {
        try {
            var rootNodeId = 2;
            var node = $("#locationModal #" + rootNodeId);
            var RootNodeLength = node.siblings().length;

            for (var i = 0; i < RootNodeLength; i++) {
                var id_of_Sibling = node.siblings()[i].id;
                if (id_of_Sibling == 3) {
                    $("#locationModal").jstree("delete_node", "#" + id_of_Sibling);
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    //not call this page
    function disableOtherCloudsForBA() {
        try {
            var rootNodeId = 2;
            var node = $("#locationModal #" + rootNodeId);
            var RootNodeLength = node.siblings().length;

            for (var i = 0; i < RootNodeLength; i++) {
                var id_of_Sibling = node.siblings()[i].id;
                if (id_of_Sibling == 4) {
                    $("#locationModal").jstree("delete_node", "#" + id_of_Sibling);
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    function changeStatus(selectedNode, changeTo) {
        try {
            var node = $("#locationModal").jstree().get_node(selectedNode);
            if (node == false) {
                return;
            }
            if (changeTo === 'enable') {
                $("#locationModal").jstree().enable_node(node);
                if ("#" == "glyphicon glyphicon-text-background-cp") {
                    return;
                }
                node.children.forEach(function (child_id) {
                    changeStatus(child_id, changeTo);
                })
            } else {
                $("#locationModal").jstree().disable_node(node);
                if ("#" == "glyphicon glyphicon-text-background-cp") {
                    return;
                }
                node.children.forEach(function (child_id) {
                    changeStatus(child_id, changeTo);
                })
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    function disableAllElementsForCP() {
        try {
            var Tree = $("#locationModal").jstree(true).get_json('#', { 'flat': true });
            for (i = 0; i < Tree.length; i++) {
                var z = Tree[i];
                console.log("z[id] = " + z["id"]);
                disable(z["id"]);
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    function disable(node_id) {
        try {
            if (node_id == "") {
                return;
            }
            var node = $("#locationModal").jstree().get_node(node_id);
            if (node.icon == "glyphicon glyphicon-text-background-cp") {
                $("#locationModal").jstree().disable_node(node);
            }
        } catch (err) {
            console.log(err.message)
        }
    }


    //not call this page
    function notification_on_page_load() {
        try {
            var notificationPopUpBit = localStorage.getItem('notificationPopUp');
            if (notificationPopUpBit == 1) {
                var procedureNo = localStorage.getItem('confirmationFollowingProcedure');
                var procedureMessage = localStorage.getItem('confirmationFollowingProcedureMessage');
                $("#GenericMsgPopUp").find(".comm-msg-detail").html(procedureMessage);
                $("#GenericMsgPopUp").modal("show");
                $(".modal-backdrop").css("opacity", ".1");
                setTimeout(function () {
                    $("#GenericMsgPopUp").modal("hide");
                    $(".modal-backdrop").remove();
                }, 1500);
                switch (procedureNo) {
                    case "0":
                        break;
                    case "1":
                        localStorage.setItem('notificationPopUp', "0");
                        break;
                    default:
                        break;
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }


    function replaceQueryString(url, param, value) {
        try {
            var re = new RegExp("([?|&])" + param + "=.*?(&|$)", "i");
            if (url.match(re))
                return url.replace(re, '$1' + param + "=" + value + '$2');
            else
                return url + '&' + param + "=" + value;
        } catch (err) {
            console.log(err.message)
        }
    }

}

/*********************************************************************************************************
 * Brodcast function module2
 *********************************************************************************************************
*/
if (window.location.pathname.indexOf("edit-broadcast-template") > 0 || window.location.pathname.indexOf("BroadcastTemplate") > 0) {
    $(document).ready(function () {
        $(".newFooterLayoutAdmin").css("display", "block");

        $("#cancelButton").css("display", "none");

        $("#publishButton").css("display", "none");

        $("#saveDraftButton").css("display", "none");

        $('.addCarouselPanelOuter').hide();

        $('.slideDiv').css("display", "none");
        $('.panelDiv').css("display", "none");

        var activeBroadcastBannerName = localStorage.getItem('activeBroadcastBannerCopyName');
        if (activeBroadcastBannerName != null && activeBroadcastBannerName != "") {
            $('#broadcastHeaderTitle').html(activeBroadcastBannerName);
            localStorage.removeItem("activeBroadcastBannerCopyName");
        }

        $("#BoradCastButton").click(function () {
            try {
                var collapseCheckIn = $(".learn-more-text");
                if ($(collapseCheckIn.children()[1]).hasClass("glyphicon-remove")) {
                    $(".broadcastBtnWrapper").click();
                    $(".learn-more-text").html('<div class="tablet-web-only"></div> <i class="glyphicon glyphicon-chevron-down "></i>')
                }
                var activeBroadcastId = localStorage.getItem('activeBroadcastId');
                //				console.log(activeBroadcastId);
                if (activeBroadcastId == undefined || activeBroadcastId == null || activeBroadcastId == "") {
                    $("#broadCastNotificationModal").modal("show");
                } else {
                    $("#updateCPBroadCastModal").modal("show");
                }
            } catch (err) {
                console.log(err.message)
            }
        });

        $("#BoradCastCancelButton").click(function () {
            try {
                var activeBroadcastId = localStorage.getItem('activeBroadcastId');
                if (activeBroadcastId == undefined || activeBroadcastId == null || activeBroadcastId == "" || activeBroadcastId == "null") {
                    $('.broadcastcancelbuttonMsg').html("Are you sure you want to cancel creating this broadcast/alert?");
                } else {
                    $('.broadcastcancelbuttonMsg').html("Are you sure you want to cancel editing this broadcast/alert?");
                }
                $('#editBroadCastAlertModal').modal('show');
            } catch (err) {
                console.log(err.message)
            }
        });

        $("#EditBroadcastAlertYesButton").click(function () {
            try {
                $("#broadCastNotificationModal").modal("hide");
                $('#editBroadCastAlertModal').modal('hide');
                var broadcastId = localStorage.getItem('activeBroadcastId');
                if (broadcastId == undefined || broadcastId == null || broadcastId == "") {
                    window.location.assign('/admin/system-broadcast');
                } else {
                    window.location.assign('/admin/system-broadcast-edit?broadcastId=' + broadcastId);
                }
            } catch (err) {
                console.log(err.message)
            }
        });

        $("#setTimer").click(function () {
            try {
                $("#broadCastNotificationModal").modal("hide");
                $("#broadCastAllertRemoveModal").modal("show");
            } catch (err) {
                console.log(err.message)
            }
        });

        $("#dontSetTimer").click(function () {
            try {
                $("#broadCastAllertRemoveModal").modal("hide");
                $("#confrimationbroadCastNotificationModal").modal("show");
            } catch (err) {
                console.log(err.message)
            }
        });

        $("#confirmSetTimer").click(function () {
            try {
                $("#broadCastAllertRemoveModal").modal("hide");
                $('#setTimerModal').modal("show");
            } catch (err) {
                console.log(err.message)
            }
        });

        $("#NoconfirmSetTimer").click(function () {
            try {
                $('#setTimerModal').modal("hide");
                $("#confrimationbroadCastNotificationModal").modal("show");
            } catch (err) {
                console.log(err.message)
            }
        });

        $("#dontSetTimerbutBroadCast").click(function () {
            try {
                $('#confrimationbroadCastNotificationModal').modal("hide");
            } catch (err) {
                console.log(err.message)
            }
        });

        $('#yesconfirmSetTimerandBroadcast').click(function () {
            try {
                destroySlickCarousel('photoGalleryCarousel');
                tinymce.remove();
                $('#setTimerModal').modal("hide")
                var uncheckedTemplet = localStorage.getItem('uncheckedTempletList');
                var checkedTemplet = localStorage.getItem('checkedTempletList');
                var name = localStorage.getItem('activeBroadcastName');
                var htmlCode = $('#slides_1').clone().html();
                var day = $('#settimerInputBox').val();
                $.ajax({
                    url: '/admin/CreateSystemBroadCastAlert',
                    type: 'POST',
                    data: { name: name, htmlCode: htmlCode, uncheckedBrand: uncheckedTemplet, checkedBrand: checkedTemplet, timer: day },
                    dataType: "json",
                    beforeSend: function () {

                    },
                    success: function (response) {
                        resetTimeout();
                        if (response != null && response.result != null && response.result.status == 'success') {
                            if (response.result.code != null && response.result.code == 302) {
                                if (response.result.status == "success") {
                                    $('#confrimationbroadCastNotificationModal').modal('show');
                                }
                            } else if (response != null && response.result != null && response.result.status == 'failure') {

                            }
                        }
                    }
                });
            } catch (err) {
                console.log(err.message)
            }
        });

        $('#dontSetTimerbutBroadCast').click(function () {
            try {
                destroySlickCarousel('photoGalleryCarousel');
                tinymce.remove();
                var removeAppropriateBit = "00";
                $('#setTimerModal').modal("hide")
                var uncheckedTemplet = localStorage.getItem('uncheckedTempletList');
                var checkedTemplet = localStorage.getItem('checkedTempletList');
                var name = localStorage.getItem('activeBroadcastName');
                var htmlCode = $('#slides_1').clone().html();
                $.ajax({
                    url: '/admin/CreateSystemBroadCastAlert',
                    type: 'POST',
                    data: { name: name, htmlCode: htmlCode, uncheckedBrand: uncheckedTemplet, checkedBrand: checkedTemplet, removeAppropriateBit: removeAppropriateBit },
                    dataType: "json",
                    beforeSend: function () {

                    },
                    success: function (response) {
                        resetTimeout();
                        if (response != null && response.result != null && response.result.status == 'success') {
                            if (response.result.code != null && response.result.code == 302) {
                                if (response.result.status == "success") {
                                    $('#confrimationbroadCastNotificationModal').modal('show');
                                }
                            } else if (response != null && response.result != null && response.result.status == 'failure') {

                            }
                        }
                    }
                });
            } catch (err) {
                console.log(err.message)
            }
        });

        $('#NoconfirmSetTimer').click(function () {
            try {
                destroySlickCarousel('photoGalleryCarousel');
                tinymce.remove();
                var removeAppropriateBit = "00";
                $('#broadCastAllertRemoveModal').modal("hide")
                var uncheckedTemplet = localStorage.getItem('uncheckedTempletList');
                var checkedTemplet = localStorage.getItem('checkedTempletList');
                var name = localStorage.getItem('activeBroadcastName');
                var htmlCode = $('#slides_1').clone().html();
                $.ajax({
                    url: '/admin/CreateSystemBroadCastAlert',
                    type: 'POST',
                    data: { name: name, htmlCode: htmlCode, uncheckedBrand: uncheckedTemplet, checkedBrand: checkedTemplet, removeAppropriateBit: removeAppropriateBit },
                    dataType: "json",
                    beforeSend: function () {

                    },
                    success: function (response) {
                        resetTimeout();
                        if (response != null && response.result != null && response.result.status == 'success') {
                            if (response.result.code != null && response.result.code == 302) {
                                if (response.result.status == "success") {
                                    $('#confrimationbroadCastNotificationModal').modal('show');
                                }
                            } else if (response != null && response.result != null && response.result.status == 'failure') {

                            }
                        }
                    }
                });
            } catch (err) {
                console.log(err.message)
            }
        });

        $('#YesconfirmationFollowingProcedure').click(function () {
            try {
                var broadcastName = localStorage.getItem('activeBroadcastName');
                var uncheckedList = localStorage.getItem('uncheckedTempletList');
                var checkedList = localStorage.getItem('checkedTempletList');
                $.ajax({
                    url: '/admin/sendNotificationForBroadcastAlert',
                    type: 'POST',
                    data: { broadcastName: broadcastName, uncheckedBrand: uncheckedList.toString(), checkedBrand: checkedList.toString() },
                    dataType: "json",
                    beforeSend: function () {
                        $('#YesconfirmationFollowingProcedure').addClass('pwdon0');
                    },
                    success: function (response) {
                        resetTimeout();
                        if (response.result != null && response.result.code == 200) {
                            if (response.result.status == "success") {
                                localStorage.setItem('notificationPopUp', 1);
                                localStorage.setItem('confirmationFollowingProcedure', 1);
                                localStorage.setItem('confirmationFollowingProcedureMessage', 'ALERT BROADCAST ACROSS ALL SITE & NOTIFICATION SENT TO ALL USERS');
                            }
                            $('#confrimationbroadCastNotificationModal').modal('hide');
                            window.location.assign('/admin/system-broadcast');
                        } else {

                        }
                    }
                });
            } catch (err) {
                console.log(err.message)
            }
        });

        $('#NoconfirmationFollowingProcedure').click(function () {
            try {
                $('#confrimationbroadCastNotificationModal').modal('hide');
                localStorage.setItem('notificationPopUp', 1);
                localStorage.setItem('confirmationFollowingProcedure', 1);
                localStorage.setItem('confirmationFollowingProcedureMessage', 'ALERT BROADCAST ACROSS ALL SITE');
                setTimeout(function () {
                    window.location.assign('/admin/system-broadcast');
                }, 200);
            } catch (err) {
                console.log(err.message)
            }
        });

        $('#YesbroadCastEdit').click(function () {
            try {
                destroySlickCarousel('photoGalleryCarousel');
                tinymce.remove();
                var activeBroadcastId = localStorage.getItem('activeBroadcastId');
                var name = localStorage.getItem('activeBroadcastName');
                var htmlCode = $('#slides_1').clone().html();
                $.ajax({
                    url: '/admin/updateActiveBroadCastAlert',
                    type: 'POST',
                    data: { id: activeBroadcastId, name: name, htmlCode: htmlCode },
                    dataType: "json",
                    beforeSend: function () {
                        $('#YesbroadCastEdit').addClass('pwdon0');
                    },
                    success: function (response) {
                        resetTimeout();
                        if (response != null && response.result != null && response.result.status == 'success') {
                            if (response.result.code != null && response.result.code == 302) {
                                if (response.result.status == "success") {
                                    $('#confrimationbroadCastNotificationModal').modal('hide');
                                    localStorage.setItem('notificationPopUp', 1);
                                    localStorage.setItem('confirmationFollowingProcedure', 1);
                                    localStorage.setItem('confirmationFollowingProcedureMessage', 'REVISED ALERT PUSHED ACROSS THE SYSTEM');
                                    setTimeout(function () {
                                        window.location.assign('/admin/system-broadcast');
                                    }, 200);
                                }
                            } else if (response != null && response.result != null && response.result.status == 'failure') {

                            }
                        }
                    }
                });
            } catch (err) {
                console.log(err.message)
            }
        });

        $('.broadcastClose').click(function () {
            try {
                if ($(document.getElementsByClassName('broadcastwrapper')[0]).find("iframe").length) {
                    var sectionId = $(document.getElementsByClassName('broadcastwrapper')[0]).find("iframe")[0].getAttribute('sectionId');
                    document.getElementsByClassName(sectionId)[0].src = document.getElementsByClassName(sectionId)[0].src;
                }
            } catch (err) {
                console.log(err.message)
            }
        });




        $('body').on('hidden.bs.modal', '.modal', function (e) {
            try {
                if (e.currentTarget.id == "AssetPreviewModal") {
                    console.log("AssetPreview");
                    $('#assetlocationModal').focus();
                } else {
                    $(".assetseditor").filter("[ineditmode='true']").attr('ineditmode', 'false');
                }
            } catch (err) {
                console.log(err.message)
            }
        });



    });

    function selectTimerButtonDisabler(ele) {
        try {
            var value = $("#settimerInputBox").val();
            if (value.length > 0) {
                $("#yesconfirmSetTimerandBroadcast").removeClass('pwdon0')
            }
            else {
                $("#yesconfirmSetTimerandBroadcast").addClass('pwdon0')
            }
        } catch (err) {
            console.log(err.message)
        }
    }


    var cpId = "";
    $(".slideSecClass").hover(function () {
        cpId = this.id;
        $("#" + cpId + " .slideDiv").css("display", "block");
        $("#" + cpId + " .panelDiv").css("display", "none");
        $("#" + cpId + " .carousel-inner").css("outline", "none");
    }, function () {
        $("#" + cpId + " .carousel-inner").css("outline", "none");
        $("#" + cpId + " .slideDiv").css("display", "none");
        $("#" + cpId + " .panelDiv").css("display", "none");
    });
    function isNumberKey(evt) {
        try {
            var charCode = (evt.which) ? evt.which : event.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                //alert(charCode);
                return false;
            }

            else {
                return true;
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    //not call this page
    function notification_on_page_load() {
        try {
            var notificationPopUpBit = localStorage.getItem('notificationPopUp');
            if (notificationPopUpBit == 1) {
                var procedureNo = localStorage.getItem('confirmationFollowingProcedure');
                var procedureMessage = localStorage.getItem('confirmationFollowingProcedureMessage');
                $("#GenericMsgPopUp").find(".comm-msg-detail").html(procedureMessage);

                $("#GenericMsgPopUp").modal("show");
                $(".modal-backdrop").css("opacity", ".1");
                setTimeout(function () {
                    $("#GenericMsgPopUp").modal("hide");
                    $(".modal-backdrop").remove();
                }, 1500);
                switch (procedureNo) {
                    case "0":
                        break;
                    case "1":
                        localStorage.setItem('notificationPopUp', "0");
                        break;
                    default:
                        break;
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }

}


/***************************************
 * editor-output-lib - this library use to editor and output  
 *************************************/
if (true) {

    /**********************************************************************************
     * created By : Saurabh
     * Description : chartgraph for the graph in report
     *********************************************************************************/

    //call document ready
    function editor_copyURL_readyJs() {
        try {
            $('.carousel-indicators-common li').css("margin-left", "0");
            arrowDisplayHide();
            sliderSection();
            getOS();


            $(".slideSecClass").delegate(".carousel-indicators li", "click", function (e) {
                e.stopPropagation();
                var goTo = $(this).data('slide-to');
                var sectionID = "";
                var carouselID = "";
                /*Fund Report-Get SectionID and CarouselID*/
                if ($(this.parentElement).hasClass("report")) {
                    sectionID = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
                    carouselID = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
                    chartgraphs();
                } else {
                    sectionID = this.parentElement.parentElement.parentElement.parentElement.id;
                    carouselID = this.parentElement.parentElement.id;
                }
                $('#' + sectionID + ' #' + carouselID + '.carousel-inner .item').each(function (index) {
                    if ($(this).data('slideTo') == goTo) {
                        goTo = index;
                        return false;
                    }
                });
                $('#' + sectionID + ' #' + carouselID).carousel(goTo);
                /*Fund Report-Update Current count of slide at Slide Navigation time*/
                if ($(this.parentElement).hasClass("report")) {
                    $('#' + sectionID + ' .carousel-list-funds').addClass('hide');
                    $('#' + sectionID + ' .fund-list-button').removeClass('open');
                    $('#' + sectionID).find('.current-fund').html(goTo + 1)
                }
                return false;
            });
            //addInteractionDivOnload();
            function blureffectmenu() {
                if ($(".main-menu .dropdown").hasClass("open")) {
                    $(".main-body-container").css({ opacity: '1' });
                    $("body").css("background-color", "#FFF");
                } else {
                    $(".main-body-container").css({ opacity: '0.5' });
                    $("body").css({ "background-color": '#333' });
                }
            }







            /* learn more show hide for tablet view */
            $("#btn-learn-more-blue").click(function () {
                if ($(".learn-more-list").css("display") != "none") {
                    $(".img-lt-1").css("transform", "none");
                    $(".img-lt-1").css("transition-duration", "1s");
                } else {
                    $(".img-lt-1").css("transform", "rotate(90deg)");
                    $(".img-lt-1").css("transition-duration", "1s");
                }
                $(".learn-more-list").toggle("clip");
            });


            $("#btn-learn-more-green").click(function () {
                if ($(".learn-more-list2").css("display") != "none") {
                    $(".img-lt-2").css("transform", "none");
                    $(".img-lt-2").css("transition-duration", "1s");
                } else {
                    $(".img-lt-2").css("transform", "rotate(90deg)");
                    $(".img-lt-2").css("transition-duration", "1s");
                }
                $(".learn-more-list2").toggle("clip");
            });

            $("#btn-learn-more-green3").click(function () {
                if ($(".learn-more-list3").css("display") != "none") {
                    $(".img-lt-2").css("transform", "none");
                    $(".img-lt-2").css("transition-duration", "1s");
                } else {
                    $(".img-lt-2").css("transform", "rotate(90deg)");
                    $(".img-lt-2").css("transition-duration", "1s");
                }
                $(".learn-more-list3").toggle("clip");
            });

            $("#btn-learn-more-green4").click(function () {
                if ($(".learn-more-list4").css("display") != "none") {
                    $(".img-lt-2").css("transform", "none");
                    $(".img-lt-2").css("transition-duration", "1s");
                } else {
                    $(".img-lt-2").css("transform", "rotate(90deg)");
                    $(".img-lt-2").css("transition-duration", "1s");
                }
                $(".learn-more-list4").toggle("clip");
            });




            var browserWidthWithOutScrollBar = $(window).width();

            var scrollWidth = scrollbarWidth();
            var browserWidthIncludingScrollBar = ($(window).width() + scrollWidth);

            /*************************************
                hide the div for mobile view
            ***************************************/

            if (browserWidthIncludingScrollBar < 992) {
                $(".container5-body").css("display", "none");
                $(".crousel-mobile-view").css("display", "none");
                $(".container4-body").css("display", "none");
                $(".crousel-mobile-view1").css("display", "none");
                $(".container6-body").css("display", "none");
                $(".crousel-mobile-view11").css("display", "none");
                $(".container7-body").css("display", "none");
                $(".crousel-mobile-view111").css("display", "none");


                /* Enable the buttons */
                $('#btn-data-x').prop("disabled", false);
                $('#btn-section2-slide2').prop("disabled", false);
                $('#btn-section2-slide3').prop("disabled", false);
                $('#btn-section2-slide4').prop("disabled", false);
                $('#btn-section2-slide5').prop("disabled", false);
                $('#btn-section2-slide6').prop("disabled", false);
                $('#btn-section2-slide7').prop("disabled", false);
                $('#btn-section2-slide8').prop("disabled", false);
                $('#btn-section2-slide9').prop("disabled", false);
                $('#btn-section2-slide10').prop("disabled", false);

                $('#btn-slider2').prop("disabled", false);
                $('#btn-section3-slide2').prop("disabled", false);
                $('#btn-section3-slide3').prop("disabled", false);
                $('#btn-section3-slide4').prop("disabled", false);
                $('#btn-section3-slide5').prop("disabled", false);
                $('#btn-section3-slide6').prop("disabled", false);
                $('#btn-section3-slide7').prop("disabled", false);
                $('#btn-section3-slide8').prop("disabled", false);
                $('#btn-section3-slide9').prop("disabled", false);
                $('#btn-section3-slide10').prop("disabled", false);

                $('#btn-slider3').prop("disabled", false);
                $('#btn-section4-slide2').prop("disabled", false);
                $('#btn-section4-slide3').prop("disabled", false);
                $('#btn-section4-slide4').prop("disabled", false);
                $('#btn-section4-slide5').prop("disabled", false);
                $('#btn-section4-slide6').prop("disabled", false);
                $('#btn-section4-slide7').prop("disabled", false);
                $('#btn-section4-slide8').prop("disabled", false);
                $('#btn-section4-slide9').prop("disabled", false);
                $('#btn-section4-slide10').prop("disabled", false);

                $('#btn-slider4').prop("disabled", false);
                $('#btn-section5-slide2').prop("disabled", false);
                $('#btn-section5-slide3').prop("disabled", false);
                $('#btn-section5-slide4').prop("disabled", false);
                $('#btn-section5-slide5').prop("disabled", false);
                $('#btn-section5-slide6').prop("disabled", false);
                $('#btn-section5-slide7').prop("disabled", false);
                $('#btn-section5-slide8').prop("disabled", false);
                $('#btn-section5-slide9').prop("disabled", false);
                $('#btn-section5-slide10').prop("disabled", false);

                /* create dynamic img element*/

                var arr = $(".new-carousle-item")
                for (var i = 0; i < arr.length; i++) {
                    $("#my-custom-carousel").append("<div class='item removable-carousel-item'><div class='container-fluid'><div class='row equal-div'><div class='col-sm-12 col-xs-12  equal-div3 mobile-only'><img src='" + arr[i].src + "' class='img-responsive section6-img equal-div2'></div></div></div></div>");

                }


                $(".carousel-inner").css("display", "none");
                $(".slideSecClass .carousel-indicators").css("display", "none");
                $(".carousel-control").css("display", "none");
                $(".container-sec").css("display", "block");


            } else {

                $(".carousel-inner").css("display", "inherit");
                $(".slideSecClass .carousel-indicators").css("display", "inherit");
                $(".carousel-control").css("display", "inherit");
                $(".container-sec").css("display", "inherit");

                $(".container4-body").css("display", "inherit");
                $(".container5-body").css("display", "inherit");
                $(".container6-body").css("display", "inherit");
                $(".container7-body").css("display", "inherit");
                $(".crousel-mobile-view").css("display", "inherit");
                $(".crousel-mobile-view1").css("display", "inherit");
                $(".crousel-mobile-view11").css("display", "inherit");
                $(".crousel-mobile-view111").css("display", "inherit");
                $(".div3-low").css("display", "inherit");
                $(".section5-div1").css("display", "inherit");
                $(".thanks-pic").css("display", "inherit");

                /* desable the buttons */
                $('#btn-data-x').prop("disabled", true);
                $('#btn-section2-slide2').prop("disabled", true);
                $('#btn-section2-slide3').prop("disabled", true);
                $('#btn-section2-slide4').prop("disabled", true);
                $('#btn-section2-slide5').prop("disabled", true);
                $('#btn-section2-slide6').prop("disabled", true);
                $('#btn-section2-slide7').prop("disabled", true);
                $('#btn-section2-slide8').prop("disabled", true);
                $('#btn-section2-slide9').prop("disabled", true);
                $('#btn-section2-slide10').prop("disabled", true);

                $('#btn-slider2').prop("disabled", true);
                $('#btn-section3-slide2').prop("disabled", true);
                $('#btn-section3-slide3').prop("disabled", true);
                $('#btn-section3-slide4').prop("disabled", true);
                $('#btn-section3-slide5').prop("disabled", true);
                $('#btn-section3-slide6').prop("disabled", true);
                $('#btn-section3-slide7').prop("disabled", true);
                $('#btn-section3-slide8').prop("disabled", true);
                $('#btn-section3-slide9').prop("disabled", true);
                $('#btn-section3-slide10').prop("disabled", true);

                $('#btn-slider3').prop("disabled", true);
                $('#btn-section4-slide2').prop("disabled", true);
                $('#btn-section4-slide3').prop("disabled", true);
                $('#btn-section4-slide4').prop("disabled", true);
                $('#btn-section4-slide5').prop("disabled", true);
                $('#btn-section4-slide6').prop("disabled", true);
                $('#btn-section4-slide7').prop("disabled", true);
                $('#btn-section4-slide8').prop("disabled", true);
                $('#btn-section4-slide9').prop("disabled", true);
                $('#btn-section4-slide10').prop("disabled", true);

                $('#btn-slider4').prop("disabled", true);
                $('#btn-section5-slide2').prop("disabled", true);
                $('#btn-section5-slide3').prop("disabled", true);
                $('#btn-section5-slide4').prop("disabled", true);
                $('#btn-section5-slide5').prop("disabled", true);
                $('#btn-section5-slide6').prop("disabled", true);
                $('#btn-section5-slide7').prop("disabled", true);
                $('#btn-section5-slide8').prop("disabled", true);
                $('#btn-section5-slide9').prop("disabled", true);
                $('#btn-section5-slide10').prop("disabled", true);

                /* create dynamic img element*/
                $(".removable-carousel-item").remove();

            }

            if (browserWidthIncludingScrollBar < 991) {
                slideWithSwipe();
            }

            if ($(window).width() > 991) {
                $(window).resize(function () {
                    browserWidthIncludingScrollBar = ($(window).width() + scrollWidth);
                    if (browserWidthIncludingScrollBar < 992) {
                        $(".carousel-inner").css("display", "none");
                        $(".slideSecClass .carousel-indicators").css("display", "none");
                        $(".carousel-control").css("display", "none");
                    } else {
                        $(".carousel-inner").css("display", "inherit");
                        $(".slideSecClass .carousel-indicators").css("display", "inherit");
                        $(".carousel-control").css("display", "inherit");
                    }
                });
            }



            $(window).resize(function () {
                browserWidthIncludingScrollBar = ($(window).width() + scrollWidth);

                if (browserWidthIncludingScrollBar < 992) {

                    // Enable the buttons 
                    $('#btn-data-x').prop("disabled", false);
                    $('#btn-section2-slide2').prop("disabled", false);
                    $('#btn-section2-slide3').prop("disabled", false);
                    $('#btn-section2-slide4').prop("disabled", false);
                    $('#btn-section2-slide5').prop("disabled", false);
                    $('#btn-section2-slide6').prop("disabled", false);
                    $('#btn-section2-slide7').prop("disabled", false);
                    $('#btn-section2-slide8').prop("disabled", false);
                    $('#btn-section2-slide9').prop("disabled", false);
                    $('#btn-section2-slide10').prop("disabled", false);

                    $('#btn-slider2').prop("disabled", false);
                    $('#btn-section3-slide2').prop("disabled", false);
                    $('#btn-section3-slide3').prop("disabled", false);
                    $('#btn-section3-slide4').prop("disabled", false);
                    $('#btn-section3-slide5').prop("disabled", false);
                    $('#btn-section3-slide6').prop("disabled", false);
                    $('#btn-section3-slide7').prop("disabled", false);
                    $('#btn-section3-slide8').prop("disabled", false);
                    $('#btn-section3-slide9').prop("disabled", false);
                    $('#btn-section3-slide10').prop("disabled", false);

                    $('#btn-slider3').prop("disabled", false);
                    $('#btn-section4-slide2').prop("disabled", false);
                    $('#btn-section4-slide3').prop("disabled", false);
                    $('#btn-section4-slide4').prop("disabled", false);
                    $('#btn-section4-slide5').prop("disabled", false);
                    $('#btn-section4-slide6').prop("disabled", false);
                    $('#btn-section4-slide7').prop("disabled", false);
                    $('#btn-section4-slide8').prop("disabled", false);
                    $('#btn-section4-slide9').prop("disabled", false);
                    $('#btn-section4-slide10').prop("disabled", false);

                    $('#btn-slider4').prop("disabled", false);
                    $('#btn-section5-slide2').prop("disabled", false);
                    $('#btn-section5-slide3').prop("disabled", false);
                    $('#btn-section5-slide4').prop("disabled", false);
                    $('#btn-section5-slide5').prop("disabled", false);
                    $('#btn-section5-slide6').prop("disabled", false);
                    $('#btn-section5-slide7').prop("disabled", false);
                    $('#btn-section5-slide8').prop("disabled", false);
                    $('#btn-section5-slide9').prop("disabled", false);
                    $('#btn-section5-slide10').prop("disabled", false);

                    // create dynamic img element
                    if ($(".removable-carousel-item").length == 0) {
                        var arr = $(".new-carousle-item")
                        for (var i = 0; i < arr.length; i++) {
                            $("#my-custom-carousel").append("<div class='item removable-carousel-item'><div class='container-fluid'><div class='row equal-div'><div class='col-sm-12 col-xs-12  equal-div3 mobile-only'><img src='" + arr[i].src + "' class='img-responsive secction6-img equal-div2'></div></div></div></div>");

                        }
                    }


                } else {
                    $(".container4-body").css("display", "inherit");
                    $(".container5-body").css("display", "inherit");
                    $(".container6-body").css("display", "inherit");
                    $(".container7-body").css("display", "inherit");
                    $(".crousel-mobile-view").css("display", "inherit");
                    $(".crousel-mobile-view1").css("display", "inherit");
                    $(".crousel-mobile-view11").css("display", "inherit");
                    $(".crousel-mobile-view111").css("display", "inherit");
                    $(".div3-low").css("display", "inherit");
                    $(".section5-div1").css("display", "inherit");
                    $(".thanks-pic").css("display", "inherit");

                    // desable the buttons 
                    $('#btn-data-x').prop("disabled", true);
                    $('#btn-section2-slide2').prop("disabled", true);
                    $('#btn-section2-slide3').prop("disabled", true);
                    $('#btn-section2-slide4').prop("disabled", true);
                    $('#btn-section2-slide5').prop("disabled", true);
                    $('#btn-section2-slide6').prop("disabled", true);
                    $('#btn-section2-slide7').prop("disabled", true);
                    $('#btn-section2-slide8').prop("disabled", true);
                    $('#btn-section2-slide9').prop("disabled", true);
                    $('#btn-section2-slide10').prop("disabled", true);

                    $('#btn-slider2').prop("disabled", true);
                    $('#btn-section3-slide2').prop("disabled", true);
                    $('#btn-section3-slide3').prop("disabled", true);
                    $('#btn-section3-slide4').prop("disabled", true);
                    $('#btn-section3-slide5').prop("disabled", true);
                    $('#btn-section3-slide6').prop("disabled", true);
                    $('#btn-section3-slide7').prop("disabled", true);
                    $('#btn-section3-slide8').prop("disabled", true);
                    $('#btn-section3-slide9').prop("disabled", true);
                    $('#btn-section3-slide10').prop("disabled", true);

                    $('#btn-slider3').prop("disabled", true);
                    $('#btn-section4-slide2').prop("disabled", true);
                    $('#btn-section4-slide3').prop("disabled", true);
                    $('#btn-section4-slide4').prop("disabled", true);
                    $('#btn-section4-slide5').prop("disabled", true);
                    $('#btn-section4-slide6').prop("disabled", true);
                    $('#btn-section4-slide7').prop("disabled", true);
                    $('#btn-section4-slide8').prop("disabled", true);
                    $('#btn-section4-slide9').prop("disabled", true);
                    $('#btn-section4-slide10').prop("disabled", true);

                    $('#btn-slider4').prop("disabled", true);
                    $('#btn-section5-slide2').prop("disabled", true);
                    $('#btn-section5-slide3').prop("disabled", true);
                    $('#btn-section5-slide4').prop("disabled", true);
                    $('#btn-section5-slide5').prop("disabled", true);
                    $('#btn-section5-slide6').prop("disabled", true);
                    $('#btn-section5-slide7').prop("disabled", true);
                    $('#btn-section5-slide8').prop("disabled", true);
                    $('#btn-section5-slide9').prop("disabled", true);
                    $('#btn-section5-slide10').prop("disabled", true);

                    // create dynamic img element
                    $(".removable-carousel-item").remove();

                }
            });

            $(".slideSecClass .left-arrow").hide();
            if (browserWidthIncludingScrollBar > 991) {
                $(".slideSecClass").on('slid.bs.carousel', function (ev) {
                    var cpli = $(this).find(".carousel-indicators").children();
                    var firstcpli = cpli.first();
                    var lastcpli = cpli.last();
                    if (firstcpli.hasClass("active")) {
                        $(this).find(".left-arrow").hide();
                    } else {
                        $(this).find(".left-arrow").show();
                    }
                    if (lastcpli.hasClass("active")) {
                        $(this).find(".right-arrow").hide();
                    } else {
                        $(this).find(".right-arrow").show();
                    }
                });
            }


            /******************************************/


            $("#btn-data-x").click(function () {
                var className = $('#span-data-x').attr('class');
                if (className == "custom-collapse") {
                    $('.container4-row1 button span').removeClass('custom-collapse');
                    $('.container4-row1 button span').addClass('custom-expend');
                    $(".container4-body").slideUp(1000);
                    $(".crousel-mobile-view").slideUp("slow");
                }
                else {
                    $('.container4-row1 button span').removeClass('custom-expend');
                    $('.container4-row1 button span').addClass('custom-collapse');
                    $(".container4-body").slideDown(600);
                    $(".crousel-mobile-view").slideDown("slow");
                }

            });


            $("#btn-section2-slide2").click(function () {
                var className = $('#section2-slide2-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container4-row1 button span').removeClass('custom-collapse');
                    $('.container4-row1 button span').addClass('custom-expend');
                    $(".container4-body").slideUp(1000);
                    $(".crousel-mobile-view").slideUp("slow");
                }
                else {
                    $('.container4-row1 button span').removeClass('custom-expend');
                    $('.container4-row1 button span').addClass('custom-collapse');
                    $(".container4-body").slideDown(600);
                    $(".crousel-mobile-view").slideDown("slow");

                }

            });

            $("#btn-section2-slide3").click(function () {
                var className = $('#section2-slide3-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container4-row1 button span').removeClass('custom-collapse');
                    $('.container4-row1 button span').addClass('custom-expend');
                    $(".container4-body").slideUp(1000);
                    $(".crousel-mobile-view").slideUp("slow");

                }
                else {
                    $('.container4-row1 button span').removeClass('custom-expend');
                    $('.container4-row1 button span').addClass('custom-collapse');
                    $(".container4-body").slideDown(600);
                    $(".crousel-mobile-view").slideDown("slow");

                }

            });

            $("#btn-section2-slide4").click(function () {

                var className = $('#section2-slide4-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container4-row1 button span').removeClass('custom-collapse');
                    $('.container4-row1 button span').addClass('custom-expend');
                    $(".container4-body").slideUp(1000);
                    $(".crousel-mobile-view").slideUp("slow");
                }
                else {
                    $('.container4-row1 button span').removeClass('custom-expend');
                    $('.container4-row1 button span').addClass('custom-collapse');
                    $(".container4-body").slideDown(600);
                    $(".crousel-mobile-view").slideDown("slow");

                }

            });

            $("#btn-section2-slide5").click(function () {
                var className = $('#section2-slide5-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container4-row1 button span').removeClass('custom-collapse');
                    $('.container4-row1 button span').addClass('custom-expend');
                    $(".container4-body").slideUp(1000);
                    $(".crousel-mobile-view").slideUp("slow");
                }
                else {
                    $('.container4-row1 button span').removeClass('custom-expend');
                    $('.container4-row1 button span').addClass('custom-collapse');
                    $(".container4-body").slideDown(600);
                    $(".crousel-mobile-view").slideDown("slow");

                }

            });

            $("#btn-section2-slide6").click(function () {
                var className = $('#section2-slide6-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container4-row1 button span').removeClass('custom-collapse');
                    $('.container4-row1 button span').addClass('custom-expend');
                    $(".container4-body").slideUp(1000);
                    $(".crousel-mobile-view").slideUp("slow");
                }
                else {
                    $('.container4-row1 button span').removeClass('custom-expend');
                    $('.container4-row1 button span').addClass('custom-collapse');
                    $(".container4-body").slideDown(600);
                    $(".crousel-mobile-view").slideDown("slow");
                }
            });

            $("#btn-section2-slide7").click(function () {
                var className = $('#section2-slide7-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container4-row1 button span').removeClass('custom-collapse');
                    $('.container4-row1 button span').addClass('custom-expend');
                    $(".container4-body").slideUp(1000);
                    $(".crousel-mobile-view").slideUp("slow");
                }
                else {
                    $('.container4-row1 button span').removeClass('custom-expend');
                    $('.container4-row1 button span').addClass('custom-collapse');
                    $(".container4-body").slideDown(600);
                    $(".crousel-mobile-view").slideDown("slow");
                }
            });

            $("#btn-section2-slide8").click(function () {
                var className = $('#section2-slide8-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container4-row1 button span').removeClass('custom-collapse');
                    $('.container4-row1 button span').addClass('custom-expend');
                    $(".container4-body").slideUp(1000);
                    $(".crousel-mobile-view").slideUp("slow");
                }
                else {
                    $('.container4-row1 button span').removeClass('custom-expend');
                    $('.container4-row1 button span').addClass('custom-collapse');
                    $(".container4-body").slideDown(600);
                    $(".crousel-mobile-view").slideDown("slow");
                }
            });

            $("#btn-section2-slide9").click(function () {
                var className = $('#section2-slide9-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container4-row1 button span').removeClass('custom-collapse');
                    $('.container4-row1 button span').addClass('custom-expend');
                    $(".container4-body").slideUp(1000);
                    $(".crousel-mobile-view").slideUp("slow");
                }
                else {
                    $('.container4-row1 button span').removeClass('custom-expend');
                    $('.container4-row1 button span').addClass('custom-collapse');
                    $(".container4-body").slideDown(600);
                    $(".crousel-mobile-view").slideDown("slow");
                }
            });

            $("#btn-section2-slide10").click(function () {
                var className = $('#section2-slide10-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container4-row1 button span').removeClass('custom-collapse');
                    $('.container4-row1 button span').addClass('custom-expend');
                    $(".container4-body").slideUp(1000);
                    $(".crousel-mobile-view").slideUp("slow");
                }
                else {
                    $('.container4-row1 button span').removeClass('custom-expend');
                    $('.container4-row1 button span').addClass('custom-collapse');
                    $(".container4-body").slideDown(600);
                    $(".crousel-mobile-view").slideDown("slow");
                }
            });



            $("#btn-slider2").click(function () {
                var className = $('#section3-slide1-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container5-row1 button span').removeClass('custom-collapse');
                    $('.container5-row1 button span').addClass('custom-expend');
                    $(".container5-body").slideUp(1000);
                    $(".crousel-mobile-view1").slideUp("slow");
                }
                else {
                    $('.container5-row1 button span').removeClass('custom-expend');
                    $('.container5-row1 button span').addClass('custom-collapse');
                    $(".container5-body").slideDown(600);
                    $(".crousel-mobile-view1").slideDown("slow");

                }

            });

            $("#btn-section3-slide2").click(function () {
                var className = $('#section3-slide2-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container5-row1 button span').removeClass('custom-collapse');
                    $('.container5-row1 button span').addClass('custom-expend');
                    $(".container5-body").slideUp(1000);
                    $(".crousel-mobile-view1").slideUp("slow");
                }
                else {
                    $('.container5-row1 button span').removeClass('custom-expend');
                    $('.container5-row1 button span').addClass('custom-collapse');
                    $(".container5-body").slideDown(600);
                    $(".crousel-mobile-view1").slideDown("slow");
                }
            });

            $("#btn-section3-slide3").click(function () {
                var className = $('#section3-slide3-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container5-row1 button span').removeClass('custom-collapse');
                    $('.container5-row1 button span').addClass('custom-expend'); s
                    $(".container5-body").slideUp(1000);
                    $(".crousel-mobile-view1").slideUp("slow");

                }
                else {
                    $('.container5-row1 button span').removeClass('custom-expend');
                    $('.container5-row1 button span').addClass('custom-collapse');
                    $(".container5-body").slideDown(600);
                    $(".crousel-mobile-view1").slideDown("slow");
                }

            });


            $("#btn-section3-slide4").click(function () {
                var className = $('#section3-slide4-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container5-row1 button span').removeClass('custom-collapse');
                    $('.container5-row1 button span').addClass('custom-expend');
                    $(".container5-body").slideUp(1000);
                    $(".crousel-mobile-view1").slideUp("slow");
                }
                else {
                    $('.container5-row1 button span').removeClass('custom-expend');
                    $('.container5-row1 button span').addClass('custom-collapse');
                    $(".container5-body").slideDown(600);
                    $(".crousel-mobile-view1").slideDown("slow");
                }
            });

            $("#btn-section3-slide5").click(function () {
                var className = $('#section3-slide5-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container5-row1 button span').removeClass('custom-collapse');
                    $('.container5-row1 button span').addClass('custom-expend');
                    $(".container5-body").slideUp(1000);
                    $(".crousel-mobile-view1").slideUp("slow");
                }
                else {
                    $('.container5-row1 button span').removeClass('custom-expend');
                    $('.container5-row1 button span').addClass('custom-collapse');
                    $(".container5-body").slideDown(600);
                    $(".crousel-mobile-view1").slideDown("slow");
                }
            });

            $("#btn-section3-slide6").click(function () {
                var className = $('#section3-slide6-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container5-row1 button span').removeClass('custom-collapse');
                    $('.container5-row1 button span').addClass('custom-expend');
                    $(".container5-body").slideUp(1000);
                    $(".crousel-mobile-view1").slideUp("slow");
                }
                else {
                    $('.container5-row1 button span').removeClass('custom-expend');
                    $('.container5-row1 button span').addClass('custom-collapse');
                    $(".container5-body").slideDown(600);
                    $(".crousel-mobile-view1").slideDown("slow");
                }
            });


            $("#btn-section3-slide7").click(function () {
                var className = $('#section3-slide7-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container5-row1 button span').removeClass('custom-collapse');
                    $('.container5-row1 button span').addClass('custom-expend');
                    $(".container5-body").slideUp(1000);
                    $(".crousel-mobile-view1").slideUp("slow");
                }
                else {
                    $('.container5-row1 button span').removeClass('custom-expend');
                    $('.container5-row1 button span').addClass('custom-collapse');
                    $(".container5-body").slideDown(600);
                    $(".crousel-mobile-view1").slideDown("slow");
                }
            });

            $("#btn-section3-slide8").click(function () {
                var className = $('#section3-slide8-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container5-row1 button span').removeClass('custom-collapse');
                    $('.container5-row1 button span').addClass('custom-expend');
                    $(".container5-body").slideUp(1000);
                    $(".crousel-mobile-view1").slideUp("slow");
                }
                else {
                    $('.container5-row1 button span').removeClass('custom-expend');
                    $('.container5-row1 button span').addClass('custom-collapse');
                    $(".container5-body").slideDown(600);
                    $(".crousel-mobile-view1").slideDown("slow");
                }
            });

            $("#btn-section3-slide9").click(function () {
                var className = $('#section3-slide9-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container5-row1 button span').removeClass('custom-collapse');
                    $('.container5-row1 button span').addClass('custom-expend');
                    $(".container5-body").slideUp(1000);
                    $(".crousel-mobile-view1").slideUp("slow");
                }
                else {
                    $('.container5-row1 button span').removeClass('custom-expend');
                    $('.container5-row1 button span').addClass('custom-collapse');
                    $(".container5-body").slideDown(600);
                    $(".crousel-mobile-view1").slideDown("slow");
                }
            });

            $("#btn-section3-slide10").click(function () {
                var className = $('#section3-slide10-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container5-row1 button span').removeClass('custom-collapse');
                    $('.container5-row1 button span').addClass('custom-expend');
                    $(".container5-body").slideUp(1000);
                    $(".crousel-mobile-view1").slideUp("slow");
                }
                else {
                    $('.container5-row1 button span').removeClass('custom-expend');
                    $('.container5-row1 button span').addClass('custom-collapse');
                    $(".container5-body").slideDown(600);
                    $(".crousel-mobile-view1").slideDown("slow");
                }
            });


            $("#btn-slider3").click(function () {
                var className = $('#section4-slide1-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container6-row1 button span').removeClass('custom-collapse');
                    $('.container6-row1 button span').addClass('custom-expend');
                    $(".container6-body").slideUp(1000);
                    $(".crousel-mobile-view11").slideUp("slow");
                }
                else {
                    $('.container6-row1 button span').removeClass('custom-expend');
                    $('.container6-row1 button span').addClass('custom-collapse');
                    $(".container6-body").slideDown(600);
                    $(".crousel-mobile-view11").slideDown("slow");

                }

            });

            $("#btn-section4-slide2").click(function () {
                var className = $('#section4-slide2-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container6-row1 button span').removeClass('custom-collapse');
                    $('.container6-row1 button span').addClass('custom-expend');
                    $(".container6-body").slideUp(1000);
                    $(".crousel-mobile-view11").slideUp("slow");
                }
                else {
                    $('.container6-row1 button span').removeClass('custom-expend');
                    $('.container6-row1 button span').addClass('custom-collapse');
                    $(".container6-body").slideDown(600);
                    $(".crousel-mobile-view11").slideDown("slow");
                }
            });

            $("#btn-section4-slide3").click(function () {
                var className = $('#section4-slide3-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container6-row1 button span').removeClass('custom-collapse');
                    $('.container6-row1 button span').addClass('custom-expend');
                    $(".container6-body").slideUp(1000);
                    $(".crousel-mobile-view11").slideUp("slow");
                }
                else {
                    $('.container6-row1 button span').removeClass('custom-expend');
                    $('.container6-row1 button span').addClass('custom-collapse');
                    $(".container6-body").slideDown(600);
                    $(".crousel-mobile-view11").slideDown("slow");
                }
            });


            $("#btn-section4-slide4").click(function () {
                var className = $('#section4-slide4-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container6-row1 button span').removeClass('custom-collapse');
                    $('.container6-row1 button span').addClass('custom-expend');
                    $(".container6-body").slideUp(1000);
                    $(".crousel-mobile-view11").slideUp("slow");
                }
                else {
                    $('.container6-row1 button span').removeClass('custom-expend');
                    $('.container6-row1 button span').addClass('custom-collapse');
                    $(".container6-body").slideDown(600);
                    $(".crousel-mobile-view11").slideDown("slow");
                }
            });

            $("#btn-section4-slide5").click(function () {
                var className = $('#section4-slide5-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container6-row1 button span').removeClass('custom-collapse');
                    $('.container6-row1 button span').addClass('custom-expend');
                    $(".container6-body").slideUp(1000);
                    $(".crousel-mobile-view11").slideUp("slow");
                }
                else {
                    $('.container6-row1 button span').removeClass('custom-expend');
                    $('.container6-row1 button span').addClass('custom-collapse');
                    $(".container6-body").slideDown(600);
                    $(".crousel-mobile-view11").slideDown("slow");
                }
            });

            $("#btn-section4-slide6").click(function () {
                var className = $('#section4-slide6-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container6-row1 button span').removeClass('custom-collapse');
                    $('.container6-row1 button span').addClass('custom-expend');
                    $(".container6-body").slideUp(1000);
                    $(".crousel-mobile-view11").slideUp("slow");
                }
                else {
                    $('.container6-row1 button span').removeClass('custom-expend');
                    $('.container6-row1 button span').addClass('custom-collapse');
                    $(".container6-body").slideDown(600);
                    $(".crousel-mobile-view11").slideDown("slow");
                }
            });

            $("#btn-section4-slide7").click(function () {
                var className = $('#section4-slide7-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container6-row1 button span').removeClass('custom-collapse');
                    $('.container6-row1 button span').addClass('custom-expend');
                    $(".container6-body").slideUp(1000);
                    $(".crousel-mobile-view11").slideUp("slow");

                }
                else {
                    $('.container6-row1 button span').removeClass('custom-expend');
                    $('.container6-row1 button span').addClass('custom-collapse');
                    $(".container6-body").slideDown(600);
                    $(".crousel-mobile-view11").slideDown("slow");
                }

            });


            $("#btn-section4-slide8").click(function () {
                var className = $('#section4-slide8-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container6-row1 button span').removeClass('custom-collapse');
                    $('.container6-row1 button span').addClass('custom-expend');
                    $(".container6-body").slideUp(1000);
                    $(".crousel-mobile-view11").slideUp("slow");
                }
                else {
                    $('.container6-row1 button span').removeClass('custom-expend');
                    $('.container6-row1 button span').addClass('custom-collapse');
                    $(".container6-body").slideDown(600);
                    $(".crousel-mobile-view11").slideDown("slow");
                }
            });

            $("#btn-section4-slide9").click(function () {
                var className = $('#section4-slide9-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container6-row1 button span').removeClass('custom-collapse');
                    $('.container6-row1 button span').addClass('custom-expend');
                    $(".container6-body").slideUp(1000);
                    $(".crousel-mobile-view11").slideUp("slow");
                }
                else {
                    $('.container6-row1 button span').removeClass('custom-expend');
                    $('.container6-row1 button span').addClass('custom-collapse');
                    $(".container6-body").slideDown(600);
                    $(".crousel-mobile-view11").slideDown("slow");
                }
            });

            $("#btn-section4-slide10").click(function () {
                var className = $('#section4-slide10-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container6-row1 button span').removeClass('custom-collapse');
                    $('.container6-row1 button span').addClass('custom-expend');
                    $(".container6-body").slideUp(1000);
                    $(".crousel-mobile-view11").slideUp("slow");
                }
                else {
                    $('.container6-row1 button span').removeClass('custom-expend');
                    $('.container6-row1 button span').addClass('custom-collapse');
                    $(".container6-body").slideDown(600);
                    $(".crousel-mobile-view11").slideDown("slow");
                }
            });

            $("#btn-slider4").click(function () {
                var className = $('#section5-slide1-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container7-row1 button span').removeClass('custom-collapse');
                    $('.container7-row1 button span').addClass('custom-expend');
                    $(".container7-body").slideUp(1000);
                    $(".crousel-mobile-view111").slideUp("slow");
                }
                else {
                    $('.container7-row1 button span').removeClass('custom-expend');
                    $('.container7-row1 button span').addClass('custom-collapse');
                    $(".container7-body").slideDown(600);
                    $(".crousel-mobile-view111").slideDown("slow");

                }

            });

            $("#btn-section5-slide2").click(function () {
                var className = $('#section5-slide2-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container7-row1 button span').removeClass('custom-collapse');
                    $('.container7-row1 button span').addClass('custom-expend');
                    $(".container7-body").slideUp(1000);
                    $(".crousel-mobile-view111").slideUp("slow");
                }
                else {
                    $('.container7-row1 button span').removeClass('custom-expend');
                    $('.container7-row1 button span').addClass('custom-collapse');
                    $(".container7-body").slideDown(600);
                    $(".crousel-mobile-view111").slideDown("slow");
                }
            });

            $("#btn-section5-slide3").click(function () {
                var className = $('#section5-slide3-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container7-row1 button span').removeClass('custom-collapse');
                    $('.container7-row1 button span').addClass('custom-expend'); s
                    $(".container7-body").slideUp(1000);
                    $(".crousel-mobile-view111").slideUp("slow");

                }
                else {
                    $('.container7-row1 button span').removeClass('custom-expend');
                    $('.container7-row1 button span').addClass('custom-collapse');
                    $(".container7-body").slideDown(600);
                    $(".crousel-mobile-view111").slideDown("slow");
                }

            });


            $("#btn-section5-slide4").click(function () {
                var className = $('#section5-slide4-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container7-row1 button span').removeClass('custom-collapse');
                    $('.container7-row1 button span').addClass('custom-expend');
                    $(".container7-body").slideUp(1000);
                    $(".crousel-mobile-view111").slideUp("slow");
                }
                else {
                    $('.container7-row1 button span').removeClass('custom-expend');
                    $('.container7-row1 button span').addClass('custom-collapse');
                    $(".container7-body").slideDown(600);
                    $(".crousel-mobile-view111").slideDown("slow");
                }
            });

            $("#btn-section5-slide5").click(function () {
                var className = $('#section5-slide5-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container7-row1 button span').removeClass('custom-collapse');
                    $('.container7-row1 button span').addClass('custom-expend');
                    $(".container7-body").slideUp(1000);
                    $(".crousel-mobile-view111").slideUp("slow");
                }
                else {
                    $('.container7-row1 button span').removeClass('custom-expend');
                    $('.container7-row1 button span').addClass('custom-collapse');
                    $(".container7-body").slideDown(600);
                    $(".crousel-mobile-view111").slideDown("slow");
                }
            });

            $("#btn-section5-slide6").click(function () {
                var className = $('#section5-slide6-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container7-row1 button span').removeClass('custom-collapse');
                    $('.container7-row1 button span').addClass('custom-expend');
                    $(".container7-body").slideUp(1000);
                    $(".crousel-mobile-view111").slideUp("slow");
                }
                else {
                    $('.container7-row1 button span').removeClass('custom-expend');
                    $('.container7-row1 button span').addClass('custom-collapse');
                    $(".container7-body").slideDown(600);
                    $(".crousel-mobile-view111").slideDown("slow");
                }
            });

            $("#btn-section5-slide7").click(function () {
                var className = $('#section5-slide7-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container7-row1 button span').removeClass('custom-collapse');
                    $('.container7-row1 button span').addClass('custom-expend');
                    $(".container7-body").slideUp(1000);
                    $(".crousel-mobile-view111").slideUp("slow");
                }
                else {
                    $('.container7-row1 button span').removeClass('custom-expend');
                    $('.container7-row1 button span').addClass('custom-collapse');
                    $(".container7-body").slideDown(600);
                    $(".crousel-mobile-view111").slideDown("slow");
                }
            });

            $("#btn-section5-slide8").click(function () {
                var className = $('#section5-slide8-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container7-row1 button span').removeClass('custom-collapse');
                    $('.container7-row1 button span').addClass('custom-expend');
                    $(".container7-body").slideUp(1000);
                    $(".crousel-mobile-view111").slideUp("slow");
                }
                else {
                    $('.container7-row1 button span').removeClass('custom-expend');
                    $('.container7-row1 button span').addClass('custom-collapse');
                    $(".container7-body").slideDown(600);
                    $(".crousel-mobile-view111").slideDown("slow");
                }
            });

            $("#btn-section5-slide9").click(function () {
                var className = $('#section5-slide9-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container7-row1 button span').removeClass('custom-collapse');
                    $('.container7-row1 button span').addClass('custom-expend');
                    $(".container7-body").slideUp(1000);
                    $(".crousel-mobile-view111").slideUp("slow");
                }
                else {
                    $('.container7-row1 button span').removeClass('custom-expend');
                    $('.container7-row1 button span').addClass('custom-collapse');
                    $(".container7-body").slideDown(600);
                    $(".crousel-mobile-view111").slideDown("slow");
                }
            });

            $("#btn-section5-slide10").click(function () {
                var className = $('#section5-slide10-show-hide').attr('class');
                if (className == "custom-collapse") {
                    $('.container7-row1 button span').removeClass('custom-collapse');
                    $('.container7-row1 button span').addClass('custom-expend');
                    $(".container7-body").slideUp(1000);
                    $(".crousel-mobile-view111").slideUp("slow");
                }
                else {
                    $('.container7-row1 button span').removeClass('custom-expend');
                    $('.container7-row1 button span').addClass('custom-collapse');
                    $(".container7-body").slideDown(600);
                    $(".crousel-mobile-view111").slideDown("slow");
                }
            });

            $("#btn-section4").click(function () {
                var className = $('#section4-span-1').attr('class');
                if (className == "custom-collapse") {
                    $('#section4-span-1').removeClass('custom-collapse');
                    $('#section4-span-1').addClass('custom-expend');
                    $(".div3-low").slideUp(900);
                }
                else {
                    $('#section4-span-1').removeClass('custom-expend');
                    $('#section4-span-1').addClass('custom-collapse');
                    $(".div3-low").slideDown(700);
                }
            });


            $("#btn-section5").click(function () {
                var className = $('#section5-span-1').attr('class');
                if (className == "custom-collapse") {
                    $('#section5-span-1').removeClass('custom-collapse');
                    $('#section5-span-1').addClass('custom-expend');
                    $(".section5-div1").slideUp(1000);
                    $(".thanks-pic").slideUp(1000);


                }
                else {
                    $('#section5-span-1').removeClass('custom-expend');
                    $('#section5-span-1').addClass('custom-collapse');
                    $(".section5-div1").slideDown(1000);
                    $(".thanks-pic").slideDown(1000);

                }

            });


            if ($(".item").hasClass("active")) {
                $(".show-slide").css("overflow", "hidden");
            }

            $('.carousel').carousel({
                interval: false
            })
            $('#myCarousel5').carousel({
                interval: true
            })

            if (browserWidthIncludingScrollBar < 1200) {
                slideWithSwipe();
            }


            toggleProgressCircle(false);

        } catch (err) {
            console.log(err.message)
        }

    }

    $(window).load(function () {
        try {
            setTimeout(function () {
                $(".iframe").css("display", "inherit");
                //	alert("called");
            }, 3000);

            $("#page-container").css("display", "block");
            update_impact_iframe_element();
        } catch (err) {
            console.log(err.message)
        }
    });


    function chartgraphs() {
        try {
            google.charts.load('current', {
                packages: ['corechart']
            });

            // color Set array
            chartgraphsVarInit();
            // Get value for iterating charts
            var jsonObj_string = JSON.parse(document.getElementById('chartsDetails').value);
            var recordID = 0;
            for (recordID in jsonObj_string) {
                google.charts.setOnLoadCallback(drawCurveTypes);
                recordID = recordID + 1;
            }
            recordID = 0;
            function drawCurveTypes() {
                try {
                    if (!document.body.contains(document.getElementsByClassName('chart_div')[recordID])) return;
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'X');
                    data.addColumn('number');
                    data.addColumn({
                        'type': 'string',
                        'role': 'tooltip',
                        'p': {
                            'html': true
                        }
                    });
                    // dataTable.addColumn({type: 'string', role: 'tooltip'});
                    data.addRows(jsonObj_string[recordID]);
                    var colorSetIndex = $(document.getElementsByClassName('chart_div')[recordID]).parents("div.colorSet").attr('data-colorset') - 1;
                    var options = {
                        series: {
                            0: {
                                color: colorSetArray[colorSetIndex][0],
                                areaOpacity: 0.4,
                                axisColor: axisColorV,
                                areaColor: areaColorV
                            }
                        },
                        'width': 900,
                        'height': 500,
                        legend: {
                            position: 'none'
                        },
                        pointsVisible: true,
                        enableTooltip: true,
                        tooltip: {
                            isHtml: true
                        },
                        backgroundColor: 'transparent',
                        // line of the area
                        lineSize: 5,
                        lineColor: colorSetArray[colorSetIndex][0],
                        // point size of value provided
                        pointSize: 8,
                        dataPointWidth: 50,
                        hAxis: {
                            gridlines: {
                                color: 'transparent'
                            }
                        },
                        vAxis: {
                            format: '$###,###',
                            minValue: 0
                        }
                    };
                    var chart = chartShape(recordID);
                    chart.draw(data, options);
                    recordID = recordID + 1;
                } catch (err) {
                    console.log(err.message)
                }
            }

        } catch (err) {
            console.log(err.message);
        }
    }

    


    function toggleProgressCircle(val) {
        try {
            if (val) {
                $('#progress_circle_wrapper').removeClass('hide');
            } else {
                $('#progress_circle_wrapper').addClass('hide');
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    function displayGreeting(comma) {
        try {
            var now = new Date();
            var hrs = now.getHours();
            var msg = "Good Evening";

            if (hrs > 3) msg = "Good Morning";      // After 4am
            if (hrs > 11) msg = "Good Afternoon";    // After 12pm
            if (hrs > 17) msg = "Good Evening";

            $(".GS_1").text(msg + comma);
        } catch (err) {
            console.log(err.message)
        }
    }

    function slideWithSwipe() {
        try {
            $("#myCarousel5").swiperight(function () {
                $("#myCarousel5").carousel('prev');

            });
            $("#myCarousel5").swipeleft(function () {
                $("#myCarousel5").carousel('next');
            });

            $("#myCarousel2").swiperight(function () {
                $("#myCarousel2").carousel('prev');
                if ($(".container5-body").css("display") != "none") {
                    $('.container5-row1 button span').removeClass('custom-expend');
                    $('.container5-row1 button span').addClass('custom-collapse');
                } else {
                    $('.container5-row1 button span').addClass('custom-expend');
                    $('.container5-row1 button span').removeClass('custom-collapse');
                }
            });
            $("#myCarousel2").swipeleft(function () {
                $("#myCarousel2").carousel('next');
                if ($(".container5-body").css("display") != "none") {
                    $('.container5-row1 button span').removeClass('custom-expend');
                    $('.container5-row1 button span').addClass('custom-collapse');
                } else {
                    $('.container5-row1 button span').addClass('custom-expend');
                    $('.container5-row1 button span').removeClass('custom-collapse');
                }
            });


            $("#myCarousel3").swiperight(function () {
                $("#myCarousel3").carousel('prev');
                if ($(".container6-body").css("display") != "none") {
                    $('.container6-row1 button span').removeClass('custom-expend');
                    $('.container6-row1 button span').addClass('custom-collapse');
                } else {
                    $('.container6-row1 button span').addClass('custom-expend');
                    $('.container6-row1 button span').removeClass('custom-collapse');
                }
            });
            $("#myCarousel3").swipeleft(function () {
                $("#myCarousel3").carousel('next');
                if ($(".container6-body").css("display") != "none") {
                    $('.container6-row1 button span').removeClass('custom-expend');
                    $('.container6-row1 button span').addClass('custom-collapse');
                } else {
                    $('.container6-row1 button span').addClass('custom-expend');
                    $('.container6-row1 button span').removeClass('custom-collapse');
                }
            });


            $("#myCarousel4").swiperight(function () {
                $("#myCarousel4").carousel('prev');
                if ($(".container7-body").css("display") != "none") {
                    $('.container7-row1 button span').removeClass('custom-expend');
                    $('.container7-row1 button span').addClass('custom-collapse');
                } else {
                    $('.container7-row1 button span').addClass('custom-expend');
                    $('.container7-row1 button span').removeClass('custom-collapse');
                }
            });
            $("#myCarousel4").swipeleft(function () {
                $("#myCarousel4").carousel('next');
                if ($(".container7-body").css("display") != "none") {
                    $('.container7-row1 button span').removeClass('custom-expend');
                    $('.container7-row1 button span').addClass('custom-collapse');
                } else {
                    $('.container7-row1 button span').addClass('custom-expend');
                    $('.container7-row1 button span').removeClass('custom-collapse');
                }
            });


            $("#myCarousel1").swiperight(function () {
                $("#myCarousel1").carousel('prev');
                if ($(".container4-body").css("display") != "none") {
                    $('.container4-row1 button span').removeClass('custom-expend');
                    $('.container4-row1 button span').addClass('custom-collapse');
                } else {
                    $('.container4-row1 button span').addClass('custom-expend');
                    $('.container4-row1 button span').removeClass('custom-collapse');
                }
            });


            $("#myCarousel1").swipeleft(function () {
                $("#myCarousel1").carousel('next');
                if ($(".container4-body").css("display") != "none") {
                    $('.container4-row1 button span').removeClass('custom-expend');
                    $('.container4-row1 button span').addClass('custom-collapse');
                } else {
                    $('.container4-row1 button span').addClass('custom-expend');
                    $('.container4-row1 button span').removeClass('custom-collapse');
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }


    function arrowDisplayHide() {
        try {
            var contentPanelArr = document.getElementsByClassName('slideSecClass');
            for (var j = 0; j < contentPanelArr.length; j++) {
                var slide = contentPanelArr[j];
                if (slide.childElementCount) {
                    var contentPanelId = contentPanelArr[j].id;
                    var itemLi = $("#" + contentPanelId).find(".carousel-indicators").children("li");
                    var l = itemLi.length;
                    if (l == 1) {
                        $("#" + contentPanelId + ' .right-arrow').attr('style', 'display:none');
                        $("#" + contentPanelId + ' .left-arrow').attr('style', 'display:none');
                    }
                    else {
                        $("#" + contentPanelId + ' .right-arrow').attr('style', 'display:block');
                    }
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }


    function slideWithSwipe() {
        try {
            $("#photoGalleryCarousel").swiperight(function () {
                $("#myCarousel5").carousel('prev');

            });
            $("#photoGalleryCarousel").swipeleft(function () {
                $("#myCarousel5").carousel('next');
            });

            $("#myCarousel1, #myCarousel2, #myCarousel3, #myCarousel4, #myCarousel5, #myCarousel6, #myCarousel7, #myCarousel8, #myCarousel9, #myCarousel10, #myCarousel11, #myCarousel12, #myCarousel13").swiperight(function () {
                var className = $('#' + this.parentElement.parentElement.id + " .collapsed").attr('class');
                var sectionID = this.parentElement.parentElement.id;
                var carouselID = this.id;
                if (!(className.indexOf("custom-collapse") == -1)) {
                    $('#' + sectionID + ' #' + carouselID).carousel('prev');
                }
            });
            $("#myCarousel1, #myCarousel2, #myCarousel3, #myCarousel4, #myCarousel5, #myCarousel6, #myCarousel7, #myCarousel8, #myCarousel9, #myCarousel10, #myCarousel11, #myCarousel12, #myCarousel13").swipeleft(function () {
                var className = $('#' + this.parentElement.parentElement.id + " .collapsed").attr('class');
                var sectionID = this.parentElement.parentElement.id;
                var carouselID = this.id;
                if (!(className.indexOf("custom-collapse") == -1)) {
                    $('#' + sectionID + ' #' + carouselID).carousel('next');
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }


    function getOS() {
        try {

            var x = navigator.platform;
            var myOs = x.substring(0, 3).toLowerCase();
            if (myOs == "mac") {
                $('.container4-img').css("margin-top", "-95px");
                $('.sample-images').css("margin-top", "-95px");
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    function sliderSection() {
        try {
            var contentPanelArr = document.getElementsByClassName('slideSecClass');
            for (var j = 0; j < contentPanelArr.length; j++) {
                var slide = contentPanelArr[j];
                if (slide.getElementsByClassName("carousel").length > 0) {
                    if (slide.childElementCount) {
                        sliderViewsHTML = [];
                        sliderLi = [];
                        var contentPanelId = contentPanelArr[j].id;
                        $("#" + contentPanelId).find('.carousel-indicators-numbers').find(
                            ".removeIt").remove();
                        $("#" + contentPanelId).find(".carousel-inner").find(".lastItem")
                            .remove();
                        var item = $("#" + contentPanelId).find(".carousel-inner").find(
                            ".item");
                        item.each(function (k) {
                            sliderViewsHTML.push(item[k].innerHTML);
                        });
                        var itemLi = $("#" + contentPanelId).find(".carousel-indicators")
                            .children("li");
                        var l = itemLi.length;
                        $("#" + contentPanelId + ' .left-arrow').attr('style', 'display:none');
                        if (l == 1) {
                            $("#" + contentPanelId + ' .right-arrow').attr('style', 'display:none');
                            $("#" + contentPanelId + ' .left-arrow').attr('style', 'display:none');
                        }
                        else {
                            $("#" + contentPanelId + ' .right-arrow').attr('style', 'display:block');
                        }
                        itemLi.each(function (l) {
                            var attrCheck = itemLi[l];
                            if (attrCheck.hasAttribute('data-slide-to')) {
                                sliderLi.push(itemLi[l]);
                            }
                        });
                        for (var m = 0; m < sliderLi.length; m++) {
                            sliderLi[m].removeAttribute('class');
                        }
                        sliderLi[0].setAttribute('class', 'active');
                        $("#" + contentPanelId).find(".carousel-inner").children().remove();
                        for (var i = 0; i < item.length; i++) {
                            if (i == 0) {
                                $("#" + contentPanelId).find(".carousel-inner").append(
                                    "<div class='item active sliderItem_" + i
                                    + "' childitemid='" + i + "'>"
                                    + sliderViewsHTML[i] + "</div>");
                            } else {
                                $("#" + contentPanelId).find(".carousel-inner").append(
                                    "<div class='item sliderItem_" + i
                                    + "' childitemid='" + i + "'>"
                                    + sliderViewsHTML[i] + "</div>");
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    function scrollbarWidth() {
        try {
            var $inner = jQuery('<div style="width: 100%; height:200px;">test</div>'),
                $outer = jQuery('<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),
                inner = $inner[0],
                outer = $outer[0];

            jQuery('body').append(outer);
            var width1 = inner.offsetWidth;
            $outer.css('overflow', 'scroll');
            var width2 = outer.clientWidth;
            $outer.remove();

            return (width1 - width2);
        } catch (err) {
            console.log(err.message)
        }
    }

    function update_impact_iframe_element() {
        try {
            $('.assetReplacerClassForFundDescription, .assetReplacerClassForImpact').each(function () {
                if ($(this)[0].src.substring(0, 30) === "https://player.vimeo.com/video") {
                    // Create new element and assign attributes from the current element
                    var NewElement = $("<iframe />");
                    $.each(this.attributes, function (i, attrib) {
                        $(NewElement).attr(attrib.name, attrib.value);
                    });
                    // Replace the current element with new
                    $(this).replaceWith(function () {
                        return $(NewElement).append($(this).contents());
                    });
                }
            });
        } catch (err) {
            console.log(err.message);
        }
    }


    function addAllEleByParam(param) {
        try {
            $(param).each(function () {
                all_ele.push($(this));
            });
        } catch (err) {
            console.log(err.message)
        }
    }
    // call all duplicate functionality
    var all_ele = [];
    var all_dup_section_id = [];

    function update_repeated_section_id() {
        try {
            update_dup_section_id_class();
            all_ele = [];
            all_dup_section_id = [];
            addAllEleByParam(".slideSecClass .inline-textEditor");
            addAllEleByParam("#greetingsPanel .inline-textEditor");
            fix_dup_section_id("sectionid");
            update_dup_carousel_id();
        } catch (err) {
            console.log(err.message)
        }
    }
    // fix duplicat section id
    function fix_dup_section_id(selector) {
        try {
            var i = 0;
            var j = 0;
            $.each(all_ele, function () {
                j = i + 1;
                $.each(all_ele, function () {
                    if (all_ele[j] == undefined) {
                        return false;
                    }
                    if (all_ele[i].attr(selector) === all_ele[j].attr(selector)) {
                        var old_section_id = all_ele[j].attr(selector);
                        // all_ele[j].removeClass(old_section_id);
                        if (all_ele[j].attr("onblur") != undefined) {
                            var allEleParentsSecAttIdAllEleAttSecId = $("#" + all_ele[j].parents("section").attr("id") + " ." + all_ele[j].attr("sectionid"));
                            allEleParentsSecAttIdAllEleAttSecId.addClass(old_section_id + j);
                            allEleParentsSecAttIdAllEleAttSecId.removeClass(old_section_id);
                            all_ele[j].addClass("hard-return-block");
                        }
                        all_ele[j].attr("sectionid", old_section_id + j);
                        all_ele[j].addClass(old_section_id + j);
                        return false;
                    }
                    j += 1;
                });
                i += 1;
            });
        } catch (err) {
            console.log(err.message)
        }
    }
    // call fix dup caruousl id function
    function update_dup_carousel_id() {
        try {
            all_ele = [];
            all_dup_section_id = [];
            addAllEleByParam(".carousel");
            fix_dup_carousel_id();
        } catch (err) {
            console.log(err.message)
        }
    }
    // fix duplicate carousel id
    function fix_dup_carousel_id(selector) {
        try {
            var i = 0;
            var j = 0;
            var classAdded = 0;
            $.each(all_ele, function () {
                j = i + 1;
                $.each(all_ele, function () {
                    if (all_ele[j] == undefined) {
                        return false;
                    }
                    if (all_ele[i][
                        0
                    ].id === all_ele[j][
                        0
                    ].id) {
                        var section_id = $(all_ele[0]).parents("section")[0].id;
                        if (classAdded == 0) {
                            $("#" + section_id + " .carousel").addClass($("#" + section_id + " .carousel").attr("id"));
                            classAdded = 1;
                        }
                        $("#" + section_id + " .carousel-control").attr("href", "#" + $("#" + section_id + " .carousel").attr("id") + j);
                        $("#" + section_id + " .carousel-indicators li").attr("data-target", "#" + $("#" + section_id + " .carousel").attr("id") + j);
                        $("#" + section_id + " .carousel").attr("id", $("#" + section_id + " .carousel").attr("id") + j);
                        return false;
                    }
                    j += 1;
                });
                i += 1;
            });
        } catch (err) {
            console.log(err.message)
        }
    }
    // fix update duplicate section id class
    function update_dup_section_id_class() {
        try {
            all_ele = [];
            all_dup_section_id = [];
            addAllEleByParam(".AU-en-2");
            fix_update_dup_section_id_class();
        } catch (err) {
            console.log(err.message)
        }
    }
    // fix update duplicate section id class
    function fix_update_dup_section_id_class() {
        try {
            var i = 1;
            $.each(all_ele, function () {
                if (i <= all_ele.length) {
                    if ($(all_ele[i]).attr("sectionid") === "AU-en-2") {
                        all_ele[i].attr("sectionid", "AU-en-2" + i + "q");
                        all_ele[i].addClass("AU-en-2" + i + "q");
                    }
                }
                i += 1;
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    /*Fund Report JS*/
    /*Close FindList Div Wrapper*/
    function closeFundList(ele) {
        try {
            $(ele.parentElement.nextElementSibling).addClass('hide');
            $(ele).removeClass('open');
            if (ele.parentElement.nextElementSibling == null) {
                $(ele.parentElement).addClass('hide');
                $(ele.parentElement.previousElementSibling.children[2]).removeClass('open');
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    /*Open FindList Div Wrapper*/
    function openFundList(ele) {
        try {
            if ($(ele).hasClass('open')) {
                closeFundList(ele);
            } else {
                $(ele.parentElement.nextElementSibling).removeClass('hide');
                $(ele).addClass('open');
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    /*REPORT FUND-Get total Number of <li> count on the bases of <slide id>*/
    for (var fundcount = 1; fundcount <= 4; fundcount++) {
        try {
            if ($('#slides_' + fundcount).html() != "") {
                if ($('#slides_' + fundcount).find('.carousel-list-funds').length > 0) {
                    $('#slides_' + fundcount).find('.total-fund').html($('#slides_' + fundcount + ' .carousel-list-funds .list-fund-options').find('li').size());
                }

                /*Fund Impact Slide- Hide Contact div if its EMPTY*/
                if ($('#slides_' + fundcount + ' .report-slide4-contact').length > 0) {
                    var clLength = $('#slides_' + fundcount + ' .report-slide4-contact').length;
                    for (var cl = 0; cl < clLength; cl++) {
                        if ($.trim($('#slides_' + fundcount + ' .report-slide4-contact').find('div.marg-auto-mob')[cl].innerHTML) == "") {
                            $($('#slides_' + fundcount + ' .report-slide4-contact').find('div.marg-auto-mob')[cl].parentElement).addClass('hide')
                        }

                    }
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }



}


/***************************************
 * output-lib  - this library use only output
 *************************************/
if (window.location.pathname.indexOf("edit") == -1 && window.location.pathname.indexOf("BroadcastTemplate") == -1) {
    /**
 * outputonly
 */
    function outputOnlyLibFile() {
    	editor_copyURL_readyJs();
        //chartgraph();
        $('head').append('<script src="/ui/js/fund-print-modal.js" type="text/javascript"></script>');
        $('.carousel-indicators-common li').css("margin-left", "0");
        $('.addCarouselPanelOuter').css("display", "none");
        $('.go-to-fund-wrapper').css({
            "display": "block"
        });
        // Handler for .ready() called.
        windowResizemob();
        update_repeated_section_id();
        /*commaRemoveForReport();*/
        //for photo gallery carousal initialization on desktop and tablet view
        var browserWidthWithOutScrollBar = $(window).width();
        var scrollWidth = scrollbarWidth();
        var browserWidthIncludingScrollBar = ($(window).width() + scrollWidth);
        if (browserWidthIncludingScrollBar > 991) {
            imageCarouselInitializer();
        }
        if ($("#chartsDetails").length > 0) {
            chartgraphs();
            //chartgraph();
        }
        copyUrlContactSection();

        //vimeo call js
        addVimeoPlayerAPIJSOnload();
        //added for mouseflow
        addInteractionDivOnload();
        //Saurabh
        $(".headerLink").click(function () {
            try {
                $('#showForm').attr('action', window.location.search != undefined ? window.location.pathname + window.location.search : window.location.pathname);
                $('#pagename').val($(this).attr('name'));
                $('#showForm').submit();
            } catch (err) {
                console.log(err.message)
            }
        });


        //All fund selection 
        $(".go-to-fund-wrapper .greeting-fund-list li:first").click(function () {
            try {
                $('#showForm').attr('action', window.location.search != undefined ? window.location.pathname + window.location.search : window.location.pathname);
                $('#pagename').val('index');
                $('#showForm').submit();
                return;
            } catch (err) {
                console.log(err.message)
            }
        });

        //single fund selection
        $(".go-to-fund-wrapper .greeting-fund-list li:not(:first-child)").click(function (e) {
            try {
                /*GREETING FOOTER FUND LISTS FUNCTION*/
                var ajaxUrl = '/ovrture/gotoFund';
                var reportId = $("#reportId").val();
                var fundId = 0;
                var fundName = "All Funds";
                e.preventDefault();
                fundId = $(this).attr("data-fund-id");
                fundName = $(this).text();
                var ajaxData = { 'report-id': '' + reportId + '', 'fund-id': '' + fundId + '', 'type': '1' };
                ajaxForFundOutput(ajaxUrl, ajaxData, fundName, fundId);
            } catch (err) {
                console.log(err.message)
            }
        });


        $(document).delegate("#form-submit-section", "click", function () {
            try {
                var email = $("#form-input-section").val();
                var reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
                if (!reg.test(email)) {
                    notification_without_page_load("INVALID EMAIL");
                    return false;
                }
                $.ajax({
                    url: '/user/record-requested-email',
                    type: 'POST',
                    data: {
                        email: email,
                        pk_records_id: readCookie("rid"),
                        passcode: readCookie("ep")
                    },
                    dataType: "json",
                    success: function (response) {
                        if (response != null && response.result != null && response.result.status == 'success') {
                            notification_without_page_load(response.result.message);
                        } else if (response != null && response.result != null && response.result.status == 'failure') {
                            notification_without_page_load(response.result.message);
                        }
                    },
                    error: function () {

                    }
                });
            } catch (err) {
                console.log(err.message)
            }
        });

    }


    function windowResizemob() {
        try {
            var windowWidthG = $(window).width();
            $(window).resize(function () {
                var windowWidth = $(window).width();
                if (windowWidth <= 991) {
                    if (windowWidthG <= 991) {
                        windowWidthG = windowWidth;
                    } else {
                        windowWidthG = windowWidth;
                        $(".carousel-inner").css("display", "none");
                        $(".slideSecClass .carousel-indicators").css("display", "none");
                        $(".carousel-control").css("display", "none");
                        //Report-Carousel Indicators Hide on mobile view bydefault
                        $(".slideSecClass .carousel-indicators-replica").css("display", "none");
                        $(".slideSecClass .list-fund-options .carousel-indicators.report").css("display", "block");
                        //$( ".chart_div" ).children('div').children('div').css('width','300px');
                    }
                    /*if ($('.carousel-inner').is(':visible')) {
                        $('.carousel-inner').collapse('show');
                    }*/
                } else if (windowWidth >= 992) {
                    windowWidthG = windowWidth;
                    $(".carousel-inner").css("display", "inherit");
                    $(".slideSecClass .carousel-indicators").css("display", "inherit");
                    //Report-Carousel Indicators Hide on mobile view bydefault
                    $(".slideSecClass .carousel-indicators-replica").css("display", "inherit");
                    $(".carousel-control").css("display", "inherit");
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }


    var contentPanelHaveChildArr = [];
    var contentPanelArr = [];
    function activeContentPanels() {
        try {
            contentPanelHaveChildArr = [];
            contentPanelArr = document.getElementsByClassName('slideSecClass');
            for (var i = 0; i < contentPanelArr.length; i++) {
                var slide = contentPanelArr[i];
                if (slide.childElementCount) {
                    contentPanelHaveChildArr.push(contentPanelArr[i]);
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    function shiftTheContentPanelAccordingToPosition(type) {
        try {
            return;
            if (type == "report") {
                //got object from inside the editor for RGCP location
                var fundPanelSeqArrayList = $.parseJSON($('#fundPanelSequenceDetail')[0].value);
                //position for RGCP assigned to the variables
                var fund_description = fundPanelSeqArrayList.fund_description;
                var fund_soa = fundPanelSeqArrayList.fund_soa;
                var fund_performance = fundPanelSeqArrayList.fund_performance;
                var fund_impact = fundPanelSeqArrayList.fund_impact;
                //get all content panels available to be used
                contentPanelHaveChildArr = [];
                contentPanelArr = [];
                var cpSectionInnerHTML = [];
                var pushedLocation = [];
                var FDAdded = false;
                var FSOAAdded = false;
                var FPAdded = false;
                var FIAdded = false;
                activeContentPanels();
                //run all panels to set arr as per location info
                for (var i = 0; i < contentPanelArr.length; i++) {
                    var pushed = false;
                    for (var z = 0; z < 4; z++) {
                        if (contentPanelHaveChildArr[z] == undefined) {
                            continue;
                        }
                        if (fund_description == i && contentPanelHaveChildArr[z].children[0].id == 'FUND_DESCRIPTION') {
                            cpSectionInnerHTML.push(contentPanelArr[z].innerHTML);
                            pushed = true; FDAdded = true;
                            break;
                        }
                        if (fund_soa == i && contentPanelHaveChildArr[z].children[0].id == 'FUND_SOA') {
                            cpSectionInnerHTML.push(contentPanelArr[z].innerHTML);
                            pushed = true; FSOAAdded = true;
                            break;
                        }
                        if (fund_performance == i && contentPanelHaveChildArr[z].children[0].id == 'FUND_PERFORMANCE') {
                            cpSectionInnerHTML.push(contentPanelArr[z].innerHTML);
                            pushed = true; FPAdded = true;
                            break;
                        }
                        if (fund_impact == i && contentPanelHaveChildArr[z].children[0].id == 'FUND_IMPACT') {
                            cpSectionInnerHTML.push(contentPanelArr[z].innerHTML);
                            pushed = true; FIAdded = true;
                            break;
                        }
                    }
                    if (pushed == true) {
                        continue;
                    }
                    for (var x = 0; x < contentPanelHaveChildArr.length; x++) {
                        if (contentPanelHaveChildArr[x].children[0].id != 'FUND_IMPACT' &&
                            contentPanelHaveChildArr[x].children[0].id != 'FUND_PERFORMANCE' &&
                            contentPanelHaveChildArr[x].children[0].id != 'FUND_SOA' &&
                            contentPanelHaveChildArr[x].children[0].id != 'FUND_DESCRIPTION' &&
                            pushedLocation.indexOf(x) < 0) {
                            pushedLocation.push(x);
                            cpSectionInnerHTML.push(contentPanelArr[x].innerHTML);
                            break;
                        }
                    }
                }
                //check if any panel has been introduced into system but at last by RGCP
                if (!FDAdded) {
                    if ($('#FUND_DESCRIPTION').length > 0) {
                        cpSectionInnerHTML.push($('#FUND_DESCRIPTION')[0].outerHTML);
                    }
                }
                if (!FSOAAdded) {
                    if ($('#FUND_SOA').length > 0) {
                        cpSectionInnerHTML.push($('#FUND_SOA')[0].outerHTML);
                    }
                }
                if (!FPAdded) {
                    if ($('#FUND_PERFORMANCE').length > 0) {
                        cpSectionInnerHTML.push($('#FUND_PERFORMANCE')[0].outerHTML);
                    }
                }
                if (!FIAdded) {
                    if ($('#FUND_IMPACT').length > 0) {
                        cpSectionInnerHTML.push($('#FUND_IMPACT')[0].outerHTML);
                    }
                }
                //run all panels to change location
                for (var j = 0; j < cpSectionInnerHTML.length; j++) {
                    var slide = contentPanelArr[j];
                    if (slide.childElementCount) { contentPanelArr[j].children[0].remove(); }
                    contentPanelArr[j].innerHTML = cpSectionInnerHTML[j];
                }
                $('.carousel').carousel({ interval: false });
            }
        } catch (e) {
            console.log(e);
        }
    }
    function copyUrlContactSection() {
        try {
            var slides = $(".report-slide4-contact > div").length;
            for (var i = 0; i < slides; i++) {
                //$('#slides_'+i+' .report-slide4-contact').find('a#RECIPIENTEMAIL').attr('href');

                var email = $('.sliderItem_' + i + ' .report-slide4-contact').find('a#RECIPIENTEMAIL').attr('href');
                var linkedin = $('.sliderItem_' + i + ' .report-slide4-contact').find('a#RECIPIENTLINKEDIN_A').attr('href');
                var facebook = $('.sliderItem_' + i + ' .report-slide4-contact').find('a#RECIPIENTFACEBOOK_A').attr('href');
                var twitter = $('.sliderItem_' + i + ' .report-slide4-contact').find('a#RECIPIENTTWITTERHANDLE_A').attr('href');
                var instagram = $('.sliderItem_' + i + ' .report-slide4-contact').find('a#RECIPIENTINSTAGRAM_A').attr('href');
                var snapchat = $('.sliderItem_' + i + ' .report-slide4-contact').find('a#RECIPIENTSNAPCHAT_A').attr('href');

                if (email == "mailto:" || email == "" || email == undefined) {
                    $('.sliderItem_' + i + ' .report-slide4-contact').find('a#RECIPIENTEMAIL').hide();//style.display = 'none'
                }
                if (linkedin == "" || linkedin == undefined) {
                    $('.sliderItem_' + i + ' .report-slide4-contact').find('a#RECIPIENTLINKEDIN_A').hide();
                }
                if (facebook == "" || facebook == undefined) {
                    $('.sliderItem_' + i + ' .report-slide4-contact').find('a#RECIPIENTFACEBOOK_A').hide();
                }
                if (twitter == "" || twitter == undefined) {
                    $('.sliderItem_' + i + ' .report-slide4-contact').find('a#RECIPIENTTWITTERHANDLE_A').hide();
                }
                if (instagram == "" || instagram == undefined) {
                    $('.sliderItem_' + i + ' .report-slide4-contact').find('a#RECIPIENTINSTAGRAM_A').hide();
                }
                if (snapchat == "" || snapchat == undefined || snapchat == "https://www.snapchat.com/add/") {
                    $('.sliderItem_' + i + ' .report-slide4-contact').find('a#RECIPIENTSNAPCHAT_A').hide();
                }
                if ((email == "mailto:" || email == "" || email == undefined) &&
                    (linkedin == "" || linkedin == undefined) &&
                    (facebook == "" || facebook == undefined) &&
                    (twitter == "" || twitter == undefined) &&
                    (instagram == "" || instagram == undefined) &&
                    (snapchat == "" || snapchat == undefined || snapchat == "https://www.snapchat.com/add/")) {
                    $('.sliderItem_' + i + ' .report-slide4-contact').hide();
                }

            }
        } catch (err) {
            console.log(err.message)
        }
    }



    function carousalDisplayHide() {
        try {
            var contentPanelArr = document.getElementsByClassName('slideSecClass');
            for (var j = 0; j < contentPanelArr.length; j++) {
                var slide = contentPanelArr[j];
                if (slide.childElementCount) {
                    var contentPanelId = contentPanelArr[j].id;
                    var itemLi = $("#" + contentPanelId).find(".carousel-indicators").children("li");
                    var l = itemLi.length;
                    if (l == 1) {
                        $("#" + contentPanelId).find(".carousel-indicators").hide();
                    }
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    var vimeoPlayers = [];
    function callFunctionFromVimeoScript() {
        try {
            var iframes = document.querySelectorAll('iframe');
            var i = 0;
            $(iframes).each(function () {
                if (iframes[i].src != "" && iframes[i].src != undefined) {
                    var player = new Vimeo.Player(iframes[i]);
                    player.on('play', function () {
                        //				setTimeout(function() {
                        $("#generic-message-pop").removeClass("pause-div").addClass("play-div").html('<i class="fa fa-play play-icon"></i><span class="play-icon-text">Video Played</span>').stop().fadeIn(200);
                        //				},1600);
                    });
                    player.on('pause', function () {
                        $("#generic-message-pop").removeClass("play-div").addClass("pause-div").addClass().html('<i class="fa fa-pause pause-icon"></i><span class="pause-icon-text">Video Paused</spa>').stop().fadeIn(200).delay(1000).fadeOut(200);
                    });
                    /*player.getVideoTitle().then(function(title) {
                    console.log('title:', title);
                    });*/
                    vimeoPlayers.push(player);
                    i += 1;
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    //vimeo js 
    function addVimeoPlayerAPIJSOnload() {
        try {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = function () {
                callFunctionFromVimeoScript();
            };
            script.src = 'https://player.vimeo.com/api/player.js';
            head.appendChild(script);
        } catch (err) {
            console.log(err.message)
        }
    }

    function addInteractionDivOnload() {
        try {
            var node = document.createElement("div");
            node.append("Default");
            node.setAttribute("id", "generic-message-pop");
            node.setAttribute("class", "opacity-0 generic-message-pop-class");
            document.querySelector("#page-container").prepend(node);
        } catch (err) {
            console.log(err.message)
        }
    }


    //ajax for selection of funds
    function ajaxForFundOutput(ajaxURL, ajaxData, fundName, fundId) {
        try {
            $.ajax({
                url: ajaxURL,
                data: ajaxData,
                type: 'POST',
                dataType: "json",
                beforeSend: function () {
                    toggleProgressCircle(true);
                },
                success: function (response) {
                    if (response != null && response.result != null && response.result.status == 'success' && response.result.code == '200') {
                        var fundDescription = response.result.fund_description;
                        var fundSoa = response.result.fund_soa;
                        var fundPerformance = response.result.fund_performance;
                        var fundImpact = response.result.fund_impact;
                        //var impactcount = $(fundImpact).length;
                        $(".go-to-fund-wrapper .replace-name").text(fundName);
                        if (fundDescription == null) {
                            fundDescription = "";
                            $(".description .report-slider-collapsable-common").addClass("hide");
                        } else {
                            $(".description .report-slider-collapsable-common").removeClass("hide");
                        }
                        if (fundSoa == null) {
                            fundSoa = "";
                            $(".soa .report-slider-collapsable-common").addClass("hide");
                        } else {
                            $(".soa .report-slider-collapsable-common").removeClass("hide");
                        }
                        if (fundPerformance == null) {
                            fundPerformance = "";
                            $(".performance .report-slider-collapsable-common").addClass("hide");
                            if ($("#chartsDetails").length > 0)
                                $("#chartsDetails")[0].value = "";
                        } else {
                            $(".performance .report-slider-collapsable-common").removeClass("hide");
                            if ($("#chartsDetails").length > 0)
                                $("#chartsDetails")[0].value = response.result.graphDetailString;
                        }
                        if (fundImpact == null) {
                            fundImpact = "";
                            $(".impact .report-slider-collapsable-common").addClass("hide");
                        } else {
                            $(".impact .report-slider-collapsable-common").removeClass("hide");
                        }
                        if (fundPerformance != null && fundPerformance != "") {
                            chartgraphs();
                        }
                        if (fundId == 0) {
                            $(".report-carousel-indicators").removeClass("hide");
                            $(".go-to-fund-wrapper.report-carousel-indicators").removeClass("hide");
                            $(".carousel-list-funds").addClass("hide");
                            $(".fund-list-button").removeClass("open");
                            $(".report-cp-panel .carousel-control .left-arrow, .report-cp-panel .carousel-control .right-arrow").attr('style', 'display:block');
                        } else {
                            $(".report-carousel-indicators").addClass("hide");
                            $(".go-to-fund-wrapper.report-carousel-indicators").removeClass("hide");
                            $(".carousel-list-funds").addClass("hide");
                            $(".fund-list-button").removeClass("open");
                            $(".report-cp-panel .carousel-control .left-arrow, .report-cp-panel .carousel-control .right-arrow").attr('style', 'display:none');
                        }
                        $("#FUND_DESCRIPTION .carousel-inner").html(fundDescription);
                        $("#FUND_SOA .carousel-inner").html(fundSoa);
                        $("#FUND_PERFORMANCE .carousel-inner").html(fundPerformance);
                        $("#FUND_IMPACT .carousel-inner").html(fundImpact);
                        if ($("#FUND_IMPACT .carousel-inner").children().length > 1) {
                            $("#FUND_IMPACT .carousel-control .right-arrow").attr('style', 'display:block');
                            //$(".impact .report-carousel-indicators").removeClass("hide");
                        }
                        toggleProgressCircle(false);
                    } else {
                        toggleProgressCircle(false);
                        notification_without_page_load(response.result.message);
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }


    function notification_without_page_load(notificationMsg) {
        try {
            $("#GenericMsgPopUp").find(".comm-msg-detail").html(notificationMsg);
            $("#GenericMsgPopUp").modal("show");
            $(".modal-backdrop").css("opacity", ".01");
            setTimeout(function () {
                $("#GenericMsgPopUp").modal("hide");
                $(".modal-backdrop").remove();
            }, 2500);
        } catch (err) {
            console.log(err.message)
        }
    }


    function readCookie(name) {
        try {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        } catch (err) {
            console.log(err.message)
        }
    }
}
