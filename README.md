This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



each block is in the format of

```json
{
  object: 'list',
  results: [
    {
      object: 'block',
      id: '18ba9ae1-b608-8015-b467-c1c485c2b7fe',
      parent: [Object],
      created_time: '2025-01-30T03:36:00.000Z',
      last_edited_time: '2025-01-30T03:36:00.000Z',
      created_by: [Object],
      last_edited_by: [Object],
      has_children: false,
      archived: false,
      in_trash: false,
      type: 'bulleted_list_item',
      bulleted_list_item: [Object]
    },
    {
      object: 'block',
      id: '18ba9ae1-b608-808b-aa96-dd6e2aec8643',
      parent: [Object],
      created_time: '2025-01-30T03:36:00.000Z',
      last_edited_time: '2025-01-30T03:36:00.000Z',
      created_by: [Object],
      last_edited_by: [Object],
      has_children: false,
      archived: false,
      in_trash: false,
      type: 'bulleted_list_item',
      bulleted_list_item: [Object]
    },
    {
      object: 'block',
      id: '18ba9ae1-b608-80ea-a38d-ebdef2bf1139',
      parent: [Object],
      created_time: '2025-01-30T03:36:00.000Z',
      last_edited_time: '2025-01-30T03:36:00.000Z',
      created_by: [Object],
      last_edited_by: [Object],
      has_children: false,
      archived: false,
      in_trash: false,
      type: 'bulleted_list_item',
      bulleted_list_item: [Object]
    }
  ],
  next_cursor: null,
  has_more: false,
  type: 'block',
  block: {},
  request_id: '033cec8a-9479-44b5-b2aa-3613c18c6722'
}
```

Then there is a rich text array with the following text in it


```json
{
    type: 'text',
    text: { content: 'OANDA  Point 3', link: null },
    annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default'
    },
    plain_text: 'OANDA  Point 3',
    href: null
}
```