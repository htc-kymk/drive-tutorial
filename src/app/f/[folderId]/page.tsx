import { db } from "~/server/db";
import { files_table as filesSchema, folders_table as foldersSchema} from "~/server/db/schema";
import DriveContents from "../../drive-contents";
import { eq } from "drizzle-orm";

async function getAllParents(folderId: number){
  const parents =[];
  let currentId :number | null = folderId;
  while(currentId !== null){
    const folder = await db
    .selectDistinct()
    .from(foldersSchema)
    .where(eq(foldersSchema.id, currentId));
  
  if (!folder[0]){
    throw new Error("Parent folder not found.");
  }
  parents.unshift(folder[0]);
  currentId = folder[0]?.parent; 
  }
  return parents;
}


export default async function GoogleDriveClone(props: {
   params: Promise<{ folderId: string}>
}) {
  const params = await props.params;    /* await ile params Promise'inin cevabını alıyoruz */

  const parsedFolderId = parseInt(params.folderId); /* Veritabanında klasör Idleri int o yüzden parseInt() ile string yapıyoruz */
  if(isNaN(parsedFolderId)){    /* NaN, Not a Number dönüşümün geçerli olup olmadığını kontrol ediyoruz */
    return <div>Invalid folder ID</div>;
  }
  const filesPromise = db    
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, parsedFolderId));
    
  const foldersPromise = db 
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, parsedFolderId));
  
  const parentsPromise = getAllParents(parsedFolderId); 
  const [folders, files,parents] = await Promise.all([foldersPromise, filesPromise, parentsPromise])
  return <DriveContents files={files} folders={folders} parents={parents}/>;
}


/*
Sorguyu tanımlayıp beklenebilir nesneyi tutuyoruz
const filesPromise = db.select().from(filesSchema);

Sorgunun sonucunu elde ediyoruz
const files = await filesPromise;
*/