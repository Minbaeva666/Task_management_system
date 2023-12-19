document.addEventListener("DOMContentLoaded", function () {
    const signUpButton = document.querySelector(".btn-primary");

    signUpButton.addEventListener("click", function (event) {
        event.preventDefault();

        const signUpUserName = document.querySelector('input[name="SignUpUserName"]').value;
        const signUpPassword = document.querySelector('input[name="SignUpPassword"]').value;

        const postData = {
            username: signUpUserName,
            password: signUpPassword
        };

        fetch("https://657b53f6394ca9e4af142fbe.mockapi.io/api/v1/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.id) {
                alert("Sign-up successful!");

                return fetch(`https://657b53f6394ca9e4af142fbe.mockapi.io/api/v1/user/${data.id}`);
            } else {
                alert("Sign-up failed. Please try again.");
            }
        })
        .then(response => response.json())
        .then(user => {
            console.log("User by ID:", user);

        })
        .catch(error => console.error("Error fetching data:", error));
    });
});
