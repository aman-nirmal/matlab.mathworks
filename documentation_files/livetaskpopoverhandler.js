"use strict";
$(window).on('popover_added', function() {
	 $.each($('[data-bs-toggle="lt_popover"]'), function(key, popoverEl) {
		let matlabCommand = $(popoverEl).attr('data-examplename');
		if (!matlabCommand) return;
		let openWithCommand = null;
		let match = matlabCommand.match(/openExample\('(.*)'\)/);
		if (match) {
			openWithCommand = match[1];
		}
		let components = match ? match[1].split('/')[0].split('_') : [];
		if (window.ow !== undefined && openWithCommand) {
			let el = popoverEl;
			let componentSupported = checkSupport(components);
			let existing = bootstrap.Popover.getInstance(el);
			if (existing) {
				existing.dispose();
			}
                if (componentSupported) {
					let cmd = $(el).attr('data-examplename');
					new bootstrap.Popover(el, {
						sanitize: false,
						html: true,
						title: 'Interactive Task',
						content: '<span>In live scripts, tasks like this one let you interactively explore parameters and generate MATLAB code. To use the tasks in this example, <a href="matlab:' + cmd + '">try it in your browser</a>.</span>'
					});
					$(el).on('shown.bs.popover', function () {
						let $popup = $('#' + $(el).attr('aria-describedby'));
						$popup.find('a').click(function (e) {
							e.preventDefault();
							ow.invokeAction({
								type: 'openexample',
								arguments: [openWithCommand],
								targetPlatform: 'web',
								targetApplication: 'matlab'
							});
						});
					});
				} else {
					new bootstrap.Popover(el, {
						sanitize: false,
						html: true,
						title: 'Interactive Task',
						content: '<span>In live scripts, tasks like this one let you interactively explore parameters and generate MATLAB code. To use the tasks in this example, open the example in MATLAB.</span>'
					});
				}
        }
	 });
  });