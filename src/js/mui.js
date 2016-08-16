var mui = (function(document, undefined) {
	var readyRE = /complete|loaded|interactive/;
	var idSelectorRE = /^#([\w-]+)$/;
	var classSelectorRE = /^\.([\w-]+)$/;
	var tagSelectorRE = /^[\w-]+$/;
	var translateRE = /translate(?:3d)?\((.+?)\)/;
	var translateMatrixRE = /matrix(3d)?\((.+?)\)/;

	var $ = function(selector, context) {
		context = context || document;
		if (!selector)
			return wrap();
		if (typeof selector === 'object')
			if ($.isArrayLike(selector)) {
				return wrap($.slice.call(selector), null);
			} else {
				return wrap([selector], null);
			}
		if (typeof selector === 'function')
			return $.ready(selector);
		if (typeof selector === 'string') {
			try {
				selector = selector.trim();
				if (idSelectorRE.test(selector)) {
					var found = document.getElementById(RegExp.$1);
					return wrap(found ? [found] : []);
				}
				return wrap($.qsa(selector, context), selector);
			} catch (e) {}
		}
		return wrap();
	};

	var wrap = function(dom, selector) {
		dom = dom || [];
    dom.__proto__ = $.fn;
		dom.selector = selector || '';
		return dom;
	};

	$.uuid = 0;

	$.data = {};
	/**
	 * extend(simple)
	 * @param {type} target
	 * @param {type} source
	 * @param {type} deep
	 * @returns {unresolved}
	 */
	$.extend = function() { //from jquery2
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if (typeof target === "boolean") {
			deep = target;

			target = arguments[i] || {};
			i++;
		}

		if (typeof target !== "object" && !$.isFunction(target)) {
			target = {};
		}

		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];

					if (target === copy) {
						continue;
					}

					if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && $.isArray(src) ? src : [];

						} else {
							clone = src && $.isPlainObject(src) ? src : {};
						}

						target[name] = $.extend(deep, clone, copy);

					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		return target;
	};
	/**
	 * mui noop(function)
	 */
	$.noop = function() {};
	/**
	 * mui slice(array)
	 */
	$.slice = [].slice;
	/**
	 * mui filter(array)
	 */
	$.filter = [].filter;

	$.type = function(obj) {
		return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
	};
	/**
	 * mui isArray
	 */
	$.isArray = Array.isArray ||
		function(object) {
			return object instanceof Array;
		};
	/**
	 * mui isArrayLike
	 * @param {Object} obj
	 */
	$.isArrayLike = function(obj) {
		var length = !!obj && "length" in obj && obj.length;
		var type = $.type(obj);
		if (type === "function" || $.isWindow(obj)) {
			return false;
		}
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj;
	};
	/**
	 * mui isWindow(需考虑obj为undefined的情况)
	 */
	$.isWindow = function(obj) {
		return obj != null && obj === obj.window;
	};
	/**
	 * mui isObject
	 */
	$.isObject = function(obj) {
		return $.type(obj) === "object";
	};
	/**
	 * mui isPlainObject
	 */
	$.isPlainObject = function(obj) {
		return $.isObject(obj) && !$.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
	};
	/**
	 * mui isEmptyObject
	 * @param {Object} o
	 */
	$.isEmptyObject = function(o) {
		for (var p in o) {
			if (p !== undefined) {
				return false;
			}
		}
		return true;
	};
	/**
	 * mui isFunction
	 */
	$.isFunction = function(value) {
		return $.type(value) === "function";
	};
	/**
	 * mui querySelectorAll
	 * @param {type} selector
	 * @param {type} context
	 * @returns {Array}
	 */
	$.qsa = function(selector, context) {
		context = context || document;
		return $.slice.call(classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
	};
	/**
	 * ready(DOMContentLoaded)
	 * @param {type} callback
	 * @returns {_L6.$}
	 */
	$.ready = function(callback) {
		if (readyRE.test(document.readyState)) {
			callback($);
		} else {
			document.addEventListener('DOMContentLoaded', function() {
				callback($);
			}, false);
		}
		return this;
	};
	/**
	 * 将 fn 缓存一段时间后, 再被调用执行
	 * 此方法为了避免在 ms 段时间内, 执行 fn 多次. 常用于 resize , scroll , mousemove 等连续性事件中;
	 * 当 ms 设置为 -1, 表示立即执行 fn, 即和直接调用 fn 一样;
	 * 调用返回函数的 stop 停止最后一次的 buffer 效果
	 * @param {Object} fn
	 * @param {Object} ms
	 * @param {Object} context
	 */
	$.buffer = function(fn, ms, context) {
		var timer;
		var lastStart = 0;
		var lastEnd = 0;
		var ms = ms || 150;

		function run() {
			if (timer) {
				timer.cancel();
				timer = 0;
			}
			lastStart = $.now();
			fn.apply(context || this, arguments);
			lastEnd = $.now();
		}

		return $.extend(function() {
			if (
				(!lastStart) || // 从未运行过
				(lastEnd >= lastStart && $.now() - lastEnd > ms) || // 上次运行成功后已经超过ms毫秒
				(lastEnd < lastStart && $.now() - lastStart > ms * 8) // 上次运行或未完成，后8*ms毫秒
			) {
				run();
			} else {
				if (timer) {
					timer.cancel();
				}
				timer = $.later(run, ms, null, arguments);
			}
		}, {
			stop: function() {
				if (timer) {
					timer.cancel();
					timer = 0;
				}
			}
		});
	};
	/**
	 * each
	 * @param {type} elements
	 * @param {type} callback
	 * @returns {_L8.$}
	 */
	$.each = function(elements, callback, hasOwnProperty) {
		if (!elements) {
			return this;
		}
		if (typeof elements.length === 'number') {
			[].every.call(elements, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
		} else {
			for (var key in elements) {
				if (hasOwnProperty) {
					if (elements.hasOwnProperty(key)) {
						if (callback.call(elements[key], key, elements[key]) === false) return elements;
					}
				} else {
					if (callback.call(elements[key], key, elements[key]) === false) return elements;
				}
			}
		}
		return this;
	};
	$.focus = function(element) {
		if ($.os.ios) {
			setTimeout(function() {
				element.focus();
			}, 10);
		} else {
			element.focus();
		}
	};
	/**
	 * trigger event
	 * @param {type} element
	 * @param {type} eventType
	 * @param {type} eventData
	 * @returns {_L8.$}
	 */
	$.trigger = function(element, eventType, eventData) {
		element.dispatchEvent(new CustomEvent(eventType, {
			detail: eventData,
			bubbles: true,
			cancelable: true
		}));
		return this;
	};
	/**
	 * getStyles
	 * @param {type} element
	 * @param {type} property
	 * @returns {styles}
	 */
	$.getStyles = function(element, property) {
		var styles = element.ownerDocument.defaultView.getComputedStyle(element, null);
		if (property) {
			return styles.getPropertyValue(property) || styles[property];
		}
		return styles;
	};
	/**
	 * parseTranslate
	 * @param {type} translateString
	 * @param {type} position
	 * @returns {Object}
	 */
	$.parseTranslate = function(translateString, position) {
		var result = translateString.match(translateRE || '');
		if (!result || !result[1]) {
			result = ['', '0,0,0'];
		}
		result = result[1].split(",");
		result = {
			x: parseFloat(result[0]),
			y: parseFloat(result[1]),
			z: parseFloat(result[2])
		};
		if (position && result.hasOwnProperty(position)) {
			return result[position];
		}
		return result;
	};
	/**
	 * parseTranslateMatrix
	 * @param {type} translateString
	 * @param {type} position
	 * @returns {Object}
	 */
	$.parseTranslateMatrix = function(translateString, position) {
		var matrix = translateString.match(translateMatrixRE);
		var is3D = matrix && matrix[1];
		if (matrix) {
			matrix = matrix[2].split(",");
			if (is3D === "3d")
				matrix = matrix.slice(12, 15);
			else {
				matrix.push(0);
				matrix = matrix.slice(4, 7);
			}
		} else {
			matrix = [0, 0, 0];
		}
		var result = {
			x: parseFloat(matrix[0]),
			y: parseFloat(matrix[1]),
			z: parseFloat(matrix[2])
		};
		if (position && result.hasOwnProperty(position)) {
			return result[position];
		}
		return result;
	};
	$.hooks = {};
	$.addAction = function(type, hook) {
		var hooks = $.hooks[type];
		if (!hooks) {
			hooks = [];
		}
		hook.index = hook.index || 1000;
		hooks.push(hook);
		hooks.sort(function(a, b) {
			return a.index - b.index;
		});
		$.hooks[type] = hooks;
		return $.hooks[type];
	};
	$.doAction = function(type, callback) {
		if ($.isFunction(callback)) { //指定了callback
			$.each($.hooks[type], callback);
		} else { //未指定callback，直接执行
			$.each($.hooks[type], function(index, hook) {
				return !hook.handle();
			});
		}
	};
	/**
	 * setTimeout封装
	 * @param {Object} fn
	 * @param {Object} when
	 * @param {Object} context
	 * @param {Object} data
	 */
	$.later = function(fn, when, context, data) {
		when = when || 0;
		var m = fn;
		var d = data;
		var f;
		var r;

		if (typeof fn === 'string') {
			m = context[fn];
		}

		f = function() {
			m.apply(context, $.isArray(d) ? d : [d]);
		};

		r = setTimeout(f, when);

		return {
			id: r,
			cancel: function() {
				clearTimeout(r);
			}
		};
	};
	$.now = Date.now || function() {
		return +new Date();
	};
	var class2type = {};
	$.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function(i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});
	if (window.JSON) {
		$.parseJSON = JSON.parse;
	}
	/**
	 * $.fn
	 */
	$.fn = {
		each: function(callback) {
			[].every.call(this, function(el, idx) {
				return callback.call(el, idx, el) !== false;
			});
			return this;
		}
	};

	return $;
})(document);



