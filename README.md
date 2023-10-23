# SMARS: The World Editor Suite

## This repository contains all of the tools used for creating content for Project SMARS

Main project link: https://github.com/dan-atack/SMARS

## Tools included in this version:

1. Module Editor

## How to set up the project for use with a local database

1. Install the main project repo for SMARS and initialize its database by starting the backend server

2. Install, in a separate directory, the World Editor suite

3. Set the environment variables for the backend to avoid a collision with the game's server (which typically runs on port 7000):

   PORT=7001
   DB_NAME=smars (or use a test database if you're not ready to commit new structures to the game's main database)

4. Set the environment variables for the frontend, again, avoiding a collision with the frontend dev server (running on port 1234):

   PORT=1235

5. Start the backend for the world editor:

   cd backend

   npm run dev

6. Start the frontend for the world editor in a second terminal:

   cd frontend

   npm run dev
