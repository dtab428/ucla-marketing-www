"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Select and return an element
 */
function Core(selector, container) {
  return typeof selector === "string" ? (container || document).querySelector(selector) : selector || null;
}
/**
 * Select and return an array of elements
 */


Core.$$ = function (selector, container) {
  return typeof selector === "string" ? (container || document).querySelectorAll(selector) : selector || null;
};
/**
 * DOM ready callback function
 */


Core.ready = function (fn) {
  document.addEventListener("DOMContentLoaded", fn);
};
/**
 * Scroll to an element
 */


Core.scrollTo = function (el, options) {
  var offset = !options || options.offset === undefined ? 0 : options.offset;
  var onScreen = !options || options.onScreen === undefined ? false : options.onScreen;
  var top = el.getBoundingClientRect().top;

  if (!onScreen || top < offset || top > window.innerHeight) {
    var pos = top + Core.scrollTop() - offset;
    window.scroll({
      top: pos,
      left: 0,
      behavior: "smooth"
    });
  }
};
/**
 * Get the distance in pixels to the top of the page
 */


Core.scrollTop = function () {
  return document.documentElement.scrollTop || document.body.scrollTop;
};
/**
 * Get the index of an element within its parent
 */


Core.index = function (el) {
  var index = 0;

  while (el = el.previousElementSibling) {
    index++;
  }

  return index;
};
/**
 * Triggers an event on an element
 */


Core.trigger = function (el, name) {
  var event = document.createEvent("HTMLEvents");
  event.initEvent(name, true, false);
  el.dispatchEvent(event);
};
/**
 * Animate an element using css transitions
 */


Core.animate = function (el, duration, props) {
  var old = el.style.transition;
  var transition = "";
  var count = 0;
  var counter = 0;
  var easing = props.ease || "linear";
  var delay = props.delay || 0;
  var complete = props.complete || null;

  for (var key in props) {
    if (key == "ease" || key == "delay" || key == "complete") {
      delete props[key];
      continue;
    }

    var str = key.replace(/([a-z])([A-Z])/g, "$1-$2");
    var tmp = str.toLowerCase() + " " + duration + "s " + easing + " " + delay + "s, ";
    transition += tmp;
    count++;
  }

  el.style.transition = transition.substring(0, transition.length - 2);

  for (var _key in props) {
    var _str = _key.replace(/([a-z])([A-Z])/g, "$1-$2");

    el.style[_key] = props[_key];
  }

  el.addEventListener("transitionend", end);
  var t = setTimeout(end2, duration * 1000 + delay * 1000 + 50);

  function end(e) {
    if (++counter < count || e.target != e.currentTarget) {
      return false;
    }

    clearTimeout(t);
    counter = 0;
    end2();
  }

  function end2() {
    el.removeEventListener("transitionend", end);
    el.style.transition = old;

    if (complete) {
      complete.call();
    }
  }
};
/**
 * Show or hide an element with a slide animation
 */


Core.slideToggle = function (el, complete) {
  var height = el.offsetHeight;
  var padding = parseInt(getComputedStyle(el)["padding-top"], 10) + parseInt(getComputedStyle(el)["padding-bottom"], 10); // Slide up

  if (height - padding > 0) {
    el.style.height = height + "px";
    void el.offsetWidth;
    el.style.height = "0";
    el.addEventListener("transitionend", onEndHide);
  } // Slide down
  else {
    el.style.height = "auto";
    height = el.offsetHeight;
    el.style.height = "0";
    el.style.visibility = "visible";
    void el.offsetWidth;
    el.style.height = height + "px";
    el.addEventListener("transitionend", onEndShow);
  }

  function onEndHide() {
    el.style.visibility = "hidden";
    el.removeEventListener("transitionend", onEndHide);

    if (complete) {
      complete();
    }
  }

  function onEndShow() {
    if (el.offsetHeight - padding > 0) {
      el.style.height = "auto";
    }

    el.removeEventListener("transitionend", onEndShow);

    if (complete) {
      complete();
    }
  }
};
/**
 * Trap focus inside an element
 */


