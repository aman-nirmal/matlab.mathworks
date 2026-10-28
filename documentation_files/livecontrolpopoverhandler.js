"use strict";
$(window).on('popover_added', function() {
	 $.each($('[data-bs-toggle="popover"]'), function(key, popoverEl) {
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
						title: 'Interactive Control',
						content: '<span>In live scripts, controls like this one let you set the value of a variable interactively. To use the controls in this example, <a href="matlab:' + cmd + '">try it in your browser</a>.</span>'
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
						title: 'Interactive Control',
						content: '<span>In live scripts, controls like this one let you set the value of a variable interactively. To use the controls in this example, open the example in MATLAB.</span>'
					});
				}
        }
	 });
  });

  function checkSupport(components) {
	const notSupportedByProd04 = ['5g', 'audio', 'lte', 'matlabmobile', 'parallel', 'sdl', 'simscape', 'sps', 'rfpcb', 'satcom', 'slcontrol', 'sldo', 'stateflow', 'systemcomposer', 'uav', 'wlan'];
	const supportedComponents = components.filter(element => notSupportedByProd04.includes(element));
	if (supportedComponents.length > 0) {
		return false
	} else {
		return true
	}
 }