(function($, window) {
	function detect(ua) {
		this.os = {};
		var funcs = [

			function() { //wechat
				var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
				if (wechat) { //wechat
					this.os.wechat = {
						version: wechat[2].replace(/_/g, '.')
					};
				}
				return false;
			},
			function() { //android
				var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
				if (android) {
					this.os.android = true;
					this.os.version = android[2];

					this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
				}
				return this.os.android === true;
			},
			function() { //ios
				var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
				if (iphone) { //iphone
					this.os.ios = this.os.iphone = true;
					this.os.version = iphone[2].replace(/_/g, '.');
				} else {
					var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
					if (ipad) { //ipad
						this.os.ios = this.os.ipad = true;
						this.os.version = ipad[2].replace(/_/g, '.');
					}
				}
				return this.os.ios === true;
			}
		];
		[].every.call(funcs, function(func) {
			return !func.call($);
		});
	}
	detect.call($, navigator.userAgent);
})(mui, window);
/**
 * $.os.plus
 * @param {type} $
 * @returns {undefined}
 */
(function($, document) {
	function detect(ua) {
		this.os = this.os || {};
		var plus = ua.match(/Html5Plus/i); //TODO 5\+Browser?
		if (plus) {
			this.os.plus = true;
			$(function() {
				document.body.classList.add('mui-plus');
			});
			if (ua.match(/StreamApp/i)) { //TODO 最好有流应用自己的标识
				this.os.stream = true;
				$(function() {
					document.body.classList.add('mui-plus-stream');
				});
			}
		}
	}
	detect.call($, navigator.userAgent);
})(mui, document);











