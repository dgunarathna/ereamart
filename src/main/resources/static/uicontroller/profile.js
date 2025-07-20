window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshUserEditForm();
});


//form *********************************************************************************************************************************************************************************************

const refreshUserEditForm = () => {

    lguser = getServiceRequest("/loggeduserdetail");
    oldLgUser = getServiceRequest("/loggeduserdetail");

    textEditUserName.value = lguser.username;

    if (lguser.userphoto != null) {
        imgEditPhotoPreview = atob(lguser.userphoto)
    } else {
        imgEditPhotoPreview.src = "/images/default.png";
    }
    
    textEditUserEmail.value = lguser.email;
}

const checkChanges = ()=>{
    let changes = "";

    if (lguser.userphoto != oldLgUser.userphoto) {
            changes = changes + "User Photo changed\n";
        }
    if (lguser.username != oldLgUser.username) {
            changes = changes + "User Name changed\n";
        }
    if (lguser.password != oldLgUser.password) {
            changes = changes + "Password changed\n";
        }
    if (lguser.email != oldLgUser.email) {
            changes = changes + "Email changed\n";
        }
    return changes;
}

const saveChanges = ()=>{
    let changes = checkChanges();
    if (changes != "") {
        let changes = checkChanges();
        if (changes == "") {
            window.alert("Nothing to update");
        } else {
            let userConfirm = window.confirm("Are you sure to update?\n" + changes + "\n");
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/changeuserdetails/insert", "POST", lguser);
                if (putResponce == "OK") {
                    window.alert("Update Successfull");
                    window.location.replace("/logout");
                } else {
                    window.alert("Failed to update" + putResponce);
                }
            }
        }
    } else {
        window.alert("Form has following errors..\n" + errors)
    }
}