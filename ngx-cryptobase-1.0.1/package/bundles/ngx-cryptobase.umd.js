(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs/add/operator/filter'), require('@angular/platform-browser')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'rxjs/add/operator/filter', '@angular/platform-browser'], factory) :
	(factory((global['ngx-cryptobase'] = {}),global.ng.core,global.ng.common,global.Rx.Observable.prototype,global.ng.platformBrowser));
}(this, (function (exports,core,common,filter,platformBrowser) { 'use strict';

var HeaderComponent = /** @class */ (function () {
    function HeaderComponent() {
    }
    /**
     * @return {?}
     */
    HeaderComponent.prototype.ngOnInit = function () {
    };
    return HeaderComponent;
}());
HeaderComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'cb-header',
                template: "\n    <header class=\"header\">\n      <div class=\"container\">\n\n        <a href=\"#\" class=\"header-logo pull-left\">\n          <h1>\n            <ng-content select=\"[logo]\"></ng-content>\n          </h1>\n        </a>\n\n        <div class=\"btn-group login\" dropdown>\n          <button dropdownToggle type=\"button\" class=\"btn btn-primary dropdown-toggle\">\n            <img class=\"user-avatar\" src=\"http://s3.amazonaws.com/37assets/svn/765-default-avatar.png\">\n            John Doe <span class=\"caret\"></span>\n          </button>\n\n          <ul class=\"dropdown-menu\" role=\"menu\" *dropdownMenu>\n            <ng-content select=\"[menu]\"></ng-content>\n          </ul>\n        </div>\n\n        <div class=\"clearfix\"></div>\n\n      </div>\n    </header>\n  ",
                styles: ["\n    .header {\n      margin-bottom: 0; }\n      .header a {\n        color: white; }\n        .header a:hover {\n          text-decoration: none;\n          color: white; }\n      .header .login {\n        float: right; }\n      .header .header-logo h1 {\n        color: white;\n        margin-top: 0.5rem;\n        font-size: 22px; }\n      .header .user-avatar {\n        height: 24px;\n        width: 24px;\n        border-radius: 200px;\n        float: left;\n        margin-right: 10px; }\n      .header .dropdown-item {\n        color: #3f9adb; }\n      .header .dropdown-item:hover {\n        color: #0071c1; }\n  "]
            },] },
];
/**
 * @nocollapse
 */
HeaderComponent.ctorParameters = function () { return []; };
/**
 * @copyright Valor Software
 * @copyright Angular ng-bootstrap team
 */
var Trigger = (function () {
    function Trigger(open, close) {
        this.open = open;
        this.close = close || open;
    }
    Trigger.prototype.isManual = function () {
        return this.open === 'manual' || this.close === 'manual';
    };
    return Trigger;
}());
var DEFAULT_ALIASES = {
    hover: ['mouseover', 'mouseout'],
    focus: ['focusin', 'focusout']
};
function parseTriggers(triggers, aliases) {
    if (aliases === void 0) {
        aliases = DEFAULT_ALIASES;
    }
    var trimmedTriggers = (triggers || '').trim();
    if (trimmedTriggers.length === 0) {
        return [];
    }
    var parsedTriggers = trimmedTriggers
        .split(/\s+/)
        .map(function (trigger) { return trigger.split(':'); })
        .map(function (triggerPair) {
        var alias = aliases[triggerPair[0]] || triggerPair;
        return new Trigger(alias[0], alias[1]);
    });
    var manualTriggers = parsedTriggers.filter(function (triggerPair) {
        return triggerPair.isManual();
    });
    if (manualTriggers.length > 1) {
        throw new Error('Triggers parse error: only one manual trigger is allowed');
    }
    if (manualTriggers.length === 1 && parsedTriggers.length > 1) {
        throw new Error('Triggers parse error: manual trigger can\'t be mixed with other triggers');
    }
    return parsedTriggers;
}
function listenToTriggersV2(renderer, options) {
    var parsedTriggers = parseTriggers(options.triggers);
    var target = options.target;
    // do nothing
    if (parsedTriggers.length === 1 && parsedTriggers[0].isManual()) {
        return Function.prototype;
    }
    // all listeners
    var listeners = [];
    // lazy listeners registration
    var _registerHide = [];
    var registerHide = function () {
        // add hide listeners to unregister array
        _registerHide.forEach(function (fn) { return listeners.push(fn()); });
        // register hide events only once
        _registerHide.length = 0;
    };
    // register open\close\toggle listeners
    parsedTriggers.forEach(function (trigger) {
        var useToggle = trigger.open === trigger.close;
        var showFn = useToggle ? options.toggle : options.show;
        if (!useToggle) {
            _registerHide.push(function () {
                return renderer.listen(target, trigger.close, options.hide);
            });
        }
        listeners.push(renderer.listen(target, trigger.open, function () { return showFn(registerHide); }));
    });
    return function () {
        listeners.forEach(function (unsubscribeFn) { return unsubscribeFn(); });
    };
}
function registerOutsideClick(renderer, options) {
    if (!options.outsideClick) {
        return Function.prototype;
    }
    return renderer.listen('document', 'click', function (event) {
        if (options.target && options.target.contains(event.target)) {
            return;
        }
        if (options.targets &&
            options.targets.some(function (target) { return target.contains(event.target); })) {
            return;
        }
        options.hide();
    });
}
/**
 * @copyright Valor Software
 * @copyright Angular ng-bootstrap team
 */