(function($) {
	var initializing = false,
		fnTest = /xyz/.test(function() {
			xyz;
		}) ? /\b_super\b/ : /.*/;

	var Class = function() {};
	Class.extend = function(prop) {
		var _super = this.prototype;
		initializing = true;
		var prototype = new this();
		initializing = false;
		for (var name in prop) {
			prototype[name] = typeof prop[name] == "function" &&
				typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn) {
					return function() {
						var tmp = this._super;

						this._super = _super[name];

						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, prop[name]) :
				prop[name];
		}
		function Class() {
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}
		Class.prototype = prototype;
		Class.prototype.constructor = Class;
		Class.extend = this;
		return Class;
	};
	$.Class = Class;
})(mui);













/**
 * mui.init
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
	$.global = $.options = {
		gestureConfig: {
			tap: true,
			doubletap: false,
			longtap: false,
			hold: false,
			flick: true,
			swipe: true,
			drag: true,
			pinch: false
		}
	};
	/**
	 *
	 * @param {type} options
	 * @returns {undefined}
	 */
	$.initGlobal = function(options) {
		$.options = $.extend(true, $.global, options);
		return this;
	};
	var inits = {};

	var isInitialized = false;
	//TODO 自动调用init?因为用户自己调用init的时机可能不确定，如果晚于自动init，则会有潜在问题
	//	$.ready(function() {
	//		setTimeout(function() {
	//			if (!isInitialized) {
	//				$.init();
	//			}
	//		}, 300);
	//	});
	/**
	 * 单页配置 初始化
	 * @param {object} options
	 */
	$.init = function(options) {
		isInitialized = true;
		$.options = $.extend(true, $.global, options || {});
		$.ready(function() {
			$.doAction('inits', function(index, init) {
				var isInit = !!(!inits[init.name] || init.repeat);
				if (isInit) {
					init.handle.call($);
					inits[init.name] = true;
				}
			});
		});
		return this;
	};

	/**
	 * 增加初始化执行流程
	 * @param {function} init
	 */
	$.addInit = function(init) {
		return $.addAction('inits', init);
	};


})(mui);





/**
 * mui target(action>popover>modal>tab>toggle)
 */
(function($, window, document) {
	/**
	 * targets
	 */
	$.targets = {};
	/**
	 * target handles
	 */
	$.targetHandles = [];
	/**
	 * register target
	 * @param {type} target
	 * @returns {$.targets}
	 */
	$.registerTarget = function(target) {

		target.index = target.index || 1000;

		$.targetHandles.push(target);

		$.targetHandles.sort(function(a, b) {
			return a.index - b.index;
		});

		return $.targetHandles;
	};
	window.addEventListener($.EVENT_START, function(event) {
		var target = event.target;
		var founds = {};
		for (; target && target !== document; target = target.parentNode) {
			var isFound = false;
			$.each($.targetHandles, function(index, targetHandle) {
				var name = targetHandle.name;
				if (!isFound && !founds[name] && targetHandle.hasOwnProperty('handle')) {
					$.targets[name] = targetHandle.handle(event, target);
					if ($.targets[name]) {
						founds[name] = true;
						if (targetHandle.isContinue !== true) {
							isFound = true;
						}
					}
				} else {
					if (!founds[name]) {
						if (targetHandle.isReset !== false)
							$.targets[name] = false;
					}
				}
			});
			if (isFound) {
				break;
			}
		}
	});
	window.addEventListener('click', function(event) { //解决touch与click的target不一致的问题(比如链接边缘点击时，touch的target为html，而click的target为A)
		var target = event.target;
		var isFound = false;
		for (; target && target !== document; target = target.parentNode) {
			if (target.tagName === 'A') {
				$.each($.targetHandles, function(index, targetHandle) {
					var name = targetHandle.name;
					if (targetHandle.hasOwnProperty('handle')) {
						if (targetHandle.handle(event, target)) {
							isFound = true;
							event.preventDefault();
							return false;
						}
					}
				});
				if (isFound) {
					break;
				}
			}
		}
	});
})(mui, window, document);







