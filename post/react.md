---
title: "Fastro v0.82.0: Fixing React Version Consistency Issues"
image: https://fastro.deno.dev/fastro.png
description: "Resolving version mismatch between server-side and client-side React components"
author: Admin
date: 10/22/2023
---

The error in the [previous version](/blog/preact_and_encrypted_props) has been
resolved. The root cause is the react version on both server side and client
side different.

This happens when we call react from `esm.sh` directly:

```bash
https://esm.sh/react@18.2.0
https://esm.sh/react-dom@18.2.0
```

If you want consistent versioning, you should call `esm.sh` with prefix `v133`:

```bash
https://esm.sh/v133/react@18.2.0
https://esm.sh/v133/react-dom@18.2.0
```

This helps ensure the stability and reliability of your application.
