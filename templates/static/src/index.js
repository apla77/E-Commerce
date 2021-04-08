function createTable () {
    const column = new Column('th', {}, 'Nome');
    const column2 = new Column('th', {}, 'E-mail');
    const column3 = new Column('th', {}, 'Telefone');
    const column4 = new Column('th', {}, 'CPF');
    const tr = new Row('tr', null, null, [column, column2, column3, column4]);
    const thead = new THead(null, tr)

    const col1 = new Column("td", null, 'Antonio Almeida')
    const col2 = new Column("td", null, 'antonio.alm_pdf@hotmail.com')
    const col3 = new Column("td", null, '(##) #####-####')
    const col4 = new Column("td", null, '###.###.###-##')

    const row = new Row("tr", null, null, [col1, col2, col3, col4])
    const row2 = new Row("tr", null, null, [col1, col2, col3, col4])
    const tbody = new TBody(null, [row, row2, row2])
    const table = new Table([{key: 'class', value: 'table table-hover'}], thead, tbody, null)

    const theadView = new THeadView(thead)
    const tbodyView = new TBodyView(tbody)
    const tableView = new TableView(table, theadView, tbodyView)
    document.getElementById('create-table').appendChild(tableView.element)
}
