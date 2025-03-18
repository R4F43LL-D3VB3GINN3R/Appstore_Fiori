sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
],
function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("sbx.rla.bc.appstore.controller.admin", {
        onInit: function () {

        },

        onRouteCatalogo: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteCatalogo");
        }
    });
});
