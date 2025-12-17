import { socialBufferApi } from '@/api/socialBuffer';

describe('SocialBuffer API', () => {
  it('should have getPosts method', () => {
    expect(socialBufferApi.getPosts).toBeDefined();
  });

  it('should have createPost method', () => {
    expect(socialBufferApi.createPost).toBeDefined();
  });

  it('should have schedulePost method', () => {
    expect(socialBufferApi.schedulePost).toBeDefined();
  });

  it('should have deletePost method', () => {
    expect(socialBufferApi.deletePost).toBeDefined();
  });
});
