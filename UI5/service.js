sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel)  {
    "use strict";

    class Service {

        oView       = null;
        oModel      = null;
        collections = [];
        entityNames = [];
        urlNames    = [];
        oModels     = [];

        constructor(oModel, oView, aCollections, aUrls) {
            this.oView       = oView;
            this.oModel      = oModel; 
            this.collections = aCollections;
            this.urlNames    = aUrls;

            this._setCollections();
            this._setUrls();
        }

        _setCollections() {
            this.collections.forEach(function(name) {
                var ModelRef = new JSONModel();
                this.oView.setModel(ModelRef, name); 
                this.oModels.push(ModelRef);
            }.bind(this));
        }

        _setUrls() {
            this.urlNames.forEach(function(name) {
                this.entityNames.push(name);
            }.bind(this));
        }

        async loadService() {
            for (let i = 0; i < this.entityNames.length; i++) {
                await this._getData(this.entityNames[i], i);
            }
        }

        _getData(path, index) {
            return new Promise((resolve, reject) => {
                this.oModel.read(path, {
                    success: function (oData) {
                        this.oModels[index].setData(oData);
                        resolve(oData);
                    }.bind(this), 

                    error: function (oError) {
                        reject(oError);
                    }.bind(this) 
                });
            });
        }
    }

    return Service;
});
