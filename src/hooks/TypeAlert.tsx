import Swal from "sweetalert2"

export function TypeAlert(message: string, type: 'success' | 'error' | 'warning' | 'info' | 'question') {
  Swal.fire({
    toast: true,
    icon: type,
    title: message,
    position: 'top',
    showConfirmButton: false,
    timer: 4000,
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
  })
}

export function TypeInfo(message: string, type: 'success' | 'error' | 'warning' | 'info' | 'question') {
  Swal.fire({
    text: message,
    icon: type,
    
  })
}