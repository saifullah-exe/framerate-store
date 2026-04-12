async function test() {
  const params = new URLSearchParams();
  params.append('email', 'test@example.com');
  params.append('password', 'password');
  
  const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
  console.log(response.status);
  console.log(await response.text());
}
test();