var ContentRef = (function () {
    function ContentRef(nodes, viewRef, componentRef) {
        this.nodes = nodes;
        this.viewRef = viewRef;
        this.componentRef = componentRef;
    }
    return ContentRef;
}());
// tslint:disable:max-file-line-count
// todo: add delay support
// todo: merge events onShow, onShown, etc...
// todo: add global positioning configuration?
var ComponentLoader = (function () {
    /**
     * Do not use this directly, it should be instanced via
     * `ComponentLoadFactory.attach`
     * @internal
     */
    // tslint:disable-next-line
    function ComponentLoader(_viewContainerRef, _renderer, _elementRef, _injector, _componentFactoryResolver, _ngZone, _applicationRef, _posService) {
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._injector = _injector;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._ngZone = _ngZone;
        this._applicationRef = _applicationRef;
        this._posService = _posService;
        this.onBeforeShow = new core.EventEmitter();
        this.onShown = new core.EventEmitter();
        this.onBeforeHide = new core.EventEmitter();
        this.onHidden = new core.EventEmitter();
        this._providers = [];
        this._isHiding = false;
        this._listenOpts = {};
        this._globalListener = Function.prototype;
    }
    Object.defineProperty(ComponentLoader.prototype, "isShown", {
        get: function () {
            if (this._isHiding) {
                return false;
            }
            return !!this._componentRef;
        },
        enumerable: true,
        configurable: true
    });
    ComponentLoader.prototype.attach = function (compType) {
        this._componentFactory = this._componentFactoryResolver
            .resolveComponentFactory(compType);
        return this;
    };
    // todo: add behaviour: to target element, `body`, custom element
    ComponentLoader.prototype.to = function (container) {
        this.container = container || this.container;
        return this;
    };
    ComponentLoader.prototype.position = function (opts) {
        this.attachment = opts.attachment || this.attachment;
        this._elementRef = opts.target || this._elementRef;
        return this;
    };
    ComponentLoader.prototype.provide = function (provider) {
        this._providers.push(provider);
        return this;
    };
    // todo: appendChild to element or document.querySelector(this.container)
    ComponentLoader.prototype.show = function (opts) {
        if (opts === void 0) {
            opts = {};
        }
        this._subscribePositioning();
        this._innerComponent = null;
        if (!this._componentRef) {
            this.onBeforeShow.emit();
            this._contentRef = this._getContentRef(opts.content, opts.context);
            var injector = core.ReflectiveInjector.resolveAndCreate(this._providers, this._injector);
            this._componentRef = this._componentFactory.create(injector, this._contentRef.nodes);
            this._applicationRef.attachView(this._componentRef.hostView);
            // this._componentRef = this._viewContainerRef
            //   .createComponent(this._componentFactory, 0, injector, this._contentRef.nodes);
            this.instance = this._componentRef.instance;
            Object.assign(this._componentRef.instance, opts);
            if (this.container instanceof core.ElementRef) {
                this.container.nativeElement.appendChild(this._componentRef.location.nativeElement);
            }
            if (this.container === 'body' && typeof document !== 'undefined') {
                document
                    .querySelector(this.container)
                    .appendChild(this._componentRef.location.nativeElement);
            }
            if (!this.container &&
                this._elementRef &&
                this._elementRef.nativeElement.parentElement) {
                this._elementRef.nativeElement.parentElement.appendChild(this._componentRef.location.nativeElement);
            }
            // we need to manually invoke change detection since events registered
            // via
            // Renderer::listen() are not picked up by change detection with the
            // OnPush strategy
            if (this._contentRef.componentRef) {
                this._innerComponent = this._contentRef.componentRef.instance;
                this._contentRef.componentRef.changeDetectorRef.markForCheck();
                this._contentRef.componentRef.changeDetectorRef.detectChanges();
            }
            this._componentRef.changeDetectorRef.markForCheck();
            this._componentRef.changeDetectorRef.detectChanges();
            this.onShown.emit(this._componentRef.instance);
        }
        this._registerOutsideClick();
        return this._componentRef;
    };
    ComponentLoader.prototype.hide = function () {
        if (!this._componentRef) {
            return this;
        }
        this.onBeforeHide.emit(this._componentRef.instance);
        var componentEl = this._componentRef.location.nativeElement;
        componentEl.parentNode.removeChild(componentEl);
        if (this._contentRef.componentRef) {
            this._contentRef.componentRef.destroy();
        }
        this._componentRef.destroy();
        if (this._viewContainerRef && this._contentRef.viewRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef));
        }
        if (this._contentRef.viewRef) {
            this._contentRef.viewRef.destroy();
        }
        // this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._componentRef.hostView));
        //
        // if (this._contentRef.viewRef && this._viewContainerRef.indexOf(this._contentRef.viewRef) !== -1) {
        //   this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef));
        // }
        this._contentRef = null;
        this._componentRef = null;
        this._removeGlobalListener();
        this.onHidden.emit();
        return this;
    };
    ComponentLoader.prototype.toggle = function () {
        if (this.isShown) {
            this.hide();
            return;
        }
        this.show();
    };
    ComponentLoader.prototype.dispose = function () {
        if (this.isShown) {
            this.hide();
        }
        this._unsubscribePositioning();
        if (this._unregisterListenersFn) {
            this._unregisterListenersFn();
        }
    };
    ComponentLoader.prototype.listen = function (listenOpts) {
        var _this = this;
        this.triggers = listenOpts.triggers || this.triggers;
        this._listenOpts.outsideClick = listenOpts.outsideClick;
        listenOpts.target = listenOpts.target || this._elementRef.nativeElement;
        var hide = (this._listenOpts.hide = function () {
            return listenOpts.hide ? listenOpts.hide() : void _this.hide();
        });
        var show = (this._listenOpts.show = function (registerHide) {
            listenOpts.show ? listenOpts.show(registerHide) : _this.show(registerHide);
            registerHide();
        });
        var toggle = function (registerHide) {
            _this.isShown ? hide() : show(registerHide);
        };
        this._unregisterListenersFn = listenToTriggersV2(this._renderer, {
            target: listenOpts.target,
            triggers: listenOpts.triggers,
            show: show,
            hide: hide,
            toggle: toggle
        });
        return this;
    };
    ComponentLoader.prototype._removeGlobalListener = function () {
        if (this._globalListener) {
            this._globalListener();
            this._globalListener = null;
        }
    };
    ComponentLoader.prototype.attachInline = function (vRef, template) {
        this._inlineViewRef = vRef.createEmbeddedView(template);
        return this;
    };
    ComponentLoader.prototype._registerOutsideClick = function () {
        var _this = this;
        if (!this._componentRef || !this._componentRef.location) {
            return;
        }
        // why: should run after first event bubble
        if (this._listenOpts.outsideClick) {
            var target_1 = this._componentRef.location.nativeElement;
            setTimeout(function () {
                _this._globalListener = registerOutsideClick(_this._renderer, {
                    targets: [target_1, _this._elementRef.nativeElement],
                    outsideClick: _this._listenOpts.outsideClick,
                    hide: function () { return _this._listenOpts.hide(); }
                });
            });
        }
    };
    ComponentLoader.prototype.getInnerComponent = function () {
        return this._innerComponent;
    };
    ComponentLoader.prototype._subscribePositioning = function () {
        var _this = this;
        if (this._zoneSubscription || !this.attachment) {
            return;
        }
        this._zoneSubscription = this._ngZone.onStable.subscribe(function () {
            if (!_this._componentRef) {
                return;
            }
            _this._posService.position({
                element: _this._componentRef.location,
                target: _this._elementRef,
                attachment: _this.attachment,
                appendToBody: _this.container === 'body'
            });
        });
    };
    ComponentLoader.prototype._unsubscribePositioning = function () {
        if (!this._zoneSubscription) {
            return;
        }
        this._zoneSubscription.unsubscribe();
        this._zoneSubscription = null;
    };
    ComponentLoader.prototype._getContentRef = function (content, context) {
        if (!content) {
            return new ContentRef([]);
        }
        if (content instanceof core.TemplateRef) {
            if (this._viewContainerRef) {
                var _viewRef = this._viewContainerRef
                    .createEmbeddedView(content, context);
                _viewRef.markForCheck();
                return new ContentRef([_viewRef.rootNodes], _viewRef);
            }
            var viewRef = content.createEmbeddedView({});
            this._applicationRef.attachView(viewRef);
            return new ContentRef([viewRef.rootNodes], viewRef);
        }
        if (typeof content === 'function') {
            var contentCmptFactory = this._componentFactoryResolver.resolveComponentFactory(content);
            var modalContentInjector = core.ReflectiveInjector.resolveAndCreate(this._providers.slice(), this._injector);
            var componentRef = contentCmptFactory.create(modalContentInjector);
            this._applicationRef.attachView(componentRef.hostView);
            return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
        }
        return new ContentRef([[this._renderer.createText("" + content)]]);
    };
    return ComponentLoader;
}());
/**
 * @copyright Valor Software
 * @copyright Angular ng-bootstrap team
 */
