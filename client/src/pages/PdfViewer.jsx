import { useParams } from "react-router-dom";

export default function PdfViewer() {
  const { url } = useParams();
  const decodedUrl = decodeURIComponent(url);

  return (
    <div className="w-full h-screen">
      <iframe
        src={decodedUrl}
        title="PDF Viewer"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        
      />
    </div>
  );
}
