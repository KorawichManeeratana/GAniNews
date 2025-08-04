-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "like" INTEGER NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genres" (
    "id" SERIAL NOT NULL,
    "gen_name" TEXT NOT NULL,

    CONSTRAINT "Genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genrespost" (
    "gen_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "genrespost_pkey" PRIMARY KEY ("gen_id","post_id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "detail" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "url_post" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genrespost" ADD CONSTRAINT "genrespost_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genrespost" ADD CONSTRAINT "genrespost_gen_id_fkey" FOREIGN KEY ("gen_id") REFERENCES "Genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
