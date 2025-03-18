CLASS zcl_rla_categoria DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC .

  PUBLIC SECTION.

    METHODS constructor .
    METHODS get_categorias
      RETURNING
        VALUE(table_categorias) TYPE zrla_categoria_tt .
  PROTECTED SECTION.
  PRIVATE SECTION.

    DATA ot_categorias TYPE zrla_categoria_tt .

    METHODS get_data .
ENDCLASS.



CLASS ZCL_RLA_CATEGORIA IMPLEMENTATION.


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Public Method ZCL_RLA_CATEGORIA->CONSTRUCTOR
* +-------------------------------------------------------------------------------------------------+
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD constructor.

    "preenche atributo de classe com todas as categorias disponíveis

    me->get_data( ).

  ENDMETHOD.


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Public Method ZCL_RLA_CATEGORIA->GET_CATEGORIAS
* +-------------------------------------------------------------------------------------------------+
* | [<-()] TABLE_CATEGORIAS               TYPE        ZRLA_CATEGORIA_TT
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD get_categorias.

    "envia uma tabela de categorias

    table_categorias = me->ot_categorias.

  ENDMETHOD.


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Private Method ZCL_RLA_CATEGORIA->GET_DATA
* +-------------------------------------------------------------------------------------------------+
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD get_data.

    "consulta na base de dados por todas as categorias

    SELECT *
      FROM zrla_categoria
      INTO CORRESPONDING FIELDS OF TABLE me->ot_categorias.

  ENDMETHOD.
ENDCLASS.
