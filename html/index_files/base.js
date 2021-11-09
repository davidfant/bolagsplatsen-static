$(document).ready(function(){

	//Search init

	initKommunPopup();

	//New

	initSearch();

	initNavigation();

	initNewsletter();

	initArchiveLink();
	initDeleteLink();
	initPreviewLink();

	initErrorPopup();

	initForms();

	initGallery();

	initAdMessageForm();
	initCustomerMessageForm();
	initUserMessageForm();

	initMyPage();

	initHiddenPhoneNumbers();

	initPopups();

	initKlarna();

	initDibs();

	initPrices();

	initSubscriptions();

	initStatistics();

	initSticky();

    initFormSubmissionTracking();

	$(".carousel").carousel();


	$("#tree-selector-categories").treeSelector("categories", "/api/public/categories/");
    $("#tree-selector-realestate-categories").treeSelector("categories", "/api/public/categories/");
    $("#tree-selector-land-categories").treeSelector("categories", "/api/public/categories/");
    $("#tree-selector-lease-categories").treeSelector("categories", "/api/public/categories/");
	$("#tree-selector-places").treeSelector("places", "/api/public/places/");

});

function initFormSubmissionTracking()
{
    var formBuyer = $("#form-buyer");
    formBuyer.on('submit', function (event) {
        event.preventDefault();

        ga('send', 'event', 'Form', 'Buyer', {
            hitCallback: createFunctionWithTimeout(function() {
                formBuyer.off("submit");
                formBuyer.trigger("submit");
            })
        });
    });

    var formBuyerRealestate = $("#form-buyer-realestate");
    formBuyerRealestate.on('submit', function (event) {
        event.preventDefault();

        ga('send', 'event', 'Form','Realestate', {
            hitCallback: createFunctionWithTimeout(function() {
                formBuyerRealestate.off("submit");
                formBuyerRealestate.trigger("submit");
            })
        });
    });

    var formFinancing = $("#form-financing");
    formFinancing.on('submit', function (event) {
        event.preventDefault();

        ga('send', 'event', 'Form', 'DBT', {
            hitCallback: createFunctionWithTimeout(function() {
                formFinancing.off("submit");
                formFinancing.trigger("submit");
            })
        });
    });

    var formForetagsPaket = $("#form-foretagspaket");
    formForetagsPaket.on('submit', function (event) {
        event.preventDefault();

        ga('send', 'event', 'Form', 'CompanyCampaign', {
            hitCallback: createFunctionWithTimeout(function() {
                formForetagsPaket.off("submit");
                formForetagsPaket.trigger("submit");
            })
        });
    });

    var formFranchise = $("#form-franchise");
    formFranchise.on('submit', function (event) {
        event.preventDefault();

        ga('send', 'event', 'Form', 'Franchise', {
            hitCallback: createFunctionWithTimeout(function() {
                formFranchise.off("submit");
                formFranchise.trigger("submit");
            })
        });
    });
}



function initSticky()
{
	if(!$("#sticky").length)
	{
		return;
	}

	$(window).on("scroll", function(e) {

		var scroll = $(window).scrollTop();

		if(scroll > 275)
		{
			$("#sticky").show();
		}
		else
		{
			$("#sticky").hide();
		}
	});
}


function initMyPage()
{
	if($(".mypage-counsellor-information-index").length)
	{
		$("#counsellor-places").chosen("destroy");
		$("#counsellor-places").chosen({disable_search_threshold: 30});
	}

	$('#counsellor-employee-upload').fileupload({
		url: "/api/public/upload_employee",
		dataType: 'json',
		done: function (e, data) {
			$('.fileupload-file-progress').hide();
			$('.fileupload-file-info').show();
			$('.fileupload-file-info .file-name').text(data.result.files[0].name);
			$('.fileupload-file-info .delete').attr("href", data.result.files[0].deleteUrl);
			$('#employee-image').val(data.result.files[0].name);
		},
		progressall: function (e, data) {
			$('.fileupload-add-file').hide();
			$('.fileupload-file-progress').show();
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('.fileupload-file-progress .progress .progress-bar').css('width',progress + '%');
			$('.fileupload-file-progress .progress .progress-bar').text(progress + '%');
		},
		fail: function (e, data) {
			$(".fileupload-file-messages").show();
			$.each(data.messages, function (index, error) {
				$('.fileupload-file-messages').append('<p>Kunde inte ladda upp filen: ' + error + '</p>');
			});
		}
	})
	.prop('disabled', !$.support.fileInput)
	.parent().addClass($.support.fileInput ? undefined : 'disabled');

	$('#counsellor-employee-upload-container .fileupload-file-info .delete').on("click", function(e){
        $('#employee-image').val("");
        $('.fileupload-add-file').show();
        $('.fileupload-file-info').hide();
        e.preventDefault();
    });

    $('#counsellor-category-roots').on("change", function(e){
        var category = $(this).val();
        updateCounsellorCategories(category);
        
        e.preventDefault();
    });

    updateCounsellorCategories($("#counsellor-category-roots").val());

}

function updateCounsellorCategories(category) {
    if(jQuery.inArray("334", category)>=0){
        $("#counsellor-categories-container").show();
        $("#counsellor-turnover-container").show();
    }
    else {
        $("#counsellor-categories-container").hide();
        $("#counsellor-turnover-container").hide();
    }
}

function initGallery()
{
	if($("#ads-view-gallery").length)
	{
		$.getJSON("/api/public/images/?id=" + $("#ad-id").val(), null, function(result){
			var images = result.data;

			var dataSource = [];

			for (var i = 0; i < images.length; i++) {
				dataSource.push({image: images[i].image });
			}

			Galleria.loadTheme('/js/vendor/galleria/themes/bolagsplatsen/galleria.bolagsplatsen.js');

			Galleria.run('#ads-view-gallery', {
				dataSource: dataSource,
				imageCrop: true,
				height: 0.72
			});
		});
	}
}