// previous version:
// https://github.com/angular-ui/bootstrap/blob/07c31d0731f7cb068a1932b8e01d2312b796b4ec/src/position/position.js
// tslint:disable
var Positioning = (function () {
    function Positioning() {
    }
    Positioning.prototype.position = function (element, round) {
        if (round === void 0) {
            round = true;
        }
        var elPosition;
        var parentOffset = {
            width: 0,
            height: 0,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };
        if (this.getStyle(element, 'position') === 'fixed') {
            var bcRect = element.getBoundingClientRect();
            elPosition = {
                width: bcRect.width,
                height: bcRect.height,
                top: bcRect.top,
                bottom: bcRect.bottom,
                left: bcRect.left,
                right: bcRect.right
            };
        }
        else {
            var offsetParentEl = this.offsetParent(element);
            elPosition = this.offset(element, false);
            if (offsetParentEl !== document.documentElement) {
                parentOffset = this.offset(offsetParentEl, false);
            }
            parentOffset.top += offsetParentEl.clientTop;
            parentOffset.left += offsetParentEl.clientLeft;
        }
        elPosition.top -= parentOffset.top;
        elPosition.bottom -= parentOffset.top;
        elPosition.left -= parentOffset.left;
        elPosition.right -= parentOffset.left;
        if (round) {
            elPosition.top = Math.round(elPosition.top);
            elPosition.bottom = Math.round(elPosition.bottom);
            elPosition.left = Math.round(elPosition.left);
            elPosition.right = Math.round(elPosition.right);
        }
        return elPosition;
    };
    Positioning.prototype.offset = function (element, round) {
        if (round === void 0) {
            round = true;
        }
        var elBcr = element.getBoundingClientRect();
        var viewportOffset = {
            top: window.pageYOffset - document.documentElement.clientTop,
            left: window.pageXOffset - document.documentElement.clientLeft
        };
        var elOffset = {
            height: elBcr.height || element.offsetHeight,
            width: elBcr.width || element.offsetWidth,
            top: elBcr.top + viewportOffset.top,
            bottom: elBcr.bottom + viewportOffset.top,
            left: elBcr.left + viewportOffset.left,
            right: elBcr.right + viewportOffset.left
        };
        if (round) {
            elOffset.height = Math.round(elOffset.height);
            elOffset.width = Math.round(elOffset.width);
            elOffset.top = Math.round(elOffset.top);
            elOffset.bottom = Math.round(elOffset.bottom);
            elOffset.left = Math.round(elOffset.left);
            elOffset.right = Math.round(elOffset.right);
        }
        return elOffset;
    };
    Positioning.prototype.positionElements = function (hostElement, targetElement, placement, appendToBody) {
        var hostElPosition = appendToBody
            ? this.offset(hostElement, false)
            : this.position(hostElement, false);
        var targetElStyles = this.getAllStyles(targetElement);
        var shiftWidth = {
            left: hostElPosition.left,
            center: hostElPosition.left +
                hostElPosition.width / 2 -
                targetElement.offsetWidth / 2,
            right: hostElPosition.left + hostElPosition.width
        };
        var shiftHeight = {
            top: hostElPosition.top,
            center: hostElPosition.top +
                hostElPosition.height / 2 -
                targetElement.offsetHeight / 2,
            bottom: hostElPosition.top + hostElPosition.height
        };
        var targetElBCR = targetElement.getBoundingClientRect();
        var placementPrimary = placement.split(' ')[0] || 'top';
        var placementSecondary = placement.split(' ')[1] || 'center';
        var targetElPosition = {
            height: targetElBCR.height || targetElement.offsetHeight,
            width: targetElBCR.width || targetElement.offsetWidth,
            top: 0,
            bottom: targetElBCR.height || targetElement.offsetHeight,
            left: 0,
            right: targetElBCR.width || targetElement.offsetWidth
        };
        if (placementPrimary === 'auto') {
            var newPlacementPrimary = this.autoPosition(targetElPosition, hostElPosition, targetElement, placementSecondary);
            if (!newPlacementPrimary)
                newPlacementPrimary = this.autoPosition(targetElPosition, hostElPosition, targetElement);
            if (newPlacementPrimary)
                placementPrimary = newPlacementPrimary;
            targetElement.classList.add(placementPrimary);
        }
        switch (placementPrimary) {
            case 'top':
                targetElPosition.top =
                    hostElPosition.top -
                        (targetElement.offsetHeight +
                            parseFloat(targetElStyles.marginBottom));
                targetElPosition.bottom +=
                    hostElPosition.top - targetElement.offsetHeight;
                targetElPosition.left = shiftWidth[placementSecondary];
                targetElPosition.right += shiftWidth[placementSecondary];
                break;
            case 'bottom':
                targetElPosition.top = shiftHeight[placementPrimary];
                targetElPosition.bottom += shiftHeight[placementPrimary];
                targetElPosition.left = shiftWidth[placementSecondary];
                targetElPosition.right += shiftWidth[placementSecondary];
                break;
            case 'left':
                targetElPosition.top = shiftHeight[placementSecondary];
                targetElPosition.bottom += shiftHeight[placementSecondary];
                targetElPosition.left =
                    hostElPosition.left -
                        (targetElement.offsetWidth + parseFloat(targetElStyles.marginRight));
                targetElPosition.right +=
                    hostElPosition.left - targetElement.offsetWidth;
                break;
            case 'right':
                targetElPosition.top = shiftHeight[placementSecondary];
                targetElPosition.bottom += shiftHeight[placementSecondary];
                targetElPosition.left = shiftWidth[placementPrimary];
                targetElPosition.right += shiftWidth[placementPrimary];
                break;
        }
        targetElPosition.top = Math.round(targetElPosition.top);
        targetElPosition.bottom = Math.round(targetElPosition.bottom);
        targetElPosition.left = Math.round(targetElPosition.left);
        targetElPosition.right = Math.round(targetElPosition.right);
        return targetElPosition;
    };
    Positioning.prototype.autoPosition = function (targetElPosition, hostElPosition, targetElement, preferredPosition) {
        if ((!preferredPosition || preferredPosition === 'right') &&
            targetElPosition.left + hostElPosition.left - targetElement.offsetWidth <
                0) {
            return 'right';
        }
        else if ((!preferredPosition || preferredPosition === 'top') &&
            targetElPosition.bottom +
                hostElPosition.bottom +
                targetElement.offsetHeight >
                window.innerHeight) {
            return 'top';
        }
        else if ((!preferredPosition || preferredPosition === 'bottom') &&
            targetElPosition.top + hostElPosition.top - targetElement.offsetHeight < 0) {
            return 'bottom';
        }
        else if ((!preferredPosition || preferredPosition === 'left') &&
            targetElPosition.right +
                hostElPosition.right +
                targetElement.offsetWidth >
                window.innerWidth) {
            return 'left';
        }
        return null;
    };
    Positioning.prototype.getAllStyles = function (element) {
        return window.getComputedStyle(element);
    };
    Positioning.prototype.getStyle = function (element, prop) {
        return this.getAllStyles(element)[prop];
    };
    Positioning.prototype.isStaticPositioned = function (element) {
        return (this.getStyle(element, 'position') || 'static') === 'static';
    };
    Positioning.prototype.offsetParent = function (element) {
        var offsetParentEl = element.offsetParent || document.documentElement;
        while (offsetParentEl &&
            offsetParentEl !== document.documentElement &&
            this.isStaticPositioned(offsetParentEl)) {
            offsetParentEl = offsetParentEl.offsetParent;
        }
        return offsetParentEl || document.documentElement;
    };
    return Positioning;
}());
var positionService = new Positioning();
function positionElements(hostElement, targetElement, placement, appendToBody) {
    var pos = positionService.positionElements(hostElement, targetElement, placement, appendToBody);
    targetElement.style.top = pos.top + "px";
    targetElement.style.left = pos.left + "px";
}
var PositioningService = (function () {
    function PositioningService() {
    }
    PositioningService.prototype.position = function (options) {
        var element = options.element, target = options.target, attachment = options.attachment, appendToBody = options.appendToBody;
        positionElements(_getHtmlElement(target), _getHtmlElement(element), attachment, appendToBody);
    };
    PositioningService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    PositioningService.ctorParameters = function () { return []; };
    return PositioningService;
}());
function _getHtmlElement(element) {
    // it means that we got a selector
    if (typeof element === 'string') {
        return document.querySelector(element);
    }
    if (element instanceof core.ElementRef) {
        return element.nativeElement;
    }
    return element;
}
var ComponentLoaderFactory = (function () {
    function ComponentLoaderFactory(_componentFactoryResolver, _ngZone, _injector, _posService, _applicationRef) {
        this._componentFactoryResolver = _componentFactoryResolver;
        this._ngZone = _ngZone;
        this._injector = _injector;
        this._posService = _posService;
        this._applicationRef = _applicationRef;
    }
    /**
     *
     * @param _elementRef
     * @param _viewContainerRef
     * @param _renderer
     * @returns {ComponentLoader}
     */
    ComponentLoaderFactory.prototype.createLoader = function (_elementRef, _viewContainerRef, _renderer) {
        return new ComponentLoader(_viewContainerRef, _renderer, _elementRef, this._injector, this._componentFactoryResolver, this._ngZone, this._applicationRef, this._posService);
    };
    ComponentLoaderFactory.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    ComponentLoaderFactory.ctorParameters = function () {
        return [
            { type: core.ComponentFactoryResolver, },
            { type: core.NgZone, },
            { type: core.Injector, },
            { type: PositioningService, },
            { type: core.ApplicationRef, },
        ];
    };
    return ComponentLoaderFactory;
}());
/** Default dropdown configuration */
var BsDropdownConfig = (function () {
    function BsDropdownConfig() {
        /** default dropdown auto closing behavior */
        this.autoClose = true;
    }
    BsDropdownConfig.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    BsDropdownConfig.ctorParameters = function () { return []; };
    return BsDropdownConfig;
}());
var BsDropdownState = (function () {
    function BsDropdownState() {
        var _this = this;
        this.direction = 'down';
        this.isOpenChange = new core.EventEmitter();
        this.isDisabledChange = new core.EventEmitter();
        this.toggleClick = new core.EventEmitter();
        this.dropdownMenu = new Promise(function (resolve) {
            _this.resolveDropdownMenu = resolve;
        });
    }
    BsDropdownState.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    BsDropdownState.ctorParameters = function () { return []; };
    return BsDropdownState;
}());
var BsDropdownContainerComponent = (function () {
    function BsDropdownContainerComponent(_state, cd, _renderer, _element) {
        var _this = this;
        this._state = _state;
        this.cd = cd;
        this._renderer = _renderer;
        this.isOpen = false;
        this._subscription = _state.isOpenChange.subscribe(function (value) {
            _this.isOpen = value;
            var dropdown = _element.nativeElement.querySelector('.dropdown-menu');
            if (dropdown) {
                _this._renderer.addClass(dropdown, 'show');
                if (dropdown.classList.contains('dropdown-menu-right')) {
                    _this._renderer.setStyle(dropdown, 'left', 'auto');
                    _this._renderer.setStyle(dropdown, 'right', '0');
                }
                if (_this.direction === 'up') {
                    _this._renderer.setStyle(dropdown, 'top', 'auto');
                    _this._renderer.setStyle(dropdown, 'transform', 'translateY(-101%)');
                }
            }
            _this.cd.markForCheck();
            _this.cd.detectChanges();
        });
    }
    Object.defineProperty(BsDropdownContainerComponent.prototype, "direction", {
        get: function () {
            return this._state.direction;
        },
        enumerable: true,
        configurable: true
    });
    BsDropdownContainerComponent.prototype.ngOnDestroy = function () {
        this._subscription.unsubscribe();
    };
    BsDropdownContainerComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'bs-dropdown-container',
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    host: {
                        style: 'display:block;position: absolute;'
                    },
                    template: "\n    <div [class.dropup]=\"direction === 'up'\"\n         [class.dropdown]=\"direction === 'down'\"\n         [class.show]=\"isOpen\"\n         [class.open]=\"isOpen\"><ng-content></ng-content></div>\n  "
                },] },
    ];
    /** @nocollapse */
    BsDropdownContainerComponent.ctorParameters = function () {
        return [
            { type: BsDropdownState, },
            { type: core.ChangeDetectorRef, },
            { type: core.Renderer2, },
            { type: core.ElementRef, },
        ];
    };
    return BsDropdownContainerComponent;
}());
/*tslint:disable */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * JS version of browser APIs. This library can only run in the browser.
 */
