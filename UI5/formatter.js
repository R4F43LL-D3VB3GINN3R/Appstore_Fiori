sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {
    "use strict";

    return {
        
        formatDate: function(sDate) {
            if (!sDate) return "";

            var oDateFormat = DateFormat.getDateInstance({
                pattern: "dd.MM.yyyy"
            });

            return oDateFormat.format(new Date(sDate));
        },

        formatEstockState: function(iQuantity) {
            if (iQuantity > 100) {
                return "Success"; 
            } else if (iQuantity > 49) {
                return "Warning"; 
            } else {
                return "Error"; 
            }
        },

        formatDecimal: function(value) {
            if (value === null || value === undefined) {
                return "0.00"; 
            }

            return parseFloat(value).toFixed(2); 
        }
    };

});
