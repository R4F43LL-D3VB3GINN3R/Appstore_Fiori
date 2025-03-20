sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("sbx.rla.bc.appstore.controller.catalogo", {

        onInit: function () { 

            this.oModel = this.getOwnerComponent().getModel(); // model principal
            this.entityNames = []; // arrays de nomes dos models
            this.oModels = [];     // array de models 

            // funcoes de inicializacao
            this.createModels(); // cria os models
            this.createEntity(); // preenche array de entidades
            this.getData();      // carrega os dados dos serviços
        },

        //------------------------------------
        //      DADOS DE INICIALIZACAO
        //------------------------------------

        //----------------------------------------------------------------------------
        //                          Carrega os modelos
        //----------------------------------------------------------------------------
        createModels: function() {

            var modelsData = [
                { modelName: "categoriaCollection", modelRef: "oModelCategorias" },
                { modelName: "produtosCollection", modelRef: "oModelProdutos" },
            ];

            modelsData.forEach(function(entry) {
                this[entry.modelRef] = new sap.ui.model.json.JSONModel();
                this.getView().setModel(this[entry.modelRef], entry.modelName);
                this.oModels.push(this[entry.modelRef]);
            }.bind(this)); 
        },
        //----------------------------------------------------------------------------
        //                             Carrega os URLs
        //----------------------------------------------------------------------------
        createEntity: function() {

            var urlNames = [
                { path: "/CategoriaSet" },
                { path: "/ProdutoSet" }
            ];

            urlNames.forEach(function(name) {
                this.entityNames.push(name.path);
            }.bind(this));
        },
        //----------------------------------------------------------------------------
        //                          Envio de Pedidos
        //----------------------------------------------------------------------------
        getData: async function () {
            for (let i = 0; i < this.entityNames.length; i++) {
                await this._loadEntity(this.entityNames[i], i);
            }
        },

        _loadEntity: function (path, index) {
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
        },

        //------------------------------------
        //           FORMATADORES
        //------------------------------------

        formatDate: function(sDate) {

            if (!sDate) return "";

            //mascara para data
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd.MM.yyyy" 
            });

            return oDateFormat.format(new Date(sDate));
        },

        formatEstockState: function(iQuantity) {

            // retorna estado de estoque
            if (iQuantity > 100) {
                return "Success"; 
            } else if (iQuantity > 49) {
                return "Warning"; 
            } else if (iQuantity > 20) {
                return "Error"; 
            } else {
                return "Error"; 
            }
        },

        formatDecimal: function(value) {
            if (value === null || value === undefined) {
                return "0.00"; 
            }

            // retorna formatador para duas casas decimais
            return parseFloat(value).toFixed(2); 
        }
    });
});
