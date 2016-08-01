import sweetalert from 'sweetalert'
export const addResourceModal = (resourceName, action, getter, successCallback) => (itemArgs={}) => (dispatch, getState) => {
    sweetalert({
        title: `Add A ${resourceName}`,
        text: "Enter a unique identifier",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        inputPlaceholder: `${resourceName} ID`
    }, (uid) => {
        debugger
        if (uid === false){
            // Cancelled
            return
        }
        uid = uid.toUpperCase().trim()
        if (uid === '') {
            sweetalert.showInputError("Please enter an ID");
        } else if (getter(getState(), uid)){
            sweetalert.showInputError(`A ${resourceName} by this uid already exists!`);
        } else if (!/^[A-Z0-9-]+$/.test(uid)){
            sweetalert.showInputError("uid must contain only letters, numbers or '-'");
        } else {
            dispatch(action({...itemArgs, uid}))
            swal({
                title: "Success!", 
                 type: "success",   text: `Added a ${resourceName}`,
                 timer: 700,
                 showConfirmButton: false
            });
            if(successCallback){
                dispatch(successCallback(uid))
            }
        }
    })
};
