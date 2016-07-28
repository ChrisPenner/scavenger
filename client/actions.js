export const STORE_RESULTS = 'STORE_RESULTS'
export const fetchResource = (Resource) => (dispatch) => {
    return Resource.index()
                .then(json => dispatch({
                    type: STORE_RESULTS,
                    key: Resource.key,
                    data: json,
                }))
}
