const fileInput = document.getElementById('file');
const convertBtn = document.getElementById('convert');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('download');

convertBtn.onclick = async () => {
  const f = fileInput.files && fileInput.files[0];
  if (!f) return alert('Choose an image file first');

  const img = new Image();
  img.src = URL.createObjectURL(f);
  await img.decode();

  // Show preview (original image first)
  preview.innerHTML = '';
  preview.appendChild(img);

  const canvas = document.createElement('canvas');
  const maxW = 1200;
  const scale = Math.min(1, maxW / img.width);
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Options
  const mode = document.getElementById('mode').value;
  const turdsize = Number(document.getElementById('turdsize').value);
  let options = {
    ltres: 1,
    qtres: 1,
    pathomit: 8,
    rightangleenhance: true,
    scale: 1,
    simplifytolerance: 0,
    viewBox: true,
    strokewidth: 1,
    turdsize: turdsize
  };

  if (mode === 'mono') {
    options.numberofcolors = 2;
    options.colorquantcycles = 3;
  } else {
    options.numberofcolors = 16; // full color
  }

  // Run ImageTracer
  const dataURL = canvas.toDataURL('image/png');
  const svgstr = ImageTracer.imageToSVG(dataURL, options);

  // Show SVG
  const svgBlob = new Blob([svgstr], { type: 'image/svg+xml' });
  const svgURL = URL.createObjectURL(svgBlob);

  const svgEl = document.createElement('div');
  svgEl.innerHTML = svgstr;
  preview.innerHTML = '';
  preview.appendChild(svgEl);

  // Enable download
  downloadBtn.disabled = false;
  downloadBtn.onclick = () => {
    const a = document.createElement('a');
    a.href = svgURL;
    a.download = (f.name || 'vector') + '.svg';
    a.click();
  };
};
