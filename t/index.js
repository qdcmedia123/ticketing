process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');

const cookie =
  'express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall3TURBeE5tSXdOMlU1Wm1ZM01EQXhPRFpoWVRka09TSXNJbVZ0WVdsc0lqb2lZbWhoY21GMGNtOXpaVEZBWjIxaGFXd3VZMjl0SWl3aWFXRjBJam94TmpFd05qRTROVFUyZlEuY1czNjdmamZZY19RRzNvNERSSm9vbTFieElydmk4aWF3U3dlamhuZnEybyJ9';

const doRequest = async () => {
  const { data } = await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: 'ticket', price: 5 },
    {
      headers: { cookie },
    }
  );

  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 10 },
    {
      headers: { cookie },
    }
  );

  axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 15 },
    {
      headers: { cookie },
    }
  );

  console.log('Request complete');
};

(async () => {
  for (let i = 0; i < 400; i++) {
    doRequest();
  }
})();
