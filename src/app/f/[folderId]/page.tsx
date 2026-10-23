import DriveContents from "../../drive-contents";
import { QUERIES } from "~/server/db/queries";


export default async function GoogleDriveClone(props: {
   params: Promise<{ folderId: string}>
}) {
  const params = await props.params;    /* await ile params Promise'inin cevabını alıyoruz */

  const parsedFolderId = parseInt(params.folderId); /* Veritabanında klasör Idleri int o yüzden parseInt() ile string yapıyoruz */
  if(isNaN(parsedFolderId)){    /* NaN, Not a Number dönüşümün geçerli olup olmadığını kontrol ediyoruz */
    return <div>Invalid folder ID</div>;
  }


  const [folders, files,parents] = await Promise.all([
    QUERIES.getFolders(parsedFolderId),
    QUERIES.getFiles(parsedFolderId),  
    QUERIES.getAllParentsForFolders(parsedFolderId)])
  return <DriveContents files={files} folders={folders} parents={parents}/>;
}
