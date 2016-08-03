/*

    Author: André Luiz Rabêllo

    ******* Needs "zxcvbn" by dropbox to work

*/

// jQuery namespace
; (function ($, zxcvbn) {
    'use strict';

    var classes = {
        main: 'password-meter'
    };
    classes = $.extend(classes, {
        bar:    classes.main + '-bar',
        input:  classes.main + '-input',
        score:  classes.main + '-score',
        help:   classes.main + '-help'
    });

    $.fn.passwordMeter = function (options) {
        // Settings
        var settings = $.extend(true, {
            type: 'horizontal', // horizontal or vertical display
            colors: ['red', 'orange', 'yellow', 'light-green', 'green'], // colors of the score stages as classes
            help: {
                type: 'div', // ~ popover/div => type of help (other values do not create)
                model: $.noop, // function that returns a custom score model - default is text (score / maxScore)
                placement: 'right' // where to display popover
            },
        }, options);

        // Check for zxcvbn
        if (!$.isFunction(zxcvbn)) {
            console.warn('zxcvbn was not found on the global namespace');
            return this;
        }

        // Check for style definitions
        if (!$('style#password-meter-styles').length)
            $('body')
                .append('<style id="password-meter-styles">'
                          + '.' + classes.bar + ' {'
                              + 'position: absolute;'
                              + 'transition: all 0.3s ease 0s;'
                              + 'opacity: 1;'
                              + 'visibility: visible;'
                          + '}'
                          + '.' + classes.bar + '.horizontal {'
                              + 'border-radius: 3px;'
                              + 'bottom: 6px;'
                              + 'left: 0;'
                              + 'right: 100%;'
                              + 'height: 4px;'
                              + 'margin: 0 15px;'
                          + '}'
                          + '.' + classes.bar + '.vertical {'
                              + 'border-radius: 0 3px 3px 0;'
                              + 'right: 0;'
                              + 'bottom: 0;'
                              + 'top: 100%;'
                              + 'width: 4px;'
                          + '}'
                          + '.' + classes.main + ' {'
                              + 'position: relative;'
                          + '}'
                          + '.' + classes.input + ' ~ .popover {'
                              + 'white-space: nowrap;'
                          + '}'
                          + '.' + classes.help + ' {'
                              + 'margin-top: 5px;'
                          + '}'
                      + '</style>');

        // Wrap input with relative div
        var $wrapper = this.parent().wrapInner('<div class="' + classes.main + '"></div>').find('.' + classes.main);

        // Create meter bar
        var $meter = $('<div class="' + classes.bar + ' ' + settings.type + ' red"></div>').insertAfter(this);

        // Function for score creation
        function getScore(score) {
            // Locals
            var max = 5;
            var textResult = score + ' / ' + max;

            // Guard against no score passed
            if (!$.isNumeric(score))
                score = 0;

            // Return display
            if ($.isFunction(settings.help.model))
                return settings.help.model(score) || textResult;

            return textResult;
        }

        // This input
        var $input = this;

        // Apply
        $input
            // Add class
            .addClass(classes.input)
            // Watch for changes
            .on('focus keyup change blur', function () {
                var $this = $(this);
                var pass = $this.val();

                // Run entropy check
                var passScore = zxcvbn(pass);

                // Calc bar size
                var size = pass === '' ? '100%' : (100 - (passScore.score + 1) * 20) + '%';

                // Change bar color and width
                $meter
                    .removeClass(settings.colors.join(' '))
                    .addClass(settings.colors[passScore.score])
                    .css(settings.type === 'vertical' ? 'top' : 'right', size);

                // Get help score
                var score = getScore(pass === '' ? 0 : passScore.score + 1);

                // Find help
                var $help = settings.help.type === 'popover'
                          ? $wrapper.find('.popover')
                          : settings.help.type === 'div'
                              ? $wrapper.siblings('.' + classes.help)
                              : $();

                // Update help score
                $help
                    .find('.' + classes.score)
                        .html(score);
            });

        // Define help body
        var helpBody = '<div class="' + classes.score + '">' + getScore() + '</div>';

        // Help content
        if (settings.help.type === 'popover')
            // Create help popover
            $input
                .popover({
                    html: true,
                    trigger: 'focus',
                    placement: settings.help.placement,
                    content: helpBody
                });
        else if (settings.help.type === 'div') {
            // Create help div
            $wrapper.after('<div class="' + classes.help + '" style="display: none">' + helpBody + '</div>');

            // Help show/hide listener
            $input
                .focus(function () {
                    $wrapper.siblings('.' + classes.help).slideDown(350);
                })
                .blur(function () {
                    // Delay for clickability
                    setTimeout(function () {
                        $wrapper.siblings('.' + classes.help).slideUp(350);
                    }, 250);
                });
        }

        // Return jQuery object
        return this;
    };
})(jQuery, zxcvbn);
