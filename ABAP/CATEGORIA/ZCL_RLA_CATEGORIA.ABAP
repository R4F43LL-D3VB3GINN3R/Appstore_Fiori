class ZCL_RLA_CATEGORIA definition
  public
  final
  create public .

public section.

  methods CONSTRUCTOR .
  methods GET_CATEGORIAS
    returning
      value(TABLE_CATEGORIAS) type ZRLA_CATEGORIA_TT .
  PROTECTED SECTION.
private section.

  data OT_CATEGORIAS type ZRLA_CATEGORIA_TT .

  methods GET_DATA .
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
