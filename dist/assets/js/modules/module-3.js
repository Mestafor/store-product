(window.webpackJsonp_name_=window.webpackJsonp_name_||[]).push([[3],{"./src/client/ts/Components/Accordion/index.ts":function(t,i,e){"use strict";e.r(i),e.d(i,"Accordion",(function(){return n}));var n=function(){function t(t){var i=this;this.TITLE_TEXT=".project-accordion__title-text",this.CONTENT_WRAPPER=".project-accordion__content-wrapper",this.CONTENT=".project-accordion__content",this.OPENED="project-accordion--opened",this.state={isOpen:!1,isInited:!1},this.config=t,this.titleText=this.config.accordion.querySelector(this.TITLE_TEXT),this.contentWrapper=this.config.accordion.querySelector(this.CONTENT_WRAPPER),this.content=this.config.accordion.querySelector(this.CONTENT),this.titleText&&this.contentWrapper&&this.content&&(this.titleText.addEventListener("click",(function(t){t.preventDefault(),i.state.isOpen?i.close():i.open()})),this.state.isInited=!0,this.config.accordion.classList.add("project-accordion--inited"))}return t.prototype.open=function(){!this.state.isOpen&&this.state.isInited&&(this.config.accordion.classList.add(this.OPENED),this.state.isOpen=!0)},t.prototype.close=function(){this.state.isOpen&&this.state.isInited&&(this.config.accordion.classList.remove(this.OPENED),this.state.isOpen=!1)},t}()}}]);