/**
 * Popovers
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} name
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, name) {

	var CLASS_POPOVER = 'mui-popover';
	var CLASS_POPOVER_ARROW = 'mui-popover-arrow';
	var CLASS_ACTION_POPOVER = 'mui-popover-action';
	var CLASS_BACKDROP = 'mui-backdrop';
	var CLASS_BAR_POPOVER = 'mui-bar-popover';
	var CLASS_BAR_BACKDROP = 'mui-bar-backdrop';
	var CLASS_ACTION_BACKDROP = 'mui-backdrop-action';
	var CLASS_ACTIVE = 'mui-active';
	var CLASS_BOTTOM = 'mui-bottom';



	var handle = function(event, target) {
		if (target.tagName === 'A' && target.hash) {
			$.targets._popover = document.getElementById(target.hash.replace('#', ''));
			if ($.targets._popover && $.targets._popover.classList.contains(CLASS_POPOVER)) {
				return target;
			} else {
				$.targets._popover = null;
			}
		}
		return false;
	};

	$.registerTarget({
		name: name,
		index: 60,
		handle: handle,
		target: false,
		isReset: false,
		isContinue: true
	});

	var fixedPopoverScroll = function(isPopoverScroll) {
		//		if (isPopoverScroll) {
		//			document.body.setAttribute('style', 'overflow:hidden;');
		//		} else {
		//			document.body.setAttribute('style', '');
		//		}
	};
	var onPopoverShown = function(e) {
		this.removeEventListener('webkitTransitionEnd', onPopoverShown);
		this.addEventListener($.EVENT_MOVE, $.preventDefault);
		$.trigger(this, 'shown', this);
	}
	var onPopoverHidden = function(e) {
		setStyle(this, 'none');
		this.removeEventListener('webkitTransitionEnd', onPopoverHidden);
		this.removeEventListener($.EVENT_MOVE, $.preventDefault);
		fixedPopoverScroll(false);
		$.trigger(this, 'hidden', this);
	};

	var backdrop = (function() {
		var element = document.createElement('div');
		element.classList.add(CLASS_BACKDROP);
		element.addEventListener($.EVENT_MOVE, $.preventDefault);
		element.addEventListener('tap', function(e) {
			var popover = $.targets._popover;
			if (popover) {
				popover.addEventListener('webkitTransitionEnd', onPopoverHidden);
				popover.classList.remove(CLASS_ACTIVE);
				removeBackdrop(popover);
				document.body.setAttribute('style', ''); //webkitTransitionEnd有时候不触发？
			}
		});

		return element;
	}());
	var removeBackdropTimer;
	var removeBackdrop = function(popover) {
		backdrop.setAttribute('style', 'opacity:0');
		$.targets.popover = $.targets._popover = null; //reset
		removeBackdropTimer = $.later(function() {
			if (!popover.classList.contains(CLASS_ACTIVE) && backdrop.parentNode && backdrop.parentNode === document.body) {
				document.body.removeChild(backdrop);
			}
		}, 350);
	};
	window.addEventListener('tap', function(e) {
		if (!$.targets.popover) {
			return;
		}
		var toggle = false;
		var target = e.target;
		for (; target && target !== document; target = target.parentNode) {
			if (target === $.targets.popover) {
				toggle = true;
			}
		}
		if (toggle) {
			e.detail.gesture.preventDefault(); //fixed hashchange
			togglePopover($.targets._popover, $.targets.popover);
		}

	});

	var togglePopover = function(popover, anchor, state) {
		if ((state === 'show' && popover.classList.contains(CLASS_ACTIVE)) || (state === 'hide' && !popover.classList.contains(CLASS_ACTIVE))) {
			return;
		}
		removeBackdropTimer && removeBackdropTimer.cancel(); //取消remove的timer
		//remove一遍，以免来回快速切换，导致webkitTransitionEnd不触发，无法remove
		popover.removeEventListener('webkitTransitionEnd', onPopoverShown);
		popover.removeEventListener('webkitTransitionEnd', onPopoverHidden);
		backdrop.classList.remove(CLASS_BAR_BACKDROP);
		backdrop.classList.remove(CLASS_ACTION_BACKDROP);
		var _popover = document.querySelector('.mui-popover.mui-active');
		if (_popover) {
			//			_popover.setAttribute('style', '');
			_popover.addEventListener('webkitTransitionEnd', onPopoverHidden);
			_popover.classList.remove(CLASS_ACTIVE);
			//			_popover.removeEventListener('webkitTransitionEnd', onPopoverHidden);
			//			fixedPopoverScroll(false);
			//同一个弹出则直接返回，解决同一个popover的toggle
			if (popover === _popover) {
				removeBackdrop(_popover);
				return;
			}
		}
		var isActionSheet = false;
		if (popover.classList.contains(CLASS_BAR_POPOVER) || popover.classList.contains(CLASS_ACTION_POPOVER)) { //navBar
			if (popover.classList.contains(CLASS_ACTION_POPOVER)) { //action sheet popover
				isActionSheet = true;
				backdrop.classList.add(CLASS_ACTION_BACKDROP);
			} else { //bar popover
				backdrop.classList.add(CLASS_BAR_BACKDROP);
				//				if (anchor) {
				//					if (anchor.parentNode) {
				//						var offsetWidth = anchor.offsetWidth;
				//						var offsetLeft = anchor.offsetLeft;
				//						var innerWidth = window.innerWidth;
				//						popover.style.left = (Math.min(Math.max(offsetLeft, defaultPadding), innerWidth - offsetWidth - defaultPadding)) + "px";
				//					} else {
				//						//TODO anchor is position:{left,top,bottom,right}
				//					}
				//				}
			}
		}
		setStyle(popover, 'block'); //actionsheet transform
		popover.offsetHeight;
		popover.classList.add(CLASS_ACTIVE);
		backdrop.setAttribute('style', '');
		document.body.appendChild(backdrop);
		fixedPopoverScroll(true);
		calPosition(popover, anchor, isActionSheet); //position
		backdrop.classList.add(CLASS_ACTIVE);
		popover.addEventListener('webkitTransitionEnd', onPopoverShown);
	};
	var setStyle = function(popover, display, top, left) {
		var style = popover.style;
		if (typeof display !== 'undefined')
			style.display = display;
		if (typeof top !== 'undefined')
			style.top = top + 'px';
		if (typeof left !== 'undefined')
			style.left = left + 'px';
	};
	var calPosition = function(popover, anchor, isActionSheet) {
		if (!popover || !anchor) {
			return;
		}

		if (isActionSheet) { //actionsheet
			setStyle(popover, 'block')
			return;
		}

		var wWidth = window.innerWidth;
		var wHeight = window.innerHeight;

		var pWidth = popover.offsetWidth;
		var pHeight = popover.offsetHeight;

		var aWidth = anchor.offsetWidth;
		var aHeight = anchor.offsetHeight;
		var offset = $.offset(anchor);

		var arrow = popover.querySelector('.' + CLASS_POPOVER_ARROW);
		if (!arrow) {
			arrow = document.createElement('div');
			arrow.className = CLASS_POPOVER_ARROW;
			popover.appendChild(arrow);
		}
		var arrowSize = arrow && arrow.offsetWidth / 2 || 0;



		var pTop = 0;
		var pLeft = 0;
		var diff = 0;
		var arrowLeft = 0;
		var defaultPadding = popover.classList.contains(CLASS_ACTION_POPOVER) ? 0 : 5;

		var position = 'top';
		if ((pHeight + arrowSize) < (offset.top - window.pageYOffset)) { //top
			pTop = offset.top - pHeight - arrowSize;
		} else if ((pHeight + arrowSize) < (wHeight - (offset.top - window.pageYOffset) - aHeight)) { //bottom
			position = 'bottom';
			pTop = offset.top + aHeight + arrowSize;
		} else { //middle
			position = 'middle';
			pTop = Math.max((wHeight - pHeight) / 2 + window.pageYOffset, 0);
			pLeft = Math.max((wWidth - pWidth) / 2 + window.pageXOffset, 0);
		}
		if (position === 'top' || position === 'bottom') {
			pLeft = aWidth / 2 + offset.left - pWidth / 2;
			diff = pLeft;
			if (pLeft < defaultPadding) pLeft = defaultPadding;
			if (pLeft + pWidth > wWidth) pLeft = wWidth - pWidth - defaultPadding;

			if (arrow) {
				if (position === 'top') {
					arrow.classList.add(CLASS_BOTTOM);
				} else {
					arrow.classList.remove(CLASS_BOTTOM);
				}
				diff = diff - pLeft;
				arrowLeft = (pWidth / 2 - arrowSize / 2 + diff);
				arrowLeft = Math.max(Math.min(arrowLeft, pWidth - arrowSize * 2 - 6), 6);
				arrow.setAttribute('style', 'left:' + arrowLeft + 'px');
			}
		} else if (position === 'middle') {
			arrow.setAttribute('style', 'display:none');
		}
		setStyle(popover, 'block', pTop, pLeft);
	};

	$.createMask = function(callback) {
		var element = document.createElement('div');
		element.classList.add(CLASS_BACKDROP);
		element.addEventListener($.EVENT_MOVE, $.preventDefault);
		element.addEventListener('tap', function() {
			mask.close();
		});
		var mask = [element];
		mask._show = false;
		mask.show = function() {
			mask._show = true;
			element.setAttribute('style', 'opacity:1');
			document.body.appendChild(element);
			return mask;
		};
		mask._remove = function() {
			if (mask._show) {
				mask._show = false;
				element.setAttribute('style', 'opacity:0');
				$.later(function() {
					var body = document.body;
					element.parentNode === body && body.removeChild(element);
				}, 350);
			}
			return mask;
		};
		mask.close = function() {
			if (callback) {
				if (callback() !== false) {
					mask._remove();
				}
			} else {
				mask._remove();
			}
		};
		return mask;
	};
	$.fn.popover = function() {
		var args = arguments;
		this.each(function() {
			$.targets._popover = this;
			if (args[0] === 'show' || args[0] === 'hide' || args[0] === 'toggle') {
				togglePopover(this, args[1], args[0]);
			}
		});
	};

})(mui, window, document, 'popover');



/**
 * mui namespace(optimization)
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
  $.namespace = 'mui';
  $.classNamePrefix = $.namespace + '-';
  $.classSelectorPrefix = '.' + $.classNamePrefix;
  /**
   * 返回正确的className
   * @param {type} className
   * @returns {String}
   */
  $.className = function(className) {
    return $.classNamePrefix + className;
  };
  /**
   * 返回正确的classSelector
   * @param {type} classSelector
   * @returns {String}
   */
  $.classSelector = function(classSelector) {
    return classSelector.replace(/\./g, $.classSelectorPrefix);
  };
  /**
         * 返回正确的eventName
         * @param {type} event
         * @param {type} module
         * @returns {String}
         */
  $.eventName = function(event, module) {
    return event + ($.namespace ? ('.' + $.namespace) : '') + ( module ? ('.' + module) : '');
  };
})(mui);















