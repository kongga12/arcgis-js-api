// COPYRIGHT © 2016 Esri
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// This material is licensed for use under the Esri Master License
// Agreement (MLA), and is bound by the terms of that agreement.
// You may redistribute and use this code without modification,
// provided you adhere to the terms of the MLA and include this
// copyright notice.
//
// See use restrictions at http://www.esri.com/legal/pdfs/mla_e204_e300/english
//
// For additional information, contact:
// Environmental Systems Research Institute, Inc.
// Attn: Contracts and Legal Services Department
// 380 New York Street
// Redlands, California, USA 92373
// USA
//
// email: contracts@esri.com
//
// See http://js.arcgis.com/4.2/esri/copyright.txt for details.

define(["../../core/domUtils","../../core/promiseUtils","../../portal/Portal","../../symbols/support/gfxUtils","../../symbols/support/symbolUtils","./support/symbolFetcher","./support/symbolStorage","./support/symbolUtils","dijit/_TemplatedMixin","dijit/_WidgetBase","dijit/_WidgetsInTemplateMixin","dojo/dom-class","dojo/dom-construct","dojo/on","dojo/promise/all","dojo/store/Memory","dojo/store/Observable","dojo/i18n!./nls/SymbolStyler","dojo/text!./templates/MarkerSymbolPicker.html","dijit/form/Select"],function(e,t,o,i,s,l,r,n,a,m,c,d,y,u,h,b,p,S,_){var f={id:"customTypes",keywords:"custom symbols",name:S.customImages,title:S.customImages},v={root:"esri-marker-symbol-picker",symbolGrid:"esri-symbol-grid",symbol:"esri-symbol",noSymbols:"esri-no-symbols",defaultSymbols:"esri-default-symbols",loadingIndicator:"esri-loading-indicator",loading:"esri-loading",typeInput:"esri-type-input",container:"esri-container",overlay:"esri-overlay",content:"esri-content",centerContainer:"esri-center-container",table:"esri-table",tableCell:"esri-table-cell",centerBlock:"esri-center-block",loadingSymbolViewport:"esri-marker-symbol-picker__symbolViewport--loading",selectedSymbol:"esri-symbol--selected",dimensionalityFlat:"esri-marker-symbol-picker--dimensionality-flat",dimensionalityVolumetric:"esri-marker-symbol-picker--dimensionality-volumetric",blocked:"esri-marker-symbol-picker--blocked"},g=m.createSubclass([a,c],{baseClass:v.root,declaredClass:"esri.dijit.SymbolStyler.MarkerSymbolPicker",templateString:_,css:v,postCreate:function(){this.inherited(arguments),this._sourceSymbolTypesStore=new b,this._symbolTypesStore=new p(new b),this._symbolItemStore=new b,this._symbolItemSurfaces=[],this._activeSymbolFetch={},this.dap_markerCategoryInput.set({labelAttr:"name",sortByLabel:!1})},startup:function(){this.inherited(arguments);var e=this;u(this.dap_symbolGrid,".esri-symbol:click",function(){e._selectedNode&&d.remove(e._selectedNode,v.selectedSymbol),e._selectedNode=this,d.add(this,v.selectedSymbol),e.emit("symbol-select",{selection:this.symbol.clone()})}),this.dap_markerCategoryInput.on("change",function(e){this.clearSelection(),this._fetchSymbols(e)}.bind(this)),this.refresh()},_3dSymbolsFilter:"volumetric",_symbolTypesStore:null,_sourceSymbolTypesStore:null,_symbolItemStore:null,_symbolItemSurfaces:null,_noSymbolsOverlay:null,_symbolGrid:null,_portal:null,_portalLoadTimeoutInMs:3e3,_selectedNode:null,displayMode:"portal",portal:null,symbolSource:"symbol-set",addCustomImageSymbol:function(e){var t=e.clone(),o=r.loadCustomItems()||[],i=t.url.split("/").pop(),s=o.some(function(e){return e.url===t.url});s||(t.type="esriPMS",t.name=i,o.push(t),this.dap_markerCategoryInput.set("value",f.id),this.clearSelection(),this._fetchSymbols(f.id))},_getDimensionality:function(){return this.symbolSource.split(":")[1]},_updateDisplay:function(){var t=this.dap_markerCategoryInput;this.clearSelection(),"portal"===this.displayMode?(this._fetchSymbols(t.value),e.show(t.domNode),d.remove(this.domNode,v.defaultSymbols)):"default"===this.displayMode&&(this._updateSymbolOptions(l.getBasic()),e.hide(t.domNode),d.add(this.domNode,v.defaultSymbols))},refresh:function(){this._blockInteraction(!0),this._setUpDimensionality(),this._setUpSymbolCategories().then(this._updateDisplay.bind(this)).then(function(){this._blockInteraction(!1)}.bind(this))},_blockInteraction:function(e){this.dap_markerCategoryInput.set("disabled",e),d.toggle(this.domNode,v.blocked,e)},clearSelection:function(){y.empty(this.dap_symbolGrid)},_activeSymbolFetch:null,_fetchSymbols:function(e){var t,o;this._activeSymbolFetch.promise&&(this._activeSymbolFetch.promise.cancel(),this._activeSymbolFetch.promise=null,this._activeSymbolFetch.id=null),t=this._symbolItemStore.query({id:e})[0],t&&(r.saveRecentItem(t),this._updateSymbolOptions(t.symbols),t.id!==f.id)||(o=this._symbolTypesStore.query({id:e})[0],this._activeSymbolFetch.id=e,this._showLoadingIndicator(),this._activeSymbolFetch.promise=this._getSymbols(o).then(function(t){var o,i={id:e,symbols:t};return this._symbolItemStore.put(i),r.saveRecentItem(i),o=this._symbolTypesStore.query({defaultType:!0})[0],o&&o.id===e&&r.saveDefaultItem(i),t}.bind(this)).then(function(t){e===this._activeSymbolFetch.id&&this._updateSymbolOptions(t)}.bind(this)))},_showLoadingIndicator:function(){d.add(this.dap_symbolViewport,v.loadingSymbolViewport)},_hideLoadingIndicator:function(){d.remove(this.dap_symbolViewport,v.loadingSymbolViewport)},_showNoSymbolsMessage:function(){this._hideLoadingIndicator(),d.add(this.domNode,v.noSymbols),this._placeNoSymbolsOverlay()},_placeNoSymbolsOverlay:function(){var e,t,o,i;this._noSymbolsOverlay||(e=y.create("div",{"class":v.overlay}),i=y.create("div",{"class":v.centerContainer+" "+v.table},e),o=y.create("div",{"class":v.tableCell},i),t=y.create("div",{"class":v.centerBlock},o),y.create("div",{"class":v.content,innerHTML:S.symbolLoadError},t),y.place(e,this.domNode),this._noSymbolsOverlay=e)},_setUpSymbolCategories:function(){return this._showLoadingIndicator(),this._initPortal().then(function(e){return 0===this.symbolSource.indexOf("symbol-set")?l.fetchSymbolSetSymbolSources(e):l.fetchWebStyleSymbolSources(e)}.bind(this)).then(function(e){var t=this._webStyleItemKeywordBlacklist;return e.filter(function(e){return!e.portalItem.typeKeywords.some(function(e){return t[e]})})}.bind(this)).then(function(e){if(0===this.symbolSource.indexOf("symbol-set"))return e;var o=this._getDimensionality(),i=e.map(function(e){return e.portalItem.fetchData()});return t.eachAlways(i).then(function(t){var i=[l.getPrimitives(o)];return t.forEach(function(t,l){var r=t.value;if(r&&r.items&&Array.isArray(r.items)&&0!==r.items.length){var n=s.styleNameFromItem(e[l].portalItem),a="EsriIconsStyle"===n?"flat":"volumetric",m=r.items[0].dimensionality||a;m===o&&i.push(e[l])}}),i})}.bind(this)).then(this._setUpSymbolSelect.bind(this)).otherwise(this._showNoSymbolsMessage.bind(this))},_webStyleItemKeywordBlacklist:{EsriThematicShapesStyle:!0},_setUpDimensionality:function(){var e="volumetric"===this._getDimensionality();d.toggle(this.domNode,v.dimensionalityVolumetric,e),d.toggle(this.domNode,v.dimensionalityFlat,!e)},_setUpSymbolSelect:function(e){var t,o,i,s=this._sourceSymbolTypesStore;s.setData(e),e.forEach(function(e){e.defaultType&&(t=e.id)}),o=r.loadRecentSymbolItem(),o&&(i=s.query({id:o.id})[0],i&&(t=o.id));var l=this._symbolTypesStore;l.setData(s.query()),this.dap_markerCategoryInput.set("store",l),this.dap_markerCategoryInput.set("value",t,!1)},_injectCustomSymbolType:function(e){return e.push(f),e},_initPortal:function(){var e,i=this.portal||o.getDefault();return e=t.timeout(i.load().then(function(){return this._portal=i,i}.bind(this)),this._portalLoadTimeoutInMs),this.own(e),e},_getSymbols:function(e){return e.id===f.id?r.loadCustomItems():e.getSymbols().then(function(e){return 0===this.symbolSource.indexOf("symbol-set")?e:e.filter(function(e){var t=n.getDimensionality(e),o=this.symbolSource.split(":")[1];return!o||t===o},this)}.bind(this))},_updateSymbolOptions:function(e){this._symbolItemSurfaces.forEach(function(e){e&&e.destroy()}),this._symbolItemSurfaces.length=0;var t="volumetric"===this._getDimensionality(),o=t?48:24;h(e.map(function(e){var t=y.create("div",{className:v.symbol});return"point-symbol-3d"===e.type&&e.symbolLayers.forEach(function(e){e.get("material.color")&&("Icon"===e.type?e.material.color=i.defaultThematicColor.clone():"Object"===e.type&&(e.material.color=[255,255,255]))}),t.symbol=e,n.renderOnSurface(e,t,o)})).then(function(e){var t=document.createDocumentFragment();e.forEach(function(e){t.appendChild(e._parent)}),this.dap_symbolGrid.appendChild(t),this._hideLoadingIndicator()}.bind(this))}});return g});