var win = (typeof window !== 'undefined' && window) || {};
var document$1 = win.document;
var location = win.location;
var gc = win['gc'] ? function () { return win['gc'](); } : function () { return null; };
var performance = win['performance'] ? win['performance'] : null;
var Event = win['Event'];
var MouseEvent = win['MouseEvent'];
var KeyboardEvent = win['KeyboardEvent'];
var EventTarget = win['EventTarget'];
var History = win['History'];
var Location = win['Location'];
var EventListener = win['EventListener'];
var guessedVersion;
function _guessBsVersion() {
    if (typeof document === 'undefined') {
        return null;
    }
    var spanEl = document.createElement('span');
    spanEl.innerText = 'test bs version';
    document.body.appendChild(spanEl);
    spanEl.classList.add('d-none');
    var rect = spanEl.getBoundingClientRect();
    document.body.removeChild(spanEl);
    if (!rect) {
        return 'bs3';
    }
    return rect.top === 0 ? 'bs4' : 'bs3';
}
// todo: in ngx-bootstrap, bs4 will became a default one
function isBs3() {
    if (typeof win === 'undefined') {
        return true;
    }
    if (typeof win.__theme === 'undefined') {
        if (guessedVersion) {
            return guessedVersion === 'bs3';
        }
        guessedVersion = _guessBsVersion();
        return guessedVersion === 'bs3';
    }
    return win.__theme !== 'bs4';
}
// tslint:disable:max-file-line-count
var BsDropdownDirective = (function () {
    function BsDropdownDirective(_elementRef, _renderer, _viewContainerRef, _cis, _config, _state) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._viewContainerRef = _viewContainerRef;
        this._cis = _cis;
        this._config = _config;
        this._state = _state;
        // todo: move to component loader
        this._isInlineOpen = false;
        this._subscriptions = [];
        this._isInited = false;
        // set initial dropdown state from config
        this._state.autoClose = this._config.autoClose;
        // create dropdown component loader
        this._dropdown = this._cis
            .createLoader(this._elementRef, this._viewContainerRef, this._renderer)
            .provide({ provide: BsDropdownState, useValue: this._state });
        this.onShown = this._dropdown.onShown;
        this.onHidden = this._dropdown.onHidden;
        this.isOpenChange = this._state.isOpenChange;
    }
    Object.defineProperty(BsDropdownDirective.prototype, "autoClose", {
        get: function () {
            return this._state.autoClose;
        },
        /**
         * Indicates that dropdown will be closed on item or document click,
         * and after pressing ESC
         */
        set: function (value) {
            this._state.autoClose = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDropdownDirective.prototype, "isDisabled", {
        get: function () {
            return this._isDisabled;
        },
        /**
         * Disables dropdown toggle and hides dropdown menu if opened
         */
        set: function (value) {
            this._isDisabled = value;
            this._state.isDisabledChange.emit(value);
            if (value) {
                this.hide();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDropdownDirective.prototype, "isOpen", {
        /**
         * Returns whether or not the popover is currently being shown
         */
        get: function () {
            if (this._showInline) {
                return this._isInlineOpen;
            }
            return this._dropdown.isShown;
        },
        set: function (value) {
            if (value) {
                this.show();
            }
            else {
                this.hide();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDropdownDirective.prototype, "isBs4", {
        get: function () {
            return !isBs3();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDropdownDirective.prototype, "_showInline", {
        get: function () {
            return !this.container;
        },
        enumerable: true,
        configurable: true
    });
    BsDropdownDirective.prototype.ngOnInit = function () {
        var _this = this;
        // fix: seems there are an issue with `routerLinkActive`
        // which result in duplicated call ngOnInit without call to ngOnDestroy
        // read more: https://github.com/valor-software/ngx-bootstrap/issues/1885
        if (this._isInited) {
            return;
        }
        this._isInited = true;
        // attach DOM listeners
        this._dropdown.listen({
            // because of dropdown inline mode
            outsideClick: false,
            triggers: this.triggers,
            show: function () { return _this.show(); }
        });
        // toggle visibility on toggle element click
        this._subscriptions.push(this._state.toggleClick.subscribe(function (value) { return _this.toggle(value); }));
        // hide dropdown if set disabled while opened
        this._subscriptions.push(this._state.isDisabledChange
            .filter(function (value) { return value; })
            .subscribe(function (value) { return _this.hide(); }));
    };
    /**
     * Opens an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    BsDropdownDirective.prototype.show = function () {
        var _this = this;
        if (this.isOpen || this.isDisabled) {
            return;
        }
        if (this._showInline) {
            if (!this._inlinedMenu) {
                this._state.dropdownMenu.then(function (dropdownMenu) {
                    _this._dropdown.attachInline(dropdownMenu.viewContainer, dropdownMenu.templateRef);
                    _this._inlinedMenu = _this._dropdown._inlineViewRef;
                    _this.addBs4Polyfills();
                })
                    .catch();
            }
            this.addBs4Polyfills();
            this._isInlineOpen = true;
            this.onShown.emit(true);
            this._state.isOpenChange.emit(true);
            return;
        }
        this._state.dropdownMenu.then(function (dropdownMenu) {
            // check direction in which dropdown should be opened
            var _dropup = _this.dropup ||
                (typeof _this.dropup !== 'undefined' && _this.dropup);
            _this._state.direction = _dropup ? 'up' : 'down';
            var _placement = _this.placement || (_dropup ? 'top left' : 'bottom left');
            // show dropdown
            _this._dropdown
                .attach(BsDropdownContainerComponent)
                .to(_this.container)
                .position({ attachment: _placement })
                .show({
                content: dropdownMenu.templateRef,
                placement: _placement
            });
            _this._state.isOpenChange.emit(true);
        })
            .catch();
    };
    /**
     * Closes an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    BsDropdownDirective.prototype.hide = function () {
        if (!this.isOpen) {
            return;
        }
        if (this._showInline) {
            this.removeShowClass();
            this._isInlineOpen = false;
            this.onHidden.emit(true);
        }
        else {
            this._dropdown.hide();
        }
        this._state.isOpenChange.emit(false);
    };
    /**
     * Toggles an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    BsDropdownDirective.prototype.toggle = function (value) {
        if (this.isOpen || !value) {
            return this.hide();
        }
        return this.show();
    };
    BsDropdownDirective.prototype.ngOnDestroy = function () {
        // clean up subscriptions and destroy dropdown
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
        this._dropdown.dispose();
    };
    BsDropdownDirective.prototype.addBs4Polyfills = function () {
        if (!isBs3()) {
            this.addShowClass();
            this.checkRightAlignment();
            this.checkDropup();
        }
    };
    BsDropdownDirective.prototype.addShowClass = function () {
        if (this._inlinedMenu && this._inlinedMenu.rootNodes[0]) {
            this._renderer.addClass(this._inlinedMenu.rootNodes[0], 'show');
        }
    };
    BsDropdownDirective.prototype.removeShowClass = function () {
        if (this._inlinedMenu && this._inlinedMenu.rootNodes[0]) {
            this._renderer.removeClass(this._inlinedMenu.rootNodes[0], 'show');
        }
    };
    BsDropdownDirective.prototype.checkRightAlignment = function () {
        if (this._inlinedMenu && this._inlinedMenu.rootNodes[0]) {
            var isRightAligned = this._inlinedMenu.rootNodes[0].classList.contains('dropdown-menu-right');
            this._renderer.setStyle(this._inlinedMenu.rootNodes[0], 'left', isRightAligned ? 'auto' : '0');
            this._renderer.setStyle(this._inlinedMenu.rootNodes[0], 'right', isRightAligned ? '0' : 'auto');
        }
    };
    BsDropdownDirective.prototype.checkDropup = function () {
        if (this._inlinedMenu && this._inlinedMenu.rootNodes[0]) {
            // a little hack to not break support of bootstrap 4 beta
            this._renderer.setStyle(this._inlinedMenu.rootNodes[0], 'top', this.dropup ? 'auto' : '100%');
            this._renderer.setStyle(this._inlinedMenu.rootNodes[0], 'transform', this.dropup ? 'translateY(-101%)' : 'translateY(0)');
        }
    };
    BsDropdownDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[bsDropdown],[dropdown]',
                    exportAs: 'bs-dropdown',
                    providers: [BsDropdownState],
                    host: {
                        '[class.dropup]': 'dropup',
                        '[class.open]': 'isOpen',
                        '[class.show]': 'isOpen && isBs4'
                    }
                },] },
    ];
    /** @nocollapse */
    BsDropdownDirective.ctorParameters = function () {
        return [
            { type: core.ElementRef, },
            { type: core.Renderer2, },
            { type: core.ViewContainerRef, },
            { type: ComponentLoaderFactory, },
            { type: BsDropdownConfig, },
            { type: BsDropdownState, },
        ];
    };
    BsDropdownDirective.propDecorators = {
        'placement': [{ type: core.Input },],
        'triggers': [{ type: core.Input },],
        'container': [{ type: core.Input },],
        'dropup': [{ type: core.Input },],
        'autoClose': [{ type: core.Input },],
        'isDisabled': [{ type: core.Input },],
        'isOpen': [{ type: core.Input },],
        'isOpenChange': [{ type: core.Output },],
        'onShown': [{ type: core.Output },],
        'onHidden': [{ type: core.Output },],
    };
    return BsDropdownDirective;
}());
var BsDropdownMenuDirective = (function () {
    function BsDropdownMenuDirective(_state, _viewContainer, _templateRef) {
        _state.resolveDropdownMenu({
            templateRef: _templateRef,
            viewContainer: _viewContainer
        });
    }
    BsDropdownMenuDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[bsDropdownMenu],[dropdownMenu]',
                    exportAs: 'bs-dropdown-menu'
                },] },
    ];
    /** @nocollapse */
    BsDropdownMenuDirective.ctorParameters = function () {
        return [
            { type: BsDropdownState, },
            { type: core.ViewContainerRef, },
            { type: core.TemplateRef, },
        ];
    };
    return BsDropdownMenuDirective;
}());
var BsDropdownToggleDirective = (function () {
    function BsDropdownToggleDirective(_state, _element) {
        var _this = this;
        this._state = _state;
        this._element = _element;
        this.isDisabled = null;
        this._subscriptions = [];
        // sync is open value with state
        this._subscriptions.push(this._state.isOpenChange.subscribe(function (value) { return (_this.isOpen = value); }));
        // populate disabled state
        this._subscriptions.push(this._state.isDisabledChange.subscribe(function (value) { return (_this.isDisabled = value || null); }));
    }
    BsDropdownToggleDirective.prototype.onClick = function () {
        if (this.isDisabled) {
            return;
        }
        this._state.toggleClick.emit(true);
    };
    BsDropdownToggleDirective.prototype.onDocumentClick = function (event) {
        if (this._state.autoClose &&
            event.button !== 2 &&
            !this._element.nativeElement.contains(event.target)) {
            this._state.toggleClick.emit(false);
        }
    };
    BsDropdownToggleDirective.prototype.onEsc = function () {
        if (this._state.autoClose) {
            this._state.toggleClick.emit(false);
        }
    };
    BsDropdownToggleDirective.prototype.ngOnDestroy = function () {
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
    };
    BsDropdownToggleDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[bsDropdownToggle],[dropdownToggle]',
                    exportAs: 'bs-dropdown-toggle',
                    host: {
                        '[attr.aria-haspopup]': 'true'
                    }
                },] },
    ];
    /** @nocollapse */
    BsDropdownToggleDirective.ctorParameters = function () {
        return [
            { type: BsDropdownState, },
            { type: core.ElementRef, },
        ];
    };
    BsDropdownToggleDirective.propDecorators = {
        'isDisabled': [{ type: core.HostBinding, args: ['attr.disabled',] },],
        'isOpen': [{ type: core.HostBinding, args: ['attr.aria-expanded',] },],
        'onClick': [{ type: core.HostListener, args: ['click', [],] },],
        'onDocumentClick': [{ type: core.HostListener, args: ['document:click', ['$event'],] },],
        'onEsc': [{ type: core.HostListener, args: ['keyup.esc',] },],
    };
    return BsDropdownToggleDirective;
}());
var BsDropdownModule = (function () {
    function BsDropdownModule() {
    }
    BsDropdownModule.forRoot = function (config) {
        return {
            ngModule: BsDropdownModule,
            providers: [
                ComponentLoaderFactory,
                PositioningService,
                BsDropdownState,
                {
                    provide: BsDropdownConfig,
                    useValue: config ? config : { autoClose: true }
                }
            ]
        };
    };
    BsDropdownModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [
                        BsDropdownMenuDirective,
                        BsDropdownToggleDirective,
                        BsDropdownContainerComponent,
                        BsDropdownDirective
                    ],
                    exports: [
                        BsDropdownMenuDirective,
                        BsDropdownToggleDirective,
                        BsDropdownDirective
                    ],
                    entryComponents: [BsDropdownContainerComponent]
                },] },
    ];
    /** @nocollapse */
    BsDropdownModule.ctorParameters = function () { return []; };
    return BsDropdownModule;
}());
var HeaderModule = /** @class */ (function () {
    function HeaderModule() {
    }
    return HeaderModule;
}());
HeaderModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule,
                    BsDropdownModule.forRoot()
                ],
                declarations: [HeaderComponent],
                exports: [
                    HeaderComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
HeaderModule.ctorParameters = function () { return []; };
var FooterComponent = /** @class */ (function () {
    function FooterComponent() {
    }
    /**
     * @return {?}
     */
    FooterComponent.prototype.ngOnInit = function () {
    };
    return FooterComponent;
}());
FooterComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'cb-footer',
                template: "\n    <footer class=\"footer\">\n      <div class=\"block\">\n        <div class=\"container\">\n          <div class=\"row\">\n            <div class=\"col-12 col-md-4\">\n              <ul class=\"footer-nav\">\n                <li><a href=\"#\">Home</a></li>\n                <li><a href=\"#\">Career</a></li>\n                <li><a href=\"#\">Legal &amp; Privacy</a></li>\n              </ul>\n            </div>\n            <div class=\"col-12 col-md-4\">\n            </div>\n            <div class=\"col-12 col-md-4\">\n              <div class=\"float-md-right\">\n                <div class=\"d-block d-md-none mt-4\"></div>\n                <p class=\"small footer-text\">\n                  <ng-content></ng-content>\n                </p>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </footer>\n  ",
                styles: ["\n    .footer {\n      margin-top: 30px; }\n      .footer .block {\n        padding: 30px 0;\n        border-radius: 0;\n        border-right: 0;\n        border-left: 0; }\n      .footer p {\n        margin-bottom: 0; }\n\n    ul.footer-nav {\n      margin-bottom: 0;\n      padding-left: 0; }\n      ul.footer-nav li {\n        display: inline;\n        margin-right: 20px;\n        font-size: 14px; }\n  "]
            },] },
];
/**
 * @nocollapse
 */