$.fn.treeSelector = function(name, url) {

	var treeSelector = $(this);

	function init()
	{
		treeSelector.on('change', 'select', function(){

			var parentId = $(this).val();
			var container = $(this).parent();

			container.find("select:gt(" + ($(this).index() - 1) + ")").remove();
			$(this).attr("name", name + "[]");

			if($(this).val() != $(this).find("option:first").val())
			{
				appendList(parentId, "", container);
			}

		});

		treeSelector.on('click', '.add-tree-item', function(){

			var treeItem = $('<div class="tree-item"><button type="button" class="delete small-button">Ta bort</button></div>');

			treeSelector.find(".tree-items").append(treeItem);

			var exclude = ($(this).data("exclude") != "" && $(this).data("exclude") != undefined)?$(this).data("exclude"):"";
			appendList($(this).val(), exclude, treeItem);
			updateDeleteButtons();

		});

		treeSelector.on('click', '.delete', function(){
			$(this).parent().remove();
			updateDeleteButtons();
		});

		treeSelector.find('.add-tree-item').trigger('click');
	}

	function appendList(parentId, exclude, treeItemContainer)
	{
		if(parentId>0)
		{
			$.getJSON(url, {"parent-id": parentId, "exclude[]":exclude.split(',')})
			.done(function( data ) {
				if(data.length)
				{
					treeItemContainer.find("select").removeAttr("name");
					var select = $('<select id="tree-item-' + (treeItemContainer.find('select').length + 1) + '" name="' + name + '[]"></select>');
					select.append('<option value="' + parentId + '">Alla</option>');
					$.each( data, function( i, item ) {
						select.append('<option value="' + item.id + '">' + item.title + '</option>');
					});
					treeItemContainer.append(select);
				}
			});
		}
	}

	function updateDeleteButtons()
	{
		if(treeSelector.find('.tree-item').length > 1)
		{
			treeSelector.find('.delete').show();
		}
		else
		{
			treeSelector.find('.delete').hide();
		}
	}

	init();
};

$.fn.carousel = function() {

	if (this.length > 1){
		this.each(function() { $(this).carousel(); });
		return this;
	}

	var current = 0,
	breakpointSize,
	multiplier = 1,
	carousel = $(this),
	cList = carousel.find('.carousel-list'),
	cWidth = carousel.innerWidth(),
	li = cList.find('li'),
	liLength = li.size(),
	animLimit = 0,
	prevLink = carousel.find('.carousel-nav .prev'),
	nextLink = carousel.find('.carousel-nav .next');

	if("getComputedStyle" in window)
	{
		breakpointSize = window.getComputedStyle(document.body,':after').getPropertyValue('content'); /* Conditional CSS http://adactio.com/journal/5429/ */
	}
	else
	{
		breakpointSize = "large";
		cWidth = 1000;
	}

	$(window).resize(function(){ //On Window Resize
		cWidth = carousel.width();

		if("getComputedStyle" in window)
		{
			breakpointSize = window.getComputedStyle(document.body,':after').getPropertyValue('content'); /* Conditional CSS http://adactio.com/journal/5429/ */
		}
		else
		{
			breakpointSize = "large";
		}

		sizeCarousel();
		scrollCarousel();
	});

	function sizeCarousel() { //Determine the size and number of panels to reveal

		current = 0;
		if (breakpointSize.indexOf("medium") !=-1) {
			multiplier = 3;

		} else if (breakpointSize.indexOf("large") !=-1) {
			multiplier = 5;
		} else {
			multiplier = 1;
		}

		animLimit = liLength/multiplier-1;
		li.css("width",cWidth/multiplier + "px"); //Set panel widths
	}

	function buildCarousel() { //Build the Carousel
		sizeCarousel();
		updateLinks();
	}

	function updateLinks()
	{
		if(current >= animLimit)
		{
			nextLink.addClass("inactive");
		}
		else
		{
			nextLink.removeClass("inactive");
		}

		if(current == 0)
		{
			prevLink.addClass("inactive");
		}
		else
		{
			prevLink.removeClass("inactive");
		}
	}

	function scrollCarousel() {
		var pos = -current * cWidth;
		cList.css("left",pos);

		updateLinks();
	}

	prevLink.click(function(e){ //Previous Button Click
		e.preventDefault();
		if(current>0) {
			current--;
			scrollCarousel();
		}

	});

	nextLink.click(function(e){ //Next Button Click
		e.preventDefault();
		if(current<animLimit) {
			current++;
			scrollCarousel();
		}

	});

	buildCarousel();
};

