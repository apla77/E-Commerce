class RequestController {
    static get = async (uri, params, success, error)=>{
        function getURI (uri, params) {
             if (params){
                 return uri;
             }
             return uri;
        }


        return new Promise(async resolve => {
            const api = await fetch(uri)
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
