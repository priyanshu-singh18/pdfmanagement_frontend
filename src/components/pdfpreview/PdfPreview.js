import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { useRecoilState } from "recoil";
import { filedatastate } from "../../context/filedataState";
import { useNavigate } from "react-router-dom";
import "./PdfPreview.css";

export default function PdfPreview() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const temp_data = useRecoilState(filedatastate);
  const navigate = useNavigate();

  // console.log(temp_data);

  if (temp_data[0].file_data === "") {
    navigate("/dashboard");
    return;
  }

  // const file_data = sessionStorage.getItem("file_data");
  // if (!file_data) {
  //   navigate("/dashboard");
  //   return;
  // }
  //   console.log(atob(props.file_data));
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  const linkSource = `data:application/pdf;base64,${temp_data[0].file_data}`;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  // const file = byte_to_array(props.file_data);
  return (
    <div className="pdf-view-container">
      <Document file={linkSource} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          pageNumber={pageNumber}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
      <nav>
        <button onClick={goToPrevPage}>Prev</button>
        <button onClick={goToNextPage}>Next</button>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </nav>
    </div>
  );
}
