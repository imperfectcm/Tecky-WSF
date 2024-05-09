const socket = io.connect();

socket.on("hello", (data) => {
    // data has the content { msg: "Hello Client" }
    console.log(data);
});

socket.on("redraw-member-page", (msg) => {
    console.log(msg)
    turnLogoutButton()
    getMemos()
})

socket.on("redraw-memo-area", (msg) => {
    console.log(msg)
    getMemos()
})

window.deleteMemoById = deleteMemoById
window.toggleEdit = toggleEdit
window.likeMemoById = likeMemoById
window.cancelUpdate = cancelUpdate
window.updateMemoById = updateMemoById

// Login and logout function ==============================================================================================================

document.querySelector("#login").addEventListener("submit", async (event) => {
    event.preventDefault()

    const email = await document.querySelector("#email").value;
    const password = await document.querySelector("#inputPassword").value;

    // let target = document.querySelector("#loginArea")
    let res = await fetch('/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })

    if (res.ok) {
        let response = await res.json();
        socket.emit("login-success", `${response.userId}`)
    }
    // }
})



async function turnLogoutButton() {
    let res = await fetch('/checkUser')
    let response = await res.json()
    if (response.userId != undefined) {

        if (res.ok) {
            let target = document.querySelector("#loginArea")
            target.innerHTML =
                `
                <form action="/logout" method="GET" id="logout">          
                <button type="submit" class="btn btn-outline-light btn-sm logInBtn">Log out</button>
                </form>
                <br>
                <img src="./pic/karina.webp" alt="karina" width="200">
                `

            document.querySelector("#loginArea").addEventListener("submit", async (event) => {
                event.preventDefault()
                logout()
            })
        }
    }
}


async function logout() {
    const res = await fetch('/logout')
    if (res.ok) {
        window.location.reload()
    }
}


// Post memo function ==============================================================================================================

document.querySelector('#upload').addEventListener('submit', async (event) => {
    event.preventDefault()
    // Serialize the Form afterwards
    const form = event.target
    const formData = new FormData(form)
    console.table ("formData: ",formData)

    // formData.append('reflection', form.reflection.value)
    // formData.append('memoPic', form.memoPic.files)
    // Submit FormData(), no need to add "Content-Type": "application/json"
    const res = await fetch('/memo', {
        method: 'POST',
        body: formData,
    })

    if (res.ok) {

        const response = await res.json() // { success: true }
        if (response.userId == undefined) {
            response.userId = null
        }

        form.reset()
        socket.emit("upload-memo-success", "upload-memo-success")
        // window.location.reload()
    }
})



// Get all memos function ==============================================================================================================

async function getMemos() {
    let res = await fetch('/memo')
    let response = await res.json()

    if (response.userId == undefined) {
        response.userId = null
    }

    if (res.ok) {
        let target = document.querySelector(".memoArea")

        target.innerHTML = "";

        for (let memo of response.data) {
            target.innerHTML +=
                `
            <div class="memo" id="memoId-${memo.all_memo_id}">
            <div>${memo.content}</div>
            <div class="picUploaded">
            <div>${memo.image ? `<img src="${memo.image}" class="memo-image" />` : ""}</div>
            </div>
            ${response.userId ? `
            <button type="button" class="btn btn-light deleteBtn" onclick="deleteMemoById(${memo.all_memo_id})">
            <img src="./pic/trash.png" width="16" height="16" fill="currentColor">
            </button>
            <button type="button" class="btn btn-light editBtn" onclick="toggleEdit(${memo.all_memo_id},'${memo.content}')">
            <img src="./pic/edit.png" width="16" height="16" fill="currentColor">
            </button>
            ` : ""}
            ${response.userId ? `
            ${memo.memo_id_liked == 1 ? `
            <button type="button" class="likeBtn-liked" onclick="likeMemoById(${memo.all_memo_id},1)">
            <img src="./pic/like_love.png" width="16" height="16" fill="currentColor">
            </button>
            `: `
            <button type="button" class="likeBtn" onclick="likeMemoById(${memo.all_memo_id},0)">
            <img src="./pic/like_love.png" width="16" height="16" fill="currentColor">
            </button>
            `}
            ` : ""}
            </div>`
        }
    }
}


// Like memo function ==============================================================================================================

async function likeMemoById(memoId, isliked) {

    let res = await fetch('/memo/like', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            memoId: `${memoId}`,
            isliked: `${isliked}`
        })
    })

    let response = await res.json()
    let memo = response.memoInfo
    let userId = response.userId
    if (response.userId == undefined) {
        response.userId = null
    }


    if (res.ok) {
        // socket.emit("update-memo-success", "update-memo-success")

        document.querySelector(`#memoId-${memoId}`).innerHTML =
            `
            <div>${memo.content}</div>
            <div class="picUploaded">
            <div>${memo.image ? `<img src="${memo.image}" class="memo-image" />` : ""}</div>
            </div>
            ${userId ? `
            <button type="button" class="btn btn-light deleteBtn" onclick="deleteMemoById(${memo.all_memo_id})">
                <img src="./pic/trash.png" width="16" height="16" fill="currentColor">
                </button>
                <button type="button" class="btn btn-light editBtn" onclick="toggleEdit(${memo.all_memo_id},'${memo.content}')">
                <img src="./pic/edit.png" width="16" height="16" fill="currentColor">
                </button>
                ` : ""}
            ${userId ? `
                ${isliked != 1 ? `
                <button type="button" class="likeBtn-liked" onclick="likeMemoById(${memo.all_memo_id},1)">
                    <img src="./pic/like_love.png" width="16" height="16" fill="currentColor">
                </button>
                `: `
                <button type="button" class="likeBtn" onclick="likeMemoById(${memo.all_memo_id},0)">
                    <img src="./pic/like_love.png" width="16" height="16" fill="currentColor">
                </button>
                `}
                ` : ""}`

        // window.location.reload()

    }
}

