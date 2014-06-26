/*
 * jQuery toggleEvent plugin
 *
 * Loosely based on https://github.com/fkling/jQuery-Function-Toggle-Plugin
 *
 * @author    David Lundgren
 * @copyright 2012 David Lundgren <dlundgren@syberisle.net>
 * @license   MIT
 */
!function($) {
	/**
	 * The manager for toggleEvent
	 * @param element
	 * @param options
	 */
	var toggleManager = function(element, options) {
		this.init(element, options);
	};

	/**
	 * triggers the event
	 * @param event
	 */
	function apply(event) {
		$(this).toggleEvent('trigger', event);
	}

	/**
	 * The prototype for the toggle manager
	 * @type {{constructor: Function, init: Function, enable: Function, disable: Function, trigger: Function, bind: Function, unbind: Function}}
	 */
	toggleManager.prototype = {
		constructor: toggleManager,

		/**
		 * Initializes the toggle manager
		 * @param element
		 * @param options
		 */
		init : function (element, options) {

			this.options = options;
			this.events = {};
			this.eventStatus = {};
			this.$element = $(element);

			for (var key in this.options.functions) {
				this.bind(key, this.options.functions);
			}
		},

		/**
		 * Enables the given type
		 * @param type
		 */
		enable : function(type) {
			this.eventStatus[type] = true;
		},

		/**
		 * Disables the given type
		 * @param type
		 */
		disable : function (type) {
			this.eventStatus[type] = false;
		},

		/**
		 * Triggers the type based on the event if it is enabled
		 * @param event
		 */
		trigger : function (event) {
			if (this.eventStatus[event.type]) {
				var dataAttr = 'data-toggle-' + event.type + this.events[event.type],
					index     = parseInt(this.$element.attr(dataAttr)),
					count     = this.options.functions[event.type].length;

				this.options.functions[event.type][index].call(this.$element, event);
				this.$element.attr(dataAttr, (index + 1) % count);
			}
		},

		/**
		 * Binds a groups of function to the given type
		 *
		 * @param type
		 * @param functions
		 */
		bind : function (type, functions) {
			if (this.events[type]) {
				throw new Error("Type " + type + " already bound");
			}

			this.events[type] =  (new Date()).getTime();
			this.eventStatus[type] = true;

			this.$element.on(type, apply);
			this.$element.attr('data-toggle-' + type + this.events[type], 0);
		},

		/**
		 * Unbinds the given type from the element
		 *
		 * @param type
		 */
		unbind : function (type) {
			if (type) {
				this.$element.off(type, apply);
			}
			else {
				// unbind everything
				for (var key in this.options.functions) {
					this.$element.off(key, apply);
				}
			}
		}
	};

	/**
	 * jQuery plugin for toggling events
	 *
	 * @param option
	 * @returns {*}
	 */
	$.fn.toggleEvent = function(option) {
		var functions = Array.prototype.slice.call(arguments, 1);
		return this.each(function () {
			var $this     = $(this),
				numFunc   = functions.length,
				data      = $this.data('toggle-event'),
				options   = $.extend({}, $.fn.toggleEvent.defaults, $this.data(), typeof option == 'object' && option);

			if (typeof option == 'string' && (option != 'trigger' && option != 'enable' && option != 'disable' && option !== 'unbind')) {
				var funcs = {};
				funcs[option] = functions;

				options['functions'] = $.extend({}, options['functions'], funcs);
			}

			if (!data) {
				$this.data('toggle-event', (data = new toggleManager(this, options)));
			}
			else if (typeof option == 'string') {
				if (option == 'trigger') {
					if (numFunc != 1) {
						throw new Error("toggleEvent::" + option + " requires one argument");
					}
					else if (typeof functions[0] != 'object') {
						throw new Error("toggleEvent::" + option + " first argument must be the event object");
					}

					data.trigger(functions[0]);
				}
				else if (option == 'enable' || option == 'disable' || option == 'unbind') {
					if (numFunc != 1) {
						throw new Error("toggleEvent::" + option + " requires one argument");
					}
					else if (typeof functions[0] != 'string') {
						throw new Error("toggleEvent::" + option + "  argument must be a string");
					}
					data[option](functions[0]);
				}
				else if (option == 'bind') {
					throw new Error("toggleEvent::bind is not a valid method");
				}
				else {
					// we just bind everything else
					data.bind(option, functions);
				}
			}
		})
	};

	/**
	 * The defaults for the toggleEvent
	 * @type {{functions: {}}}
	 */
	$.fn.toggleEvent.defaults = {
		functions : {}
	};

	/**
	 * The constructor
	 * @type {Function}
	 */
	$.fn.toggleEvent.Constructor = toggleManager;
}(window.jQuery);