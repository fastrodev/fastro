import { FASTRO_VERSION } from "../core/constant.ts";

export const html = `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Congratulation</title>

  <style media="screen">
    body {
      background: #efffea;
      color: rgba(0, 0, 0, 0.87);
      font-family: Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
    }

    #message {
      background: white;
      max-width: 360px;
      margin: 100px auto 16px;
      padding: 32px 24px;
      border-radius: 3px;
    }

    #message h2 {
      color: #1e7304;
      font-weight: bold;
      font-size: 16px;
      margin: 0 0 8px;
    }

    #message h1 {
      font-size: 22px;
      font-weight: 300;
      color: rgba(0, 0, 0, 0.6);
      margin: 0 0 16px;
    }

    #message p {
      line-height: 140%;
      margin: 16px 0 24px;
      font-size: 15px;
    }

    #message a {
      display: block;
      text-align: center;
      background: #1e7304;
      text-transform: uppercase;
      text-decoration: none;
      color: white;
      padding: 16px;
      border-radius: 4px;
    }

    #message,
    #message a {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }

    #load {
      color: rgba(0, 0, 0, 0.4);
      text-align: center;
      font-size: 13px;
    }

    @media (max-width: 600px) {

      body,
      #message {
        margin-top: 0;
        background: white;
        box-shadow: none;
      }

      body {
        border-top: 16px solid #1e7304;
      }
    }
  </style>
</head>

<body>
  <div id="message">
    <h2>Congratulation</h2>
    <h1><b>Your webapp setup complete</b></h1>
    <p>You're seeing this because you've successfully setup fastro webapp v${FASTRO_VERSION}. Now it's time to go build something awesome!
    </p>
    <a target="_blank" href="https://fastro.app/manual">Open documentation</a>
  </div>
</body>

</html>
`;