function initForms()
{
	var forms = $('form[data-parsley-validate]');

	forms.each(function() {
		$(this).parsley().subscribe('parsley:field:error', function (fieldInstance) {
			fieldInstance.$element.parents(".field").addClass("error");
		});

		$(this).parsley().subscribe('parsley:field:success', function (fieldInstance) {
			fieldInstance.$element.parents(".field").removeClass("error");
		});
	});


	$("form.search-form .search-form-simple select").chosen({disable_search_threshold: 30, width: '100%' });
    $("form.search-form-group select:not(.search-category)").chosen({disable_search_threshold: 20, width: '100px' });
    $("form.search-form-group select.search-category").chosen({disable_search_threshold: 20, width: '100%' });
	$("form.search-form .search-form-advanced select").chosen({disable_search_threshold: 20, width: '100px' });
	$("form:not(.search-form, #add-ad-form) select.small").chosen({disable_search_threshold: 30, width: '90px' });
	$("form:not(.search-form, #add-ad-form) select:not(.small)").chosen({disable_search_threshold: 30, width: '100%' });

	$("#buyer-price-from").on('change', function (event) {
		var fromVal = $(this).val().replace(/[^0-9]/g, '');
		fromVal = parseInt(fromVal);

		var selectToVal = $("#buyer-price-to").val();
		selectToVal = (selectToVal === 'infinity') ? selectToVal : parseInt(selectToVal);
		if (selectToVal !== 'infinity' && fromVal !== '' && fromVal > selectToVal) {
			$("#buyer-price-to").val(fromVal).trigger('chosen:updated');
		}

		$("#buyer-price-to option").each(function (index, element) {
			var toVal = $(element).val();
			toVal = (toVal === 'infinity') ? toVal : parseInt(toVal);
			if (toVal !== 'infinity' && fromVal !== '' && fromVal > toVal) {
				$(element).attr('disabled', 'disabled');
			} else {
				$(element).removeAttr('disabled');
			}
		});

		$("#buyer-price-to").trigger('chosen:updated');
	});

	$("#buyer-turnover-from").on('change', function (event) {
		var fromVal = $(this).val().replace(/[^0-9]/g, '');
		fromVal = parseInt(fromVal);

		var selectToVal = $("#buyer-turnover-to").val();
		selectToVal = (selectToVal === 'infinity') ? selectToVal : parseInt(selectToVal);
		if (selectToVal !== 'infinity' && fromVal !== '' && fromVal > selectToVal) {
			$("#buyer-turnover-to").val(fromVal).trigger('chosen:updated');
		}

		$("#buyer-turnover-to option").each(function (index, element) {
			var toVal = $(element).val();
			toVal = (toVal === 'infinity') ? toVal : parseInt(toVal);
			if (toVal !== 'infinity' && fromVal !== '' && fromVal > toVal) {
				$(element).attr('disabled', 'disabled');
			} else {
				$(element).removeAttr('disabled');
			}
		});

		$("#buyer-turnover-to").trigger('chosen:updated');
	});

	$("#sorter-pager-bar-sort-by").chosen({disable_search_threshold: 20, width: '80px' });

	$('input').placeholder();

	$('#franchise-cv-upload').fileupload({
		url: "/api/public/upload_franchise_cv",
		dataType: 'json',
		done: function (e, data) {
			$('.fileupload-file-progress').hide();
			$('.fileupload-file-info').show();
			$('.fileupload-file-info .file-name').text(data.result.files[0].name);
			$('.fileupload-file-info .delete').attr("href", data.result.files[0].deleteUrl);
			$('#franchise-cv').val(data.result.files[0].name);
		},
		progressall: function (e, data) {
			$('.fileupload-add-file').hide();
			$('.fileupload-file-progress').show();
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('.fileupload-file-progress .progress .progress-bar').css('width',progress + '%');
			$('.fileupload-file-progress .progress .progress-bar').text(progress + '%');
		},
		fail: function (e, data) {
			$(".fileupload-file-messages").show();
			$.each(data.messages, function (index, error) {
				$('.fileupload-file-messages').append('<p>Kunde inte ladda upp filen: ' + error + '</p>');
			});
		}
	})
	.prop('disabled', !$.support.fileInput)
	.parent().addClass($.support.fileInput ? undefined : 'disabled');

	$('#franchise-cv-upload-container .fileupload-file-info .delete').on("click", function(e){
		$('#employee-image').val("");
		$('.fileupload-add-file').show();
		$('.fileupload-file-info').hide();
		e.preventDefault();
	});


	$('#buyer-category').change(function() {
		var selectedValues = $(this).val();
		if (selectedValues) {
			var markSelected = false;
			for (i = 0; i < selectedValues.length; ++i) {
				if (selectedValues[i] == 296) {
					markSelected = true;
					break;
				}
			}
			if (markSelected) {
				$('#mark-selected').show();
			} else {
				$('#mark-selected').hide();
			}
		}
	});


	/*
	 * Köpare Fastigheter formulär
	 */

	if ($('#category-realestate').is(':checked')) {
		$('#realestate-options').show();
	}

	if ($('#category-land').is(':checked')) {
		$('#land-options').show();
	}

	if ($('#category-lease').is(':checked')) {
		$('#lease-options').show();
	}

	$('#category-realestate').change(function() {
		if ($(this).is(':checked')) {
			$('#realestate-options').fadeIn();
		} else {
			$('#realestate-options').hide();
		}
	});

	$('#category-land').change(function() {
		if ($(this).is(':checked')) {
			$('#land-options').fadeIn();
		} else {
			$('#land-options').hide();
		}
	});

	$('#category-lease').change(function() {
		if ($(this).is(':checked')) {
			$('#lease-options').fadeIn();
		} else {
			$('#lease-options').hide();
		}
	});
}

function initNewsletter()
{
	$(".newsletter-form").on("submit", function (e) {
		var form = $(this);

		form.find(".notifications").empty();

		var jqxhr = $.post("/api/public/newsletter", form.serialize())
            .done(function(data) {
                form.find(".notifications").html('<li class="success">' + data.message +'</li>');
            })
            .fail(function(xhr) {
                data = JSON.parse(xhr.responseText);
                form.find(".notifications").html('<li class="error">' + data.message +'</li>');
            });

		e.preventDefault();
	});
}

function initNavigation()
{
	$("a.menu-link").on("click", function(e){
		$("#top-menu").toggleClass("open");
		e.preventDefault();
	});

	$("#main-menu > ul > li:first-child a").on("click", function(e){
		$("#main-menu").toggleClass("open");
		e.preventDefault();
	});
}


