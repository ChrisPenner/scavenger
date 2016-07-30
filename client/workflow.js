import sweetalert from 'sweetalert'
export const addResourceModal = (resourceName, action, getter) => (itemArgs={}) => (dispatch, getState) => {
    sweetalert({
        title: `Add A ${resourceName}`,
        text: "Enter a unique identifier",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        inputPlaceholder: `${resourceName} ID`
    }, (uid) => {
        if (uid === false){
            // Cancelled
            return
        }
        uid = uid.toUpperCase().trim()
        if (uid === '') {
            sweetalert.showInputError("Please enter an ID");
        } else if (getter(getState(), uid)){
            sweetalert.showInputError(`A ${resourceName} by this id already exists!`);
        } else if (!/^[A-Z0-9-]+$/.test(uid)){
            sweetalert.showInputError("id must contain only letters, numbers or '-'");
        } else {
            dispatch(action({...itemArgs, uid}))
            sweetalert('Success!', `Added a ${resourceName}`, 'success')
            swal({
                title: "Success!", 
                 type: "success",   text: `Added a ${resourceName}`,
                 timer: 700,
                 showConfirmButton: false 
            });
        }
    })
};
