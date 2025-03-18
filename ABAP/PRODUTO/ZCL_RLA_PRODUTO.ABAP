CLASS zcl_rla_produto DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC .

  PUBLIC SECTION.

    METHODS constructor
      IMPORTING
        !p_id_produto TYPE char10 OPTIONAL.
    METHODS get_produto
      EXPORTING
        !produto TYPE zrla_produto_st .
    METHODS get_produtos
      EXPORTING
        !produtos TYPE zrla_produto_tt .
  PROTECTED SECTION.
  PRIVATE SECTION.

    DATA os_produto TYPE zrla_produto_st .
    DATA ot_produtos TYPE zrla_produto_tt .

    METHODS get_data .
    METHODS get_data_produto
      IMPORTING
        !p_id_produto TYPE char10 .
ENDCLASS.



CLASS ZCL_RLA_PRODUTO IMPLEMENTATION.


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Public Method ZCL_RLA_PRODUTO->CONSTRUCTOR
* +-------------------------------------------------------------------------------------------------+
* | [--->] P_ID_PRODUTO                   TYPE        CHAR10(optional)
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD constructor.

    "metodo para buscar os produtos
    me->get_data( ).

    "se o parametro for enviado
    IF p_id_produto IS NOT INITIAL.

      "método para buscar por um produto.
      me->get_data_produto( p_id_produto = p_id_produto ).

    ENDIF.

  ENDMETHOD.


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Private Method ZCL_RLA_PRODUTO->GET_DATA
* +-------------------------------------------------------------------------------------------------+
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD get_data.

    CLEAR me->ot_produtos.

    "busca os produtos na base de dados
    SELECT *
      FROM zrla_produto
      INTO CORRESPONDING FIELDS OF TABLE me->ot_produtos.

    IF sy-subrc NE 0.
      MESSAGE | Não foi possível encontrar produtos. | TYPE 'E'.
      RETURN.
    ENDIF.

  ENDMETHOD.


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Private Method ZCL_RLA_PRODUTO->GET_DATA_PRODUTO
* +-------------------------------------------------------------------------------------------------+
* | [--->] P_ID_PRODUTO                   TYPE        CHAR10
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD get_data_produto.

    CLEAR: me->os_produto.

    "procura na tabela por um produto.
    READ TABLE me->ot_produtos INTO me->os_produto WITH KEY id_produto = p_id_produto.

    IF sy-subrc NE 0.
      MESSAGE | Não foi possível encontrar um produto. | TYPE 'E'.
      RETURN.
    ENDIF.

  ENDMETHOD.


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Public Method ZCL_RLA_PRODUTO->GET_PRODUTO
* +-------------------------------------------------------------------------------------------------+
* | [<---] PRODUTO                        TYPE        ZRLA_PRODUTO_ST
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD get_produto.

    "parametro recebe atributo de classe
    produto = me->os_produto.

  ENDMETHOD.


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Public Method ZCL_RLA_PRODUTO->GET_PRODUTOS
* +-------------------------------------------------------------------------------------------------+
* | [<---] PRODUTOS                       TYPE        ZRLA_PRODUTO_TT
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD get_produtos.

    "parametro recebe atributo tabela de classe
    produtos = me->ot_produtos.

  ENDMETHOD.
ENDCLASS.
