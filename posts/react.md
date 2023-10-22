---
title: "Fastro v0.82.0: Back to using React"
image: https://fastro.dev/static/image.png
description: "The error in the previous version has been resolved"
author: Fastro
date: Oct 22nd, 2023
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
