sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "../utils/formatter",
    "../classes/service"
],
function (Controller, JSONModel, FilterOperator, Filter, formatter, service) {
    "use strict";

    return Controller.extend("sbx.rla.bc.appstore.controller.catalogo", {

        formatter: formatter,
        service: service,

        onInit: async function () { 

            // parametros de entrada para carregamento de serviço
            this.oModel     = this.getOwnerComponent().getModel(); 
            this.oView      = this.getView();
            this.modelsData = ["categoriaCollection", "produtosCollection"];
            this.urlNames   = ["/CategoriaSet", "/ProdutoSet"];

            //classe de carregamento de serviço
            this.oService = new service(this.oModel, this.oView, this.modelsData, this.urlNames);
            await this.oService.loadService();

            //criacao do filtro e atualização de produtos em estoque
            this.aFilters = []; 
            this.updateStockCounts();
        },

        testes: function() {
            // this.oService.loadService();
        },

        //----------------------------------------------------------------------------
        //                           Contagem de Estoque
        //----------------------------------------------------------------------------
        updateStockCounts: function () {

            //recebe todas as linhas da tabela em carregamento
            var oTable    = this.getView().byId("tabelaProdutos");
            var oBinding  = oTable.getBinding("items");
            var aContexts = oBinding.getContexts(); 

            //contadores de status
            var bomCount     = 0;
            var alertaCount  = 0;
            var criticoCount = 0;
            var totalCount   = 0;

            //conta o status das colunas de estoque
            aContexts.forEach(function (oContext) {
                var item = oContext.getObject();
                console.log(item.Estoque);
                if (item.Estoque > 100) {
                    bomCount++;
                    totalCount++;
                } else if (item.Estoque >= 50 && item.Estoque <= 100) {
                    alertaCount++;
                    totalCount++;
                } else if (item.Estoque <= 49) {
                    criticoCount++;
                    totalCount++;
                }
            });

            //cria um novo model para os icons
            var oModelEstoque = new JSONModel({
                bomCount:     bomCount,
                alertaCount:  alertaCount,
                criticoCount: criticoCount,
                totalCount:   totalCount
            });

            //popula o model com os contadores
            this.getView().setModel(oModelEstoque, "stockCounts");
        },

        //------------------------------------
        //             FILTROS 
        //------------------------------------
        onSearchFilters: function() {

            var oView  = this.getView();
            var oTable = oView.byId("tabelaProdutos");

            //reinicia filtro
            this.aFilters = [];

            //recebe os filtros
            this._getFilterCategoria();
            this._getFilterNumProd();
            this._getFilterEstoque();

            //aplica filtros na tabela
            var oBinding = oTable.getBinding("items");
            oBinding.filter(this.aFilters);

            //atualiza contragem de estoque
            this.updateStockCounts();
        },

        _getFilterCategoria: function () {

            //filtro de categoria
            var oComboBox   = this.oView.byId("comboCategoria1");
            var idCategoria = oComboBox.getSelectedKey();

            if (idCategoria) {
                this.aFilters.push(new Filter("IdCategoria", FilterOperator.EQ, idCategoria));
            }
        },

        _getFilterNumProd: function() {

            //filtro do numero do produto
            var oInput     = this.oView.byId("searchField");
            var NumProduto = oInput.getValue();

            if (NumProduto) {
                this.aFilters.push(new Filter("IdProduto", FilterOperator.EQ, NumProduto));
            }
        },

        _getFilterEstoque: function() {

            //filtro de estoque
            var oIconTabBar  = this.oView.byId("iconTabBar");
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

    });
});
