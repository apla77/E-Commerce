class Attrs {
    static set(element, attrs){
        if (attrs){
            if (Array.isArray(attrs)){
                if (attrs.length > 0){
                    for (let attr of attrs){
                        const {key, value} = attr
                        element.setAttribute(key, value)
                    }
                }
            }
        }
    }
}
