let addSummaryModel = document.getElementById('addSummary');
addSummaryModel.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    let button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    let recipient = button.getAttribute('data-bs-whatever');
    // If necessary, you could initiate an AJAX request here
    // and then do the updating in a callback.
    //
    // Update the modal's content.
    let modalTitle = addSummaryModel.querySelector('.modal-title');
    modalTitle.textContent = recipient;
});
let editLinkModel = document.getElementById('editLink');
editLinkModel.addEventListener('show.bs.modal', function (event) {
    let button = event.relatedTarget;
    let recipient = JSON.parse(button.getAttribute('data-bs-whatever'));
    const editid = document.getElementById("editid");
    const edittitle = document.getElementById("edittitle");
    const editurl = document.getElementById("editurl");
    const editdescription = document.getElementById("editdescription");
    editid.value = recipient._id;
    edittitle.value = recipient.title;
    editurl.value = recipient.url;
    editdescription.value = recipient.description;
});
function editIntro() {
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const role = document.getElementById("role");
    const country = document.getElementById("country");
    if (country.value.trim() && role.value.trim() && lastname.value.trim() && firstname.value.trim()) {
        document.getElementById("editIntroform").submit();
    }
    else
        window.location.reload();
}
function addSummary() {
    const summary = document.getElementById("summary");
    if(summary.value.trim())
        document.getElementById("addSummaryForm").submit();
    else
    window.location.reload();
}
function addLink() {
    const url = document.getElementById("url");
    const title = document.getElementById("title");
    if (url.value.trim() && title.value.trim()) {
        document.getElementById("addLinkForm").submit();
    }else window.location.reload();
}
function editLink() {
    const url = document.getElementById("editurl");
    const title = document.getElementById("edittitle");
    if (url.value.trim() && title.value.trim()) {
        document.getElementById("editLinkForm").submit();
    }else window.location.reload();
}
function delsummary() {
        document.getElementById("delSummary").submit();
}