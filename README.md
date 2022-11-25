# Midtrans Sandbox
this package will help you simulate payment in midtrans sandbox api.

```javascript
const sandbox = require('midtrans-sandbox');

const inquiry = await sandbox.bni.inquiry('va_number') // replace with your va number

const result = await sandbox.bni.payment('va_number', 1000) // replace with your va number and total amount

```