import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { MUTATIONS } from "~/server/db/queries";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const user = await auth();

      // If you throw, the user will not be able to upload
      if (!user.userId) 
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      await MUTATIONS.createFile({
        file: {
          name: file.name,
          size: file.size,
          url: file.url,
          parent:0
        },
        userId: metadata.userId,
      });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

/*Dosya seçiliyor

Kullanıcı arayüzden dosyayı seçip yükleme işlemini başlatıyor.



imageUploader kuralları uygulanıyor

Dosya bir görsel mi, en fazla 4 MB mı ve izin verilen sayıda mı diye kontrol ediliyor.



.middleware() çalışıyor

Clerk aracılığıyla kullanıcı kontrol ediliyor. Kullanıcı giriş yapmamışsa yükleme engelleniyor.



UploadThing dosyayı saklıyor

Yükleme başarılı olursa dosyanın URL'si ve diğer bilgileri oluşuyor.



.onUploadComplete() çalışıyor

metadata.userId ve file.ufsUrl konsola yazdırılıyor.



Sonuç istemciye döndürülüyor

uploadedBy bilgisi arayüzün kullanabileceği şekilde geri dönüyor.*/