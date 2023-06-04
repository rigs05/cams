format.addEventListener ("submit", () => {
    const login = {
        username: user.value,
        password: passwd.value
    }
    fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(login),
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