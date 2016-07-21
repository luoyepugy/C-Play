

loadScript(plugin_path + "../../plugins/datatables/js/jquery.dataTables.min.js", function(){
	loadScript(plugin_path + "../../plugins/datatables/dataTables.bootstrap.js", function(){

		if (jQuery().dataTable) {

			var table = jQuery('#datatable_sample');
			table.dataTable({
				"columns": [{
					"orderable": false
				}, {
					"orderable": true
				}, {
					"orderable": false
				}, {
					"orderable": false
				}, {
					"orderable": false
				}, {
					"orderable": false
				}],
				"lengthMenu": [
					[10, 15, 20, -1],
					[10, 15, 20, "All"] // change per page values here
				],
				// set the initial value
				"pageLength": 10,            
				"pagingType": "bootstrap_full_number",
				"language": {
					"lengthMenu": "  _MENU_ records",
					"paginate": {
						"previous":"上一页",
						"next": "下一页",
						"last": "末页",
						"first": "首页"
					}
				},
				"columnDefs": [{  // set default column settings
					'orderable': false,
					'targets': [0]
				}, {
					"searchable": false,
					"targets": [0]
				}],
				"order": [
					[1, "asc"]
				] // set first column as a default sort by asc
			});

			var tableWrapper = jQuery('#datatable_sample_wrapper');

			table.find('.group-checkable').change(function () {
				var set = jQuery(this).attr("data-set");
				var checked = jQuery(this).is(":checked");
				jQuery(set).each(function () {
					if (checked) {
						jQuery(this).attr("checked", true);
						jQuery(this).parents('tr').addClass("active");
					} else {
						jQuery(this).attr("checked", false);
						jQuery(this).parents('tr').removeClass("active");
					}
				});
				jQuery.uniform.update(set);
			});

			table.on('change', 'tbody tr .checkboxes', function () {
				jQuery(this).parents('tr').toggleClass("active");
			});

			tableWrapper.find('.dataTables_length select').addClass("form-control input-xsmall input-inline"); // modify table per page dropdown

		}

	});
});