function initSearch()
{

$(".search-form-group").each(function(){
        var form = $(this);

        var places = $(this).find(".search-places");
        var placeSelect = $(this).find("select.search-place");
        var place = $(this).find(".search-place");
        var placeAlias = $(this).find(".search-place-alias");
        var placeRoot = $(this).find(".search-place-root-id");
        var placeType = $(this).find(".search-place-type-id");

        placeSelect.on("change", function(e){
            placeAlias.val($(this).find(":selected").data("alias"));
        });


        places.autocomplete({
            source: function(request, response) {
                $.getJSON("/api/public/places", { "root-id": placeRoot.val(),"term": places.val(),"type-id": placeType.val()}, response);
            },
            minLength: 2,
            select: function( event, ui ) {
                place.val(ui.item.id);
                placeAlias.val(ui.item.alias);
            },
            change: function(event, ui) {
                if (ui.item == null) {
                    place.val("");
                    placeAlias.val("alla");
                }
            },
            autoSelect: true
        });

        $.ui.autocomplete.prototype.options.autoSelect = true;
        $( ".ui-autocomplete-input" ).on("blur", function( event ) {

            var field = $(this);

            var autocomplete = field.data("ui-autocomplete");
            if ( !autocomplete.options.autoSelect || autocomplete.selectedItem ) { return; }


            var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" );
            autocomplete.widget().children( ".ui-menu-item" ).each(function() {
                var item = $(this).data( "ui-autocomplete-item" );
                if ( matcher.test( item.label.substring(0, item.label.indexOf("(") - 1) || item.value || item ) ) {
                    autocomplete.selectedItem = item;
                    field.val(item.label)
                    return false;
                }
            });
            if (autocomplete.selectedItem) {
                autocomplete._trigger( "select", event, { item: autocomplete.selectedItem } );
            }
        });
    });

	$(".search-form").each(function(){
		var form = $(this);
		var categorySelect = $(this).find("select.search-category");
		var categoryAlias = $(this).find(".search-category-alias");

		var places = $(this).find(".search-places");
		var placeSelect = $(this).find("select.search-place");
		var place = $(this).find(".search-place");
		var placeAlias = $(this).find(".search-place-alias");
		var placeRoot = $(this).find(".search-place-root-id");
		var placeType = $(this).find(".search-place-type-id");

		categorySelect.on("change", function(e){
			categoryAlias.val($(this).find(":selected").data("alias"));
		});

		placeSelect.on("change", function(e){
			placeAlias.val($(this).find(":selected").data("alias"));
		});


		places.autocomplete({
			source: function(request, response) {
				$.getJSON("/api/public/places", { "root-id": placeRoot.val(),"term": places.val(),"type-id": placeType.val()}, response);
			},
			minLength: 2,
			select: function( event, ui ) {
				place.val(ui.item.id);
				placeAlias.val(ui.item.alias);
				updateSearchForm(form);
			},
			change: function(event, ui) {
				if (ui.item == null) {
					place.val("");
					placeAlias.val("alla");
					updateSearchForm(form);
				}
			},
			autoSelect: true
		});

		$.ui.autocomplete.prototype.options.autoSelect = true;
		$( ".ui-autocomplete-input" ).on("blur", function( event ) {

			var field = $(this);

			var autocomplete = field.data("ui-autocomplete");
			if ( !autocomplete.options.autoSelect || autocomplete.selectedItem ) { return; }


			var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" );
			autocomplete.widget().children( ".ui-menu-item" ).each(function() {
				var item = $(this).data( "ui-autocomplete-item" );
				if ( matcher.test( item.label.substring(0, item.label.indexOf("(") - 1) || item.value || item ) ) {
					autocomplete.selectedItem = item;
					field.val(item.label)
					return false;
				}
			});
			if (autocomplete.selectedItem) {
				autocomplete._trigger( "select", event, { item: autocomplete.selectedItem } );
			}
		});

		form.on("submit", function(e){
			updateSearchForm($(this));
		});

	});

	$("#search-menu a").on("click", function(e){
		$("#search-menu").toggleClass("open");
		$(".search-form").hide();

		var size = window.getComputedStyle(document.body,':after').getPropertyValue('content');

		if(!$(this).hasClass("current") && size.indexOf("large") == -1)
		{
			$(this).parent().prependTo('#search-menu ul');
		}
		$("#search-menu a").removeClass("current");
		$(this).addClass("current");

		$("#search-form-" + $(this).attr("href").substring($(this).attr("href").indexOf("#")+1)).show();
		e.preventDefault();
	});

	$(".search-form").each(function(){
		if($(this).find(".advanced-search-visible").val()==1)
		{
			$(this).find(".search-form-advanced").show();
		}
	});

	$(".search-form-advanced-toggle").on("click", function(e){

		var searchForm = $(this).parents(".search-form");
		searchForm.toggleClass("advanced-search-visible");

		if(searchForm.hasClass("advanced-search-visible"))
		{
			searchForm.find(".search-form-advanced").animate({ height: 'show'}, 'slow');
			searchForm.find(".advanced-search-visible").val(1);
		}
		else
		{
			searchForm.find(".search-form-advanced").animate({ height: 'hide' }, 'fast');
			searchForm.find(".advanced-search-visible").val(0);
		}
		e.preventDefault();
	});

	$("#sorter-pager-bar-sort-by").change(function(e) {
		location.href = $(this).val();
		e.preventDefault();
	});

}

function updateSearchForm(form)
{
	form.attr("action", form.attr("data-url") + "/" + $(".search-alias", form).val() + "/" + $(".search-category-alias", form).val() + "/" + $(".search-place-alias", form).val() + "/" );
}

