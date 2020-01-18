/*! DataTables jQuery UI integration
 * ÂŠ2011-2014 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for jQuery UI. This requires jQuery UI and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using jQuery UI. See http://datatables.net/manual/styling/jqueryui
 * for further information.
 */
(function(window, document, undefined){

var factory = function( $, DataTable ) {
"use strict";


var sort_prefix = 'css_right ui-icon ui-icon-';
var toolbar_prefix = 'fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix ui-corner-';

/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		'<"'+toolbar_prefix+'tl ui-corner-tr"lfr>'+
		't'+
		'<"'+toolbar_prefix+'bl ui-corner-br"ip>',
	renderer: 'jqueryui'
} );



jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "de_datetime-asc": function ( a, b ) {
        var x, y;
        if (jQuery.trim(a) !== '') {
            var deDatea = jQuery.trim(a).split(' ');
            var deTimea = deDatea[1].split(':');
            var deDatea2 = deDatea[0].split('/');
                        if(typeof deTimea[2] != 'undefined') {
                            x = (deDatea2[2] + deDatea2[1] + deDatea2[0] + deTimea[0] + deTimea[1] + deTimea[2]) * 1;
                        } else {
                            x = (deDatea2[2] + deDatea2[1] + deDatea2[0] + deTimea[0] + deTimea[1]) * 1;
                        }
        } else {
            x = -Infinity; // = l'an 1000 ...
        }
 
        if (jQuery.trim(b) !== '') {
            var deDateb = jQuery.trim(b).split(' ');
            var deTimeb = deDateb[1].split(':');
            deDateb = deDateb[0].split('/');
                        if(typeof deTimeb[2] != 'undefined') {
                            y = (deDateb[2] + deDateb[1] + deDateb[0] + deTimeb[0] + deTimeb[1] + deTimeb[2]) * 1;
                        } else {
                            y = (deDateb[2] + deDateb[1] + deDateb[0] + deTimeb[0] + deTimeb[1]) * 1;
                        }
        } else {
            y = -Infinity;
        }
        var z = ((x < y) ? -1 : ((x > y) ? 1 : 0));
        return z;
    },
 
    "de_datetime-desc": function ( a, b ) {
        var x, y;
        if (jQuery.trim(a) !== '') {
            var deDatea = jQuery.trim(a).split(' ');
            var deTimea = deDatea[1].split(':');
            var deDatea2 = deDatea[0].split('/');
                        if(typeof deTimea[2] != 'undefined') {
                            x = (deDatea2[2] + deDatea2[1] + deDatea2[0] + deTimea[0] + deTimea[1] + deTimea[2]) * 1;
                        } else {
                            x = (deDatea2[2] + deDatea2[1] + deDatea2[0] + deTimea[0] + deTimea[1]) * 1;
                        }
        } else {
            x = Infinity;
        }
 
        if (jQuery.trim(b) !== '') {
            var deDateb = jQuery.trim(b).split(' ');
            var deTimeb = deDateb[1].split(':');
            deDateb = deDateb[0].split('/');
                        if(typeof deTimeb[2] != 'undefined') {
                            y = (deDateb[2] + deDateb[1] + deDateb[0] + deTimeb[0] + deTimeb[1] + deTimeb[2]) * 1;
                        } else {
                            y = (deDateb[2] + deDateb[1] + deDateb[0] + deTimeb[0] + deTimeb[1]) * 1;
                        }
        } else {
            y = -Infinity;
        }
        var z = ((x < y) ? 1 : ((x > y) ? -1 : 0));
        return z;
    },
 
    "de_date-asc": function ( a, b ) {
        var x, y;
        if (jQuery.trim(a) !== '') {
            var deDatea = jQuery.trim(a).split('.');
            x = (deDatea[2] + deDatea[1] + deDatea[0]) * 1;
        } else {
            x = Infinity; // = l'an 1000 ...
        }
 
        if (jQuery.trim(b) !== '') {
            var deDateb = jQuery.trim(b).split('.');
            y = (deDateb[2] + deDateb[1] + deDateb[0]) * 1;
        } else {
            y = -Infinity;
        }
        var z = ((x < y) ? -1 : ((x > y) ? 1 : 0));
        return z;
    },
 
    "de_date-desc": function ( a, b ) {
        var x, y;
        if (jQuery.trim(a) !== '') {
            var deDatea = jQuery.trim(a).split('.');
            x = (deDatea[2] + deDatea[1] + deDatea[0]) * 1;
        } else {
            x = -Infinity;
        }
 
        if (jQuery.trim(b) !== '') {
            var deDateb = jQuery.trim(b).split('.');
            y = (deDateb[2] + deDateb[1] + deDateb[0]) * 1;
        } else {
            y = Infinity;
        }
        var z = ((x < y) ? 1 : ((x > y) ? -1 : 0));
        return z;
    }
} );
$.extend( DataTable.ext.classes, {
	"sWrapper":            "dataTables_wrapper dt-jqueryui",

	/* Full numbers paging buttons */
	"sPageButton":         "fg-button ui-button ui-state-default",
	"sPageButtonActive":   "ui-state-disabled",
	"sPageButtonDisabled": "ui-state-disabled",

	/* Features */
	"sPaging": "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi "+
		"ui-buttonset-multi paging_", /* Note that the type is postfixed */

	/* Sorting */
	"sSortAsc":            "ui-state-default sorting_asc",
	"sSortDesc":           "ui-state-default sorting_desc",
	"sSortable":           "ui-state-default sorting",
	"sSortableAsc":        "ui-state-default sorting_asc_disabled",
	"sSortableDesc":       "ui-state-default sorting_desc_disabled",
	"sSortableNone":       "ui-state-default sorting_disabled",
	"sSortIcon":           "DataTables_sort_icon",

	/* Scrolling */
	"sScrollHead": "dataTables_scrollHead "+"ui-state-default",
	"sScrollFoot": "dataTables_scrollFoot "+"ui-state-default",

	/* Misc */
	"sHeaderTH":  "ui-state-default",
	"sFooterTH":  "ui-state-default"
} );


