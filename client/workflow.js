import sweetalert from 'sweetalert'
export const addResourceModal = (resourceName, action, getter) => () => (dispatch, getState) => {
    sweetalert({
        title: `Add A ${resourceName}`,
        text: "Enter a unique identifier",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        inputPlaceholder: `${resourceName} ID`
    }, (id) => {
        if (id === false){
            // Cancelled
            return
        }
        id = id.toUpperCase().trim()
        if (id === '') {
            sweetalert.showInputError("Please enter an ID");
        } else if (getter(getState(), id)){
            sweetalert.showInputError(`A ${resourceName} by this id already exists!`);
        } else if (!/^[A-Z0-9-]+$/.test(id)){
            sweetalert.showInputError("id must contain only letters, numbers or '-'");
        } else {
            dispatch(action(id))
            sweetalert('Success!', `Added a ${resourceName}`, 'success')
        }
    })
};