function initArchiveLink() {
	$('.my-page').on("click", ".archive-business-ad-link", function(e){
		var form = $(this).parent('form');
		var id = $('input[name=ad-id]', $(this).parent('form')).val();

		$('#popup-archive-link-ad-id').val(id);
		$('#popup-archive-link-sold').val(0);

		$('#popup-archive-link-visible').hide();
		$('#popup-archive-link-start').show();

		$('#curtain').show();
		$('#popup-archive-link').fadeIn('fast');

		e.preventDefault();
	});

	$('#popup-archive-link-form').on("click", "button.sold-button", function(e) {
		$('#popup-archive-link-sold').val(1);
		$('#popup-archive-link-start').fadeOut('fast', function() {
			$('#popup-archive-link-visible').fadeIn('fast');
		});
		e.preventDefault();
	});

	$('.my-page').on("click", ".move_ad_to_sold", function(e){
		var form = $(this).parent('form');
		var id = $('input[name=ad-id]', $(this).parent('form')).val();

		$('#popup-archive-link-ad-id').val(id);
		$('#popup-archive-link-sold').val(1);

		$('#popup-archive-link-visible').show();
		$('#popup-archive-link-start').hide();

		$('#curtain').show();
		$('#popup-archive-link').fadeIn('fast');

		e.preventDefault();
	});
}

function initDeleteLink()
{
	$('.my-page').on("click", ".delete-ad-link", function(e){
		var form = $(this).parent('form');
		var id = $('input[name=ad-id]', $(this).parent('form')).val();

		$('#popup-delete-link-ad-id').val(id);

		$('#curtain').show();
		$('#popup-delete-link').fadeIn('fast');

		e.preventDefault();
	});

	$('#popup-delete-link').on("click", ".delete-button-no", function(e) {
		$('#popup-delete-link').hide();
		$('#curtain').hide();
		e.preventDefault();
	});
}

function initErrorPopup()
{
	$('#popup-save-error').on('click', '.save-error-button', function() {
		$('#popup-save-error').hide();
		$('#curtain').hide();
	});
}

function initPreviewLink()
{
	$('.my-page').on("click", ".create-preview-link", function(e){
		var form = $(this).parent('form');
		var id = $('input', $(this).parent('form')).val();

		$("#popup-preview-link .notifications").empty();
		$('#popup-preview-link-ad-id').val(id);

		$('#popup-preview-link-start').show();
		$('#popup-preview-link-confirmation').hide();

		$('#curtain').show();
		$('#popup-preview-link').fadeIn('fast');

		e.preventDefault();
	});

	$("#popup-preview-link-form").on("submit", function(e){

		var form = $(this);
		var button = $(".my-page input[name=ad-id][value=" + $('#popup-preview-link-ad-id').val() + "]").parent("form").find(".create-preview-link");

		form.find(".notifications").empty();

		var jqxhr = $.post("/api/public/preview_link", form.serialize())
			.done(function(data) {
				$('#popup-preview-link-start').hide();
				$('#popup-preview-link-confirmation').show();
				$('#popup-preview-link-url').html('<a href="'+data.url+'">' +data.url + '</a>');

				button.addClass("delete-preview-link");
				button.removeClass("create-preview-link");
				button.html("Ta bort förhandsgranskningslänk");
			})
			.fail(function(xhr) {
				data = JSON.parse(xhr.responseText);
				form.find(".notifications").html('<li class="error">' + data.message +'</li>');
			});

		e.preventDefault();
	});

	$('.my-page').on("click", ".delete-preview-link", function(e){

		var button =  $(this);
		var id = $('input', $(this).parent('form')).val();

		$.ajax({
			url: "/api/public/preview_link",
			type: "DELETE",
			data: {"ad-id": id}
		}).done(function() {
			button.addClass("create-preview-link");
			button.removeClass("delete-preview-link");
			button.html("Skapa förhandsgranskningslänk");
		});

		e.preventDefault();

	});
}

function initAdMessageForm()
{
	var form = $('#interest-form');

	form.submit(function(e){
		e.preventDefault();

		if (form.parsley().validate())
		{
			var jqxhr = $.post("/api/public/message", form.serialize())
			.done(function(data) {
				form.find(".notifications").html('<li class="success">' + data.message +'</li>');

				$('#interest-view-form').hide();
				$('#interest-view-confirmation').show();
                var alias = $("#ad-category-alias").val();
                ga('send', 'event', 'Ad', 'Interest', alias);
			})
			.fail(function(xhr) {
				data = JSON.parse(xhr.responseText);
				form.find(".notifications").html('<li class="error">' + data.message +'</li>');
			});
		}
	});
}

function initCustomerMessageForm()
{
	var form = $('#customer-contact-form');

	form.submit(function(e){
		e.preventDefault();

		if (form.parsley().validate())
		{
			var jqxhr = $.post("/api/public/customer_message", form.serialize())
			.done(function(data) {
				form.find(".notifications").html('<li class="success">' + data.message +'</li>');
				form[0].reset();
			})
			.fail(function(xhr) {
				data = JSON.parse(xhr.responseText);
				form.find(".notifications").html('<li class="error">' + data.message +'</li>');
			});
		}
	});
}

function initUserMessageForm()
{
	$(".contact-employee").on("click", function(e)
	{
		var id = $(this).attr("data-user-id");
		$('#user-contact-id option[value="' + id + '"]').attr("selected", "selected");
		$("#user-contact-id").trigger("chosen:updated");
	});

	var form = $('#user-contact-form');

	form.submit(function(e){
		e.preventDefault();

		if (form.parsley().validate())
		{
			var jqxhr = $.post("/api/public/user_message", form.serialize())
			.done(function(data) {
				form.find(".notifications").html('<li class="success">' + data.message +'</li>');
				form[0].reset();
			})
			.fail(function(xhr) {
				data = JSON.parse(xhr.responseText);
				form.find(".notifications").html('<li class="error">' + data.message +'</li>');
			});
		}
	});
}