DataTable.ext.renderer.header.jqueryui = function ( settings, cell, column, classes ) {
	// Calculate what the unsorted class should be
	var noSortAppliedClass = sort_prefix+'carat-2-n-s';
	var asc = $.inArray('asc', column.asSorting) !== -1;
	var desc = $.inArray('desc', column.asSorting) !== -1;

	if ( !column.bSortable || (!asc && !desc) ) {
		noSortAppliedClass = '';
	}
	else if ( asc && !desc ) {
		noSortAppliedClass = sort_prefix+'carat-1-n';
	}
	else if ( !asc && desc ) {
		noSortAppliedClass = sort_prefix+'carat-1-s';
	}

	// Setup the DOM structure
	$('<div/>')
		.addClass( 'DataTables_sort_wrapper' )
		.append( cell.contents() )
		.append( $('<span/>')
			.addClass( classes.sSortIcon+' '+noSortAppliedClass )
		)
		.appendTo( cell );

	// Attach a sort listener to update on sort
	$(settings.nTable).on( 'order.dt', function ( e, ctx, sorting, columns ) {
		if ( settings !== ctx ) {
			return;
		}

		var colIdx = column.idx;

		cell
			.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
			.addClass( columns[ colIdx ] == 'asc' ?
				classes.sSortAsc : columns[ colIdx ] == 'desc' ?
					classes.sSortDesc :
					column.sSortingClass
			);

		cell
			.find( 'span.'+classes.sSortIcon )
			.removeClass(
				sort_prefix+'triangle-1-n' +" "+
				sort_prefix+'triangle-1-s' +" "+
				sort_prefix+'carat-2-n-s' +" "+
				sort_prefix+'carat-1-n' +" "+
				sort_prefix+'carat-1-s'
			)
			.addClass( columns[ colIdx ] == 'asc' ?
				sort_prefix+'triangle-1-n' : columns[ colIdx ] == 'desc' ?
					sort_prefix+'triangle-1-s' :
					noSortAppliedClass
			);
	} );
};


/*
 * TableTools jQuery UI compatibility
 * Required TableTools 2.1+
 */
if ( DataTable.TableTools ) {
	$.extend( true, DataTable.TableTools.classes, {
		"container": "DTTT_container ui-buttonset ui-buttonset-multi",
		"buttons": {
			"normal": "DTTT_button ui-button ui-state-default"
		},
		"collection": {
			"container": "DTTT_collection ui-buttonset ui-buttonset-multi"
		}
	} );
}

}; // /factory


// Define as an AMD module if possible
if ( typeof define === 'function' && define.amd ) {
	define( ['jquery', 'datatables'], factory );
}
else if ( typeof exports === 'object' ) {
    // Node/CommonJS
    factory( require('jquery'), require('datatables') );
}
else if ( jQuery ) {
	// Otherwise simply initialise as normal, stopping multiple evaluation
	factory( jQuery, jQuery.fn.dataTable );
}


})(window, document);
