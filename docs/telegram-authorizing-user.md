# Authorizing User (Telegram Mini Apps Docs Snapshot)

Source: https://docs.telegram-mini-apps.com/platform/authorizing-user  
Fetched: 2025-11-17  
Note: Ellipses (...) indicate truncated sections from the fetch_webpage tool output.

---

## Overview
This article provides code examples showing how to authorize a Telegram Mini App user using Telegram init data.

Sections:
- Client
- Server (Node.js, Go)
- Additional Links

---

## Client
Initial step: transmit raw init data from client to server via HTTP request. Example using `@telegram-apps/sdk`:

```typescript
import { retrieveRawInitData } from '@telegram-apps/sdk'

const initDataRaw = retrieveRawInitData()

fetch('https://example.com/api', {
  method: 'POST',
  headers: {
    Authorization: `tma ${initDataRaw}`
  },
})
```

Authorization header format: `<auth-type> <auth-data>` where `auth-type` = `tma` and `<auth-data>` is raw init data string.

---

## Server
Create an HTTP server that consumes and validates init data, authorizing the user. Examples for Node.js and Go (gin).

### Node.js Example (Express)
Uses packages:
- `@telegram-apps/init-data-node` for validation & parsing.
- `express` for HTTP server.

```typescript
import { validate, parse, type InitData } from '@telegram-apps/init-data-node';
import express, { type ErrorRequestHandler, type RequestHandler, type Response } from 'express';

function setInitData(res: Response, initData: InitData): void {
  res.locals.initData = initData;
}

function getInitData(res: Response): InitData | undefined {
  return res.locals.initData;
}

const authMiddleware: RequestHandler = (req, res, next) => {
  const [authType, authData = ''] = (req.header('authorization') || '').split(' ');
  switch (authType) {
    case 'tma':
      try {
        validate(authData, token, { expiresIn: 3600 }); // 1 hour expiry
        setInitData(res, parse(authData));
        return next();
      } catch (e) {
        return next(e);
      }
    default:
      return next(new Error('Unauthorized'));
  }
};

const showInitDataMiddleware: RequestHandler = (_req, res, next) => {
  const initData = getInitData(res);
  if (!initData) {
    return next(new Error('Cant display init data as long as it was not found'));
  }
  res.json(initData);
};

const defaultErrorMiddleware: ErrorRequestHandler = (err, _req, res) => {
  res.status(500).json({ error: err.message });
};

const token = '1234567890:ABC';
const app = express();
app.use(authMiddleware);
app.get('/', showInitDataMiddleware);
app.use(defaultErrorMiddleware);
app.listen(3000);
// Send GET http://localhost:3000/ with Authorization header to test.
```

Key points:
- Validate signature & expiry (`expiresIn: 3600`).
- Parse init data and store in response local state for later usage.
- Centralized error handling middleware.

### Go Example (Gin)
Uses `github.com/telegram-mini-apps/init-data-golang`.

```go
package main

import (
	"context"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	initdata "github.com/telegram-mini-apps/init-data-golang"
)

type contextKey string
const (_initDataKey contextKey = "init-data")

func withInitData(ctx context.Context, initData initdata.InitData) context.Context {
	return context.WithValue(ctx, _initDataKey, initData)
}

func ctxInitData(ctx context.Context) (initdata.InitData, bool) {
	initData, ok := ctx.Value(_initDataKey).(initdata.InitData)
	return initData, ok
}

func authMiddleware(token string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authParts := strings.Split(c.GetHeader("authorization"), " ")
		if len(authParts) != 2 {
			c.AbortWithStatusJSON(401, gin.H{"message": "Unauthorized"}); return
		}
		authType := authParts[0]
		authData := authParts[1]
		switch authType {
		case "tma":
			if err := initdata.Validate(authData, token, time.Hour); err != nil {
				c.AbortWithStatusJSON(401, gin.H{"message": err.Error()}); return
			}
			initData, err := initdata.Parse(authData)
			if err != nil {
				c.AbortWithStatusJSON(500, gin.H{"message": err.Error()}); return
			}
			c.Request = c.Request.WithContext(withInitData(c.Request.Context(), initData))
		}
	}
}

func showInitDataMiddleware(c *gin.Context) {
	initData, ok := ctxInitData(c.Request.Context())
	if !ok {
		c.AbortWithStatusJSON(401, gin.H{"message": "Init data not found"}); return
	}
	c.JSON(200, initData)
}

func main() {
	token := "1234567890:ABC"
	r := gin.New()
	r.Use(authMiddleware(token))
	r.GET("/", showInitDataMiddleware)
	if err := r.Run(":3000"); err != nil { panic(err) }
}
```

Key points:
- Authorization header parsing & validation.
- 1 hour validity window.
- Parsing init data into request context for downstream handlers.

---

## Authorization Flow Summary
1. Client retrieves raw init data via `retrieveRawInitData()`.
2. Sends request with `Authorization: tma <raw-init-data>`.
3. Server validates signature + expiry (`expiresIn` strategy or time window).
4. Server parses init data to structured object.
5. Subsequent handlers use parsed data for business logic / identifying user.

---

## Security Considerations
- Always validate init data signature before trusting any field.
- Enforce expiration (`expiresIn` or timestamp checks) to prevent replay attacks.
- Keep bot token secret; do not log raw init data.
- Prefer HTTPS in production, even though test environment may allow HTTP.

---

## Additional Links (Selected)
- Init Data: https://docs.telegram-mini-apps.com/platform/init-data
- Launch Parameters: https://docs.telegram-mini-apps.com/platform/launch-parameters
- Start Parameter: https://docs.telegram-mini-apps.com/platform/start-parameter
- Creating New App: https://docs.telegram-mini-apps.com/platform/creating-new-app
- Events: https://docs.telegram-mini-apps.com/platform/events
- Methods: https://docs.telegram-mini-apps.com/platform/methods
- Test Environment: https://docs.telegram-mini-apps.com/platform/test-environment
- Debugging: https://docs.telegram-mini-apps.com/platform/debugging

(For full navigation list, refer to source page.)

---

## Metadata
Last updated (source): 2025-10-18 22:59 (per page footer).
Edit on GitHub: https://github.com/telegram-mini-apps/tma.js/blob/master/apps/docs/platform/authorizing-user.md

---

## Quick Start Checklist
- Install SDK: `npm i @telegram-apps/sdk @telegram-apps/init-data-node` (Node) or `go get github.com/telegram-mini-apps/init-data-golang` (Go).
- Capture raw init data on load.
- POST to server with `Authorization` header.
- Validate & parse.
- Persist session / map user to internal account.

---

End of snapshot.