FooterComponent.ctorParameters = function () { return []; };
var FooterModule = /** @class */ (function () {
    function FooterModule() {
    }
    return FooterModule;
}());
FooterModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule
                ],
                declarations: [FooterComponent],
                exports: [
                    FooterComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
FooterModule.ctorParameters = function () { return []; };
var WalletComponent = /** @class */ (function () {
    function WalletComponent() {
    }
    /**
     * @return {?}
     */
    WalletComponent.prototype.ngOnInit = function () {
    };
    return WalletComponent;
}());
WalletComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'cb-wallet',
                template: "\n    <div class=\"row\">\n\n      <div class=\"col-12 col-lg-4\">\n        <div class=\"block\">\n          <h2 class=\"block-title\">Your wallets</h2>\n          <div class=\"list-group currencies-list\" id=\"list-tab\" role=\"tablist\">\n\n            <a *ngFor=\"let account of accounts\" class=\"list-group-item list-group-item-action\"\n               (click)=\"accountSelected = account\"\n               [ngClass]=\"{'active': accountSelected === account}\">\n              <i class=\"list-group-item-icon fa bg-warning\"\n                 [ngClass]=\"{\n                  'fa-btc bg-warning': account.currency === 'btc',\n                  'fa-jpy bg-primary': account.currency === 'jpy',\n                  'fa-try bg-info': account.currency === 'try',\n                  'fa-euro': account.currency === 'euro'\n                }\"></i>\n              <div>\n                <b>{{account.currency.toUpperCase()}} Wallet #{{account.id}}</b>\n                <div class=\"list-group-item-value\">\n                  {{account.balance}} {{account.currency.toUpperCase()}} = <span>\u20AC0.00</span>\n                </div>\n              </div>\n            </a>\n\n          </div>\n          <a class=\"list-group-item list-group-item-action text-center new-account\" id=\"list-settings-list\" data-toggle=\"list\" href=\"#list-settings\" role=\"tab\" aria-controls=\"settings\">\n            + New Wallet\n          </a>\n        </div>\n      </div>\n\n      <div class=\"col-12 col-lg-8 d-none d-lg-block d-xl-block\">\n        <div class=\"block\">\n\n          <div class=\"tab-content\" id=\"nav-tabContent\">\n\n            <div class=\"tab-pane fade show active\" id=\"list-home\" role=\"tabpanel\" aria-labelledby=\"list-home-list\" *ngIf=\"!!accountSelected\">\n              <div class=\"text-center pb-5\">\n\n                <div class=\"block-title\">\n                  <div class=\"row justify-content-center\">\n                    <ul class=\"nav nav-tabs\" role=\"tablist\">\n                      <li class=\"nav-item active\">\n                        <a class=\"nav-link\" href=\"#\"><i class=\"fa fa-arrow-down\"></i> Deposit</a>\n                      </li>\n                      <li class=\"nav-item\">\n                        <a class=\"nav-link\" href=\"#\"><i class=\"fa fa-paper-plane\"></i> Withdrawl</a>\n                      </li>\n                    </ul>\n                  </div>\n                </div>\n\n                <div class=\"row\">\n\n                  <div class=\"col-md-6 offset-md-3\">\n                    <div *ngIf=\"accountSelected && accountSelected.locked == 0; else locked\">\n                    </div>\n\n                    <div class=\"row justify-content-center pt-4\">\n                      <div class=\"icon-block btc\">\n                        <i class=\"icon fa fa-{{accountSelected.currency | lowercase }}\"\n                         [ngClass]=\"{\n                          'fa-btc bg-warning': accountSelected.currency === 'btc',\n                          'fa-jpy bg-primary': accountSelected.currency === 'jpy',\n                          'fa-try bg-info': accountSelected.currency === 'try',\n                          'fa-euro': accountSelected.currency === 'euro'\n                        }\"></i>\n                        <h2>{{accountSelected.currency | uppercase}}</h2>\n                        {{accountSelected.currency | lowercase }}\n                      </div>\n                    </div>\n\n                    <div class=\"col-12\">\n                      <div class=\"text-center mt-4\">\n                        <img src=\"assets/images/qr.gif\" />\n                      </div>\n                    </div>\n\n                    <div class=\"text-center\">\n                      <span class=\"uppercase\">Your {{accountSelected.currency | uppercase}} public address</span>\n                      <span class=\"break-word mt-2\"><input #depositAddress type=\"text\" class=\"form-control\" value=\"QC1UF0VCDEBl9LeYGtyvSpIZUHZOYl1meKpdzqb6Br\" onClick=\"select();\"></span>\n                    </div>\n\n                    <div class=\"row mt-2\">\n                      <div class=\"col-12\">\n                        <button class=\"btn btn-secondary btn-block\" [ngxClipboard]=\"depositAddress\" type=\"button\">Copy to clipboard</button>\n                      </div>\n                    </div>\n                  </div>\n\n                </div>\n                <ng-template #locked>\n                  <div class=\"row pt-4\">\n                    <div class=\"col-6\"><b>Locked</b><br>{{accountSelected.locked}} {{accountSelected.currency | uppercase}}</div>\n                    <div class=\"col-6\"><b>Balance</b><br>{{accountSelected.balance}} {{accountSelected.currency | uppercase}}</div>\n                  </div>\n                  <hr>\n                </ng-template>\n              </div>\n            </div>\n            <div class=\"tab-pane fade\" id=\"list-profile\" role=\"tabpanel\" aria-labelledby=\"list-profile-list\">Content 2</div>\n            <div class=\"tab-pane fade\" id=\"list-messages\" role=\"tabpanel\" aria-labelledby=\"list-messages-list\">Content 3</div>\n            <div class=\"tab-pane fade\" id=\"list-settings\" role=\"tabpanel\" aria-labelledby=\"list-settings-list\">Content 4</div>\n          </div>\n        </div>\n      </div>\n\n    </div>\n  ",
                styles: ["\n\n  "]
            },] },
];
/**
 * @nocollapse
 */
