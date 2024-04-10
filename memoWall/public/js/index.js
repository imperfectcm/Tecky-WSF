document.querySelector('#upload').addEventListener('submit', async (event) => {
    event.preventDefault()
    // Serialize the Form afterwards
    const form = event.target
    const formData = new FormData(form)

    // formData.append('reflection', form.reflection.value)
    // formData.append('memoPic', form.memoPic.files)
    // Submit FormData(), no need to add "Content-Type": "application/json"
    const res = await fetch('/upload', {
        method: 'POST',
        body: formData,
    })

    if (res.ok) {
        const result = await res.json() // { success: true }
        form.reset()
        console.log(result)
        window.location.reload()
    }
})

async function getMemos() { 
    let res = await fetch('/upload')
    let response = await res.json()
    console.log(response)
    
    if (res.ok) {
        let target = document.querySelector(".memoArea")
        for (let memo of response) {
            target.innerHTML += `
            <div class="memo" memoId="${memo.id}">
            <button type="button" class="btn btn-light deleteBtn" deleteMemoId="${memo.id}">
            <img src="./pic/trash.png" width="16" height="16" fill="currentColor">
            </button>
            <button type="button" class="btn btn-light editBtn" editMemoId="${memo.id}">
            <img src="./pic/edit.png" width="16" height="16" fill="currentColor">
            </button>
            <div>${memo.reflection}</div>
            <div class="picUploaded">
            <div>${memo.memoPic ? `<img src="./memoPic/${memo.memoPic}" class="memo-image" />` : ""}</div>
            </div>
            </div>
            `
        }
    }
}
getMemos()



document.querySelector("#login").addEventListener("submit", async (event) => {
    // event.preventDefault()

    const username = await document.querySelector("#userName").value;
    const password = await document.querySelector("#inputPassword").value;
    console.log(username);
    console.log(password);
    console.log(JSON.stringify({username, password}));

    let res = await fetch ('http://localhost:8080/login', {
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password})
    }) 

    if (res.ok) {
        let response = res.json();
        console.log("gg",response);
        window.location.href = "/protected.html"
    }
})