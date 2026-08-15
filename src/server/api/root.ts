import { adminRouter } from "~/server/api/routers/admin";
import { blogRouter } from "~/server/api/routers/blog";
import { categoriesRouter } from "~/server/api/routers/categories";
import { contactRouter } from "~/server/api/routers/contact";
import { contentRouter } from "~/server/api/routers/content";
import { worksRouter } from "~/server/api/routers/works";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  works: worksRouter,
  categories: categoriesRouter,
  blog: blogRouter,
  contact: contactRouter,
  content: contentRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.works.listAll();
 */
export const createCaller = createCallerFactory(appRouter);
