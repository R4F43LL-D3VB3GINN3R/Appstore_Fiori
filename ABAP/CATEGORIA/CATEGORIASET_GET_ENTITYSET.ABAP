  METHOD categoriaset_get_entityset.

    DATA: ol_categoria TYPE REF TO zcl_rla_categoria. "instância da classe de cateogorias

    CREATE OBJECT ol_categoria. "preenche uma tabela de categorias como atributo de classe

    et_entityset = ol_categoria->get_categorias( ). "envia ao front-end uma tabela de categorias.

  ENDMETHOD.
