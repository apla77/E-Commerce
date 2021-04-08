class TagsView {
    static create(tagName){
        return window.document.createElement(tagName);
    }

    static appendChild(tagName, father){
        const child = this.create(tagName);
        return father.appendChild(child);
    }

    static append(element, father){
        father.appendChild(element)
        return element;
    }
}
