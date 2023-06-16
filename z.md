```ts
it('throws an error if user signs up with email that is in use', async () => {
  fakeUsersService.find = () =>
    Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
  await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
    BadRequestException,
  );
});
```