/**
 * 仅提供简单的on，off(仅支持事件委托，不支持当前元素绑定，当前元素绑定请直接使用addEventListener,removeEventListener)
 * @param {Object} $
 */
(function($) {
	if ('ontouchstart' in window) {
		$.isTouchable = true;
		$.EVENT_START = 'touchstart';
		$.EVENT_MOVE = 'touchmove';
		$.EVENT_END = 'touchend';
	} else {
		$.isTouchable = false;
		$.EVENT_START = 'mousedown';
		$.EVENT_MOVE = 'mousemove';
		$.EVENT_END = 'mouseup';
	}
	$.EVENT_CANCEL = 'touchcancel';
	$.EVENT_CLICK = 'click';

	var _mid = 1;
	var delegates = {};
	//需要wrap的函数
	var eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};
	//默认true返回函数
	var returnTrue = function() {
		return true
	};
	//默认false返回函数
	var returnFalse = function() {
		return false
	};
	//wrap浏览器事件
	var compatible = function(event, target) {
		if (!event.detail) {
			event.detail = {
				currentTarget: target
			};
		} else {
			event.detail.currentTarget = target;
		}
		$.each(eventMethods, function(name, predicate) {
			var sourceMethod = event[name];
			event[name] = function() {
				this[predicate] = returnTrue;
				return sourceMethod && sourceMethod.apply(event, arguments)
			}
			event[predicate] = returnFalse;
		}, true);
		return event;
	};
	//简单的wrap对象_mid
	var mid = function(obj) {
		return obj && (obj._mid || (obj._mid = _mid++));
	};
	//事件委托对象绑定的事件回调列表
	var delegateFns = {};
	//返回事件委托的wrap事件回调
	var delegateFn = function(element, event, selector, callback) {
		return function(e) {
			//same event
			var callbackObjs = delegates[element._mid][event];
			var handlerQueue = [];
			var target = e.target;
			var selectorAlls = {};
			for (; target && target !== document; target = target.parentNode) {
				if (target === element) {
					break;
				}
				if (~['click', 'tap', 'doubletap', 'longtap', 'hold'].indexOf(event) && (target.disabled || target.classList.contains($.className('disabled')))) {
					break;
				}
				var matches = {};
				$.each(callbackObjs, function(selector, callbacks) { //same selector
					selectorAlls[selector] || (selectorAlls[selector] = $.qsa(selector, element));
					if (selectorAlls[selector] && ~(selectorAlls[selector]).indexOf(target)) {
						if (!matches[selector]) {
							matches[selector] = callbacks;
						}
					}
				}, true);
				if (!$.isEmptyObject(matches)) {
					handlerQueue.push({
						element: target,
						handlers: matches
					});
				}
			}
			selectorAlls = null;
			e = compatible(e); //compatible event
			$.each(handlerQueue, function(index, handler) {
				target = handler.element;
				var tagName = target.tagName;
				if (event === 'tap' && (tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'SELECT')) {
					e.preventDefault();
					e.detail && e.detail.gesture && e.detail.gesture.preventDefault();
				}
				$.each(handler.handlers, function(index, handler) {
					$.each(handler, function(index, callback) {
						if (callback.call(target, e) === false) {
							e.preventDefault();
							e.stopPropagation();
						}
					}, true);
				}, true)
				if (e.isPropagationStopped()) {
					return false;
				}
			}, true);
		};
	};
	var findDelegateFn = function(element, event) {
		var delegateCallbacks = delegateFns[mid(element)];
		var result = [];
		if (delegateCallbacks) {
			result = [];
			if (event) {
				var filterFn = function(fn) {
					return fn.type === event;
				}
				return delegateCallbacks.filter(filterFn);
			} else {
				result = delegateCallbacks;
			}
		}
		return result;
	};
	var preventDefaultException = /^(INPUT|TEXTAREA|BUTTON|SELECT)$/;
	/**
	 * mui delegate events
	 * @param {type} event
	 * @param {type} selector
	 * @param {type} callback
	 * @returns {undefined}
	 */
	$.fn.on = function(event, selector, callback) { //仅支持简单的事件委托,主要是tap事件使用，类似mouse,focus之类暂不封装支持
		return this.each(function() {
			var element = this;
			mid(element);
			mid(callback);
			var isAddEventListener = false;
			var delegateEvents = delegates[element._mid] || (delegates[element._mid] = {});
			var delegateCallbackObjs = delegateEvents[event] || ((delegateEvents[event] = {}));
			if ($.isEmptyObject(delegateCallbackObjs)) {
				isAddEventListener = true;
			}
			var delegateCallbacks = delegateCallbackObjs[selector] || (delegateCallbackObjs[selector] = []);
			delegateCallbacks.push(callback);
			if (isAddEventListener) {
				var delegateFnArray = delegateFns[mid(element)];
				if (!delegateFnArray) {
					delegateFnArray = [];
				}
				var delegateCallback = delegateFn(element, event, selector, callback);
				delegateFnArray.push(delegateCallback);
				delegateCallback.i = delegateFnArray.length - 1;
				delegateCallback.type = event;
				delegateFns[mid(element)] = delegateFnArray;
				element.addEventListener(event, delegateCallback);
				if (event === 'tap') { //TODO 需要找个更好的解决方案
					element.addEventListener('click', function(e) {
						if (e.target) {
							var tagName = e.target.tagName;
							if (!preventDefaultException.test(tagName)) {
								if (tagName === 'A') {
									var href = e.target.href;
									if (!(href && ~href.indexOf('tel:'))) {
										e.preventDefault();
									}
								} else {
									e.preventDefault();
								}
							}
						}
					});
				}
			}
		});
	};
	$.fn.off = function(event, selector, callback) {
		return this.each(function() {
			var _mid = mid(this);
			if (!event) { //mui(selector).off();
				delegates[_mid] && delete delegates[_mid];
			} else if (!selector) { //mui(selector).off(event);
				delegates[_mid] && delete delegates[_mid][event];
			} else if (!callback) { //mui(selector).off(event,selector);
				delegates[_mid] && delegates[_mid][event] && delete delegates[_mid][event][selector];
			} else { //mui(selector).off(event,selector,callback);
				var delegateCallbacks = delegates[_mid] && delegates[_mid][event] && delegates[_mid][event][selector];
				$.each(delegateCallbacks, function(index, delegateCallback) {
					if (mid(delegateCallback) === mid(callback)) {
						delegateCallbacks.splice(index, 1);
						return false;
					}
				}, true);
			}
			if (delegates[_mid]) {
				//如果off掉了所有当前element的指定的event事件，则remove掉当前element的delegate回调
				if ((!delegates[_mid][event] || $.isEmptyObject(delegates[_mid][event]))) {
					findDelegateFn(this, event).forEach(function(fn) {
						this.removeEventListener(fn.type, fn);
						delete delegateFns[_mid][fn.i];
					}.bind(this));
				}
			} else {
				//如果delegates[_mid]已不存在，删除所有
				findDelegateFn(this).forEach(function(fn) {
					this.removeEventListener(fn.type, fn);
					delete delegateFns[_mid][fn.i];
				}.bind(this));
			}
		});

	};
})(mui);




