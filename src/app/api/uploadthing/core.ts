import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Fake auth function for demonstration; replace with real auth in production
const auth = (req: Request) => ({ id: "fakeId" });

// Allowed icon file types: SVG, PNG, ICO, and WebP
const allowedIconTypes = [
  "image/svg+xml",
  "image/png",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/webp",
];

// FileRouter for your app, with separate routes for category and subcategory icon images
export const ourFileRouter = {
  // Category icon upload route
  categoryImage: f([
    "image/svg+xml",
    "image/png",
    "image/x-icon",
    "image/vnd.microsoft.icon",
    "image/webp"
  ])
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs after a category icon is uploaded
      console.log("Category icon upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
    }),

  // Subcategory icon upload route
  subcategoryImage: f([
    "image/svg+xml",
    "image/png",
    "image/x-icon",
    "image/vnd.microsoft.icon",
    "image/webp"
  ])
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs after a subcategory icon is uploaded
      console.log("Subcategory icon upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