// Edit memo function ==============================================================================================================

async function toggleEdit(id, content) {

    document.querySelector(`#memoId-${id}`).innerHTML =

        `<form onsubmit="updateMemoById(event,${id})">
        <textarea type="text" name="content" class="memoToUpdate" required>${content}</textarea>
        <div class="mb-2">
            <input name="image" class="form-control-sm" type="file"/>
        </div>
        <div class="mb-2">
            <button type="submit" class="btn btn-dark btn-sm postBtn">Confirm</button>
            <button type="button" class="btn btn-dark btn-sm postBtn" onclick="cancelUpdate(${id})">Cancel</button>
        </div>
    </form>`
}

async function cancelUpdate(id) {
    let res = await fetch('/memo/findMemo', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            memoId: `${id}`
        })
    })

    let response = await res.json()
    let memo = response.memoInfo
    if (response.userId == undefined) {
        response.userId = null
    }

    if (res.ok) {
        // socket.emit("update-memo-success", "update-memo-success")

        document.querySelector(`#memoId-${id}`).innerHTML =
            `
            <div>${memo.content}</div>
            <div class="picUploaded">
            <div>${memo.image ? `<img src="${memo.image}" class="memo-image" />` : ""}</div>
            </div>
            ${response.userId ? `
            <button type="button" class="btn btn-light deleteBtn" onclick="deleteMemoById(${memo.all_memo_id})">
                <img src="./pic/trash.png" width="16" height="16" fill="currentColor">
                </button>
                <button type="button" class="btn btn-light editBtn" onclick="toggleEdit(${memo.all_memo_id},'${memo.content}')">
                <img src="./pic/edit.png" width="16" height="16" fill="currentColor">
                </button>
                ` : ""}
            ${response.userId ? `
                ${memo.memo_liked == 1 ? `
                <button type="button" class="likeBtn-liked" onclick="likeMemoById(${memo.all_memo_id},1)">
                    <img src="./pic/like_love.png" width="16" height="16" fill="currentColor">
                </button>
                `: `
                <button type="button" class="likeBtn" onclick="likeMemoById(${memo.all_memo_id},0)">
                    <img src="./pic/like_love.png" width="16" height="16" fill="currentColor">
                </button>
                `}
                ` : ""}`
    }
}

async function updateMemoById(event, id) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    formData.append('id', id)

    const res = await fetch('/memo', {
        method: 'PUT',
        body: formData
    })
    if (res.ok) {
        socket.emit("update-memo-success", "update-memo-success")
        // window.location.reload()
    }
}


// Delete memo function ==============================================================================================================

async function deleteMemoById(id) {

    const res = await fetch(`/memo`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: `${id}` })
    })
    if (res.ok) {
        socket.emit("delete-memo-success", "delete-memo-success")
    }
}



getMemos()
turnLogoutButton()