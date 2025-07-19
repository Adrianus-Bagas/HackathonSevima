-- CreateTable
CREATE TABLE "BusStops" (
    "id" SERIAL NOT NULL,
    "x_axis" INTEGER NOT NULL,
    "y_axis" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BusStops_pkey" PRIMARY KEY ("id")
);
