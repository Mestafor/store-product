(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[1],{"./src/client/ts/Components/DropDown/index.ts":function(e,o,r){"use strict";r.r(o),r.d(o,"ClickableItemStore",(function(){return s}));var t=r("./src/client/ts/helpers.ts"),s=function(){function e(){}return e.add=function(o){e._items.push(o)},e.close=function(){e._items.forEach((function(e){return e.close()})),e._items=[]},e._items=[],e}(),n=function(){function e(e){var o=this;if(this.close=function(){o._$wrapper.classList.remove("project-dropDown--focused");var e=t.a.getParentByClass(o._$wrapper,"hover-box__item--show-on-hover");e&&e.classList.remove("hover-box--focused"),document.removeEventListener("click",o.close);var r=t.a.getParentByClass(o._$wrapper,"project-product");r&&(r.style.zIndex="",r.classList.remove("js-dropdown-opened"))},this._$wrapper=e.wrapper,this._$wrapper.querySelectorAll(".project-dropDown__show-on-focused").forEach((function(e){e.addEventListener("focus",(function(e){o._$wrapper.classList.add("project-dropDown--focused")})),e.addEventListener("blur",(function(e){o._$wrapper.classList.remove("project-dropDown--focused")}))})),this._$wrapper.classList.contains("project-dropDown--js-click")){var r=this._$wrapper.querySelector(".project-dropDown__title");r&&r.addEventListener("click",(function(e){e.preventDefault(),e.stopPropagation(),o._$wrapper.classList.contains("project-dropDown--focused")?(o.close(),s.close()):(s.close(),o.open())}));var n=this._$wrapper.querySelector(".project-dropDown__list-wrapper");n&&n.addEventListener("click",(function(e){e.stopPropagation()}))}}return e.prototype.open=function(){this._$wrapper.classList.add("project-dropDown--focused");var e=t.a.getParentByClass(this._$wrapper,"hover-box__item--show-on-hover");e&&e.classList.add("hover-box--focused"),document.addEventListener("click",this.close),s.add(this);var o=t.a.getParentByClass(this._$wrapper,"project-product");o&&(o.style.zIndex="2",o.classList.add("js-dropdown-opened"))},e}();o.default=n}}]);