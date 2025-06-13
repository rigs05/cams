format.addEventListener ("submit", () => {
    const register = {
        name: empname.value,
        password: passwd.value,
        email: email.value,
        mobile: mob.value,
        designation: designation.value,
        userID: userID.value,
        verify: passwd-v.value,
        dob: DOB.value,
        department: dept.value,
        address: address.value
    }
    fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(register),
        headers: {
            "Content-Type": "application/json"
        }
    }).then (res => res.json())
        .then (data => {
            if (data.status == "error") {
                console.log ('error');
            }
            else {
                console.log ('success');
            }
        })
})