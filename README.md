# Heritage Keeper

[Heritage Keeper](https://imgur.com/q4oZUJN)

## What is Heritage Keeper

**Heritage Keeper** is a web application dedicated to save your all family memories in one place. All your _memories_ will be saved and **transmitted** to your next generations in a fully organized way based in your _family members_; and grouping _memories_ into _albums_.
...

## What you can do with Keep Heritage

### Manage Family Members

- List, create, update and delete your core family members. Each family member contains its `name` and `parentage`.

### Manage memories

- Create memories. Each memory represents a snapshot of a particular moment of your life. Each memory contains its `image`, `description`, tagged `family members` and `date`.
- Display memories in a grid gallery.
- Display tagged `family members` in memory.
- Download single memory as a image file.
- Show memory details.
- Delete memory.

### Manage album

- Create albums. Each album represents a group of `memories`; so user will be able to organize related memories into its own albums. Each album contains its `title`, `description`, `date`, and `memories`.
- Display albums in a grid gallery.
- Download album's memories as a zip file.
- Update albums.
- Delete album.

### Album visualization

- Albums can be visualized in a custom presentation view; so user can show their created albums as a slides view.
- The album visualization can be shareable; so user can share the _visualization link_ publicly.

## How to install

1. Copy this repository (`git clone https://github.com/juanzenn/codicon-24.git`)
2. Install project dependencies (`npm install`)
3. Copy the `.env.example` file in a new file named `.env` and fill the environment variables with yours
4. Push database schema to your database (`npx prisma db push`)
5. Generate database types for develpment (`npx prisma generate`)
6. Run web application (`npm run dev`)

## Developed by

- [Juan Alvarez](https://github.com/juanzenn)
- [Alfredo Arvelaez](https://github.com/AlfredoPrograma)
- [Pedro Uzcátegui](https://github.com/pedrouzcategui)

## License

Copyright 2024 JAP Software

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
