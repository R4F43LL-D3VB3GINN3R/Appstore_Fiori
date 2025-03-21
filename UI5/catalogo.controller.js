sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter"
],
function (Controller, JSONModel, FilterOperator, Filter) {
    "use strict";

    return Controller.extend("sbx.rla.bc.appstore.controller.catalogo", {

        onInit: function () { 

            this.oModel = this.getOwnerComponent().getModel(); // model principal

            this.entityNames   = []; // arrays de nomes dos models
            this.oModels       = []; // array de models 
            this.oModelsAssocs = []; // array de models de associations
            this.aFilters      = []; // array de filtros

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
                { modelName: "categoriaCollection" },
                { modelName: "produtosCollection" }
            ];

            modelsData.forEach(function(entry) {
                var ModelRef = new JSONModel();
                this.getView().setModel(ModelRef, entry.modelName);
                this.oModels.push(ModelRef);
            }.bind(this)); 
        },

        //----------------------------------------------------------------------------
        //                             Carrega os URLs
        //----------------------------------------------------------------------------
        createEntity: function() {

            // urls de carregamento
            var urlNames = [
                { path: "/CategoriaSet" },
                { path: "/ProdutoSet" }
            ];

            urlNames.forEach(function(name) {
                this.entityNames.push(name.path);
            }.bind(this));
        },

        //----------------------------------------------------------------------------
        //                            Envio de Pedidos
        //----------------------------------------------------------------------------
        getData: async function () {
            for (let i = 0; i < this.entityNames.length; i++) {
                await this._loadEntity(this.entityNames[i], i);
            }

            this.updateStockCounts();
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

        //----------------------------------------------------------------------------
        //                           Contagem de Estoque
        //----------------------------------------------------------------------------
        updateStockCounts: function () {

            var oTable    = this.getView().byId("tabelaProdutos");
            var oBinding  = oTable.getBinding("items");
            var aContexts = oBinding.getContexts(); // Obtém os dados filtrados

            var bomCount     = 0;
            var alertaCount  = 0;
            var criticoCount = 0;

            aContexts.forEach(function (oContext) {
                var item = oContext.getObject();

                if (item.Estoque > 100) {
                    bomCount++;
                } else if (item.Estoque >= 50 && item.Estoque <= 100) {
                    alertaCount++;
                } else if (item.Estoque <= 49) {
                    criticoCount++;
                }
            });

            var oModelEstoque = new JSONModel({
                bomCount:     bomCount,
                alertaCount:  alertaCount,
                criticoCount: criticoCount
            });

            this.getView().setModel(oModelEstoque, "stockCounts");
        },

        //------------------------------------
        //             FILTROS 
        //------------------------------------
        onSearchFilters: function() {

            var oView  = this.getView();
            var oTable = oView.byId("tabelaProdutos");

            this.aFilters = [];

            this._getFilterCategoria(); 
            this._getFilterNumProd();
            this._getFilterEstoque();

            var oBinding = oTable.getBinding("items");
            oBinding.filter(this.aFilters);

            this.updateStockCounts();
        },

        _getFilterCategoria: function () {

            //filtro de categoria
            var oView       = this.getView();
            var oComboBox   = oView.byId("comboCategoria1");
            var idCategoria = oComboBox.getSelectedKey();

            if (idCategoria) {
                this.aFilters.push(new Filter("IdCategoria", FilterOperator.EQ, idCategoria));
            }
        },

        _getFilterNumProd: function() {

            //filtro do numero do produto
            var oView      = this.getView();
            var oInput     = oView.byId("searchField");
            var NumProduto = oInput.getValue();

            if (NumProduto) {
                this.aFilters.push(new Filter("IdProduto", FilterOperator.EQ, NumProduto));
            }
        },

        _getFilterEstoque: function() {

            //filtro de estoque
            var oView        = this.getView();
            var oIconTabBar  = oView.byId("iconTabBar");
            var sSelectedKey = oIconTabBar.getSelectedKey();

            if (sSelectedKey) {
                var stockFilter;
                switch (sSelectedKey) {
                    case "Bom":
                        stockFilter = new Filter("Estoque", FilterOperator.GT, 100);
                        break;
                    case "Alerta":
                        stockFilter = new Filter("Estoque", FilterOperator.BT, 50, 100);
                        break;
                    case "Crítico":
                        stockFilter = new Filter("Estoque", FilterOperator.LE, 49);
                        break;
                }
            
                if (stockFilter) {
                    this.aFilters.push(stockFilter);
                }
            }
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
