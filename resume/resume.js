const downloadResume = () => {
    const filename  = 'resume_sadsitha_lokuge.pdf';

    html2canvas(document.querySelector('#resume')).then(canvas => {
        let pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
        pdf.save(filename);
    });
}

document.getElementById("download").addEventListener("click", downloadResume)