WalletComponent.ctorParameters = function () { return []; };
WalletComponent.propDecorators = {
    'accounts': [{ type: core.Input },],
};
var WINDOW = new core.InjectionToken('WindowToken');
/**
 * @return {?}
 */
function _window() {
    return window;
}
var WindowTokenModule = (function () {
    function WindowTokenModule() {
    }
    return WindowTokenModule;
}());
WindowTokenModule.decorators = [
    { type: core.NgModule, args: [{
                providers: [{
                        provide: WINDOW,
                        useFactory: _window
                    }]
            },] },
];
/**
 * @nocollapse
 */
WindowTokenModule.ctorParameters = function () { return []; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ClipboardService = (function () {
    function ClipboardService(document, window) {
        this.document = document;
        this.window = window;
    }
    Object.defineProperty(ClipboardService.prototype, "isSupported", {
        get: /**
         * @return {?}
         */ function () {
            return !!this.document.queryCommandSupported && !!this.document.queryCommandSupported('copy');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} element
     * @return {?}
     */
    ClipboardService.prototype.isTargetValid = /**
     * @param {?} element
     * @return {?}
     */
        function (element) {
            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                if (element.hasAttribute('disabled')) {
                    // tslint:disable-next-line:max-line-length
                    throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                }
                return true;
            }
            throw new Error('Target should be input or textarea');
        };
    /**
     * copyFromInputElement
     * @param {?} targetElm
     * @param {?} renderer
     * @return {?}
     */
    ClipboardService.prototype.copyFromInputElement = /**
     * copyFromInputElement
     * @param {?} targetElm
     * @param {?} renderer
     * @return {?}
     */
        function (targetElm, renderer) {
            try {
                this.selectTarget(targetElm, renderer);
                var /** @type {?} */ re = this.copyText();
                this.clearSelection(targetElm, this.window);
                return re;
            }
            catch (error) {
                return false;
            }
        };
    /**
     * Creates a fake textarea element, sets its value from `text` property,
     * and makes a selection on it.
     * @param {?} content
     * @param {?} renderer
     * @return {?}
     */
    ClipboardService.prototype.copyFromContent = /**
     * Creates a fake textarea element, sets its value from `text` property,
     * and makes a selection on it.
     * @param {?} content
     * @param {?} renderer
     * @return {?}
     */
        function (content, renderer) {
            if (!this.tempTextArea) {
                this.tempTextArea = this.createTempTextArea(this.document, this.window);
                this.document.body.appendChild(this.tempTextArea);
            }
            this.tempTextArea.value = content;
            return this.copyFromInputElement(this.tempTextArea, renderer);
        };
    /**
     * @return {?}
     */
    ClipboardService.prototype.destroy = /**
     * @return {?}
     */
        function () {
            if (this.tempTextArea) {
                this.document.body.removeChild(this.tempTextArea);
                this.tempTextArea = undefined;
            }
        };
    /**
     * @param {?} inputElement
     * @param {?} renderer
     * @return {?}
     */
    ClipboardService.prototype.selectTarget = /**
     * @param {?} inputElement
     * @param {?} renderer
     * @return {?}
     */
        function (inputElement, renderer) {
            renderer.invokeElementMethod(inputElement, 'select');
            renderer.invokeElementMethod(inputElement, 'setSelectionRange', [0, inputElement.value.length]);
            return inputElement.value.length;
        };
    /**
     * @return {?}
     */
    ClipboardService.prototype.copyText = /**
     * @return {?}
     */
        function () {
            return this.document.execCommand('copy');
        };
    /**
     * @param {?} inputElement
     * @param {?} window
     * @return {?}
     */
    ClipboardService.prototype.clearSelection = /**
     * @param {?} inputElement
     * @param {?} window
     * @return {?}
     */
        function (inputElement, window) {
            // tslint:disable-next-line:no-unused-expression
            inputElement && inputElement.blur();
            window.getSelection().removeAllRanges();
        };
    /**
     * @param {?} doc
     * @param {?} window
     * @return {?}
     */
    ClipboardService.prototype.createTempTextArea = /**
     * @param {?} doc
     * @param {?} window
     * @return {?}
     */
        function (doc, window) {
            var /** @type {?} */ isRTL = doc.documentElement.getAttribute('dir') === 'rtl';
            var /** @type {?} */ ta;
            ta = doc.createElement('textarea');
            // Prevent zooming on iOS
            ta.style.fontSize = '12pt';
            // Reset box model
            ta.style.border = '0';
            ta.style.padding = '0';
            ta.style.margin = '0';
            // Move element out of screen horizontally
            ta.style.position = 'absolute';
            ta.style[isRTL ? 'right' : 'left'] = '-9999px';
            // Move element to the same position vertically
            var /** @type {?} */ yPosition = window.pageYOffset || doc.documentElement.scrollTop;
            ta.style.top = yPosition + 'px';
            ta.setAttribute('readonly', '');
            return ta;
        };
    ClipboardService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    ClipboardService.ctorParameters = function () {
        return [
            { type: undefined, decorators: [{ type: core.Inject, args: [platformBrowser.DOCUMENT,] },] },
            { type: undefined, decorators: [{ type: core.Inject, args: [WINDOW,] },] },
        ];
    };
    return ClipboardService;
}());
/**
 * @param {?} doc
 * @param {?} win
 * @param {?} parentDispatcher
 * @return {?}
 */
function CLIPBOARD_SERVICE_PROVIDER_FACTORY(doc, win, parentDispatcher) {
    return parentDispatcher || new ClipboardService(doc, win);
}
var CLIPBOARD_SERVICE_PROVIDER = {
    deps: [platformBrowser.DOCUMENT, WINDOW, [new core.Optional(), new core.SkipSelf(), ClipboardService]],
    provide: ClipboardService,
    useFactory: CLIPBOARD_SERVICE_PROVIDER_FACTORY
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ClipboardDirective = (function () {
    function ClipboardDirective(clipboardSrv, renderer) {
        this.clipboardSrv = clipboardSrv;
        this.renderer = renderer;
        this.cbOnSuccess = new core.EventEmitter();
        this.cbOnError = new core.EventEmitter();
    }
    /**
     * @return {?}
     */
    ClipboardDirective.prototype.ngOnInit = /**
     * @return {?}
     */
        function () { };
    /**
     * @return {?}
     */
    ClipboardDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
        function () {
            this.clipboardSrv.destroy();
        };
    /**
     * @return {?}
     */
    ClipboardDirective.prototype.onClick = /**
     * @return {?}
     */
        function () {
            if (!this.clipboardSrv.isSupported) {
                this.handleResult(false, undefined);
            }
            else if (this.targetElm && this.clipboardSrv.isTargetValid(this.targetElm)) {
                this.handleResult(this.clipboardSrv.copyFromInputElement(this.targetElm, this.renderer), this.targetElm.value);
            }
            else if (this.cbContent) {
                this.handleResult(this.clipboardSrv.copyFromContent(this.cbContent, this.renderer), this.cbContent);
            }
        };
    /**
     * Fires an event based on the copy operation result.
     * @param {?} succeeded
     * @param {?} copiedContent
     * @return {?}
     */
    ClipboardDirective.prototype.handleResult = /**
     * Fires an event based on the copy operation result.
     * @param {?} succeeded
     * @param {?} copiedContent
     * @return {?}
     */
        function (succeeded, copiedContent) {
            if (succeeded) {
                this.cbOnSuccess.emit({ isSuccess: true, content: copiedContent });
            }
            else {
                this.cbOnError.emit({ isSuccess: false });
            }
        };
    ClipboardDirective.decorators = [
        { type: core.Directive, args: [{
                    // tslint:disable-next-line:directive-selector
                    selector: '[ngxClipboard]'
                },] },
    ];
    /** @nocollapse */
    ClipboardDirective.ctorParameters = function () {
        return [
            { type: ClipboardService, },
            { type: core.Renderer, },
        ];
    };
    ClipboardDirective.propDecorators = {
        "targetElm": [{ type: core.Input, args: ['ngxClipboard',] },],
        "cbContent": [{ type: core.Input },],
        "cbOnSuccess": [{ type: core.Output },],
        "cbOnError": [{ type: core.Output },],
        "onClick": [{ type: core.HostListener, args: ['click', ['$event.target'],] },],
    };
    return ClipboardDirective;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ClipboardModule = (function () {
    function ClipboardModule() {
    }
    ClipboardModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule, WindowTokenModule],
                    // tslint:disable-next-line:object-literal-sort-keys
                    declarations: [ClipboardDirective],
                    exports: [ClipboardDirective],
                    providers: [CLIPBOARD_SERVICE_PROVIDER]
                },] },
    ];
    /** @nocollapse */
    ClipboardModule.ctorParameters = function () { return []; };
    return ClipboardModule;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var WalletModule = /** @class */ (function () {
    function WalletModule() {
    }
    return WalletModule;
}());
WalletModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    platformBrowser.BrowserModule,
                    common.CommonModule,
                    ClipboardModule
                ],
                declarations: [WalletComponent],
                exports: [
                    WalletComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
WalletModule.ctorParameters = function () { return []; };
var HistoryComponent = /** @class */ (function () {
    function HistoryComponent() {
    }
    /**
     * @return {?}
     */
    HistoryComponent.prototype.ngOnInit = function () {
    };
    return HistoryComponent;
}());
HistoryComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'cb-history',
                template: "\n    <div class=\"block\">\n\n      <ul class=\"nav nav-tabs pt-2\" role=\"tablist\">\n        <li class=\"nav-item active\">\n          <a class=\"nav-link\" href=\"/history/orders\">Order History</a>\n        </li>\n        <li class=\"nav-item\">\n          <a class=\"nav-link\" href=\"/history/trades\">Trade History</a>\n        </li>\n        <li class=\"nav-item\">\n          <a class=\"nav-link\" href=\"/history/account\">Account History</a>\n        </li>\n      </ul>\n\n\n      <table class=\"table table-condensed table-striped mb-0\">\n        <thead>\n        <tr>\n          <th>ID <i class=\"fa fa-sort\"></i></th>\n          <th>Type <i class=\"fa fa-sort\"></i></th>\n          <th>State <i class=\"fa fa-sort\"></i></th>\n          <th>Market <i class=\"fa fa-sort\"></i></th>\n          <th>Price <i class=\"fa fa-sort\"></i></th>\n          <th>Volume <i class=\"fa fa-sort\"></i></th>\n          <th>Avg. Price <i class=\"fa fa-sort\"></i></th>\n          <th>Fullfilled <i class=\"fa fa-sort\"></i></th>\n          <th>Created At <i class=\"fa fa-sort\"></i></th>\n        </tr>\n        </thead>\n\n        <tbody>\n        <tr>\n          <td>1</td>\n          <td><i class=\"fa fa-btc\"></i> BTC</td>\n          <td>Active</td>\n          <td>Market</td>\n          <td>0.00000</td>\n          <td>200</td>\n          <td>0.00000</td>\n          <td>Fullfilled</td>\n          <td>12-03-2017</td>\n        </tr>\n        <tr>\n          <td>2</td>\n          <td><i class=\"fa fa-btc\"></i> BTC</td>\n          <td>Active</td>\n          <td>Market</td>\n          <td>0.00000</td>\n          <td>200</td>\n          <td>0.00000</td>\n          <td>Fullfilled</td>\n          <td>12-03-2017</td>\n        </tr>\n        <tr>\n          <td>3</td>\n          <td><i class=\"fa fa-btc\"></i> BTC</td>\n          <td>Active</td>\n          <td>Market</td>\n          <td>0.00000</td>\n          <td>200</td>\n          <td>0.00000</td>\n          <td>Fullfilled</td>\n          <td>12-03-2017</td>\n        </tr>\n        </tbody>\n      </table>\n    </div>\n\n    <nav class=\"mt-3\">\n      <ul class=\"pagination\">\n        <li class=\"page-item\">\n          <a class=\"page-link\" href=\"#\" aria-label=\"Previous\">\n            <span aria-hidden=\"true\">&laquo;</span>\n            <span class=\"sr-only\">Previous</span>\n          </a>\n        </li>\n        <li class=\"page-item active\"><a class=\"page-link\" href=\"#\">1</a></li>\n        <li class=\"page-item\"><a class=\"page-link\" href=\"#\">2</a></li>\n        <li class=\"page-item\"><a class=\"page-link\" href=\"#\">3</a></li>\n        <li class=\"page-item\">\n          <a class=\"page-link\" href=\"#\" aria-label=\"Next\">\n            <span aria-hidden=\"true\">&raquo;</span>\n            <span class=\"sr-only\">Next</span>\n          </a>\n        </li>\n      </ul>\n    </nav>\n  ",
                styles: ["\n\n  "]
            },] },
];
/**
 * @nocollapse
 */
