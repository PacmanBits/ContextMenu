/*
//////////////////////////////////////////////////
//                                              //
//                                              //
//    ContextMenu            Sanford Gifford    //
//                              May 18, 2015    //
//                                              //
//                                              //
//////////////////////////////////////////////////

jQuery extension for adding contextual menus to
jQuery objects.

1.1.1
	- Script no longer hides default right click
	automatically

1.1
	- Added support for section bars
	- Added support for greyed out items
1.0
	- Initial release
*/

// TODO: this file has a boring name.  Snazz it up.

(function($)
{
	var defaultOptions = {
		menuClassName         : "contextMenu"     ,
		menuItemClassName     : "contextMenuItem" ,
		menuBarClassName      : "contextMenuBar"  ,
		disabledItemClassName : "disabledItem"
	};
	
	var body;
	var menu = null;
	
	$(function()
	{
		body = $("body");
	});
	
	
	function preventDefaultContextMenu(e)
	{
		e.preventDefault();
		
		return false;
	}
	
	function removeMenu()
	{
		menu.remove();
		menu = null;
		
		body.unbind("click", removeMenu);
	}
	
	$.ContextMenu    = {}; // General ("static") methods
	
	$.ContextMenu.turnDefaultContextMenuOn = function()
	{
		$.ContextMenu.toggleDefaultContextMenu(true);
	}
	
	$.ContextMenu.turnDefaultContextMenuOff = function()
	{
		$.ContextMenu.toggleDefaultContextMenu(false);
	}
	
	$.ContextMenu.toggleDefaultContextMenu = function(on)
	{
		console.log("Turning default context menu " + (on ? "on" : "off"));
		if(on)
			body.unbind("contextmenu", preventDefaultContextMenu);
		else
			body.on("contextmenu", preventDefaultContextMenu);
	}
	
	$.fn.ContextMenu = function(items, options)
	{
		var opts = $.extend({}, defaultOptions, options);
		
		this.on("contextmenu", function(e)
		{
			if(menu != null)
				removeMenu();
			
			menu = $("<div>")
				.addClass(opts.menuClassName)
				.appendTo(body)
				.css({
					"position"   : "absolute",
					"z-index"    : "9999"
				});
			
			for(var i in items)
			{
				switch(typeof items[i])
				{
					case "string":
						switch(items[i])
						{
							case "bar":
								$("<div>")
									.addClass(opts.menuBarClassName)
									.appendTo(menu);
								break;
						}
						break;
					case "object":
						if(items[i].action)
							$("<div>")
								.addClass(opts.menuItemClassName)
								.appendTo(menu)
								.text(items[i].text)
								.click(items[i].action);
						else
							$("<div>")
								.addClass(opts.menuItemClassName)
								.addClass(opts.disabledItemClassName)
								.appendTo(menu)
								.text(items[i].text);
						break;
				}
			}
			
			var pos = {
				x : e.pageX,
				y : e.pageY
			};
			
			if(pos.x + menu.outerWidth() > body.width())
				pos.x = body.width() - menu.outerWidth();
			
			if(pos.y + menu.outerHeight() > body.height())
				pos.y = body.height() - menu.outerHeight();
			
			menu.css({
				"left" : pos.x + "px",
				"top"  : pos.y + "px"
			});
			
			body.click(removeMenu);
			
			return false;
		});
		
		return this;
	}
})(jQuery);
