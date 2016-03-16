/*
 * Flexigrid for jQuery - New Wave Grid
 *
 * Copyright (c) 2008 Paulo P. Marinas (webplicity.net/flexigrid)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-07-14 00:09:43 +0800 (Tue, 14 Jul 2008) $
 *
 * updated by david.yu at darwinmarketing.com
 */

(function($) {

	// global $.flexigrid function
	$.flexigrid = function(table, settings) {
		var $table = $(table);

		// return if grid already exist
		if ($table.data('grid')) {
			return false;
		}

		// apply default properties
		settings = $.extend({
			// ajax url
			url: false,
			method: 'POST',
			// default height
			height: 300,
			// auto width
			width: 'auto',
			// apply odd even stripes
			striped: true,
			fixedTableHeight: false,
			novstripe: false,
			// min width of columns
			minWidth: 50,
			// min height of columns
			minHeight: 150,
			// TODO: plugins
			// show or hide column toggle popup
			// plugins: ['showCheckboxes', 'showToggleBtn', 'rowEditor'],
			plugins: [],
			// resizable table
			resizable: false,
			errorMessage: 'Connection Error',
			nowrap: true,
			// current page
			page: 1,
			// total pages
			total: 1,
			usePager: false,
			// use the results per page select box
			usePerPage: false,
			// results per page
			perPage: 10,
			perPageOptions: [10],
			// only select one row when click on row
			singleSelect: true,
			// json array
			searchItems: false,
			// result filters like searchItems, but more customize, filters value can be an CSS selector of a form or HTML form string which will enclosed by jQuery
			filters: false,
            appendFilters: false,
			title: false,
			pageState: 'Displaying {from} to {to} of {total} items',
			pagePrefix: 'Page',
			pageOf: 'of',
			pageSuffix: '',
			findText: 'Find',
			processMessage: 'Processing, please wait ...',
			query: '',
			qtype: '',
			noItemsMessage: 'No items',
			tdDivClassName: 'flexigridCell',
			// table headers should be json array
			colModel: false,
			// close table
			showTableCloseBtn: false,
			// toggle table
			showTableToggleBtn: false,
			// table thead.div text-align
			// 'center', 'left', 'right', default using colModel align,
			theadAlign: false,
			colDraggable: true,
			autoload: true,
			blockOpacity: 0.3,
			// below method are callbacks, must be a function.
			// onPopulate -> dataProcess -> onSuccess
			onPopulate: $.noop,
			dataProcess: $.noop,
			onSuccess: $.noop,
			onToggleCol: $.noop,
			onChangeSort: $.noop,
			onPerPageChange: $.noop,
			onClosed: $.noop,
			onError: function() {
				throw 'ajax request has error or json parse failure';
			}
		},
		settings);

		// show if hidden
		// remove padding and spacing
		// remove width properties
		$table.show().attr({
			cellPadding: 0,
			cellSpacing: 0,
			border: 0
		}).removeAttr('width');

		// delegate table row event.
		$table.delegate('tr', 'click', function(e) {
			var elem = e.target;
			if (elem.href || elem.type) {
				return true;
			}

			$(this).toggleClass('trSelected');
			if (settings.singleSelect) {
				$(this).siblings().removeClass('trSelected');
			}
		});
		if ($.browser.msie && $.browser.version < 7.0) {
			$table.delegate('tr', 'hover', function() {
				$(this).toggleClass('trOver');
			});
		}

		var setCellContent = function(index, row) {
			// this is "TD" element.
			$(this).addClass('flexigridColumn_' + index);
			if ($.isArray(row.cell)) {
				this.innerHTML = row.cell[index];
			} else {
				var colModelName = settings.colModel && settings.colModel[index] && settings.colModel[index].name;
				this.innerHTML = colModelName && row.cell[colModelName] !== undefined ? row.cell[colModelName] : '';
			}
		},
		triggerButtonPress = function(btnDiv, btn) {
			// override btnDiv and btn prevend for those variables be changed by loop.
			return function() {
				btn.onpress.call(btnDiv, table, settings);
			};
		},
		// create grid class
		grid = {
			rePosDrag: function() {
                $('div', grid.cDrag).hide();
				if (!settings.colDraggable) {
					return false;
                }

				// below code run slowly, can set colDraggable to false avoid run these code.
				var bDivBorderLeftWidth = parseInt(this.bDiv.css('borderLeftWidth'), 10),
				hDivTopBorderWidth = parseInt(grid.hDiv.css('borderTopWidth'), 10),
				bDivOffsetLeft = this.bDiv.offset().left + bDivBorderLeftWidth,
				hDivOffsetTop = grid.hDiv[0].offsetTop + hDivTopBorderWidth;

				// if some th be set visible, should call this method to reset grid.cDrag
				$('thead tr:first th:visible', this.flexigridDiv).each( function(n, thead) {
					var $this = $(this),
					offset = $this.offset(),
					outerWidth = $this.outerWidth(),
					thBorderRightWidth = parseInt($this.css('borderRightWidth'), 10),
					// draflexigridDiv should override th right border
					draflexigridDivLeftPos = offset.left + outerWidth - bDivOffsetLeft - thBorderRightWidth;

					$('div:eq(' + n + ')', grid.cDrag).css({
						top: hDivOffsetTop,
						left: draflexigridDivLeftPos,
						display: ''
					});
				});
			},
			fixHeight: function() {
				var newH, hdHeight = this.hDiv.height();

				if (!settings.fixedTableHeight) {
					// if bDiv has a hidden parent, $table.heigth() will get value 0, so we set height of bDiv as 'auto'
					// this.bDiv.height($table.height());
					this.bDiv.height('auto');
					
					// fix bDiv scroll-y in order to hidden overflow-y
					if (this.bDiv[0].scrollHeight > this.bDiv[0].clientHeight) {
						this.bDiv.height( function() {
							if ($.browser.opera) {
								return this.scrollHeight;
							} else {
								var height = $(this).height(),
								scrollbarHeight = this.scrollHeight - this.clientHeight;
								return height + scrollbarHeight;
							}
						});
					}
				}

				// use clientHeight, don't use height because of scrollbar.
				newH = this.bDiv[0].clientHeight;
				$('div', this.cDrag).height(newH + hdHeight);
				grid.block.css({
					height: newH,
					marginBottom: (newH * - 1)
				});
			},
			toggleCol: function(columnId, visible) {
				var ncol = $("th[axis='col" + columnId + "']", this.flexigridDiv),
				n = $('thead th', grid.flexigridDiv).index(ncol[0]);

				if (visible === null) {
					visible = ncol.data('hide');
				}

				if (visible) {
					ncol.data('hide', false);
					ncol.show();
				} else {
					ncol.data('hide', true);
					ncol.hide();
				}

				$('tbody tr', table).each( function() {
					if (visible) {
						$('td:eq(' + n + ')', this).show();
					} else {
						$('td:eq(' + n + ')', this).hide();
					}
				});
				this.rePosDrag();
				settings.onToggleCol.call(ncol, columnId, visible);
				return ncol;
			},
			addData: function(data) {
				// parse data and if return result as data.
				settings.dataProcess.call(table, data);

				$('.pReload', this.pDiv).removeClass('loading');
				this.loading = false;

				if (!data) {
					$('.pPageStat', this.pDiv).html(settings.errorMessage);
					return false;
				}

				settings.total = data.total;

				if (settings.total === 0) {
					$table.find('tbody').empty();
					settings.pages = 1;
					settings.page = 1;
					this.buildPager();
					$('.pPageStat', this.pDiv).html(settings.noItemsMessage);
					grid.block.remove();
					return false;
				}

				settings.pages = Math.ceil(settings.total / settings.perPage);

				settings.page = data.page;

				this.buildPager();

				// build new body
				var tbody = $('<tbody>');

				$.each(data.rows, function(i, row) {
					var tr = $('<tr>'), idx;
					if (i % 2 && settings.striped) {
						tr.addClass('erow');
					}

					// notice "+" prior to "||"
					tr.attr('id', 'row_' + (row.id || i));

					// add cell
					$('thead tr:first th', grid.flexigridDiv).each( function(index, th) {
						var td = $('<td>');
						td.attr('align', this.align);
						setCellContent.call(td[0], index, row);
						tr.append(td);
					});
					// handle if grid has no headers
					if ($('thead', this.flexigridDiv).length === 0) {
						// $.console.log("handle if grid has no headers");
						for (idx = 0; idx < row.cell.length; idx++) {
							var td = $('<td');
							setCellContent.call(td[0], idx, row);
							tr.append(td);
						}
					}

					tbody.append(tr);
				});
				$table.find('tbody').remove();
				$table.append(tbody);
				this.addCellProp();
				data = null;

				grid.block.remove();

				scrollHDivWithTbody();
				if ($.browser.opera) {
					$table.css('visibility', 'visible');
				}

				// re-calculate position and height of cDrag's divs after height of tableContainer changed.
				grid.rePosDrag();
			},
			changeSort: function(th) {
				// change sortorder by ajax.
				if (!settings.url || this.loading) {
					return true;
				}

				if (settings.sortname === $(th).attr('abbr')) {
					if (settings.sortorder === 'asc') {
						settings.sortorder = 'desc';
					} else {
						settings.sortorder = 'asc';
					}
				}

				$(th).addClass('sorted').siblings().removeClass('sorted');
				$('.sdesc', this.flexigridDiv).removeClass('sdesc');
				$('.sasc', this.flexigridDiv).removeClass('sasc');
				$('div', th).addClass('s' + settings.sortorder);
				settings.sortname = $(th).attr('abbr');

				settings.onChangeSort.call(table, settings.sortname, settings.sortorder);
				this.populate();
			},
			buildPager: function() { // rebuild pager based on new properties
				$('.pcontrol input', this.pDiv).val(settings.page);
				$('.pcontrol span', this.pDiv).html(settings.pages);

				var r1 = (settings.page - 1) * settings.perPage + 1;
				var r2 = r1 + settings.perPage - 1;

				if (settings.total < r2) {
					r2 = settings.total;
				}

				var stat = settings.pageState;

				stat = stat.replace(/\{from\}/, r1);
				stat = stat.replace(/\{to\}/, r2);
				stat = stat.replace(/\{total\}/, settings.total);

				$('.pPageStat', this.pDiv).html(stat);
			},
			populate: function() {
				// get latest data
				if (this.flexigridDiv.css('display') === 'none') {
					this.flexigridDiv.css('display', 'block');
				}

				if (this.loading) {
					return true;
				}

				this.loading = true;
				// render exists tables in DOM, not load table from ajax.
				if (!settings.url) {
					return false;
				}

				// custom define grid populate method, and will continue execute if return not true.
				// onPopulate callback is useful to add event listener for elements of this flexigrid.
				var op = settings.onPopulate.call(table);

				if (op === true) {
					return false;
				}

				// begining populate and show processing message
				$('.pPageStat', this.pDiv).html(settings.processMessage);

				$('.pReload', this.pDiv).addClass('loading');

				grid.block.css({
					top: grid.bDiv[0].offsetTop
				});
				this.flexigridDiv.prepend(grid.block);

				if ($.browser.opera) {
					$table.css('visibility', 'hidden');
				}

				settings.newPage = settings.newPage || 1;

				if (settings.page > settings.pages) {
					settings.page = settings.pages;
				}

				var param = [{
					name: 'page',
					value: settings.newPage
				},{
					name: 'perpage',
					value: settings.perPage
				},{
					name: 'sortname',
					value: settings.sortname
				},{
					name: 'sortorder',
					value: settings.sortorder
				},{
					name: 'query',
					value: settings.query
				},{
					name: 'qtype',
					value: settings.qtype
				}];

				// for customized form filters, reset settings.params using form.serializeArray()
				if (settings.filters) {
					param = param.concat($(settings.filters).serializeArray());
				}
				if (settings.params) {
					var pi;
					for (pi = 0; pi < settings.params.length; pi++) {
						param[param.length] = settings.params[pi];
					}
				}

				$.ajax({
					type: settings.method,
					url: settings.url,
					data: param,
					dataType: 'json',
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					success: function(data) {
						grid.addData(data);
						if (settings.plugins.length) {
							$.each(settings.plugins, function() {
								$.flexigrid.plugins[this].call(table, settings);
							});
						}
						settings.onSuccess.call(table);
						// table height maybe change after callback of onSuccess, fixHeight should run after onSuccess
						grid.fixHeight();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						settings.onError.call(table, XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},
			doSearch: function() {
				settings.query = $('input[name=q]', grid.sDiv).val();
				settings.qtype = $('select[name=qtype]', grid.sDiv).val();
				settings.newPage = 1;

				this.populate();
				$('input[name=q]', grid.sDiv).val('');
				settings.query = '';
			},
			changePage: function(ctype) { // change page
				if (this.loading) {
					return true;
				}

				switch (ctype) {
					case 'first':
						settings.newPage = 1;
						break;
					case 'prev':
						if (settings.page > 1) {
							settings.newPage = parseInt(settings.page, 10) - 1;
						}
						break;
					case 'next':
						if (settings.page < settings.pages) {
							settings.newPage = parseInt(settings.page, 10) + 1;
						}
						break;
					case 'last':
						settings.newPage = settings.pages;
						break;
					case 'input':
						var nv = parseInt($('.pcontrol input', this.pDiv).val(), 10);
						if (isNaN(nv) || nv < 1) {
							nv = 1;
						} else if (nv > settings.pages) {
							nv = settings.pages;
						}
						$('.pcontrol input', this.pDiv).val(nv);
						settings.newPage = nv;
						break;
				}

				if (settings.newPage === settings.page) {
					return false;
				}

				if (settings.onChangePage) {
					settings.onChangePage.call(table, settings.newPage);
				}
				this.populate();
			},
			addCellProp: function() {
				// this method is very slow.
				$('tbody tr td', grid.bDiv).each( function() {
					var tdDiv = $('<div>');
					var n = $('td', $(this).parent()).index(this);
					var pth = $('th:eq(' + n + ')', grid.flexigridDiv).get(0);

					if (pth) {
						if (settings.sortname === $(pth).attr('abbr') && settings.sortname) {
							this.className = 'sorted';
						}
						tdDiv.addClass(settings.tdDivClassName).css({
							textAlign: pth.align,
							width: $('div:first', pth)[0].style.width
						});

						if ($(pth).data('hide')) {
							$(this).css('display', 'none');
						}
					} else {
						// $table without thead
						tdDiv.css({
							minWidth: settings.minWidth
						});
					}

					if (settings.nowrap === false) {
						tdDiv.css('white-space', 'normal');
					}

					tdDiv.html(this.innerHTML || '&nbsp;');

					var row = $(this).parent();
					var pid = false;
					if (row.attr('id')) {
						pid = row.attr('id').substr(3);
					}

					$(this).empty().append(tdDiv).removeAttr('width'); // wrap content
				});
			},
            errorClean: function() {
                this.loading = false;
                this.block.remove();
                $('.pReload', this.pDiv).removeClass('loading');
                $('.pPageStat', this.pDiv).html(settings.errorMessage);
            },
			pager: 0
		},
        // end grid

		scrollHDivWithTbody = function() {
			// if table fixed height will move thead to hDiv, and when scroll tbody's scroll bar, should set hDiv's scrollLeft.
			// this method is very slow, please check by firebug's profiler and chrome's profiles.
			if (settings.fixedTableHeight) {
				grid.hDiv[0].scrollLeft = grid.bDiv[0].scrollLeft;
			}
		},
		// drag methods should not expose to library user.
		dragStart = function(e) {
			// column resize
			$('body').css('cursor', 'col-resize');
			$('body').noSelect();

			var n = $('div', grid.cDrag).index(this);
			var ow = $('th:visible:eq(' + n + ') div:first', grid.flexigridDiv).width();
			$(this).addClass('dragging').siblings().hide();
			$(this).prev().addClass('dragging').show();

			grid.colresize = {
				startX: e.pageX,
				ol: parseInt(this.style.left, 10),
				ow: ow,
				n: n
			};
			// $.console.log(grid.colresize.ow);
		},
		dragMove = function(e) {
			// column resize
			if (grid.colresize) {
				var n = grid.colresize.n,
				nleft, nw;
				var diff = e.pageX - grid.colresize.startX;
				nleft = grid.colresize.ol + diff;
				nw = grid.colresize.ow + diff;
				// $.console.log(grid.colresize.ow, diff);
				if (nw > settings.minWidth) {
					$('div:eq(' + n + ')', grid.cDrag).css('left', nleft);
					grid.colresize.nw = nw;
				}
			}
		},
		dragEnd = function(e) {
			if (grid.colresize) {
				var n = grid.colresize.n;
				var nw = grid.colresize.nw;

				$('th:visible:eq(' + n + ') div:first', grid.flexigridDiv).css('width', nw);
				$('tr', grid.bDiv).each( function() {
					$('td:visible:eq(' + n + ') div:first', this).css('width', nw);
				});
				scrollHDivWithTbody();

				$('div:eq(' + n + ')', grid.cDrag).siblings().show();
				$('.dragging', grid.cDrag).removeClass('dragging');
				grid.rePosDrag();
				// horizon scroll bar maybe dispear after column drag
				grid.fixHeight();
				grid.colresize = false;
				$('body').css('cursor', 'default');
				$('body').noSelect(false);
			}
		},
		thead,
		ci,
		tr,
		i;

		// add document events
		$(document).mousemove(dragMove).mouseup(dragEnd);

		// init divs
		grid.flexigridDiv = $('<div>'); // create global container
		grid.mDiv = $('<div>'); // create title container
		grid.hDiv = $('<div>'); // create header container
		grid.bDiv = $('<div>'); // create body container
		grid.cDrag = $('<div>'); // create column drag
		grid.block = $('<div>'); // creat blocker
		grid.tDiv = $('<div>'); // create toolbar
		grid.sDiv = $('<div>'); // create search form container
		if (settings.url && settings.usePager) {
			// create pager container for ajax flexigrid
			grid.pDiv = $('<div>');
		}
		// create model if any
		if (settings.colModel) {
			thead = $('<thead>');
			tr = $('<tr>');
			for (i = 0; i < settings.colModel.length; i++) {
				var cm = settings.colModel[i];
				var th = $('<th>');

				th.html(cm.display);
				cm.name = cm.name || cm.fieldName;

				if (cm.name && cm.sortable) {
					th.attr('abbr', cm.name);
				}

				th.attr('axis', 'col' + i);

				th.attr('align', cm.align || 'center');
				// default col width is 100px
				th.attr('width', cm.width || 100);

				if (cm.hide) {
					th.data('hide', true);
				}

				tr.append(th);
			}
			thead.append(tr);
			$table.prepend(thead);
		} else {
			ci = 0;
		}
		// end if settings.colModel
		// set flexigridDiv
		grid.flexigridDiv.addClass('flexigrid');
		if (settings.width !== 'auto') {
			grid.flexigridDiv.width(settings.width);
		}

		// ad conditional classes
		if ($.browser.msie) {
			grid.flexigridDiv.addClass('ie');
		}

		if (settings.novstripe) {
			grid.flexigridDiv.addClass('novstripe');
		}

		// add flexigridDiv to DOM and append table to flexigridDiv
		$table.before(grid.flexigridDiv);
		grid.flexigridDiv.append(table);

		// set toolbar
		if (settings.buttons) {
			grid.tDiv.addClass('tDiv');
			var tDiv2 = $('<div>'),
			addFbOver = function() {
				$(this).addClass('fbOver');
			},
			removeFbOver = function() {
				$(this).removeClass('fbOver');
			};
			tDiv2.addClass('tDiv2');

			for (i = 0; i < settings.buttons.length; i++) {
				var btn = settings.buttons[i];
				if (!btn.separator) {
					var btnDiv = $('<div>');
					btnDiv.addClass('fbutton');
					// btnDiv.attr('name', btn.name);
					btnDiv.html('<div><span>' + btn.name + '</span></div>');
					if (btn.bclass) {
						$('span', btnDiv).addClass(btn.bclass).css({
							paddingLeft: 20
						});
					}
					if ($.isFunction(btn.onpress)) {
						btnDiv.click(triggerButtonPress(btnDiv, btn));
					}
					tDiv2.append(btnDiv);
					if ($.browser.msie && $.browser.version < 7.0) {
						btnDiv.hover(addFbOver, removeFbOver);
					}
				} else {
					tDiv2.append("<div class='btnseparator'></div>");
				}
			}
			grid.tDiv.append(tDiv2);
			grid.tDiv.append("<div style='clear:both'></div>");
			grid.flexigridDiv.prepend(grid.tDiv);
		}

		// set hDiv
		grid.hDiv.addClass('hDiv');
		$table.before(grid.hDiv);

		// set hTable for fixed table's thead and fixed table height.
		if (settings.fixedTableHeight) {
			grid.hTable = $('<table>');
			grid.hTable.attr('cellPadding', 0);
			grid.hTable.attr('cellSpacing', 0);
			grid.hDiv.append('<div class="hDivBox"></div>');
			$('div', grid.hDiv).append(grid.hTable);
			grid.hTable.append($('thead:first', table));
			grid.hDiv.css({'background': '#FAFAFA url(/images/flexigrid/fhbg.gif) repeat-x'});
		} else {
			// below code hack for IE6
			grid.hDiv.height(0);
			grid.bDiv.css('background', '#FAFAFA url(/images/flexigrid/fhbg.gif) repeat-x');
		}

		// setup thead
		$('thead tr:first th', grid.flexigridDiv).each( function() {
			var thdiv = $('<div>');

			if ($(this).attr('abbr')) {
				$(this).click( function(e) {
					if (!$(this).hasClass('thOver')) {
						return false;
					}
					var elem = e.target;
					if (elem.href || elem.type) {
						return true;
					}
					grid.changeSort(this);
				});
				if ($(this).attr('abbr') === settings.sortname) {
					this.className = 'sorted';
					thdiv.addClass('s' + settings.sortorder);
				}
			}

			if ($(this).data('hide')) {
				$(this).hide();
			}

			if (!settings.colModel) {
				$(this).attr('axis', 'col' + ci++);
			}

			// thead text align using theadAlign or th.align
			thdiv.addClass(settings.tdDivClassName).css({
				width: this.width + 'px',
				textAlign: settings.theadAlign || this.align
			});
			thdiv.html(this.innerHTML);

			$(this).empty().append(thdiv).removeAttr('width').hover( function() {
				if (!grid.colresize) {
					$(this).addClass('thOver');
				}

				if ($(this).attr('abbr') !== settings.sortname && ! grid.colresize && $(this).attr('abbr')) {
					$('div', this).addClass('s' + settings.sortorder);
				} else if ($(this).attr('abbr') === settings.sortname && ! grid.colresize && $(this).attr('abbr')) {
					var no = '';
					if (settings.sortorder === 'asc') {
						no = 'desc';
					} else {
						no = 'asc';
					}
					$('div', this).removeClass('s' + settings.sortorder).addClass('s' + no);
				}
			}, function() {
				$(this).removeClass('thOver');
				if ($(this).attr('abbr') !== settings.sortname) {
					$('div', this).removeClass('s' + settings.sortorder);
				} else if ($(this).attr('abbr') === settings.sortname) {
					var no = '';
					if (settings.sortorder === 'asc') {
						no = 'desc';
					} else {
						no = 'asc';
					}

					$('div', this).addClass('s' + settings.sortorder).removeClass('s' + no);
				}
			}); // wrap content
		});
		// set bDiv and append bDiv before table, then appent table to bDiv.
		grid.bDiv.addClass('bDiv');
		$table.before(grid.bDiv);
		grid.bDiv.css({
			height: (settings.height === 'auto') ? 'auto' : settings.height + 'px'
		}).scroll( function() {
			scrollHDivWithTbody();
			grid.rePosDrag();
		}).append(table);
		if (settings.height === 'auto') {
			$('table', grid.bDiv).addClass('autoht');
		}

		// add td properties
		grid.addCellProp();

		// set cDrag
		grid.cDrag.addClass('cDrag').css({
			top: 0
		});
		grid.bDiv.before(grid.cDrag);

		$('thead tr:first th', grid.flexigridDiv).each( function() {
			var dragDiv = $('<div>').css('display', 'none');
			grid.cDrag.append(dragDiv);
			dragDiv.mousedown(dragStart);
		});
		// add strip
		if (settings.striped) {
			$('tbody tr:odd', grid.bDiv).addClass('erow');
		}

		// add pager
		if (settings.url && settings.usePager) {
			grid.pDiv.addClass('pDiv');
			grid.pDiv.html('<div class="pDiv2"></div>');
			grid.bDiv.after(grid.pDiv);

			var html = '<div class="pGroup"><div class="pFirst pButton"><span></span></div><div class="pPrev pButton"><span></span></div></div><div class="btnseparator"></div><div class="pGroup"><div class="pcontrol">' + settings.pagePrefix + '<input type="text" size="4" value="1" />' + settings.pageOf + ' <span> 1 </span>' + settings.pageSuffix + '</div></div><div class="btnseparator"></div><div class="pGroup"><div class="pNext pButton"><span></span></div><div class="pLast pButton"><span></span></div></div><div class="btnseparator"></div><div class="pGroup"><div class="pReload pButton"><span></span></div></div><div class="btnseparator"></div><div class="pGroup"><div class="pPageStat"></div></div>';
			$('div', grid.pDiv).html(html);

			$('.pReload', grid.pDiv).click( function() {
				grid.populate();
			});
			$('.pFirst', grid.pDiv).click( function() {
				grid.changePage('first');
			});
			$('.pPrev', grid.pDiv).click( function() {
				grid.changePage('prev');
			});
			$('.pNext', grid.pDiv).click( function() {
				grid.changePage('next');
			});
			$('.pLast', grid.pDiv).click( function() {
				grid.changePage('last');
			});
			$('.pcontrol input', grid.pDiv).keydown( function(e) {
				if (e.keyCode === 13) {
					grid.changePage('input');
				}
			});
			if ($.browser.msie && $.browser.version < 7) {
				$('.pButton', grid.pDiv).hover( function() {
					$(this).addClass('pBtnOver');
				}, function() {
					$(this).removeClass('pBtnOver');
				});
			}

			if (settings.usePerPage) {
				var opt = '', selectedPerPage = '', nx;
				for (nx = 0; nx < settings.perPageOptions.length; nx++) {
					if (settings.perPage === settings.perPageOptions[nx]) {
						selectedPerPage = ' selected';
					} else {
						selectedPerPage = '';
					}
					opt += "<option value='" + settings.perPageOptions[nx] + "'" + selectedPerPage + ' >' + settings.perPageOptions[nx] + '</option>';
				}
				$('.pDiv2', grid.pDiv).prepend("<div class='pGroup'><select name='perpage'>" + opt + "</select></div><div class='btnseparator'></div>");
				$('select', grid.pDiv).change( function() {
					settings.newPage = 1;
					settings.perPage = + this.value;
					settings.onPerPageChange.call(table, + this.value);
					grid.populate();
				});
			}

			// priority of customize filters great than priority of searchItems
			if (settings.filters) {
                if (settings.appendFilters) {
                    $('.pDiv2', grid.pDiv).prepend("<div class='pGroup'><div class='pSearch pButton'><span></span></div></div><div class='btnseparator'></div>");
                    $('.pSearch', grid.pDiv).click( function() {
                        grid.sDiv.slideToggle('fast', function() {
                            $('.sDiv:visible input:first', grid.flexigridDiv).trigger('focus');
                        });
                    });
                    // add filter box
                    grid.sDiv.addClass('fDiv').append($(settings.filters));
                    grid.pDiv.after(grid.sDiv);
                }

				$(settings.filters).submit( function() {
					settings.newPage = 1;
					// $(table).flexReload();
					grid.populate();
					return false;
				});
			} else if (settings.searchItems) {
				// add search button
				$('.pDiv2', grid.pDiv).prepend("<div class='pGroup'><div class='pSearch pButton'><span></span></div></div><div class='btnseparator'></div>");
				$('.pSearch', grid.pDiv).click( function() {
					grid.sDiv.slideToggle('fast', function() {
						$('.sDiv:visible input:first', grid.flexigridDiv).trigger('focus');
					});
				});
				// add search box
				grid.sDiv.addClass('sDiv');

				var sitems = settings.searchItems, sopt = '',
				selectedSearchItem = '', s;
				for (s = 0; s < sitems.length; s++) {
					if (settings.qtype === '' && sitems[s].selected === true) {
						settings.qtype = sitems[s].name;
						selectedSearchItem = ' selected';
					} else {
						selectedSearchItem = '';
					}
					sopt += "<option value='" + sitems[s].name + "'" + selectedSearchItem + ' >' + sitems[s].display + '</option>';
				}

				if (settings.qtype === '') {
					settings.qtype = sitems[0].name;
				}

				grid.sDiv.append("<div class='sDiv2'>" + settings.findText + " <input type='text' size='30' name='q' class='qsbox' /><select name='qtype'>" + sopt + "</select><input type='button' value='Search' /></div>");

				$('input[name=q],select[name=qtype]', grid.sDiv).keydown( function(e) {
					if (e.keyCode === 13) {
						grid.doSearch();
					}
				});
				$('input:button', grid.sDiv).click( function() {
					grid.doSearch();
				});
				grid.bDiv.after(grid.sDiv);
			}
		}
		// end add pager
		$(grid.pDiv, grid.sDiv).append("<div style='clear:both'></div>");

		// add title
		if (settings.title) {
			grid.mDiv.addClass('mDiv');
			grid.mDiv.html('<div class="ftitle">' + settings.title + '</div>');
			grid.flexigridDiv.prepend(grid.mDiv);
			if (settings.showTableToggleBtn) {
				grid.mDiv.append('<div class="ptogtitle" title="Minimize/Maximize Table"><span></span></div>');
				$('div.ptogtitle', grid.mDiv).click( function() {
					grid.flexigridDiv.toggleClass('hideBody');
					$(this).toggleClass('vsble');
				});
			}
			// david.yu add close button
			if (settings.showTableCloseBtn) {
				grid.mDiv.append('<div class="ptableclose" title="Close Table"><span></span></div>');
				$('div.ptableclose', grid.mDiv).click( function() {
					grid.flexigridDiv.slideUp();
					settings.onClosed.call(table);
				});
			}
		}

		// add block
		grid.block.addClass('gBlock');
		var gh = grid.bDiv.height();
		var gtop = grid.bDiv[0].offsetTop;
		grid.block.css({
			width: grid.bDiv.width(),
			height: gh,
			background: 'black',
			position: 'relative',
			marginBottom: (gh * - 1),
			zIndex: 1,
			top: gtop,
			left: '0px'
		});
		grid.block.fadeTo(0, settings.blockOpacity);

		// browser adjustments
		if ($.browser.msie && $.browser.version < 7.0) {
			$('.hDiv,.bDiv,.mDiv,.pDiv,.tDiv,.sDiv', grid.flexigridDiv).css({
				width: '100%'
			});
			grid.flexigridDiv.addClass('ie6');
			if (settings.width !== 'auto') {
				grid.flexigridDiv.addClass('ie6fullwidthbug');
			}
		}

		grid.rePosDrag();
		// make grid functions accessible
		$table.data('settings', settings);
		$table.data('grid', grid);

		// load data
		if (settings.url && settings.autoload) {
			grid.populate();
		} else {
			grid.fixHeight();
		}

		return $table;
	};
	// end $.flexigrid function

	// flexigrid definition
	$.fn.flexigrid = function(settings) {
		return this.each( function() {
			var table = this;
			$(table).ready( function() {
				$.flexigrid(table, settings);
			});
		});
	}; // end flexigrid
	$.fn.flexReload = function(settings) {
		// function to reload grid
		return this.each( function() {
			var $table = $(this);
			if ($table.data('grid')) {
				$.extend($table.data('settings'), settings);
				if ($table.data('grid') && $table.data('settings').url) {
					$table.data('grid').populate();
				}
			} else {
				// flexigrid not exists
				$table.flexigrid(settings);
			}
		});
	}; // end flexReload
	$.fn.flexOptions = function(settings) {
		// function to update general options
		return this.each( function() {
			var $table = $(this);
			if ($table.data('grid')) {
				// update $table.data('settings'), don't use $table.data('settings', $.extend(...)) to reset cache
				// it will lost original object reference.
				$.extend($table.data('settings'), settings);
			}
		});
	}; // end flexOptions
	$.fn.flexToggleCol = function(columnId, visible) {
		// function to toggle column
		return this.each( function() {
			var $table = $(this);
			if ($table.data('grid')) {
				$table.data('grid').toggleCol(columnId, visible);
			}
		});
	}; // end flexToggleCol
	$.fn.flexAddData = function(data) {
		// function to add data to grid, data must be json object, not string.
		return this.each( function() {
			var $table = $(this);
			if ($table.data('grid')) {
				$table.data('grid').addData(data);
				$table.data('settings').onSuccess.call(this);
			}
		});
	};
	// no select plugin by flexigrid author(Paulo P. Marinas)
	$.fn.noSelect = function(arg) {
		var prevent = arg === undefined ? true : arg;

		if (prevent) {
			return this.each( function() {
				if ($.browser.msie || $.browser.safari) {
					$(this).bind('selectstart', function() {
						return false;
					});
				} else if ($.browser.mozilla) {
					$(this).css('MozUserSelect', 'none');
					$('body').trigger('focus');
				} else if ($.browser.opera) {
					$(this).bind('mousedown', function() {
						return false;
					});
				} else {
					$(this).attr('unselectable', 'on');
				}
			});
		} else {
			return this.each( function() {
				if ($.browser.msie || $.browser.safari) {
					$(this).unbind('selectstart');
				} else if ($.browser.mozilla) {
					$(this).css('MozUserSelect', 'inherit');
				} else if ($.browser.opera) {
					$(this).unbind('mousedown');
				} else {
					$(this).removeAttr('unselectable', 'on');
				}
			});
		}

	};
	// end noSelect

	// plugins definition for $.flexigrid, keyword "this" in plugins will reference to table element of current flexigrid.
	$.flexigrid.plugins = {};
	$.flexigrid.plugins.showCheckboxes = function(settings) {
		var i, selector, colModel = settings.colModel, length = colModel.length,
		name = settings.checkboxName || 'id';
		for (i = 0; i < length; i++) {
			var col = colModel[i];
			// $.console.log(col);
			if (col.name === name) {
				break;
			}
		}
		selector = '.flexigridCell:nth(' + i + ')';
		$('tr', this).each( function() {
			var $td = $(selector, this);
			$td.html('<input type="checkbox" name="' + name + '" value="' + $td.text() + '" />');
		});
		$('thead th input:checkbox', this).click( function() {
			var checked = this.checked;
			$('input:checkbox').each( function() {
				this.checked = checked;
			});
		});
	};
})(jQuery);
