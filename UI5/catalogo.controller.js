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
            this.oModels   = [];   // array de models 

            // funcoes de inicializacao
            this.createModels(); // cria os models
            this.createEntity(); // preenche array de entidades
            this.getData();      // carrega os dados dos serviços
        },

        createModels: function() {

            //cria colecao de categorias
            this.oModelCategorias = new JSONModel();
            var nameModel = "categoriaCollection";
            this.getView().setModel(this.oModelCategorias, nameModel);
            this.oModels.push(this.oModelCategorias);

            //cria colecao de produtos
            this.oModelProdutos = new JSONModel();
            var nameModel = "produtosCollection";
            this.getView().setModel(this.oModelProdutos, nameModel);
            this.oModels.push(this.oModelProdutos);
        },

        createEntity: function() {

            var entityName;  

            // preenche array de entidades
            entityName = "/CategoriaSet";
            this.entityNames.push(entityName);
            entityName = "/ProdutoSet";
            this.entityNames.push(entityName);
        },

        getData: async function() {

            var that = this;

            // a cada iteracao aguarda o resultado da promessa
            for (let i = 0; i < this.entityNames.length; i++) {
                await that.loadEntity(that.entityNames[i], i); 
            }
        },

        loadEntity: function(path, index) {

            var that = this; 

            // retorna oData como resultado da promessa
            return new Promise(function(resolve, reject) {
                that.oModel.read(path, {
                    success: function (oData) {
                        that.oModels[index].setData(oData); 
                        resolve(oData); 
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                });
            });
        },

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
