class THeadView extends ElementView{
    constructor (tHeadModel) {
        super ("thead", tHeadModel?.attrs);

        const row = new RowView(tHeadModel.row);
        if (row.rowModel?.columns){
            for (let col of row.rowModel?.columns){
                const colView = new ColView(col)
                row.appendChild(colView.element)
            }
        }
        this.appendChild(row.element)
        this._tHeadModel = tHeadModel;
    }

    get tHeadModel (){
        return this._tHeadModel;
    }

    set tHeadModel (value) {
        this._tHeadModel = value;
    }
}
