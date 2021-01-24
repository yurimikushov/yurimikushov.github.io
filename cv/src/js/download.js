const opt = {
  filename: 'CV. Yuri Mikushov.pdf',
}

const cv = document.querySelector('.cv')

document.querySelector('.download__pdf').addEventListener('click', () => {
  html2pdf().set(opt).from(cv).save()
})
