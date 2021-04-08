class ElementView{
    /*constructor da class que recebe o tipo do elemento
    * os atributos e o valor*/
    constructor (type, attrs) {
        this._type = type;
        this._attrs = attrs;
        this._element = TagsView.create(type)

        Attrs.set(this.element, attrs)
    }

    /*getters e settes da class ElementView*/

    get type (){
        return this._type;
    }

    set type (value) {
        this._type = value;
    }

    get attrs (){
        return this._attrs;
    }

    set attrs (value) {
        this._attrs = value;
    }

    get element(){
        return this._element;
    }

    appendChild(element){
        TagsView.append(element, this.element)
    }

    removeAll(){
        if (this.element.children.length > 0){
            const children = this.element.children
            for (let i = 0; i < children.length; i++){
                const child = children.item(i)
                if (child === element){
                    child.remove()
                    i--;
                }
            }
        }

        return this.element.children.length === 0;
    }

    removeChildByIndex(j){
        if (this.element.children.length > 0){
            if (this.element.children.item(j)){
                this.element.children.item(j).remove()
                return true
            }
        }
        return false;
    }

    removeChildByElement(element){
        if (this.element.children.length > 0){
            const children = this.element.children
            for (let i = 0; i < children.length; i++){
                const child = children.item(i)
                if (child === element){
                    child.remove()
                    return true;
                }
            }
        }

        return false;
    }

    replaceChildByIndex(j, newElement){
        if (this.element.children.length > 0){
            if (this.removeChildByIndex(j)){
                const element = this.element.children.item(j)
                TagsView.replaceChild(element, newElement, this.element)
            }
        }
    }

    replaceChildByElement(element, newElement){
        if (this.element.children.length > 0){
            TagsView.replaceChild(element, newElement, this.element)
        }
    }
}
