class TFooterView extends ElementView{
    constructor (tfooterModel) {
        super ("tfooter", tfooterModel.attrs);
        this._tfooterModel = tfooterModel;
    }

    get tfooterModel (){
        return this._tfooterModel;
    }

    set tfooterModel (value) {
        this._tfooterModel = value;
    }
}