function initHiddenPhoneNumbers()
{

	$("#ads-view-numbers").on("click", "span.show", function(e)
	{
		var element = $(this);

		var jqxhr = $.get("/api/public/contact_information", {"ad-id": $(this).data("ad-id"), "type": $(this).data("type")})
			.done(function(data) {
				element.html(data.data);
				element.removeAttr('href');
				element.removeClass('show');
                ga('send', 'event', 'Ad', 'view', 'Phone');
			});

		e.preventDefault();
	});

	$("#customer-number").on("click", function(e)
	{
		var element = $(this);
        var type = $(this).data("type");

		var jqxhr = $.get("/api/public/contact_information", {"customer-id": $(this).data("customer-id"), "type": type})
			.done(function(data) {
				element.html(data.data);
				element.removeAttr('href');
				element.removeClass('show');
                ga('send', 'event', 'Customer', 'view', type);
			});

		e.preventDefault();
	});

	$(".list-item").on("click", "span.show", function(e)
	{
		var element = $(this);
        var type = $(this).data("type");

		var jqxhr = $.get("/api/public/contact_information", {"valuation-id": $(this).data("valuation-id"), "type": type})
			.done(function(data) {
				element.html(data.data);
				element.removeAttr('href');
				element.removeClass('show');
                ga('send', 'event', 'Valuation', 'view', type);
			});

		e.preventDefault();
	});
}