Core.trapFocus = function (el) {
  var focusableElements = [].slice.call(el.querySelectorAll("button, [href], input, select, textarea, [tabindex='0']"));
  focusableElements = focusableElements.filter(function (item) {
    return item.getAttribute("tabindex") != "-1";
  });
  var firstFocusableElement = focusableElements[0];
  var lastFocusableElement = focusableElements[focusableElements.length - 1];
  el.addEventListener("keydown", function (e) {
    var key = e.which || e.keyCode;

    if (key != 9) {
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  });
}; // Add global shortcuts $ and $$


if (!(typeof $ != "undefined")) {
  var $ = Core;
}

var $$ = Core.$$;

var Header = /*#__PURE__*/function () {
  function Header(el) {
    _classCallCheck(this, Header);

    this.el = el;
    this.build();
  }
  /*
   * Build the header
   */


  _createClass(Header, [{
    key: "build",
    value: function build() {
      var _this = this;

      var options = {
        rootMargin: "2px 0px 0px 0px"
      };
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (item) {
          if (item.isIntersecting) {
            _this.el.classList.remove("small");
          } else {
            _this.el.classList.add("small");
          }
        });
      }, options);
      observer.observe(this.el);
    }
  }]);

  return Header;
}();

var Navigation = /*#__PURE__*/function () {
  function Navigation(el) {
    _classCallCheck(this, Navigation);

    this.el = el;
    this.parentIsLink = true;
    this.toggleButton = document.querySelector("#nav-button");
    this.touched = false;
    this.navOpen = false;
    this.build();
  }
  /**
   * Build the navigation
   */


  _createClass(Navigation, [{
    key: "build",
    value: function build() {
      var _this2 = this;

      // Menu button
      this.toggleButton.addEventListener("click", function (e) {
        if (!_this2.isMobileNavOpen()) {
          _this2.open();
        } else {
          _this2.close();
        }
      }); // Close

      document.body.addEventListener("click", function (e) {
        if (!_this2.el.contains(e.target) && _this2.isMobileNavOpen()) {
          _this2.close();
        }
      }); // Esc key

      this.el.addEventListener("keydown", function (e) {
        var key = e.which || e.keyCode;

        if (key == 27) {
          // Close sub nav
          if (!_this2.isMobileNavOpen()) {
            _this2.el.querySelectorAll(".subnav-button").forEach(function (item) {
              item.classList.remove("active");
            });

            _this2.el.querySelectorAll("ul").forEach(function (item) {
              item.classList.remove("active");
            });
          } // Close mobile nav


          _this2.close();
        }
      }); // Remove transition when animation complete

      this.el.addEventListener("transitionend", function (e) {
        if (e.target == _this2.el.querySelector("div") && e.propertyName == "transform") {
          document.documentElement.classList.remove("nav-open-transition");
        }
      }); // Add events to parent items

      this.el.querySelectorAll(".menu-item-has-children").forEach(function (i) {
        i.querySelector("a").insertAdjacentHTML("afterend", '<button class="subnav-button" aria-label="Open sub-menu"><svg width="12" height="8" viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path d="M6.748 6.748a1.052 1.052 0 01-1.496 0L.31 1.808A1.059 1.059 0 011.722.24L1.8.31 6 4.505 10.193.31a1.059 1.059 0 011.567 1.411l-.07.078" fill="#000" fill-rule="nonzero"/></svg></button>');
        var subnavButton = i.querySelector(".subnav-button"); // Subnav button

        subnavButton.addEventListener("click", function (e) {
          e.stopPropagation(); // if(!i.querySelector("ul").classList.contains("active")) {
          // 	this.el.querySelectorAll(".menu-item-has-children ul").forEach(list => {
          // 		list.classList.remove("active");
          // 	});
          // }

          _this2.toggleChildren(i, e.currentTarget);

          if (!_this2.isMobileNavOpen()) {
            if (i.querySelector("ul").classList.contains("active")) {
              _this2.touched = true;

              _this2.checkSubNavPosition(i);
            } else {
              _this2.touched = false;
            }
          }
        });
        subnavButton.setAttribute("aria-expanded", false); // Touch support for hover menu

        i.addEventListener("touchstart", function (e) {
          e.stopPropagation();

          if (!i.closest(".hover")) {
            _this2.clearSubNav();
          }

          if (!_this2.isMobileNavOpen()) {
            if (!_this2.touched || !i.classList.contains("hover")) {
              e.preventDefault();
            }

            if (!i.classList.contains("hover")) {
              i.classList.add("hover");
              _this2.touched = true;

              _this2.checkSubNavPosition(i);
            }
          }
        });
        i.addEventListener("mouseenter", function (e) {
          if (!_this2.isMobileNavOpen()) {
            if (!_this2.touched) {
              _this2.checkSubNavPosition(i);
            }
          }
        });
        i.addEventListener("mouseleave", function (e) {
          var ul = i.querySelector("ul");

          if (!_this2.isMobileNavOpen()) {
            i.classList.remove("hover");
            ul.classList.remove("left");
            ul.classList.remove("right");
            ul.classList.remove("active");
          }
        });
      }); // Close all when touched outside

      document.addEventListener("touchstart", function (e) {
        if (!_this2.el.contains(e.target)) {
          _this2.clearSubNav();
        }
      }); // Show active menu on page load

      this.el.querySelectorAll(".current-page-ancestor > ul").forEach(function (item) {
        var button = item.parentNode.querySelector(".subnav-button");
        item.classList.toggle("active-mobile");
        button.classList.add("active");
        button.setAttribute("aria-expanded", button.classList.contains("active"));
      });
    }
    /**
     * Check if mobile nav is open
     */

  }, {
    key: "isMobileNavOpen",
    value: function isMobileNavOpen() {
      return document.documentElement.classList.contains("nav-open") && this.toggleButton.offsetParent;
    }
    /**
     * Hide the floating sub nav
     */

  }, {
    key: "clearSubNav",
    value: function clearSubNav() {
      this.el.querySelectorAll(".menu-item-has-children").forEach(function (item) {
        item.classList.remove("hover");
      });
      this.touched = false;
    }
    /**
     * Check if the sub nav is out of bounds
     */

  }, {
    key: "checkSubNavPosition",
    value: function checkSubNavPosition(el) {
      var ul = el.querySelector("ul");
      var pos = ul.getBoundingClientRect().left;
      var margin = 10;

      if (pos + ul.offsetWidth > window.innerWidth - margin) {
        ul.classList.add("right");
      }

      if (pos < margin) {
        ul.classList.add("left");
      }
    }
    /**
     * Open the mobile nav
     */

  }, {
    key: "open",
    value: function open() {
      document.documentElement.classList.add("nav-open");
      document.documentElement.classList.add("nav-open-transition");
      this.el.querySelector("div").scrollTop = 0;
      this.toggleButton.setAttribute("aria-expanded", true);
      this.navOpen = true;
    }
    /**
     * Close the mobile nav
     */

  }, {
    key: "close",
    value: function close() {
      document.documentElement.classList.remove("nav-open");
      document.documentElement.classList.add("nav-open-transition");
      this.toggleButton.setAttribute("aria-expanded", false);
      this.navOpen = false;
    }
    /**
     * Toggle the sub nav
     */

  }, {
    key: "toggleChildren",
    value: function toggleChildren(item, button) {
      // Toggle with animation
      if (this.isMobileNavOpen()) {
        Core.slideToggle(item.querySelector("ul"), function () {
          if (item.querySelector("ul").style.visibility == "hidden") {
            // item.classList.remove("hover");
            button.classList.remove("active");
          } else {
            // item.classList.add("hover");
            button.classList.add("active");
          }
        });
      } else {
        item.querySelector("ul").classList.toggle("active");
      } // Toggle without animation
      // item.querySelector("ul").classList.toggle("active");
      // item.classList.toggle("hover");


      button.classList.toggle("active");
      button.setAttribute("aria-expanded", button.classList.contains("active"));
    }
  }]);

  return Navigation;
}();