HistoryComponent.ctorParameters = function () { return []; };
var HistoryModule = /** @class */ (function () {
    function HistoryModule() {
    }
    return HistoryModule;
}());
HistoryModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule
                ],
                declarations: [HistoryComponent],
                exports: [
                    HistoryComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
HistoryModule.ctorParameters = function () { return []; };
var SettingComponent = /** @class */ (function () {
    function SettingComponent() {
    }
    /**
     * @return {?}
     */
    SettingComponent.prototype.ngOnInit = function () {
    };
    return SettingComponent;
}());
SettingComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'cb-setting',
                template: "\n    <div class=\"card\">\n\n      <div class=\"card-block\">\n        <div class=\"row\">\n\n          <div class=\"col-md-5\">\n            <div class=\"p-3\">\n              <h3>admin@peatio.tech</h3>\n              <p>Admin and revise your profile.\n                <br>\n                <span class=\"badge badge-warning\">ADMIN</span>\n              </p>\n              <p>In order to protect your bitcoins and personal information, we strongly suggest that you use Two-Factor Authentication.</p>\n            </div>\n          </div>\n\n          <div class=\"col\">\n            <div class=\"row\">\n\n              <div class=\"col-md-12\">\n                <div class=\"card-block no-padding\">\n                  <div class=\"list-group icons-list\" id=\"list-tab\" role=\"tablist\">\n                    <div class=\"list-group-item list-group-item-wizard active\" id=\"list-home-list\" data-toggle=\"list\" href=\"#list-home\" role=\"tab\" aria-controls=\"home\">\n                      <span class=\"list-group-item-icon bg-success\">1</span>\n                      <div class=\"completed\">\n                        <b>E-mail verification</b>\n                        <div class=\"list-group-item-subtitle\">\n                          <span>\n                            Your email adress has been verified successfully, remember and protect this e-mail address, it is the single certificate for your account\n                          </span>\n                        </div>\n                      </div>\n\n                    </div>\n                    <div class=\"list-group-item list-group-item-wizard\" id=\"list-profile-list\" data-toggle=\"list\" href=\"#list-profile\" role=\"tab\" aria-controls=\"profile\">\n                      <span class=\"list-group-item-icon\">2</span>\n                      <div>\n                        <b>Verify Account</b>\n                        <div class=\"list-group-item-subtitle\">\n                          <span>Help keep the bad guys out of your account by using both your password and your phone</span>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"list-group-item list-group-item-wizard\" id=\"list-messages-list\" data-toggle=\"list\" href=\"#list-messages\" role=\"tab\" aria-controls=\"messages\">\n                      <span class=\"list-group-item-icon bg-success\">3</span>\n                      <div class=\"completed\">\n                        <b>Phone Number</b>\n                        <div class=\"list-group-item-subtitle\">\n                          <span>Providing a phone number will make your account more secure. You can quickly reset your password and your account operations will be notified.</span>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"list-group-item list-group-item-wizard\" id=\"list-settings-list\" data-toggle=\"list\" href=\"#list-settings\" role=\"tab\" aria-controls=\"settings\">\n                      <span class=\"list-group-item-icon\">4</span>\n                      <div>\n                        <b>Two-Factor Authentication</b>\n                        <div class=\"list-group-item-subtitle\">\n                          <span>Two-Factor Authentication provides another layer of security to your account.</span>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"list-group-item list-group-item-wizard\"  aria-controls=\"settings\">\n                      <span class=\"list-group-item-icon\">5</span>\n                      <div>\n                        <b>Password</b>\n                        <div class=\"list-group-item-subtitle\">\n                          <span>This password is required for login, please remember it.</span>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n\n    </div>\n  ",
                styles: ["\n\n  "]
            },] },
];
/**
 * @nocollapse
 */
