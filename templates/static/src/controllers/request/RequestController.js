class RequestController {
    static get = async (uri, params, success, error)=>{
        function getURI (uri, params) {
             function checkToArray (uri, array) {
                 if (uri[uri.length-1] === '/'){
                     return uri + array.join('/')
                 }
                 return uri + '/' + array.join('/');
             }

             function checkURIParam (uri, array) {
                 if (uri[uri.length-1] === '/'){
                     return uri + '?' + array.join('&')
                 }
                 return uri + '?' + array.join('&');
             }


             if (params){
                 if (Array.isArray(params)){
                     const array = []
                     for (let value of params){
                         array.push(value)
                     }
                     return checkToArray(uri, array)
                 } else {
                     if (Object.keys(params).length > 0){
                         const array = []
                         const keys = Object.keys(params)
                         for (let key of keys){
                             array.push(`${key}=${params[key]}`)
                         }

                         return checkURIParam(uri, array)
                     }
                 }
             }
             return uri;
        }
        return new Promise(async resolve => {
            const api = await fetch(getURI(uri, params))
            if (api.status === 200){
                resolve(
                    success(await api.json())
                )
            } else {
               resolve(
                   error("Error in API")
               )
            }
        })
    }
}