/**
 * mui gestures
 * @param {type} $
 * @param {type} window
 * @returns {undefined}
 */
(function($, window) {
	$.gestures = {
		session: {}
	};
	/**
	 * Gesture preventDefault
	 * @param {type} e
	 * @returns {undefined}
	 */
	$.preventDefault = function(e) {
		e.preventDefault();
	};
	/**
	 * Gesture stopPropagation
	 * @param {type} e
	 * @returns {undefined}
	 */
	$.stopPropagation = function(e) {
		e.stopPropagation();
	};

	/**
	 * register gesture
	 * @param {type} gesture
	 * @returns {$.gestures}
	 */
	$.addGesture = function(gesture) {
		return $.addAction('gestures', gesture);

	};

	var round = Math.round;
	var abs = Math.abs;
	var sqrt = Math.sqrt;
	var atan = Math.atan;
	var atan2 = Math.atan2;
	/**
	 * distance
	 * @param {type} p1
	 * @param {type} p2
	 * @returns {Number}
	 */
	var getDistance = function(p1, p2, props) {
		if (!props) {
			props = ['x', 'y'];
		}
		var x = p2[props[0]] - p1[props[0]];
		var y = p2[props[1]] - p1[props[1]];
		return sqrt((x * x) + (y * y));
	};
	/**
	 * scale
	 * @param {Object} starts
	 * @param {Object} moves
	 */
	var getScale = function(starts, moves) {
		if (starts.length >= 2 && moves.length >= 2) {
			var props = ['pageX', 'pageY'];
			return getDistance(moves[1], moves[0], props) / getDistance(starts[1], starts[0], props);
		}
		return 1;
	};
	/**
	 * angle
	 * @param {type} p1
	 * @param {type} p2
	 * @returns {Number}
	 */
	var getAngle = function(p1, p2, props) {
		if (!props) {
			props = ['x', 'y'];
		}
		var x = p2[props[0]] - p1[props[0]];
		var y = p2[props[1]] - p1[props[1]];
		return atan2(y, x) * 180 / Math.PI;
	};
	/**
	 * direction
	 * @param {Object} x
	 * @param {Object} y
	 */
	var getDirection = function(x, y) {
		if (x === y) {
			return '';
		}
		if (abs(x) >= abs(y)) {
			return x > 0 ? 'left' : 'right';
		}
		return y > 0 ? 'up' : 'down';
	};
	/**
	 * rotation
	 * @param {Object} start
	 * @param {Object} end
	 */
	var getRotation = function(start, end) {
		var props = ['pageX', 'pageY'];
		return getAngle(end[1], end[0], props) - getAngle(start[1], start[0], props);
	};
	/**
	 * px per ms
	 * @param {Object} deltaTime
	 * @param {Object} x
	 * @param {Object} y
	 */
	var getVelocity = function(deltaTime, x, y) {
		return {
			x: x / deltaTime || 0,
			y: y / deltaTime || 0
		};
	};
	/**
	 * detect gestures
	 * @param {type} event
	 * @param {type} touch
	 * @returns {undefined}
	 */
	var detect = function(event, touch) {
		if ($.gestures.stoped) {
			return;
		}
		$.doAction('gestures', function(index, gesture) {
			if (!$.gestures.stoped) {
				if ($.options.gestureConfig[gesture.name] !== false) {
					gesture.handle(event, touch);
				}
			}
		});
	};
	/**
	 * 暂时无用
	 * @param {Object} node
	 * @param {Object} parent
	 */
	var hasParent = function(node, parent) {
		while (node) {
			if (node == parent) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	};

	var uniqueArray = function(src, key, sort) {
		var results = [];
		var values = [];
		var i = 0;

		while (i < src.length) {
			var val = key ? src[i][key] : src[i];
			if (values.indexOf(val) < 0) {
				results.push(src[i]);
			}
			values[i] = val;
			i++;
		}

		if (sort) {
			if (!key) {
				results = results.sort();
			} else {
				results = results.sort(function sortUniqueArray(a, b) {
					return a[key] > b[key];
				});
			}
		}

		return results;
	};
	var getMultiCenter = function(touches) {
		var touchesLength = touches.length;
		if (touchesLength === 1) {
			return {
				x: round(touches[0].pageX),
				y: round(touches[0].pageY)
			};
		}

		var x = 0;
		var y = 0;
		var i = 0;
		while (i < touchesLength) {
			x += touches[i].pageX;
			y += touches[i].pageY;
			i++;
		}

		return {
			x: round(x / touchesLength),
			y: round(y / touchesLength)
		};
	};
	var multiTouch = function() {
		return $.options.gestureConfig.pinch;
	};
	var copySimpleTouchData = function(touch) {
		var touches = [];
		var i = 0;
		while (i < touch.touches.length) {
			touches[i] = {
				pageX: round(touch.touches[i].pageX),
				pageY: round(touch.touches[i].pageY)
			};
			i++;
		}
		return {
			timestamp: $.now(),
			gesture: touch.gesture,
			touches: touches,
			center: getMultiCenter(touch.touches),
			deltaX: touch.deltaX,
			deltaY: touch.deltaY
		};
	};

	var calDelta = function(touch) {
		var session = $.gestures.session;
		var center = touch.center;
		var offset = session.offsetDelta || {};
		var prevDelta = session.prevDelta || {};
		var prevTouch = session.prevTouch || {};

		if (touch.gesture.type === $.EVENT_START || touch.gesture.type === $.EVENT_END) {
			prevDelta = session.prevDelta = {
				x: prevTouch.deltaX || 0,
				y: prevTouch.deltaY || 0
			};

			offset = session.offsetDelta = {
				x: center.x,
				y: center.y
			};
		}
		touch.deltaX = prevDelta.x + (center.x - offset.x);
		touch.deltaY = prevDelta.y + (center.y - offset.y);
	};
	var calTouchData = function(touch) {
		var session = $.gestures.session;
		var touches = touch.touches;
		var touchesLength = touches.length;

		if (!session.firstTouch) {
			session.firstTouch = copySimpleTouchData(touch);
		}

		if (multiTouch() && touchesLength > 1 && !session.firstMultiTouch) {
			session.firstMultiTouch = copySimpleTouchData(touch);
		} else if (touchesLength === 1) {
			session.firstMultiTouch = false;
		}

		var firstTouch = session.firstTouch;
		var firstMultiTouch = session.firstMultiTouch;
		var offsetCenter = firstMultiTouch ? firstMultiTouch.center : firstTouch.center;

		var center = touch.center = getMultiCenter(touches);
		touch.timestamp = $.now();
		touch.deltaTime = touch.timestamp - firstTouch.timestamp;

		touch.angle = getAngle(offsetCenter, center);
		touch.distance = getDistance(offsetCenter, center);

		calDelta(touch);

		touch.offsetDirection = getDirection(touch.deltaX, touch.deltaY);

		touch.scale = firstMultiTouch ? getScale(firstMultiTouch.touches, touches) : 1;
		touch.rotation = firstMultiTouch ? getRotation(firstMultiTouch.touches, touches) : 0;

		calIntervalTouchData(touch);

	};
	var CAL_INTERVAL = 25;
	var calIntervalTouchData = function(touch) {
		var session = $.gestures.session;
		var last = session.lastInterval || touch;
		var deltaTime = touch.timestamp - last.timestamp;
		var velocity;
		var velocityX;
		var velocityY;
		var direction;

		if (touch.gesture.type != $.EVENT_CANCEL && (deltaTime > CAL_INTERVAL || last.velocity === undefined)) {
			var deltaX = last.deltaX - touch.deltaX;
			var deltaY = last.deltaY - touch.deltaY;

			var v = getVelocity(deltaTime, deltaX, deltaY);
			velocityX = v.x;
			velocityY = v.y;
			velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
			direction = getDirection(deltaX, deltaY) || last.direction;

			session.lastInterval = touch;
		} else {
			velocity = last.velocity;
			velocityX = last.velocityX;
			velocityY = last.velocityY;
			direction = last.direction;
		}

		touch.velocity = velocity;
		touch.velocityX = velocityX;
		touch.velocityY = velocityY;
		touch.direction = direction;
	};
	var targetIds = {};
	var convertTouches = function(touches) {
		for (var i = 0; i < touches.length; i++) {
			!touches['identifier'] && (touches['identifier'] = 0);
		}
		return touches;
	};
	var getTouches = function(event, touch) {
		var allTouches = convertTouches($.slice.call(event.touches || [event]));

		var type = event.type;

		var targetTouches = [];
		var changedTargetTouches = [];

		//当touchstart或touchmove且touches长度为1，直接获得all和changed
		if ((type === $.EVENT_START || type === $.EVENT_MOVE) && allTouches.length === 1) {
			targetIds[allTouches[0].identifier] = true;
			targetTouches = allTouches;
			changedTargetTouches = allTouches;
			touch.target = event.target;
		} else {
			var i = 0;
			var targetTouches = [];
			var changedTargetTouches = [];
			var changedTouches = convertTouches($.slice.call(event.changedTouches || [event]));

			touch.target = event.target;
			var sessionTarget = $.gestures.session.target || event.target;
			targetTouches = allTouches.filter(function(touch) {
				return hasParent(touch.target, sessionTarget);
			});

			if (type === $.EVENT_START) {
				i = 0;
				while (i < targetTouches.length) {
					targetIds[targetTouches[i].identifier] = true;
					i++;
				}
			}

			i = 0;
			while (i < changedTouches.length) {
				if (targetIds[changedTouches[i].identifier]) {
					changedTargetTouches.push(changedTouches[i]);
				}
				if (type === $.EVENT_END || type === $.EVENT_CANCEL) {
					delete targetIds[changedTouches[i].identifier];
				}
				i++;
			}

			if (!changedTargetTouches.length) {
				return false;
			}
		}
		targetTouches = uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true);
		var touchesLength = targetTouches.length;
		var changedTouchesLength = changedTargetTouches.length;
		if (type === $.EVENT_START && touchesLength - changedTouchesLength === 0) { //first
			touch.isFirst = true;
			$.gestures.touch = $.gestures.session = {
				target: event.target
			};
		}
		touch.isFinal = ((type === $.EVENT_END || type === $.EVENT_CANCEL) && (touchesLength - changedTouchesLength === 0));

		touch.touches = targetTouches;
		touch.changedTouches = changedTargetTouches;
		return true;

	};
	var handleTouchEvent = function(event) {
		var touch = {
			gesture: event
		};
		var touches = getTouches(event, touch);
		if (!touches) {
			return;
		}
		calTouchData(touch);
		detect(event, touch);
		$.gestures.session.prevTouch = touch;
		if (event.type === $.EVENT_END && !$.isTouchable) {
			$.gestures.touch = $.gestures.session = {};
		}
	};
	window.addEventListener($.EVENT_START, handleTouchEvent);
	window.addEventListener($.EVENT_MOVE, handleTouchEvent);
	window.addEventListener($.EVENT_END, handleTouchEvent);
	window.addEventListener($.EVENT_CANCEL, handleTouchEvent);
	//fixed hashchange(android)
	window.addEventListener($.EVENT_CLICK, function(e) {
		//TODO 应该判断当前target是不是在targets.popover内部，而不是非要相等
		if (($.os.android || $.os.ios) && (($.targets.popover && e.target === $.targets.popover) || ($.targets.tab) || $.targets.offcanvas || $.targets.modal)) {
			e.preventDefault();
		}
	}, true);


	//增加原生滚动识别
	$.isScrolling = false;
	var scrollingTimeout = null;
	window.addEventListener('scroll', function() {
		$.isScrolling = true;
		scrollingTimeout && clearTimeout(scrollingTimeout);
		scrollingTimeout = setTimeout(function() {
			$.isScrolling = false;
		}, 250);
	});
})(mui, window);