function initPopups()
{
	function setCookie(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	    var expires = "expires="+ d.toUTCString();
	    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	function getCookie(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for (var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return false;
	}

	$('.popup .close').click(function(event){
		$('#curtain').hide();
		$('.popup').hide();
		event.preventDefault();
	});
    
    /*
	if (!getCookie('fundedbyme-popup2')) {
		// Show newsletter popup after 1 second
		setTimeout(function () {
			$('#curtain').show();
			$('#popup-fundedbyme').show();
			setCookie('fundedbyme-popup2', true, 3);
		}, 1000);
	}
    */
}


function popup(url)
{
	window.open(url, "Klarna", 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=0,width=400,height=300,left = 1130,top = 570');
}

function initKlarna()
{
	$("#klarna-terms").click(function(e)
	{
		popup($(this).attr("href"));
		e.preventDefault();
	});

	$("#payment-method-invoice-check-address").click(function(e)
	{

		$.getJSON("/api/public/address", {"pno": $("#payment-method-invoice-pno").val()})
			.done(function(data) {
				$("#payment-method-invoice-address").html('<strong>Mottagaradress:</strong> ' + data.message);
				$("#payment-method-invoice-address").show();
			})
			.fail(function(xhr) {
				data = JSON.parse(xhr.responseText);
				$("#payment-method-invoice-address").html(data.message);
				$("#payment-method-invoice-address").show();
			});

		e.preventDefault();
	});

	$("#payment-method-invoice").click(function(event)
	{
		$("#payment-method-creditcard-content").hide();
		$("#payment-method-invoice-content").show();
	});

	$("#payment-method-creditcard").click(function(event)
	{
		$("#payment-method-invoice-content").hide();
		$("#payment-method-creditcard-content").show();
	});
}

function initDibs()
{
	$('#dibs-form').submit();
}

function initPrices()
{
	$(".add-ad-price").chosen({disable_search_threshold: 30}).change(function(e)
	{
		var form = $(this).parents("form");
		updatePrice(form);
		e.preventDefault();
	});

	$("form.calculate-price-form").each(function(index, form){
		updatePrice(form)
	});

	$(".add-extend-price").chosen({disable_search_threshold: 30}).change(function(e)
	{
		var form = $(this).parents("form");
		updateExtendPrice(form);
		e.preventDefault();
	});

	$("form.calculate-extend-price-form").each(function(index, form){
		updateExtendPrice(form)
	});

}

function updatePrice(form)
{
	$.getJSON("/api/public/price", {"category": $("[name=category]", form).val(), "turnover": $("[name=turnover]", form).val(), "months": $("[name=months]", form).val()})
		.done(function(data) {
			$(".price span", form).html(data);
		});
}

function updateExtendPrice(form)
{
	$.getJSON("/api/public/price_by_ad", {"id": $("[name=id]", form).val(), "months": $("[name=months]", form).val()})
		.done(function(data) {
			$(".price span", form).html(data);
		});
}

function initSubscriptions()
{

	var form = $('#subscription-popup-form');

	form.submit(function(e){
		e.preventDefault();

		if (form.parsley().validate())
		{
			var values = $(".search-form.current").serialize();
			values += "&name=" + encodeURIComponent($('#subscription-name').val());
			values += "&email=" + encodeURIComponent($('#subscription-email').val());

			var jqxhr = $.post("/api/public/subscription", values)
			.done(function(data) {
				form.find(".notifications").html('<li class="success">' + data.message +'</li>');

				$('#subscription-popup-view-form').hide();
				$('#subscription-popup-view-confirmation').show();
			})
			.fail(function(xhr) {
				data = JSON.parse(xhr.responseText);
				form.find(".notifications").html('<li class="error">' + data.message +'</li>');
			});
		}
	});

	$("#search-subscribe-button").click(function(event){

		$('#subscription-popup-view-form').show();
		$('#subscription-popup-view-confirmation').hide();
		$('#subscription-popup .notifications').empty();

		$('#curtain').fadeIn('fast');
		$('#subscription-popup').fadeIn('fast');

		var name = $('form.current select[name=category] option:selected').text() + " - " + $("form.current .search-places").val();
		$('#subscription-name').val(name);

		event.preventDefault();
	});

}

function createFunctionWithTimeout(callback, opt_timeout) {
  var called = false;
  function fn() {
    if (!called) {
      called = true;
      callback();
    }
  }
  setTimeout(fn, opt_timeout || 3000);
  return fn;
}

function initStatistics()
{
	if ($("#statistics-tabs").length) {

		$("#from-date").datepicker({
			defaultDate: "-1m",
			minDate: "2015-02-10",
			onSelect: function( selectedDate ) {
				$( "#to-date" ).datepicker( "change", "minDate", selectedDate );
				updateSelectedRangeDates();
			}
		});

		$("#to-date").datepicker({
			defaultDate: "-1d",
			onSelect: function( selectedDate ) {
				$( "#from-date" ).datepicker( "change", "maxDate", selectedDate );
				updateSelectedRangeDates();
			}
		});

		$("#rangepicker-show-button").on("click", function(){
			$("#rangepicker-selector").toggle();
		});

		updateSelectedRangeDates();

		// Check if single ad
		var ad = 0;
		if ($(".ad-id").length) {
			ad = $(".ad-id").attr("value");
			updateAdStats(ad);
		}

		// Ads list
		var baseUrl = $('.baseurl').val();
		var pageLimit = 10;

		// Tabs
		updateVisitorChart(ad);
		updateInterestChart(ad);
		updateTelephoneViewsChart(ad);
		$('#statistics-tabs').tabs();

		// Update charts button
		$("#rangepicker-update-button").on('click', function(e) {
			// Check for valid dates
			if (!isValidDate($.datepicker.formatDate("yy-mm-dd", $("#from-date").datepicker("getDate"))) || !isValidDate($.datepicker.formatDate("yy-mm-dd", $("#to-date").datepicker("getDate")))) {
				return;
			};

			// Update charts
			updateVisitorChart(ad);
			updateInterestChart(ad);
			updateTelephoneViewsChart(ad);

			if (ad !== 0) {
				// Update stats on single ad view
				updateAdStats(ad);
			} else {
				// Update table in ads list view
				$.getJSON('/api/private/ad_list_stats_count',
				{
					from: $.datepicker.formatDate("yy-mm-dd", $("#from-date").datepicker("getDate")),
					to: $.datepicker.formatDate("yy-mm-dd", $("#to-date").datepicker("getDate"))
				})
				.done(function(count) {
					$.getJSON('/api/private/ad_list_stats',
					{
						from: $.datepicker.formatDate("yy-mm-dd", $("#from-date").datepicker("getDate")),
						to: $.datepicker.formatDate("yy-mm-dd", $("#to-date").datepicker("getDate")),
						limit: pageLimit,
						offset: 0
					})
					.done(function(data) {
						populateTable(data);
						$('.pagination-holder').pagination('updateItems', count.count);
						$('.pagination-holder').pagination('updateItemsOnPage', data.length);
					});
				});
			}

			$("#rangepicker-selector").hide();
			e.preventDefault();
		});

		if (ad === 0) {
			$.getJSON('/api/private/ad_list_stats_count')
			.done(function(count) {
				$.getJSON('/api/private/ad_list_stats',
				{
					from: $.datepicker.formatDate("yy-mm-dd", $("#from-date").datepicker("getDate")),
					to: $.datepicker.formatDate("yy-mm-dd", $("#to-date").datepicker("getDate")),
					limit: pageLimit,
					offset: 0
				})
				.done(function(data) {
					populateTable(data);
					initPagination(count.count, data.length);
				});
			});
		}
	}
}

/* Chart stuff */
var newChartElement = '<canvas id="chart" width="700" height="300"></canvas>';
var chart_options = {
	bezierCurve : true,
	pointHitDetectionRadius : 2,
	scaleShowGridLines : false,
	showXLabels : 9,
	animation: true,
};

function updateVisitorChart(ad) {
	$.getJSON(
		'/api/private/visitors',
		{
			from: $.datepicker.formatDate("yy-mm-dd", $("#from-date").datepicker("getDate")),
			to: $.datepicker.formatDate("yy-mm-dd", $("#to-date").datepicker("getDate")),
			ad: ad
		},
		function(data) {
			$("#statistics-tabs-1 canvas").replaceWith(newChartElement);
			var ctx = $('#statistics-tabs-1 canvas')[0].getContext('2d');

			var chart_data_date_labels = new Array();
			var chart_data_total_values = new Array();
			var c = 0;
			$.each(data, function(k, v) {
				chart_data_date_labels[c] = k;
				chart_data_total_values[c] = v.total;
				c++;
			});

			if (c > 15)
				chart_options.showXLabels = 9;
			else
				chart_options.showXLabels = true;

			chart_options.legendTemplate = "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>";

			var chart_data = {
				labels: chart_data_date_labels,
				datasets: [
					{
						label: "Sidvisningar",
						fillColor: "rgba(220,220,220,0.2)",
						strokeColor: "rgba(180,180,180,1)",
						pointColor: "rgba(180,180,180,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: chart_data_total_values
					}
				]
			};

			var visitorChart = new Chart(ctx).Line(chart_data, chart_options);
			if (!$("#statistics-tabs-1 .line-legend").length) {
				$("#statistics-tabs-1").append(visitorChart.generateLegend());
			}
		}
	);
}

function updateInterestChart(ad) {
	$("#statistics-tabs-2 canvas").replaceWith(newChartElement);
	var ctx = $('#statistics-tabs-2 canvas')[0].getContext('2d');

	$.getJSON(
		'/api/private/interests',
		{
			from: $.datepicker.formatDate("yy-mm-dd", $("#from-date").datepicker("getDate")),
			to: $.datepicker.formatDate("yy-mm-dd", $("#to-date").datepicker("getDate")),
			ad: ad
		},
		function(data) {
			var chart_data_date_labels = new Array();
			var chart_data_total_values = new Array();
			var c = 0;
			$.each(data, function(k, v) {
				chart_data_date_labels[c] = k;
				chart_data_total_values[c] = v;
				c++;
			});

			if (c > 15)
				chart_options.showXLabels = 9;
			else
				chart_options.showXLabels = true;

			var chart_data = {
				labels: chart_data_date_labels,
				datasets: [
					{
						label: "Intressentmail",
						fillColor: "rgba(220,220,220,0.2)",
						strokeColor: "rgba(180,180,180,1)",
						pointColor: "rgba(180,180,180,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: chart_data_total_values
					}
				]
			};

			var interestChart = new Chart(ctx).Line(chart_data, chart_options);
			if (!$("#statistics-tabs-2 .line-legend").length) {
				$("#statistics-tabs-2").append(interestChart.generateLegend());
			}
		}
	);
}

function updateTelephoneViewsChart(ad) {
	$("#statistics-tabs-3 canvas").replaceWith(newChartElement);
	var ctx = $('#statistics-tabs-3 canvas')[0].getContext('2d');

	$.getJSON(
		'/api/private/telephoneviews',
		{
			from: $.datepicker.formatDate("yy-mm-dd", $("#from-date").datepicker("getDate")),
			to: $.datepicker.formatDate("yy-mm-dd", $("#to-date").datepicker("getDate")),
			ad: ad
		},
		function(data) {
			var chart_data_date_labels = new Array();
			var chart_data_total_values = new Array();
			var c = 0;
			$.each(data, function(k, v) {
				chart_data_date_labels[c] = k;
				chart_data_total_values[c] = v;
				c++;
			});

			if (c > 15)
				chart_options.showXLabels = 9;
			else
				chart_options.showXLabels = true;

			var chart_data = {
				labels: chart_data_date_labels,
				datasets: [
					{
						label: "Telefonvisningar",
						fillColor: "rgba(220,220,220,0.2)",
						strokeColor: "rgba(180,180,180,1)",
						pointColor: "rgba(180,180,180,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: chart_data_total_values
					}
				]
			};

			var telephoneViewsChart = new Chart(ctx).Line(chart_data, chart_options);
			if (!$("#statistics-tabs-3 .line-legend").length) {
				$("#statistics-tabs-3").append(telephoneViewsChart.generateLegend());
			}
		}
	);
}

function updateAdStats(ad) {
	$.getJSON('/api/private/ad_stats',
	{
		from: $.datepicker.formatDate("yy-mm-dd", $("#from-date").datepicker("getDate")),
		to: $.datepicker.formatDate("yy-mm-dd", $("#to-date").datepicker("getDate")),
		ad: ad
	})
	.done(function(data) {
		$('.total-visitors span').text(data.visitors);
		$('.unique-visitors span').text(data.unique_visitors);
		$('.phone-views span').text(data.phone_views);
		$('.interest-messages span').text(data.messages);
	});

	if ($('#statistics-summary').length) {
		var fromDate = new Date($("#from-date").datepicker("getDate"));
		var fromDateFormat = $.datepicker.formatDate("d MM, yy", fromDate);
		var toDate = new Date($("#to-date").datepicker("getDate"));
		var toDateFormat = $.datepicker.formatDate("d MM, yy", toDate);

		$('#statistics-summary > h2 > span').html(' (' + fromDateFormat + ' - ' + toDateFormat + ')');
	};
}

function initPagination(items, itemsOnPage) {
	$('.pagination-holder').pagination({
		items: items,
		itemsOnPage: itemsOnPage,
		prevText: 'Föregående',
		nextText: 'Nästa',
		cssStyle: 'light-theme',
		onPageClick: pageClick
	});
}

function pageClick(pageNumber, event) {
	var pageLimit = 10;
	$('.ads-stats-list tbody').empty();
	$('.ads-stats-list tbody').append('<tr><td class="ads-loader" colspan="5"></td></tr>');
	$.getJSON('/api/private/ad_list_stats',
	{
		from: $.datepicker.formatDate("yy-mm-dd", $("#from-date").datepicker("getDate")),
		to: $.datepicker.formatDate("yy-mm-dd", $("#to-date").datepicker("getDate")),
		limit: pageLimit,
		offset: (pageNumber-1) * pageLimit
	})
	.done(function(data) {
		$('.ads-stats-list').css("background-image", "");
		populateTable(data);
	});
}

function populateTable(data) {
	$('.ads-stats-list tbody').empty();
	$.each(data, function(k, v) {
		$('.ads-stats-list tbody').append('<tr class="clickable-ad-row" data-ad="' + v.ad_id + '"><td><a href="' + $('.baseurl').val() + 'min-sida/statistik/annonser/' + v.ad_id + '">' + v.header + '</a></td><td>' + v.visitors + '</td><td>' + v.phone_views + '</td><td>' + v.messages + '</td></tr>');
	});
}

function updateSelectedRangeDates() {
	var fromDate = new Date($("#from-date").datepicker("getDate"));
	var fromDateFormat = $.datepicker.formatDate("d MM, yy", fromDate);
	$("#from-date-selected").html(fromDateFormat);

	var toDate = new Date($("#to-date").datepicker("getDate"));
	var toDateFormat = $.datepicker.formatDate("d MM, yy", toDate);
	$("#to-date-selected").html(toDateFormat);
}

function isValidDate (date) {
	return !isNaN(Date.parse(date));
}

/* /Chart Stuff */



/* Old *//* Old *//* Old *//* Old *//* Old *//* Old *//* Old */



function initKommunPopup(){
	$('#show-kommun-partners').click(function(event){

		$('#curtain').show();
		$('#popup-kommun').fadeIn('fast');

		event.preventDefault();

	});
}

