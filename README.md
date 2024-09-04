# FisEvents

## Purpose

Support for small professionals who work by appointment (cooking workshops, Yoga courses, presentation days, etc.) and who need to collect registrations

## Application Structure

- _Backend_ in Sanity.io and Custom Studio (folder "fisevents/studio")
- _Frontend_: NextJs 14 App Router & Typescipt, TailwindCss, Shadcn, Storybook, Jest (folder "fisevents/fisevents")
- _Deployment_ on Vercel

I chose a monorepo because I can automatically and easily generate the frontend types from the Sanity schema

**Sanity studio**
This package is intended for the super-admin only as each tenant will manage their own events in the creator-admin section of the front-end.

The two main folders contain their own readme file for specific info
