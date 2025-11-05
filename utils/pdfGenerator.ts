
// This file uses 'jspdf' and 'html2canvas' which are loaded from a CDN in index.html
// So we need to declare them to TypeScript to avoid errors.
declare const jspdf: any;
declare const html2canvas: any;

const { jsPDF } = jspdf;

// Helper to create the cover page element
const createCoverElement = (childName: string, theme: string): HTMLElement => {
  const cover = document.createElement('div');
  cover.style.width = '8.5in';
  cover.style.height = '11in';
  cover.style.padding = '1in';
  cover.style.backgroundColor = '#fef3c7'; // amber-100
  cover.style.display = 'flex';
  cover.style.flexDirection = 'column';
  cover.style.alignItems = 'center';
  cover.style.justifyContent = 'center';
  cover.style.fontFamily = "'Comic Sans MS', 'cursive', 'sans-serif'";
  cover.style.border = '10px solid #f97316'; // orange-500
  cover.style.borderRadius = '20px';
  cover.style.position = 'absolute';
  cover.style.left = '-9999px';
  cover.style.top = '-9999px';
  cover.innerHTML = `
    <h1 style="font-size: 48px; text-align: center; color: #ea580c; margin: 0;">${childName}'s</h1>
    <h2 style="font-size: 36px; text-align: center; color: #c2410c; margin-top: 20px;">Awesome</h2>
    <h1 style="font-size: 52px; text-align: center; color: #ea580c; margin-top: 20px; text-transform: capitalize;">${theme}</h1>
    <h2 style="font-size: 36px; text-align: center; color: #c2410c; margin-top: 20px;">Coloring Book</h2>
  `;
  document.body.appendChild(cover);
  return cover;
};


export const generatePdf = async (images: string[], childName: string, theme: string) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter' // 8.5 x 11 inches
  });

  const pageMargin = 0.5; // inches
  const pageWidth = 8.5;
  const pageHeight = 11;
  const usableWidth = pageWidth - (pageMargin * 2);
  const usableHeight = pageHeight - (pageMargin * 2);

  // 1. Generate and add cover page
  const coverElement = createCoverElement(childName, theme);
  const canvas = await html2canvas(coverElement, { scale: 2 });
  document.body.removeChild(coverElement);
  const coverImageData = canvas.toDataURL('image/png');
  pdf.addImage(coverImageData, 'PNG', 0, 0, pageWidth, pageHeight);


  // 2. Add coloring pages
  for (const imageSrc of images) {
    pdf.addPage();
    
    const img = new Image();
    img.src = imageSrc;
    
    await new Promise(resolve => {
      img.onload = () => {
        const imgWidth = img.width;
        const imgHeight = img.height;
        const ratio = imgWidth / imgHeight;

        let finalWidth, finalHeight;

        if (usableWidth / ratio <= usableHeight) {
            finalWidth = usableWidth;
            finalHeight = usableWidth / ratio;
        } else {
            finalHeight = usableHeight;
            finalWidth = usableHeight * ratio;
        }

        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        pdf.addImage(imageSrc, 'PNG', x, y, finalWidth, finalHeight);
        resolve(true);
      };
    });
  }

  // 3. Save the PDF
  pdf.save(`${childName.toLowerCase().replace(/ /g, '-')}-${theme}-coloring-book.pdf`);
};