SettingComponent.ctorParameters = function () { return []; };
var SettingModule = /** @class */ (function () {
    function SettingModule() {
    }
    return SettingModule;
}());
SettingModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule
                ],
                declarations: [SettingComponent],
                exports: [
                    SettingComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
SettingModule.ctorParameters = function () { return []; };
var NavbarComponent = /** @class */ (function () {
    function NavbarComponent() {
    }
    /**
     * @return {?}
     */
    NavbarComponent.prototype.ngOnInit = function () {
    };
    return NavbarComponent;
}());
NavbarComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'cb-navbar',
                template: "\n    <div class=\"main-nav\">\n        <div class=\"container\">\n\n            <nav class=\"navbar navbar-expand-lg main-nav\">\n                <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarSupportedContent\" aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n                    <span class=\"navbar-toggler-icon\"></span>\n                </button>\n\n                <div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\">\n                    <ul class=\"navbar-nav mr-auto\">\n                        <ng-content></ng-content>\n                    </ul>\n                </div>\n            </nav>\n        </div>\n    </div>\n  ",
                styles: ["\n\n  "]
            },] },
];
/**
 * @nocollapse
 */
NavbarComponent.ctorParameters = function () { return []; };
var NavbarModule = /** @class */ (function () {
    function NavbarModule() {
    }
    return NavbarModule;
}());
NavbarModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule
                ],
                declarations: [NavbarComponent],
                exports: [
                    NavbarComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
NavbarModule.ctorParameters = function () { return []; };
var PagerService = /** @class */ (function () {
    function PagerService() {
    }
    /**
     * @param {?} totalItems
     * @param {?=} currentPage
     * @param {?=} pageSize
     * @return {?}
     */
    PagerService.prototype.getPager = function (totalItems, currentPage, pageSize) {
        if (currentPage === void 0) { currentPage = 1; }
        if (pageSize === void 0) { pageSize = 10; }
        var /** @type {?} */ totalPages = Math.ceil(totalItems / pageSize);
        var /** @type {?} */ startPage, /** @type {?} */ endPage;
        if (totalPages <= 10) {
            startPage = 1;
            endPage = totalPages;
        }
        else {
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            }
            else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            }
            else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
        var /** @type {?} */ startIndex = (currentPage - 1) * pageSize;
        var /** @type {?} */ endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        var /** @type {?} */ pages = Array.from(Array(endPage + 1 - startPage), function (_, i) { return startPage + i; });
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    };
    return PagerService;
}());
var TableComponent = /** @class */ (function () {
    /**
     * @param {?} pagerService
     */
    function TableComponent(pagerService) {
        this.pagerService = pagerService;
        this.pager = {};
    }
    /**
     * @return {?}
     */
    TableComponent.prototype.ngOnInit = function () {
        this.allItems = this.config.values;
        this.setPage(1);
    };
    /**
     * @param {?} field
     * @return {?}
     */
    TableComponent.prototype.mySorting = function (field) {
        if (this.order === 'asc') {
            this.order = 'desc';
        }
        else {
            this.order = 'asc';
        }
        this.sortField = field;
        this.sort();
        this.setPage(this.pager.currentPage);
    };
    /**
     * @param {?} page
     * @return {?}
     */
    TableComponent.prototype.setPage = function (page) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.allItems.length, page);
        this.config.values = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    /**
     * @return {?}
     */
    TableComponent.prototype.sort = function () {
        var _this = this;
        if (this.order === 'asc') {
            this.allItems.sort(function (a, b) {
                if (a[_this.sortField] > b[_this.sortField]) {
                    return 1;
                }
                else if (a[_this.sortField] < b[_this.sortField]) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            return this.allItems;
        }
        else if (this.order === 'desc') {
            this.allItems.sort(function (a, b) {
                if (a[_this.sortField] > b[_this.sortField]) {
                    return -1;
                }
                else if (a[_this.sortField] < b[_this.sortField]) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            return this.allItems;
        }
        else {
            return this.allItems;
        }
    };
    return TableComponent;
}());
TableComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'cb-table',
                template: "\n      <table class=\"table table-condensed table-striped mb-0\" *ngIf=\"config\">\n          <thead>\n              <tr>\n                  <th *ngFor=\"let column of config.columns\">\n                      {{column.label}}\n                      <i *ngIf=\"column.isSortable\" class=\"fa fa-sort\" [ngClass]=\"{\n                                    'fa-sort-asc': (order === 'asc' && column.field === sortField),\n                                    'fa-sort-desc': (order === 'desc' && column.field === sortField)\n                                  }\" aria-hidden=\"true\" (click)=\"mySorting(column.field)\"></i>\n                  </th>\n              </tr>\n          </thead>\n          <tbody>\n              <tr *ngFor=\"let value of config.values\">\n                  <td *ngFor=\"let column of config.columns\">\n                      {{value[column.field]}}\n                  </td>\n              </tr>\n          </tbody>\n      </table>\n      <nav class=\"mt-3\">\n          <ul *ngIf=\"pager.pages && pager.pages.length\" class=\"pagination\">\n              <li class=\"page-item\" [ngClass]=\"{disabled:pager.currentPage === 1}\">\n                  <a (click)=\"setPage(pager.currentPage - 1)\" class=\"page-link\">Previous</a>\n              </li>\n              <li class=\"page-item\" *ngFor=\"let page of pager.pages\" [ngClass]=\"{active:pager.currentPage === page}\">\n                  <a (click)=\"setPage(page)\" class=\"page-link\">{{page}}</a>\n              </li>\n              <li class=\"page-item\" [ngClass]=\"{disabled:pager.currentPage === pager.totalPages}\">\n                  <a (click)=\"setPage(pager.currentPage + 1)\" class=\"page-link\">Next</a>\n              </li>\n          </ul>\n      </nav>\n    ",
                styles: ["\n\n    "]
            },] },
];
/**
 * @nocollapse
 */
TableComponent.ctorParameters = function () { return [
    { type: PagerService, },
]; };
TableComponent.propDecorators = {
    'config': [{ type: core.Input },],
};
var TableModule = /** @class */ (function () {
    function TableModule() {
    }
    return TableModule;
}());
TableModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule
                ],
                declarations: [TableComponent],
                providers: [PagerService],
                exports: [
                    TableComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
TableModule.ctorParameters = function () { return []; };

exports.HeaderModule = HeaderModule;
exports.FooterModule = FooterModule;
exports.WalletModule = WalletModule;
exports.HistoryModule = HistoryModule;
exports.SettingModule = SettingModule;
exports.NavbarModule = NavbarModule;
exports.TableModule = TableModule;
exports.ɵb = FooterComponent;
exports.ɵa = HeaderComponent;
exports.ɵd = HistoryComponent;
exports.ɵf = NavbarComponent;
exports.ɵe = SettingComponent;
exports.ɵh = PagerService;
exports.ɵg = TableComponent;
exports.ɵc = WalletComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-cryptobase.umd.js.map