/**
 * mui gesture tap and doubleTap
 * @param {type} $
 * @param {type} name
 * @returns {undefined}
 */
(function($, name) {
	var lastTarget;
	var lastTapTime;
	var handle = function(event, touch) {
		var session = $.gestures.session;
		var options = this.options;
		switch (event.type) {
			case $.EVENT_END:
				if (!touch.isFinal) {
					return;
				}
				var target = session.target;
				if (!target || (target.disabled || (target.classList && target.classList.contains($.className('disabled'))))) {
					return;
				}
				if (touch.distance < options.tapMaxDistance && touch.deltaTime < options.tapMaxTime) {
					if ($.options.gestureConfig.doubletap && lastTarget && (lastTarget === target)) { //same target
						if (lastTapTime && (touch.timestamp - lastTapTime) < options.tapMaxInterval) {
							$.trigger(target, 'doubletap', touch);
							lastTapTime = $.now();
							lastTarget = target;
							return;
						}
					}
					$.trigger(target, name, touch);
					lastTapTime = $.now();
					lastTarget = target;
				}
				break;
		}
	};
	/**
	 * mui gesture tap
	 */
	$.addGesture({
		name: name,
		index: 30,
		handle: handle,
		options: {
			fingers: 1,
			tapMaxInterval: 300,
			tapMaxDistance: 5,
			tapMaxTime: 250
		}
	});
})(mui, 'tap');


export default  mui;