var App = /*#__PURE__*/function () {
  function App(queue) {
    _classCallCheck(this, App);

    this.isReady = false;
    this.readyQueue = queue;
    this.init();
  }
  /**
   * Initialize app when DOM ready
   */


  _createClass(App, [{
    key: "init",
    value: function init() {
      var _this3 = this;

      Core.ready(function () {
        _this3.isReady = true;

        _this3.start();

        _this3.processQueue();
      });
    }
    /**
     * Add function to the ready queue
     */

  }, {
    key: "ready",
    value: function ready(fn) {
      if (this.isReady) {
        fn();
      } else {
        this.readyQueue.push(fn);
      }
    }
    /**
     * Process the ready queue
     */

  }, {
    key: "processQueue",
    value: function processQueue() {
      while (this.readyQueue.length) {
        this.readyQueue.shift()();
      }
    }
    /**
     * App entry point
     */

  }, {
    key: "start",
    value: function start() {
      // Focus visible
      this.focusVisible(); // Header

      new Header(document.querySelector("#header")); // Navigation

      new Navigation(document.querySelector("#navigation"));
    }
    /**
     * Add focus outline to buttons only when keyboard-focused
     */

  }, {
    key: "focusVisible",
    value: function focusVisible() {
      document.documentElement.classList.add("focus-visible");

      var onBlur = function onBlur(e) {
        e.target.classList.remove("focus-visible");
      };

      document.body.addEventListener("keyup", function (e) {
        var key = e.which || e.keyCode;

        if (key === 9) {
          var activeElement = document.activeElement;

          if (!activeElement.classList.contains("focus-visible")) {
            activeElement.classList.add("focus-visible");
            activeElement.addEventListener("blur", onBlur);
          }
        }
      });
    }
  }]);

  return App;
}();

app = new App(app.queue);
//# sourceMappingURL=script.js.map
