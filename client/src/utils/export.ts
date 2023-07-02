export function downloadTextFile(text: string, filename: string) {
  text = text.replace(
    /(\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3})\n/g,
    ""
  );
  const txtBlob = new Blob([text], { type: "text/plain" });
  const txtUrl = URL.createObjectURL(txtBlob);
  const txtLink = document.createElement("a");
  txtLink.href = txtUrl;
  txtLink.setAttribute("download", `${filename}.txt`);
  document.body.appendChild(txtLink);
  txtLink.click();
  document.body.removeChild(txtLink);
}

export function downloadSrtFile(text: string, filename: string) {
  const srtBlob = new Blob([text], { type: "text/plain" });
  const srtUrl = URL.createObjectURL(srtBlob);
  const srtLink = document.createElement("a");
  srtLink.href = srtUrl;
  srtLink.setAttribute("download", `${filename}.srt`);
  document.body.appendChild(srtLink);
  srtLink.click();
  document.body.removeChild(srtLink);
}
