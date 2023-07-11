import React, { useEffect, useState } from "react";
import PdfPreview from "../components/pdfpreview/PdfPreview";
import CommentList from "../components/pdfpreview/CommentList";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { filedatastate } from "../context/filedataState";

export default function PdfViewPage() {
  return (
    <div className="page-container pdf-page">
      <PdfPreview />

      <CommentList />
    </div>
  );
}
