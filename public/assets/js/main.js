const global_url = '';

const body    = document.querySelector("body");
const toggle  = body.querySelector(".toggle");
const sidebar = body.querySelector(".side-bar");

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});

$(document).ready(function() {
    $('.select2-custom-defult').select2({
        theme: 'bootstrap4',
    });
});

function wrongAlert(title, timer = 2000, position = 'top-end') {
    Swal.fire({
        position: position,
        icon: 'error',
        title: title,
        showConfirmButton: false,
        timer: timer
      })
}

function successAlert(title, timer = 2000, position = 'top-end') {
    Swal.fire({
        position: position,
        icon: 'success',
        title: title,
        showConfirmButton: false,
        timer: timer
      })
}

function confirmBox(
    text = 'You will not be able to undo this action!',
    confirmButtonText = 'Yes, do it!',
    cancelButtonText = 'No, cancel!',
    title = 'Are you sure?',
    confirmButtonColor = '#3085d6',
    cancelButtonColor = '#d33',
    icon = 'warning'
) {
    
    return new Promise(resolve => {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: confirmButtonColor,
            cancelButtonColor: cancelButtonColor,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(true);
            }else{
                resolve(false);
            }
        });
    })
}

const req = async ( url, method, data ) => {

    return new Promise(resolve => {
        $.ajax({
            url: global_url+url,
            method: method,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: async function (data) {
                resolve(data);
                return;
            },
            error: function (data) {
                resolve(data);
                return;
            }
        });
    })

}
